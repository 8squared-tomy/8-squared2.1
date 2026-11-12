// Decorative hero art: the rook from the club crest assembles itself from the
// base upwards. Purely presentational, so it is hidden from assistive tech.
export function RookBuild({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`rook-build pointer-events-none select-none ${className}`}>
      <svg viewBox="0 0 120 170" className="h-full w-auto" role="presentation" focusable="false">
        <defs>
          <linearGradient id="rookGoldGradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--cover-accent, #e0b95f)" stopOpacity="0.55" />
            <stop offset="55%" stopColor="var(--cover-accent, #e0b95f)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f8e7b4" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Soft floor glow under the piece. */}
        <ellipse className="rook-glow" cx="60" cy="162" rx="46" ry="7" fill="var(--cover-accent, #e0b95f)" />

        <g
          fill="url(#rookGoldGradient)"
          stroke="rgb(0 0 0 / 0.28)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        >
          {/* 1. Base plinth */}
          <g className="rook-piece" style={{ ['--seg' as string]: 0 }}>
            <rect x="10" y="148" width="100" height="14" rx="4" />
            <rect x="18" y="138" width="84" height="11" rx="3" />
          </g>

          {/* 2. Flared body */}
          <g className="rook-piece" style={{ ['--seg' as string]: 1 }}>
            <path d="M30 138 L42 76 H78 L90 138 Z" />
          </g>

          {/* 3. Collar / neck */}
          <g className="rook-piece" style={{ ['--seg' as string]: 2 }}>
            <rect x="45" y="58" width="30" height="18" rx="3" />
          </g>

          {/* 4. Crown band */}
          <g className="rook-piece" style={{ ['--seg' as string]: 3 }}>
            <rect x="34" y="34" width="52" height="24" rx="3" />
          </g>

          {/* 5. Battlements */}
          <g className="rook-piece" style={{ ['--seg' as string]: 4 }}>
            <rect x="34" y="16" width="14" height="19" rx="2" />
            <rect x="53" y="16" width="14" height="19" rx="2" />
            <rect x="72" y="16" width="14" height="19" rx="2" />
          </g>
        </g>

        {/* Slow golden shimmer once the piece is complete. */}
        <g fill="#fff6d8">
          <circle className="rook-spark" cx="42" cy="46" r="2.2" />
          <circle className="rook-spark" cx="80" cy="96" r="1.7" />
        </g>
      </svg>
    </div>
  );
}
