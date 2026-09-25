import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { ModalWrapper } from '../common/ModalWrapper';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { getTodayDateString, addDaysToDate, formatDateString } from '../../utils/dateUtils';

export const ExamModal = ({ visible, onClose, initialExam = null }) => {
  const { theme } = useTheme();
  const { subjects, addExam, updateExam } = useData();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [date, setDate] = useState(addDaysToDate(7));
  const [room, setRoom] = useState('');
  const [progress, setProgress] = useState(25);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialExam) {
      setTitle(initialExam.title || '');
      setSubjectId(initialExam.subjectId || (subjects[0]?.id || ''));
      setDate(initialExam.date || addDaysToDate(7));
      setRoom(initialExam.room || '');
      setProgress(initialExam.progress || 0);
      setWeight(initialExam.weight || '');
      setNotes(initialExam.notes || '');
    } else {
      setTitle('');
      setSubjectId(subjects[0]?.id || '');
      setDate(addDaysToDate(7));
      setRoom('');
      setProgress(25);
      setWeight('');
      setNotes('');
    }
    setError('');
  }, [initialExam, visible, subjects]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please provide an exam title');
      return;
    }

    const payload = {
      title: title.trim(),
      subjectId,
      date,
      room: room.trim(),
      progress: Number(progress) || 0,
      weight: weight.trim(),
      notes: notes.trim(),
    };

    if (initialExam) {
      await updateExam(initialExam.id, payload);
    } else {
      await addExam(payload);
    }

    onClose();
  };

  const quickDates = [
    { label: 'In 3 Days', value: addDaysToDate(3) },
    { label: 'In 1 Week', value: addDaysToDate(7) },
    { label: 'In 2 Weeks', value: addDaysToDate(14) },
    { label: 'In 1 Month', value: addDaysToDate(30) },
  ];

  const prepLevels = [0, 25, 50, 75, 100];

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title={initialExam ? 'Edit Exam' : 'Schedule Exam'}
      subtitle={initialExam ? 'Update exam parameters' : 'Keep track of midterm, finals and quizzes'}
      footer={
        <View style={styles.footerRow}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={onClose}
            style={{ flex: 1 }}
          />
          <Button
            title={initialExam ? 'Save Changes' : 'Schedule'}
            variant="primary"
            onPress={handleSave}
            icon="checkmark"
            style={{ flex: 1 }}
          />
        </View>
      }
    >
      <Input
        label="Exam Title *"
        placeholder="e.g. Midterm Examination / Quiz 2"
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

      {/* Date Picker */}
      <View style={styles.section}>
        <View style={styles.dateLabelRow}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Exam Date</Text>
          <Text style={[styles.selectedDateText, { color: theme.primary }]}>
            {formatDateString(date)}
          </Text>
        </View>

        <View style={styles.quickDateRow}>
          {quickDates.map((item) => {
            const isSelected = date === item.value;
            return (
              <TouchableOpacity
                key={item.label}
                onPress={() => setDate(item.value)}
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
          placeholder="YYYY-MM-DD (e.g. 2026-10-20)"
          value={date}
          onChangeText={setDate}
          icon="calendar-outline"
          style={{ marginTop: SPACING.sm }}
        />
      </View>

      {/* Room & Weight */}
      <View style={styles.row}>
        <Input
          label="Room / Hall"
          placeholder="e.g. Aud-2"
          value={room}
          onChangeText={setRoom}
          icon="location-outline"
          style={{ flex: 1 }}
        />
        <Input
          label="Grade Weight"
          placeholder="e.g. 25%"
          value={weight}
          onChangeText={setWeight}
          icon="ribbon-outline"
          style={{ flex: 1 }}
        />
      </View>

      {/* Preparation Readiness */}
      <View style={styles.section}>
        <View style={styles.dateLabelRow}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            Preparation Readiness
          </Text>
          <Text style={[styles.selectedDateText, { color: theme.primary }]}>
            {progress}%
          </Text>
        </View>

        <View style={styles.prepRow}>
          {prepLevels.map((lvl) => {
            const isSelected = progress === lvl;
            return (
              <TouchableOpacity
                key={lvl}
                onPress={() => setProgress(lvl)}
                style={[
                  styles.prepBtn,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.cardAlt,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.prepBtnText,
                    { color: isSelected ? '#FFFFFF' : theme.text },
                  ]}
                >
                  {lvl}%
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Notes / Topics */}
      <Input
        label="Topics & Syllabus Notes"
        placeholder="Key topics, chapters, formula sheets allowed..."
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
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  prepRow: {
    flexDirection: 'row',
    gap: 8,
  },
  prepBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  prepBtnText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
});
