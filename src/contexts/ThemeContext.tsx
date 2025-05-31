
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
    
    // Define color scheme CSS variables
    const colorSchemes = {
      'bjj-gold': {
        '--primary': '39 100% 56%', // BJJ Gold
        '--primary-foreground': '222.2 47.4% 11.2%',
        '--accent': '39 100% 56%',
        '--accent-foreground': '222.2 47.4% 11.2%',
      },
      'blue': {
        '--primary': '221.2 83.2% 53.3%', // Blue
        '--primary-foreground': '210 40% 98%',
        '--accent': '221.2 83.2% 53.3%',
        '--accent-foreground': '210 40% 98%',
      },
      'green': {
        '--primary': '142.1 76.2% 36.3%', // Green
        '--primary-foreground': '210 40% 98%',
        '--accent': '142.1 76.2% 36.3%',
        '--accent-foreground': '210 40% 98%',
      },
      'purple': {
        '--primary': '262.1 83.3% 57.8%', // Purple
        '--primary-foreground': '210 40% 98%',
        '--accent': '262.1 83.3% 57.8%',
        '--accent-foreground': '210 40% 98%',
      }
    };

    const colors = colorSchemes[colorScheme];
    Object.entries(colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    setThemeState(newTheme);
    // Update localStorage
    const savedSettings = localStorage.getItem('adjja_general_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      settings.theme = newTheme;
      localStorage.setItem('adjja_general_settings', JSON.stringify(settings));
    }
  };

  const setColorScheme = (newScheme: 'bjj-gold' | 'blue' | 'green' | 'purple') => {
    setColorSchemeState(newScheme);
    // Update localStorage
    const savedSettings = localStorage.getItem('adjja_general_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      settings.colorScheme = newScheme;
      localStorage.setItem('adjja_general_settings', JSON.stringify(settings));
    }
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
