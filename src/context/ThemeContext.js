import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../constants/colors';
import { storageService } from '../services/storageService';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const data = await storageService.loadAllData();
        if (data.themeMode === 'dark' || (data.themeMode === 'system' && systemScheme === 'dark')) {
          setIsDark(true);
        } else {
          setIsDark(false);
        }
      } catch (e) {
        setIsDark(false);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, [systemScheme]);

  const toggleTheme = async () => {
    const nextMode = !isDark;
    setIsDark(nextMode);
    await storageService.saveThemeMode(nextMode ? 'dark' : 'light');
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
