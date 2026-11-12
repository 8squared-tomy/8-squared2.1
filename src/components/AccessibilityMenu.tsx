import { useState } from 'react';
import { ChevronDown, Contrast, Type } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { TranslationKey } from '@/i18n/translations';
import { usePreferences, type FontSize, type Theme } from '@/preferences/PreferencesProvider';

const THEMES: { value: Theme; labelKey: TranslationKey }[] = [
  { value: 'system', labelKey: 'themeSystem' },
  { value: 'light', labelKey: 'themeLight' },
  { value: 'dark', labelKey: 'themeDark' },
];

const FONTS: { value: FontSize; labelKey: TranslationKey }[] = [
  { value: 'normal', labelKey: 'fontNormal' },
  { value: 'large', labelKey: 'fontLarge' },
  { value: 'xlarge', labelKey: 'fontXlarge' },
];

export function AccessibilityMenu() {
  const { t } = useLanguage();
  const { theme, font, contrast, setTheme, setFont, toggleContrast } = usePreferences();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="btn-ghost min-h-11 w-full justify-between px-0"
      >
        <span className="flex items-center gap-2">
          <Type className="h-4 w-4" aria-hidden="true" />
          {t('accessibility')}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="space-y-5">
          <fieldset className="space-y-2">
            <legend className="field-label">{t('themeLabel')}</legend>
            <div className="flex gap-2">
              {THEMES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={theme === option.value}
                  onClick={() => setTheme(option.value)}
                  className="chip flex-1"
                >
                  {t(option.labelKey)}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="field-label">{t('fontLabel')}</legend>
            <div className="flex gap-2">
              {FONTS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={font === option.value}
                  onClick={() => setFont(option.value)}
                  className="chip flex-1"
                >
                  {t(option.labelKey)}
                </button>
              ))}
            </div>
          </fieldset>

          <button type="button" aria-pressed={contrast} onClick={toggleContrast} className="chip w-full">
            <Contrast className="h-4 w-4" aria-hidden="true" />
            {t('contrastLabel')}
          </button>
        </div>
      )}
    </div>
  );
}
