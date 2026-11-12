import { ArrowRight, Shield, Trophy, Users } from 'lucide-react';
import { EventCard } from '@/components/EventCard';
import { HeroBackdrop } from '@/components/HeroBackdrop';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useRouter } from '@tanstack/react-router';
import type { HomeData } from '@/lib/home-data';
import { Notice } from '@/components/FormField';
import { MemberCarousel } from '@/components/MemberCarousel';

export function HomePage({ loaded }: { loaded: HomeData }) {
  const { t, pick } = useLanguage();
  const { content, events, links, members } = loaded;
  const router = useRouter();
  const reload = () => void router.invalidate();

  // LinkedIn / Instagram / Telegram are shown as icons in the footer only, never
  // as text cards among the club's study resources.
  const SOCIAL_PLATFORMS = ['linkedin', 'instagram', 'telegram'];
  const resourceLinks = (links.data ?? []).filter((link) => !SOCIAL_PLATFORMS.includes(link.platform ?? ''));

  const getText = (key: string): string => {
    const entry = content.data?.find((item) => item.key === key);
    return entry ? pick(entry.value_en, entry.value_ar) : '';
  };

  const headline = getText('hero_title') || `${t('brand')} ${t('brandTagline')}`;
  const subhead = getText('hero_subtitle') || t('footerTagline');

  const upcoming = (events.data?.events ?? [])
    .filter((event) => new Date(event.ends_at ?? event.starts_at).getTime() >= Date.now())
    .slice(0, 3);
  const memberCount = members.data?.length ?? 0;
  const upcomingCount = (events.data?.events ?? []).filter(
    (event) => new Date(event.ends_at ?? event.starts_at).getTime() >= Date.now(),
  ).length;

  const pillars = [
    { icon: Users, title: t('cardJoinTitle'), body: t('cardJoinBody'), href: '/membership' },
    { icon: Trophy, title: t('cardEventsTitle'), body: t('cardEventsBody'), href: '/events' },
    { icon: Shield, title: t('cardSponsorsTitle'), body: t('cardSponsorsBody'), href: '/sponsors' },
  ];

  return (
    <>
      {/* Hero: charcoal field with blurred chess silhouettes, the club promise
          set left in heavy sans, and the two reference calls to action. */}
      <section className="relative isolate overflow-hidden bg-[#101010] text-on-cover">
        <HeroBackdrop />

        <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-4 pb-24 pt-40 sm:px-6 sm:pt-44">
          <div className="max-w-2xl">
            <p className="hero-eyebrow">{t('heroEyebrow')}</p>

            <h1 className="hero-title mt-6">{headline}</h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-on-cover/70">{subhead}</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="/membership" className="hero-btn hero-btn-gold">
                {t('heroCtaJoin')}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </a>
              <a href="/events" className="hero-btn hero-btn-outline">
                {t('heroCtaEvents')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About: quiet two-column editorial block with the club numbers. */}
      <section className="shell py-20 sm:py-24">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start md:gap-16">
          <div className="space-y-4">
            <p className="eyebrow">{t('brand')}</p>
            <h2 className="text-3xl sm:text-4xl">{t('aboutTitle')}</h2>
            <div className="section-rule" aria-hidden="true" />
          </div>

          <div className="space-y-9">
            <p className="text-lg leading-relaxed text-muted md:pt-1">{getText('about_body')}</p>

            <dl className="flex flex-wrap gap-x-14 gap-y-6">
              <div>
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  {t('statMembers')}
                </dt>
                <dd className="mt-1 text-3xl font-bold text-gold">{memberCount}</dd>
              </div>
              <div>
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  {t('statUpcoming')}
                </dt>
                <dd className="mt-1 text-3xl font-bold text-gold">{upcomingCount}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, body, href }) => (
            <a key={href} href={href} className="card card-accent card-hover group flex flex-col gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
              </span>
              <h3 className="text-xl">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{body}</p>
              <ArrowRight
                className="mt-auto h-4 w-4 text-gold transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      </section>

      <MemberCarousel members={members.data} />

      {/* Events preview on a raised surface, with the gold section heading. */}
      <section className="border-y border-border bg-surface">
        <div className="shell py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
            <div className="space-y-3">
              <p className="eyebrow">{t('navEvents')}</p>
              <h2 className="text-3xl">{t('eventsPreviewTitle')}</h2>
            </div>
            <a href="/events" className="btn-ghost btn-gold-link">
              {t('eventsViewAll')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </a>
          </div>

          {events.error && (
            <Notice tone="error">
              <p>{t('loadError')}</p>
              <button type="button" onClick={reload} className="btn-ghost mt-2 px-0 text-danger">
                {t('retry')}
              </button>
            </Notice>
          )}
          {events.data && upcoming.length === 0 && <p className="text-muted">{t('emptyEvents')}</p>}
          {events.data && upcoming.length > 0 && (
            <div className="grid gap-5 md:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} confirmedCount={events.data?.counts[event.id] ?? 0} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Study resources. */}
      <section className="shell py-20">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl">{t('linksTitle')}</h2>
          <p className="text-muted">{t('linksIntro')}</p>
        </div>
        {resourceLinks.length === 0 && <p className="mt-6 text-muted">{t('emptyLinks')}</p>}
        {resourceLinks.length > 0 && (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resourceLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card group flex min-h-14 items-center justify-between gap-3 py-4 transition-colors hover:border-gold"
                >
                  <span className="font-medium">{pick(link.label_en, link.label_ar)}</span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                  <span className="sr-only">({t('sponsorVisit')})</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
