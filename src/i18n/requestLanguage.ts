import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { readLanguageCookie, type Language } from '@/i18n/language';

// Runs on the server only. Lets the first HTML response already be in the visitor's language.
export const getRequestLanguage = createServerFn({ method: 'GET' }).handler(async (): Promise<Language> => {
  return readLanguageCookie(getRequest().headers.get('cookie') ?? '');
});
