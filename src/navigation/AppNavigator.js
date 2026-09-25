import React, { useState } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';

import { SplashScreen } from '../screens/SplashScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { SubjectsScreen } from '../screens/SubjectsScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { ExamsScreen } from '../screens/ExamsScreen';
import { StudyTimerScreen } from '../screens/StudyTimerScreen';
import { ProfileSettingsScreen } from '../screens/ProfileSettingsScreen';
import { SubjectDetailScreen } from '../screens/SubjectDetailScreen';
import { RADIUS, SPACING } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => {
  const { theme } = useTheme();
  const { tasks, upcomingExams } = useData();
  const insets = useSafeAreaInsets();

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.tabBarBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Subjects"
        component={SubjectsScreen}
        options={{
          tabBarLabel: 'Subjects',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'book' : 'book-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          tabBarLabel: 'Tasks',
          tabBarBadge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.primary,
            fontSize: 10,
            color: '#FFFFFF',
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'checkbox' : 'checkbox-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Exams"
        component={ExamsScreen}
        options={{
          tabBarLabel: 'Exams',
          tabBarBadge: upcomingExams.length > 0 ? upcomingExams.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.secondary,
            fontSize: 10,
            color: '#FFFFFF',
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'school' : 'school-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Timer"
        component={StudyTimerScreen}
        options={{
          tabBarLabel: 'Timer',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'timer' : 'timer-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileSettingsScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person-circle' : 'person-circle-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="SubjectDetail" component={SubjectDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
