
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useAuth } from '@/hooks/useAuth';

interface ThemeContextType {
  theme: 'light' | 'dark' | 'auto';
  colorScheme: 'bjj-gold' | 'blue' | 'green' | 'purple' | 'black';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setColorScheme: (scheme: 'bjj-gold' | 'blue' | 'green' | 'purple' | 'black') => void;
  applyTheme: () => void;
  isLoading: boolean;
  canModifyTheme: boolean;
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
  const [colorScheme, setColorSchemeState] = useState<'bjj-gold' | 'blue' | 'green' | 'purple' | 'black'>('bjj-gold');
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { settingsByCategory, isLoading, updateSetting } = useSystemSettings('appearance');
  const { userProfile, isAdmin } = useAuth();

  // Only Super Admins can modify the system theme
  const canModifyTheme = isAdmin();

  // Load theme from database settings
  useEffect(() => {
    if (!isLoading && settingsByCategory.appearance && !isInitialized) {
      const dbTheme = settingsByCategory.appearance.theme_mode || 'light';
      const dbColorScheme = settingsByCategory.appearance.color_scheme || 'bjj-gold';
      
      console.log('Loading theme from database:', { dbTheme, dbColorScheme });
      
      setThemeState(dbTheme);
      setColorSchemeState(dbColorScheme);
      setIsInitialized(true);
    }
  }, [isLoading, settingsByCategory, isInitialized]);

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
        '--primary': '39 100% 56%',
        '--primary-foreground': '222.2 47.4% 11.2%',
        '--accent': '39 100% 64%',
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
        '--primary': '221.2 83.2% 53.3%',
        '--primary-foreground': '210 40% 98%',
        '--accent': '221.2 83.2% 63.3%',
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
        '--primary': '142.1 76.2% 36.3%',
        '--primary-foreground': '210 40% 98%',
        '--accent': '142.1 76.2% 46.3%',
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
        '--primary': '262.1 83.3% 57.8%',
        '--primary-foreground': '210 40% 98%',
        '--accent': '262.1 83.3% 67.8%',
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
      },
      'black': {
        '--primary': '0 0% 9%',
        '--primary-foreground': '210 40% 98%',
        '--accent': '0 0% 15%',
        '--accent-foreground': '210 40% 98%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--secondary': '0 0% 94%',
        '--secondary-foreground': '0 0% 20%',
        '--muted': '0 0% 96%',
        '--muted-foreground': '0 0% 45%',
        '--bjj-gold': '#1a1a1a',
        '--bjj-gold-dark': '#000000',
        '--bjj-gold-light': '#404040',
      }
    };

    const colors = colorSchemes[colorScheme];
    Object.entries(colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Force a re-render by triggering a small DOM change
    root.style.setProperty('--theme-updated', Date.now().toString());
  };

  const setTheme = async (newTheme: 'light' | 'dark' | 'auto') => {
    if (!canModifyTheme) {
      console.warn('Only Super Admins can modify the system theme');
      return;
    }

    console.log('Updating system theme to:', newTheme);
    setThemeState(newTheme);
    
    try {
      await updateSetting('appearance', 'theme_mode', newTheme);
      console.log('Theme saved to database');
    } catch (error) {
      console.error('Failed to save theme to database:', error);
    }
  };

  const setColorScheme = async (newScheme: 'bjj-gold' | 'blue' | 'green' | 'purple' | 'black') => {
    if (!canModifyTheme) {
      console.warn('Only Super Admins can modify the system color scheme');
      return;
    }

    console.log('Updating system color scheme to:', newScheme);
    setColorSchemeState(newScheme);
    
    try {
      await updateSetting('appearance', 'color_scheme', newScheme);
      console.log('Color scheme saved to database');
    } catch (error) {
      console.error('Failed to save color scheme to database:', error);
    }
  };

  // Apply theme whenever theme or colorScheme changes
  useEffect(() => {
    if (isInitialized) {
      applyTheme();
    }
  }, [theme, colorScheme, isInitialized]);

  // Listen for system theme changes when auto is selected
  useEffect(() => {
    if (theme === 'auto' && isInitialized) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, isInitialized]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorScheme,
        setTheme,
        setColorScheme,
        applyTheme,
        isLoading: isLoading || !isInitialized,
        canModifyTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
