import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTasks } from '@/context/TasksContext';
import { useRouter } from 'expo-router';
import { Accelerometer } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function StepCounterScreen() {
  const router = useRouter();
  const { dailySteps, updateDailySteps } = useTasks();
  
  const [sessionSteps, setSessionSteps] = useState(0);
  const [isTracking, setIsTracking] = useState(true); // Start tracking immediately
  
  const stepAnim = useRef(new Animated.Value(1)).current;
  const accelerometerSubscription = useRef<any>(null);
  
  // More robust step detection logic
  const stepThreshold = 1.15; // Increased threshold to reduce sensitivity
  const lastPeak = useRef(0);
  const lastValley = useRef(0);
  const lastStepTime = useRef(Date.now()); // For debounce

  const startTracking = () => {
    setIsTracking(true);
    setSessionSteps(0);
    lastPeak.current = 0;
    lastValley.current = 0;
    lastStepTime.current = Date.now();
    
    Accelerometer.setUpdateInterval(100); // Set update interval
    
    accelerometerSubscription.current = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();
      
      if (magnitude > stepThreshold && lastPeak.current < magnitude) {
        lastPeak.current = magnitude;
      }
      
      if (magnitude < stepThreshold && lastPeak.current > 0) {
        lastValley.current = magnitude;
      }
      
      if (
        lastPeak.current > 0 &&
        lastValley.current > 0 &&
        now - lastStepTime.current > 300 // 300ms debounce
      ) {
        setSessionSteps(prev => prev + 1);
        lastPeak.current = 0;
        lastValley.current = 0;
        lastStepTime.current = now;

        // Animate the step count
        stepAnim.setValue(1.2);
        Animated.spring(stepAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }).start();
      }
    });
  };

  useEffect(() => {
    // Start tracking immediately when component mounts
    startTracking();
    
    // Cleanup subscription on unmount
    return () => accelerometerSubscription.current?.remove();
  }, []);

  useEffect(() => {
    // Update the total daily steps in the context whenever session steps change
    updateDailySteps(1350 + sessionSteps); // Assuming 1350 is the initial daily step count
  }, [sessionSteps]);

  const totalSteps = dailySteps;
  const stepGoal = 3000;
  const progress = (totalSteps / stepGoal) * 100;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.topBar}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login-webview')}>
          <ThemedText style={styles.loginButtonText}>Login</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Animated.View style={[styles.stepDisplay, { transform: [{ scale: stepAnim }] }]}>
          <ThemedText style={styles.stepNumber}>{totalSteps}</ThemedText>
          <ThemedText style={styles.stepLabel}>Total Steps Today</ThemedText>
        </Animated.View>

        <View style={styles.sessionCard}>
          <ThemedText style={styles.sessionTitle}>This Session</ThemedText>
          <ThemedText style={styles.sessionSteps}>{sessionSteps} steps</ThemedText>
        </View>

        <View style={styles.progressCard}>
          <ThemedText style={styles.progressTitle}>Daily Goal Progress</ThemedText>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
          </View>
          <ThemedText style={styles.progressText}>
            {totalSteps} / {stepGoal} steps ({progress.toFixed(0)}%)
          </ThemedText>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: '#2ECC71' }]} />
          <ThemedText style={styles.statusText}>
            Tracking Steps...
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  loginButton: {
    padding: 10,
    backgroundColor: '#2ECC71',
    borderRadius: 5,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  content: { flex: 1, padding: 24, alignItems: 'center', paddingTop: 80 },
  stepDisplay: { alignItems: 'center', marginBottom: 50, marginTop: 20 },
  stepNumber: { fontSize: 80, fontWeight: '200', color: '#1a1a2e', marginBottom: 15, lineHeight: 90 },
  stepLabel: { fontSize: 18, color: '#666', marginTop: 8 },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sessionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  sessionSteps: { fontSize: 28, fontWeight: '300', color: '#2ECC71' },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  progressTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  progressBar: { height: 10, backgroundColor: '#e9ecef', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#2ECC71', borderRadius: 5 },
  progressText: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statusText: { fontSize: 16, color: '#666' },
}); 