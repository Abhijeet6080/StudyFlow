import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

export const ModalWrapper = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxHeight = '85%',
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={[
                styles.modalCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  maxHeight,
                },
              ]}
            >
              {/* Drag Handle Indicator */}
              <View style={styles.handleContainer}>
                <View
                  style={[
                    styles.handle,
                    { backgroundColor: theme.mode === 'dark' ? '#334155' : '#CBD5E1' },
                  ]}
                />
              </View>

              {/* Header */}
              <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <View style={styles.headerTitleContainer}>
                  <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
                  {subtitle ? (
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                      {subtitle}
                    </Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  style={[
                    styles.closeBtn,
                    {
                      backgroundColor: theme.cardAlt,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={18} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Scrollable Body */}
              <ScrollView
                style={styles.body}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {children}
              </ScrollView>

              {/* Sticky Footer */}
              {footer ? (
                <View style={[styles.footer, { borderTopColor: theme.border }]}>
                  {footer}
                </View>
              ) : null}
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    width: '100%',
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: SPACING.sm,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  headerTitleContainer: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h3,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: SPACING.lg,
  },
  scrollContent: {
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
  },
});
