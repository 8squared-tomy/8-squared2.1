import { useState } from 'react';

/** Club crest shipped with the site; used until an admin sets a custom logo. */
export const DEFAULT_LOGO_SRC = '/club-logo.jpg';

/**
 * Renders the club logo. A configured logo (https URL or uploaded data URL)
 * wins; otherwise the club crest image is used. If the image cannot load we
 * fall back to the inline crown mark so the header never shows a broken image.
 */
export function SiteLogo({ url, className }: { url: string | null; className?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = url ?? DEFAULT_LOGO_SRC;

  if (failedSrc !== src) {
    return (
      <img
        src={src}
        alt=""
        aria-hidden="true"
        decoding="async"
        onError={() => setFailedSrc(src)}
        className={`shrink-0 rounded-sm object-contain ${className ?? ''}`}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 text-gold ${className ?? ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 4h5l-1 4 4 5v5H6v-5l4-5-1-4Z" />
      <path d="M6 18h12" />
      <path d="M10 11h4" />
    </svg>
  );
}
