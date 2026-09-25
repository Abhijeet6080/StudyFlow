import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { Header } from '../components/common/Header';
import { ExamCard } from '../components/exams/ExamCard';
import { ExamModal } from '../components/exams/ExamModal';
import { EmptyState } from '../components/common/EmptyState';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { getDaysRemaining } from '../utils/dateUtils';

export const ExamsScreen = () => {
  const { theme } = useTheme();
  const { exams, deleteExam } = useData();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [tab, setTab] = useState('upcoming'); // 'upcoming', 'past'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExams = useMemo(() => {
    return exams
      .filter((exam) => {
        const days = getDaysRemaining(exam.date);
        if (tab === 'upcoming' && days < 0) return false;
        if (tab === 'past' && days >= 0) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = exam.title.toLowerCase().includes(q);
          const matchesNotes = exam.notes && exam.notes.toLowerCase().includes(q);
          if (!matchesTitle && !matchesNotes) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (tab === 'upcoming') {
          return new Date(a.date) - new Date(b.date);
        }
        return new Date(b.date) - new Date(a.date);
      });
  }, [exams, tab, searchQuery]);

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setModalVisible(true);
  };

  const handleDelete = (exam) => {
    Alert.alert('Delete Exam', `Are you sure you want to delete "${exam.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteExam(exam.id) },
    ]);
  };

  const upcomingCount = exams.filter((e) => getDaysRemaining(e.date) >= 0).length;
  const pastCount = exams.filter((e) => getDaysRemaining(e.date) < 0).length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header
        subtitle="EXAMINATIONS & QUIZZES"
        title="Exams"
        rightElement={
          <Button
            title="Add Exam"
            variant="primary"
            size="sm"
            icon="add"
            onPress={() => {
              setEditingExam(null);
              setModalVisible(true);
            }}
          />
        }
      />

      <View style={styles.container}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search exams, topics or venues..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon="search-outline"
            clearable
          />
        </View>

        {/* Tab switcher: Upcoming vs Past */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            onPress={() => setTab('upcoming')}
            style={[
              styles.tabBtn,
              {
                backgroundColor: tab === 'upcoming' ? theme.primary : theme.cardAlt,
                borderColor: tab === 'upcoming' ? theme.primary : theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.tabBtnText,
                { color: tab === 'upcoming' ? '#FFFFFF' : theme.text },
              ]}
            >
              Upcoming ({upcomingCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTab('past')}
            style={[
              styles.tabBtn,
              {
                backgroundColor: tab === 'past' ? theme.primary : theme.cardAlt,
                borderColor: tab === 'past' ? theme.primary : theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.tabBtnText,
                { color: tab === 'past' ? '#FFFFFF' : theme.text },
              ]}
            >
              Past / Completed ({pastCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Exam Cards List */}
        <FlatList
          data={filteredExams}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExamCard
              exam={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="school-outline"
              title={
                searchQuery
                  ? 'No matching exams'
                  : tab === 'upcoming'
                  ? 'No upcoming exams'
                  : 'No past exams recorded'
              }
              description={
                searchQuery
                  ? 'Try searching with different keywords.'
                  : 'Plan your revision strategy and avoid last-minute stress by scheduling exams.'
              }
              actionTitle="Schedule New Exam"
              onActionPress={() => {
                setEditingExam(null);
                setModalVisible(true);
              }}
            />
          }
        />
      </View>

      <ExamModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingExam(null);
        }}
        initialExam={editingExam}
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
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: 8,
    marginVertical: 4,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  tabBtnText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    paddingTop: 4,
  },
});
