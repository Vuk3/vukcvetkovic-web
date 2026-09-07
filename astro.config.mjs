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