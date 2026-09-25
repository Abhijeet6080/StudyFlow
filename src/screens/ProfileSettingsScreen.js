import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { Header } from '../components/common/Header';
import { ModalWrapper } from '../components/common/ModalWrapper';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { SPACING, RADIUS, TYPOGRAPHY, getShadow } from '../constants/theme';
import { formatMinutes } from '../utils/helpers';
import { notificationService } from '../services/notificationService';

export const ProfileSettingsScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const {
    profile,
    updateProfile,
    resetToSampleData,
    clearAllData,
    tasks,
    subjects,
    exams,
    sessions,
  } = useData();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [major, setMajor] = useState(profile?.major || '');
  const [college, setCollege] = useState(profile?.college || '');
  const [semester, setSemester] = useState(profile?.semester || '');
  const [targetHours, setTargetHours] = useState(
    profile?.dailyTargetMinutes ? String(profile.dailyTargetMinutes / 60) : '2'
  );

  const openEditModal = () => {
    setName(profile?.name || '');
    setMajor(profile?.major || '');
    setCollege(profile?.college || '');
    setSemester(profile?.semester || '');
    setTargetHours(profile?.dailyTargetMinutes ? String(profile.dailyTargetMinutes / 60) : '2');
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    const mins = Math.max(15, Math.round((parseFloat(targetHours) || 2) * 60));
    await updateProfile({
      name: name.trim() || 'Student',
      major: major.trim(),
      college: college.trim(),
      semester: semester.trim(),
      dailyTargetMinutes: mins,
    });
    setEditModalVisible(false);
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Sample Data',
      'This will reload fresh college demo data for subjects, tasks, and upcoming exams.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset to Demo',
          style: 'default',
          onPress: async () => {
            await resetToSampleData();
            Alert.alert('Success', 'StudyFlow demo data has been loaded.');
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure? This will remove all custom tasks, subjects, and exams permanently.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Everything',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('Cleared', 'All stored data has been removed.');
          },
        },
      ]
    );
  };

  const totalFocusMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header
        subtitle="PREFERENCES & STATS"
        title="Profile & Settings"
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            getShadow(isDark, 3),
          ]}
        >
          <View style={styles.profileRow}>
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: profile?.avatarColor || theme.primary },
              ]}
            >
              <Text style={styles.avatarLetter}>
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'S'}
              </Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.text }]}>
                {profile?.name || 'Alex Turner'}
              </Text>
              <Text style={[styles.profileMajor, { color: theme.textSecondary }]}>
                {profile?.major || 'Computer Science'} • {profile?.semester || 'Semester 5'}
              </Text>
              <Text style={[styles.profileCollege, { color: theme.textMuted }]}>
                {profile?.college || 'State University'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={openEditModal}
              style={[styles.editBtn, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="create-outline" size={18} color={theme.primary} />
            </TouchableOpacity>
          </View>

          {/* Daily study goal bar */}
          <View style={[styles.goalPill, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="flag-outline" size={16} color={theme.primary} />
            <Text style={[styles.goalText, { color: theme.primary }]}>
              Daily Target: {formatMinutes(profile?.dailyTargetMinutes || 120)}
            </Text>
          </View>
        </View>

        {/* Academic Analytics Stats Row */}
        <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
          LIFETIME PRODUCTIVITY
        </Text>
        <View style={styles.analyticsRow}>
          <View style={[styles.analyticBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.analyticNumber, { color: theme.primary }]}>
              {completedTasksCount}
            </Text>
            <Text style={[styles.analyticLabel, { color: theme.textSecondary }]}>
              Tasks Done
            </Text>
          </View>

          <View style={[styles.analyticBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.analyticNumber, { color: theme.secondary }]}>
              {subjects.length}
            </Text>
            <Text style={[styles.analyticLabel, { color: theme.textSecondary }]}>
              Active Courses
            </Text>
          </View>

          <View style={[styles.analyticBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.analyticNumber, { color: theme.accent }]}>
              {formatMinutes(totalFocusMinutes)}
            </Text>
            <Text style={[styles.analyticLabel, { color: theme.textSecondary }]}>
              Focus Time
            </Text>
          </View>
        </View>

        {/* Appearance Settings */}
        <Text style={[styles.sectionHeading, { color: theme.textSecondary, marginTop: SPACING.lg }]}>
          PREFERENCES
        </Text>

        <View style={[styles.settingsGroup, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBox, { backgroundColor: theme.primaryLight }]}>
                <Ionicons
                  name={isDark ? 'moon' : 'sunny'}
                  size={18}
                  color={theme.primary}
                />
              </View>
              <View>
                <Text style={[styles.settingTitle, { color: theme.text }]}>Dark Mode</Text>
                <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                  {isDark ? 'Dark theme enabled' : 'Light theme enabled'}
                </Text>
              </View>
            </View>

            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#CBD5E1', true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity
            style={[styles.settingItem, { borderTopWidth: 1, borderTopColor: theme.border }]}
            onPress={async () => {
              await notificationService.sendInstantNotification(
                '🔔 StudyFlow Reminder Test',
                'Your study notifications and exam countdowns are working perfectly!'
              );
            }}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBox, { backgroundColor: theme.accentLight }]}>
                <Ionicons name="notifications-outline" size={18} color={theme.accent} />
              </View>
              <View>
                <Text style={[styles.settingTitle, { color: theme.text }]}>Study Reminders</Text>
                <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                  Tap to test local notifications & check permissions
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Data Management Section */}
        <Text style={[styles.sectionHeading, { color: theme.textSecondary, marginTop: SPACING.lg }]}>
          DATA PERSISTENCE & STORAGE
        </Text>

        <View style={[styles.settingsGroup, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.settingItem, { borderBottomWidth: 1, borderBottomColor: theme.border }]}
            onPress={handleResetData}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBox, { backgroundColor: theme.secondaryLight }]}>
                <Ionicons name="refresh-circle-outline" size={20} color={theme.secondary} />
              </View>
              <View>
                <Text style={[styles.settingTitle, { color: theme.text }]}>
                  Reload Sample College Data
                </Text>
                <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                  Populate mock subjects, tasks, and upcoming exams
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleClearData}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBox, { backgroundColor: theme.mode === 'dark' ? '#450A0A' : '#FEE2E2' }]}>
                <Ionicons name="trash-outline" size={18} color={theme.danger} />
              </View>
              <View>
                <Text style={[styles.settingTitle, { color: theme.danger }]}>
                  Clear All Data
                </Text>
                <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                  Wipe local AsyncStorage data
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* App Info Footer */}
        <View style={styles.appInfoBox}>
          <View style={[styles.logoMini, { backgroundColor: theme.primary }]}>
            <Ionicons name="school" size={18} color="#FFFFFF" />
          </View>
          <Text style={[styles.appName, { color: theme.text }]}>StudyFlow</Text>
          <Text style={[styles.appVersion, { color: theme.textMuted }]}>
            Version 1.0.0 • Mobile Application Project
          </Text>
          <Text style={[styles.appCredits, { color: theme.textSecondary }]}>
            100% Offline with AsyncStorage • Designed for College Students
          </Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <ModalWrapper
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        title="Edit Student Profile"
        subtitle="Personalize your college credentials and study targets"
        footer={
          <View style={styles.footerRow}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setEditModalVisible(false)}
              style={{ flex: 1 }}
            />
            <Button
              title="Save Profile"
              variant="primary"
              onPress={handleSaveProfile}
              icon="checkmark"
              style={{ flex: 1 }}
            />
          </View>
        }
      >
        <Input
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Alex Turner"
          icon="person-outline"
        />
        <Input
          label="College / University"
          value={college}
          onChangeText={setCollege}
          placeholder="e.g. State University of Technology"
          icon="school-outline"
        />
        <View style={styles.row}>
          <Input
            label="Major / Branch"
            value={major}
            onChangeText={setMajor}
            placeholder="e.g. Computer Science"
            style={{ flex: 1 }}
          />
          <Input
            label="Semester"
            value={semester}
            onChangeText={setSemester}
            placeholder="e.g. Sem 5"
            style={{ width: 110 }}
          />
        </View>
        <Input
          label="Daily Study Goal (Hours)"
          value={targetHours}
          onChangeText={setTargetHours}
          placeholder="e.g. 2.5"
          keyboardType="numeric"
          icon="time-outline"
        />
      </ModalWrapper>
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  profileCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...TYPOGRAPHY.h3,
  },
  profileMajor: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  profileCollege: {
    ...TYPOGRAPHY.caption,
    marginTop: 1,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
  },
  goalText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  sectionHeading: {
    ...TYPOGRAPHY.overline,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  analyticsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  analyticBox: {
    flex: 1,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
  },
  analyticNumber: {
    ...TYPOGRAPHY.h3,
    fontWeight: '800',
  },
  analyticLabel: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
    fontSize: 11,
    textAlign: 'center',
  },
  settingsGroup: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginVertical: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: SPACING.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  settingIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    ...TYPOGRAPHY.bodyBold,
  },
  settingDesc: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
    maxWidth: 240,
  },
  appInfoBox: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    marginTop: SPACING.md,
  },
  logoMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  appName: {
    ...TYPOGRAPHY.h4,
    fontWeight: '800',
  },
  appVersion: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  appCredits: {
    ...TYPOGRAPHY.caption,
    marginTop: 4,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  footerRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
});
