import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  gender: string;
  isConnected: boolean;
  isSpeaking: boolean;
  microphoneLevel: number;
}

export default function AnimatedAvatar({
  gender,
  isConnected,
  isSpeaking,
  microphoneLevel,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (isSpeaking) {
      // Pulsing animation when agent is speaking
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      pulseAnim.stopAnimation();
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      Animated.timing(opacityAnim, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isSpeaking]);

  useEffect(() => {
    if (microphoneLevel > 0.1 && !isSpeaking) {
      // Small scale animation when user is speaking
      Animated.spring(scaleAnim, {
        toValue: 1 + microphoneLevel * 0.2,
        useNativeDriver: true,
        friction: 3,
      }).start();
    } else if (!isSpeaking) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
      }).start();
    }
  }, [microphoneLevel, isSpeaking]);

  return (
    <View style={styles.container}>
      {/* Outer glow ring */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            opacity: opacityAnim,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />

      {/* Middle ring */}
      <Animated.View
        style={[
          styles.middleRing,
          {
            opacity: opacityAnim.interpolate({
              inputRange: [0.3, 1],
              outputRange: [0.5, 0.8],
            }),
          },
        ]}
      />

      {/* Avatar circle */}
      <Animated.View
        style={[
          styles.avatarCircle,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Ionicons
          name={gender === 'female' ? 'woman' : 'man'}
          size={100}
          color={isConnected ? '#6B4423' : '#999'}
        />
      </Animated.View>

      {/* Audio level indicators */}
      {isConnected && (
        <View style={styles.audioIndicators}>
          <View style={styles.indicatorBar}>
            <Animated.View
              style={[
                styles.indicatorFill,
                {
                  height: `${microphoneLevel * 100}%`,
                  backgroundColor: '#4CAF50',
                },
              ]}
            />
          </View>
          <View style={styles.indicatorBar}>
            <Animated.View
              style={[
                styles.indicatorFill,
                {
                  height: isSpeaking ? '80%' : '0%',
                  backgroundColor: '#2196F3',
                },
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(107, 68, 35, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(107, 68, 35, 0.5)',
  },
  middleRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(107, 68, 35, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(107, 68, 35, 0.3)',
  },
  avatarCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  audioIndicators: {
    position: 'absolute',
    bottom: -50,
    flexDirection: 'row',
    gap: 20,
  },
  indicatorBar: {
    width: 24,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  indicatorFill: {
    width: '100%',
    borderRadius: 12,
  },
});