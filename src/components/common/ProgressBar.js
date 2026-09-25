import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { clamp } from '../../utils/helpers';

export const ProgressBar = ({
  progress = 0, // 0 to 100
  color,
  height = 8,
  showLabel = false,
  label,
  style,
}) => {
  const { theme } = useTheme();
  const safeProgress = clamp(progress, 0, 100);
  const animatedWidth = useRef(new Animated.Value(safeProgress)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: safeProgress,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [safeProgress]);

  const activeColor = color || theme.primary;
  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, style]}>
      {(showLabel || label) && (
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            {label || 'Progress'}
          </Text>
          <Text style={[styles.percent, { color: theme.text }]}>
            {Math.round(safeProgress)}%
          </Text>
        </View>
      )}

      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: theme.mode === 'dark' ? '#1E293B' : '#E2E8F0',
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthInterpolated,
              backgroundColor: activeColor,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    ...TYPOGRAPHY.caption,
  },
  percent: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  track: {
    width: '100%',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: RADIUS.full,
  },
});
