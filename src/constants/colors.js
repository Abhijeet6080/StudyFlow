export const lightTheme = {
  mode: 'light',
  primary: '#4F46E5', // Indigo 600
  primaryLight: '#EEF2FF',
  primaryDark: '#3730A3',
  secondary: '#06B6D4', // Cyan 500
  secondaryLight: '#ECFEFF',
  accent: '#F59E0B', // Amber 500
  accentLight: '#FEF3C7',
  success: '#10B981', // Emerald 500
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  danger: '#EF4444', // Red 500
  dangerLight: '#FEE2E2',

  // Backgrounds
  background: '#F8FAFC', // Slate 50
  card: '#FFFFFF',
  cardAlt: '#F1F5F9', // Slate 100
  modalBackground: '#FFFFFF',

  // Text
  text: '#0F172A', // Slate 900
  textSecondary: '#64748B', // Slate 500
  textMuted: '#94A3B8', // Slate 400
  textInverse: '#FFFFFF',

  // Borders & Dividers
  border: '#E2E8F0', // Slate 200
  borderFocus: '#6366F1',

  // Tab bar
  tabBar: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
  tabBarActive: '#4F46E5',
  tabBarInactive: '#94A3B8',

  // Shadows
  shadowColor: '#0F172A',
};

export const darkTheme = {
  mode: 'dark',
  primary: '#6366F1', // Indigo 500
  primaryLight: '#1E1B4B', // Indigo 950
  primaryDark: '#4338CA',
  secondary: '#22D3EE', // Cyan 400
  secondaryLight: '#083344',
  accent: '#FBBF24',
  accentLight: '#451A03',
  success: '#34D399',
  successLight: '#064E3B',
  warning: '#FBBF24',
  danger: '#F87171',
  dangerLight: '#450A0A',

  // Backgrounds
  background: '#0B0F17', // Deep slate
  card: '#151C2C', // Modern dark card
  cardAlt: '#1E293B',
  modalBackground: '#151C2C',

  // Text
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0F172A',

  // Borders & Dividers
  border: '#1E293B',
  borderFocus: '#818CF8',

  // Tab bar
  tabBar: '#101623',
  tabBarBorder: '#1E293B',
  tabBarActive: '#818CF8',
  tabBarInactive: '#64748B',

  // Shadows
  shadowColor: '#000000',
};

export const SUBJECT_COLORS = [
  '#4F46E5', // Indigo
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#3B82F6', // Blue
];

export const SUBJECT_ICONS = [
  'book-outline',
  'calculator-outline',
  'code-slash-outline',
  'flask-outline',
  'globe-outline',
  'library-outline',
  'hardware-chip-outline',
  'newspaper-outline',
  'pencil-outline',
  'briefcase-outline',
];

export const PRIORITY_CONFIG = {
  high: {
    label: 'High',
    color: '#EF4444',
    bgLight: '#FEE2E2',
    bgDark: '#450A0A',
    icon: 'flame',
  },
  medium: {
    label: 'Medium',
    color: '#F59E0B',
    bgLight: '#FEF3C7',
    bgDark: '#451A03',
    icon: 'alert-circle',
  },
  low: {
    label: 'Low',
    color: '#10B981',
    bgLight: '#D1FAE5',
    bgDark: '#064E3B',
    icon: 'checkmark-circle',
  },
};
