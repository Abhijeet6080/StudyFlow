import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

/**
 * ModalWrapper — bottom-sheet modal with reliable Android keyboard handling.
 *
 * Root cause of the previous keyboard-overlap bug:
 *   React Native's Modal on Android runs inside an Android Dialog window whose
 *   soft-input mode is SOFT_INPUT_ADJUST_NOTHING by default. This means Android
 *   never resizes or repositions the Dialog when the keyboard appears.
 *   KeyboardAvoidingView (regardless of behavior="height" or "padding") relies on
 *   a window-resize event that never fires inside a Modal on Android, so it has
 *   zero effect.
 *
 * Fix:
 *   Subscribe to Keyboard.addListener('keyboardDidShow' / 'keyboardDidHide').
 *   These events fire via the system InputMethodManager regardless of window mode.
 *   When the keyboard appears we record its pixel height, then add that as
 *   paddingBottom to the flex-end backdrop — which pushes the modal card up
 *   exactly above the keyboard without any native-layer changes or new packages.
 *
 *   The internal ScrollView (keyboardShouldPersistTaps="handled") then lets the
 *   user scroll any input into view while the keyboard is open.
 */
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
  const scrollRef = useRef(null);
  const [kbHeight, setKbHeight] = useState(0);

  useEffect(() => {
    // Use keyboardWillShow on iOS for a smoother simultaneous animation.
    // On Android keyboardDidShow is the reliable event (will* events don't fire).
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKbHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKbHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Reset keyboard state whenever the modal closes (e.g. user pressed Cancel).
  useEffect(() => {
    if (!visible) setKbHeight(0);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      {/*
        Outer TouchableWithoutFeedback dismisses the modal when the backdrop is tapped.
        The paddingBottom on the backdrop View pushes the modal card above the keyboard.
        justifyContent: 'flex-end' positions the card at the bottom; adding paddingBottom
        equal to the keyboard height moves the card's bottom edge up to sit just above
        the keyboard.
      */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.backdrop, { paddingBottom: kbHeight }]}>

          {/* Inner TouchableWithoutFeedback prevents backdrop-tap from propagating
              through the card itself. */}
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  // When keyboard is open, cap the card height so it does not
                  // overflow above the visible area of the screen.
                  maxHeight: kbHeight > 0 ? '70%' : maxHeight,
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

              {/* Scrollable Body
                  keyboardShouldPersistTaps="handled" keeps the keyboard open when
                  the user taps another field or a button inside the scroll area.
                  The extra paddingBottom ensures the last field is not hidden behind
                  the sticky footer when the user has scrolled to the bottom.
              */}
              <ScrollView
                ref={scrollRef}
                style={styles.body}
                contentContainerStyle={[
                  styles.scrollContent,
                  // Add a little extra breathing room below the last input so it
                  // is never hidden behind the footer buttons.
                  { paddingBottom: SPACING.xl + 8 },
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
              >
                {children}
              </ScrollView>

              {/* Sticky Footer */}
              {footer ? (
                <View style={[styles.footer, { borderTopColor: theme.border }]}>
                  {footer}
                </View>
              ) : null}
            </View>
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
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
  },
});
