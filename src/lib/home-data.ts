import { fetchMembers, type ClubMember } from '@/lib/club-ui';
import { fetchActiveLinks, fetchEventSeatCounts, fetchPublishedEvents, fetchSiteContent } from '@/lib/publicApi';
import type { ClubEvent, ExternalLink, SiteContentEntry } from '@/types/club';

export type Loaded<T> = { data: T | null; error: boolean };

export type HomeData = {
  content: Loaded<SiteContentEntry[]>;
  links: Loaded<ExternalLink[]>;
  events: Loaded<{ events: ClubEvent[]; counts: Record<string, number> }>;
  members: Loaded<ClubMember[]>;
};

// One failing section should not blank the whole page, so each part settles on its own.
async function settle<T>(promise: Promise<T>): Promise<Loaded<T>> {
  try {
    return { data: await promise, error: false };
  } catch {
    return { data: null, error: true };
  }
}

export async function loadHomeData(): Promise<HomeData> {
  const [content, links, events, members] = await Promise.all([
    settle<SiteContentEntry[]>(fetchSiteContent()),
    settle<ExternalLink[]>(fetchActiveLinks()),
    settle<{ events: ClubEvent[]; counts: Record<string, number> }>(
      Promise.all([fetchPublishedEvents(), fetchEventSeatCounts()]).then(([list, counts]) => ({
        events: list,
        counts,
      })),
    ),
    settle<ClubMember[]>(fetchMembers()),
  ]);
  return { content, links, events, members };
}
