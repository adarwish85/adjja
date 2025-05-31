
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark' | 'auto';
  colorScheme: 'bjj-gold' | 'blue' | 'green' | 'purple';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setColorScheme: (scheme: 'bjj-gold' | 'blue' | 'green' | 'purple') => void;
  applyTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'auto'>('light');
  const [colorScheme, setColorSchemeState] = useState<'bjj-gold' | 'blue' | 'green' | 'purple'>('bjj-gold');

  // Load theme from settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('adjja_general_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setThemeState(settings.theme || 'light');
      setColorSchemeState(settings.colorScheme || 'bjj-gold');
    }
  }, []);

  const applyTheme = () => {
    const root = document.documentElement;
    
    // Apply dark/light theme
    if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply color scheme
    root.setAttribute('data-color-scheme', colorScheme);
    
    // Define comprehensive color scheme CSS variables
    const colorSchemes = {
      'bjj-gold': {
        '--primary': '39 100% 56%', // BJJ Gold
        '--primary-foreground': '222.2 47.4% 11.2%',
        '--accent': '39 100% 64%', // Lighter gold for accents
        '--accent-foreground': '222.2 47.4% 11.2%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--secondary': '39 30% 94%',
        '--secondary-foreground': '39 100% 20%',
        '--muted': '39 15% 96%',
        '--muted-foreground': '39 20% 45%',
        '--bjj-gold': '#f6ad24',
        '--bjj-gold-dark': '#d69e2e',
        '--bjj-gold-light': '#fed7aa',
      },
      'blue': {
        '--primary': '221.2 83.2% 53.3%', // Blue
        '--primary-foreground': '210 40% 98%',
        '--accent': '221.2 83.2% 63.3%', // Lighter blue for accents
        '--accent-foreground': '210 40% 98%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--secondary': '221.2 30% 94%',
        '--secondary-foreground': '221.2 83.2% 20%',
        '--muted': '221.2 15% 96%',
        '--muted-foreground': '221.2 20% 45%',
        '--bjj-gold': '#3b82f6',
        '--bjj-gold-dark': '#1d4ed8',
        '--bjj-gold-light': '#93c5fd',
      },
      'green': {
        '--primary': '142.1 76.2% 36.3%', // Green
        '--primary-foreground': '210 40% 98%',
        '--accent': '142.1 76.2% 46.3%', // Lighter green for accents
        '--accent-foreground': '210 40% 98%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--secondary': '142.1 30% 94%',
        '--secondary-foreground': '142.1 76.2% 20%',
        '--muted': '142.1 15% 96%',
        '--muted-foreground': '142.1 20% 45%',
        '--bjj-gold': '#22c55e',
        '--bjj-gold-dark': '#15803d',
        '--bjj-gold-light': '#86efac',
      },
      'purple': {
        '--primary': '262.1 83.3% 57.8%', // Purple
        '--primary-foreground': '210 40% 98%',
        '--accent': '262.1 83.3% 67.8%', // Lighter purple for accents
        '--accent-foreground': '210 40% 98%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--secondary': '262.1 30% 94%',
        '--secondary-foreground': '262.1 83.3% 20%',
        '--muted': '262.1 15% 96%',
        '--muted-foreground': '262.1 20% 45%',
        '--bjj-gold': '#a855f7',
        '--bjj-gold-dark': '#7c3aed',
        '--bjj-gold-light': '#c4b5fd',
      }
    };

    const colors = colorSchemes[colorScheme];
    Object.entries(colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Force a re-render by triggering a small DOM change
    root.style.setProperty('--theme-updated', Date.now().toString());
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    setThemeState(newTheme);
    // Update localStorage
    const savedSettings = localStorage.getItem('adjja_general_settings');
    const settings = savedSettings ? JSON.parse(savedSettings) : {};
    settings.theme = newTheme;
    localStorage.setItem('adjja_general_settings', JSON.stringify(settings));
  };

  const setColorScheme = (newScheme: 'bjj-gold' | 'blue' | 'green' | 'purple') => {
    setColorSchemeState(newScheme);
    // Update localStorage
    const savedSettings = localStorage.getItem('adjja_general_settings');
    const settings = savedSettings ? JSON.parse(savedSettings) : {};
    settings.colorScheme = newScheme;
    localStorage.setItem('adjja_general_settings', JSON.stringify(settings));
  };

  // Apply theme whenever theme or colorScheme changes
  useEffect(() => {
    applyTheme();
  }, [theme, colorScheme]);

  // Listen for system theme changes when auto is selected
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorScheme,
        setTheme,
        setColorScheme,
        applyTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
