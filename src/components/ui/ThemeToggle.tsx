
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Zap } from 'lucide-react';

type Theme = 'dark' | 'light' | 'neon';

const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Check for stored theme or use system preference
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme) {
      setCurrentTheme(storedTheme);
      applyTheme(storedTheme);
    } else {
      setCurrentTheme(systemPrefersDark ? 'dark' : 'light');
      applyTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    root.classList.remove('dark', 'light', 'neon-mode');
    
    switch (theme) {
      case 'dark':
        root.classList.add('dark');
        break;
      case 'light':
        root.classList.add('light');
        break;
      case 'neon':
        root.classList.add('neon-mode');
        break;
    }
    
    localStorage.setItem('theme', theme);
  };

  const toggleTheme = () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 
                      currentTheme === 'light' ? 'neon' : 'dark';
    
    setCurrentTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button 
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/10"
      aria-label="Toggle theme"
    >
      {currentTheme === 'dark' && (
        <Moon className="w-5 h-5 text-foreground" />
      )}
      {currentTheme === 'light' && (
        <Sun className="w-5 h-5 text-foreground" />
      )}
      {currentTheme === 'neon' && (
        <Zap className="w-5 h-5 text-neon-blue animate-pulse-glow" />
      )}
    </button>
  );
};

export default ThemeToggle;
