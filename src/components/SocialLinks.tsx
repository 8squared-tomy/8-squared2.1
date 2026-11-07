import { Instagram, Linkedin, Send } from 'lucide-react';
import { fetchSocialLinks } from '@/lib/club-ui';
import { useAsyncData } from '@/lib/useAsyncData';
import { isSafeHttpsUrl } from '@/lib/validation';

const PLATFORMS = [
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { key: 'instagram', label: 'Instagram', icon: Instagram },
  { key: 'telegram', label: 'Telegram', icon: Send },
] as const;

/**
 * Icon-only social links for the bottom of the site. Nothing is rendered for a
 * platform the club has not configured, so no placeholder links appear.
 */
export function SocialLinks() {
  const links = useAsyncData(fetchSocialLinks, []);

  const active = PLATFORMS.map((platform) => ({
    ...platform,
    url: links.data?.find((link) => link.platform === platform.key)?.url ?? '',
  })).filter((platform) => isSafeHttpsUrl(platform.url));

  if (active.length === 0) return null;

  return (
    <ul className="flex items-center gap-2" aria-label="Social media">
      {active.map(({ key, label, url, icon: Icon }) => (
        <li key={key}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-gold hover:text-gold"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
