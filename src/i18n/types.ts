/**
 * The dictionary contract.
 *
 * `Dict` is derived from the English dictionary, which makes en.ts the source
 * of truth: sr.ts, fr.ts and de.ts are all annotated `: Dict`, so a key that is
 * missing, misspelled or the wrong shape is a type error and fails `astro build`.
 *
 * Note that array *lengths* cannot be enforced this way — a translated locale
 * may have fewer bullets or paragraphs than English without erroring. Keys and
 * object shapes are enforced.
 */

/** Type-only reference to en.ts; emits no runtime import. */
export type Dict = typeof import('./en').default;

/**
 * The locale list, and the only place it is written down. astro.config.ts
 * imports it for both `i18n` and the sitemap, so adding a language here is the
 * whole change.
 */
export const locales = ['en', 'sr', 'fr', 'de'] as const;

export type Lang = (typeof locales)[number];

/** `satisfies` rather than an annotation, so the type stays `'en'` and not `Lang`. */
export const defaultLocale = 'en' satisfies Lang;

/** Locales that get a URL prefix — everything except the default. */
export const prefixedLocales = locales.filter(
  (locale): locale is Exclude<Lang, typeof defaultLocale> => locale !== defaultLocale,
);

export function isLang(value: string | undefined): value is Lang {
  return value !== undefined && (locales as readonly string[]).includes(value);
}

/** Open Graph wants full locale codes, unlike hreflang which takes the bare tag. */
export const ogLocales: Record<Lang, string> = {
  en: 'en_US',
  sr: 'sr_RS',
  fr: 'fr_FR',
  de: 'de_DE',
};

/**
 * The tag `Intl` is handed when a date is written out, which is not always the
 * one in the URL.
 *
 * ⚠️ `sr` on its own prints Cyrillic - "11. септембар 2026." - and this site's
 * Serbian is Latin from end to end, so the script has to be named. The other
 * three resolve to what they should unaided and are listed anyway, because a
 * `Record<Lang, …>` is what makes a fifth locale a type error here rather than
 * a date quietly formatted as English.
 *
 * Numbers do not need this and do not have it: `Intl.NumberFormat(lang)` is
 * called with the bare tag wherever a figure is printed, and grouping and the
 * decimal mark are the same in both Serbian scripts.
 */
export const dateLocales: Record<Lang, string> = {
  en: 'en',
  sr: 'sr-Latn',
  fr: 'fr',
  de: 'de',
};
