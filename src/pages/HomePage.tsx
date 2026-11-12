import { ArrowRight, Shield, Trophy, Users } from 'lucide-react';
import { EventCard } from '@/components/EventCard';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useRouter } from '@tanstack/react-router';
import type { HomeData } from '@/lib/home-data';
import { Notice } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { MemberCarousel } from '@/components/MemberCarousel';

// Hero image lives in public/chess-cover.jpg. Replace the file to change the picture.
const COVER_IMAGE = '/chess-cover.jpg';

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
      {/* Hero: dark lacquer board, framed in a gold hairline, with the club promise. */}
      <section className="relative isolate overflow-hidden bg-cover text-on-cover">
        <img
          src={COVER_IMAGE}
          alt={t('heroImageAlt')}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          width={940}
          height={650}
          fetchPriority="high"
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-br from-cover/95 via-cover/85 to-cover"
          aria-hidden="true"
        />
        <div className="board-pattern absolute inset-0 -z-10 opacity-25" aria-hidden="true" />
        <div className="hero-frame absolute inset-4 -z-10 hidden rounded-2xl lg:block" aria-hidden="true" />

        <div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-center px-4 py-24 sm:px-6">
          <div className="max-w-3xl space-y-7">
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-cover-accent" aria-hidden="true" />
              <p className="eyebrow text-cover-accent">{t('heroEyebrow')}</p>
            </div>

            <h1 className="slogan-display text-4xl text-on-cover sm:text-6xl lg:text-7xl">
              {getText('hero_title') || t('brand')}
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-on-cover/85">
              {getText('hero_subtitle')}
            </p>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <a href="/membership" className="btn-primary px-6">
                {t('heroCtaJoin')}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </a>
              <Button
                asChild
                variant="outline"
                className="btn-secondary h-auto border-on-cover/35 bg-transparent px-6 text-on-cover hover:border-cover-accent hover:bg-cover-accent/10 hover:text-cover-accent"
              >
                <a href="/events">{t('heroCtaEvents')}</a>
              </Button>
            </div>
          </div>

          <dl className="mt-16 grid max-w-md grid-cols-2 overflow-hidden rounded-xl border border-on-cover/15 bg-on-cover/[0.06] backdrop-blur-sm">
            <div className="border-e border-on-cover/15 px-6 py-4">
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-on-cover/60">
                {t('statMembers')}
              </dt>
              <dd className="mt-1 text-3xl font-bold text-cover-accent">{memberCount}</dd>
            </div>
            <div className="px-6 py-4">
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-on-cover/60">
                {t('statUpcoming')}
              </dt>
              <dd className="mt-1 text-3xl font-bold text-cover-accent">{upcomingCount}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* About: quiet two-column editorial block. */}
      <section className="shell py-20 sm:py-24">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start md:gap-16">
          <div className="space-y-4">
            <p className="eyebrow">{t('brand')}</p>
            <h2 className="text-3xl sm:text-4xl">{t('aboutTitle')}</h2>
            <div className="section-rule" aria-hidden="true" />
          </div>
          <p className="text-lg leading-relaxed text-muted md:pt-1">{getText('about_body')}</p>
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
