import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';

export const Header = ({
  title,
  subtitle,
  rightIcon,
  onRightPress,
  rightElement,
  showThemeToggle = false,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.textContainer}>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </Text>
        )}
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.rightActions}>
        {showThemeToggle && (
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={20}
              color={isDark ? theme.accent : theme.primary}
            />
          </TouchableOpacity>
        )}

        {rightElement}

        {rightIcon && onRightPress && (
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={onRightPress}
            activeOpacity={0.7}
          >
            <Ionicons name={rightIcon} size={20} color={theme.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  textContainer: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  subtitle: {
    ...TYPOGRAPHY.overline,
    marginBottom: 2,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
