/**
 * Hero backdrop: a ready-made photographic background (deep charcoal field with
 * heavily out-of-focus chess pieces), cropped from the club's reference
 * artwork at high resolution. A gradient scrim keeps the hero copy legible
 * without hiding the art.
 */
export function HeroBackdrop() {
  return (
    <div className="hero-backdrop absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
      <img
        src="/hero-chess.jpg"
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="high"
        className="h-full w-full object-cover object-right"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(9,9,9,0.94) 0%, rgba(11,11,11,0.82) 34%, rgba(12,12,12,0.38) 62%, rgba(10,10,10,0.5) 100%)',
        }}
      />
    </div>
  );
}
