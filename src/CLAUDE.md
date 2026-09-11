# src

Routes and the layout. [src/components](./components/CLAUDE.md) and
[src/i18n](./i18n/CLAUDE.md) carry their own rules and load on top of this one.

> ⚠️ **This file is here rather than in `src/pages/` on purpose.** Astro treats **any**
> `.md` file in `src/pages/` as a page, so a `src/pages/CLAUDE.md` builds as a public route
> at `/CLAUDE.html` and gets listed in the sitemap. The same applies to any other note,
> draft or scratch file you are tempted to leave in there: prefix it with `_` or keep it
> out of `src/pages/` entirely.

## A route file holds no markup

Fourteen route files cover seven logical pages, because every route exists twice: once
unprefixed for English and once under `[lang]` for the other three. That is only tolerable
because a page resolves `lang`, reads its meta strings, and renders `Base` around **one
shared body component**:

| Page | English | Prefixed | Body |
|---|---|---|---|
| home | [pages/index.astro](./pages/index.astro) | [pages/\[lang\]/index.astro](<./pages/[lang]/index.astro>) | [Home.astro](./components/Home.astro) |
| project index | [pages/projects/index.astro](./pages/projects/index.astro) | [pages/\[lang\]/projects/index.astro](<./pages/[lang]/projects/index.astro>) | [ProjectIndex.astro](./components/ProjectIndex.astro) |
| project page | [pages/projects/\[slug\]/index.astro](<./pages/projects/[slug]/index.astro>) | [pages/\[lang\]/projects/\[slug\]/index.astro](<./pages/[lang]/projects/[slug]/index.astro>) | [ProjectDetail.astro](./components/ProjectDetail.astro) |
| 404 | [pages/404.astro](./pages/404.astro) | [pages/\[lang\]/404.astro](<./pages/[lang]/404.astro>) | [NotFound.astro](./components/NotFound.astro) |
| game index | [pages/games/index.astro](./pages/games/index.astro) | [pages/\[lang\]/games/index.astro](<./pages/[lang]/games/index.astro>) | [GameIndex.astro](./components/GameIndex.astro) |
| 2048 | [pages/games/2048/index.astro](./pages/games/2048/index.astro) | [pages/\[lang\]/games/2048/index.astro](<./pages/[lang]/games/2048/index.astro>) | [Game2048.astro](./components/Game2048.astro) |
| Minesweeper | [pages/games/minesweeper/index.astro](./pages/games/minesweeper/index.astro) | [pages/\[lang\]/games/minesweeper/index.astro](<./pages/[lang]/games/minesweeper/index.astro>) | [Minesweeper.astro](./components/Minesweeper.astro) |

⚠️ **Games are not a `[slug]` route and must not become one.** The URLs look the same
either way - `/games/2048/` has a slug in it - but on disk `games/2048/` is a real
directory rather than a parameter, and there is one route file per game instead of one for
all of them. Two games, two directories.

Projects can be parameterised because every project page is the same page with different
data. A game is its own program with its own script, so a `[slug]` route would have to
import every game's component and choose one at render time. Vite resolves those imports
statically, so **every game's code would end up in every game's bundle**. One directory per
game is what stops that.

**Adding a route means adding both halves and a body component.** Markup in one of the pair
is how the languages start disagreeing, and nothing in the build will tell you.

## The two halves

- **Unprefixed** is English: `const lang = defaultLocale`. `prefixDefaultLocale` is
  `false`, so it has no prefix and `/en/` does not exist - it lands on the root 404.
- **Prefixed** maps `getStaticPaths` over `prefixedLocales` (`locales` minus `en`) and
  narrows the param with `resolveLang(Astro.params.lang)`.

**`Astro.currentLocale` is used nowhere.** Locale comes from the route param or the
constant. Keep it that way - it is why the routes do not depend on Astro's `i18n` config
being in sync.

## `[slug]/index.astro`, not `[slug].astro`

⚠️ `build.format` is `'preserve'`, so `[slug].astro` would emit
`projects/object-detection.html` and the URL would grow an extension. The extra directory
level is what keeps the trailing-slash URL shape, and the same reason makes the index routes
`index.astro`.

`'preserve'` exists for the 404 pages and is coupled to `localizePath` as well. The detail
is in
[docs/routing-and-deploy.md §3](../docs/routing-and-deploy.md#3-buildformat-preserve-and-the-three-things-coupled-to-it).

## Passing a project

Project routes hand the entry over through `props` from `getStaticPaths` rather than looking
it up again from the slug, so the route and the component cannot disagree about which
project they are rendering. Type it with `InferGetStaticPropsType<typeof getStaticPaths>`.

## `Base` props

[layouts/Base.astro](./layouts/Base.astro) is the only layout. `title` and `description`
default to the locale's `meta.*`, so pass them explicitly for anything that is not the
homepage.

⚠️ **`noindex` drops the canonical link and the whole hreflang set with it**, not just the
robots meta - those tags describe a page worth indexing in four languages, which a 404 is
not. Both 404 routes pass it. Nothing else should.

The `is:inline` theme script in `<head>` must stay inline: it runs before first paint, and a
bundled version would flash.

## robots.txt is a route

[pages/robots.txt.ts](./pages/robots.txt.ts) is an `APIRoute` so the sitemap URL comes from
the same `Astro.site` the sitemap integration uses, rather than being written down a third
time. It is prerendered like everything else. Do not replace it with a file in `public/`.

Full reference for all of the above: **[docs/routing-and-deploy.md](../docs/routing-and-deploy.md)**.
