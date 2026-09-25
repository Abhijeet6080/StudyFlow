import { Platform } from 'react-native';
export { TYPOGRAPHY } from './typography';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const getShadow = (isDark = false, elevation = 2) => {
  if (Platform.OS === 'android') {
    return {
      elevation,
    };
  }

  if (isDark) {
    return {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: 0.35,
      shadowRadius: elevation * 1.5,
    };
  }

  return {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: elevation },
    shadowOpacity: 0.06,
    shadowRadius: elevation * 2,
  };
};
