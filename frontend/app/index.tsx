import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AvatarSelectionModal from '../components/AvatarSelectionModal';

const AVATARS = [
  {
    id: 'maya',
    name: 'Maya',
    gender: 'female',
    description: 'A warm, empathetic conversationalist who listens carefully and responds thoughtfully.',
  },
  {
    id: 'miles',
    name: 'Miles',
    gender: 'male',
    description: 'A laid-back, witty conversationalist who tells it like it is.',
  },
];

export default function Index() {
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const router = useRouter();

  const handleStartCall = () => {
    router.push({
      pathname: '/call',
      params: { avatarId: selectedAvatar.id }
    });
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
          <TouchableOpacity 
            style={styles.avatarSelector}
            onPress={() => setShowAvatarModal(true)}
          >
            <Text style={styles.avatarName}>{selectedAvatar.name}</Text>
            <Ionicons name="chevron-down" size={16} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person-circle-outline" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Ionicons 
                name={selectedAvatar.gender === 'female' ? 'woman' : 'man'} 
                size={80} 
                color="#6B4423" 
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.callButton}
            onPress={handleStartCall}
          >
            <View style={styles.callIcon}>
              <Ionicons name="call" size={32} color="#6B8E23" />
            </View>
            <Text style={styles.callText}>Start a call</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.textButton}>
            <Text style={styles.textButtonLabel}>Send a text</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <AvatarSelectionModal
        visible={showAvatarModal}
        avatars={AVATARS}
        selectedAvatar={selectedAvatar}
        onSelect={(avatar) => {
          setSelectedAvatar(avatar);
          setShowAvatarModal(false);
        }}
        onClose={() => setShowAvatarModal(false)}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  avatarSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  avatarName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  profileButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 60,
  },
  avatarCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  callButton: {
    alignItems: 'center',
  },
  callIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5DC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 12,
  },
  callText: {
    color: '#E0E0E0',
    fontSize: 18,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  textButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  textButtonLabel: {
    color: '#B0B0B0',
    fontSize: 16,
    fontWeight: '500',
  },
});