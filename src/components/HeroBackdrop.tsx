/**
 * Hero backdrop: the club's ready-made photographic artwork (chess pieces in
 * dramatic light) served responsively at native resolution — every size is a
 * downscale of the 4096px original, never an upscale. A gradient scrim keeps
 * the hero copy legible without hiding the art.
 */
export function HeroBackdrop() {
  return (
    <div className="hero-backdrop absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
      <picture>
        <source media="(max-width: 767px)" srcSet="/hero-chess-portrait.webp" type="image/webp" />
        <source media="(max-width: 767px)" srcSet="/hero-chess-portrait.jpg" />
        <source media="(max-width: 1279px)" srcSet="/hero-chess-1600.webp" type="image/webp" />
        <source media="(max-width: 1279px)" srcSet="/hero-chess-1600.jpg" />
        <source srcSet="/hero-chess-2560.webp" type="image/webp" />
        <img
          src="/hero-chess.jpg"
          alt=""
          aria-hidden="true"
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-cover object-center"
        />
      </picture>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(9,9,9,0.93) 0%, rgba(11,11,11,0.78) 36%, rgba(12,12,12,0.22) 66%, rgba(10,10,10,0.45) 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background: 'linear-gradient(180deg, rgba(8,8,8,0) 0%, rgba(8,8,8,0.88) 100%)',
        }}
      />
    </div>
  );
}
