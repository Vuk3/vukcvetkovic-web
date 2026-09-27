# src/components

Every component here is an `.astro` file with no framework runtime behind it. Design
reference: **[docs/design-system.md](../../docs/design-system.md)**.

## Every page but the games ships no JavaScript file

Three woff2 faces, a handful of webp variants, and no CSS file either: every stylesheet is
inlined into the documents that use it. The four `<script>` blocks that exist are small
enough that Astro inlines them into each page too - about 2 KB total, no extra request.

⚠️ **The exceptions are the seven games**, [Game2048.astro](./Game2048.astro),
[Minesweeper.astro](./Minesweeper.astro), [Memory.astro](./Memory.astro),
[Accretion.astro](./Accretion.astro), [Battleship.astro](./Battleship.astro),
[Cube.astro](./Cube.astro) and [FourInARow.astro](./FourInARow.astro), whose scripts import a
module and are therefore emitted as real files, plus a shared chunk for
[games/record.ts](../games/record.ts), [games/sound.ts](../games/sound.ts) and
[games/burst.ts](../games/burst.ts), each requested only by its own route and that route's
three locale twins. The sizes are in [AGENTS.md](../../AGENTS.md). The sound switch in every
game is [SoundToggle.astro](./SoundToggle.astro), one component for the reason
[GameStamp.astro](./GameStamp.astro) is one. A game cannot be CSS. Nothing else here gets to
cite them - the rules below are unchanged for every other component.

- **Reach for CSS first.** The language switcher and the phone menu are native `<details>`
  elements. The header capsule's settle is a `scroll(root)` timeline. The section reveals
  and the request diagram's assembly are `view()` timelines, and its packets' loop is a
  CSS animation. None of that costs script.
- **If something genuinely needs a script, ask before adding it.** Three exist outside the
  games: the theme toggle, the layout's single dismissal listener and the active-section
  observer.
- **Dismissal is already solved.** A disclosure gets `data-menu` and
  [Base.astro](../layouts/Base.astro) handles Escape, pointer-down outside and clicking a
  link inside, for every disclosure on the page at once. Do not add a second listener.

## Go through Section.astro

[Section.astro](./Section.astro) owns what makes a section: a big heading rising into a
mask, an optional `aside` slot beside it, then the content. A homepage, project-page or
game-page section is `<Section …>` with content inside, never a hand-rolled `<section>`.

- **There is no width.** Every section sits on the one `.shell` measure, so every left edge
  lines up with the header's. The width family and its prop were removed because six
  widths read as misalignment; do not add either back.
- **`tone` is spent twice on the homepage and twice on a project page**, and once on every
  game page for its build notes. It is not decoration for a new section: what separates
  sections is what they put in their tiles. Do not reintroduce alternating bands.
- **There is no `head` prop, and adding one back is a step backwards.** Four head shapes and
  a sticky label column were built and removed: they spent about 12rem of every measure on a
  caption.

## Build a section out of tiles

`.card` is the page's unit - a service, a role, a skill group, a project, a channel, a node
of the request diagram, a how-to-play list. `.bento` lays tiles out on 12 columns from
64rem and 6 from 40rem; a tile places itself with `sm:col-span-*` and `lg:col-span-*`, and
**every row has to add up to the full count**. Add `.card-hover` **only** where the whole
tile is a link, and pair it with `.stretch` on the title so the click target is the tile
while the accessible name stays the title.

`.panel` (ink) and `.tile-cobalt` re-declare the palette, so anything inside them comes out
right with no rule of its own. Cobalt is at most one or two tiles a page. Never nest one in
the other.

- ⚠️ **`.stretch` covers everything underneath it.** Any link that has to stay clickable
  inside a stretched tile needs `.above`.
- ⚠️ **A grid of tiles stretches to the tallest of them.** Where the content per item is
  uneven, size the tiles by what they hold, share rows through a subgrid (Skills), or put
  rows inside one tile (how to play). A tile per group left Data showing two chips over 200
  points of nothing.
- A technology is `.chip` (name and mark, inline) or [MarkTile.astro](./MarkTile.astro) (a
  square with the mark large). Use MarkTile rather than writing the markup: it puts
  `--brand` on the tile itself so the hover can take the mark's colour.
- ⚠️ **Never a half-empty measure.** A paragraph runs the full width of its tile, sits in
  `.prose-columns`, or its tile is sized so it fills it. There is no reading-measure class.
- **No arrow appended to link text**, and no tracked-out capitals on any label. A leading
  icon is fine.

## Conventions

- **Every component takes `lang: Lang` and calls `getDict(lang)`.** Nothing reads
  `Astro.currentLocale`, and nothing hardcodes a string a reader will see.
- **A page's body lives in one shared component** so the unprefixed route and its `[lang]`
  twin cannot drift - [Home.astro](./Home.astro),
  [NotFound.astro](./NotFound.astro), [ProjectIndex.astro](./ProjectIndex.astro),
  [ProjectDetail.astro](./ProjectDetail.astro), [GameIndex.astro](./GameIndex.astro), and
  the seven game components. See [src/CLAUDE.md](../CLAUDE.md).
- **No raw hex.** Colour comes from the `--site-*` tokens or the Tailwind utilities mapped
  to them (`text-muted`, `bg-band`, `border-hairline`). The exceptions are declared away
  from the components that use them: brand colours for technology marks in
  [src/tech.ts](../tech.ts), and the seven game boards' tokens, each in its game's own file
  under [styles/games/](../styles/games/).
- **Tailwind utilities for one-off layout, a named class in a stylesheet for anything that
  repeats or carries reasoning.** A clamp with a comment explaining how the number was
  arrived at belongs in the stylesheet.
- **A page area's styles live in its own file and are imported by its component**, so they
  are inlined only into the pages that show them: [home.css](../styles/home.css) by
  Home.astro, [project.css](../styles/project.css) by the project components,
  [flow.css](../styles/flow.css) by ArchitectureDiagram (FlowMini keeps its rules in its
  own scoped `<style>`),
  [notfound.css](../styles/notfound.css) by NotFound.astro, and a game's by that game and
  its thumbnail, with the chrome every game page shares in `styles/games/shared.css`
  (imported *after* the game's own file) and the games index in `styles/games/index.css`.
  global.css is only what every page needs. Every one of these files opens with the same
  `@layer` line as global.css - read the note at the top of global.css first.
- Comment **why**. This codebase does so at a density well above normal, deliberately -
  match it.

## Which reveal class

Decided by one question: is the element in view at first paint?

| Situation | Class |
|---|---|
| in view at first paint (hero, page heads, 404) | `enter`, ordered with an inline `style="--enter-delay:…"` |
| a big heading line in view at first paint | `.line-mask.enter-line` wrapping a `.line-in` |
| a section heading | nothing to add - Section.astro renders it with `.reveal-line` |
| a block arriving on scroll | `reveal` |
| a repeated tile that should stagger within its grid | `reveal-item` |
| the request diagram, the Skills diagram | none of them - each assembles against its own stage's `view()` timeline, and a `reveal` on top would fade the block in and then assemble it inside itself |

`reveal-item` staggers by `nth-child`, so it goes on the element directly inside the grid.
Wrapping the items in another element resets the count.

⚠️ **Keyframes move things with `translate`, `scale` and `rotate`, never `transform`**, or
the held last frame eats every hover lift. Full mechanics, including the `@property`
registrations and the longhands-only rule:
[docs/design-system.md §Motion](../../docs/design-system.md#5-motion).

## Accessibility details already decided

- Icons are `aria-hidden="true"` when a text label sits beside them. The request diagram's
  stage is `aria-hidden` and the run is announced from a `sr-only` ordered list in the order
  the request takes it; the 404's digit tiles are `aria-hidden` and the status is read once
  from a `sr-only` line.
- The Education crest has `alt=""` - the school is named in the line next to it, and
  announcing the crest as well reads the same thing twice. So does the header's V mark,
  beside the name.
- The phone menu carries **no landmark**. The desktop `<nav>` already has one named
  "Sections", and a second with the same name gives a screen reader two identical entries.
  The footer's lists are plain lists for the same reason.
- `data-current` is passed as `''` or `undefined`, never a boolean: Astro renders `false` as
  `data-current="false"`, which `[data-current]` would still match.
