import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80' }}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.85)', 'rgba(0,0,0,0.95)']}
          style={styles.gradient}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Back Button */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Logo/Icon */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="leaf" size={32} color="#6B8E23" />
              </View>
            </View>

            {/* Tagline */}
            <Text style={styles.tagline}>Your personal{'\n'}AI Assistant</Text>

            {/* User Info Section */}
            <TouchableOpacity style={styles.userInfoCard}>
              <View style={styles.userInfoContent}>
                <View style={styles.userAvatar}>
                  <Ionicons name="person" size={32} color="#6B8E23" />
                </View>
                <View style={styles.userTextContainer}>
                  <Text style={styles.userName}>Guest User</Text>
                  <Text style={styles.userEmail}>guest@voiceagent.app</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#B0B0B0" />
            </TouchableOpacity>

            {/* Menu Items */}
            <View style={styles.menuSection}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconContainer}>
                    <Ionicons name="sparkles" size={22} color="#fff" />
                  </View>
                  <Text style={styles.menuItemText}>What's New</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#B0B0B0" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconContainer}>
                    <Ionicons name="shield-checkmark" size={22} color="#fff" />
                  </View>
                  <Text style={styles.menuItemText}>Privacy</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#B0B0B0" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconContainer}>
                    <Ionicons name="key" size={22} color="#fff" />
                  </View>
                  <Text style={styles.menuItemText}>Permissions</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#B0B0B0" />
              </TouchableOpacity>
            </View>

            {/* Feedback Button */}
            <TouchableOpacity style={styles.feedbackButton}>
              <View style={styles.feedbackContent}>
                <Ionicons name="chatbubble-ellipses" size={22} color="#fff" />
                <Text style={styles.feedbackText}>Share Feedback</Text>
              </View>
            </TouchableOpacity>

            {/* App Version */}
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    opacity: 0.3,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(107, 142, 35, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagline: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 40,
  },
  userInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  userInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(107, 142, 35, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  menuSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(107, 142, 35, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  feedbackButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  feedbackContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
