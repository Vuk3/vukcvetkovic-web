# vukcvetkovic.com - documentation

**This is where the detail lives.** [AGENTS.md](../AGENTS.md) at the root carries the
working rules and always loads. This page is the map: what the site is, where each kind of
change belongs, and the index of the three deep-dives below.

Each deep-dive is written to be **self-sufficient**. Paste its link into a prompt and an
agent has the mechanism, the failure modes, the open items and the paths to the code
without reading anything else.

## What this is

A personal site for Vuk Cvetković, backend developer in Niš: a single-page CV at the root
plus a project write-up section, in **four languages** (English, Serbian, French, German).

- **Astro 7**, `output: 'static'`. Every route is prerendered - `dist/server` builds empty
  and nothing runs at request time.
- **Tailwind 4** via `@tailwindcss/vite`, driven entirely from CSS. There is no
  `tailwind.config`: the theme is declared with `@theme inline` inside
  [src/styles/global.css](../src/styles/global.css).
- **Cloudflare** through `@astrojs/cloudflare`, whose only job here is `imageService:
  'compile'` and the assets shape. Nothing in the repository runs the deploy.
- **36 pages**, 4 locales, 4 projects, 1 game. Three woff2 faces, a handful of webp
  variants, and **no CSS file at all** - the stylesheet is inlined into every document, and
  four small inline blocks cover the pre-paint theme script, the theme toggle, menu
  dismissal and the active-section indicator.
- **One JavaScript file, on one route.** `/games/2048/` is a game, so it has a real script:
  2.7 KB gz, requested by that route and its three locale twins and by nothing else.

## Where things are

| I need to change… | Go to |
| --- | --- |
| **copy in any language** | [src/i18n/](../src/i18n/) - rules in its [CLAUDE.md](../src/i18n/CLAUDE.md), mechanism in [content-and-i18n.md](./content-and-i18n.md) |
| a name, URL, date, employer or technology label | [src/site.ts](../src/site.ts) - [content-and-i18n.md](./content-and-i18n.md#1-the-split-facts-versus-prose) |
| **add a project** | [content-and-i18n.md §Adding a project](./content-and-i18n.md#5-adding-a-project) |
| add a technology to a stack or skill list | [src/tech.ts](../src/tech.ts) - [content-and-i18n.md §Adding a technology](./content-and-i18n.md#adding-a-technology) |
| **add a language** | [content-and-i18n.md §Adding a locale](./content-and-i18n.md#6-adding-a-locale) - five places, every one checked |
| a route, a URL shape, a 404, the sitemap or robots.txt | [routing-and-deploy.md](./routing-and-deploy.md) |
| the Cloudflare or image configuration | [routing-and-deploy.md §Cloudflare](./routing-and-deploy.md#5-cloudflare-and-what-actually-ships) |
| **colour, type, spacing or layout width** | [design-system.md](./design-system.md) |
| a section's width or tone | [Section.astro](../src/components/Section.astro) - [design-system.md §Sections](./design-system.md#3-sections-and-the-card) |
| **how a card, chip or pill looks** | [design-system.md §Sections](./design-system.md#3-sections-and-the-card) |
| the request diagram on a project page | [ArchitectureDiagram.astro](../src/components/ArchitectureDiagram.astro), [diagram-tokens.ts](../src/diagram-tokens.ts), [diagram-layout.ts](../src/diagram-layout.ts) - [design-system.md §The request diagram](./design-system.md#6-the-request-diagram) |
| an animation | [design-system.md §Motion](./design-system.md#5-motion) |
| a component's markup | [src/components/](../src/components/) - rules in its [CLAUDE.md](../src/components/CLAUDE.md) |
| **add a game** | [content-and-i18n.md §Adding a game](./content-and-i18n.md#7-adding-a-game) - a route pair of its own, not a `[slug]` |
| **the 2048 game** | [src/games/2048/game.ts](../src/games/2048/game.ts) and [Game2048.astro](../src/components/Game2048.astro) - board and ramp in [design-system.md §The game board](./design-system.md#9-the-game-board-and-the-one-place-the-palette-opens-up) |
| a page or a `getStaticPaths` | [src/pages/](../src/pages/) - rules in [src/CLAUDE.md](../src/CLAUDE.md) |

## The deep-dives

- **[Content and i18n](./content-and-i18n.md)** - the facts-versus-prose split between
  [src/site.ts](../src/site.ts) and the four dictionaries, how `Dict` is derived from
  English so a missing key fails the build, the [src/tech.ts](../src/tech.ts) mark registry
  that types every technology name, and the recipes for adding a project, a role, a
  technology and a locale. **Read the locale section before adding a language** - it is
  five files, and widening `locales` first makes the compiler name the other four.

- **[Routing and deploy](./routing-and-deploy.md)** - why every route exists twice, why
  `build.format` is `'preserve'` and what that couples to, how Cloudflare resolves a 404,
  what lands in `dist/`, and the sitemap/canonical trailing-slash disagreement.

- **[Design system](./design-system.md)** - the `--site-*` token path into Tailwind and why
  `@theme inline` is load-bearing, `.panel` as the one inverted block, the `.shell-*`
  measure family, `.card` as the page's unit and the grid-stretch trap that shaped it, the
  request diagram, theming through a class rather than a media query, and the motion
  system: the `enter` load sequence and the scroll-driven `reveal` family.

## Rules for these pages

Rules for editing this documentation, so it stays worth reading:

1. **Verify every claim against the code.** Prose that contradicts a file is worse than no
   prose. The linked file is the authority, never this page.
2. **Describe the present tense.** No "changed from X" in a behavioural claim. Dates live
   on changelog lines only.
3. **Link with relative paths** so a reader can click through, and check they resolve.
4. **Record the surprising, not the obvious.** A table restating what the code plainly says
   earns nothing. The reason each page exists is the thing that would cost an hour to
   rediscover.
5. **Say what fails and how.** For each guard: does it throw, warn, or silently fall back?
   Silent is the one worth a warning marker.
6. **Every deep-dive opens with a "what I need to change → what to touch" table** and ends
   with a changelog: one dated line per change, appended at the bottom, never nested. It
   says *what changed*, not how the thing works - if a reader has to read the changelog to
   learn current behaviour, the body has failed and the body is what to fix.
7. **Do not document what the code structure or git history already records.** Three
   deep-dives is the right number for a site this size. A fourth needs a reason.
