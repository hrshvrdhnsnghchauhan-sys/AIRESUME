import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ColorTheme = 'blue' | 'purple' | 'emerald' | 'sunset';

type ThemeProviderProps = {
  children: ReactNode;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;
};

const ThemeContext = createContext<ThemeProviderState>({
  theme: 'blue',
  setTheme: () => null,
});

// Each theme defines the CSS variables injected at :root level
const themeVars: Record<ColorTheme, Record<string, string>> = {
  blue: {
    '--theme-50':  '#eff6ff',
    '--theme-100': '#dbeafe',
    '--theme-200': '#bfdbfe',
    '--theme-300': '#93c5fd',
    '--theme-400': '#60a5fa',
    '--theme-500': '#3b82f6',
    '--theme-600': '#2563eb',
    '--theme-700': '#1d4ed8',
    '--theme-800': '#1e40af',
    '--theme-900': '#1e3a8a',
    '--theme-accent': '#6366f1',
    '--theme-gradient-from': '#3b82f6',
    '--theme-gradient-to': '#6366f1',
    '--theme-hero-bg': 'linear-gradient(135deg, #eff6ff 0%, #f1f5f9 60%, #ffffff 100%)',
    '--theme-hero-orb1': 'rgba(59,130,246,0.25)',
    '--theme-hero-orb2': 'rgba(99,102,241,0.15)',
  },
  purple: {
    '--theme-50':  '#faf5ff',
    '--theme-100': '#f3e8ff',
    '--theme-200': '#e9d5ff',
    '--theme-300': '#d8b4fe',
    '--theme-400': '#c084fc',
    '--theme-500': '#a855f7',
    '--theme-600': '#9333ea',
    '--theme-700': '#7e22ce',
    '--theme-800': '#6b21a8',
    '--theme-900': '#581c87',
    '--theme-accent': '#ec4899',
    '--theme-gradient-from': '#a855f7',
    '--theme-gradient-to': '#ec4899',
    '--theme-hero-bg': 'linear-gradient(135deg, #faf5ff 0%, #fdf4ff 60%, #ffffff 100%)',
    '--theme-hero-orb1': 'rgba(168,85,247,0.22)',
    '--theme-hero-orb2': 'rgba(236,72,153,0.15)',
  },
  emerald: {
    '--theme-50':  '#ecfdf5',
    '--theme-100': '#d1fae5',
    '--theme-200': '#a7f3d0',
    '--theme-300': '#6ee7b7',
    '--theme-400': '#34d399',
    '--theme-500': '#10b981',
    '--theme-600': '#059669',
    '--theme-700': '#047857',
    '--theme-800': '#065f46',
    '--theme-900': '#064e3b',
    '--theme-accent': '#0891b2',
    '--theme-gradient-from': '#10b981',
    '--theme-gradient-to': '#0891b2',
    '--theme-hero-bg': 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf9 60%, #ffffff 100%)',
    '--theme-hero-orb1': 'rgba(16,185,129,0.22)',
    '--theme-hero-orb2': 'rgba(8,145,178,0.15)',
  },
  sunset: {
    '--theme-50':  '#fff7ed',
    '--theme-100': '#ffedd5',
    '--theme-200': '#fed7aa',
    '--theme-300': '#fdba74',
    '--theme-400': '#fb923c',
    '--theme-500': '#f97316',
    '--theme-600': '#ea580c',
    '--theme-700': '#c2410c',
    '--theme-800': '#9a3412',
    '--theme-900': '#7c2d12',
    '--theme-accent': '#e11d48',
    '--theme-gradient-from': '#f97316',
    '--theme-gradient-to': '#e11d48',
    '--theme-hero-bg': 'linear-gradient(135deg, #fff7ed 0%, #fef3f0 60%, #ffffff 100%)',
    '--theme-hero-orb1': 'rgba(249,115,22,0.22)',
    '--theme-hero-orb2': 'rgba(225,29,72,0.15)',
  },
};

function applyTheme(theme: ColorTheme) {
  const root = document.documentElement;
  const vars = themeVars[theme];
  Object.entries(vars).forEach(([key, val]) => root.style.setProperty(key, val));

  // Also update the brand color tokens used throughout
  root.style.setProperty('--color-brand-50',  vars['--theme-50']);
  root.style.setProperty('--color-brand-100', vars['--theme-100']);
  root.style.setProperty('--color-brand-200', vars['--theme-200']);
  root.style.setProperty('--color-brand-300', vars['--theme-300']);
  root.style.setProperty('--color-brand-400', vars['--theme-400']);
  root.style.setProperty('--color-brand-500', vars['--theme-500']);
  root.style.setProperty('--color-brand-600', vars['--theme-600']);
  root.style.setProperty('--color-brand-700', vars['--theme-700']);
  root.style.setProperty('--color-brand-800', vars['--theme-800']);
  root.style.setProperty('--color-brand-900', vars['--theme-900']);
}

export function ThemeProvider({ children, storageKey = 'vanitra-theme' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ColorTheme>(
    () => (localStorage.getItem(storageKey) as ColorTheme) || 'blue'
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (newTheme: ColorTheme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
