import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { SPACING, RADIUS, TYPOGRAPHY, getShadow } from '../../constants/theme';
import { Badge } from '../common/Badge';
import { getCountdownLabel, formatDateString } from '../../utils/dateUtils';
import { notificationService } from '../../services/notificationService';

export const TaskCard = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  onPress,
  showSubject = true,
  style,
}) => {
  const { theme, isDark } = useTheme();
  const { toggleTaskCompleted, getSubjectById } = useData();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  if (!task) return null;

  const subject = getSubjectById ? getSubjectById(task.subjectId) : null;
  const countdown = getCountdownLabel(task.dueDate);

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1.15, duration: 120, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();

    if (onToggle) {
      onToggle(task);
    } else if (toggleTaskCompleted) {
      toggleTaskCompleted(task.id);
    }
  };

  const isCompleted = !!task.completed;
  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: isCompleted ? theme.border : subject?.color ? `${subject.color}40` : theme.border,
          opacity: isCompleted ? 0.75 : 1,
        },
        getShadow(isDark, 1.5),
        style,
      ]}
      onPress={onPress ? () => onPress(task) : undefined}
      activeOpacity={onPress ? 0.75 : 1}
    >
      <View style={styles.mainRow}>
        {/* Animated Checkbox */}
        <TouchableOpacity
          onPress={handleToggle}
          style={styles.checkboxTouch}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Animated.View
            style={[
              styles.checkbox,
              {
                borderColor: isCompleted ? theme.success : theme.textMuted,
                backgroundColor: isCompleted ? theme.success : 'transparent',
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {isCompleted && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
          </Animated.View>
        </TouchableOpacity>

        {/* Task Details */}
        <View style={styles.infoCol}>
          <Text
            style={[
              styles.title,
              {
                color: isCompleted ? theme.textMuted : theme.text,
                textDecorationLine: isCompleted ? 'line-through' : 'none',
              },
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {task.notes ? (
            <Text
              style={[
                styles.notes,
                { color: theme.textSecondary },
              ]}
              numberOfLines={1}
            >
              {task.notes}
            </Text>
          ) : null}

          {/* Badges Row */}
          <View style={styles.badgeRow}>
            {showSubject && subject ? (
              <Badge
                label={subject.code || subject.name}
                color={subject.color}
                bgColor={`${subject.color}15`}
                size="sm"
                icon={subject.icon || 'book-outline'}
              />
            ) : null}

            <Badge
              label={task.priority ? task.priority.toUpperCase() : 'MEDIUM'}
              variant="priority"
              priority={task.priority || 'medium'}
              size="sm"
            />

            {task.dueDate ? (
              <View style={styles.dueItem}>
                <Ionicons
                  name="calendar-outline"
                  size={12}
                  color={
                    countdown.isOverdue && !isCompleted
                      ? theme.danger
                      : countdown.isUrgent && !isCompleted
                      ? theme.warning
                      : theme.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.dueText,
                    {
                      color:
                        countdown.isOverdue && !isCompleted
                          ? theme.danger
                          : countdown.isUrgent && !isCompleted
                          ? theme.warning
                          : theme.textSecondary,
                      fontWeight: countdown.isUrgent || countdown.isOverdue ? '600' : '400',
                    },
                  ]}
                >
                  {countdown.text === 'Today!' || countdown.text === 'Tomorrow'
                    ? countdown.text
                    : formatDateString(task.dueDate)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsCol}>
          {!isCompleted && (
            <TouchableOpacity
              onPress={() => notificationService.scheduleTaskReminder(task, subject?.code || subject?.name)}
              style={styles.actionBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="notifications-outline" size={15} color={theme.accent} />
            </TouchableOpacity>
          )}

          {onEdit && (
            <TouchableOpacity
              onPress={() => onEdit(task)}
              style={styles.actionBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="pencil-outline" size={15} color={theme.textSecondary} />
            </TouchableOpacity>
          )}

          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(task)}
              style={styles.actionBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={15} color={theme.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </CardContainer>
  );
};

// Re-export TaskItem for compatibility
export const TaskItem = TaskCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxTouch: {
    paddingTop: 2,
    paddingRight: SPACING.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
    paddingHorizontal: 2,
  },
  title: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: 2,
  },
  notes: {
    ...TYPOGRAPHY.bodySmall,
    marginBottom: SPACING.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  dueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueText: {
    ...TYPOGRAPHY.caption,
  },
  actionsCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: SPACING.xs,
  },
  actionBtn: {
    padding: 6,
  },
});
