# Routing and deploy

Forty prerendered pages, four locales, four projects, two games, on Cloudflare. Every route
exists twice - once unprefixed for English and once under `[lang]` for the other three - and
the whole build is static: `dist/server` comes out **empty** and nothing runs at request
time.

> [docs/README.md](./README.md) is the map, but **you should not need it to work on
> routing** - everything below is self-contained. The rules that apply while editing a
> page are in [src/CLAUDE.md](../src/CLAUDE.md).

---

## 0. Working on routing

| I need to change… | Touch |
|---|---|
| a page's `<head>`, canonical, hreflang, OG tags | [src/layouts/Base.astro](../src/layouts/Base.astro) - the only layout |
| the homepage's sections or their order | [Home.astro](../src/components/Home.astro), not the two routes that render it |
| **add a route** | two files: the unprefixed one and its `[lang]` twin, plus a shared body component - §1 |
| how a locale prefix is put onto a path | `localizePath` in [src/i18n/utils.ts](../src/i18n/utils.ts) - read §3, it is coupled to `build.format` |
| the emitted filenames (`.html` vs `index.html`) | `build.format` in [astro.config.ts](../astro.config.ts) - **read §3 first**, three things depend on it |
| how an unmatched URL is answered | `not_found_handling` in [wrangler.jsonc](../wrangler.jsonc) + the two 404 routes - §4 |
| image optimization | `adapter: cloudflare({ imageService })` in [astro.config.ts](../astro.config.ts) - §5 |
| `robots.txt` | [src/pages/robots.txt.ts](../src/pages/robots.txt.ts) - generated, not a static file |
| the sitemap | the `sitemap()` integration in [astro.config.ts](../astro.config.ts) - **read §6**, the trailing slash is added by hand |

**Read §3 before changing `build.format`.** Three separate things depend on `'preserve'`,
and only one of them is obvious.

---

## 1. Every route exists twice

`prefixDefaultLocale: false`, so English is unprefixed and the other three locales are
generated from a `[lang]` route. That gives fourteen route files for seven logical pages:

| Page | English | Prefixed | Body |
|---|---|---|---|
| home | [index.astro](../src/pages/index.astro) | [\[lang\]/index.astro](<../src/pages/[lang]/index.astro>) | [Home.astro](../src/components/Home.astro) |
| project index | [projects/index.astro](../src/pages/projects/index.astro) | [\[lang\]/projects/index.astro](<../src/pages/[lang]/projects/index.astro>) | [ProjectIndex.astro](../src/components/ProjectIndex.astro) |
| project page | [projects/\[slug\]/index.astro](<../src/pages/projects/[slug]/index.astro>) | [\[lang\]/projects/\[slug\]/index.astro](<../src/pages/[lang]/projects/[slug]/index.astro>) | [ProjectDetail.astro](../src/components/ProjectDetail.astro) |
| 404 | [404.astro](../src/pages/404.astro) | [\[lang\]/404.astro](<../src/pages/[lang]/404.astro>) | [NotFound.astro](../src/components/NotFound.astro) |
| game index | [games/index.astro](../src/pages/games/index.astro) | [\[lang\]/games/index.astro](<../src/pages/[lang]/games/index.astro>) | [GameIndex.astro](../src/components/GameIndex.astro) |
| 2048 | [games/2048/index.astro](../src/pages/games/2048/index.astro) | [\[lang\]/games/2048/index.astro](<../src/pages/[lang]/games/2048/index.astro>) | [Game2048.astro](../src/components/Game2048.astro) |
| Minesweeper | [games/minesweeper/index.astro](../src/pages/games/minesweeper/index.astro) | [\[lang\]/games/minesweeper/index.astro](<../src/pages/[lang]/games/minesweeper/index.astro>) | [Minesweeper.astro](../src/components/Minesweeper.astro) |

⚠️ **A game gets a route pair of its own, and that is the one place this table breaks its
own pattern.** It is about the *files*, not the URLs - `/projects/encryptix/` and
`/games/2048/` look identical from outside, and both have a slug in them. What differs is
where that slug comes from:

| | On disk | Pages built |
|---|---|---|
| projects | one file, `projects/[slug]/index.astro` | four, from `getStaticPaths` |
| games | one directory per game, `games/2048/index.astro` and `games/minesweeper/index.astro` | one each, no parameter |

Every project page is the same page with different data, so one parameterised file covers
all four and always will. A game is its own program - its own markup, its own script, its
own bundle - and there is no "the game component" for a `[slug]` route to render. It would
have to import all of them and pick one by slug, and because Vite resolves imports
statically, **that single import list would pull every game's code into every game's
page**. Two files per game is what keeps a game paying only for itself.

Adding one is five steps and the recipe is in
[content-and-i18n.md §Adding a game](./content-and-i18n.md#7-adding-a-game).

**The rule that keeps this from being duplication: a route file holds no markup.** It
resolves `lang`, calls `getDict` for the meta strings, and renders `Base` around one shared
body component. That is why the pairs cannot drift - there is nothing in them to drift.

The English half hardcodes `lang = defaultLocale`. The prefixed half maps
`getStaticPaths` over `prefixedLocales` (which is `locales` minus `en`) and narrows the
param with `resolveLang`. **`Astro.currentLocale` is used nowhere** - locale always comes
from the param or the constant.

Project routes take the project itself through `props` rather than looking it up again from
the slug, so the route and the component cannot disagree about which entry they are
rendering. The prefixed one `flatMap`s three locales over the project list.

`/en/` deliberately does not exist. Nothing generates it, so it lands on the root 404.

⚠️ **Anything in `src/pages/` is a route, including a `.md` file.** Astro treats markdown
there as a page, so a note left in that directory builds as a public HTML page and
`@astrojs/sitemap` submits it to crawlers. This is why the routing rules live in
[src/CLAUDE.md](../src/CLAUDE.md) rather than in `src/pages/`. Prefix anything else with `_`
to keep it out of the route table, and **check the page count**: the build prints it, and it
should be four locales times four fixed shapes, plus a 404, one detail page per project per
locale, and one page per game per locale - 40 with four projects and two games today.

---

## 2. `Base.astro` is the only layout

Everything in `<head>` is built there, and three of its behaviours are worth knowing:

- **`noindex` drops the canonical and the whole hreflang set with it**, not just the robots
  meta. Those tags describe a page worth indexing in four languages, which a 404 is not.
  The value is `noindex, follow` - the page is not worth indexing but the link out of it is
  worth crawling. Both 404 routes pass `noindex`.
- **The theme script is `is:inline` and must stay that way.** It runs before first paint to
  put `.dark` on `<html>`, and a bundled version would flash. It reads `localStorage`, falls
  back to `prefers-color-scheme`, and swallows a storage exception (private mode) into
  light. See [design-system.md §Theming](./design-system.md#6-theming-is-class-based-except-for-one-tag).
- **The `Person` and `WebSite` JSON-LD is emitted on the four home pages only**, gated on
  `isHome`, which compares `canonical.pathname` against `localizePath('/', lang)` rather
  than taking a prop - so the English route and its `[lang]` twin cannot disagree about
  which of them is a home page. Every value is read from [site.ts](../src/site.ts) or the
  dictionary, including `jobTitle`, which comes from the role marked `current`. The two
  `@id`s are absolute and identical across the four, so they describe one entity rather
  than four, and `inLanguage` lists every locale for the same reason. ⚠️ **A wrong
  `sameAs` URL does not merely fail to help, it hands the entity to somebody else's
  account**, which is why the links are never written down here by hand.
- **The disclosure dismissal script lives here, not in the components.** One listener
  covers every `details[data-menu]` on the page - both the mobile section menu and the
  language switcher. It handles Escape, pointer-down outside, and clicking a link inside,
  because a native `<details>` has no light dismiss and the section links are same-page
  anchors that would leave the panel sitting over the section it just jumped to.

Canonical, hreflang and OG URLs are all built by running `Astro.url.pathname` back through
`localizePath`, which is what §3 is about.

---

## 3. `build.format: 'preserve'` and the three things coupled to it

`'preserve'` rather than the default `'directory'`. It exists **for the 404 pages** and it
touches two other things.

**Why.** `not_found_handling: "404-page"` serves the nearest file literally named
`404.html`, walking up from the requested path. Under `'directory'`,
[\[lang\]/404.astro](<../src/pages/[lang]/404.astro>) is written out as
`/sr/404/index.html`, which that walk never finds, so `/sr/nonsense` fell back to the
English page. `'preserve'` writes `/sr/404.html` instead.

**What it does not change.** Index routes still emit `index.html`, so the four real page
shapes keep their extensionless URLs: `/`, `/sr/`, `/projects/`, `/sr/projects/`. Verified
in `dist/`:

```
dist/client/404.html                              dist/client/de/404.html
dist/client/index.html                            dist/client/de/index.html
dist/client/projects/index.html                   dist/client/de/projects/index.html
dist/client/projects/object-detection/index.html  …
```

⚠️ **This is why the project pages are `[slug]/index.astro` and not `[slug].astro`.** Under
`'preserve'`, a `[slug].astro` would emit `projects/object-detection.html` and the URL would
grow an extension. The extra directory level is load-bearing, not an accident.

⚠️ **It is also why `localizePath` tests for a file extension.** On a 404 page
`Astro.url.pathname` is `/404.html`, and the language switcher used to emit
`/de/404.html/` - a path that exists nowhere. The trailing slash is now added only when the
path does not end in an extension:

```ts
const isFile = /\.[a-z0-9]+$/i.test(rest);
return `${prefix}/${rest}${isFile ? '' : '/'}`;
```

Verified in the built output: the switcher on `/de/404.html` links to `/404.html`,
`/sr/404.html`, `/fr/404.html`, and on `/de/projects/object-detection/` it links to
`/projects/object-detection/`. Both correct, by two different branches of the same
function.

---

## 4. How a 404 is answered

Two mechanisms have to agree.

`assets.not_found_handling: "404-page"` in [wrangler.jsonc](../wrangler.jsonc) serves the
**nearest** `404.html` walking up from the requested path. So:

| Request | Served |
|---|---|
| `/de/typo` | `/de/404.html` - German |
| `/de/projects/typo` | `/de/404.html` - walks up |
| `/typo` | `/404.html` - English |
| `/en/anything` | `/404.html` - `/en/` is not a generated prefix |

⚠️ **Without `not_found_handling` the build is pure static assets with no Worker behind
them**, an unmatched path returns a bodiless 404, and
[src/pages/404.astro](../src/pages/404.astro) would never be reached at all. The setting is
what makes the per-locale pages worth having.

Both 404 routes pass `noindex` to `Base`, so neither carries a canonical or hreflang tags,
and `@astrojs/sitemap` keeps them out of the sitemap - **as long as the locale is registered
in [astro.config.ts](../astro.config.ts)**. See
[content-and-i18n.md §6](./content-and-i18n.md#6-adding-a-locale): a locale missing from that
list gets its 404 indexed.

---

## 5. Cloudflare and what actually ships

The adapter is present for one reason, stated in the config: **`imageService: 'compile'`**.

Left to itself the Cloudflare build resolved images through a runtime `/_image` endpoint and
then deployed static assets with nothing behind that route, so every variant 404ed in
production while a local build was fine. `'compile'` puts `sharp` back into the build, so
variants are written into `/_astro` with content hashes and no image touches the runtime.
That is also why `sharp` is an explicit devDependency rather than being left to hoisting.

`output: 'static'`, so the adapter shapes the output and turns no route on-demand.
**`dist/server` builds empty.**

[wrangler.jsonc](../wrangler.jsonc) is the *input*, not what ships. At build time the
adapter writes `dist/client/wrangler.json` with the directory relative to itself and points
wrangler at that, so the `assets.directory` path in the checked-in file only matters if
wrangler is invoked directly. The adapter also injects `_headers` (immutable
`Cache-Control` for `/_astro/*`) and `.assetsignore` next to the output.

### What lands in `dist/client/_astro/`

Three woff2 faces, five webp variants and **one JavaScript file**, which is the game.

`build.inlineStylesheets: 'always'` puts the whole stylesheet inside every document, so
nothing render-blocking stands between the first response and the first paint, and the
`@font-face` rules are known as soon as the head is parsed rather than one fetch later. It
costs about 9 KB gz a page and the CSS is no longer cached across pages. The full reasoning
is on the option in [astro.config.ts](../astro.config.ts).

The four `<script>` blocks - the pre-paint theme script, the theme toggle, the disclosure
dismissal and the active-section indicator - are all small enough that Astro inlines them
into each page rather than emitting a bundle. 1.7 KB of JS per page, in a 26 KB gz home
page, with no extra request. Keep it that way: see [src/components/CLAUDE.md](../src/components/CLAUDE.md).

The three files in `_astro` are the two game engines and the piece they share. 2048 is
2.4 KB gz, Minesweeper 3.2 KB, and [games/record.ts](../src/games/record.ts) 0.4 KB. Each
engine is requested by its own route and that route's three locale twins, and by nothing
else, which is the point: a game pays for itself and the rest of the site is unchanged.

⚠️ **The record is a third file rather than a copy inside each game**, because two entry
points import it and Rollup splits what they share. That is one extra request on a game
page and none anywhere else, and a reader who plays both games fetches it once. Do not
try to inline it back - the alternative is the same bytes twice.

**`PUBLIC_GAME_SIGN_KEY` is the only environment variable the site reads**, and it is
optional: it signs the stored best score of both games, and
[games/record.ts](../src/games/record.ts) falls back to a literal so a build without it
works. Set it in the Cloudflare build environment to keep the key out of the
repository, and understand what that is worth - the `PUBLIC_` prefix is required for client
code, which means Vite substitutes the value into the shipped bundle either way. Changing it
invalidates every record signed with the old key and they restart at zero. The reasoning is
in [design-system.md §9](./design-system.md#9-the-game-boards-and-the-one-place-the-palette-opens-up).

`archivo` is imported as the `wdth` build, which costs 90 KB latin against 35 KB for weight
alone. That is deliberate - width *is* the display/text contrast on this site, so it is the
whole type system rather than an extra axis.

⚠️ **Two of the three faces load on every page, not one.** `latin` is 90 KB and `latin-ext`
is 86 KB, so the real type cost is 176 KB. `Cvetković` puts `ć` (U+0107) inside the
`latin-ext` unicode-range, and the name is in the `<h1>` of every page in all four locales,
so no page escapes the second subset. `vietnamese` never loads. None of this is on the
critical path: `font-display: swap` paints the fallback immediately and measured CLS is 0.

### Deploying

**Nothing in this repository runs the deploy.** There is no `deploy` script and no CI
workflow. `wrangler` is a dependency and `npm run generate-types` calls `wrangler types`,
which writes `worker-configuration.d.ts` - a file [tsconfig.json](../tsconfig.json) names in
`include` and which is not checked in. That is harmless: `include` tolerates a missing path
where `files` would not, and `astro check` passes without it.

---

## 6. The sitemap carries a trailing slash by hand

Thirty-two URLs: the home page, the project index, one page per project, the game index
and one page per game, across four locales, with the 404 pages excluded. Every entry
ends in a slash, and that agrees with the `<link rel="canonical">` on the page itself - but
only because the `serialize` hook in [astro.config.ts](../astro.config.ts) puts it there.

⚠️ **`@astrojs/sitemap` adds the slash in exactly one case, and it is not this one.** The
branch reads:

```js
if (config.trailingSlash === "never")                                   // leaves it bare
else if (config.build.format === "directory" && !newUrl.endsWith("/"))  // adds the slash
else                                                                    // leaves it bare
```

`build.format` is `'preserve'` here, for the 404 pages (§3), so that middle branch never
runs. Astro's own `trailingSlash` is no help either: only `'never'` is read, and `'always'`
falls through the same `else`. Without the hook every `loc` comes out bare while the pages
claim the slashed form is canonical, which hands crawlers one URL and tells them a different
one is authoritative.

Two details of the hook are load-bearing:

- **`item.links` needs the same treatment as `item.url`.** `links` holds the hreflang
  alternates and carries the same bare strings, so fixing only `url` leaves every page
  pointing its alternates at the unslashed form.
- **The check for an existing slash is not redundant.** The root URL already ends in one, and
  without the check the home entry came out as `https://vukcvetkovic.com//`.

The extension test is the same one `localizePath` uses, so both sides settle on one rule: a
trailing slash for a directory route, nothing for anything that looks like a file.

**After changing anything about routing or locales, read `dist/client/sitemap-0.xml`.** It is
the one output nothing else checks - the 404 exclusion depends on the locale being registered
(design-system §8, open item 1), and the slash depends on this hook.

---

## 7. `robots.txt` is generated

[src/pages/robots.txt.ts](../src/pages/robots.txt.ts) is an `APIRoute` rather than a file in
`public/`, for one reason: the sitemap URL is the line that can go stale, and a copy in
`public/` would have been the **third** place the domain is written down after `site` in
[astro.config.ts](../astro.config.ts) and `url` in [src/site.ts](../src/site.ts).
Generating it means the URL comes from the same `Astro.site` the sitemap integration uses,
so the file and the sitemap it points at cannot disagree.

Prerendered like everything else, so it is a plain static file on Cloudflare.

`Allow: /` is redundant - with no `Disallow` line everything is crawlable - and is there to
state the intent rather than leave it inferred from an absent rule.

---

## 8. Open items

| # | Item | Severity |
|---|---|---|
| 1 | **The adapter declares a `SESSION` KV binding that nothing in [wrangler.jsonc](../wrangler.jsonc) asks for.** `astro build` logs `Enabling sessions with Cloudflare KV with the "SESSION" KV binding` and the generated `dist/client/wrangler.json` carries `kv_namespaces: [{ binding: "SESSION" }]` with no namespace id. No route is on-demand, so no session is ever read. Unverified against a real `wrangler deploy`. | unverified |

---

## Changelog

- 2026-09-11 - a second game and its route pair, `/games/minesweeper/`, taking the build to
  40 pages and the sitemap to 36 URLs. `_astro` now holds three files: an engine per game
  and the record module they share (§5).
- 2026-09-11 - the site reads its first environment variable. `PUBLIC_GAME_SIGN_KEY` is
  optional, signs the stored 2048 record, and falls back to a literal when it is unset (§5).
- 2026-09-11 - a games section: `/games/` and `/games/2048/`, six route pairs in all,
  taking the build to 36 pages and the sitemap to 32 URLs. `/games/2048/` is also the first
  page on the site to request a JavaScript file: 2.7 KB gz in `_astro`, on that route and
  its three twins only. ⚠️ Games are **not** a `[slug]` route, unlike projects, and §1
  records why.
- 2026-09-10 - the build config is `astro.config.ts` and imports `locales` from
  src/i18n/types.ts, so the list is written down once and adding a language can no
  longer fail silently. Closes the old open item 1.
- 2026-09-09 - the four home pages carry `Person` and `WebSite` JSON-LD, built from
  `site.ts` and the dictionary rather than written out by hand (§2).
- 2026-09-09 - the stylesheet is inlined into every document, so `/_astro` holds no CSS
  file and nothing render-blocking precedes the first paint (§5).
- 2026-09-08 - a fourth project takes the build to 28 pages and the sitemap to 24 URLs.
- 2026-09-08 - a third project takes the build to 24 pages and the sitemap to 20 URLs.
- 2026-09-08 - a second project takes the build to 20 pages and the sitemap to 16 URLs.
- 2026-09-08 - the sitemap emits trailing slashes, matching the canonical tags (§6).
- 2026-09-08 - first version of this page.
