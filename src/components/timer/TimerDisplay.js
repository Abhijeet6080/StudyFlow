import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, RADIUS, getShadow } from '../../constants/theme';
import { formatSecondsToTimer } from '../../utils/helpers';

export const TimerDisplay = ({
  secondsLeft,
  totalSeconds,
  isRunning,
  mode, // 'pomodoro', 'shortBreak', 'longBreak'
  subjectColor,
}) => {
  const { theme, isDark } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let animation;
    if (isRunning) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.04,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [isRunning]);

  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const activeColor =
    mode === 'pomodoro'
      ? subjectColor || theme.primary
      : mode === 'shortBreak'
      ? theme.success
      : theme.secondary;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.outerCircle,
          {
            backgroundColor: theme.card,
            borderColor: activeColor,
            transform: [{ scale: pulseAnim }],
          },
          getShadow(isDark, 4),
        ]}
      >
        <View
          style={[
            styles.innerCircle,
            {
              backgroundColor: theme.cardAlt,
              borderColor: `${activeColor}30`,
            },
          ]}
        >
          <Text
            style={[
              styles.modeLabel,
              { color: activeColor },
            ]}
          >
            {mode === 'pomodoro'
              ? 'FOCUS SESSION'
              : mode === 'shortBreak'
              ? 'SHORT BREAK'
              : 'LONG BREAK'}
          </Text>

          <Text style={[styles.timerText, { color: theme.text }]}>
            {formatSecondsToTimer(secondsLeft)}
          </Text>

          <Text style={[styles.statusText, { color: theme.textSecondary }]}>
            {isRunning ? 'Keep going!' : 'Ready to start'}
          </Text>

          {/* Mini progress bar under timer */}
          <View style={[styles.miniTrack, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.miniFill,
                {
                  width: `${Math.round(progress * 100)}%`,
                  backgroundColor: activeColor,
                },
              ]}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  outerCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 226,
    height: 226,
    borderRadius: 113,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modeLabel: {
    ...TYPOGRAPHY.overline,
    fontWeight: '700',
    marginBottom: 6,
  },
  timerText: {
    fontSize: 52,
    fontWeight: '800',
    letterSpacing: -1,
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    marginTop: 6,
  },
  miniTrack: {
    width: 110,
    height: 5,
    borderRadius: RADIUS.full,
    marginTop: 14,
    overflow: 'hidden',
  },
  miniFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
});
