import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

export const Button = ({
  title,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger', 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const { theme } = useTheme();

  const getContainerStyle = () => {
    let bg = theme.primary;
    let border = 'transparent';

    switch (variant) {
      case 'primary':
        bg = theme.primary;
        break;
      case 'secondary':
        bg = theme.primaryLight;
        break;
      case 'outline':
        bg = 'transparent';
        border = theme.border;
        break;
      case 'danger':
        bg = theme.danger;
        break;
      case 'ghost':
        bg = 'transparent';
        break;
    }

    const paddingVertical = size === 'sm' ? 8 : size === 'lg' ? 14 : 11;
    const paddingHorizontal = size === 'sm' ? 12 : size === 'lg' ? 22 : 16;

    return {
      backgroundColor: bg,
      borderColor: border,
      borderWidth: variant === 'outline' ? 1.5 : 0,
      paddingVertical,
      paddingHorizontal,
      borderRadius: RADIUS.md,
      opacity: disabled || loading ? 0.6 : 1,
      alignSelf: fullWidth ? 'stretch' : 'auto',
    };
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return '#FFFFFF';
      case 'secondary':
        return theme.primary;
      case 'outline':
        return theme.text;
      case 'ghost':
        return theme.primary;
      default:
        return '#FFFFFF';
    }
  };

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;
  const textColor = getTextColor();

  return (
    <TouchableOpacity
      style={[styles.button, getContainerStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={iconSize} color={textColor} style={styles.leftIcon} />
          )}
          {title ? (
            <Text
              style={[
                styles.text,
                size === 'sm' ? TYPOGRAPHY.bodySmall : TYPOGRAPHY.bodyBold,
                { color: textColor },
                textStyle,
              ]}
            >
              {title}
            </Text>
          ) : null}
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={iconSize} color={textColor} style={styles.rightIcon} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  rightIcon: {
    marginLeft: SPACING.sm,
  },
});
