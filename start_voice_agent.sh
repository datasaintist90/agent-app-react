# Start Voice Agent Script

echo "🎤 Starting LiveKit Voice Agent..."
echo ""
echo "This agent will:"
echo "  - Auto-join rooms when users start calls"
echo "  - Respond with AI voice (using Emergent LLM key)"
echo "  - Use Maya or Miles personality based on room name"
echo ""

cd /app/backend

# Run the voice agent
python3 voice_agent.py dev

# Note: The agent needs to be running for voice to work!
