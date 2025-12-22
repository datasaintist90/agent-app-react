# 🎙️ LiveKit Voice Agent Setup Guide

## What Is This?

I've created a LiveKit voice agent that uses the **Emergent LLM Key** to power AI conversations with OpenAI GPT-4. The agent automatically joins rooms when users start calls and responds with intelligent, personality-driven conversations!

## 🌟 Features

- **Dual Personalities**: Maya (warm & empathetic) and Miles (laid-back & witty)
- **Auto-Join Rooms**: Agent automatically connects when users start calls
- **AI-Powered Responses**: Uses OpenAI GPT-4o-mini via Emergent LLM key
- **Text-to-Speech**: Converts AI responses to natural voice (Nova for Maya, Onyx for Miles)
- **Conversation Memory**: Maintains context for natural dialogue
- **Real-time Communication**: Built on LiveKit's WebRTC infrastructure

## 📋 Prerequisites

The agent is already set up with:
- ✅ LiveKit Agents SDK installed
- ✅ OpenAI library installed  
- ✅ Emergent LLM Key configured
- ✅ Your LiveKit credentials loaded

## 🚀 Quick Start

### Option 1: Manual Testing (Recommended First)

Test the voice agent to see it in action:

```bash
# Make script executable
chmod +x /app/backend/run_voice_agent.sh

# Run the agent
/app/backend/run_voice_agent.sh
```

The agent will:
1. Connect to your LiveKit server
2. Wait for rooms to be created
3. Auto-join when users start calls
4. Respond with AI voice

### Option 2: Run as Background Service

For production use, run the agent as a background service:

```bash
# Navigate to backend
cd /app/backend

# Run in background
nohup python3 voice_agent.py start > voice_agent.log 2>&1 &

# Check if running
ps aux | grep voice_agent

# View logs
tail -f voice_agent.log
```

## 📱 How It Works

### User Flow:
1. User opens your app and selects Maya or Miles
2. User taps "Start a call"
3. App creates a LiveKit room and gets a token
4. **Voice agent automatically joins the room**
5. Agent greets user: "Hi! I'm Maya. How can I help you today?"
6. User speaks → Agent listens → AI generates response → Agent speaks back

### Agent Personalities:

**Maya** (Female Voice - Nova):
- Warm and empathetic
- Listens carefully and responds thoughtfully
- Supportive and encouraging
- Perfect for supportive conversations

**Miles** (Male Voice - Onyx):
- Laid-back and witty
- Direct and honest with light humor
- Casual and relaxed
- Great for straightforward chats

## 🔧 Configuration

### Environment Variables (Already Set!)

```bash
# LiveKit Configuration
LIVEKIT_URL=wss://test-2zavyzxr.livekit.cloud
LIVEKIT_API_KEY=APIKxa83FUZVRdv
LIVEKIT_API_SECRET=1Lt7gGgQXYffkVuXnlv4F92wQovInCNtJeBI6SmbJKAB

# AI Configuration  
EMERGENT_LLM_KEY=sk-emergent-aAfCcD781A5400e38A
```

### Agent Configuration

Edit `/app/backend/voice_agent.py` to customize:

```python
AGENT_PERSONALITIES = {
    'maya': {
        'name': 'Maya',
        'instructions': '...',  # Customize personality here
    },
    'miles': {
        'name': 'Miles',  
        'instructions': '...',  # Customize personality here
    }
}
```

## 🎯 Testing the Agent

### Test Flow:

1. **Start the voice agent** (in one terminal):
```bash
cd /app/backend
python3 voice_agent.py dev
```

2. **Open your app** in browser or mobile:
```
https://voice-agent-connect-1.preview.emergentagent.com
```

3. **Start a call**:
   - Select Maya or Miles
   - Tap "Start a call"
   - Grant microphone permission

4. **Listen for greeting**:
   - Agent should auto-join within 2-3 seconds
   - You'll hear: "Hi! I'm [Maya/Miles]. How can I help you today?"

5. **Have a conversation**:
   - Speak naturally
   - Agent will respond with AI-generated voice
   - Conversation context is maintained

## 📊 Monitoring

### Check Agent Status:

```bash
# View agent logs in real-time
tail -f /app/backend/voice_agent.log

# Check for errors
grep ERROR /app/backend/voice_agent.log

# See what rooms agent joined
grep "Connected to room" /app/backend/voice_agent.log
```

### What to Look For:

```
✅ GOOD:
INFO:__main__:Voice agent starting for room: voice-agent-maya-1234567890
INFO:__main__:Connected to room as Maya
INFO:__main__:Sent message: Hi! I'm Maya. How can I help you today?

❌ BAD:
ERROR:__main__:Error generating response: ...
ERROR:__main__:Error in text-to-speech: ...
```

## 🐛 Troubleshooting

### Agent Not Joining Rooms

**Problem**: Agent doesn't auto-join when user starts call

**Solutions**:
1. Check agent is running: `ps aux | grep voice_agent`
2. Verify LiveKit credentials are correct
3. Check room naming matches expected pattern
4. View logs: `tail -f voice_agent.log`

### No Audio Response

**Problem**: Agent joins but doesn't speak

**Solutions**:
1. Check Emergent LLM key is valid
2. Verify OpenAI API is accessible
3. Check audio streaming implementation
4. View TTS errors in logs

### Agent Responds Slowly

**Problem**: Long delay between user speech and response

**Solutions**:
1. Use `gpt-4o-mini` instead of `gpt-4` (already configured)
2. Reduce `max_tokens` in response generation
3. Check network latency to OpenAI
4. Implement streaming responses

### Permission Denied

**Problem**: `PermissionError` when running agent

**Solution**:
```bash
chmod +x /app/backend/voice_agent.py
chmod +x /app/backend/run_voice_agent.sh
```

## 🔐 Security Notes

- ✅ Emergent LLM key is stored in `.env` (not committed to git)
- ✅ LiveKit credentials are environment variables
- ✅ Agent only joins rooms with valid tokens
- ⚠️ In production, add rate limiting
- ⚠️ Monitor API usage costs

## 📈 Scaling & Production

### For Production Deployment:

1. **Run Multiple Agents**:
```bash
# Run 3 agent instances for load balancing
for i in {1..3}; do
  python3 voice_agent.py start &
done
```

2. **Use Process Manager**:
```bash
# Add to supervisord
[program:voice-agent]
command=python3 /app/backend/voice_agent.py start
directory=/app/backend
autostart=true
autorestart=true
stderr_logfile=/var/log/voice-agent.err.log
stdout_logfile=/var/log/voice-agent.out.log
```

3. **Monitor Resources**:
```bash
# Check CPU/Memory usage
top -p $(pgrep -f voice_agent)

# Monitor API costs
# Check OpenAI dashboard for token usage
```

4. **Optimize Performance**:
   - Use connection pooling
   - Implement response caching for common questions
   - Add request queuing for high load
   - Use streaming audio for faster responses

## 🎨 Customization Ideas

### Add More Personalities:
```python
AGENT_PERSONALITIES['alex'] = {
    'name': 'Alex',
    'instructions': 'You are a professional business advisor...'
}
```

### Change Voices:
```python
# Available OpenAI voices: alloy, echo, fable, onyx, nova, shimmer
voice="shimmer"  # More energetic
voice="fable"    # British accent
```

### Adjust Response Style:
```python
# In generate_response()
temperature=0.7  # More focused
temperature=1.0  # More creative
max_tokens=100   # Shorter responses
max_tokens=200   # Longer responses
```

## 📚 Additional Resources

- **LiveKit Docs**: https://docs.livekit.io/agents/
- **OpenAI TTS**: https://platform.openai.com/docs/guides/text-to-speech
- **Voice Agent Code**: `/app/backend/voice_agent.py`
- **App Integration**: `/app/frontend/components/LiveKitRoom.tsx`

## 🎉 You're Ready!

Your voice agent is configured and ready to respond to user calls with AI-powered conversations!

**To activate:**
1. Run the agent: `python3 /app/backend/voice_agent.py dev`
2. Open your app and start a call
3. The agent will auto-join and greet you!

**Have fun chatting with Maya and Miles!** 🎤✨
