import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext();

export const THEME_PALETTES = {
  home: {
    id: 'home',
    name: 'Violet & Pink (Home)',
    primary: '#8b5cf6',
    secondary: '#ec4899',
    tertiary: '#22d3ee',
    fogColor: 0x181824,
    particles: [0x8b5cf6, 0xec4899, 0x22d3ee, 0x38bdf8],
  },
  blog: {
    id: 'blog',
    name: 'Cool Blue (Blog Editor)',
    primary: '#3b82f6',
    secondary: '#22d3ee',
    tertiary: '#8b5cf6',
    fogColor: 0x181824,
    particles: [0x3b82f6, 0x22d3ee, 0x8b5cf6, 0x60a5fa],
  },
  vlog: {
    id: 'vlog',
    name: 'Magenta & Cyan (Vlog Studio)',
    primary: '#ec4899',
    secondary: '#22d3ee',
    tertiary: '#8b5cf6',
    fogColor: 0x181824,
    particles: [0xec4899, 0x22d3ee, 0x8b5cf6, 0xf43f5e],
  },
  dashboard: {
    id: 'dashboard',
    name: 'Teal & Emerald (Dashboard)',
    primary: '#0d9488',
    secondary: '#10b981',
    tertiary: '#22d3ee',
    fogColor: 0x181824,
    particles: [0x0d9488, 0x10b981, 0x22d3ee, 0x34d399],
  },
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const location = useLocation();
  const [activeThemeKey, setActiveThemeKey] = useState('home');

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/create-blog') || path.includes('/edit-blog') || path.includes('/blog/')) {
      setActiveThemeKey('blog');
    } else if (path.includes('/vlog-editor')) {
      setActiveThemeKey('vlog');
    } else if (path.includes('/dashboard') || path.includes('/my-published')) {
      setActiveThemeKey('dashboard');
    } else {
      setActiveThemeKey('home');
    }
  }, [location.pathname]);

  const activeTheme = THEME_PALETTES[activeThemeKey] || THEME_PALETTES.home;

  return (
    <ThemeContext.Provider value={{ activeThemeKey, activeTheme, THEME_PALETTES }}>
      {children}
    </ThemeContext.Provider>
  );
};
