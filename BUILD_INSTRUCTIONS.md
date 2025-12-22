# 🚀 Building Your Native Voice Agent App

## Step-by-Step Guide to Build Native App with EAS

### Prerequisites Checklist

Before starting, make sure you have:
- [ ] Expo/EAS account (create free at expo.dev if needed)
- [ ] Internet connection
- [ ] Terminal/command line access
- [ ] Android device or iOS device to test

### Step 1: Install EAS CLI (One-time setup)

Open your terminal and run:

```bash
npm install -g eas-cli
```

**Verification:** Run `eas --version` - you should see a version number.

---

### Step 2: Navigate to Project

```bash
cd /app/frontend
```

---

### Step 3: Login to Expo

```bash
eas login
```

**You'll be prompted for:**
- Username or email
- Password

**OR create account:**
```bash
eas register
```

---

### Step 4: Configure Project (First time only)

```bash
eas build:configure
```

**This will:**
- Create/update `eas.json` (already done)
- Link project to your Expo account
- Generate bundle identifiers if needed

**Answer prompts:**
- Use existing configuration? → **Yes**
- Generate new Android keystore? → **Yes**
- Generate new iOS credentials? → **Yes** (if building for iOS)

---

### Step 5: Build Android APK

```bash
eas build --profile development --platform android
```

**What happens:**
1. ✅ Uploads your code to EAS servers
2. ✅ Installs all dependencies
3. ✅ Compiles native Android code
4. ✅ Builds development APK
5. ✅ Takes about **10-15 minutes**

**Expected output:**
```
✔ Build completed!
Build ID: abc123-def456-ghi789
Download URL: https://expo.dev/artifacts/...
```

---

### Step 6: Track Build Progress

While building, you can:

**Check build status:**
```bash
eas build:list
```

**View specific build:**
```bash
eas build:view [BUILD_ID]
```

**Watch in browser:**
Go to: https://expo.dev/accounts/[your-username]/projects/voiceagent/builds

---

### Step 7: Download & Install

**When build completes:**

1. **Download APK** from the URL provided
2. **Transfer to Android device** (email, USB, direct download)
3. **Enable "Install from Unknown Sources"** in Android settings
4. **Install the APK**
5. **Open the app** - it's now a native app!

---

### Step 8: Start Voice Agent Backend

On your computer, start the voice agent:

```bash
cd /app/backend
python3 voice_agent.py dev
```

**OR use the helper script:**
```bash
/app/start_voice_agent.sh
```

**You should see:**
```
🎤 Starting LiveKit Voice Agent...
Waiting for rooms to join...
```

**Keep this terminal open!**

---

### Step 9: Test Voice Functionality

**On your phone:**

1. Open the VoiceAgent app
2. Grant microphone permission when prompted
3. Select Maya or Miles
4. Tap "Start a call"
5. Wait 2-3 seconds
6. **You should hear:** "Hi! I'm Maya. How can I help you today?"
7. **Start talking!** The agent will respond

---

## 📱 For iOS Build (Optional)

**Requirements:**
- Apple Developer account ($99/year)
- Mac computer (for local builds)

**Build command:**
```bash
eas build --profile development --platform ios
```

**Note:** iOS builds take 15-20 minutes and require Apple Developer credentials.

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Project not configured"**
```bash
eas build:configure
```

**Error: "Invalid credentials"**
```bash
eas logout
eas login
```

**Error: "Bundle identifier in use"**
- Change `bundleIdentifier` in `app.json` to something unique
- Example: `com.yourname.voiceagent`

### Voice Agent Not Responding

**Check if agent is running:**
```bash
ps aux | grep voice_agent
```

**Check agent logs:**
```bash
tail -f /tmp/voice_agent.log
```

**Restart agent:**
```bash
pkill -f voice_agent
cd /app/backend
python3 voice_agent.py dev
```

### No Audio on Device

1. **Check microphone permission:** Settings → Apps → VoiceAgent → Permissions
2. **Check volume:** Ensure media volume is up
3. **Check agent:** Make sure voice agent is running on computer
4. **Check network:** Device and computer on same/accessible network

---

## ⏱️ Timeline

- **EAS Login:** 2 minutes
- **Build Configuration:** 3 minutes  
- **Android Build:** 10-15 minutes
- **Download & Install:** 5 minutes
- **Start Voice Agent:** 1 minute
- **Test Call:** Immediate

**Total: ~25-30 minutes to full voice functionality!**

---

## 💡 Quick Reference Commands

```bash
# Login
eas login

# Build Android
eas build --profile development --platform android

# Check builds
eas build:list

# Start voice agent
cd /app/backend
python3 voice_agent.py dev

# Stop voice agent
pkill -f voice_agent
```

---

## 🎉 Success Checklist

When everything works, you'll have:

- ✅ Native app installed on your phone
- ✅ Beautiful UI matching your design
- ✅ Avatar selection (Maya & Miles)
- ✅ **Real voice conversations with AI**
- ✅ Microphone recording your speech
- ✅ AI generating intelligent responses
- ✅ Text-to-speech playing back responses
- ✅ Session history in MongoDB

---

## 📞 Test Conversation Example

**You:** "Hi Maya, how are you?"
**Maya:** "Hello! I'm doing great, thank you for asking. How can I help you today?"

**You:** "Tell me a joke"
**Maya:** "Sure! Why don't scientists trust atoms? Because they make up everything!"

**You:** "That's funny!"
**Maya:** "I'm glad you enjoyed it! Would you like to hear another one or is there something else I can help you with?"

---

## 🚀 Ready to Build!

**Run these commands now:**

```bash
# Step 1: Login to Expo
eas login

# Step 2: Build Android
cd /app/frontend
eas build --profile development --platform android

# Step 3: Wait for build (~15 mins)
# Check progress: eas build:list

# Step 4: Download APK and install on phone

# Step 5: Start voice agent
cd /app/backend
python3 voice_agent.py dev

# Step 6: Open app and start talking! 🎤
```

**Good luck! You're about to have a working voice AI assistant!** 🚀✨
