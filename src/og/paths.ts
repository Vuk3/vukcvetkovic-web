/**
 * Where each page's share card lives, and which page has one.
 *
 * The one place both sides of the share cards agree on a URL: the layout
 * (Base.astro) writes it into a page's `og:image`, and the build step that
 * draws the cards (integration.ts) writes the file there. Pure string work,
 * because Base.astro runs where the page is prerendered and a file system is
 * not promised.
 *
 * `/og/<lang>/<section>.png` for the two indexes and
 * `/og/<lang>/<section>/<slug>.png` for a project or a game. The locale is
 * always in the path, English too, so the files are four sets side by side
 * rather than one set with three more inside it.
 */
import { defaultLocale, type Lang } from '../i18n/types';
import { localizePath } from '../i18n/utils';

export type OgSection = 'games' | 'projects';

export function ogImagePath(lang: Lang, section: OgSection, slug?: string): string {
  return `/og/${lang}/${section}${slug ? `/${slug}` : ''}.png`;
}

/**
 * The card a page shares, from its own path in any locale, or `undefined`
 * where the site's own card (`site.ogImage`, the portrait) stands: the
 * homepage, the 404s and anything else that is not a project, a game or one
 * of their indexes.
 *
 * ⚠️ It answers from the shape of the path alone, so it can name a card that
 * was never drawn. The build step checks every `og:image` in the output
 * against the files it wrote and fails the build on the first one missing.
 */
export function ogImageFor(lang: Lang, pathname: string): string | undefined {
  const match = localizePath(pathname, defaultLocale).match(/^\/(games|projects)\/(?:([^/.]+)\/)?$/);
  if (!match) return undefined;
  return ogImagePath(lang, match[1] as OgSection, match[2]);
}
