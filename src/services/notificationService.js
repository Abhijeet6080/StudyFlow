import { Platform, Alert } from 'react-native';

// Import only LOCAL notification functions directly to avoid loading
// DevicePushTokenAutoRegistration.fx which invokes addPushTokenListener and warnOfExpoGoPushUsage.
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { cancelScheduledNotificationAsync } from 'expo-notifications/build/cancelScheduledNotificationAsync';
import { cancelAllScheduledNotificationsAsync } from 'expo-notifications/build/cancelAllScheduledNotificationsAsync';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';

// Configure foreground notification behavior (strictly local, no push tokens)
try {
  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (e) {
  // Gracefully skip if running in an unsupported environment
}

export const notificationService = {
  /**
   * Request local notification permissions with graceful fallback
   */
  async requestPermissions() {
    try {
      if (Platform.OS === 'web') {
        return { granted: false, reason: 'Web platform does not support local mobile notifications' };
      }

      const { status: existingStatus } = await getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return {
          granted: false,
          reason: 'Notification permission was denied. You can enable it in device settings.',
        };
      }

      // Android specific local notification channel setup
      if (Platform.OS === 'android') {
        try {
          await setNotificationChannelAsync('studyflow-reminders', {
            name: 'StudyFlow Reminders',
            importance: AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#4F46E5',
          });
        } catch (channelError) {
          // Channel setup warning should not block local notifications
        }
      }

      return { granted: true };
    } catch (error) {
      console.warn('Notification permission check error:', error);
      return { granted: false, reason: error.message };
    }
  },

  /**
   * Send an immediate local notification
   */
  async sendInstantNotification(title, body, data = {}) {
    try {
      const perm = await this.requestPermissions();
      if (!perm.granted) {
        Alert.alert('Notifications Disabled', perm.reason || 'Please enable notifications in device settings.');
        return null;
      }

      const id = await scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
          channelId: 'studyflow-reminders',
        },
        trigger: null, // null means trigger immediately
      });

      return id;
    } catch (error) {
      console.warn('Failed to send local notification:', error);
      return null;
    }
  },

  /**
   * Schedule a local reminder for an assignment/task
   */
  async scheduleTaskReminder(task, subjectName) {
    try {
      const perm = await this.requestPermissions();
      if (!perm.granted) {
        Alert.alert('Notifications Disabled', perm.reason || 'Please allow notifications to set reminders.');
        return null;
      }

      const subLabel = subjectName ? ` [${subjectName}]` : '';
      const notificationId = await scheduleNotificationAsync({
        content: {
          title: `📝 Task Reminder${subLabel}`,
          body: `Due soon: ${task.title}. Priority: ${(task.priority || 'Medium').toUpperCase()}`,
          data: { taskId: task.id, type: 'task_reminder' },
          sound: true,
          channelId: 'studyflow-reminders',
        },
        trigger: {
          type: 'timeInterval',
          seconds: 5, // Local test trigger in 5 seconds
        },
      });

      Alert.alert(
        '🔔 Reminder Scheduled',
        `A local reminder has been set for "${task.title}". It will notify you in 5 seconds.`
      );

      return notificationId;
    } catch (error) {
      console.warn('Failed to schedule task reminder:', error);
      Alert.alert('Notice', 'Could not schedule local reminder on this device.');
      return null;
    }
  },

  /**
   * Schedule a local reminder for an upcoming exam
   */
  async scheduleExamReminder(exam, subjectName) {
    try {
      const perm = await this.requestPermissions();
      if (!perm.granted) {
        Alert.alert('Notifications Disabled', perm.reason || 'Please allow notifications to set reminders.');
        return null;
      }

      const subLabel = subjectName ? ` (${subjectName})` : '';
      const roomLabel = exam.room ? ` in ${exam.room}` : '';

      const notificationId = await scheduleNotificationAsync({
        content: {
          title: `🎓 Exam Alert${subLabel}`,
          body: `Upcoming: ${exam.title}${roomLabel} on ${exam.date}. Prep readiness: ${exam.progress || 0}%.`,
          data: { examId: exam.id, type: 'exam_reminder' },
          sound: true,
          channelId: 'studyflow-reminders',
        },
        trigger: {
          type: 'timeInterval',
          seconds: 5, // Local test alert in 5 seconds
        },
      });

      Alert.alert(
        '🔔 Exam Reminder Set',
        `A countdown reminder for "${exam.title}" has been scheduled.`
      );

      return notificationId;
    } catch (error) {
      console.warn('Failed to schedule exam reminder:', error);
      Alert.alert('Notice', 'Could not schedule exam reminder on this device.');
      return null;
    }
  },

  /**
   * Cancel a scheduled local notification
   */
  async cancelNotification(notificationId) {
    try {
      if (notificationId) {
        await cancelScheduledNotificationAsync(notificationId);
      }
    } catch (e) {
      console.warn('Error cancelling notification:', e);
    }
  },

  /**
   * Cancel all scheduled local notifications
   */
  async cancelAll() {
    try {
      await cancelAllScheduledNotificationsAsync();
    } catch (e) {
      console.warn('Error cancelling all notifications:', e);
    }
  },
};
