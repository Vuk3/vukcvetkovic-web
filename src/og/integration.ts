/**
 * The build step that draws the share cards, and checks every page's
 * `og:image` points at one that exists.
 *
 * An integration on `astro:build:done` rather than an endpoint, on purpose.
 * The Cloudflare adapter prerenders pages in workerd, the Workers runtime,
 * where resvg's native renderer and the file system are not there to be had.
 * This hook runs in Node once the pages are written, draws every card from
 * the same data the pages were built from (the dictionaries, src/site.ts, the
 * games' stylesheets) and writes each one beside them. Nothing runs at request
 * time and `astro dev` never draws one: a card's address works in the build
 * and in production, and 404s on the dev server.
 *
 * ⚠️ The data comes in through the imports at the top, which is why they are
 * static: astro.config.ts is loaded through Vite, so a TypeScript module and
 * site.ts's image import resolve here, and a dynamic import from inside the
 * hook, after that loader has closed, would not.
 *
 * The check at the end reads the built pages back: every `og:image` under
 * /og/ must be a file this step wrote, or the build fails naming the page.
 * paths.ts decides both sides from the same rule, so this is the guard for
 * the day they drift - a new game with no board, a section renamed.
 */
import type { AstroIntegration } from 'astro';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { locales } from '../i18n/types';
import { allCards } from './cards';
import { loadType, png } from './render';

export function shareCards(): AstroIntegration {
  let root = '';
  let client = '';
  let origin = '';

  return {
    name: 'share-cards',
    hooks: {
      'astro:config:done': ({ config }) => {
        root = fileURLToPath(config.root);
        /* Where the pages land: the adapter's client directory, which is the
           folder Cloudflare serves as static assets. */
        client = fileURLToPath(config.build.client);
        origin = config.site ?? '';
      },

      'astro:build:done': async ({ logger }) => {
        const type = loadType(root);
        const cards = allCards(root, type, locales);

        const started = Date.now();
        let bytes = 0;
        for (const card of cards) {
          const file = join(client, card.path);
          mkdirSync(dirname(file), { recursive: true });
          const data = await png(type, card.draw());
          writeFileSync(file, data);
          bytes += data.length;
        }
        logger.info(`${cards.length} share cards, ${Math.round(bytes / 1024)} KB, in ${((Date.now() - started) / 1000).toFixed(1)}s`);

        const missing: string[] = [];
        for (const entry of readdirSync(client, { recursive: true, encoding: 'utf8' })) {
          if (!entry.endsWith('.html')) continue;
          const html = readFileSync(join(client, entry), 'utf8');
          const image = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
          if (!image?.startsWith(`${origin}/og/`)) continue;
          if (!existsSync(join(client, image.slice(origin.length)))) missing.push(`${entry} -> ${image}`);
        }
        if (missing.length) {
          throw new Error(`share cards: pages point at cards that were not drawn:\n  ${missing.join('\n  ')}`);
        }
      },
    },
  };
}
