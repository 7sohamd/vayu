import { useTasks } from '@/context/TasksContext';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

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
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Daily Activities</ThemedText>
        <TouchableOpacity onPress={onClose}>
          <ThemedText style={styles.closeButton}>✕</ThemedText>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

          <View style={styles.taskCard}>
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
          </View>

          <View style={styles.rewardBanner}>
            <ThemedText style={styles.rewardBannerText}>
              Complete today's tasks to get 300 coins! 🪙
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Leaderboard</ThemedText>
          
          <View style={styles.leaderboardCard}>
            <View style={styles.rankContainer}>
              <ThemedText style={styles.rankNumber}>1</ThemedText>
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={styles.userName}>Sarah Johnson</ThemedText>
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
              <ThemedText style={styles.userName}>Mike Chen</ThemedText>
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
              <ThemedText style={styles.userName}>Emma Davis</ThemedText>
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
              <ThemedText style={styles.userName}>Alex Rodriguez</ThemedText>
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
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  taskIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  taskIconText: {
    fontSize: 24,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2ECC71',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  rewardCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  rewardIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 6,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  rewardBanner: {
    backgroundColor: '#f8f9ff',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e3f2fd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  rewardBannerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  leaderboardCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  rankContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rankNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  userStats: {
    fontSize: 14,
    color: '#666',
  },
  scoreContainer: {
    width: 80,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  addWaterButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
  addWaterButtonComplete: {
    opacity: 0,
    width: 0,
    height: 0,
    padding: 0,
    margin: 0,
  },
  addWaterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  addWaterButtonTextComplete: {
    color: '#666',
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2ECC71',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
}); 