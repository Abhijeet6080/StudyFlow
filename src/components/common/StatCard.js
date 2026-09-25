import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS, TYPOGRAPHY, getShadow } from '../../constants/theme';

export const StatCard = ({
  icon,
  iconColor,
  iconBg,
  label,
  value,
  subtext,
  style,
}) => {
  const { theme, isDark } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
        getShadow(isDark, 2),
        style,
      ]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: iconBg || theme.primaryLight },
          ]}
        >
          <Ionicons
            name={icon}
            size={18}
            color={iconColor || theme.primary}
          />
        </View>
        <Text style={[styles.label, { color: theme.textSecondary }]} numberOfLines={1}>
          {label}
        </Text>
      </View>

      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
      {subtext ? (
        <Text style={[styles.subtext, { color: theme.textMuted }]} numberOfLines={1}>
          {subtext}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    flex: 1,
    minWidth: 140,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    flex: 1,
  },
  value: {
    ...TYPOGRAPHY.h2,
    marginTop: 2,
  },
  subtext: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
});
