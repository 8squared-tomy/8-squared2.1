export type Language = 'en' | 'ar';

export const LANGUAGE_COOKIE = '8squared-language';

export function parseLanguage(value: string | null | undefined): Language {
  return value === 'ar' ? 'ar' : 'en';
}

export function readLanguageCookie(cookieHeader: string): Language {
  const entry = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LANGUAGE_COOKIE}=`));
  return parseLanguage(entry?.slice(LANGUAGE_COOKIE.length + 1));
}

export function writeLanguageCookie(language: Language): void {
  // One year, site-wide. Lax keeps it on normal navigation without sending it cross-site.
  document.cookie = `${LANGUAGE_COOKIE}=${language}; path=/; max-age=31536000; SameSite=Lax`;
}
