/**
 * Hero backdrop: a deep charcoal field with three heavily blurred chess
 * silhouettes (king, pawn, rook) plus a fine film grain, matching the club's
 * reference artwork. Drawn as SVG so it stays weightless, sharp on any screen
 * and identical in both colour themes.
 */
export function HeroBackdrop() {
  return (
    <svg
      className="hero-backdrop absolute inset-0 -z-20 h-full w-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="hbBase" x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#1c1c1c" />
          <stop offset="45%" stopColor="#141414" />
          <stop offset="100%" stopColor="#090909" />
        </linearGradient>

        <radialGradient id="hbGlow" cx="0.62" cy="0.34" r="0.68">
          <stop offset="0%" stopColor="#4d4d4d" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="hbVignette" cx="0.5" cy="0.45" r="0.78">
          <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.72" />
        </radialGradient>

        <linearGradient id="hbFill" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#333333" />
          <stop offset="55%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>

        <linearGradient id="hbRim" x1="0" y1="0" x2="1" y2="0.7">
          <stop offset="0%" stopColor="#e6c168" stopOpacity="0.24" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <filter id="hbSoft" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="13" />
        </filter>

        <filter id="hbHaze" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="40" />
        </filter>

        <filter id="hbGrain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
        </filter>

        <g id="hbKing">
          <path d="M45 2h10v9h9v10h-9v9H45v-9H36V11h9z" />
          <path d="M30 32h40l-4 10H34z" />
          <path d="M34 44h32v8H34z" />
          <path d="M34 54c-6 14-10 22-16 28h64c-6-6-10-14-16-28z" />
          <path d="M16 84h68v9H16z" />
          <path d="M11 93h78v7H11z" />
        </g>

        <g id="hbPawn">
          <circle cx="50" cy="20" r="12" />
          <path d="M38 34h24l-4 8H42z" />
          <path d="M42 44c-6 14-10 24-16 32h48c-6-8-10-18-16-32z" />
          <path d="M22 78h56v9H22z" />
          <path d="M17 87h66v7H17z" />
        </g>

        <g id="hbRook">
          <path d="M27 8h11v10h9V8h6v10h9V8h11v24H27z" />
          <path d="M32 34h36v32H32z" />
          <path d="M26 66h48v10H26z" />
          <path d="M20 76h60v9H20z" />
          <path d="M15 85h70v7H15z" />
        </g>
      </defs>

      <rect width="1600" height="900" fill="url(#hbBase)" />
      <rect width="1600" height="900" fill="url(#hbGlow)" />

      {/* Soft ground haze so the pieces sit in atmosphere, not on a flat wall. */}
      <g filter="url(#hbHaze)" fill="#000000" opacity="0.55">
        <ellipse cx="210" cy="780" rx="330" ry="120" />
        <ellipse cx="1390" cy="740" rx="300" ry="110" />
      </g>

      <g filter="url(#hbSoft)" fill="url(#hbFill)" stroke="url(#hbRim)" strokeWidth="1.4">
        <use href="#hbKing" transform="translate(-130 120) scale(5.7)" />
        <use href="#hbPawn" transform="translate(600 210) scale(4.4)" opacity="0.9" />
        <use href="#hbRook" transform="translate(1100 70) scale(6.6)" />
      </g>

      <rect width="1600" height="900" filter="url(#hbGrain)" opacity="0.32" />
      <rect width="1600" height="900" fill="url(#hbVignette)" />
    </svg>
  );
}
