import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

// Setup notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useLocationTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [zoneAlertTriggered, setZoneAlertTriggered] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy?: number;
  } | null>(null);
  const [distanceTravelled, setDistanceTravelled] = useState(0);

  const initialLocation = useRef<{ latitude: number; longitude: number } | null>(null);
  const lastNotificationTime = useRef(0);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const accelerometerSubscription = useRef<any>(null);
  const lastAccelerometerData = useRef<{ x: number; y: number; z: number } | null>(null);
  const movementSteps = useRef(0);
  const estimatedDistance = useRef(0);

  const distanceThreshold = 20; // meters
  const cooldown = 30000; // ms between notifications
  const stepDistance = 0.7; // estimated meters per step

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // meters
  };

  const detectStep = (currentData: { x: number; y: number; z: number }) => {
    if (!lastAccelerometerData.current) {
      lastAccelerometerData.current = currentData;
      return false;
    }

    // Calculate magnitude of acceleration
    const currentMagnitude = Math.sqrt(
      currentData.x ** 2 + currentData.y ** 2 + currentData.z ** 2
    );
    const lastMagnitude = Math.sqrt(
      lastAccelerometerData.current.x ** 2 + 
      lastAccelerometerData.current.y ** 2 + 
      lastAccelerometerData.current.z ** 2
    );

    // Detect significant change in acceleration (potential step)
    const accelerationChange = Math.abs(currentMagnitude - lastMagnitude);
    const stepThreshold = 0.5; // Adjust based on testing

    if (accelerationChange > stepThreshold) {
      movementSteps.current++;
      estimatedDistance.current = movementSteps.current * stepDistance;
      console.log('Step detected! Total steps:', movementSteps.current, 'Estimated distance:', estimatedDistance.current.toFixed(2), 'm');
      return true;
    }

    lastAccelerometerData.current = currentData;
    return false;
  };

  const requestPermissions = async () => {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        Alert.alert('Location Permission Required', 'Please enable location permissions to use this feature.');
        return false;
      }

      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
        console.log('Background location permission not granted, using foreground only');
      }

      return true;
    } catch (error) {
      console.log('Permission request error:', error);
      return false;
    }
  };

  const showAQIZoneAlert = async () => {
    const now = Date.now();
    if (now - lastNotificationTime.current < cooldown) return;

    lastNotificationTime.current = now;
    setZoneAlertTriggered(true);

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⚠️ AQI Zone Alert!',
          body: 'You are entering a yellow AQI zone.',
          sound: 'default',
        },
        trigger: null,
      });
    } catch {
      Alert.alert('⚠️ AQI Zone Alert!', 'You are entering a yellow AQI zone.');
    }

    setTimeout(() => setZoneAlertTriggered(false), 5000);
  };

  const startTracking = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return;
    }

    setIsTracking(true);
    setZoneAlertTriggered(false);
    setDistanceTravelled(0);
    movementSteps.current = 0;
    estimatedDistance.current = 0;
    lastAccelerometerData.current = null;

    console.log('Starting hybrid tracking (GPS + Accelerometer)...');

    // Start accelerometer tracking
    try {
      accelerometerSubscription.current = Accelerometer.addListener((data) => {
        if (detectStep(data)) {
          // Update distance based on steps
          setDistanceTravelled(estimatedDistance.current);
          
          // Check if threshold reached
          if (estimatedDistance.current >= distanceThreshold) {
            console.log('Threshold reached via steps! Triggering alert...');
            showAQIZoneAlert();
          }
        }
      });

      console.log('Accelerometer tracking started');
    } catch (error) {
      console.log('Accelerometer error:', error);
    }

    // Try to get GPS location (but don't fail if accuracy is poor)
    try {
      const initialPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude, accuracy } = initialPosition.coords;

      console.log('GPS position obtained:', {
        latitude: latitude.toFixed(6),
        longitude: longitude.toFixed(6),
        accuracy: accuracy?.toFixed(1)
      });

      // Always set initial location for UI display
      initialLocation.current = { latitude, longitude };
      setCurrentLocation({ latitude, longitude, accuracy: accuracy || undefined });
      console.log('Initial location set in UI');

      // Only use GPS for distance calculation if accuracy is reasonable
      if (!accuracy || accuracy <= 50) {
        // Start GPS watching
        locationSubscription.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 5,
          },
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            
            console.log('GPS update:', {
              latitude: latitude.toFixed(6),
              longitude: longitude.toFixed(6),
              accuracy: accuracy?.toFixed(1)
            });

            // Always update current location for UI display
            setCurrentLocation({ latitude, longitude, accuracy: accuracy || undefined });
            console.log('Location updated in UI');

            // Only use GPS for distance calculation if accuracy is good
            if (!accuracy || accuracy <= 30) {
              if (initialLocation.current) {
                const gpsDistance = calculateDistance(
                  initialLocation.current.latitude,
                  initialLocation.current.longitude,
                  latitude,
                  longitude
                );

                console.log('GPS distance from start:', gpsDistance.toFixed(2), 'm');
                
                // Use the larger of GPS distance or step distance
                const finalDistance = Math.max(gpsDistance, estimatedDistance.current);
                setDistanceTravelled(finalDistance);

                if (finalDistance >= distanceThreshold) {
                  console.log('Threshold reached! Triggering alert...');
                  showAQIZoneAlert();
                }
              }
            }
          }
        );

        console.log('GPS tracking started');
      } else {
        console.log('GPS accuracy too poor for distance calculation, using accelerometer only');
      }
    } catch (error) {
      console.log('GPS error, using accelerometer only:', error);
    }

    console.log('Hybrid tracking started successfully');
  };

  const stopTracking = () => {
    console.log('Stopping hybrid tracking...');
    setIsTracking(false);
    setZoneAlertTriggered(false);
    setDistanceTravelled(0);
    movementSteps.current = 0;
    estimatedDistance.current = 0;
    initialLocation.current = null;
    lastAccelerometerData.current = null;
    
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }

    if (accelerometerSubscription.current) {
      accelerometerSubscription.current.remove();
      accelerometerSubscription.current = null;
    }

    console.log('Tracking stopped');
  };

  useEffect(() => {
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
      if (accelerometerSubscription.current) {
        accelerometerSubscription.current.remove();
      }
    };
  }, []);

  return {
    isTracking,
    currentLocation,
    zoneAlertTriggered,
    distanceTravelled,
    distanceThreshold,
    startTracking,
    stopTracking,
  };
};
