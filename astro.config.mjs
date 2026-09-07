// @ts-check
import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Keep this list in sync with `locales` in src/i18n/types.ts.
// (Astro config is .mjs, so it cannot import the typed const.)
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
  build: { format: 'preserve' },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'sr', 'fr', 'de'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', sr: 'sr', fr: 'fr', de: 'de' },
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