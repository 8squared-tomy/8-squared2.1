import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Theme = 'system' | 'light' | 'dark';
export type FontSize = 'normal' | 'large' | 'xlarge';

type Preferences = { theme: Theme; font: FontSize; contrast: boolean };

type PreferencesContextValue = Preferences & {
  setTheme: (theme: Theme) => void;
  setFont: (font: FontSize) => void;
  toggleContrast: () => void;
};

const STORAGE_KEY = '8squared:preferences';
const DEFAULTS: Preferences = { theme: 'system', font: 'normal', contrast: false };

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function readStored(): Preferences {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    return {
      theme: parsed.theme === 'light' || parsed.theme === 'dark' ? parsed.theme : 'system',
      font: parsed.font === 'large' || parsed.font === 'xlarge' ? parsed.font : 'normal',
      contrast: parsed.contrast === true,
    };
  } catch {
    return DEFAULTS;
  }
}

function applyPreferences({ theme, font, contrast }: Preferences) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  const dark = theme === 'dark' || (theme === 'system' && prefersDark);
  root.classList.toggle('dark', dark);
  root.classList.toggle('contrast', contrast);
  root.dataset['font'] = font;
  root.style.colorScheme = dark ? 'dark' : 'light';
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(readStored);

  useEffect(() => {
    applyPreferences(preferences);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Storage can be unavailable (private mode); preferences still apply for this session.
    }
  }, [preferences]);

  useEffect(() => {
    if (preferences.theme !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyPreferences(preferences);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [preferences]);

  const setTheme = useCallback((theme: Theme) => setPreferences((current) => ({ ...current, theme })), []);
  const setFont = useCallback((font: FontSize) => setPreferences((current) => ({ ...current, font })), []);
  const toggleContrast = useCallback(
    () => setPreferences((current) => ({ ...current, contrast: !current.contrast })),
    [],
  );

  const value = useMemo<PreferencesContextValue>(
    () => ({ ...preferences, setTheme, setFont, toggleContrast }),
    [preferences, setTheme, setFont, toggleContrast],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used inside <PreferencesProvider>');
  return context;
}
