import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defaultLocale, locales } from './src/i18n/types';

/*
 * ⚠️ **This file is `.ts` so that it can import the locale list rather than
 * repeat it.** Astro loads `astro.config.ts` as readily as `.mjs`, and
 * tsconfig's `include` is `**\/*`, so `astro check` type-checks this file too.
 *
 * It used to be `.mjs` and wrote the four locales out twice by hand, in `i18n`
 * and again in the sitemap's map. Nothing compared them against
 * src/i18n/types.ts, so a locale added in one place and missed here failed
 * silently, and one of the ways it showed up was the new locale's 404 page
 * being indexed. Adding a locale is now a single edit in types.ts.
 */
export default defineConfig({
  site: 'https://vukcvetkovic.com',

  // Every page is prerendered. The adapter below only shapes the output for
  // Cloudflare, it does not turn any route into an on-demand one.
  output: 'static',

  /*
   * 'preserve' so the per-locale 404s land on the filenames Cloudflare looks
   * for.
   *
   * `not_found_handling: "404-page"` in wrangler.jsonc serves the nearest file
   * literally named 404.html, walking up from the requested path. The default
   * 'directory' format writes src/pages/[lang]/404.astro out as
   * /sr/404/index.html, which that walk never finds, so /sr/nonsense fell back
   * to the English page. 'preserve' writes /sr/404.html instead.
   *
   * It leaves the four real pages exactly where they were: index routes still
   * emit index.html, so the URLs stay /, /sr/, /fr/, /de/ with no extension,
   * and the canonical, hreflang and language-switcher hrefs built from
   * `Astro.url.pathname` are unchanged. Verified rather than assumed.
   */
  build: {
    format: 'preserve',

    /*
     * The stylesheet goes into the document rather than into a file of its own.
     *
     * A linked stylesheet is a render-blocking request, and on a mobile
     * connection that is a full serialized round trip before anything paints.
     * Inlining removes the request, so the first response carries everything
     * the first paint needs. Worth 321ms of FCP and 211ms of LCP on a mobile
     * Lighthouse run, and it takes `render-blocking-insight` from failing with
     * one item to passing with none.
     *
     * It also lifts the two woff2 subsets out of a three-hop chain. Linked,
     * they are discovered only once the CSS has been fetched and parsed (HTML,
     * then CSS, then woff2). With the @font-face rules in the document they are
     * known as soon as the head is parsed.
     *
     * The default 'auto' inlines only under 4KB and this bundle is 40KB raw, so
     * 'always' is what it takes. The cost is that the CSS repeats in every
     * document and is no longer cached across them, about 9KB gz a page. That
     * is the right trade for a site four page types deep where nearly every
     * visit is a single view of one of them.
     */
    inlineStylesheets: 'always',
  },

  i18n: {
    defaultLocale,
    locales: [...locales],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      /* The integration wants a map of locale to language tag, and here the two
         are the same word, so it is built from the same list rather than
         spelled out a second time. */
      i18n: {
        defaultLocale,
        locales: Object.fromEntries(locales.map((locale) => [locale, locale])),
      },

      /*
       * The sitemap emits a bare URL where the page's own canonical tag carries
       * a trailing slash, so the two disagreed on all twelve entries.
       *
       * The integration adds the slash itself in exactly one case, `build.format
       * === 'directory'`. It is 'preserve' here for the sake of the 404 pages,
       * which drops it into the branch that leaves the URL alone, and Astro's
       * own `trailingSlash` does not help: only 'never' is read, and 'always'
       * falls through the same way. So the slash has to be added here.
       *
       * `links` carries the hreflang alternates and holds the same bare strings,
       * so it needs the same treatment - otherwise every page keeps pointing its
       * alternates at the unslashed form.
       *
       * The extension test is the one `localizePath` uses, so both sides settle
       * on the same rule: a trailing slash for a directory route, nothing for
       * anything that looks like a file.
       */
      serialize(item) {
        /*
         * The root URL already ends in a slash, so the check for one is not
         * redundant - without it the home entry came out as `https://host//`.
         */
        const withSlash = (url: string) =>
          url.endsWith('/') || /\.[a-z0-9]+$/i.test(url) ? url : `${url}/`;

        item.url = withSlash(item.url);
        item.links = item.links?.map((link) => ({ ...link, url: withSlash(link.url) }));

        return item;
      },
    }),
  ],

  /*
   * `imageService: 'compile'` is the whole reason this adapter is here.
   *
   * Left to itself, Cloudflare's build resolved images through a runtime
   * /_image endpoint and then deployed static assets with nothing behind that
   * route, so every variant 404ed in production while a local build was fine.
   * 'compile' puts sharp back in the build: variants are written into /_astro
   * with content hashes, cached forever, and no image touches the runtime.
   */
  adapter: cloudflare({ imageService: 'compile' }),

  vite: {
    plugins: [tailwindcss()],
  },
});