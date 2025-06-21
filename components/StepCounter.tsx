import { Accelerometer } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface StepCounterProps {
  onClose: () => void;
  onStepsUpdate: (steps: number) => void;
  dailySteps: number;
}

export const StepCounter: React.FC<StepCounterProps> = ({ 
  onClose, 
  onStepsUpdate, 
  dailySteps 
}) => {
  const [sessionSteps, setSessionSteps] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [lastAccelerometerData, setLastAccelerometerData] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  
  const stepAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const accelerometerSubscription = useRef<any>(null);

  const detectStep = (currentData: { x: number; y: number; z: number }) => {
    if (!lastAccelerometerData) {
      setLastAccelerometerData(currentData);
      return false;
    }

    // Calculate magnitude of acceleration
    const currentMagnitude = Math.sqrt(
      currentData.x ** 2 + currentData.y ** 2 + currentData.z ** 2
    );
    const lastMagnitude = Math.sqrt(
      lastAccelerometerData.x ** 2 + 
      lastAccelerometerData.y ** 2 + 
      lastAccelerometerData.z ** 2
    );

    // Detect significant change in acceleration (potential step)
    const accelerationChange = Math.abs(currentMagnitude - lastMagnitude);
    const stepThreshold = 0.5; // Adjust based on testing

    if (accelerationChange > stepThreshold) {
      return true;
    }

    setLastAccelerometerData(currentData);
    return false;
  };

  const startTracking = () => {
    setIsTracking(true);
    setSessionSteps(0);
    setLastAccelerometerData(null);

    // Start accelerometer tracking
    try {
      accelerometerSubscription.current = Accelerometer.addListener((data) => {
        if (detectStep(data)) {
          setSessionSteps(prev => {
            const newSteps = prev + 1;
            onStepsUpdate(newSteps + dailySteps); // Update parent with total steps
            return newSteps;
          });
          
          // Animate step counter
          Animated.sequence([
            Animated.timing(stepAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(stepAnim, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
        }
      });

      // Start pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } catch (error) {
      console.log('Accelerometer error:', error);
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
    
    if (accelerometerSubscription.current) {
      accelerometerSubscription.current.remove();
      accelerometerSubscription.current = null;
    }
    
    // Stop pulsing animation
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const resetSession = () => {
    setSessionSteps(0);
    onStepsUpdate(dailySteps); // Reset to daily steps only
  };

  useEffect(() => {
    return () => {
      if (accelerometerSubscription.current) {
        accelerometerSubscription.current.remove();
      }
    };
  }, []);

  const totalSteps = sessionSteps + dailySteps;
  const stepGoal = 3000;
  const progress = (totalSteps / stepGoal) * 100;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Step Counter</ThemedText>
        <ThemedText style={styles.closeButton} onPress={onClose}>
          ✕
        </ThemedText>
      </View>
      
      <View style={styles.content}>
        {/* Main Step Display */}
        <Animated.View 
          style={[
            styles.stepDisplay,
            {
              transform: [
                { scale: stepAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1],
                })},
                { scale: pulseAnim }
              ],
            }
          ]}
        >
          <ThemedText style={styles.stepNumber}>{totalSteps}</ThemedText>
          <ThemedText style={styles.stepLabel}>Total Steps</ThemedText>
        </Animated.View>

        {/* Session Steps */}
        <View style={styles.sessionCard}>
          <ThemedText style={styles.sessionTitle}>This Session</ThemedText>
          <ThemedText style={styles.sessionSteps}>{sessionSteps} steps</ThemedText>
        </View>

        {/* Daily Progress */}
        <View style={styles.progressCard}>
          <ThemedText style={styles.progressTitle}>Daily Goal Progress</ThemedText>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
          </View>
          <ThemedText style={styles.progressText}>
            {totalSteps} / {stepGoal} steps ({progress.toFixed(1)}%)
          </ThemedText>
        </View>

        {/* Control Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.controlButton,
              isTracking ? styles.stopButton : styles.startButton
            ]}
            onPress={isTracking ? stopTracking : startTracking}
          >
            <ThemedText style={styles.controlButtonText}>
              {isTracking ? 'Stop Tracking' : 'Start Tracking'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resetButton}
            onPress={resetSession}
          >
            <ThemedText style={styles.resetButtonText}>Reset Session</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Status Indicator */}
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusDot,
            { backgroundColor: isTracking ? '#2ECC71' : '#BDC3C7' }
          ]} />
          <ThemedText style={styles.statusText}>
            {isTracking ? 'Tracking Steps...' : 'Ready to Track'}
          </ThemedText>
        </View>
      </View>
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
    alignItems: 'center',
  },
  stepDisplay: {
    alignItems: 'center',
    marginBottom: 30,
  },
  stepNumber: {
    fontSize: 72,
    fontWeight: '200',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 18,
    color: '#666',
    fontWeight: '300',
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: '100%',
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
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  sessionSteps: {
    fontSize: 24,
    fontWeight: '300',
    color: '#2ECC71',
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2ECC71',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  controlButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
  },
  startButton: {
    backgroundColor: '#2ECC71',
  },
  stopButton: {
    backgroundColor: '#E74C3C',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
  },
  resetButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
}); 