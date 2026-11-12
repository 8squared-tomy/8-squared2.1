import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteLogo } from '@/components/SiteLogo';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useSiteLogo } from '@/lib/useSiteLogo';
import { SocialLinks } from '@/components/SocialLinks';

export function SiteLayout({ path, children }: { path: string; children: ReactNode }) {
  const { t } = useLanguage();
  const logoUrl = useSiteLogo();
  const year = new Date().getFullYear();

  const footerLinks = [
    { href: '/', label: t('navHome') },
    { href: '/membership', label: t('navMembership') },
    { href: '/events', label: t('navEvents') },
    { href: '/sponsors', label: t('navSponsors') },
    { href: '/terms', label: t('navLegal') },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-app text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[110] focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:text-on-gold"
      >
        {t('skipToContent')}
      </a>
      <SiteHeader path={path} logoUrl={logoUrl} />
      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="space-y-4">
            <a href="/" className="inline-flex items-center gap-3" aria-label={t('brand')}>
              <SiteLogo url={logoUrl} className="h-9 w-9" />
              <span className="text-lg font-bold tracking-wide text-gold">{t('brand')}</span>
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-muted">{t('footerTagline')}</p>
            <div className="section-rule" aria-hidden="true" />
          </div>

          <nav aria-label={t('footerNav')}>
            <h2 className="eyebrow mb-4">{t('footerNav')}</h2>
            <ul className="space-y-1">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-10 items-center text-sm text-muted transition-colors hover:text-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social platforms live here only, as icons, at the bottom of the page. */}
          <div>
            <h2 className="eyebrow mb-4">{t('footerFollow')}</h2>
            <SocialLinks />
          </div>
        </div>

        <div className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-5 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-start">
            <p className="text-sm text-muted">
              © {year} {t('brand')}. {t('footerRights')}
            </p>
            <a href="/terms" className="text-sm text-muted transition-colors hover:text-gold">
              {t('navLegal')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
