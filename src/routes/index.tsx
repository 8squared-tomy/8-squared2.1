import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/HomePage";
import { loadHomeData } from "@/lib/home-data";

// Social/preload card derived from the same 4096px hero artwork (1200x630).
const COVER_IMAGE = "/og-chess.jpg";

export const Route = createFileRoute("/")({
  // Runs on the server for the first visit, so the HTML already contains the content.
  loader: () => loadHomeData(),
  head: () => ({
    links: [
      // The hero artwork is the largest above-the-fold paint; preloading the exact
      // file each breakpoint uses lets it start downloading with the document.
      {
        rel: "preload",
        as: "image",
        href: "/hero-chess-portrait.webp",
        type: "image/webp",
        media: "(max-width: 767px)",
        fetchPriority: "high",
      },
      {
        rel: "preload",
        as: "image",
        href: "/hero-chess-1600.webp",
        type: "image/webp",
        media: "(min-width: 768px) and (max-width: 1279px)",
        fetchPriority: "high",
      },
      {
        rel: "preload",
        as: "image",
        href: "/hero-chess-2560.webp",
        type: "image/webp",
        media: "(min-width: 1280px)",
        fetchPriority: "high",
      },
    ],
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: COVER_IMAGE },
      { name: "twitter:image", content: COVER_IMAGE },
      { title: "8squared Chess Club — Learn, train, compete" },
      { name: "description", content: "A home for chess players at every level. Join the 8squared chess club, attend events and grow with us." },
      { property: "og:title", content: "8squared Chess Club — Learn, train, compete" },
      { property: "og:description", content: "A home for chess players at every level. Join the 8squared chess club, attend events and grow with us." },
    ],
  }),
  component: HomeRoute,
});

function HomeRoute() {
  const loaded = Route.useLoaderData();
  return <HomePage loaded={loaded} />;
}
