import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

export const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  error,
  multiline = false,
  numberOfLines = 1,
  clearable = false,
  style,
  inputStyle,
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.cardAlt,
            borderColor: error
              ? theme.danger
              : isFocused
              ? theme.primary
              : theme.border,
          },
          multiline && { minHeight: numberOfLines * 24 + 20, alignItems: 'flex-start' },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={isFocused ? theme.primary : theme.textMuted}
            style={[styles.icon, multiline && { marginTop: SPACING.sm }]}
          />
        )}

        <TextInput
          style={[
            styles.textInput,
            { color: theme.text },
            multiline && { textAlignVertical: 'top' },
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          {...props}
        />

        {clearable && value ? (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? (
        <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  textInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: 15,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    marginTop: 4,
  },
});
