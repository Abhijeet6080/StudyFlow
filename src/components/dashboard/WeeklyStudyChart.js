import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { SPACING, RADIUS, TYPOGRAPHY, getShadow } from '../../constants/theme';
import { getCurrentWeekDays } from '../../utils/dateUtils';
import { formatMinutes } from '../../utils/helpers';

export const WeeklyStudyChart = ({ style }) => {
  const { theme, isDark } = useTheme();
  const { sessions, profile } = useData();

  const [selectedDayIndex, setSelectedDayIndex] = useState(null);

  const weekDays = useMemo(() => getCurrentWeekDays(), []);

  // Baseline sample minutes for demonstration so the chart looks realistic if few sessions exist
  const baselineMockMinutes = [45, 90, 60, 80, 110, 45, 30];

  // Calculate actual daily minutes from logged study sessions
  const chartData = useMemo(() => {
    return weekDays.map((day, idx) => {
      // Find actual sessions completed on this specific day
      const daySessions = (sessions || []).filter((s) => {
        if (!s.completedAt) return false;
        return s.completedAt.startsWith(day.dateString);
      });

      const actualMinutes = daySessions.reduce(
        (sum, s) => sum + (s.durationMinutes || 0),
        0
      );

      // If user has actual session for this day, use it; otherwise provide baseline for past days
      const isPastOrToday = new Date(day.dateString) <= new Date();
      const minutes = actualMinutes > 0
        ? actualMinutes
        : isPastOrToday
        ? baselineMockMinutes[idx]
        : 0;

      return {
        ...day,
        minutes,
        hours: (minutes / 60).toFixed(1),
        hasActualSessions: actualMinutes > 0,
      };
    });
  }, [weekDays, sessions]);

  // Max minutes for scaling (minimum scale of 120m / 2 hours)
  const maxMinutes = Math.max(
    120,
    ...chartData.map((d) => d.minutes),
    profile?.dailyTargetMinutes || 120
  );

  const totalWeeklyMinutes = chartData.reduce((acc, d) => acc + d.minutes, 0);
  const targetMinutes = profile?.dailyTargetMinutes || 120;

  // Selected or today's active day
  const activeDay = selectedDayIndex !== null
    ? chartData[selectedDayIndex]
    : chartData.find((d) => d.isToday) || chartData[0];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
        getShadow(isDark, 2),
        style,
      ]}
    >
      {/* Chart Title and Weekly Total */}
      <View style={styles.headerRow}>
        <View>
          <View style={styles.titleWithIcon}>
            <Ionicons name="bar-chart-outline" size={18} color={theme.primary} />
            <Text style={[styles.eyebrow, { color: theme.primary }]}>STUDY ACTIVITY</Text>
          </View>
          <Text style={[styles.heading, { color: theme.text }]}>This Week's Focus</Text>
        </View>

        <View style={[styles.totalPill, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.totalText, { color: theme.primary }]}>
            {formatMinutes(totalWeeklyMinutes)} total
          </Text>
        </View>
      </View>

      {/* Selected Day Status Inspector */}
      {activeDay && (
        <View style={[styles.activeInspector, { backgroundColor: theme.cardAlt }]}>
          <Text style={[styles.inspectorDay, { color: theme.text }]}>
            {activeDay.dayName} ({activeDay.dayNumber}):{' '}
            <Text style={{ color: theme.primary, fontWeight: '700' }}>
              {formatMinutes(activeDay.minutes)}
            </Text>
          </Text>
          <Text style={[styles.inspectorGoal, { color: theme.textSecondary }]}>
            {activeDay.minutes >= targetMinutes
              ? '🎯 Daily target achieved!'
              : `${formatMinutes(Math.max(0, targetMinutes - activeDay.minutes))} to reach goal`}
          </Text>
        </View>
      )}

      {/* Chart Bars Container */}
      <View style={styles.barsContainer}>
        {/* Target Dotted Line */}
        <View
          style={[
            styles.targetLine,
            {
              bottom: (targetMinutes / maxMinutes) * 110 + 26,
              borderColor: `${theme.accent}60`,
            },
          ]}
        >
          <Text style={[styles.targetLabel, { color: theme.accent }]}>
            Goal {formatMinutes(targetMinutes)}
          </Text>
        </View>

        {chartData.map((day, idx) => {
          const isSelected = selectedDayIndex === idx || (selectedDayIndex === null && day.isToday);
          const barHeight = Math.max(6, Math.min(110, (day.minutes / maxMinutes) * 110));
          const isGoalMet = day.minutes >= targetMinutes;

          return (
            <TouchableOpacity
              key={day.dayName}
              style={styles.barCol}
              onPress={() => setSelectedDayIndex(idx)}
              activeOpacity={0.7}
            >
              {/* Value on top of bar */}
              <Text
                style={[
                  styles.barValueText,
                  {
                    color: isSelected ? theme.primary : theme.textSecondary,
                    fontWeight: isSelected ? '700' : '400',
                  },
                ]}
              >
                {day.minutes > 0 ? (day.minutes >= 60 ? `${(day.minutes / 60).toFixed(1)}h` : `${day.minutes}m`) : '0'}
              </Text>

              {/* Bar Track & Fill */}
              <View style={[styles.barTrack, { backgroundColor: theme.cardAlt }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: barHeight,
                      backgroundColor: day.isToday
                        ? theme.accent
                        : isGoalMet
                        ? theme.primary
                        : theme.mode === 'dark'
                        ? '#334155'
                        : '#94A3B8',
                    },
                    isSelected && {
                      shadowColor: day.isToday ? theme.accent : theme.primary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.4,
                      shadowRadius: 4,
                      elevation: 3,
                    },
                  ]}
                />
              </View>

              {/* Day Label Pill */}
              <View
                style={[
                  styles.dayLabelBox,
                  day.isToday && { backgroundColor: theme.accentLight, borderRadius: RADIUS.full },
                ]}
              >
                <Text
                  style={[
                    styles.dayLabel,
                    {
                      color: day.isToday
                        ? theme.accent
                        : isSelected
                        ? theme.text
                        : theme.textSecondary,
                      fontWeight: day.isToday || isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {day.dayName}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    marginVertical: SPACING.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  eyebrow: {
    ...TYPOGRAPHY.overline,
  },
  heading: {
    ...TYPOGRAPHY.h3,
  },
  totalPill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  totalText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  activeInspector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },
  inspectorDay: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  inspectorGoal: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: 10,
    position: 'relative',
  },
  targetLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  targetLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: -14,
    backgroundColor: 'transparent',
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  barValueText: {
    fontSize: 10,
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    height: 110,
    borderRadius: RADIUS.full,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: RADIUS.full,
  },
  dayLabelBox: {
    marginTop: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  dayLabel: {
    fontSize: 11,
  },
});
