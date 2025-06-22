import { useTasks } from '@/context/TasksContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

// Particle animation background
const ParticleBackground: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const numParticles = 32;
  const particles = Array.from({ length: numParticles }, (_, i) => i);
  const anims = useRef(particles.map(() => new Animated.Value(0))).current;
  const yPositions = useRef(particles.map(() => Math.random() * height)).current;

  useEffect(() => {
    particles.forEach((_, i) => {
      const animate = () => {
        anims[i].setValue(0);
        yPositions[i] = Math.random() * height;
        Animated.timing(anims[i], {
          toValue: 1,
          duration: 9000 + Math.random() * 4000,
          useNativeDriver: false,
        }).start(() => animate());
      };
      animate();
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((_, i) => {
        const size = 1.5 + Math.random() * 2.5;
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              left: anims[i].interpolate({ inputRange: [0, 1], outputRange: [-20, width + 20] }),
              top: yPositions[i],
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: 'rgba(255,255,255,0.85)',
              opacity: 0.7 + Math.random() * 0.3,
              shadowColor: '#fff',
              shadowOpacity: 0.7,
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 0 },
            }}
          />
        );
      })}
    </View>
  );
};

export const DailyActivities: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { 
    dailySteps, 
    waterIntake, 
    addWater, 
    reduceWater 
  } = useTasks();

  const [isWaterComplete, setIsWaterComplete] = useState(false);
  const [showCompletedText, setShowCompletedText] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const completedTextAnim = useRef(new Animated.Value(0)).current;

  const waterGoal = 3.0;
  const stepsGoal = 3000;

  // Fade-in animations
  const fadeHeader = useRef(new Animated.Value(0)).current;
  const fadeTasks = useRef(new Animated.Value(0)).current;
  const fadeReward = useRef(new Animated.Value(0)).current;
  const fadeLeaderboard = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (waterIntake >= waterGoal && !isWaterComplete) {
      setIsWaterComplete(true);
      triggerCompletionAnimation();
    } else if (waterIntake < waterGoal && isWaterComplete) {
      setIsWaterComplete(false);
      setShowCompletedText(false);
      completedTextAnim.setValue(0);
    }
  }, [waterIntake]);

  useEffect(() => {
    Animated.stagger(180, [
      Animated.timing(fadeHeader, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeTasks, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeReward, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeLeaderboard, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const triggerCompletionAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }).start(() => {
          setShowCompletedText(true);
          Animated.timing(completedTextAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();
        });
      }, 1000);
    });
  };

  const waterProgress = (waterIntake / waterGoal) * 100;

  return (
    <LinearGradient colors={["#16213e", "#0f3460", "#16213e"]} style={styles.gradient}>
      <ParticleBackground />
      <ThemedView style={styles.container}>
        <Animated.View style={[styles.header, { opacity: fadeHeader }]}> 
          <ThemedText style={styles.title}>Daily Activities</ThemedText>
          <TouchableOpacity onPress={onClose}>
            <ThemedText style={styles.closeButton}>✕</ThemedText>
          </TouchableOpacity>
        </Animated.View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeTasks }}>
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Today's Tasks</ThemedText>
              
              <Link href="/step-counter" asChild>
                <TouchableOpacity style={styles.taskCard} activeOpacity={0.7}>
                  <View style={styles.taskIcon}>
                    <ThemedText style={styles.taskIconText}>🚶</ThemedText>
                  </View>
                  <View style={styles.taskContent}>
                    <ThemedText style={styles.taskTitle}>Walk 3000 Steps</ThemedText>
                    <ThemedText style={styles.taskDescription}>
                      Complete your daily step goal for better health
                    </ThemedText>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${(dailySteps / 3000) * 100}%` }]} />
                    </View>
                    <ThemedText style={styles.progressText}>{dailySteps} / 3,000 Steps</ThemedText>
                  </View>
                </TouchableOpacity>
              </Link>

              <Animated.View 
                style={[
                  styles.taskCard,
                  {
                    backgroundColor: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['#fff', '#e8f5e8'],
                    }),
                  }
                ]}
              >
                <View style={styles.taskIcon}>
                  <ThemedText style={styles.taskIconText}>💧</ThemedText>
                </View>
                <View style={styles.taskContent}>
                  <ThemedText style={styles.taskTitle}>Drink 3 Litres of Water</ThemedText>
                  <ThemedText style={styles.taskDescription}>
                    Stay hydrated throughout the day
                  </ThemedText>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${waterProgress}%` }]} />
                  </View>
                  <ThemedText style={styles.progressText}>{waterIntake.toFixed(1)} / {waterGoal.toFixed(1)} Litres</ThemedText>
                  
                  {showCompletedText && (
                    <Animated.View
                      style={{
                        opacity: completedTextAnim,
                        transform: [{
                          translateY: completedTextAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [10, 0],
                          }),
                        }],
                      }}
                    >
                      <ThemedText style={styles.completedText}>✅ Completed!</ThemedText>
                    </Animated.View>
                  )}
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.reduceWaterButton,
                      waterIntake <= 0 && styles.reduceWaterButtonDisabled
                    ]}
                    onPress={reduceWater}
                    disabled={waterIntake <= 0}
                  >
                    <ThemedText style={[
                      styles.reduceWaterButtonText,
                      waterIntake <= 0 && styles.reduceWaterButtonTextDisabled
                    ]}>
                      -0.25L
                    </ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.addWaterButton,
                      isWaterComplete && styles.addWaterButtonComplete
                    ]}
                    onPress={addWater}
                    disabled={isWaterComplete}
                  >
                    <ThemedText style={[
                      styles.addWaterButtonText,
                      isWaterComplete && styles.addWaterButtonTextComplete
                    ]}>
                      {isWaterComplete ? '' : '+0.25L'}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </Animated.View>

              <Link href="/survey-webview" asChild>
                <TouchableOpacity style={styles.taskCard} activeOpacity={0.7}>
                  <View style={styles.taskIcon}>
                    <ThemedText style={styles.taskIconText}>📋</ThemedText>
                  </View>
                  <View style={styles.taskContent}>
                    <ThemedText style={styles.taskTitle}>Take Health Survey</ThemedText>
                    <ThemedText style={styles.taskDescription}>
                      Complete today's health assessment
                    </ThemedText>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: '0%' }]} />
                    </View>
                    <ThemedText style={styles.progressText}>Not Started</ThemedText>
                  </View>
                </TouchableOpacity>
              </Link>
            </View>
          </Animated.View>

          <Animated.View style={{ opacity: fadeReward }}>
            <View style={styles.rewardBanner}>
              <ThemedText style={styles.rewardBannerText}>
                Complete today's tasks to get 300 coins! 🪙
              </ThemedText>
            </View>
          </Animated.View>

          <Animated.View style={{ opacity: fadeLeaderboard }}>
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Leaderboard</ThemedText>
              
              <View style={styles.leaderboardCard}>
                <View style={styles.rankContainer}>
                  <ThemedText style={styles.rankNumber}>1</ThemedText>
                </View>
                <View style={styles.userInfo}>
                  <ThemedText style={styles.userName}>Soham Dey</ThemedText>
                  <ThemedText style={styles.userStats}>2,850 steps • 2.8L water</ThemedText>
                </View>
                <View style={styles.scoreContainer}>
                  <ThemedText style={styles.score}>95%</ThemedText>
                </View>
              </View>

              <View style={styles.leaderboardCard}>
                <View style={styles.rankContainer}>
                  <ThemedText style={styles.rankNumber}>2</ThemedText>
                </View>
                <View style={styles.userInfo}>
                  <ThemedText style={styles.userName}>Amrit Bhattacharya</ThemedText>
                  <ThemedText style={styles.userStats}>2,650 steps • 2.5L water</ThemedText>
                </View>
                <View style={styles.scoreContainer}>
                  <ThemedText style={styles.score}>88%</ThemedText>
                </View>
              </View>

              <View style={styles.leaderboardCard}>
                <View style={styles.rankContainer}>
                  <ThemedText style={styles.rankNumber}>3</ThemedText>
                </View>
                <View style={styles.userInfo}>
                  <ThemedText style={styles.userName}>Dibyendu Mandal</ThemedText>
                  <ThemedText style={styles.userStats}>2,400 steps • 2.2L water</ThemedText>
                </View>
                <View style={styles.scoreContainer}>
                  <ThemedText style={styles.score}>82%</ThemedText>
                </View>
              </View>

              <View style={styles.leaderboardCard}>
                <View style={styles.rankContainer}>
                  <ThemedText style={styles.rankNumber}>4</ThemedText>
                </View>
                <View style={styles.userInfo}>
                  <ThemedText style={styles.userName}>Anurag Verma</ThemedText>
                  <ThemedText style={styles.userStats}>2,100 steps • 2.0L water</ThemedText>
                </View>
                <View style={styles.scoreContainer}>
                  <ThemedText style={styles.score}>75%</ThemedText>
                </View>
              </View>

              <View style={styles.leaderboardCard}>
                <View style={styles.rankContainer}>
                  <ThemedText style={styles.rankNumber}>5</ThemedText>
                </View>
                <View style={styles.userInfo}>
                  <ThemedText style={styles.userName}>You</ThemedText>
                  <ThemedText style={styles.userStats}>{dailySteps} steps • {waterIntake.toFixed(1)}L water</ThemedText>
                </View>
                <View style={styles.scoreContainer}>
                  <ThemedText style={styles.score}>45%</ThemedText>
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </ThemedView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 18,
    backgroundColor: 'rgba(22,33,62,0.95)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  closeButton: {
    fontSize: 28,
    color: '#666',
    padding: 5,
    fontWeight: '400',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  section: {
    marginBottom: 36,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 18,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
  },
  taskIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#e3f9ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  taskIconText: {
    fontSize: 26,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16213e',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2ECC71',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: '#2ECC71',
    fontWeight: '600',
    marginBottom: 2,
  },
  completedText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2ECC71',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  reduceWaterButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  reduceWaterButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  reduceWaterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  reduceWaterButtonTextDisabled: {
    color: '#666',
  },
  addWaterButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addWaterButtonComplete: {
    opacity: 0,
    width: 0,
    height: 0,
    padding: 0,
    margin: 0,
  },
  addWaterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  addWaterButtonTextComplete: {
    color: '#666',
  },
  rewardBanner: {
    backgroundColor: '#e3f9ee',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 0,
    shadowColor: '#2ECC71',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  rewardBannerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  leaderboardCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  rankContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e3f9ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  rankNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2ECC71',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16213e',
    marginBottom: 2,
  },
  userStats: {
    fontSize: 13,
    color: '#666',
  },
  scoreContainer: {
    width: 60,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e3f9ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2ECC71',
  },
}); 