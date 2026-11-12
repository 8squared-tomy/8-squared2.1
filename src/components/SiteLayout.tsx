import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
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

      {/* Footer: solid charcoal block, gold lockup on the left, copy on the right. */}
      <footer className="bg-[#0d0d0d] text-[#c4c4c4]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cover-accent">
                {t('brand')}
              </p>
              <div className="mt-6 h-px w-full bg-white/10" aria-hidden="true" />
              <p className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                {t('footerHeadline')}
              </p>
            </div>

            <div className="space-y-7">
              <p className="max-w-md text-base leading-relaxed">{t('footerTagline')}</p>

              <nav aria-label={t('footerNav')}>
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {footerLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="inline-flex min-h-9 items-center text-sm text-white/70 transition-colors hover:text-cover-accent"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Social platforms live here only, as icons, at the bottom of the page. */}
              <div>
                <h2 className="sr-only">{t('footerFollow')}</h2>
                <SocialLinks />
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {t('brand')}. {t('footerRights')}
            </p>
            <a href="/terms" className="transition-colors hover:text-cover-accent">
              {t('navLegal')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
