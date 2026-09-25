import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { ModalWrapper } from '../common/ModalWrapper';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { PRIORITY_CONFIG } from '../../constants/colors';
import { getTodayDateString, addDaysToDate, formatDateString } from '../../utils/dateUtils';

export const TaskModal = ({ visible, onClose, initialTask = null }) => {
  const { theme } = useTheme();
  const { subjects, addTask, updateTask } = useData();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [dueDate, setDueDate] = useState(getTodayDateString());
  const [priority, setPriority] = useState('medium');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setSubjectId(initialTask.subjectId || (subjects[0]?.id || ''));
      setDueDate(initialTask.dueDate || getTodayDateString());
      setPriority(initialTask.priority || 'medium');
      setNotes(initialTask.notes || '');
    } else {
      setTitle('');
      setSubjectId(subjects[0]?.id || '');
      setDueDate(getTodayDateString());
      setPriority('medium');
      setNotes('');
    }
    setError('');
  }, [initialTask, visible, subjects]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    const payload = {
      title: title.trim(),
      subjectId,
      dueDate,
      priority,
      notes: notes.trim(),
    };

    if (initialTask) {
      await updateTask(initialTask.id, payload);
    } else {
      await addTask(payload);
    }

    onClose();
  };

  const quickDates = [
    { label: 'Today', value: getTodayDateString() },
    { label: 'Tomorrow', value: addDaysToDate(1) },
    { label: 'In 3 Days', value: addDaysToDate(3) },
    { label: 'Next Week', value: addDaysToDate(7) },
  ];

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title={initialTask ? 'Edit Task' : 'New Task'}
      subtitle={initialTask ? 'Update assignment details' : 'Add an assignment or study task'}
      footer={
        <View style={styles.footerRow}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={onClose}
            style={{ flex: 1 }}
          />
          <Button
            title={initialTask ? 'Save Changes' : 'Create Task'}
            variant="primary"
            onPress={handleSave}
            icon="checkmark"
            style={{ flex: 1 }}
          />
        </View>
      }
    >
      <Input
        label="Task Title *"
        placeholder="e.g. Finish Binary Search Tree assignment"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          if (error) setError('');
        }}
        error={error}
        clearable
      />

      {/* Subject Picker */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Subject</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {subjects.map((sub) => {
            const isSelected = subjectId === sub.id;
            return (
              <TouchableOpacity
                key={sub.id}
                onPress={() => setSubjectId(sub.id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? sub.color : theme.cardAlt,
                    borderColor: isSelected ? sub.color : theme.border,
                  },
                ]}
              >
                <Ionicons
                  name={sub.icon || 'book-outline'}
                  size={14}
                  color={isSelected ? '#FFFFFF' : theme.textSecondary}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.chipText,
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

      {/* Priority Picker */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Priority</Text>
        <View style={styles.priorityRow}>
          {Object.entries(PRIORITY_CONFIG).map(([key, config]) => {
            const isSelected = priority === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => setPriority(key)}
                style={[
                  styles.priorityBtn,
                  {
                    backgroundColor: isSelected ? config.color : theme.cardAlt,
                    borderColor: isSelected ? config.color : theme.border,
                  },
                ]}
              >
                <Ionicons
                  name={config.icon}
                  size={16}
                  color={isSelected ? '#FFFFFF' : config.color}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.priorityText,
                    { color: isSelected ? '#FFFFFF' : theme.text },
                  ]}
                >
                  {config.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Due Date Shortcut Chips */}
      <View style={styles.section}>
        <View style={styles.dateLabelRow}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Due Date</Text>
          <Text style={[styles.selectedDateText, { color: theme.primary }]}>
            {formatDateString(dueDate)}
          </Text>
        </View>

        <View style={styles.quickDateRow}>
          {quickDates.map((item) => {
            const isSelected = dueDate === item.value;
            return (
              <TouchableOpacity
                key={item.label}
                onPress={() => setDueDate(item.value)}
                style={[
                  styles.quickDateChip,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.cardAlt,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.quickDateText,
                    { color: isSelected ? '#FFFFFF' : theme.text },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Input
          placeholder="YYYY-MM-DD (e.g. 2026-10-15)"
          value={dueDate}
          onChangeText={setDueDate}
          icon="calendar-outline"
          style={{ marginTop: SPACING.sm }}
        />
      </View>

      {/* Notes / Description */}
      <Input
        label="Notes & Requirements"
        placeholder="Add details, instructions or references..."
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
      />
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  section: {
    marginVertical: SPACING.xs,
  },
  sectionLabel: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.xs,
  },
  horizontalScroll: {
    paddingVertical: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    marginRight: 8,
  },
  chipText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  priorityText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  dateLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  selectedDateText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  quickDateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickDateChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  quickDateText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
});
