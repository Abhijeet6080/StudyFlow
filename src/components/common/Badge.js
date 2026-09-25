import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { PRIORITY_CONFIG } from '../../constants/colors';

export const Badge = ({
  label,
  color,
  bgColor,
  icon,
  size = 'md', // 'sm', 'md'
  variant = 'default', // 'default', 'priority', 'countdown'
  priority,
  style,
}) => {
  const { isDark } = useTheme();

  let resolvedColor = color || '#4F46E5';
  let resolvedBg = bgColor || '#EEF2FF';
  let resolvedIcon = icon;

  if (variant === 'priority' && priority && PRIORITY_CONFIG[priority]) {
    const p = PRIORITY_CONFIG[priority];
    resolvedColor = p.color;
    resolvedBg = isDark ? p.bgDark : p.bgLight;
    resolvedIcon = p.icon;
  }

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: resolvedBg,
          paddingVertical: isSmall ? 3 : 5,
          paddingHorizontal: isSmall ? 8 : 10,
        },
        style,
      ]}
    >
      {resolvedIcon ? (
        <Ionicons
          name={resolvedIcon}
          size={isSmall ? 12 : 14}
          color={resolvedColor}
          style={styles.icon}
        />
      ) : null}
      <Text
        style={[
          isSmall ? TYPOGRAPHY.caption : TYPOGRAPHY.bodySmall,
          { color: resolvedColor, fontWeight: '600' },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: RADIUS.full,
  },
  icon: {
    marginRight: 4,
  },
});
