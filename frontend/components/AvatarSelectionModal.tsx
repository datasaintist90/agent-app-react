import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface Avatar {
  id: string;
  name: string;
  gender: string;
  description: string;
}

interface Props {
  visible: boolean;
  avatars: Avatar[];
  selectedAvatar: Avatar;
  onSelect: (avatar: Avatar) => void;
  onClose: () => void;
}

const { height } = Dimensions.get('window');

export default function AvatarSelectionModal({ visible, avatars, selectedAvatar, onSelect, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const index = avatars.findIndex(a => a.id === selectedAvatar.id);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [selectedAvatar, avatars]);

  const handleNext = () => {
    if (currentIndex < avatars.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentAvatar = avatars[currentIndex];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View style={styles.modalContainer}>
          <BlurView intensity={80} style={styles.blurContainer}>
            {/* Handle Bar */}
            <View style={styles.handleBar} />
            
            {/* Title */}
            <Text style={styles.title}>Select your agent</Text>
            
            {/* Avatar Display */}
            <View style={styles.avatarDisplay}>
              <View style={styles.avatarIcon}>
                <Ionicons 
                  name={currentAvatar.gender === 'female' ? 'woman' : 'man'}
                  size={100}
                  color="#6B4423"
                />
              </View>
              
              <Text style={styles.avatarName}>{currentAvatar.name}</Text>
              <Text style={styles.avatarDescription}>{currentAvatar.description}</Text>
            </View>
            
            {/* Pagination Dots */}
            <View style={styles.pagination}>
              {avatars.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentIndex && styles.dotActive
                  ]}
                />
              ))}
            </View>
            
            {/* Navigation Arrows */}
            {avatars.length > 1 && (
              <View style={styles.navigation}>
                <TouchableOpacity
                  onPress={handlePrevious}
                  disabled={currentIndex === 0}
                  style={styles.navButton}
                >
                  <Ionicons 
                    name="chevron-back" 
                    size={24} 
                    color={currentIndex === 0 ? '#666' : '#fff'} 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleNext}
                  disabled={currentIndex === avatars.length - 1}
                  style={styles.navButton}
                >
                  <Ionicons 
                    name="chevron-forward" 
                    size={24} 
                    color={currentIndex === avatars.length - 1 ? '#666' : '#fff'} 
                  />
                </TouchableOpacity>
              </View>
            )}
            
            {/* Select Button */}
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => onSelect(currentAvatar)}
            >
              <Text style={styles.selectButtonText}>Select {currentAvatar.name}</Text>
            </TouchableOpacity>
          </BlurView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    maxHeight: height * 0.7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  blurContainer: {
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '500',
  },
  avatarDisplay: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  avatarDescription: {
    fontSize: 15,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  navButton: {
    padding: 10,
  },
  selectButton: {
    backgroundColor: '#6B8E23',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});