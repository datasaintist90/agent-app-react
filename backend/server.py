from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
from livekit import api
import time


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# LiveKit configuration
LIVEKIT_URL = os.environ.get('LIVEKIT_URL')
LIVEKIT_API_KEY = os.environ.get('LIVEKIT_API_KEY')
LIVEKIT_API_SECRET = os.environ.get('LIVEKIT_API_SECRET')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class TokenRequest(BaseModel):
    user_id: str
    room_name: str
    agent_id: str

class TokenResponse(BaseModel):
    token: str
    url: str
    room_name: str

class ConversationSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    agent_id: str
    room_name: str
    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: Optional[datetime] = None
    duration: Optional[int] = None
    messages: List[dict] = []
    metadata: dict = {}

class SessionCreate(BaseModel):
    user_id: str
    agent_id: str
    metadata: Optional[dict] = {}

class MessageAdd(BaseModel):
    sender: str
    content: str
    type: str = "voice"
    duration: Optional[int] = None

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "LiveKit Voice Agent API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.post("/livekit/token", response_model=TokenResponse)
async def generate_livekit_token(request: TokenRequest):
    """Generate a LiveKit access token for a user to join a room"""
    try:
        # Create access token
        token = api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
        token.with_identity(request.user_id)
        token.with_name(request.user_id)
        token.with_grants(api.VideoGrants(
            room_join=True,
            room=request.room_name,
            can_publish=True,
            can_subscribe=True,
            can_publish_data=True
        ))
        
        # Token valid for 2 hours
        token.with_ttl(timedelta(hours=2))
        
        jwt_token = token.to_jwt()
        
        return TokenResponse(
            token=jwt_token,
            url=LIVEKIT_URL,
            room_name=request.room_name
        )
    except Exception as e:
        logging.error(f"Error generating token: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate token: {str(e)}")

@api_router.post("/sessions")
async def create_session(request: SessionCreate):
    """Create a new conversation session"""
    try:
        room_name = f"room-{uuid.uuid4()}"
        session = ConversationSession(
            user_id=request.user_id,
            agent_id=request.agent_id,
            room_name=room_name,
            metadata=request.metadata
        )
        
        await db.sessions.insert_one(session.dict())
        
        return {
            "session_id": session.id,
            "room_name": room_name,
            "success": True
        }
    except Exception as e:
        logging.error(f"Error creating session: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create session: {str(e)}")

@api_router.post("/sessions/{session_id}/messages")
async def add_message(session_id: str, message: MessageAdd):
    """Add a message to a session"""
    try:
        message_data = {
            "timestamp": datetime.utcnow(),
            "sender": message.sender,
            "content": message.content,
            "type": message.type,
            "duration": message.duration
        }
        
        result = await db.sessions.update_one(
            {"id": session_id},
            {"$push": {"messages": message_data}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Session not found")
        
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error adding message: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to add message: {str(e)}")

@api_router.post("/sessions/{session_id}/end")
async def end_session(session_id: str):
    """End a conversation session"""
    try:
        session = await db.sessions.find_one({"id": session_id})
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        end_time = datetime.utcnow()
        start_time = session.get("start_time")
        duration = int((end_time - start_time).total_seconds()) if start_time else 0
        
        await db.sessions.update_one(
            {"id": session_id},
            {
                "$set": {
                    "end_time": end_time,
                    "duration": duration
                }
            }
        )
        
        return {"success": True, "duration": duration}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error ending session: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to end session: {str(e)}")

@api_router.get("/sessions/{session_id}")
async def get_session(session_id: str):
    """Get session details"""
    try:
        session = await db.sessions.find_one({"id": session_id})
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Convert MongoDB _id to string if present
        if "_id" in session:
            session["_id"] = str(session["_id"])
        
        return session
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error getting session: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get session: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
