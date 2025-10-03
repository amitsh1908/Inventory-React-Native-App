// SplashScreen.js
// Clean, simple layout: title -> subtitle -> logo (no border) -> rotating loader -> workspace line

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from 'react-native';

const { width } = Dimensions.get('window');
const LOGO_SIZE = Math.min(220, Math.round(width * 0.5));

export default function SplashScreen({ navigation }) {
  const scale = useRef(new Animated.Value(0.95)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Intro animations: text fade + slight logo pop
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => navigation.replace('Main'), 3000);
    return () => clearTimeout(timer);
  }, [navigation, opacity, scale, rotate]);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.container}>
        <View style={styles.bgAccent} />

        {/* Title ) */}
        <Animated.View style={{ opacity }}>
          <Text style={styles.title}>Flikt Inventory App</Text>
          
        </Animated.View>

        
        <Animated.Image
          source={require('../../log.png')}
          style={[styles.logo, { width: LOGO_SIZE, height: LOGO_SIZE, transform: [{ scale }] }]}
          resizeMode="contain"
        />

        {/* Rotating loader */}
        <Animated.View style={[styles.loader, { transform: [{ rotate: rotateInterpolate }] }]}> 
          <View style={styles.loaderInner} />
        </Animated.View>

        {/* Workspace text */}
        <Text style={styles.workspaceLine}>Preparing your workspace...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000000' },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#0f1115',
  },
  bgAccent: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: '#15202b',
    top: -100,
    right: -100,
    opacity: 0.32,
    transform: [{ rotate: '20deg' }],
  },
  logo: {
    marginTop: 18,
    marginBottom: 12,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: '#cfd9e4',
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    textAlign: 'center',
    fontWeight: '600',
  },
  loader: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.12)',
    borderTopColor: '#5bd6ff',
    marginTop: 10,
  },
  loaderInner: { flex: 1 },
  workspaceLine: {
    marginTop: 14,
    fontSize: 14,
    color: '#9aa9bb',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
});