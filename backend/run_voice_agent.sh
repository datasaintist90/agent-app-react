#!/bin/bash

# Voice Agent Test Script
echo "🎤 Starting LiveKit Voice Agent..."
echo ""
echo "Configuration:"
echo "  LiveKit URL: wss://test-2zavyzxr.livekit.cloud"
echo "  Using Emergent LLM Key for OpenAI"
echo "  Agents: Maya (female) & Miles (male)"
echo ""

cd /app/backend

# Run the voice agent in development mode
python3 voice_agent.py dev
