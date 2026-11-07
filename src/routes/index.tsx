import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/HomePage";
import { loadHomeData } from "@/lib/home-data";

// Hero image lives in public/chess-cover.jpg.
const COVER_IMAGE = "/chess-cover.jpg";

export const Route = createFileRoute("/")({
  // Runs on the server for the first visit, so the HTML already contains the content.
  loader: () => loadHomeData(),
  head: () => ({
    links: [{ rel: "preload", as: "image", href: COVER_IMAGE, fetchPriority: "high" }],
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
