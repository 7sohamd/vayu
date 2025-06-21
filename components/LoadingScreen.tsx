import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

const { width, height } = Dimensions.get('window');

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const fadeOutOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const startAnimation = async () => {
      // Initial logo appearance
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      // Logo rotation after scale
      setTimeout(() => {
        Animated.loop(
          Animated.timing(logoRotate, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          })
        ).start();
      }, 1000);

      // Text fade in
      setTimeout(() => {
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 1200);

      // Progress bar animation
      setTimeout(() => {
        Animated.timing(progressWidth, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }).start();
      }, 1500);

      // Fade out and complete
      setTimeout(() => {
        Animated.timing(fadeOutOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          onLoadingComplete();
        });
      }, 4000);
    };

    startAnimation();
  }, []);

  const rotateValue = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressBarWidth = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeOutOpacity }]}>
      <LinearGradient
        colors={['#16213e', '#0f3460', '#16213e']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo Animation */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: logoOpacity,
                transform: [
                  { scale: logoScale },
                  { rotate: rotateValue },
                ],
              },
            ]}
          >
            <View style={styles.logoCircle}>
              <ThemedText style={styles.logoText}>V</ThemedText>
            </View>
          </Animated.View>

          {/* App Name */}
          <Animated.View style={{ opacity: textOpacity }}>
            <ThemedText style={styles.tagline}>Air Quality Intelligence</ThemedText>
          </Animated.View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressBarWidth,
                },
              ]}
            />
          </View>

          {/* Loading Text */}
          <Animated.View style={{ opacity: textOpacity }}>
            <ThemedText style={styles.loadingText}>Initializing...</ThemedText>
          </Animated.View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 50,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#ffffff',
    fontFamily: 'System',
  },
  appName: {
    fontSize: 42,
    fontWeight: '200',
    color: '#ffffff',
    marginBottom: 30,
    letterSpacing: 3,
    fontFamily: 'System',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '300',
    letterSpacing: 1.5,
    marginBottom: 60,
    fontFamily: 'System',
    textAlign: 'center',
  },
  progressContainer: {
    width: width * 0.6,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2ECC71',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '300',
    letterSpacing: 1,
    fontFamily: 'System',
  },
}); 