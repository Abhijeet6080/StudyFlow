import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { storageService, getSampleData } from '../services/storageService';
import { generateId } from '../utils/helpers';
import { isDateToday, getDaysRemaining } from '../utils/dateUtils';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [exams, setExams] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [profile, setProfile] = useState(getSampleData().profile);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const data = await storageService.loadAllData();
      setSubjects(data.subjects || []);
      setTasks(data.tasks || []);
      setExams(data.exams || []);
      setSessions(data.sessions || []);
      setProfile(data.profile || getSampleData().profile);
    } catch (e) {
      console.error('Failed to load data in context', e);
    } finally {
      setIsLoading(false);
    }
  };

  // SUBJECT ACTIONS
  const addSubject = async (subjectData) => {
    const newSubject = {
      id: generateId('sub'),
      ...subjectData,
      createdAt: new Date().toISOString(),
    };
    const updated = [...subjects, newSubject];
    setSubjects(updated);
    await storageService.saveSubjects(updated);
    return newSubject;
  };

  const updateSubject = async (id, updatedFields) => {
    const updated = subjects.map((sub) => (sub.id === id ? { ...sub, ...updatedFields } : sub));
    setSubjects(updated);
    await storageService.saveSubjects(updated);
  };

  const deleteSubject = async (id) => {
    const updatedSubjects = subjects.filter((sub) => sub.id !== id);
    // Also remove or unlink tasks and exams for this subject
    const updatedTasks = tasks.filter((t) => t.subjectId !== id);
    const updatedExams = exams.filter((e) => e.subjectId !== id);

    setSubjects(updatedSubjects);
    setTasks(updatedTasks);
    setExams(updatedExams);

    await Promise.all([
      storageService.saveSubjects(updatedSubjects),
      storageService.saveTasks(updatedTasks),
      storageService.saveExams(updatedExams),
    ]);
  };

  // TASK ACTIONS
  const addTask = async (taskData) => {
    const newTask = {
      id: generateId('task'),
      completed: false,
      createdAt: new Date().toISOString(),
      ...taskData,
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    await storageService.saveTasks(updated);
    return newTask;
  };

  const updateTask = async (id, updatedFields) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
    setTasks(updated);
    await storageService.saveTasks(updated);
  };

  const deleteTask = async (id) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    await storageService.saveTasks(updated);
  };

  const toggleTaskCompleted = async (id) => {
    const updated = tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            completed: !t.completed,
            completedAt: !t.completed ? new Date().toISOString() : null,
          }
        : t
    );
    setTasks(updated);
    await storageService.saveTasks(updated);
  };

  // EXAM ACTIONS
  const addExam = async (examData) => {
    const newExam = {
      id: generateId('exam'),
      progress: 0,
      createdAt: new Date().toISOString(),
      ...examData,
    };
    const updated = [...exams, newExam];
    setExams(updated);
    await storageService.saveExams(updated);
    return newExam;
  };

  const updateExam = async (id, updatedFields) => {
    const updated = exams.map((e) => (e.id === id ? { ...e, ...updatedFields } : e));
    setExams(updated);
    await storageService.saveExams(updated);
  };

  const deleteExam = async (id) => {
    const updated = exams.filter((e) => e.id !== id);
    setExams(updated);
    await storageService.saveExams(updated);
  };

  // STUDY SESSIONS ACTIONS
  const addStudySession = async (sessionData) => {
    const newSession = {
      id: generateId('session'),
      completedAt: new Date().toISOString(),
      ...sessionData,
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    await storageService.saveSessions(updated);
    return newSession;
  };

  // PROFILE ACTIONS
  const updateProfile = async (fields) => {
    const updated = { ...profile, ...fields };
    setProfile(updated);
    await storageService.saveProfile(updated);
  };

  // RESET / CLEAR
  const resetToSampleData = async () => {
    setIsLoading(true);
    try {
      const sample = await storageService.seedSampleData();
      setSubjects(sample.subjects);
      setTasks(sample.tasks);
      setExams(sample.exams);
      setSessions(sample.sessions);
      setProfile(sample.profile);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllData = async () => {
    setIsLoading(true);
    try {
      await storageService.clearAll();
      setSubjects([]);
      setTasks([]);
      setExams([]);
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // COMPUTED VALUES
  const getSubjectById = (id) => {
    return subjects.find((s) => s.id === id) || null;
  };

  const getSubjectStats = (subjectId) => {
    const subjectTasks = tasks.filter((t) => t.subjectId === subjectId);
    const total = subjectTasks.length;
    const completed = subjectTasks.filter((t) => t.completed).length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, pending: total - completed, progress };
  };

  const todayTasks = useMemo(() => {
    return tasks.filter((t) => isDateToday(t.dueDate));
  }, [tasks]);

  const upcomingExams = useMemo(() => {
    return [...exams]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .filter((e) => getDaysRemaining(e.date) >= 0);
  }, [exams]);

  const todayFocusMinutes = useMemo(() => {
    return sessions
      .filter((s) => isDateToday(s.completedAt))
      .reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  }, [sessions]);

  const totalCompletedSessions = useMemo(() => {
    return sessions.length;
  }, [sessions]);

  const overallProgress = useMemo(() => {
    const total = tasks.length;
    if (total === 0) return 0;
    const completed = tasks.filter((t) => t.completed).length;
    return Math.round((completed / total) * 100);
  }, [tasks]);

  return (
    <DataContext.Provider
      value={{
        isLoading,
        subjects,
        tasks,
        exams,
        sessions,
        profile,
        // Subject actions
        addSubject,
        updateSubject,
        deleteSubject,
        getSubjectById,
        getSubjectStats,
        // Task actions
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompleted,
        // Exam actions
        addExam,
        updateExam,
        deleteExam,
        // Session actions
        addStudySession,
        // Profile actions
        updateProfile,
        // Reset/clear
        resetToSampleData,
        clearAllData,
        // Computed
        todayTasks,
        upcomingExams,
        todayFocusMinutes,
        totalCompletedSessions,
        overallProgress,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
