import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

export const ParticleBackground: React.FC = () => {
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