import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDaysToDate, getTodayDateString } from '../utils/dateUtils';

const STORAGE_KEYS = {
  SUBJECTS: '@studyflow_subjects_v1',
  TASKS: '@studyflow_tasks_v1',
  EXAMS: '@studyflow_exams_v1',
  SESSIONS: '@studyflow_sessions_v1',
  PROFILE: '@studyflow_profile_v1',
  THEME_MODE: '@studyflow_theme_mode_v1',
  INITIALIZED: '@studyflow_initialized_v1',
};

export const getSampleData = () => {
  const today = getTodayDateString();
  const sub1Id = 'sub_cs301';
  const sub2Id = 'sub_cs302';
  const sub3Id = 'sub_math201';
  const sub4Id = 'sub_cs304';

  const sampleSubjects = [
    {
      id: sub1Id,
      name: 'Data Structures & Algorithms',
      code: 'CS 301',
      color: '#4F46E5', // Indigo
      icon: 'code-slash-outline',
      instructor: 'Prof. Harrison',
      room: 'Hall B-204',
      targetGrade: 'A',
    },
    {
      id: sub2Id,
      name: 'Operating Systems',
      code: 'CS 302',
      color: '#06B6D4', // Cyan
      icon: 'hardware-chip-outline',
      instructor: 'Dr. Evans',
      room: 'Science Lab 3',
      targetGrade: 'A-',
    },
    {
      id: sub3Id,
      name: 'Linear Algebra & Calc',
      code: 'MATH 201',
      color: '#10B981', // Emerald
      icon: 'calculator-outline',
      instructor: 'Dr. Katherine',
      room: 'Math Dept 102',
      targetGrade: 'A+',
    },
    {
      id: sub4Id,
      name: 'Web Engineering',
      code: 'CS 304',
      color: '#EC4899', // Pink
      icon: 'globe-outline',
      instructor: 'Prof. Miller',
      room: 'Tech Hub 4',
      targetGrade: 'A',
    },
  ];

  const sampleTasks = [
    {
      id: 'task_1',
      title: 'Implement AVL Tree Rotations',
      subjectId: sub1Id,
      dueDate: today,
      priority: 'high',
      completed: false,
      notes: 'Complete left-right and right-left rotation balance methods in Java.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task_2',
      title: 'Review Deadlock & Banker Algorithm',
      subjectId: sub2Id,
      dueDate: today,
      priority: 'medium',
      completed: true,
      notes: 'Read chapter 7 and solve safety state matrix problems.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task_6',
      title: 'Submit Web Dev Responsive Layout Lab',
      subjectId: sub4Id,
      dueDate: today,
      priority: 'high',
      completed: false,
      notes: 'Test mobile breakpoints and export screenshots.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task_3',
      title: 'Eigenvalues Problem Set #4',
      subjectId: sub3Id,
      dueDate: addDaysToDate(2),
      priority: 'high',
      completed: false,
      notes: 'Exercises 14-22 on page 188.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task_4',
      title: 'React Native State Management Lab',
      subjectId: sub4Id,
      dueDate: addDaysToDate(4),
      priority: 'medium',
      completed: false,
      notes: 'Prepare prototype submission with Context API and AsyncStorage.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task_5',
      title: 'Read Dijkstra Shortest Path Proof',
      subjectId: sub1Id,
      dueDate: addDaysToDate(6),
      priority: 'low',
      completed: false,
      notes: 'Slides 45-60 from lecture 9.',
      createdAt: new Date().toISOString(),
    },
  ];

  const sampleExams = [
    {
      id: 'exam_1',
      title: 'Midterm Examination',
      subjectId: sub1Id,
      date: addDaysToDate(3),
      room: 'Main Auditorium A',
      progress: 75,
      weight: '25%',
      notes: 'Topics: Trees, Graphs, Sorting, Dynamic Programming.',
    },
    {
      id: 'exam_2',
      title: 'Processes & Concurrency Quiz',
      subjectId: sub2Id,
      date: addDaysToDate(7),
      room: 'Room 302',
      progress: 50,
      weight: '15%',
      notes: 'Semaphores, Mutex, Thread Scheduling.',
    },
    {
      id: 'exam_3',
      title: 'Linear Algebra Final Exam',
      subjectId: sub3Id,
      date: addDaysToDate(14),
      room: 'Math Hall 1',
      progress: 35,
      weight: '35%',
      notes: 'Comprehensive exam covering vector spaces to SVD.',
    },
  ];

  const sampleSessions = [
    {
      id: 'session_1',
      subjectId: sub1Id,
      durationMinutes: 25,
      completedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      type: 'pomodoro',
    },
    {
      id: 'session_2',
      subjectId: sub2Id,
      durationMinutes: 25,
      completedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      type: 'pomodoro',
    },
  ];

  const sampleProfile = {
    name: 'Alex Turner',
    major: 'Computer Science & Engineering',
    college: 'State University',
    semester: 'Semester 5',
    dailyTargetMinutes: 120, // 2 hours daily study goal
    avatarColor: '#4F46E5',
  };

  return {
    subjects: sampleSubjects,
    tasks: sampleTasks,
    exams: sampleExams,
    sessions: sampleSessions,
    profile: sampleProfile,
  };
};

export const storageService = {
  async initializeStorageIfNeeded() {
    try {
      const initialized = await AsyncStorage.getItem(STORAGE_KEYS.INITIALIZED);
      if (!initialized) {
        await this.seedSampleData();
      }
    } catch (e) {
      console.error('Error initializing storage', e);
    }
  },

  async seedSampleData() {
    const sample = getSampleData();
    await AsyncStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(sample.subjects));
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(sample.tasks));
    await AsyncStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(sample.exams));
    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sample.sessions));
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(sample.profile));
    await AsyncStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    return sample;
  },

  async loadAllData() {
    try {
      const [subjectsJson, tasksJson, examsJson, sessionsJson, profileJson, themeJson] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.SUBJECTS),
          AsyncStorage.getItem(STORAGE_KEYS.TASKS),
          AsyncStorage.getItem(STORAGE_KEYS.EXAMS),
          AsyncStorage.getItem(STORAGE_KEYS.SESSIONS),
          AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
          AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE),
        ]);

      // If data is empty, seed it
      if (!subjectsJson && !tasksJson) {
        return {
          ...(await this.seedSampleData()),
          themeMode: themeJson || 'light',
        };
      }

      return {
        subjects: subjectsJson ? JSON.parse(subjectsJson) : [],
        tasks: tasksJson ? JSON.parse(tasksJson) : [],
        exams: examsJson ? JSON.parse(examsJson) : [],
        sessions: sessionsJson ? JSON.parse(sessionsJson) : [],
        profile: profileJson ? JSON.parse(profileJson) : getSampleData().profile,
        themeMode: themeJson || 'light',
      };
    } catch (error) {
      console.error('Failed to load storage data:', error);
      return {
        ...getSampleData(),
        themeMode: 'light',
      };
    }
  },

  async saveSubjects(subjects) {
    await AsyncStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  async saveTasks(tasks) {
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  async saveExams(exams) {
    await AsyncStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  },

  async saveSessions(sessions) {
    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },

  async saveProfile(profile) {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  async saveThemeMode(mode) {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
  },

  async clearAll() {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.SUBJECTS,
      STORAGE_KEYS.TASKS,
      STORAGE_KEYS.EXAMS,
      STORAGE_KEYS.SESSIONS,
      STORAGE_KEYS.PROFILE,
      STORAGE_KEYS.INITIALIZED,
    ]);
  },
};
