"""
LiveKit Voice Agent with STT, TTS, and LLM
Uses OpenAI Whisper (STT), GPT-4o-mini (LLM), and TTS-1 (TTS)
Powered by Emergent LLM Key
"""
import os
import logging
from pathlib import Path
from dotenv import load_dotenv

from livekit import agents, rtc
from livekit.agents import JobContext, WorkerOptions, cli
from livekit.plugins import openai

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Agent personalities
AGENT_PERSONALITIES = {
    'maya': {
        'name': 'Maya',
        'voice': os.getenv('TTS_VOICE_MAYA', 'nova'),
        'system_prompt': '''You are Maya, a warm and empathetic AI voice assistant.
        
        Your personality:
        - You are friendly, caring, and supportive
        - You listen carefully and respond thoughtfully
        - You show genuine interest in people
        - You ask follow-up questions to show you care
        
        Your speaking style:
        - Keep responses brief (1-3 sentences usually)
        - Use a warm, conversational tone
        - Be encouraging and positive
        - Avoid being overly formal
        
        Remember: You're having a natural voice conversation, so keep things concise and natural.'''
    },
    'miles': {
        'name': 'Miles',
        'voice': os.getenv('TTS_VOICE_MILES', 'onyx'),
        'system_prompt': '''You are Miles, a laid-back and witty AI voice assistant.
        
        Your personality:
        - You're casual, relaxed, and straightforward
        - You tell it like it is with a touch of humor
        - You're honest and don't beat around the bush
        - You keep things real and down-to-earth
        
        Your speaking style:
        - Keep responses brief (1-3 sentences usually)
        - Use a casual, friendly tone
        - Occasionally add light humor
        - Be direct and clear
        
        Remember: You're having a natural voice conversation, so keep things concise and conversational.'''
    }
}


async def entrypoint(ctx: JobContext):
    """Main entrypoint for the voice agent"""
    
    # Determine which agent to use based on room name
    agent_id = 'maya'  # default
    if 'miles' in ctx.room.name.lower():
        agent_id = 'miles'
    
    personality = AGENT_PERSONALITIES[agent_id]
    logger.info(f"Starting voice agent: {personality['name']} for room {ctx.room.name}")
    
    # Initialize LiveKit components with OpenAI plugins
    initial_ctx = agents.llm.ChatContext()
    initial_ctx.append(
        role="system",
        text=personality['system_prompt']
    )
    
    # Connect to the room
    await ctx.connect()
    logger.info(f"Connected to room as {personality['name']}")
    
    # Create the voice assistant with STT, LLM, and TTS
    assistant = agents.VoiceAssistant(
        vad=agents.silero.VAD.load(),  # Voice Activity Detection
        stt=openai.STT(                # Speech-to-Text (Whisper)
            model=os.getenv('STT_MODEL', 'whisper-1'),
        ),
        llm=openai.LLM(                # Language Model (GPT)
            model=os.getenv('LLM_MODEL', 'gpt-4o-mini'),
            temperature=float(os.getenv('LLM_TEMPERATURE', '0.8')),
        ),
        tts=openai.TTS(                # Text-to-Speech
            model=os.getenv('TTS_MODEL', 'tts-1'),
            voice=personality['voice'],
            speed=float(os.getenv('TTS_SPEED', '1.0')),
        ),
        chat_ctx=initial_ctx,
    )
    
    # Start the assistant
    assistant.start(ctx.room)
    
    # Send initial greeting
    greeting = f"Hi! I'm {personality['name']}. How can I help you today?"
    await assistant.say(greeting)
    logger.info(f"Sent greeting: {greeting}")
    
    # Keep running
    await assistant.aclose()


if __name__ == "__main__":
    # Run the agent
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            agent_name="voice-assistant",
        )
    )
