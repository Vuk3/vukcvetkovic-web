import type { APIRoute } from 'astro';
import { site } from '../site';

/**
 * robots.txt, generated rather than dropped into /public.
 *
 * The one line in this file that can go stale is the sitemap URL, and a copy in
 * public/robots.txt would have been the third place the domain is written down,
 * after `site` in astro.config.mjs and `url` in src/site.ts. Generating it means
 * the URL comes from the same `site` the sitemap integration itself uses, so the
 * file and the sitemap it points at cannot disagree.
 *
 * `Allow: /` is redundant - with no Disallow line everything is crawlable
 * already - but it states the intent rather than leaving it to be inferred from
 * an absent rule.
 *
 * Prerendered like every other route (`output: 'static'`), so this is a plain
 * static file on Cloudflare with nothing behind it at runtime.
 */
export const GET: APIRoute = ({ site: configuredSite }) => {
  // `Astro.site` is set in astro.config.mjs; the fallback only satisfies types.
  const sitemap = new URL('sitemap-index.xml', configuredSite ?? new URL(site.url));

  const body = `User-agent: *
Allow: /

Sitemap: ${sitemap.href}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
