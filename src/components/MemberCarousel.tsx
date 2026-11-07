import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Pause, Play } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { ClubMember } from '@/lib/club-ui';

const AUTOPLAY_MS = 4500;

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduce;
}

export function MemberCarousel({ members }: { members: ClubMember[] | null }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const list = members ?? [];

  const [ref, api] = useEmblaCarousel({
    align: 'center',
    loop: true,
    containScroll: false,
    duration: 45,
    direction: ar ? 'rtl' : 'ltr',
  });
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<ClubMember | null>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!api) return;
    const update = () => setActive(api.selectedScrollSnap());
    update();
    api.on('select', update);
    api.on('reInit', update);
    return () => {
      api.off('select', update);
      api.off('reInit', update);
    };
  }, [api]);

  // Moves on its own; pauses on hover, focus, touch, an open dialog, or the visitor's choice.
  const playing = !userPaused && !hovering && !selected && !reduceMotion && list.length > 1;
  useEffect(() => {
    if (!api || !playing) return;
    const id = window.setInterval(() => api.scrollNext(), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [api, playing]);

  if (list.length === 0) return null;

  const current = list[active] ?? list[0];
  const pauseLabel = userPaused
    ? ar ? 'تشغيل الحركة التلقائية' : 'Play automatic scrolling'
    : ar ? 'إيقاف الحركة التلقائية' : 'Pause automatic scrolling';

  return (
    <section
      className="border-t border-border py-12"
      aria-label={ar ? 'أعضاء النادي' : 'Club members'}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHovering(false);
      }}
      onTouchStart={() => setHovering(true)}
      onTouchEnd={() => setHovering(false)}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl">{ar ? 'أعضاء النادي' : 'Our members'}</h2>
        {list.length > 1 && (
          <button
            type="button"
            onClick={() => setUserPaused((paused) => !paused)}
            aria-pressed={userPaused}
            aria-label={pauseLabel}
            title={pauseLabel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-gold hover:text-gold"
          >
            {userPaused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
          </button>
        )}
      </div>

      <div className="mx-auto mt-6 max-w-xl overflow-hidden px-4" ref={ref}>
        <div className="flex touch-pan-y items-center py-2">
          {list.map((member, index) => {
            const isActive = index === active;
            return (
              <div key={member.id} className="min-w-0 flex-[0_0_auto] px-2">
                <button
                  type="button"
                  aria-label={member.name}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => {
                    api?.scrollTo(index);
                    setSelected(member);
                  }}
                  className={`block h-14 w-14 overflow-hidden rounded-full border transition-all duration-500 ease-out sm:h-16 sm:w-16 ${
                    isActive
                      ? 'scale-110 border-gold shadow-md ring-2 ring-gold/40'
                      : 'scale-90 border-border opacity-55 hover:opacity-90'
                  }`}
                >
                  {member.photo_url ? (
                    <img src={member.photo_url} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-surface-2 text-sm font-semibold text-muted">
                      {initials(member.name)}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 min-h-12 px-4 text-center transition-opacity duration-500">
        <p className="font-medium">{current.name}</p>
        <p className="text-sm text-muted">{current.club_role}</p>
      </div>

      {list.length > 1 && (
        <div className="mt-3 flex justify-center gap-1">
          {list.map((member, index) => (
            <button
              key={member.id}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`${ar ? 'عرض العضو' : 'Show member'} ${index + 1}`}
              className="flex h-8 w-6 items-center justify-center"
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === active ? 'w-5 bg-gold' : 'w-1.5 bg-border'
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <div className="flex flex-col items-center gap-4">
            {selected.photo_url && (
              <img src={selected.photo_url} alt={selected.name} className="h-32 w-32 rounded-full object-cover" />
            )}
            <p className="text-gold">{selected.club_role}</p>
          </div>
        </Modal>
      )}
    </section>
  );
}
