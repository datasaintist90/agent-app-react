"""
LiveKit Voice Agent with Emergent LLM Key
Automatically joins rooms and responds with AI voice
"""
import asyncio
import os
import logging
from pathlib import Path
from dotenv import load_dotenv
from livekit import agents, rtc
from livekit.agents import JobContext, WorkerOptions, cli
from openai import AsyncOpenAI

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI with Emergent LLM key
client = AsyncOpenAI(
    api_key=os.environ.get('EMERGENT_LLM_KEY', 'sk-emergent-aAfCcD781A5400e38A')
)

# Agent personality based on avatar
AGENT_PERSONALITIES = {
    'maya': {
        'name': 'Maya',
        'instructions': '''You are Maya, a warm and empathetic voice assistant. 
        You listen carefully and respond thoughtfully. Your responses should be:
        - Friendly and caring
        - Brief (1-2 sentences usually)
        - Natural conversational style
        - Ask follow-up questions to show interest
        Always be supportive and encouraging in your tone.'''
    },
    'miles': {
        'name': 'Miles', 
        'instructions': '''You are Miles, a laid-back and witty voice assistant.
        You tell it like it is with a touch of humor. Your responses should be:
        - Casual and relaxed
        - Brief (1-2 sentences usually)
        - Occasionally use light humor
        - Be direct and honest
        Keep it real and don't overthink things.'''
    }
}

class VoiceAgent:
    def __init__(self, agent_id='maya'):
        self.agent_id = agent_id
        self.personality = AGENT_PERSONALITIES.get(agent_id, AGENT_PERSONALITIES['maya'])
        self.conversation_history = []
        
    async def generate_response(self, user_message: str) -> str:
        """Generate AI response using OpenAI with Emergent LLM key"""
        try:
            # Add user message to history
            self.conversation_history.append({
                "role": "user",
                "content": user_message
            })
            
            # Keep only last 10 messages for context
            if len(self.conversation_history) > 10:
                self.conversation_history = self.conversation_history[-10:]
            
            # Generate response
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": self.personality['instructions']},
                    *self.conversation_history
                ],
                max_tokens=150,
                temperature=0.8
            )
            
            assistant_message = response.choices[0].message.content
            
            # Add assistant response to history
            self.conversation_history.append({
                "role": "assistant",
                "content": assistant_message
            })
            
            return assistant_message
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return "I'm sorry, I'm having trouble responding right now."
    
    async def text_to_speech(self, text: str) -> bytes:
        """Convert text to speech using OpenAI TTS"""
        try:
            response = await client.audio.speech.create(
                model="tts-1",
                voice="nova" if self.agent_id == "maya" else "onyx",
                input=text,
                speed=1.0
            )
            
            return response.content
            
        except Exception as e:
            logger.error(f"Error in text-to-speech: {e}")
            return b""


async def entrypoint(ctx: JobContext):
    """Main entrypoint for the voice agent"""
    logger.info(f"Voice agent starting for room: {ctx.room.name}")
    
    # Determine which agent to use based on room name
    agent_id = 'maya'  # default
    if 'miles' in ctx.room.name.lower():
        agent_id = 'miles'
    
    # Create voice agent
    voice_agent = VoiceAgent(agent_id=agent_id)
    
    # Connect to the room
    await ctx.connect()
    logger.info(f"Connected to room as {voice_agent.personality['name']}")
    
    # Send initial greeting
    greeting = f"Hi! I'm {voice_agent.personality['name']}. How can I help you today?"
    await send_text_message(ctx.room, greeting)
    
    # Play greeting audio
    audio_data = await voice_agent.text_to_speech(greeting)
    if audio_data:
        await play_audio(ctx.room, audio_data)
    
    # Listen for participant messages and audio
    @ctx.room.on("track_subscribed")
    def on_track_subscribed(track: rtc.Track, publication: rtc.TrackPublication, participant: rtc.RemoteParticipant):
        if track.kind == rtc.TrackKind.KIND_AUDIO:
            logger.info(f"Subscribed to audio track from {participant.identity}")
            asyncio.create_task(process_audio_stream(track, voice_agent, ctx.room))
    
    @ctx.room.on("data_received")
    def on_data_received(data: bytes, participant: rtc.RemoteParticipant):
        try:
            message = data.decode('utf-8')
            logger.info(f"Received text message: {message}")
            asyncio.create_task(handle_text_message(message, voice_agent, ctx.room))
        except Exception as e:
            logger.error(f"Error processing data: {e}")
    
    # Keep the agent running
    logger.info(f"{voice_agent.personality['name']} is ready and listening...")


async def process_audio_stream(track: rtc.AudioTrack, voice_agent: VoiceAgent, room: rtc.Room):
    """Process incoming audio stream and respond"""
    logger.info("Processing audio stream...")
    
    # For now, we'll respond to audio presence with a simple acknowledgment
    # In production, you would use STT to transcribe the audio
    try:
        await asyncio.sleep(3)  # Wait for user to finish speaking
        
        response = await voice_agent.generate_response(
            "The user is speaking to me (audio detected)"
        )
        
        await send_text_message(room, response)
        audio_data = await voice_agent.text_to_speech(response)
        if audio_data:
            await play_audio(room, audio_data)
            
    except Exception as e:
        logger.error(f"Error processing audio: {e}")


async def handle_text_message(message: str, voice_agent: VoiceAgent, room: rtc.Room):
    """Handle incoming text messages"""
    try:
        response = await voice_agent.generate_response(message)
        await send_text_message(room, response)
        
        # Convert to speech and play
        audio_data = await voice_agent.text_to_speech(response)
        if audio_data:
            await play_audio(room, audio_data)
            
    except Exception as e:
        logger.error(f"Error handling message: {e}")


async def send_text_message(room: rtc.Room, message: str):
    """Send text message to room"""
    try:
        await room.local_participant.publish_data(
            message.encode('utf-8'),
            reliable=True
        )
        logger.info(f"Sent message: {message}")
    except Exception as e:
        logger.error(f"Error sending message: {e}")


async def play_audio(room: rtc.Room, audio_data: bytes):
    """Play audio in the room"""
    try:
        # For now, just log that we would play audio
        # In production, you would use LiveKit's audio track to stream this
        logger.info(f"Playing audio response ({len(audio_data)} bytes)")
        
        # TODO: Implement actual audio playback through LiveKit audio track
        # This requires creating an audio source and publishing it
        
    except Exception as e:
        logger.error(f"Error playing audio: {e}")


if __name__ == "__main__":
    # Run the agent
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            agent_name="voice-assistant"
        )
    )
