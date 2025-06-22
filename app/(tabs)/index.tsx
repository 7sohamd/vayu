import { CoinWebView } from '@/components/CoinWebView';
import { DailyActivities } from '@/components/DailyActivities';
import { LocationTracker } from '@/components/LocationTracker';
import { ParticleBackground } from '@/components/ParticleBackground';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTasks } from '@/context/TasksContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [showCoinWebView, setShowCoinWebView] = useState(false);
  const [showDailyActivities, setShowDailyActivities] = useState(false);
  const router = useRouter();
  const { dailySteps, waterIntake } = useTasks();

  // Real logic for completed tasks
  const baseProgress = 40;
  const stepsGoal = 3000;
  const waterGoal = 3.0;
  const stepsDone = dailySteps >= stepsGoal;
  const waterDone = waterIntake >= waterGoal;
  const completedTasks = [stepsDone, waterDone].filter(Boolean).length;
  const healthProgress = baseProgress + completedTasks * 30;
  const progressPercent = healthProgress / 100;

  // Determine tracker color and label
  let trackerColor = '#e74c3c';
  let trackerLabel = 'Poor health condition';
  if (healthProgress >= 70) {
    trackerColor = '#2ecc71';
    trackerLabel = 'You are absolutely fit';
  } else if (healthProgress >= 40) {
    trackerColor = '#f1c40f';
    trackerLabel = 'You are doing great';
  }

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
    <LinearGradient
      colors={['#16213e', '#0f3460', '#16213e']}
      style={styles.gradient}
    >
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
        <View style={styles.header}>
          <ParticleBackground />
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
        </View>

        {/* Scrollable Main Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* AQI Zone Tracker with Animation */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <LocationTracker />
            <Link href="/aqi-safe-areas-webview" asChild>
              <TouchableOpacity style={styles.aqiSafeLink} activeOpacity={0.7}>
                <ThemedText style={styles.aqiSafeLinkText}>Check AQI safe areas around you</ThemedText>
              </TouchableOpacity>
            </Link>
          </Animated.View>

          {/* Overall Health Tracker (scrollable) */}
          <View style={styles.healthTrackerContainer}>
            <Svg width={120} height={120}>
              <Circle
                cx={60}
                cy={60}
                r={52}
                stroke="#e0e0e0"
                strokeWidth={12}
                fill="none"
              />
              <Circle
                cx={60}
                cy={60}
                r={52}
                stroke={trackerColor}
                strokeWidth={12}
                fill="none"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={(1 - progressPercent) * 2 * Math.PI * 52}
                strokeLinecap="round"
                rotation="-90"
                origin="60,60"
              />
            </Svg>
            <View style={styles.healthTrackerTextContainer}>
              <ThemedText style={styles.healthTrackerValue}>{healthProgress}</ThemedText>
              <ThemedText style={styles.healthTrackerLabel}>Health</ThemedText>
            </View>
          </View>
          <View style={[styles.healthTrackerStatusButton, { backgroundColor: trackerColor+'22', borderColor: trackerColor }]}> 
            <ThemedText style={[styles.healthTrackerStatusButtonText, { color: trackerColor }]}>{trackerLabel}</ThemedText>
          </View>

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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
    color: '#fff',
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
  featuresSection: {
    marginTop: 20,
  },
  featuresTitle: {
    fontSize: 22,
    fontWeight: '200',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 1,
    fontFamily: 'System',
  },
  featureCard: {
    flexDirection: 'row',
    borderRadius: 22,
    padding: 24,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#0f3460',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 6,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    backgroundColor: 'rgba(46, 204, 113, 0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(15, 52, 96, 0.18)',
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIconText: {
    fontSize: 26,
    color: '#2ecc71',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#2ecc71',
    marginBottom: 8,
    letterSpacing: 0.5,
    fontFamily: 'System',
    textShadowColor: 'rgba(22, 33, 62, 0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: '#eafaf1',
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
  healthTrackerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 24,
    alignSelf: 'center',
    position: 'relative',
    width: 120,
    height: 120,
  },
  healthTrackerTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  healthTrackerValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2ecc71',
    textAlign: 'center',
  },
  healthTrackerLabel: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '600',
  },
  healthTrackerStatusButton: {
    alignSelf: 'center',
    marginTop: 12,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1.5,
    minWidth: 180,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  healthTrackerStatusButtonText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  aqiSafeLink: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(46,204,113,0.08)',
  },
  aqiSafeLinkText: {
    color: '#2ecc71',
    fontWeight: '700',
    fontSize: 15,
    textDecorationLine: 'underline',
    letterSpacing: 0.2,
  },
});
