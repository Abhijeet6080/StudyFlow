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
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

/**
 * ModalWrapper — bottom-sheet modal with reliable Android keyboard handling.
 *
 * ─── WHY KeyboardAvoidingView DOES NOT WORK INSIDE A MODAL ON ANDROID ────────
 * React Native's <Modal> on Android creates a separate Android Dialog window.
 * The Dialog's soft-input mode defaults to SOFT_INPUT_ADJUST_NOTHING, so Android
 * never resizes or repositions the Dialog when the keyboard appears.
 * KeyboardAvoidingView listens to window-layout-change events that never fire
 * inside a Dialog, so it produces zero adjustment regardless of `behavior` value.
 *
 * ─── PREVIOUS FIX AND WHY IT BROKE LAYOUT ────────────────────────────────────
 * The previous attempt added `paddingBottom: kbHeight` to the backdrop and
 * `maxHeight: '70%'` when the keyboard was open. This had two compounding bugs:
 *
 *   1. In React Native, %-based maxHeight is computed against the PARENT'S
 *      CONTENT HEIGHT (total height minus padding). Adding `paddingBottom:302`
 *      reduces the backdrop's content height from 914dp to 612dp. Then
 *      `maxHeight: '70%' = 0.70 × 612 = 428dp` — far too small for the form.
 *
 *   2. The ScrollView's `body` style had no `flex:1`. Without a bounded height
 *      on the ScrollView itself, React Native cannot enable scrolling — the
 *      content is simply clipped at the parent's maxHeight with no scroll handle.
 *      Result: only the top fragment of the first input was visible.
 *
 * ─── CORRECT APPROACH ────────────────────────────────────────────────────────
 * • Keep the backdrop full-screen (no paddingBottom — this was the source of
 *   the compression bug).
 * • Apply `marginBottom: kbHeight` to the MODAL CARD instead. With the backdrop
 *   using justifyContent:'flex-end', the card is bottom-aligned; marginBottom
 *   lifts its bottom edge to sit exactly on top of the keyboard.
 * • Compute `maxHeight` from real screen dimensions (useWindowDimensions) plus
 *   the safe-area top inset, so the card can never overflow above the status bar
 *   and always uses the maximum available space between safe-area and keyboard.
 * • Add `flex:1` to the ScrollView so it expands to fill the remaining height
 *   inside the bounded modal card and becomes properly scrollable.
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
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
  const [kbHeight, setKbHeight] = useState(0);

  useEffect(() => {
    // keyboardWillShow fires before the keyboard appears on iOS (smoother).
    // On Android only keyboardDidShow is reliable; Will* events do not fire.
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

  // Reset keyboard height when the modal is dismissed.
  useEffect(() => {
    if (!visible) setKbHeight(0);
  }, [visible]);

  // ── Modal card max-height calculation ──────────────────────────────────────
  //
  // When keyboard is CLOSED:
  //   Use the `maxHeight` prop (default '85%' of screen height).
  //   This is identical to the original design — no visual change.
  //
  // When keyboard is OPEN:
  //   The available vertical space is:
  //     screenHeight  (full screen, backdrop is flex:1)
  //     - kbHeight    (keyboard occupies bottom portion)
  //     - insets.top  (safe-area/status-bar at the top)
  //     - 12          (breathing gap so card doesn't touch the status bar)
  //
  //   This guarantees the card fills every available pixel above the keyboard
  //   without overflowing behind the status bar, regardless of device or
  //   keyboard size.
  //
  // NOTE: Do NOT subtract kbHeight from the backdrop (paddingBottom) — that
  //       was the bug. The backdrop stays full-screen; only marginBottom on the
  //       card changes to lift it above the keyboard.
  const resolvedMaxHeight =
    kbHeight > 0
      ? screenHeight - kbHeight - insets.top - 12
      : typeof maxHeight === 'string' && maxHeight.endsWith('%')
      ? screenHeight * (parseFloat(maxHeight) / 100)
      : typeof maxHeight === 'number'
      ? maxHeight
      : screenHeight * 0.85;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      {/*
        Backdrop: full-screen overlay, card anchored to bottom.
        NO paddingBottom here — that was causing the compression bug.
        The backdrop must stay flex:1 at full height so that the %-based
        max-height on the card calculates against the full screen height.
      */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>

          {/* Prevent backdrop-tap from closing when touching the card. */}
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  maxHeight: resolvedMaxHeight,
                  // marginBottom lifts the card's bottom edge above the keyboard.
                  // With justifyContent:'flex-end' on the backdrop, the card is
                  // bottom-aligned. Adding marginBottom:kbHeight shifts it upward
                  // by exactly the keyboard height — no gap, no overlap.
                  marginBottom: kbHeight,
                },
              ]}
            >
              {/* ── Drag Handle ─────────────────────────────────────────────── */}
              <View style={styles.handleContainer}>
                <View
                  style={[
                    styles.handle,
                    { backgroundColor: theme.mode === 'dark' ? '#334155' : '#CBD5E1' },
                  ]}
                />
              </View>

              {/* ── Header ──────────────────────────────────────────────────── */}
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

              {/* ── Scrollable Body ─────────────────────────────────────────── */}
              {/*
                flex:1 is CRITICAL here. Without it, React Native does not give
                the ScrollView a bounded height, so the content is only clipped
                (not scrollable). With flex:1, the ScrollView expands to fill the
                remaining space inside the max-height-bounded modal card, making
                all inputs reachable via scroll.

                keyboardShouldPersistTaps="handled" keeps the keyboard open when
                the user taps another input or a non-keyboard-dismissing element.

                keyboardDismissMode="on-drag" lets the user swipe down to dismiss
                the keyboard without closing the modal.
              */}
              <ScrollView
                ref={scrollRef}
                style={styles.body}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
              >
                {children}
              </ScrollView>

              {/* ── Sticky Footer ────────────────────────────────────────────── */}
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
    // No height or flex here — the card sizes itself from content, bounded
    // by maxHeight (which is computed dynamically in the component body).
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
    // flex:1 makes the ScrollView fill the remaining vertical space inside the
    // modal card after the handle, header, and footer have taken their fixed
    // heights. This is what enables actual scrolling when content overflows.
    flex: 1,
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
