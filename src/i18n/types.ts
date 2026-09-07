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

/** Keep in sync with `i18n.locales` in astro.config.mjs. */
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
