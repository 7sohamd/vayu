import { useLocationTracker } from '@/hooks/useLocationTracker';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export const LocationTracker: React.FC = () => {
  const {
    isTracking,
    currentLocation,
    zoneAlertTriggered,
    distanceTravelled,
    startTracking,
    stopTracking,
    distanceThreshold,
  } = useLocationTracker();

  // Debug logging
  console.log('LocationTracker render:', {
    isTracking,
    currentLocation,
    hasLocation: !!currentLocation
  });

  // Animation refs for scanning effect
  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim3 = useRef(new Animated.Value(0)).current;

  const toggleTracking = () => {
    isTracking ? stopTracking() : startTracking();
  };

  // Scanning animation
  useEffect(() => {
    if (isTracking) {
      const startScanning = () => {
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim1, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim1, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.delay(600),
            Animated.timing(pulseAnim2, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim2, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.delay(1200),
            Animated.timing(pulseAnim3, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim3, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          if (isTracking) {
            startScanning(); // Loop the animation
          }
        });
      };

      startScanning();
    } else {
      // Reset animations when stopping
      pulseAnim1.setValue(0);
      pulseAnim2.setValue(0);
      pulseAnim3.setValue(0);
    }
  }, [isTracking]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        AQI Zone Tracker
      </ThemedText>

      <View style={styles.statusRow}>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: zoneAlertTriggered
                  ? '#FFD700'
                  : isTracking
                  ? '#2ECC71'
                  : '#BDC3C7',
              },
            ]}
          />
          
          {/* Scanning Animation */}
          {isTracking && (
            <View style={styles.scanningContainer}>
              <Animated.View
                style={[
                  styles.scanningCircle,
                  {
                    opacity: pulseAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 0],
                    }),
                    transform: [
                      {
                        scale: pulseAnim1.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 2.5],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.scanningCircle,
                  {
                    opacity: pulseAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 0],
                    }),
                    transform: [
                      {
                        scale: pulseAnim2.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 2.5],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.scanningCircle,
                  {
                    opacity: pulseAnim3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 0],
                    }),
                    transform: [
                      {
                        scale: pulseAnim3.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 2.5],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          )}
        </View>
        
        <ThemedText style={styles.statusText}>
          {zoneAlertTriggered
            ? '⚠️ AQI Alert Triggered'
            : isTracking
            ? 'Scanning Location...'
            : 'Idle'}
        </ThemedText>
      </View>

      {zoneAlertTriggered && (
        <View style={styles.alertBox}>
          <ThemedText style={styles.alertText}>
            ⚠️ You are entering a yellow AQI zone.
          </ThemedText>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isTracking ? '#E74C3C' : '#27AE60' },
        ]}
        onPress={toggleTracking}
      >
        <ThemedText style={styles.buttonText}>
          {isTracking ? 'Stop Monitoring' : 'Start Monitoring'}
        </ThemedText>
      </TouchableOpacity>

      {isTracking && (
        <View style={styles.debugBox}>
          <ThemedText style={styles.debugTitle}>Location Data</ThemedText>
          
          {currentLocation ? (
            <>
              <View style={styles.locationRow}>
                <ThemedText style={styles.locationLabel}>Latitude:</ThemedText>
                <ThemedText style={styles.locationValue}>
                  {currentLocation.latitude.toFixed(6)}
                </ThemedText>
              </View>
              
              <View style={styles.locationRow}>
                <ThemedText style={styles.locationLabel}>Longitude:</ThemedText>
                <ThemedText style={styles.locationValue}>
                  {currentLocation.longitude.toFixed(6)}
                </ThemedText>
              </View>
              
              {currentLocation.accuracy && (
                <View style={styles.locationRow}>
                  <ThemedText style={styles.locationLabel}>GPS Accuracy:</ThemedText>
                  <ThemedText style={[
                    styles.locationValue,
                    { color: currentLocation.accuracy <= 10 ? '#27AE60' : 
                             currentLocation.accuracy <= 20 ? '#F39C12' : '#E74C3C' }
                  ]}>
                    {currentLocation.accuracy.toFixed(1)}m
                  </ThemedText>
                </View>
              )}
            </>
          ) : (
            <ThemedText style={styles.noLocationText}>
              Acquiring location...
            </ThemedText>
          )}
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  statusContainer: {
    position: 'relative',
    marginRight: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  scanningContainer: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningCircle: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2ECC71',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  alertBox: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFD54F',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    width: '100%',
  },
  alertText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#795548',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  debugBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#f4f6f7',
    width: '100%',
    alignItems: 'center',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 10,
  },
  locationValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  noLocationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
});
