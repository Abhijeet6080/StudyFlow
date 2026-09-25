import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { Header } from '../components/common/Header';
import { SubjectCard } from '../components/subjects/SubjectCard';
import { SubjectModal } from '../components/subjects/SubjectModal';
import { EmptyState } from '../components/common/EmptyState';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { SPACING, TYPOGRAPHY } from '../constants/theme';

export const SubjectsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { subjects, deleteSubject } = useData();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return subjects;
    const q = searchQuery.toLowerCase();
    return subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.code && s.code.toLowerCase().includes(q)) ||
        (s.instructor && s.instructor.toLowerCase().includes(q))
    );
  }, [subjects, searchQuery]);

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setModalVisible(true);
  };

  const handleDelete = (subject) => {
    Alert.alert(
      'Delete Subject',
      `Are you sure you want to delete "${subject.name}"? All associated tasks and exams will also be removed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteSubject(subject.id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header
        subtitle="ACADEMIC COURSES"
        title="Subjects"
        rightElement={
          <Button
            title="Add Subject"
            variant="primary"
            size="sm"
            icon="add"
            onPress={() => {
              setEditingSubject(null);
              setModalVisible(true);
            }}
          />
        }
      />

      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search subjects or instructors..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon="search-outline"
            clearable
          />
        </View>

        {/* Subjects List */}
        <FlatList
          data={filteredSubjects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SubjectCard
              subject={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPress={() => {
                navigation.navigate('SubjectDetail', { subjectId: item.id });
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="book-outline"
              title={searchQuery ? 'No matching subjects' : 'No subjects yet'}
              description={
                searchQuery
                  ? 'Try searching with a different course code or keyword.'
                  : 'Add your college courses to organize tasks, calculate completion, and track progress.'
              }
              actionTitle="Add New Subject"
              onActionPress={() => {
                setEditingSubject(null);
                setModalVisible(true);
              }}
            />
          }
        />
      </View>

      <SubjectModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingSubject(null);
        }}
        initialSubject={editingSubject}
      />
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
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
});
