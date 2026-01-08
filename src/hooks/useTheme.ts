'use client';

import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if window is available (client-side)
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      // Set initial theme
      setTheme(mediaQuery.matches ? 'dark' : 'light');

      // Listen for changes
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);

      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const themeClasses = {
    // Main backgrounds
    background: theme === 'dark' ? 'bg-[#020202]' : 'bg-white',
    cardBackground: theme === 'dark' ? 'bg-[#2E2E2E]' : 'bg-white',

    // Text colors
    textPrimary: theme === 'dark' ? 'text-[#FFFFFF]' : 'text-black',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    textMuted: theme === 'dark' ? 'text-gray-400' : 'text-gray-400',

    // Border colors
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-50',

    // Shadow colors
    shadow: theme === 'dark' ? 'shadow-[0_4px_20px_rgba(255,255,255,0.05)]' : 'shadow-[0_4px_20px_rgba(0,0,0,0.05)]',
    shadowHover: theme === 'dark' ? 'hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]' : 'hover:shadow-[0_0_25px_rgba(0,0,0,0.15)]',
  };

  return {
    theme,
    isDark: theme === 'dark',
    mounted,
    classes: themeClasses,
  };
};
