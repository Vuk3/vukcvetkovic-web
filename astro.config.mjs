// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Keep this list in sync with `locales` in src/i18n/types.ts.
// (Astro config is .mjs, so it cannot import the typed const.)
export default defineConfig({
  site: 'https://vukcvetkovic.com',

  // Static output for Cloudflare Pages — no adapter.
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

  vite: {
    plugins: [tailwindcss()],
  },
});
