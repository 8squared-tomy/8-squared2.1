import { useState } from 'react';
import { ChevronDown, Contrast, Palette, Type } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { TranslationKey } from '@/i18n/translations';
import { usePreferences, type BoardTheme, type FontSize, type Theme } from '@/preferences/PreferencesProvider';

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

/** Swatch preview: [light square, dark square, accent]. */
const BOARDS: { value: BoardTheme; labelKey: TranslationKey; swatch: [string, string, string] }[] = [
  { value: 'classic', labelKey: 'boardClassic', swatch: ['#f7f3e9', '#1a150e', '#8a6410'] },
  { value: 'walnut', labelKey: 'boardWalnut', swatch: ['#f6eee1', '#3a2716', '#8b5e26'] },
  { value: 'marble', labelKey: 'boardMarble', swatch: ['#f4f6f8', '#14181d', '#2c4a63'] },
  { value: 'midnight', labelKey: 'boardMidnight', swatch: ['#f2f4fb', '#131a2e', '#24336b'] },
  { value: 'emerald', labelKey: 'boardEmerald', swatch: ['#f1f7f2', '#0f1f16', '#14663c'] },
];

export function AccessibilityMenu() {
  const { t } = useLanguage();
  const { theme, font, contrast, board, setTheme, setFont, toggleContrast, setBoard } = usePreferences();
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
            <legend className="field-label flex items-center gap-2">
              <Palette className="h-4 w-4 text-gold" aria-hidden="true" />
              {t('boardThemeLabel')}
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {BOARDS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={board === option.value}
                  onClick={() => setBoard(option.value)}
                  className="theme-swatch"
                >
                  <span className="flex overflow-hidden rounded" aria-hidden="true">
                    <span className="h-6 w-6" style={{ backgroundColor: option.swatch[0] }} />
                    <span className="h-6 w-6" style={{ backgroundColor: option.swatch[1] }} />
                    <span className="h-6 w-6" style={{ backgroundColor: option.swatch[2] }} />
                  </span>
                  <span>{t(option.labelKey)}</span>
                </button>
              ))}
            </div>
            <p className="field-hint">{t('boardThemeHint')}</p>
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
