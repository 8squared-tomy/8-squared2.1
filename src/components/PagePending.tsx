// Shown in the <main> area while a route's loader is still fetching, so the
// header/footer never sit around an empty page during client-side navigation.
export function PagePending() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-6xl animate-pulse px-4 py-16 sm:px-6"
    >
      <span className="sr-only">Loading…</span>
      <div className="h-9 w-2/3 rounded-md bg-surface-2" />
      <div className="mt-4 h-4 w-1/2 rounded bg-surface-2" />
      <div className="mt-6 h-4 w-1/3 rounded bg-surface-2" />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="h-40 rounded-lg bg-surface-2" />
        <div className="h-40 rounded-lg bg-surface-2" />
        <div className="h-40 rounded-lg bg-surface-2" />
      </div>
    </div>
  );
}
