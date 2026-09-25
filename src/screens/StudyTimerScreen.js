import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Vibration,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { Header } from '../components/common/Header';
import { TimerDisplay } from '../components/timer/TimerDisplay';
import { Button } from '../components/common/Button';
import { SPACING, RADIUS, TYPOGRAPHY, getShadow } from '../constants/theme';
import { formatMinutes } from '../utils/helpers';

const TIMER_MODES = {
  POMODORO: { key: 'pomodoro', label: 'Pomodoro', durationMinutes: 25, icon: 'flame-outline' },
  SHORT_BREAK: { key: 'shortBreak', label: 'Short Break', durationMinutes: 5, icon: 'cafe-outline' },
  LONG_BREAK: { key: 'longBreak', label: 'Long Break', durationMinutes: 15, icon: 'bed-outline' },
};

export const StudyTimerScreen = () => {
  const { theme, isDark } = useTheme();
  const { subjects, addStudySession, todayFocusMinutes, totalCompletedSessions } = useData();

  const [currentMode, setCurrentMode] = useState(TIMER_MODES.POMODORO);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_MODES.POMODORO.durationMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || null);

  const timerRef = useRef(null);

  // Sync selected subject if empty
  useEffect(() => {
    if (!selectedSubjectId && subjects.length > 0) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects]);

  // Handle countdown interval
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleSessionCompleted();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, currentMode, selectedSubjectId]);

  const handleSessionCompleted = async () => {
    if (Platform.OS !== 'web') {
      Vibration.vibrate([0, 500, 200, 500]);
    }

    if (currentMode.key === 'pomodoro') {
      await addStudySession({
        subjectId: selectedSubjectId,
        durationMinutes: currentMode.durationMinutes,
        type: 'pomodoro',
      });

      Alert.alert(
        '🎉 Session Finished!',
        `Excellent focus! You just completed 25 minutes of dedicated study. Take a 5-minute break.`,
        [
          {
            text: 'Take Break',
            onPress: () => switchMode(TIMER_MODES.SHORT_BREAK),
          },
          { text: 'OK', style: 'cancel' },
        ]
      );
    } else {
      Alert.alert(
        'Break Ended!',
        'Ready to jump back into deep work?',
        [
          {
            text: 'Start Pomodoro',
            onPress: () => switchMode(TIMER_MODES.POMODORO),
          },
          { text: 'Dismiss', style: 'cancel' },
        ]
      );
    }
  };

  const switchMode = (mode) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setCurrentMode(mode);
    setSecondsLeft(mode.durationMinutes * 60);
  };

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setSecondsLeft(currentMode.durationMinutes * 60);
  };

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header
        subtitle="FOCUS & CONCENTRATION"
        title="Study Timer"
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mode Selector Chips */}
        <View style={styles.modeTabsRow}>
          {Object.values(TIMER_MODES).map((mode) => {
            const isSelected = currentMode.key === mode.key;
            return (
              <TouchableOpacity
                key={mode.key}
                onPress={() => switchMode(mode)}
                style={[
                  styles.modeTab,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.card,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                  getShadow(isDark, isSelected ? 3 : 1),
                ]}
              >
                <Ionicons
                  name={mode.icon}
                  size={15}
                  color={isSelected ? '#FFFFFF' : theme.textSecondary}
                  style={{ marginRight: 5 }}
                />
                <Text
                  style={[
                    styles.modeTabText,
                    { color: isSelected ? '#FFFFFF' : theme.text },
                  ]}
                >
                  {mode.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Subject Tag Selector for Pomodoro */}
        {currentMode.key === 'pomodoro' && subjects.length > 0 && (
          <View style={styles.subjectSelectContainer}>
            <Text style={[styles.sectionCaption, { color: theme.textSecondary }]}>
              Studying For Course:
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.subjectChipsRow}
            >
              {subjects.map((sub) => {
                const isSelected = selectedSubjectId === sub.id;
                return (
                  <TouchableOpacity
                    key={sub.id}
                    onPress={() => setSelectedSubjectId(sub.id)}
                    style={[
                      styles.subjectChip,
                      {
                        backgroundColor: isSelected ? sub.color : theme.cardAlt,
                        borderColor: isSelected ? sub.color : theme.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={sub.icon || 'book-outline'}
                      size={13}
                      color={isSelected ? '#FFFFFF' : sub.color}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={[
                        styles.subjectChipText,
                        { color: isSelected ? '#FFFFFF' : theme.text },
                      ]}
                    >
                      {sub.code || sub.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Animated Timer Circular Progress */}
        <TimerDisplay
          secondsLeft={secondsLeft}
          totalSeconds={currentMode.durationMinutes * 60}
          isRunning={isRunning}
          mode={currentMode.key}
          subjectColor={selectedSubject?.color}
        />

        {/* Action Controls: Start / Pause / Reset */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            onPress={handleReset}
            style={[
              styles.secondaryControlBtn,
              { backgroundColor: theme.cardAlt, borderColor: theme.border },
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="refresh" size={22} color={theme.textSecondary} />
          </TouchableOpacity>

          <Button
            title={isRunning ? 'Pause' : secondsLeft === 0 ? 'Restart' : 'Start Focus'}
            onPress={handleStartPause}
            variant={isRunning ? 'secondary' : 'primary'}
            size="lg"
            icon={isRunning ? 'pause' : 'play'}
            style={styles.mainStartBtn}
          />

          <TouchableOpacity
            onPress={() => {
              // Quick +5 min booster
              setSecondsLeft((prev) => prev + 300);
            }}
            style={[
              styles.secondaryControlBtn,
              { backgroundColor: theme.cardAlt, borderColor: theme.border },
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.addTimeText, { color: theme.primary }]}>+5m</Text>
          </TouchableOpacity>
        </View>

        {/* Completed Session Stats Banner */}
        <View
          style={[
            styles.statsCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            getShadow(isDark, 2),
          ]}
        >
          <View style={styles.statItem}>
            <View style={[styles.statIconBox, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="checkmark-done" size={20} color={theme.primary} />
            </View>
            <View>
              <Text style={[styles.statVal, { color: theme.text }]}>
                {totalCompletedSessions}
              </Text>
              <Text style={[styles.statDesc, { color: theme.textSecondary }]}>
                Sessions Completed
              </Text>
            </View>
          </View>

          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

          <View style={styles.statItem}>
            <View style={[styles.statIconBox, { backgroundColor: theme.accentLight }]}>
              <Ionicons name="flame" size={20} color={theme.accent} />
            </View>
            <View>
              <Text style={[styles.statVal, { color: theme.text }]}>
                {formatMinutes(todayFocusMinutes)}
              </Text>
              <Text style={[styles.statDesc, { color: theme.textSecondary }]}>
                Today's Focus Time
              </Text>
            </View>
          </View>
        </View>

        {/* Motivational Study Tip */}
        <View style={[styles.tipBox, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}>
          <Ionicons name="bulb-outline" size={18} color={theme.accent} style={{ marginRight: 8 }} />
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            Tip: 25 minutes of deep distraction-free work beats 2 hours of interrupted study. Keep phone notifications on mute!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    alignItems: 'center',
  },
  modeTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: SPACING.sm,
    width: '100%',
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  modeTabText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  subjectSelectContainer: {
    width: '100%',
    marginVertical: SPACING.xs,
  },
  sectionCaption: {
    ...TYPOGRAPHY.caption,
    marginBottom: 6,
  },
  subjectChipsRow: {
    gap: 6,
    paddingVertical: 2,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  subjectChipText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
    width: '100%',
  },
  secondaryControlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainStartBtn: {
    minWidth: 160,
  },
  addTimeText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '800',
  },
  statsCard: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statVal: {
    ...TYPOGRAPHY.h3,
    fontWeight: '800',
  },
  statDesc: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
  },
  statDivider: {
    width: 1,
    height: '100%',
    marginHorizontal: SPACING.sm,
  },
  tipBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginTop: SPACING.md,
  },
  tipText: {
    ...TYPOGRAPHY.caption,
    flex: 1,
    lineHeight: 18,
  },
});
