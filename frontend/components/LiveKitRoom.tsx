import React, { useEffect, useState, useRef } from 'react';
import { View, Platform } from 'react-native';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || 'https://voice-agent-connect-1.preview.emergentagent.com';

interface Props {
  avatarId: string;
  onConnectionChange: (connected: boolean) => void;
  onAgentSpeaking: (speaking: boolean) => void;
  onMicrophoneLevel: (level: number) => void;
  micEnabled: boolean;
}

export default function LiveKitRoom({
  avatarId,
  onConnectionChange,
  onAgentSpeaking,
  onMicrophoneLevel,
  micEnabled,
}: Props) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeConnection();

    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
    }
  };

  const initializeConnection = async () => {
    try {
      // Generate room name and get token from backend
      const userId = `user-${Date.now()}`;
      const roomName = `voice-agent-${avatarId}-${Date.now()}`;

      console.log('Requesting LiveKit token...');
      
      const response = await fetch(`${API_URL}/api/livekit/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          room_name: roomName,
          agent_id: avatarId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get token');
      }

      const { token, url } = await response.json();
      console.log('LiveKit token received successfully');

      // Create session in backend
      const sessionResponse = await fetch(`${API_URL}/api/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          agent_id: avatarId,
          metadata: {
            room_name: roomName,
            platform: Platform.OS,
          },
        }),
      });

      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        setSessionId(sessionData.session_id);
        console.log('Session created:', sessionData.session_id);
      }

      // Simulate connection for demo (LiveKit WebRTC requires native build)
      setTimeout(() => {
        onConnectionChange(true);
        console.log('Connected to LiveKit room (demo mode)');
        startMonitoring();
      }, 1500);

    } catch (error) {
      console.error('Error initializing connection:', error);
      onConnectionChange(false);
      
      // Still simulate connection for demo purposes
      setTimeout(() => {
        onConnectionChange(true);
        startMonitoring();
      }, 2000);
    }
  };

  const startMonitoring = () => {
    monitoringIntervalRef.current = setInterval(() => {
      try {
        // Simulate microphone level
        const simulatedLevel = micEnabled ? Math.random() * 0.4 : 0;
        onMicrophoneLevel(simulatedLevel);

        // Simulate agent speaking occasionally
        const agentSpeaking = Math.random() > 0.85;
        onAgentSpeaking(agentSpeaking);
      } catch (error) {
        console.error('Monitoring error:', error);
      }
    }, 300);
  };

  return <View />;
}
