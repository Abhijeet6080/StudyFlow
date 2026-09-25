import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { SPACING, RADIUS, TYPOGRAPHY, getShadow } from '../../constants/theme';
import { ProgressBar } from '../common/ProgressBar';
import { formatMinutes } from '../../utils/helpers';

export const ProgressCard = ({
  focusMinutes,
  goalMinutes,
  completedCount,
  totalCount,
  progressPercentage,
  onPress,
  style,
}) => {
  const { theme, isDark } = useTheme();
  const contextData = useData();

  // Support both explicit props and context fallbacks
  const todayFocus = focusMinutes !== undefined ? focusMinutes : contextData.todayFocusMinutes;
  const targetGoal = goalMinutes !== undefined ? goalMinutes : (contextData.profile?.dailyTargetMinutes || 120);
  const doneToday = completedCount !== undefined ? completedCount : contextData.todayTasks.filter((t) => t.completed).length;
  const countToday = totalCount !== undefined ? totalCount : contextData.todayTasks.length;
  const overallDone = progressPercentage !== undefined ? progressPercentage : contextData.overallProgress;

  const focusPercent = Math.min(100, Math.round((todayFocus / Math.max(1, targetGoal)) * 100));
  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
        getShadow(isDark, 3),
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleInfo}>
          <Text style={[styles.eyebrow, { color: theme.primary }]}>DAILY OVERVIEW</Text>
          <Text style={[styles.heading, { color: theme.text }]}>Study Momentum</Text>
        </View>

        <View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name="sparkles" size={13} color={theme.primary} />
          <Text style={[styles.badgeText, { color: theme.primary }]}>
            {overallDone}% Overall
          </Text>
        </View>
      </View>

      {/* Focus Time vs Daily Goal */}
      <View style={styles.metricSection}>
        <View style={styles.metricLabelRow}>
          <View style={styles.iconLabel}>
            <Ionicons name="time" size={16} color={theme.accent} />
            <Text style={[styles.metricTitle, { color: theme.textSecondary }]}>
              Focus Time Today
            </Text>
          </View>
          <Text style={[styles.metricValue, { color: theme.text }]}>
            {formatMinutes(todayFocus)}{' '}
            <Text style={[styles.metricSub, { color: theme.textMuted }]}>
              / {formatMinutes(targetGoal)}
            </Text>
          </Text>
        </View>
        <ProgressBar
          progress={focusPercent}
          color={theme.accent}
          height={7}
        />
      </View>

      {/* Stats Counter Blocks */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: theme.cardAlt }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>
            {doneToday}/{countToday}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Today's Tasks
          </Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: theme.cardAlt }]}>
          <Text style={[styles.statNumber, { color: theme.secondary }]}>
            {contextData.upcomingExams?.length || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Upcoming Exams
          </Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: theme.cardAlt }]}>
          <Text style={[styles.statNumber, { color: theme.success }]}>
            {contextData.tasks?.filter((t) => t.completed).length || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Tasks Solved
          </Text>
        </View>
      </View>
    </CardContainer>
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  titleInfo: {
    flex: 1,
  },
  eyebrow: {
    ...TYPOGRAPHY.overline,
    marginBottom: 2,
  },
  heading: {
    ...TYPOGRAPHY.h3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  badgeText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  metricSection: {
    marginVertical: SPACING.xs,
  },
  metricLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconLabel: {
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
  metricSub: {
    fontSize: 12,
    fontWeight: '400',
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
    paddingHorizontal: 6,
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
