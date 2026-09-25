import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { SPACING, RADIUS, TYPOGRAPHY, getShadow } from '../../constants/theme';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { getCountdownLabel, formatDateString } from '../../utils/dateUtils';
import { notificationService } from '../../services/notificationService';

export const ExamCard = ({ exam, onEdit, onDelete }) => {
  const { theme, isDark } = useTheme();
  const { getSubjectById } = useData();

  const subject = getSubjectById(exam.subjectId);
  const countdown = getCountdownLabel(exam.date);

  const getCountdownBadgeColor = () => {
    if (countdown.isOverdue) return { color: theme.danger, bg: theme.mode === 'dark' ? '#450A0A' : '#FEE2E2' };
    if (countdown.days <= 2) return { color: theme.warning, bg: theme.mode === 'dark' ? '#451A03' : '#FEF3C7' };
    return { color: theme.primary, bg: theme.primaryLight };
  };

  const badgeColor = getCountdownBadgeColor();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: countdown.isUrgent ? badgeColor.color : theme.border,
        },
        getShadow(isDark, 2),
      ]}
    >
      {/* Top Banner: Subject & Countdown */}
      <View style={styles.topRow}>
        {subject ? (
          <Badge
            label={subject.code || subject.name}
            color={subject.color}
            bgColor={`${subject.color}15`}
            icon={subject.icon || 'school-outline'}
            size="sm"
          />
        ) : (
          <Badge label="General" color={theme.primary} bgColor={theme.primaryLight} size="sm" />
        )}

        <View style={styles.rightGroup}>
          <Badge
            label={countdown.text}
            color={badgeColor.color}
            bgColor={badgeColor.bg}
            icon="time-outline"
            size="sm"
          />

          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => notificationService.scheduleExamReminder(exam, subject?.code || subject?.name)}
              style={styles.actionBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="notifications-outline" size={15} color={theme.accent} />
            </TouchableOpacity>

            {onEdit && (
              <TouchableOpacity
                onPress={() => onEdit(exam)}
                style={styles.actionBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="pencil-outline" size={15} color={theme.textSecondary} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                onPress={() => onDelete(exam)}
                style={styles.actionBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="trash-outline" size={15} color={theme.danger} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Exam Title */}
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
        {exam.title}
      </Text>

      {/* Date & Location */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {formatDateString(exam.date)}
          </Text>
        </View>
        {exam.room ? (
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {exam.room}
            </Text>
          </View>
        ) : null}
        {exam.weight ? (
          <View style={styles.metaItem}>
            <Ionicons name="ribbon-outline" size={14} color={theme.accent} />
            <Text style={[styles.metaText, { color: theme.accent, fontWeight: '600' }]}>
              Weight: {exam.weight}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Notes */}
      {exam.notes ? (
        <Text style={[styles.notes, { color: theme.textSecondary }]} numberOfLines={2}>
          {exam.notes}
        </Text>
      ) : null}

      {/* Preparation Progress */}
      <View style={styles.prepSection}>
        <View style={styles.prepHeader}>
          <Text style={[styles.prepLabel, { color: theme.textSecondary }]}>
            Preparation Readiness
          </Text>
          <Text
            style={[
              styles.prepPercent,
              {
                color:
                  (exam.progress || 0) >= 80
                    ? theme.success
                    : (exam.progress || 0) >= 50
                    ? theme.primary
                    : theme.warning,
              },
            ]}
          >
            {exam.progress || 0}%
          </Text>
        </View>
        <ProgressBar
          progress={exam.progress || 0}
          color={
            (exam.progress || 0) >= 80
              ? theme.success
              : (exam.progress || 0) >= 50
              ? theme.primary
              : theme.warning
          }
          height={7}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.lg,
    marginVertical: SPACING.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  actionBtn: {
    padding: 4,
  },
  title: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginVertical: SPACING.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...TYPOGRAPHY.caption,
  },
  notes: {
    ...TYPOGRAPHY.bodySmall,
    marginTop: 4,
    marginBottom: SPACING.xs,
    fontStyle: 'italic',
  },
  prepSection: {
    marginTop: SPACING.sm,
  },
  prepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  prepLabel: {
    ...TYPOGRAPHY.caption,
  },
  prepPercent: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
});
