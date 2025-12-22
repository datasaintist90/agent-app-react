# 🚀 Native Build & Voice Agent Setup Complete!

## ✅ What I've Done

### 1. Installed expo-dev-client
- ✅ Added `expo-dev-client@6.0.20` to dependencies
- ✅ Updated `app.json` with expo-dev-client plugin
- ✅ Created `eas.json` configuration file
- ✅ Added proper iOS/Android permissions for microphone

### 2. EAS Build Configuration Created

File: `/app/frontend/eas.json`

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    }
  }
}
```

## 🎯 Next Steps: Build Your Native App

### Option A: Using EAS Build (Recommended - Cloud Build)

**Step 1: Install EAS CLI globally** (if not already installed)
```bash
npm install -g eas-cli
```

**Step 2: Login to Expo**
```bash
cd /app/frontend
eas login
# Enter your Expo account credentials
```

**Step 3: Configure your project**
```bash
eas build:configure
```

**Step 4: Build for Android**
```bash
# Build development client for Android
eas build --profile development --platform android

# This will:
# - Build in the cloud
# - Take ~10-15 minutes
# - Give you a .apk or .aab file
# - Send you a download link
```

**Step 5: Build for iOS** (requires Apple Developer account)
```bash
# Build development client for iOS
eas build --profile development --platform ios

# This will:
# - Build in the cloud
# - Take ~15-20 minutes
# - Give you an .ipa file
# - Can install on physical device or simulator
```

### Option B: Local Build (Faster for testing)

**For Android:**
```bash
cd /app/frontend
npx expo run:android
# Requires Android Studio and emulator/device connected
```

**For iOS:**
```bash
cd /app/frontend
npx expo run:ios
# Requires Xcode and iOS simulator/device
```

## 📱 Installing the Built App

### Android:
1. Download the `.apk` file from EAS build
2. Transfer to your Android device
3. Enable "Install from Unknown Sources"
4. Install the APK
5. Open the app - it's a native app now!

### iOS:
1. Download the `.ipa` file
2. Use TestFlight or direct installation
3. Trust the developer certificate
4. Open the app

## 🎤 Voice Agent Setup

### What's Ready:

✅ **Voice Agent Code**: `/app/backend/voice_agent.py`
- Uses Emergent LLM key for OpenAI
- Maya (female) and Miles (male) personalities
- Auto-joins LiveKit rooms
- Responds with AI voice (TTS)

✅ **Start Script**: `/app/start_voice_agent.sh`

### To Start Voice Agent:

```bash
# Method 1: Using the start script
chmod +x /app/start_voice_agent.sh
/app/start_voice_agent.sh

# Method 2: Direct command
cd /app/backend
python3 voice_agent.py dev
```

### What the Voice Agent Does:

1. **Monitors LiveKit** for new rooms
2. **Auto-joins** when user starts a call
3. **Greets user**: "Hi! I'm Maya/Miles. How can I help you today?"
4. **Listens** to user speech
5. **Generates response** using OpenAI GPT-4 (via Emergent LLM key)
6. **Speaks back** using OpenAI TTS (Nova voice for Maya, Onyx for Miles)

## 🔄 Complete Workflow

### Cloud Build Workflow (Recommended):

```bash
# 1. Login
cd /app/frontend
eas login

# 2. Build
eas build --profile development --platform android

# 3. Wait for build (check status)
eas build:list

# 4. Download & install APK on your phone

# 5. Start voice agent (in separate terminal)
cd /app/backend
python3 voice_agent.py dev

# 6. Open app on phone → Start call → Hear AI voice! 🎤
```

### Local Build Workflow:

```bash
# 1. Start voice agent first
cd /app/backend
python3 voice_agent.py dev

# 2. In another terminal, run the app
cd /app/frontend
npx expo run:android  # or run:ios

# 3. App opens automatically → Start call → Hear AI voice! 🎤
```

## 💡 Important Notes

### For Voice to Work:
- ✅ Voice agent MUST be running (`python3 voice_agent.py dev`)
- ✅ App must be native build (not Expo Go)
- ✅ Microphone permissions must be granted
- ✅ LiveKit credentials are configured (already done)
- ✅ Emergent LLM key is set (already done)

### Costs:
- **EAS Build**: Free tier allows limited builds
- **Emergent LLM Key**: Uses your Emergent balance
- **LiveKit**: Your account credentials

### Testing Flow:
1. Start voice agent on your computer
2. Open native app on your phone
3. Select Maya or Miles
4. Tap "Start a call"
5. Grant microphone permission
6. Hear: "Hi! I'm Maya. How can I help you today?"
7. Speak naturally
8. Agent responds with AI voice!

## 📊 Build Status Tracking

After running `eas build`, track progress:

```bash
# View all builds
eas build:list

# View specific build
eas build:view <build-id>

# Cancel a build
eas build:cancel <build-id>
```

## 🐛 Troubleshooting

### Build Fails:
- Check `eas.json` configuration
- Verify bundle identifier is unique
- Check build logs: `eas build:view`

### Voice Agent Not Joining:
- Check agent is running: `ps aux | grep voice_agent`
- View agent logs
- Verify LiveKit credentials in `.env`

### No Audio on Device:
- Grant microphone permission
- Check device volume
- Ensure voice agent is running
- Check LiveKit server status

## 🎉 You're Ready!

**Everything is configured:**
- ✅ expo-dev-client installed
- ✅ EAS build configuration created
- ✅ App.json updated with permissions
- ✅ Voice agent code ready
- ✅ Emergent LLM key configured
- ✅ LiveKit credentials set

**Next action**: Run `eas build --profile development --platform android` to build your native app!

🚀 **Your voice agent app is ready for native deployment!**
