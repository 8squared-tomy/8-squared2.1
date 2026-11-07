export function SiteLogo({ url, className }: { url: string | null; className?: string }) {
  if (url) {
    return <img src={url} alt="" aria-hidden="true" className={`shrink-0 rounded-sm object-contain ${className ?? ''}`} />;
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
