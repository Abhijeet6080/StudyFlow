import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { RADIUS, TYPOGRAPHY } from '../../constants/theme';

export const QuickActionButton = ({
  icon,
  label,
  color,
  bgColor,
  onPress,
  badge,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: bgColor || theme.cardAlt,
            borderColor: color ? `${color}40` : theme.border,
          },
        ]}
      >
        <Ionicons name={icon} size={22} color={color || theme.primary} />
        {badge !== undefined && (
          <View style={[styles.badge, { backgroundColor: theme.primary }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.label, { color: theme.text }]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// Re-export QuickAction for backward compatibility
export const QuickAction = QuickActionButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    minWidth: 64,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    position: 'relative',
  },
  label: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 11,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
