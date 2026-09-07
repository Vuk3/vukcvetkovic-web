import de from './de';
import en from './en';
import fr from './fr';
import sr from './sr';
import { defaultLocale, isLang, type Dict, type Lang } from './types';

const dictionaries: Record<Lang, Dict> = { en, sr, fr, de };

/** Narrow an unknown locale (e.g. `Astro.currentLocale`) to a supported one. */
export function resolveLang(value: string | undefined): Lang {
  return isLang(value) ? value : defaultLocale;
}

/** The dictionary for a locale, falling back to English. */
export function getDict(lang: string | undefined): Dict {
  return dictionaries[resolveLang(lang)];
}

/**
 * The path part of a URL with any locale prefix removed.
 * `/sr/blog/post/` → `blog/post`, `/` → `''`
 */
function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (isLang(segments[0])) segments.shift();
  return segments.join('/');
}

/**
 * The equivalent of `pathname` in another locale, preserving the current page.
 * Used by the language switcher, which is plain links — no client-side JS.
 */
export function localizePath(pathname: string, lang: Lang): string {
  const rest = stripLocalePrefix(pathname);
  const prefix = lang === defaultLocale ? '' : `/${lang}`;
  return rest ? `${prefix}/${rest}/` : `${prefix}/`;
}
