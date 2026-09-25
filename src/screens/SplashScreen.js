import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { TYPOGRAPHY, RADIUS } from '../constants/theme';

export const SplashScreen = ({ onFinish }) => {
  const { theme } = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) onFinish();
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
          },
        ]}
      >
        <View style={[styles.logoBox, { backgroundColor: theme.primary }]}>
          <Ionicons name="school" size={44} color="#FFFFFF" />
        </View>

        <Text style={[styles.appName, { color: theme.text }]}>StudyFlow</Text>
        <Text style={[styles.tagline, { color: theme.textSecondary }]}>
          Organize. Focus. Excel.
        </Text>

        <View style={styles.pillContainer}>
          <View style={[styles.pill, { backgroundColor: theme.cardAlt }]}>
            <Text style={[styles.pillText, { color: theme.primary }]}>
              College Academic Companion
            </Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={[styles.footerText, { color: theme.textMuted }]}>
          v1.0 • Offline Ready
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoBox: {
    width: 90,
    height: 90,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: {
    ...TYPOGRAPHY.h1,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    ...TYPOGRAPHY.body,
    marginTop: 6,
    fontSize: 16,
  },
  pillContainer: {
    marginTop: 24,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  pillText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 36,
  },
  footerText: {
    ...TYPOGRAPHY.caption,
  },
});
