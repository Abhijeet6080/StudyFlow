import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { ModalWrapper } from '../common/ModalWrapper';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { SUBJECT_COLORS, SUBJECT_ICONS } from '../../constants/colors';

export const SubjectModal = ({ visible, onClose, initialSubject = null }) => {
  const { theme } = useTheme();
  const { addSubject, updateSubject } = useData();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [instructor, setInstructor] = useState('');
  const [room, setRoom] = useState('');
  const [selectedColor, setSelectedColor] = useState(SUBJECT_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(SUBJECT_ICONS[0]);
  const [targetGrade, setTargetGrade] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialSubject) {
      setName(initialSubject.name || '');
      setCode(initialSubject.code || '');
      setInstructor(initialSubject.instructor || '');
      setRoom(initialSubject.room || '');
      setSelectedColor(initialSubject.color || SUBJECT_COLORS[0]);
      setSelectedIcon(initialSubject.icon || SUBJECT_ICONS[0]);
      setTargetGrade(initialSubject.targetGrade || '');
    } else {
      setName('');
      setCode('');
      setInstructor('');
      setRoom('');
      setSelectedColor(SUBJECT_COLORS[0]);
      setSelectedIcon(SUBJECT_ICONS[0]);
      setTargetGrade('');
    }
    setError('');
  }, [initialSubject, visible]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Subject name is required');
      return;
    }

    const payload = {
      name: name.trim(),
      code: code.trim() || name.substring(0, 4).toUpperCase(),
      instructor: instructor.trim(),
      room: room.trim(),
      color: selectedColor,
      icon: selectedIcon,
      targetGrade: targetGrade.trim(),
    };

    if (initialSubject) {
      await updateSubject(initialSubject.id, payload);
    } else {
      await addSubject(payload);
    }

    onClose();
  };

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title={initialSubject ? 'Edit Subject' : 'New Subject'}
      subtitle={initialSubject ? 'Modify course information' : 'Add a new course or academic topic'}
      footer={
        <View style={styles.footerRow}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={onClose}
            style={{ flex: 1 }}
          />
          <Button
            title={initialSubject ? 'Save Changes' : 'Add Subject'}
            variant="primary"
            onPress={handleSave}
            icon="checkmark"
            style={{ flex: 1 }}
          />
        </View>
      }
    >
      <Input
        label="Subject Name *"
        placeholder="e.g. Distributed Systems"
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (error) setError('');
        }}
        error={error}
        clearable
      />

      <View style={styles.row}>
        <Input
          label="Course Code"
          placeholder="e.g. CS 402"
          value={code}
          onChangeText={setCode}
          style={{ flex: 1 }}
        />
        <Input
          label="Target Grade"
          placeholder="e.g. A+"
          value={targetGrade}
          onChangeText={setTargetGrade}
          style={{ width: 100 }}
        />
      </View>

      <View style={styles.row}>
        <Input
          label="Instructor"
          placeholder="e.g. Prof. Davis"
          value={instructor}
          onChangeText={setInstructor}
          icon="person-outline"
          style={{ flex: 1 }}
        />
        <Input
          label="Room / Hall"
          placeholder="e.g. Lab 4"
          value={room}
          onChangeText={setRoom}
          icon="location-outline"
          style={{ flex: 1 }}
        />
      </View>

      {/* Color Picker */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Accent Color</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScroll}>
          {SUBJECT_COLORS.map((c) => {
            const isSelected = selectedColor === c;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setSelectedColor(c)}
                style={[
                  styles.colorCircle,
                  { backgroundColor: c },
                  isSelected && styles.colorCircleSelected,
                ]}
              >
                {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Icon Picker */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Icon Symbol</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll}>
          {SUBJECT_ICONS.map((iconName) => {
            const isSelected = selectedIcon === iconName;
            return (
              <TouchableOpacity
                key={iconName}
                onPress={() => setSelectedIcon(iconName)}
                style={[
                  styles.iconOption,
                  {
                    backgroundColor: isSelected ? selectedColor : theme.cardAlt,
                    borderColor: isSelected ? selectedColor : theme.border,
                  },
                ]}
              >
                <Ionicons
                  name={iconName}
                  size={20}
                  color={isSelected ? '#FFFFFF' : theme.textSecondary}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  section: {
    marginVertical: SPACING.xs,
  },
  sectionLabel: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.xs,
  },
  colorScroll: {
    paddingVertical: 4,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  iconScroll: {
    paddingVertical: 4,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
});
