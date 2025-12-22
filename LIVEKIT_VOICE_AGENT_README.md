# LiveKit Voice Agent Mobile App

A beautiful React Native mobile app built with Expo that connects to LiveKit for voice agent conversations. Features animated avatars (male and female) with voice-reactive animations and an always-on listening mode.

## ✨ Features

- 🎤 **LiveKit Voice Integration** - Real-time voice communication with AI agents
- 👥 **Dual Avatars** - Choose between Maya (female) or Miles (male) voice agents
- 🎨 **Beautiful UI** - Dark gradient design with smooth animations
- 📱 **Phone Call Interface** - Always-on listening mode like a real phone call
- 🔊 **Voice-Reactive Animations** - Avatars respond visually to speech
- 💾 **Session Management** - All conversations stored in MongoDB
- 📊 **Audio Level Indicators** - Real-time visualization of voice activity

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and Yarn
- Expo CLI
- MongoDB
- LiveKit account with credentials

### Installation

1. **Backend Setup**
```bash
cd /app/backend
pip install -r requirements.txt

# Update .env with your LiveKit credentials
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
```

2. **Frontend Setup**
```bash
cd /app/frontend
yarn install
```

3. **Start Services**
```bash
# Start backend
sudo supervisorctl restart backend

# Start frontend
sudo supervisorctl restart expo
```

## 📱 App Structure

### Screens

1. **Home Screen** (`app/index.tsx`)
   - Avatar selection dropdown (Maya/Miles)
   - Large "Start a call" button with phone icon
   - Gradient background (brown → blue)
   - "Send a text" option at bottom

2. **Call Screen** (`app/call.tsx`)
   - Agent name and status display
   - Call duration timer
   - Animated avatar with voice visualization
   - Control buttons (Mic, End Call, Speaker)
   - Always-on listening mode

### Components

- **AvatarSelectionModal** - Bottom sheet for choosing avatars
- **LiveKitRoom** - Handles LiveKit connection and audio streaming
- **AnimatedAvatar** - Voice-reactive avatar with pulse animations

## 🔧 Configuration

### App Configuration

The app is configured in `app.json` with:
- Microphone permissions for iOS/Android
- Background audio mode for iOS
- Expo AV plugin for audio handling

### LiveKit Configuration

**Backend** (`server.py`):
- Token generation endpoint: `/api/livekit/token`
- Session management endpoints
- MongoDB integration for conversation storage

**Frontend** (`LiveKitRoom.tsx`):
- WebRTC audio capture settings
- Echo cancellation and noise suppression
- Real-time audio level monitoring

## 🎯 Usage

### Starting a Call

1. Launch the app
2. Select your preferred agent (Maya or Miles) by tapping the dropdown
3. Tap "Start a call"
4. Grant microphone permission when prompted
5. The app will connect to LiveKit and you can start talking
6. The avatar will animate when the agent speaks
7. Tap the red "End Call" button to disconnect

### Avatar Details

**Maya** - Female Avatar
- Description: "A warm, empathetic conversationalist who listens carefully and responds thoughtfully."
- Icon: Female symbol

**Miles** - Male Avatar
- Description: "A laid-back, witty conversationalist who tells it like it is."
- Icon: Male symbol

## 🔌 API Endpoints

### LiveKit Token Generation
```
POST /api/livekit/token
{
  "user_id": "string",
  "room_name": "string",
  "agent_id": "string"
}

Response:
{
  "token": "jwt_token_string",
  "url": "wss://livekit-server-url",
  "room_name": "room_name"
}
```

### Session Management
```
POST /api/sessions
{
  "user_id": "string",
  "agent_id": "string",
  "metadata": {}
}

POST /api/sessions/{session_id}/messages
{
  "sender": "user|agent",
  "content": "string",
  "type": "voice",
  "duration": 0
}

POST /api/sessions/{session_id}/end
```

## 🎨 Design System

### Colors
- **Primary Gradient**: `#6B4423` → `#3A506B` → `#1C2541`
- **Accent Green**: `#6B8E23` (call button)
- **Active Green**: `#4CAF50` (mic on)
- **Alert Red**: `#f44336` (end call)
- **Agent Blue**: `#2196F3` (speaking indicator)

### Typography
- **Headers**: Bold, 24-32px
- **Body**: Regular, 14-18px
- **Status**: 12-14px, colored by state

## 🔐 Security

- LiveKit tokens generated server-side only
- Tokens expire after 2 hours
- All credentials stored in environment variables
- MongoDB sessions track all conversations
- No hardcoded credentials in client code

## 📊 Architecture

```
┌─────────────┐
│ React Native│
│   (Expo)    │
└──────┬──────┘
       │
       ├──────────┐
       │          │
┌──────▼─────┐ ┌─▼───────────┐
│  LiveKit   │ │   FastAPI   │
│   Client   │ │   Backend   │
└──────┬─────┘ └──────┬──────┘
       │              │
       │         ┌────▼────┐
       │         │ MongoDB │
       │         └─────────┘
       │
┌──────▼───────┐
│   LiveKit    │
│    Server    │
└──────────────┘
```

## 🐛 Troubleshooting

### Microphone not working
- Ensure microphone permissions are granted
- Check browser console for permission errors
- On iOS, verify `NSMicrophoneUsageDescription` in Info.plist

### Connection fails
- Verify LiveKit credentials in backend `.env`
- Check network connectivity
- Ensure LiveKit server URL is accessible

### Avatar not animating
- Check that audio tracks are being received
- Verify `useNativeDriver` warnings (expected on web)
- Test on physical device for best results

## 📦 Dependencies

### Frontend
- `@livekit/react-native` - LiveKit SDK
- `livekit-client` - WebRTC client
- `expo-av` - Audio/video support
- `expo-linear-gradient` - Gradient backgrounds
- `@gorhom/bottom-sheet` - Modal bottom sheets

### Backend
- `livekit-api` - LiveKit Python SDK
- `fastapi` - API framework
- `motor` - Async MongoDB driver
- `PyJWT` - Token generation

## 🚀 Deployment

### Mobile Deployment
1. Build with EAS: `eas build --platform ios/android`
2. Submit to stores: `eas submit`

### Backend Deployment
1. Deploy to cloud service (AWS, GCP, Azure)
2. Set environment variables
3. Configure MongoDB connection
4. Enable HTTPS

## 📝 Future Enhancements

- [ ] Add more avatar personalities
- [ ] Implement conversation history playback
- [ ] Add real-time transcription display
- [ ] Support multiple languages
- [ ] Add voice settings customization
- [ ] Implement push-to-talk mode option
- [ ] Add conversation summaries
- [ ] Support group calls with multiple agents

## 🤝 Contributing

This app is built as a demonstration of LiveKit voice agent integration. Feel free to extend and customize for your needs!

## 📄 License

MIT

## 🙏 Acknowledgments

- LiveKit for real-time communication infrastructure
- Expo for cross-platform mobile development
- React Navigation for routing

---

**Built with ❤️ using Expo, React Native, and LiveKit**
