// src/hooks/useTheme.js

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const THEME_KEY = 'gemini-chat-theme';
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    return savedTheme || THEMES.SYSTEM;
  });

  const [effectiveTheme, setEffectiveTheme] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === THEMES.DARK || savedTheme === THEMES.LIGHT) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? THEMES.DARK 
      : THEMES.LIGHT;
  });

  const getSystemTheme = useCallback(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEMES.DARK
      : THEMES.LIGHT;
  }, []);

  const applyTheme = useCallback((newTheme) => {
    const root = document.documentElement;
    
    if (newTheme === THEMES.DARK) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    document.documentElement.setAttribute('data-theme', newTheme);
    setEffectiveTheme(newTheme);
  }, []);

  const setLightTheme = useCallback(() => {
    setTheme(THEMES.LIGHT);
    localStorage.setItem(THEME_KEY, THEMES.LIGHT);
    applyTheme(THEMES.LIGHT);
    toast.success('Tema claro activado');
  }, [applyTheme]);

  const setDarkTheme = useCallback(() => {
    setTheme(THEMES.DARK);
    localStorage.setItem(THEME_KEY, THEMES.DARK);
    applyTheme(THEMES.DARK);
    toast.success('Tema oscuro activado');
  }, [applyTheme]);

  const setSystemTheme = useCallback(() => {
    setTheme(THEMES.SYSTEM);
    localStorage.setItem(THEME_KEY, THEMES.SYSTEM);
    const systemTheme = getSystemTheme();
    applyTheme(systemTheme);
    toast.success('Tema del sistema activado');
  }, [applyTheme, getSystemTheme]);

  const toggleTheme = useCallback(() => {
    if (theme === THEMES.SYSTEM) {
      const currentEffective = effectiveTheme;
      if (currentEffective === THEMES.DARK) {
        setLightTheme();
      } else {
        setDarkTheme();
      }
    } else if (theme === THEMES.LIGHT) {
      setDarkTheme();
    } else {
      setLightTheme();
    }
  }, [theme, effectiveTheme, setLightTheme, setDarkTheme]);

  const cycleTheme = useCallback(() => {
    if (theme === THEMES.LIGHT) {
      setDarkTheme();
    } else if (theme === THEMES.DARK) {
      setSystemTheme();
    } else {
      setLightTheme();
    }
  }, [theme, setLightTheme, setDarkTheme, setSystemTheme]);

  const isLightTheme = useCallback(() => {
    return effectiveTheme === THEMES.LIGHT;
  }, [effectiveTheme]);

  const isDarkTheme = useCallback(() => {
    return effectiveTheme === THEMES.DARK;
  }, [effectiveTheme]);

  const isSystemTheme = useCallback(() => {
    return theme === THEMES.SYSTEM;
  }, [theme]);

  const getThemeIcon = useCallback(() => {
    if (theme === THEMES.SYSTEM) {
      return 'Monitor';
    }
    return effectiveTheme === THEMES.DARK ? 'Moon' : 'Sun';
  }, [theme, effectiveTheme]);

  const getThemeLabel = useCallback(() => {
    if (theme === THEMES.SYSTEM) {
      return 'Sistema';
    }
    return effectiveTheme === THEMES.DARK ? 'Oscuro' : 'Claro';
  }, [theme, effectiveTheme]);

  const getNextThemeLabel = useCallback(() => {
    if (theme === THEMES.LIGHT) {
      return 'Oscuro';
    } else if (theme === THEMES.DARK) {
      return 'Sistema';
    } else {
      return 'Claro';
    }
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) || THEMES.SYSTEM;
    
    if (savedTheme === THEMES.SYSTEM) {
      const systemTheme = getSystemTheme();
      applyTheme(systemTheme);
    } else {
      applyTheme(savedTheme);
    }
  }, [applyTheme, getSystemTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (theme === THEMES.SYSTEM) {
        const newSystemTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
        applyTheme(newSystemTheme);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme, applyTheme]);

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (metaThemeColor) {
      const color = effectiveTheme === THEMES.DARK ? '#1e293b' : '#ffffff';
      metaThemeColor.setAttribute('content', color);
    }
  }, [effectiveTheme]);

  const resetTheme = useCallback(() => {
    localStorage.removeItem(THEME_KEY);
    setSystemTheme();
    toast.success('Tema reiniciado');
  }, [setSystemTheme]);

  const exportThemePreference = useCallback(() => {
    return {
      theme,
      effectiveTheme,
      timestamp: new Date().toISOString(),
    };
  }, [theme, effectiveTheme]);

  const importThemePreference = useCallback((preference) => {
    try {
      if (!preference || !preference.theme) {
        throw new Error('Preferencia invalida');
      }

      const { theme: importedTheme } = preference;

      if (importedTheme === THEMES.LIGHT) {
        setLightTheme();
      } else if (importedTheme === THEMES.DARK) {
        setDarkTheme();
      } else if (importedTheme === THEMES.SYSTEM) {
        setSystemTheme();
      } else {
        throw new Error('Tema desconocido');
      }

      toast.success('Tema importado correctamente');
      return { success: true };
    } catch (err) {
      console.error('Error importing theme:', err);
      toast.error('Error al importar tema');
      return { success: false, error: err.message };
    }
  }, [setLightTheme, setDarkTheme, setSystemTheme]);

  return {
    theme,
    effectiveTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    toggleTheme,
    cycleTheme,
    isLightTheme,
    isDarkTheme,
    isSystemTheme,
    getThemeIcon,
    getThemeLabel,
    getNextThemeLabel,
    resetTheme,
    exportThemePreference,
    importThemePreference,
    THEMES,
  };
};

export default useTheme;