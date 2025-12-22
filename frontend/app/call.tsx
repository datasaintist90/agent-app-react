import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import LiveKitRoom from '../components/LiveKitRoom';
import AnimatedAvatar from '../components/AnimatedAvatar';

const AVATARS = [
  { id: 'maya', name: 'Maya', gender: 'female' },
  { id: 'miles', name: 'Miles', gender: 'male' },
];

export default function CallScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const avatarId = params.avatarId as string || 'maya';
  
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [microphoneLevel, setMicrophoneLevel] = useState(0);

  const avatar = AVATARS.find(a => a.id === avatarId) || AVATARS[0];

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected]);

  const requestPermissions = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Microphone Permission Required',
          'Please enable microphone access to use voice features.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end this call?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Call', 
          style: 'destructive',
          onPress: () => router.back()
        }
      ]
    );
  };

  const handleToggleMic = () => {
    setMicEnabled(!micEnabled);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#6B4423', '#3A506B', '#1C2541']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.agentName}>{avatar.name}</Text>
            <View style={styles.statusContainer}>
              {isConnecting ? (
                <>
                  <ActivityIndicator size="small" color="#4CAF50" />
                  <Text style={styles.statusText}>Connecting...</Text>
                </>
              ) : isConnected ? (
                <>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>
                    {agentSpeaking ? 'Speaking...' : 'Listening...'}
                  </Text>
                </>
              ) : (
                <Text style={styles.statusText}>Disconnected</Text>
              )}
            </View>
            <Text style={styles.duration}>{formatDuration(callDuration)}</Text>
          </View>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <AnimatedAvatar
            gender={avatar.gender}
            isConnected={isConnected}
            isSpeaking={agentSpeaking}
            microphoneLevel={microphoneLevel}
          />
        </View>

        {/* LiveKit Integration */}
        <LiveKitRoom
          avatarId={avatarId}
          onConnectionChange={(connected) => {
            setIsConnected(connected);
            setIsConnecting(false);
          }}
          onAgentSpeaking={setAgentSpeaking}
          onMicrophoneLevel={setMicrophoneLevel}
          micEnabled={micEnabled}
        />

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              !micEnabled && styles.controlButtonDisabled
            ]}
            onPress={handleToggleMic}
          >
            <Ionicons
              name={micEnabled ? 'mic' : 'mic-off'}
              size={28}
              color={micEnabled ? '#4CAF50' : '#f44336'}
            />
            <Text style={styles.controlLabel}>
              {micEnabled ? 'Mic On' : 'Mic Off'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.endCallButton}
            onPress={handleEndCall}
          >
            <Ionicons name="call" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="volume-high" size={28} color="#2196F3" />
            <Text style={styles.controlLabel}>Speaker</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  agentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  duration: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  avatarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  controlButton: {
    alignItems: 'center',
    padding: 15,
  },
  controlButtonDisabled: {
    opacity: 0.6,
  },
  controlLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
  endCallButton: {
    backgroundColor: '#f44336',
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});