import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { SPACING, RADIUS, TYPOGRAPHY, getShadow } from '../../constants/theme';
import { ProgressBar } from '../common/ProgressBar';
import { formatMinutes } from '../../utils/helpers';

export const ProgressSummary = () => {
  const { theme, isDark } = useTheme();
  const {
    todayTasks,
    tasks,
    todayFocusMinutes,
    profile,
    overallProgress,
    upcomingExams,
  } = useData();

  const completedToday = todayTasks.filter((t) => t.completed).length;
  const targetMinutes = profile?.dailyTargetMinutes || 120;
  const focusPercent = Math.min(100, Math.round((todayFocusMinutes / targetMinutes) * 100));

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
        getShadow(isDark, 3),
      ]}
    >
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.eyebrow, { color: theme.primary }]}>DAILY OVERVIEW</Text>
          <Text style={[styles.heading, { color: theme.text }]}>Study Momentum</Text>
        </View>

        <View style={[styles.scoreBadge, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name="sparkles" size={14} color={theme.primary} />
          <Text style={[styles.scoreText, { color: theme.primary }]}>
            {overallProgress}% Total Done
          </Text>
        </View>
      </View>

      {/* Focus Time vs Daily Goal */}
      <View style={styles.metricBlock}>
        <View style={styles.metricHeader}>
          <View style={styles.metricIconLabel}>
            <Ionicons name="time" size={16} color={theme.accent} />
            <Text style={[styles.metricTitle, { color: theme.textSecondary }]}>
              Focus Time Today
            </Text>
          </View>
          <Text style={[styles.metricValue, { color: theme.text }]}>
            {formatMinutes(todayFocusMinutes)} <Text style={{ color: theme.textMuted, fontSize: 12 }}>/ {formatMinutes(targetMinutes)}</Text>
          </Text>
        </View>
        <ProgressBar
          progress={focusPercent}
          color={theme.accent}
          height={6}
        />
      </View>

      {/* Quick stats mini cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: theme.cardAlt }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>
            {completedToday}/{todayTasks.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Today's Tasks
          </Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: theme.cardAlt }]}>
          <Text style={[styles.statNumber, { color: theme.secondary }]}>
            {upcomingExams.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Upcoming Exams
          </Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: theme.cardAlt }]}>
          <Text style={[styles.statNumber, { color: theme.success }]}>
            {tasks.filter((t) => t.completed).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Total Solved
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  eyebrow: {
    ...TYPOGRAPHY.overline,
    marginBottom: 2,
  },
  heading: {
    ...TYPOGRAPHY.h3,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  scoreText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  metricBlock: {
    marginVertical: SPACING.xs,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricIconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricTitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  metricValue: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  statBox: {
    flex: 1,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statNumber: {
    ...TYPOGRAPHY.h4,
    fontWeight: '800',
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
});
