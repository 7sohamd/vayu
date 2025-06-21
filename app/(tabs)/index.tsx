import { CoinWebView } from '@/components/CoinWebView';
import { DailyActivities } from '@/components/DailyActivities';
import { LocationTracker } from '@/components/LocationTracker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [showCoinWebView, setShowCoinWebView] = useState(false);
  const [showDailyActivities, setShowDailyActivities] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Login Button */}
      <TouchableOpacity 
        style={styles.loginButton}
        onPress={() => router.push('/login-webview')}
        activeOpacity={0.7}
      >
        <ThemedText style={styles.loginButtonText}>Login</ThemedText>
      </TouchableOpacity>
      
      {/* Tasks Icon */}
      <TouchableOpacity 
        style={styles.tasksContainer}
        onPress={() => setShowDailyActivities(true)}
        activeOpacity={0.7}
      >
        <ThemedText style={styles.tasksIcon}>📋</ThemedText>
      </TouchableOpacity>
      
      {/* Coin Icon */}
      <TouchableOpacity 
        style={styles.coinContainer}
        onPress={() => setShowCoinWebView(true)}
        activeOpacity={0.7}
      >
        <ThemedText style={styles.coinIcon}>🪙</ThemedText>
        <ThemedText style={styles.coinAmount}>1000</ThemedText>
      </TouchableOpacity>
      
      {/* Modern Header with Animation */}
      <LinearGradient
        colors={['#16213e', '#0f3460', '#16213e']}
        style={styles.header}
      >
        <Animated.View 
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Animated.View 
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            <View style={styles.logoCircle}>
              <ThemedText style={styles.logoText}>V</ThemedText>
            </View>
          </Animated.View>
          <ThemedText style={styles.appName}>Vayu</ThemedText>
          <ThemedText style={styles.tagline}>Air Quality Intelligence</ThemedText>
        </Animated.View>
      </LinearGradient>

      {/* Scrollable Main Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.welcomeSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <ThemedText style={styles.welcomeTitle}>
            Welcome to Vayu
          </ThemedText>
          <ThemedText style={styles.welcomeSubtitle}>
            Discover air quality zones around you
          </ThemedText>
        </Animated.View>

        {/* AQI Zone Tracker with Animation */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <LocationTracker />
        </Animated.View>

        {/* Features Section with Staggered Animation */}
        <View style={styles.featuresSection}>
          <Animated.Text 
            style={[
              styles.featuresTitle,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            How it works
          </Animated.Text>
          
          <Animated.View 
            style={[
              styles.featureCard,
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              }
            ]}
          >
            <View style={styles.featureIcon}>
              <ThemedText style={styles.featureIconText}>📍</ThemedText>
            </View>
            <View style={styles.featureContent}>
              <ThemedText style={styles.featureTitle}>Smart Tracking</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Vayu monitors your movement and detects when you enter different air quality zones
              </ThemedText>
            </View>
          </Animated.View>

          <Animated.View 
            style={[
              styles.featureCard,
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              }
            ]}
          >
            <View style={styles.featureIcon}>
              <ThemedText style={styles.featureIconText}>⚠️</ThemedText>
            </View>
            <View style={styles.featureContent}>
              <ThemedText style={styles.featureTitle}>Instant Alerts</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Get notified when you enter areas with different air quality levels
              </ThemedText>
            </View>
          </Animated.View>

          <Animated.View 
            style={[
              styles.featureCard,
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              }
            ]}
          >
            <View style={styles.featureIcon}>
              <ThemedText style={styles.featureIconText}>🌬️</ThemedText>
            </View>
            <View style={styles.featureContent}>
              <ThemedText style={styles.featureTitle}>Air Quality Zones</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Understand the air quality around you with intelligent zone detection
              </ThemedText>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Coin WebView Modal */}
      <Modal
        visible={showCoinWebView}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CoinWebView onClose={() => setShowCoinWebView(false)} />
      </Modal>

      {/* Daily Activities Modal */}
      <Modal
        visible={showDailyActivities}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <DailyActivities onClose={() => setShowDailyActivities(false)} />
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    paddingTop: 120,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '400',
    color: '#ffffff',
    fontFamily: 'System',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 32,
  },
  appName: {
    fontSize: 36,
    fontWeight: '300',
    color: '#ffffff',
    marginBottom: 15,
    letterSpacing: 1,
    fontFamily: 'System',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '300',
    letterSpacing: 1,
    fontFamily: 'System',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '200',
    color: '#1a1a2e',
    marginBottom: 12,
    letterSpacing: 1,
    fontFamily: 'System',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '300',
    lineHeight: 24,
    fontFamily: 'System',
  },
  featuresSection: {
    marginTop: 20,
  },
  featuresTitle: {
    fontSize: 22,
    fontWeight: '200',
    color: '#1a1a2e',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 1,
    fontFamily: 'System',
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconText: {
    fontSize: 26,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '300',
    color: '#1a1a2e',
    marginBottom: 8,
    letterSpacing: 0.5,
    fontFamily: 'System',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    fontWeight: '300',
    fontFamily: 'System',
  },
  coinContainer: {
    position: 'absolute',
    top: 40,
    right: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  coinIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  coinAmount: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  tasksContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  tasksIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  loginButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#2ECC71',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 2000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
