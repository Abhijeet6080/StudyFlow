import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { Header } from '../components/common/Header';
import { TaskItem } from '../components/tasks/TaskItem';
import { TaskModal } from '../components/tasks/TaskModal';
import { EmptyState } from '../components/common/EmptyState';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';

export const TasksScreen = ({ route }) => {
  const { theme } = useTheme();
  const { tasks, subjects, deleteTask } = useData();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [selectedSubjectId, setSelectedSubjectId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Check if subject was passed in navigation params
  useEffect(() => {
    if (route?.params?.selectedSubjectId) {
      setSelectedSubjectId(route.params.selectedSubjectId);
    }
  }, [route?.params?.selectedSubjectId]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filter
      if (statusFilter === 'pending' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;

      // Subject filter
      if (selectedSubjectId !== 'all' && task.subjectId !== selectedSubjectId) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesNotes = task.notes && task.notes.toLowerCase().includes(q);
        if (!matchesTitle && !matchesNotes) return false;
      }

      return true;
    });
  }, [tasks, statusFilter, selectedSubjectId, searchQuery]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleDelete = (task) => {
    Alert.alert('Delete Task', `Are you sure you want to delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask(task.id) },
    ]);
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header
        subtitle="STUDY & ASSIGNMENTS"
        title="Tasks"
        rightElement={
          <Button
            title="Add Task"
            variant="primary"
            size="sm"
            icon="add"
            onPress={() => {
              setEditingTask(null);
              setModalVisible(true);
            }}
          />
        }
      />

      <View style={styles.container}>
        {/* Search input */}
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search assignments or notes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon="search-outline"
            clearable
          />
        </View>

        {/* Status Filter Tabs (All / Pending / Completed) */}
        <View style={styles.filterTabsRow}>
          <TouchableOpacity
            onPress={() => setStatusFilter('all')}
            style={[
              styles.statusTab,
              {
                backgroundColor: statusFilter === 'all' ? theme.primary : theme.cardAlt,
                borderColor: statusFilter === 'all' ? theme.primary : theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.statusTabText,
                { color: statusFilter === 'all' ? '#FFFFFF' : theme.text },
              ]}
            >
              All ({tasks.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setStatusFilter('pending')}
            style={[
              styles.statusTab,
              {
                backgroundColor: statusFilter === 'pending' ? theme.primary : theme.cardAlt,
                borderColor: statusFilter === 'pending' ? theme.primary : theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.statusTabText,
                { color: statusFilter === 'pending' ? '#FFFFFF' : theme.text },
              ]}
            >
              Pending ({pendingCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setStatusFilter('completed')}
            style={[
              styles.statusTab,
              {
                backgroundColor: statusFilter === 'completed' ? theme.primary : theme.cardAlt,
                borderColor: statusFilter === 'completed' ? theme.primary : theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.statusTabText,
                { color: statusFilter === 'completed' ? '#FFFFFF' : theme.text },
              ]}
            >
              Done ({completedCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Subject Filter Bar */}
        {subjects.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.subjectFilterScroll}
            contentContainerStyle={styles.subjectFilterContent}
          >
            <TouchableOpacity
              onPress={() => setSelectedSubjectId('all')}
              style={[
                styles.subjectChip,
                {
                  backgroundColor: selectedSubjectId === 'all' ? theme.primary : theme.card,
                  borderColor: selectedSubjectId === 'all' ? theme.primary : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.subjectChipText,
                  { color: selectedSubjectId === 'all' ? '#FFFFFF' : theme.textSecondary },
                ]}
              >
                All Subjects
              </Text>
            </TouchableOpacity>

            {subjects.map((sub) => {
              const isSelected = selectedSubjectId === sub.id;
              return (
                <TouchableOpacity
                  key={sub.id}
                  onPress={() => setSelectedSubjectId(sub.id)}
                  style={[
                    styles.subjectChip,
                    {
                      backgroundColor: isSelected ? sub.color : theme.card,
                      borderColor: isSelected ? sub.color : theme.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={sub.icon || 'book-outline'}
                    size={12}
                    color={isSelected ? '#FFFFFF' : sub.color}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.subjectChipText,
                      { color: isSelected ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    {sub.code || sub.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Task List */}
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="checkbox-outline"
              title={
                searchQuery
                  ? 'No matching tasks'
                  : statusFilter === 'completed'
                  ? 'No completed tasks yet'
                  : 'No tasks to show'
              }
              description={
                searchQuery
                  ? 'Check your search filters or clear the search query.'
                  : 'Keep your homework, assignments, and study goals organized in one place.'
              }
              actionTitle="Add New Task"
              onActionPress={() => {
                setEditingTask(null);
                setModalVisible(true);
              }}
            />
          }
        />
      </View>

      <TaskModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
        initialTask={editingTask}
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
  filterTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: 8,
    marginVertical: 4,
  },
  statusTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  statusTabText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  subjectFilterScroll: {
    maxHeight: 44,
    marginVertical: 6,
  },
  subjectFilterContent: {
    paddingHorizontal: SPACING.lg,
    gap: 6,
    alignItems: 'center',
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  subjectChipText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    paddingTop: 4,
  },
});
