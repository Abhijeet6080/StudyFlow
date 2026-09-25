import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS, getShadow } from '../../constants/theme';

export const Card = ({
  children,
  style,
  onPress,
  variant = 'default', // 'default', 'outlined', 'elevated'
  accentColor,
  padding = SPACING.lg,
  ...props
}) => {
  const { theme, isDark } = useTheme();

  const ContainerComponent = onPress ? TouchableOpacity : View;

  const getVariantStyle = () => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: theme.border,
        };
      case 'elevated':
        return {
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: theme.border,
          ...getShadow(isDark, 4),
        };
      default:
        return {
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: theme.border,
          ...getShadow(isDark, 2),
        };
    }
  };

  return (
    <ContainerComponent
      style={[
        styles.base,
        getVariantStyle(),
        { padding },
        accentColor ? { borderLeftWidth: 4, borderLeftColor: accentColor } : null,
        style,
      ]}
      activeOpacity={onPress ? 0.75 : 1}
      onPress={onPress}
      {...props}
    >
      {children}
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginVertical: SPACING.xs,
  },
});
