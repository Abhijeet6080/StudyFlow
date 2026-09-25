import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';

// Components
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';
import { TaskCard } from '../components/tasks/TaskCard';
import { ExamCard } from '../components/exams/ExamCard';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';

// Modals
import { SubjectModal } from '../components/subjects/SubjectModal';
import { TaskModal } from '../components/tasks/TaskModal';
import { ExamModal } from '../components/exams/ExamModal';

// Constants & Theme
import { SPACING, RADIUS, TYPOGRAPHY, getShadow } from '../constants/theme';

export const SubjectDetailScreen = ({ route, navigation }) => {
  const { theme, isDark } = useTheme();
  const {
    subjects,
    tasks,
    exams,
    getSubjectById,
    getSubjectStats,
    deleteTask,
    deleteExam,
  } = useData();

  const { subjectId } = route.params || {};
  const subject = getSubjectById(subjectId) || subjects.find((s) => s.id === subjectId);

  // Modals state
  const [subjectModalVisible, setSubjectModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [examModalVisible, setExamModalVisible] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  // Filter tasks & exams for this subject
  const subjectTasks = useMemo(() => {
    return (tasks || []).filter((t) => t.subjectId === subjectId);
  }, [tasks, subjectId]);

  const subjectExams = useMemo(() => {
    return (exams || []).filter((e) => e.subjectId === subjectId);
  }, [exams, subjectId]);

  if (!subject) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.topNav}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.topTitle, { color: theme.text }]}>Subject Details</Text>
        </View>
        <EmptyState
          icon="alert-circle-outline"
          title="Subject Not Found"
          description="The requested course could not be located or has been deleted."
          actionTitle="Return to Subjects"
          onActionPress={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  const stats = getSubjectStats ? getSubjectStats(subject.id) : {
    total: subjectTasks.length,
    completed: subjectTasks.filter((t) => t.completed).length,
    pending: subjectTasks.filter((t) => !t.completed).length,
    progress: subjectTasks.length > 0 ? Math.round((subjectTasks.filter((t) => t.completed).length / subjectTasks.length) * 100) : 0,
  };

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
      {/* Top Navigation Bar with Back Button */}
      <View style={[styles.topNav, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={20} color={theme.text} />
        </TouchableOpacity>

        <View style={styles.topNavCenter}>
          <Text style={[styles.topSubtitle, { color: subject.color }]}>
            {subject.code || 'COURSE'}
          </Text>
          <Text style={[styles.topTitle, { color: theme.text }]} numberOfLines={1}>
            {subject.name}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}
          onPress={() => setSubjectModalVisible(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="pencil-outline" size={18} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Subject Hero Card */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            getShadow(isDark, 3),
          ]}
        >
          <View style={styles.heroTopRow}>
            <View style={[styles.iconBox, { backgroundColor: `${subject.color}20` }]}>
              <Ionicons
                name={subject.icon || 'book-outline'}
                size={28}
                color={subject.color}
              />
            </View>

            <View style={styles.heroInfo}>
              <Text style={[styles.heroCode, { color: subject.color }]}>
                {subject.code}
              </Text>
              <Text style={[styles.heroName, { color: theme.text }]}>
                {subject.name}
              </Text>
            </View>

            {subject.targetGrade ? (
              <Badge
                label={`Target: ${subject.targetGrade}`}
                color={subject.color}
                bgColor={`${subject.color}15`}
                size="sm"
              />
            ) : null}
          </View>

          {/* Instructor & Location info */}
          {(subject.instructor || subject.room) && (
            <View style={styles.instructorRow}>
              {subject.instructor ? (
                <View style={styles.metaBadge}>
                  <Ionicons name="person-outline" size={14} color={theme.textSecondary} />
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                    {subject.instructor}
                  </Text>
                </View>
              ) : null}

              {subject.room ? (
                <View style={styles.metaBadge}>
                  <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                    {subject.room}
                  </Text>
                </View>
              ) : null}
            </View>
          )}

          {/* Progress Bar section */}
          <View style={styles.progressBlock}>
            <View style={styles.progressLabelRow}>
              <Text style={[styles.progressTitle, { color: theme.textSecondary }]}>
                Overall Course Progress
              </Text>
              <Text style={[styles.progressScore, { color: subject.color }]}>
                {stats.progress}%
              </Text>
            </View>
            <ProgressBar
              progress={stats.progress}
              color={subject.color}
              height={8}
            />
          </View>
        </View>

        {/* Course Statistics Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {stats.total}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Total Tasks
            </Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statValue, { color: theme.success }]}>
              {stats.completed}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Completed
            </Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statValue, { color: theme.warning }]}>
              {stats.pending}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Pending
            </Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statValue, { color: theme.secondary }]}>
              {subjectExams.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Exams
            </Text>
          </View>
        </View>

        {/* Quick Actions for Subject */}
        <View style={styles.quickActionsRow}>
          <Button
            title="Add Task"
            icon="add-circle-outline"
            size="sm"
            variant="primary"
            style={{ flex: 1 }}
            onPress={() => {
              setEditingTask(null);
              setTaskModalVisible(true);
            }}
          />
          <Button
            title="Schedule Exam"
            icon="calendar-outline"
            size="sm"
            variant="secondary"
            style={{ flex: 1 }}
            onPress={() => {
              setEditingExam(null);
              setExamModalVisible(true);
            }}
          />
        </View>

        {/* Related Tasks Section */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWithBadge}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Course Assignments & Tasks
            </Text>
            <View style={[styles.countBadge, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.countBadgeText, { color: theme.primary }]}>
                {subjectTasks.length}
              </Text>
            </View>
          </View>
        </View>

        {subjectTasks.length === 0 ? (
          <EmptyState
            icon="checkbox-outline"
            title="No tasks for this course"
            description="Add assignments, reading material, or labs to track your homework."
            actionTitle="Create Task"
            onActionPress={() => {
              setEditingTask(null);
              setTaskModalVisible(true);
            }}
          />
        ) : (
          subjectTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              showSubject={false}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))
        )}

        {/* Related Exams Section */}
        <View style={[styles.sectionHeaderRow, { marginTop: SPACING.xl }]}>
          <View style={styles.sectionTitleWithBadge}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Exams & Quizzes
            </Text>
            <View style={[styles.countBadge, { backgroundColor: theme.secondaryLight }]}>
              <Text style={[styles.countBadgeText, { color: theme.secondary }]}>
                {subjectExams.length}
              </Text>
            </View>
          </View>
        </View>

        {subjectExams.length === 0 ? (
          <EmptyState
            icon="school-outline"
            title="No exams scheduled"
            description="No midterms or quizzes logged for this subject yet."
            actionTitle="Add Exam"
            onActionPress={() => {
              setEditingExam(null);
              setExamModalVisible(true);
            }}
          />
        ) : (
          subjectExams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onEdit={handleEditExam}
              onDelete={handleDeleteExam}
            />
          ))
        )}
      </ScrollView>

      {/* Modals */}
      <SubjectModal
        visible={subjectModalVisible}
        onClose={() => setSubjectModalVisible(false)}
        initialSubject={subject}
      />

      <TaskModal
        visible={taskModalVisible}
        onClose={() => {
          setTaskModalVisible(false);
          setEditingTask(null);
        }}
        initialTask={editingTask || { subjectId: subject.id }}
      />

      <ExamModal
        visible={examModalVisible}
        onClose={() => {
          setExamModalVisible(false);
          setEditingExam(null);
        }}
        initialExam={editingExam || { subjectId: subject.id }}
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
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNavCenter: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  topSubtitle: {
    ...TYPOGRAPHY.overline,
    fontWeight: '800',
  },
  topTitle: {
    ...TYPOGRAPHY.h3,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    paddingTop: SPACING.sm,
  },
  heroCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    marginVertical: SPACING.xs,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  heroInfo: {
    flex: 1,
  },
  heroCode: {
    ...TYPOGRAPHY.overline,
    fontWeight: '800',
  },
  heroName: {
    ...TYPOGRAPHY.h3,
    marginTop: 2,
  },
  instructorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    ...TYPOGRAPHY.caption,
  },
  progressBlock: {
    marginTop: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressTitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  progressScore: {
    ...TYPOGRAPHY.caption,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: SPACING.md,
  },
  statBox: {
    flex: 1,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    ...TYPOGRAPHY.h3,
    fontWeight: '800',
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    marginTop: SPACING.xs,
  },
  sectionTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    fontWeight: '700',
  },
  countBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  countBadgeText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
});
