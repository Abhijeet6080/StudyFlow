import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { SPACING, RADIUS, TYPOGRAPHY, getShadow } from '../../constants/theme';
import { ProgressBar } from '../common/ProgressBar';

export const SubjectCard = ({ subject, onEdit, onDelete, onPress }) => {
  const { theme, isDark } = useTheme();
  const { getSubjectStats } = useData();

  const stats = getSubjectStats(subject.id);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
        getShadow(isDark, 2),
      ]}
      onPress={() => onPress && onPress(subject)}
      activeOpacity={0.8}
    >
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleInfo}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: `${subject.color}20` },
            ]}
          >
            <Ionicons
              name={subject.icon || 'book-outline'}
              size={22}
              color={subject.color}
            />
          </View>
          <View style={styles.headerTexts}>
            <Text style={[styles.code, { color: subject.color }]}>
              {subject.code}
            </Text>
            <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
              {subject.name}
            </Text>
          </View>
        </View>

        {/* Action icons */}
        <View style={styles.actionRow}>
          {onEdit && (
            <TouchableOpacity
              onPress={() => onEdit(subject)}
              style={styles.actionBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="pencil-outline" size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(subject)}
              style={styles.actionBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={16} color={theme.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Meta Details: Instructor & Room */}
      {(subject.instructor || subject.room) && (
        <View style={styles.metaRow}>
          {subject.instructor ? (
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={13} color={theme.textSecondary} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                {subject.instructor}
              </Text>
            </View>
          ) : null}
          {subject.room ? (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={13} color={theme.textSecondary} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                {subject.room}
              </Text>
            </View>
          ) : null}
        </View>
      )}

      {/* Task Count & Progress */}
      <View style={styles.progressSection}>
        <View style={styles.taskCountRow}>
          <Text style={[styles.taskCountText, { color: theme.textSecondary }]}>
            Tasks: <Text style={{ color: theme.text, fontWeight: '700' }}>{stats.completed}/{stats.total}</Text> completed
          </Text>
          <Text style={[styles.percentText, { color: subject.color }]}>
            {stats.progress}%
          </Text>
        </View>
        <ProgressBar
          progress={stats.progress}
          color={subject.color}
          height={6}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.lg,
    marginVertical: SPACING.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  titleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  headerTexts: {
    flex: 1,
  },
  code: {
    ...TYPOGRAPHY.overline,
    fontWeight: '700',
  },
  name: {
    ...TYPOGRAPHY.h4,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    padding: 6,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.md,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...TYPOGRAPHY.caption,
  },
  progressSection: {
    marginTop: 4,
  },
  taskCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskCountText: {
    ...TYPOGRAPHY.caption,
  },
  percentText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
});
