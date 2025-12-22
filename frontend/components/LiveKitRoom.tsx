import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import { Room, RoomEvent, createLocalTracks, Track } from 'livekit-client';
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
  const [room, setRoom] = useState<Room | null>(null);
  const roomRef = useRef<Room | null>(null);
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    connectToRoom();

    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (room && room.localParticipant) {
      room.localParticipant.setMicrophoneEnabled(micEnabled);
    }
  }, [micEnabled, room]);

  const cleanup = async () => {
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
    }
    
    if (roomRef.current) {
      await roomRef.current.disconnect();
      roomRef.current = null;
    }
  };

  const connectToRoom = async () => {
    try {
      // Generate room name and get token from backend
      const userId = `user-${Date.now()}`;
      const roomName = `voice-agent-${avatarId}-${Date.now()}`;

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

      // Create and connect room
      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Set up event listeners
      newRoom.on(RoomEvent.Connected, () => {
        console.log('Connected to room');
        onConnectionChange(true);
        startMonitoring(newRoom);
      });

      newRoom.on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from room');
        onConnectionChange(false);
        if (monitoringIntervalRef.current) {
          clearInterval(monitoringIntervalRef.current);
        }
      });

      newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
        console.log('Participant connected:', participant.identity);
      });

      newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        console.log('Track subscribed:', track.kind, participant.identity);
        
        if (track.kind === Track.Kind.Audio) {
          const audioElement = track.attach();
          document.body.appendChild(audioElement);
        }
      });

      // Connect to room
      await newRoom.connect(url, token);

      // Enable local microphone
      await newRoom.localParticipant.setMicrophoneEnabled(true);

      roomRef.current = newRoom;
      setRoom(newRoom);

      // Create session in backend
      try {
        await fetch(`${API_URL}/api/sessions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            agent_id: avatarId,
            metadata: {
              room_name: roomName,
              platform: 'mobile',
            },
          }),
        });
      } catch (error) {
        console.error('Failed to create session:', error);
      }
    } catch (error) {
      console.error('Error connecting to room:', error);
      onConnectionChange(false);
    }
  };

  const startMonitoring = (room: Room) => {
    monitoringIntervalRef.current = setInterval(() => {
      try {
        // Monitor local microphone level
        const localParticipant = room.localParticipant;
        if (localParticipant) {
          // Simulate microphone level (in production, use actual audio analysis)
          const simulatedLevel = Math.random() * 0.3;
          onMicrophoneLevel(simulatedLevel);
        }

        // Monitor agent speaking
        const remoteParticipants = Array.from(room.remoteParticipants.values());
        let agentIsSpeaking = false;

        remoteParticipants.forEach((participant) => {
          const audioTracks = Array.from(participant.audioTracks.values());
          audioTracks.forEach((publication) => {
            if (publication.track && !publication.track.isMuted) {
              // Simulate agent speaking detection
              agentIsSpeaking = Math.random() > 0.7;
            }
          });
        });

        onAgentSpeaking(agentIsSpeaking);
      } catch (error) {
        console.error('Monitoring error:', error);
      }
    }, 200);
  };

  return <View />;
}