import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';

// Reusable Components
import { Header } from '../components/common/Header';
import { ProgressCard } from '../components/dashboard/ProgressCard';
import { WeeklyStudyChart } from '../components/dashboard/WeeklyStudyChart';
import { QuickActionButton } from '../components/dashboard/QuickActionButton';
import { TaskCard } from '../components/tasks/TaskCard';
import { ExamCard } from '../components/exams/ExamCard';
import { EmptyState } from '../components/common/EmptyState';
import { ProgressBar } from '../components/common/ProgressBar';

// Modals
import { TaskModal } from '../components/tasks/TaskModal';
import { SubjectModal } from '../components/subjects/SubjectModal';
import { ExamModal } from '../components/exams/ExamModal';

// Constants & Utilities
import { SPACING, TYPOGRAPHY, RADIUS, getShadow } from '../constants/theme';
import { formatDateString } from '../utils/dateUtils';

export const DashboardScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const {
    profile,
    todayTasks,
    upcomingExams,
    deleteTask,
    deleteExam,
  } = useData();

  // Modal dialog states
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [subjectModalVisible, setSubjectModalVisible] = useState(false);

  const [examModalVisible, setExamModalVisible] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  // Formatting
  const todayFormatted = formatDateString(new Date().toISOString());
  const studentFirstName = profile?.name ? profile.name.trim().split(' ')[0] : 'Student';

  // Task summary calculations
  const totalToday = todayTasks.length;
  const completedToday = todayTasks.filter((t) => t.completed).length;
  const pendingToday = totalToday - completedToday;
  const todayPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // Responsive padding
  const horizontalPadding = width > 400 ? SPACING.lg : SPACING.md;

  // Handlers
  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskModalVisible(true);
  };

  const handleDeleteTask = (task) => {
    Alert.alert('Delete Task', `Are you sure you want to delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask(task.id) },
    ]);
  };

  const handleEditExam = (exam) => {
    setEditingExam(exam);
    setExamModalVisible(true);
  };

  const handleDeleteExam = (exam) => {
    Alert.alert('Delete Exam', `Are you sure you want to delete "${exam.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteExam(exam.id) },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Top Header: Greeting, Date & Profile Avatar */}
      <Header
        subtitle={todayFormatted}
        title={`Hello, ${studentFirstName}! 👋`}
        showThemeToggle={true}
        rightElement={
          <TouchableOpacity
            style={[
              styles.profileAvatar,
              { backgroundColor: profile?.avatarColor || theme.primary },
            ]}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
            accessibilityLabel="Open profile"
          >
            <Text style={styles.avatarText}>
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'S'}
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: horizontalPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's Task Summary Banner */}
        <View
          style={[
            styles.summaryBanner,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            getShadow(isDark, 2),
          ]}
        >
          <View style={styles.summaryTop}>
            <View style={styles.summaryTextGroup}>
              <Text style={[styles.summaryTitle, { color: theme.text }]}>
                Today's Task Summary
              </Text>
              <Text style={[styles.summarySubtitle, { color: theme.textSecondary }]}>
                {totalToday === 0
                  ? 'No tasks scheduled for today'
                  : pendingToday === 0
                  ? 'All tasks completed for today! Great job! 🎉'
                  : `${pendingToday} ${pendingToday === 1 ? 'task' : 'tasks'} remaining • ${completedToday} completed`}
              </Text>
            </View>

            <View
              style={[
                styles.summaryPill,
                {
                  backgroundColor:
                    totalToday === 0
                      ? theme.cardAlt
                      : pendingToday === 0
                      ? theme.successLight
                      : theme.primaryLight,
                },
              ]}
            >
              <Ionicons
                name={
                  totalToday === 0
                    ? 'checkbox-outline'
                    : pendingToday === 0
                    ? 'checkmark-done-circle'
                    : 'time-outline'
                }
                size={16}
                color={
                  totalToday === 0
                    ? theme.textSecondary
                    : pendingToday === 0
                    ? theme.success
                    : theme.primary
                }
              />
              <Text
                style={[
                  styles.summaryPillText,
                  {
                    color:
                      totalToday === 0
                        ? theme.textSecondary
                        : pendingToday === 0
                        ? theme.success
                        : theme.primary,
                  },
                ]}
              >
                {totalToday === 0 ? 'Clear' : `${todayPercent}% Done`}
              </Text>
            </View>
          </View>

          {totalToday > 0 && (
            <ProgressBar
              progress={todayPercent}
              color={pendingToday === 0 ? theme.success : theme.primary}
              height={6}
              style={{ marginTop: SPACING.xs }}
            />
          )}
        </View>

        {/* Study Progress Card */}
        <ProgressCard
          onPress={() => navigation.navigate('Timer')}
        />

        {/* Quick Action Buttons */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            QUICK ACTIONS
          </Text>
          <View style={styles.quickActionsRow}>
            <QuickActionButton
              icon="add-circle"
              label="Add Task"
              color={theme.primary}
              bgColor={theme.primaryLight}
              onPress={() => {
                setEditingTask(null);
                setTaskModalVisible(true);
              }}
            />
            <QuickActionButton
              icon="timer"
              label="Study Timer"
              color={theme.accent}
              bgColor={theme.accentLight}
              onPress={() => navigation.navigate('Timer')}
            />
            <QuickActionButton
              icon="calendar"
              label="Add Exam"
              color={theme.secondary}
              bgColor={theme.secondaryLight}
              onPress={() => {
                setEditingExam(null);
                setExamModalVisible(true);
              }}
            />
            <QuickActionButton
              icon="book"
              label="New Subject"
              color={theme.success}
              bgColor={theme.successLight}
              onPress={() => setSubjectModalVisible(true)}
            />
          </View>
        </View>

        {/* Weekly Study Hours Activity Chart */}
        <WeeklyStudyChart />

        {/* Today's Tasks Section */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWithBadge}>
            <Text style={[styles.mainHeading, { color: theme.text }]}>
              Today's Tasks
            </Text>
            <View
              style={[
                styles.badgeCounter,
                { backgroundColor: pendingToday > 0 ? theme.primaryLight : theme.cardAlt },
              ]}
            >
              <Text
                style={[
                  styles.badgeCounterText,
                  { color: pendingToday > 0 ? theme.primary : theme.textSecondary },
                ]}
              >
                {pendingToday} due
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Tasks')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.viewAllBtn, { color: theme.primary }]}>
              View All ({todayTasks.length})
            </Text>
          </TouchableOpacity>
        </View>

        {todayTasks.length === 0 ? (
          <EmptyState
            icon="checkbox-outline"
            title="No tasks due today"
            description="You have nothing urgent due today. Stay ahead by scheduling new assignments!"
            actionTitle="Add New Task"
            onActionPress={() => {
              setEditingTask(null);
              setTaskModalVisible(true);
            }}
          />
        ) : (
          todayTasks.slice(0, 4).map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))
        )}

        {/* Upcoming Exams Section */}
        <View style={[styles.sectionHeaderRow, { marginTop: SPACING.xl }]}>
          <View style={styles.sectionTitleWithBadge}>
            <Text style={[styles.mainHeading, { color: theme.text }]}>
              Upcoming Exams
            </Text>
            <View style={[styles.badgeCounter, { backgroundColor: theme.secondaryLight }]}>
              <Text style={[styles.badgeCounterText, { color: theme.secondary }]}>
                {upcomingExams.length} scheduled
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Exams')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.viewAllBtn, { color: theme.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {upcomingExams.length === 0 ? (
          <EmptyState
            icon="school-outline"
            title="No upcoming exams"
            description="All clear on examinations for now. Add your midterms or quizzes to plan ahead."
            actionTitle="Schedule Exam"
            onActionPress={() => {
              setEditingExam(null);
              setExamModalVisible(true);
            }}
          />
        ) : (
          upcomingExams.slice(0, 3).map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onEdit={handleEditExam}
              onDelete={handleDeleteExam}
            />
          ))
        )}
      </ScrollView>

      {/* Reusable Modals */}
      <TaskModal
        visible={taskModalVisible}
        onClose={() => {
          setTaskModalVisible(false);
          setEditingTask(null);
        }}
        initialTask={editingTask}
      />

      <SubjectModal
        visible={subjectModalVisible}
        onClose={() => setSubjectModalVisible(false)}
      />

      <ExamModal
        visible={examModalVisible}
        onClose={() => {
          setExamModalVisible(false);
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
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  profileAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  summaryBanner: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  summaryTextGroup: {
    flex: 1,
  },
  summaryTitle: {
    ...TYPOGRAPHY.h4,
    fontWeight: '700',
  },
  summarySubtitle: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  summaryPillText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  sectionBlock: {
    marginVertical: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.overline,
    marginBottom: SPACING.sm,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainHeading: {
    ...TYPOGRAPHY.h3,
  },
  badgeCounter: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  badgeCounterText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  viewAllBtn: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '700',
  },
});
