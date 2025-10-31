import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Inicializar tema
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remover ambas clases primero
    root.classList.remove('light', 'dark');
    
    // Agregar la clase del tema actual
    if (theme === 'dark') {
      root.classList.add('dark');
    }
    
    // Guardar en localStorage
    localStorage.setItem('theme', theme);
    
    console.log('✅ Theme applied:', theme);
    console.log('📋 HTML classList:', root.classList.toString());
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('🔄 Toggling theme from', prevTheme, 'to', newTheme);
      return newTheme;
    });
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}