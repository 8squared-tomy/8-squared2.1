import { useEffect, useState } from 'react';
import { Globe, Menu, Home, Users, Trophy, Shield, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { AccessibilityMenu } from '@/components/AccessibilityMenu';
import { SiteLogo, CrownMark } from '@/components/SiteLogo';
import { useLanguage } from '@/i18n/LanguageProvider';
import { usePreferences } from '@/preferences/PreferencesProvider';

export function SiteHeader({ path, logoUrl }: { path: string; logoUrl: string | null }) {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = usePreferences();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const side = language === 'ar' ? 'right' : 'left';
  const dark = theme === 'dark';
  const isHome = path === '/';

  // On the home page the bar floats transparently over the hero art and only
  // turns solid once the reader leaves the top of the page.
  const overlay = isHome && !scrolled;

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const items = [
    { href: '/', label: t('navHome'), icon: Home },
    { href: '/membership', label: t('navMembership'), icon: Users },
    { href: '/events', label: t('navEvents'), icon: Trophy },
    { href: '/sponsors', label: t('navSponsors'), icon: Shield },
  ];

  return (
    // Solid background once scrolled (no backdrop-filter): a blurred header
    // both let the page show through and trapped the fixed menu overlay inside
    // its own box.
    <header
      className={`${isHome ? 'fixed' : 'sticky'} inset-x-0 top-0 z-50 transition-colors duration-300 ${
        overlay
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-border bg-surface shadow-sm'
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-start justify-between gap-3 px-4 sm:px-6 ${
          overlay ? 'py-4 sm:py-5' : 'py-2'
        }`}
      >
        {/* Stacked gold lockup: crown mark, club name, then the tagline. */}
        <a
          href="/"
          className="flex flex-col items-start gap-1"
          aria-label={t('brand')}
        >
          {logoUrl ? (
            <SiteLogo url={logoUrl} className="h-9 w-9" />
          ) : (
            <CrownMark className={`h-8 w-10 ${overlay ? 'text-cover-accent' : 'text-gold'}`} />
          )}
          <span
            className={`text-lg font-bold leading-none tracking-tight ${
              overlay ? 'text-cover-accent' : 'text-gold'
            }`}
          >
            {t('brand')}
          </span>
          <span
            className={`text-[0.6rem] uppercase leading-none tracking-[0.3em] ${
              overlay ? 'text-cover-accent/80' : 'text-muted'
            }`}
          >
            {t('brandTagline')}
          </span>
        </a>

        <div className="flex items-center gap-1">
          {!overlay && (
            <Button
              variant="ghost"
              size="icon"
              className="min-h-11 min-w-11"
              onClick={() => setTheme(dark ? 'light' : 'dark')}
              aria-label={dark ? t('themeLight') : t('themeDark')}
              title={dark ? t('themeLight') : t('themeDark')}
            >
              <Sun className="hidden h-5 w-5 dark:block" aria-hidden="true" />
              <Moon className="h-5 w-5 dark:hidden" aria-hidden="true" />
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`min-h-11 min-w-11 ${overlay ? 'text-on-cover hover:bg-white/10' : ''}`}
                aria-label={t('openMenu')}
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side={side}
              className="flex flex-col gap-0 overflow-hidden border-border bg-surface p-0"
            >
              <div className="flex items-center gap-3 border-b border-border px-6 py-5">
                <SiteLogo url={logoUrl} className="h-10 w-10 shrink-0" />
                <div className="min-w-0">
                  <SheetTitle className="text-start text-base font-bold text-gold">{t('brand')}</SheetTitle>
                  <p className="text-xs text-muted">{t('brandTagline')}</p>
                  <SheetDescription className="sr-only">{t('mainMenu')}</SheetDescription>
                </div>
              </div>

              <nav aria-label={t('mainMenu')} className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1">
                  {items.map(({ href, label, icon: Icon }) => {
                    const active = path === href;
                    return (
                      <li key={href}>
                        <a
                          href={href}
                          onClick={() => setOpen(false)}
                          aria-current={active ? 'page' : undefined}
                          className={`relative flex min-h-12 items-center gap-3 rounded-md px-4 text-base transition-colors ${
                            active ? 'bg-surface-2 font-semibold text-gold' : 'text-ink hover:bg-surface-2'
                          }`}
                        >
                          {active && <span aria-hidden="true" className="absolute inset-y-2 start-0 w-1 rounded-full bg-gold" />}
                          <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                          {label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="space-y-3 border-t border-border px-6 py-5">
                <Button
                  variant="outline"
                  className="min-h-11 w-full justify-center"
                  onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                  aria-label={language === 'en' ? 'Switch language to Arabic' : 'التبديل إلى الإنجليزية'}
                >
                  <Globe className="h-4 w-4" aria-hidden="true" />
                  {t('switchLanguage')}
                </Button>
                <AccessibilityMenu />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
