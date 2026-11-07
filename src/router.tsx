import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { PagePending } from "./components/PagePending";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Load route data on hover/touch so navigation does not sit on an empty page.
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    // Never leave <main> blank: the header/footer must not render alone while
    // the next route's loader is still running.
    defaultPendingComponent: PagePending,
    defaultPendingMs: 0,
  });

  return router;
};
