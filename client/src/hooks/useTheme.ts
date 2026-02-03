import { useState, useEffect, useCallback } from 'react';
import { ThemeName, Theme } from '../types';

const THEME_STORAGE_KEY = 'calendar-theme';

export const themes: Theme[] = [
  { name: 'light', label: 'Light' },
  { name: 'dark', label: 'Dark' },
  { name: 'ocean', label: 'Ocean' },
  { name: 'forest', label: 'Forest' },
];

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && themes.some(t => t.name === saved)) {
      return saved as ThemeName;
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme);
  }, []);

  return { theme, setTheme, themes };
}
