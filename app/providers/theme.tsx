'use client';

import { useEffect } from 'react';

export const ThemeProvider = () => {
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const theme = stored || (systemPrefersDark ? 'dark' : 'light');

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, []);

  return null;
};
