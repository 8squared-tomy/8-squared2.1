import { fetchSiteContent } from '@/lib/publicApi';
import { useAsyncData } from '@/lib/useAsyncData';
import { isSafeImageSource } from '@/lib/validation';

export const SITE_LOGO_KEY = 'site_logo';

/**
 * Returns the configured club logo: either an https image address or an uploaded
 * image stored as a data URL. Returns null when nothing usable is configured, and
 * the crown mark is used instead.
 */
export function useSiteLogo(): string | null {
  const content = useAsyncData(fetchSiteContent, []);
  const value = content.data?.find((item) => item.key === SITE_LOGO_KEY)?.value_en.trim() ?? '';
  return value && isSafeImageSource(value) ? value : null;
}
