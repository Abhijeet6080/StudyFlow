/**
 * ModalWrapper.js — bottom-sheet modal with correct per-platform keyboard handling.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * DIAGNOSIS HISTORY
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * ORIGINAL BUG (keyboard overlapping form):
 *   KeyboardAvoidingView inside a Modal has zero effect on Android because
 *   the mechanism it relies on (window-layout-change events) does not fire
 *   inside a Modal Dialog on Android. The keyboard literally overlaid the form.
 *
 * FIX ATTEMPT 1 (paddingBottom on backdrop + maxHeight:'70%'):
 *   Bug A — %-based maxHeight is computed against the parent's CONTENT height
 *     (total minus padding). paddingBottom:302 shrank backdrop content height
 *     from 914→612dp. 70%×612 = 428dp → modal too small.
 *   Bug B — ScrollView had no flex:1, so it had no bounded height and
 *     couldn't scroll; content was just clipped.
 *
 * FIX ATTEMPT 2 (marginBottom:kbHeight + maxHeight = screenH - kbH - insets - 12):
 *   NEW BUG — double-counting the keyboard offset.
 *
 *   On Android (Expo SDK 50+ / RN 0.73+), the Modal Dialog window is set to
 *   SOFT_INPUT_ADJUST_RESIZE. When the keyboard opens the OS physically SHRINKS
 *   the Dialog window. Two consequences:
 *
 *     (a) useWindowDimensions().height ALREADY returns the REDUCED height
 *         (e.g., 914 → 612dp). Subtracting kbHeight again:
 *         612 - 302 - 24 - 12 = 274dp → absurdly small modal → clipped form.
 *
 *     (b) The backdrop (flex:1) already fills the shrunken window, so the card
 *         (justifyContent:'flex-end') is ALREADY sitting above the keyboard.
 *         Adding marginBottom:kbHeight pushes it ANOTHER 302dp upward inside a
 *         612dp window → bottom of card is at 612-302 = 310dp from window-top,
 *         keyboard starts at 612dp → gap of 302dp between card and keyboard.
 *
 *   This is exactly the reported symptom: "modal mid/top of screen, huge empty
 *   gap, form severely clipped."
 *
 * CORRECT FIX (this file):
 *   Android: The OS already lifts the card above the keyboard. Do NOT apply
 *     marginBottom or subtract kbHeight from the maxHeight. Simply use the
 *     maxHeight prop (default 85%) against the already-adjusted screenHeight
 *     returned by useWindowDimensions(). flex:1 on the ScrollView enables
 *     proper scrolling within the bounded card.
 *
 *   iOS: The Modal window does NOT resize. Apply marginBottom:kbHeight to lift
 *     the card, and compute maxHeight as screenHeight - kbHeight - insets.top.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * DIAGNOSTIC LOGGING (TEMPORARY — remove after verification)
 * ═══════════════════════════════════════════════════════════════════════════════
 *   Set ENABLE_DIAGNOSTICS = true to print runtime measurements to the Metro
 *   console. Read the values in the terminal while running `npx expo start`.
 *   Once verified, set back to false (or remove the block).
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

// ─── Toggle this to print runtime dimension measurements to Metro console ─────
const ENABLE_DIAGNOSTICS = true;
// ─────────────────────────────────────────────────────────────────────────────

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

  // useWindowDimensions() is reactive: on Android it returns the REDUCED height
  // when the keyboard is open (because the Dialog window resized). On iOS it
  // returns the full screen height regardless of keyboard state.
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);

  // kbHeight is only used on iOS (Android relies on window resize).
  const [kbHeight, setKbHeight] = useState(0);

  useEffect(() => {
    // ── iOS: 'will' events fire before the keyboard animates in → smoother.
    // ── Android: 'did' events are reliable; 'will' events never fire.
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      const kbH = e.endCoordinates.height;
      setKbHeight(kbH);

      if (ENABLE_DIAGNOSTICS) {
        const winDim = Dimensions.get('window');
        const scrDim = Dimensions.get('screen');
        console.log('\n╔══════════ [ModalWrapper DIAGNOSTIC] keyboard OPEN ══════════');
        console.log('║  platform                    :', Platform.OS);
        console.log('║  e.endCoordinates.height     :', kbH.toFixed(1), 'dp  (keyboard height from event)');
        console.log('║  Dimensions.get(window).h    :', winDim.height.toFixed(1), 'dp  (may already be reduced on Android)');
        console.log('║  Dimensions.get(screen).h    :', scrDim.height.toFixed(1), 'dp  (always full physical screen)');
        console.log('║  useWindowDimensions().h     :', screenHeight.toFixed(1), 'dp  (captured before this render cycle)');
        console.log('║  insets.top                  :', insets.top.toFixed(1), 'dp');
        console.log('╚═════════════════════════════════════════════════════════════\n');
      }
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKbHeight(0);
      if (ENABLE_DIAGNOSTICS) {
        const winDim = Dimensions.get('window');
        console.log('\n╔══════════ [ModalWrapper DIAGNOSTIC] keyboard CLOSED ════════');
        console.log('║  Dimensions.get(window).h    :', winDim.height.toFixed(1), 'dp  (should be restored to full)');
        console.log('╚═════════════════════════════════════════════════════════════\n');
      }
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset when modal closes.
  useEffect(() => {
    if (!visible) setKbHeight(0);
  }, [visible]);

  // ── maxHeight calculation ──────────────────────────────────────────────────
  //
  // ANDROID:
  //   useWindowDimensions().height is already the keyboard-adjusted height
  //   (the OS shrank the Dialog window). We simply cap at maxHeight% of
  //   screenHeight — no kbHeight subtraction needed or correct here.
  //   marginBottom on the card = 0 (card is already above the keyboard).
  //
  // iOS:
  //   useWindowDimensions().height is always the full screen height.
  //   We must manually compute the available space: screenHeight - kbHeight.
  //   marginBottom:kbHeight lifts the card above the keyboard.
  //
  const baseMaxHeight = (() => {
    if (typeof maxHeight === 'string' && maxHeight.endsWith('%')) {
      return screenHeight * (parseFloat(maxHeight) / 100);
    }
    if (typeof maxHeight === 'number') return maxHeight;
    return screenHeight * 0.85;
  })();

  const resolvedMaxHeight =
    Platform.OS === 'ios' && kbHeight > 0
      ? screenHeight - kbHeight - insets.top - 8
      : baseMaxHeight;

  // Only iOS needs to manually push the card above the keyboard.
  const cardMarginBottom = Platform.OS === 'ios' ? kbHeight : 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      {/*
        Backdrop: full available window, card anchored to bottom.
        On Android, when keyboard opens the OS shrinks the Dialog window so
        this backdrop automatically becomes shorter — no extra adjustment needed.
      */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>

          {/* Prevent card touches from bubbling to the backdrop dismiss handler. */}
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  maxHeight: resolvedMaxHeight,
                  // iOS only: push card above keyboard.
                  // Android: leave at 0 — OS already handles it.
                  marginBottom: cardMarginBottom,
                },
              ]}
              onLayout={(e) => {
                if (ENABLE_DIAGNOSTICS) {
                  const { x, y, width, height } = e.nativeEvent.layout;
                  console.log('[ModalWrapper DIAGNOSTIC] card onLayout →',
                    `x:${x.toFixed(0)} y:${y.toFixed(0)} w:${width.toFixed(0)} h:${height.toFixed(0)}`);
                }
              }}
            >
              {/* ── Drag Handle ─────────────────────────────────────────── */}
              <View style={styles.handleContainer}>
                <View
                  style={[
                    styles.handle,
                    { backgroundColor: theme.mode === 'dark' ? '#334155' : '#CBD5E1' },
                  ]}
                />
              </View>

              {/* ── Header ──────────────────────────────────────────────── */}
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
                    { backgroundColor: theme.cardAlt, borderColor: theme.border },
                  ]}
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={18} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* ── Scrollable Body ─────────────────────────────────────── */}
              {/*
                flex:1 gives the ScrollView a bounded height so React Native
                can calculate the scroll range. Without flex:1 the ScrollView
                tries to be as tall as its content, the parent clips it, but
                no scroll handle is created → content invisible and unreachable.
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

              {/* ── Sticky Footer ────────────────────────────────────────── */}
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
    flex: 1,                        // CRITICAL: enables bounded ScrollView height
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
