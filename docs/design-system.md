# Design system

The look is **the systems he builds, drawn: ink, paper and cobalt, and one line**. A cool
paper ground, headings set wide and heavy on Archivo's width axis, two loud surfaces spent
sparingly - ink (`.panel`) and cobalt (`.tile-cobalt`, the navy of the suit in the
portrait) - and a single ornament, the **trace**: the request diagram's 2px connector with
its arrowhead, run from "Projects" into All projects, along the header as a reading gauge,
and down the Experience rail. A line is drawn only where it goes somewhere a reader can
name.

The homepage is a **sequence of scenes**, no two composed alike - a masthead, a statement
that takes its ink as it is read, a drawing of the stack, a rail through a career, a deck of
case studies on the one dark stage, a list of services, and the ask. Each project has its
own **hue**, and its card and its page are drawn in it. Every row still fills its columns
and the motion is meant to be seen. All of it is CSS.

The rules live in one foundation stylesheet and a handful of page files, and almost every
number in them carries a comment saying how it was arrived at:

| File | Holds | Inlined into |
|---|---|---|
| [global.css](../src/styles/global.css) | tokens, base, the tile family, chips and buttons, the header, the footer, the page head, the motion system | every page |
| [home.css](../src/styles/home.css) | the hero and the homepage sections | the four home pages |
| [project.css](../src/styles/project.css) | the project index, a project page, the homepage Projects section | the home pages, the project index and the project pages |
| [flow.css](../src/styles/flow.css) | the request diagram (its card thumbnail, `FlowMini`, keeps its rules in its own scoped `<style>`) | the project pages |
| [notfound.css](../src/styles/notfound.css) | the 404 | the four 404 pages |
| [games/](../src/styles/games/)`<slug>.css`, `shared.css`, `index.css` | one game each, the chrome every game page shares, the games index | that game's pages, every game page, the games index |

> [docs/README.md](./README.md) is the map, but **you should not need it to work on the
> design** - everything below is self-contained. The rules that apply while editing a
> component are in [src/components/CLAUDE.md](../src/components/CLAUDE.md).

---

## 0. Working on the design

| I need to change… | Touch |
|---|---|
| a colour | the `--paper-*` and `--site-*` blocks on `:root` **and** their counterparts in `.dark` - §1 |
| **a project's colour** | `hue` on the project in [site.ts](../src/site.ts), `--hue-*` and `[data-hue]` in global.css - §1 |
| **the trace from a section title into its link** | `.sec-head[data-aside]`, `.sec-trace-line` and `--sec-size` in global.css, markup in [Section.astro](../src/components/Section.astro) - §3 |
| a white tile on the ink | `.surface`, which maps `--site-*` back to `--paper-*` - §1 |
| the "now" dot | `--site-signal` - §1 |
| **a Tailwind colour utility's meaning** (`text-muted`, `bg-card`) | the `@theme inline` block - §1. Do not remove `inline` |
| **the look of an ink or cobalt block** | the `--site-panel-*` or `--site-cobalt-bg` tokens, not the block - §1 |
| the page gutter or the one measure | `--site-pad` or `--site-shell`, once, on `:root` - §2 |
| **how a tile looks anywhere on the site** | `.card`, `.card-hover`, `.inset`, `.tile-label`, `.tile-icon` - §3 |
| **a section's grid** | `.bento` and the `sm:col-span-*` / `lg:col-span-*` on its tiles, or the section's own grid in its page file - §3 |
| a chip, a mark tile, a pill, a button | `.chip`, `.mark-tile` ([MarkTile.astro](../src/components/MarkTile.astro)), `.tag`, `.pill-status`, `.cta`, `.cta-ghost` - §3 |
| a section's tone or rhythm | props on [Section.astro](../src/components/Section.astro) - §3 |
| the display voice | `.sec-label`, `.page-title`, `.hero-name` and the per-block rules - §4 |
| **the load sequence** | `--enter-delay` on the elements, not the keyframes - §5 |
| a scroll reveal | the `.reveal` / `.reveal-item` / `.reveal-line` block at the bottom of global.css - §5. **Longhands only** |
| the header capsule, its reading gauge | `.site-head`, `.head-capsule`, `.head-progress`, the `head-settle` keyframes and `--head-pad` - §5, §7 |
| the footer, its opening ask, or the floating Back to top | `.site-foot`, `.foot-call`, `.foot-*`, `.to-top` - §5 and [Footer.astro](../src/components/Footer.astro) |
| **the project deck on the homepage** | `.deck` and `.case` in [project.css](../src/styles/project.css) - §5, §10 |
| **the request diagram** | [ArchitectureDiagram.astro](../src/components/ArchitectureDiagram.astro), [flow.css](../src/styles/flow.css) - §6 |
| which technology a diagram node shows | `flowTech` on the project in [site.ts](../src/site.ts) - §6 |
| what the request diagram *says* | `flow` in the dictionaries and `flowShape` in [site.ts](../src/site.ts) - §6 |
| the active-section indicator | the second `<script>` in [Base.astro](../src/layouts/Base.astro) and `.nav-link[aria-current]` - §7 |
| dark mode | the `.dark` block, **and** the two `theme-color` tags in [Base.astro](../src/layouts/Base.astro) - §8 |
| **a game page's chrome** - head, stage, figures, buttons, how to play, build notes | [games/shared.css](../src/styles/games/shared.css) - §9 |
| **a game's board, its colours or its keyframes** | its own file under [src/styles/games/](../src/styles/games/), never global.css - §9 |
| **the games index, a thumbnail's hover** | [games/index.css](../src/styles/games/index.css) and [GameIndex.astro](../src/components/GameIndex.astro) - §9 |
| a page's composition | §10 |

**Read §5 before touching any animation.** The `animation` shorthand silently breaks the
scroll timelines, a `transform` in a keyframe eats every hover on the site, and one custom
property has to stay registered.

---

## 1. The token path, `inline`, and the two loud surfaces

Colour flows through three stages:

```
:root { --site-accent: #2331c8 }      ← the value, light
.dark { --site-accent: #93a2ff }      ← the value, dark
@theme inline { --color-accent: var(--site-accent) }
                                       ← Tailwind's name for it
text-accent, bg-accent, border-accent  ← what a component writes
```

⚠️ **`@theme inline` rather than `@theme`.** With `inline`, utilities emit
`var(--site-accent)` and therefore follow the `.dark`, `.panel` and `.tile-cobalt`
overrides **at runtime**. Without it Tailwind resolves the value **at build time**, every
utility freezes at the light value, and dark mode silently stops working for anything
written as a utility class. This is the single most consequential word in the file.

There is no `tailwind.config`. The whole theme is these two blocks.

### The palette

| Token | Light | Dark | What it is for |
|---|---|---|---|
| `--site-bg` | #edeff3 | #080b12 | the page ground, a cool paper grey. In the dark theme night rather than black, a trace of the cobalt in it |
| `--site-card` | #ffffff | #10141e | a tile. Pure white in light mode, so the step from the ground is the whole of its lift |
| `--site-inset` | #f3f5f8 | #171c28 | a block *inside* a tile, going back **towards** the ground |
| `--site-band` | #e3e6ec | #030509 | a banded section, set a step *into* the page |
| `--site-fg` / `--site-muted` / `--site-hairline` | | | ink, secondary text, edges |
| `--site-accent` | #2432d1 | #93a1ff | links, the CTA, the active section, the traces, the diagram's connectors |
| `--site-signal` | #f05a0a | #ff8a3d | safety orange, for what is live *now* and nothing else: the dot before "Software engineer", the role held today, a game that is Live. Never text (3.4:1 on white), never a second accent |
| `--site-stage` | #0b0f18 | #020306 | the ground Projects is played on: the ink in the light theme, and a step *below* the ground in the dark one, so the tiles on it lift in both |

⚠️ **Every value is declared twice, as `--paper-*` and as `--site-*`.** `--paper-*` is the
theme's own ground and ink and nothing re-declares it. `--site-*` is what a component reads,
and `.panel` and `.tile-cobalt` re-declare it. `.surface` maps `--site-*` back to
`--paper-*`, which is the one way back to the theme's own paper from inside a loud surface -
a white project card on the ink stage, carrying a request diagram with an ink core of its
own.

**The project hues.** `--hue-cobalt`, `--hue-berry`, `--hue-amber` and `--hue-green`, a
light and a dark value each, picked by `hue` on the project in [site.ts](../src/site.ts)
and applied by `[data-hue]`, which sets `--paper-accent`, `--site-accent` and a paler
`--site-panel-accent` - so the card, the request drawn on it and, on the project page,
every trace, step number and result bar are in the project's colour, and a `.panel` inside
(a diagram's core) takes it too. Each is 5.3:1 or better as text on white and 7.7:1 or
better on a dark tile. ⚠️ **They are spread round the wheel** (235, 326, 29 and 134
degrees): violet and teal, 23 and 50 degrees from cobalt and green, read as a second blue
and a second green. Amber is kept dark enough to read as brown beside the signal's orange.

**The accent is cobalt, and it is borrowed rather than invented:** it is the navy of the
suit in the portrait, which is the one photograph on the site. That is why it sits with the
image instead of arguing with it.

**Contrast, measured:** the tightest pair of text is muted on the band, 5.55:1. Muted on
the ground is 6.03:1 and on a tile 6.94:1, the accent is 7.44:1 on the light ground and
8.23:1 on the dark one, white on cobalt is 8.56:1 (7.46:1 on the dark theme's brighter
cobalt), and the ink's muted text on the ink is 8.21:1. Check a new pair against these
before shipping it.

**Dark mode is a ladder, and the order is the design:** band, ground, tile, inset, panel,
panel tile - each a step above the last. A band **recesses** below the ground there while a
tile lifts above it, which is the opposite of light mode.

### Shadows are spent on two things

⚠️ **No tile has a resting shadow.** Identical soft shadows under every card is the
default of a generated page, and white on this ground does not need one. Two tokens exist,
both tinted with the ink rather than grey:

- `--site-lift-hover` - a tile under the pointer, which rises 4px to meet it;
- `--site-float` - what genuinely floats: the header capsule, the back-to-top button, a
  dropdown.

In dark mode a border alone flattens a tile, so `--site-rim` gives every tile an inset
white line at 5% along its top edge. It is `0 0 #0000` in light mode.

### `.panel` and `.tile-cobalt`, the surfaces that re-declare the palette

```css
.panel {
  color-scheme: dark;
  --site-bg: var(--site-panel-bg);
  --site-card: var(--site-panel-card);
  --site-fg: var(--site-panel-fg);
  /* …and muted, hairline, inset, band, accent, rim */
}
```

**A loud surface re-declares the palette rather than styling its own contents.** Because
`@theme inline` maps every Tailwind colour to a `var(--site-*)`, that override is the whole
implementation: `.card`, `.link`, `.chip`, `.cta`, `.mark-tile`, `text-muted` and
`border-hairline` inside it all come out correct with **no surface-specific rule anywhere**.

⚠️ **`color-scheme: dark` on both is load-bearing.** A technology mark picks its colour
with `light-dark()` (see `brandStyle` in [tech.ts](../src/tech.ts)), and without it Express
and Expo - near-black marks - were drawn near-black on the ink in the light theme.

`.tile-cobalt` is the same trick with the suit's blue as the ground: white is its text and
its accent, so a link inside is white on blue and a `.cta` inverts to blue on white. Its
dark value is a shade brighter (#2b39d6) so it still reads as blue rather than as a hole in
a near-black page.

Where they are spent:

| Surface | Used by |
|---|---|
| ink | the header capsule, the hero, the Projects stage (on `--site-stage`), the close of a page (Contact, a takeaway, a game's build notes), the footer, the core node of a request diagram, Backend in Skills, one digit of the 404 |
| cobalt | the About tile that points at the games, the ask in Contact, one figure per game's HUD, one digit of the 404, the studio light behind the hero's portrait |

⚠️ **Cobalt is at most one or two tiles a page.** It is the loudest surface the site has,
and a third one points at nothing.

⚠️ **Never nest one inside the other, or a panel in a panel.** The tokens would resolve to
themselves.

Other non-colour tokens on `:root`: three easing curves - `--site-ease` (general),
`--site-ease-out` (arrivals, expo-out) and `--site-spring` (a small overshoot for hover
pops); `--site-pad` (the gutter, once); `--site-shell` (the one measure); `--site-gap` (the
space between two tiles, everywhere), `--head-h` (what a sticky element clears under the
header), `--sec-size` and `--sec-gap` (a section title's size and the space between a head
and its content), and radii by rank - `--site-radius` 10px for a small control, `--site-radius-inner`
14px for a block inside a tile, `--site-radius-card` 22px for a tile, `--site-radius-stage`
32px for a stage (the hero, a game's stage), and `--site-radius-pill`.

---

## 2. One measure for every page

```css
.shell {
  padding-inline: var(--site-pad);                 /* clamp(1rem, 4vw, 3rem) */
  max-width: calc(var(--site-shell) + 2 * var(--site-pad));   /* 80rem + gutter */
}
```

Every section, every page head, the header capsule and the footer sit on `.shell`, so
every left edge on the site is the header's left edge. The gutter is added **outside** the
measure, so changing it never changes the measure.

⚠️ **It was a family of six widths** - 68, 72 and 75rem - on the argument that a rhythm of
edges reads better than one long trough. It read as misalignment instead: the hero, Skills
and About started at three different x positions on one screen. There is no `width` prop
on [Section.astro](../src/components/Section.astro) and no `.shell-*` class any more; do
not add either back.

⚠️ **A text block never stops halfway across its container.** There is no reading-measure
class: a paragraph runs the full width of its tile, or sits in real columns
(`.prose-columns`), or its tile is sized so the text fills it. A 38rem column in an 80rem
shell leaves the right half of the screen empty, and Vuk rejects the page for it.

---

## 3. Sections, tiles, and the bento

### `Section.astro` is one shape

A section is a heading, then content.
[Section.astro](../src/components/Section.astro) takes `id`, `label`, `tone` (`base`,
`band` or `panel`), `space` (`full` or `lite`) and `class` (for a page area's stylesheet
to compose the section - Projects is `theater`), plus an optional `aside` slot beside the
heading - today only the link out to the project index.

The heading is `.sec-label`, rising into a mask as the section arrives (§5), at
`--sec-size`. Four head shapes and a sticky label column were built and thrown out long
ago - they spent 12rem of every measure on a caption.

### The trace

Where a section has something beside its title - the `aside` slot, today only All
projects beside "Projects" - the **trace** runs from the title into it: `.sec-trace-line`,
the request diagram's connector, a 2px accent line along the title's baseline (0.2 of
`--sec-size` above the foot of its box) ending in a clip-path arrowhead pointed at the
link. Section.astro renders it only when the slot is filled, and sets `data-aside` on
`.sec-head`. It is drawn left to right as the head scrolls in (§5).

- ⚠️ **Nowhere else.** It ran out of every title once, turned down at the edge of the
  measure and landed on the corner of the section's first tile. Vuk asked twice what it
  pointed at, and the answer was nothing: the corner of a box is not a destination. A line
  on this site is drawn only where it goes somewhere a reader can name.
- ⚠️ **`--sec-size` and `--sec-gap` are on `:root`, not on the head.** The head and the
  content are siblings and both read them. Declared on the head, the content's
  `margin-top` resolved to nothing.
- **On a phone** a two-line title left the trace a sliver beside its last line, so there the
  title takes a row of its own and the line and the link share the row under it.

**`tone`** is spent where a scene needs it, never in alternating bands: on the homepage
`panel` on Projects (the stage, on `--site-stage`) and on Contact, and on a project page `band`
on the diagram and the features and `panel` on the takeaway. Every game page ends on
`panel` for its build notes.

Section padding is `clamp(2.5rem, 5vw, 4.25rem)`. ⚠️ At 130-200px between sections the page
read as a CV, which is the one look Vuk rejects outright, so it stays under 4.5rem.

### The tile is the unit

```css
.card        /* white, hairline edge, 22px radius, --card-pad, no shadow at rest */
.card-hover  /* only where the whole tile is a link: lifts 4px, accent edge, lift shadow */
.inset       /* a block inside a tile, back towards the ground, 14px radius */
.tile-label  /* the caption at the top of a tile: an icon square and a few words */
.tile-icon   /* the 2rem square the icon sits in, tinted with the accent */
```

`.card` is an object on the page: a service, a role, a skill group, a project, a channel, a
node of the diagram, a game, a how-to-play list. `--card-pad` is named so a block inside can
cancel it and bleed to the edges (a game thumbnail does).

**Text that is only text is not put in a tile.** The About statement, a project's overview
and its dataset write-up stand on the ground at their own size - a statement across the
measure, a lead beside a note on a trace, running columns - because a box round a
paragraph made it one more card to read past. What stays a tile is something a reader can
pick up.

⚠️ **A tile label is sentence case.** Tracked-out capitals over every block is the label
style every generated page reaches for, and none is left anywhere on the site - not on the
diagram's captions, the games' figures or the status marks.

### The bento

```css
.bento   /* 1 column, then 6 from 40rem, then 12 from 64rem, gap --site-gap */
```

A tile places itself with Tailwind's `sm:col-span-*` and `lg:col-span-*`, which land on the
same 40rem and 64rem the columns change at. **Every row a section sets has to add up to the
full count** - a row that stops short leaves exactly the empty cell this layout exists to
avoid. A section with a composition of its own (Skills, Services, the games wall) writes
its grid in its page file instead.

⚠️ **A grid of tiles stretches to the tallest of them, and that is a trap.** Skills was a
card per group once, and Backend's five entries set the height, so Data's two came out as
a box with 200 points of nothing. The fixes used on the site, in order of preference:

1. **Size the tiles by what they hold** - Skills gives each group exactly its marks:
   Backend three wide, Frontend and Data one, all two rows tall, so the three come out
   level with nothing stretched (§10).
2. **Share rows through a subgrid**, so the content inside tiles of different heights
   starts on one line - Skills does this for its group names, one of which wraps.
3. **Rows inside one tile** rather than a tile per item - how to play on every game page.
4. **Centre a short column on a tall one** - a role's name beside its bullets.

### Clickable tiles

`.stretch` on a tile's title link paints a pseudo-element over the whole tile, so a click
anywhere on it navigates **while the accessible name stays the title alone**.

⚠️ **Anything that must stay clickable inside a stretched tile needs `.above`** - an
outbound Live or Source link, for instance - or the pseudo-element covers it.

### Small objects

| Class | What it is |
|---|---|
| `.chip` | a technology name with its mark. On hover its edge takes the brand's colour |
| `.mark-tile` | a technology as a square: the mark at 36px, its name under it. The hero's tray, Skills, a project's stack, the diagram's nodes |
| `.tag` | a year or a short label, with no mark or a small one |
| `.pill-status` | Live or Beta, sentence case, with a dot. Beta is filled with the accent, Live stays quiet with the signal for its dot |
| `.page-status` | the same word inside a page title's `<h1>`, so "Accretion, Beta" is read as the whole claim |
| `.cta` | the filled accent pill. On hover a deeper fill sweeps in from the left under the words (a `background-size`) and it rises, rather than hollowing out |
| `.cta-ghost` | the same pill outlined, for the secondary action beside it |
| `.link` | an inline text link: a faint rule always, a solid one drawn across from the left on hover |

⚠️ **A mark tile carries `--brand` on itself, not only on its icon.** That is why it is a
component, [MarkTile.astro](../src/components/MarkTile.astro): its hover tints the whole
tile in the mark's own colour, and a style on the icon cannot reach its parent. The
declaration comes from `brandStyle(name)` in [tech.ts](../src/tech.ts), which TechIcon
uses as well, so the `light-dark()` pair is written once.

⚠️ **No arrow is appended to link text anywhere.** A leading icon is fine - the mail icon
on Contact me, the back arrow on a crumb - and the trailing arrows the old page carried
("All projects →", "Back to top ↑") were a generated-page tell.

---

## 4. Type: one family, two axes

`@fontsource-variable/archivo/wdth.css` - the **width** build, 62-125%, at 90 KB latin
against 35 KB for weight alone.

⚠️ **The display/text contrast on this site is width, not a second typeface.** Headings
run expanded and heavy (114-125%, 640-800), text runs at normal width. That is what the
extra 55 KB buys. Do not add a second family.

⚠️ **The Latin face is preloaded** from [Base.astro](../src/layouts/Base.astro), imported
with `?url` so it goes through the same asset pipeline as the fontsource `@font-face` and
is the same hashed file - a hit, not a second download. Without it the first screen painted
in the fallback face and reflowed when Archivo arrived: a mobile Lighthouse run on the
build measured first paint at 1.8s and a 0.025 layout shift on the project pages' meta
tiles, and with it 1.2s and 0. Only the Latin face: latin-ext is 85 KB more, carries a
handful of letters (the ć in the name among them), and preloading both put two fonts ahead
of the portrait on a slow phone. The 404's digits go to the other end of the
same axis, 62% at weight 900, because an expanded 4 is too wide for a portrait tile.

Body copy is 16px on a phone and **17px from 48rem**, at 1.6 line-height. Both ends have
been tried: 16px everywhere read as everything too small, 18px as everything too big.

**A tile is read by its title.** The detail under a tile's title - a feature, a step, a
service, a role's points, the About notes, a card's description - is 16px at 1.55 in the
muted ink, a step under the page's text, while the title is 112% wide at weight 660. A row
of tiles reads as its titles, and the detail is there for whoever stops on one. The leads
and the display sizes above were taken down by about a sixth, and the card padding is
`clamp(1.125rem, 1.9vw, 1.75rem)`: at their full size every page read as too big. `text-wrap: balance` on `h1`-`h4`,
`text-wrap: pretty` on `p`, tabular figures wherever numbers sit in columns.

| Role | Size | Set by |
|---|---|---|
| the hero's name, the masthead | 12.45cqi of the stage on one line, 17.7cqi on two on a phone | `.hero-name` in home.css |
| a page title | clamp(2.625rem, 6.6vw, 5.5rem), 122%, 740 | `.page-title` |
| a section heading | `--sec-size`, clamp(2.375rem, 5vw, 4.25rem), 122%, 720 | `.sec-label` |
| a project's title on its card | clamp(1.875rem, 3.1vw, 2.875rem), 120% | `.case-title` in project.css |
| the About statement | clamp(1.625rem, 3.4vw, 3rem), 106%, 540 | `.about-lead` in home.css |
| a large tile title | clamp(1.375rem, 2vw, 1.75rem), 114% | per rule (`.role-company`, `.game-card-title`, a service's name a size up) |
| a tile title | clamp(1.1875rem, 1.45vw, 1.3125rem), 112%, 660 | `.svc-title` and per rule |
| a lead | clamp(1.125rem, 1.6vw, 1.375rem) | `.page-lead`, and `.hero-lead` a step over, to 1.5rem |
| a tile's detail | 1rem at 1.55, muted | `.proj-text`, `.svc-body`, `.about-body` and per rule |

### The name is the masthead, sized by the stage

⚠️ **`.hero-name` is sized in `cqi` of `.hero-stage`, not by a viewport clamp.** From 40rem
the two words share one line across the whole stage, the masthead: "Vuk Cvetković" at 122%
stretch, weight 740 and -0.05em tracking, with the 0.24em gap between the two masks,
measures 7.79 times its font size, so 12.45cqi sets it at 97% of the stage - 147px at 1440.
On a phone the words stack and "Cvetković" alone measures 5.46 times its size, so 17.7cqi.
Both ratios were measured in Chrome with a range over each word. Change the stretch, the
weight or the tracking and they have to be measured again. The 3% is for other engines'
rounding: the words rise into masks, and a mask clips what overhangs.

The two words are split off `site.name` in [Hero.astro](../src/components/Hero.astro), so
the name is still stated in one place and stays one `<h1>`, each rising into its own mask a
beat apart. Leading is 0.86 because "Cvetković" carries a `ć` whose accent meets the line
above any tighter, and the masks get 0.14em of extra room at the top for the same accent.

⚠️ **The width axis is set, never animated.** A heading whose `font-stretch` changed on
scroll or on load reflows its line, and every glyph after the first moves: that counts as a
layout shift on every frame it runs. Everything that moves on this site moves by
`translate`, `scale`, `rotate`, `clip-path`, colour or opacity, and the pages measure a CLS
of 0 on load at 1440 and 390.

The footer's name uses the same method: `12.3cqi` of the shell, because "Vuk Cvetković" at
125% and weight 800 measures 8.06 times its font size.

⚠️ **Titles hyphenate.** `.page-title` and `.sec-label` carry `hyphens: auto` and
`overflow-wrap: break-word`, because German compounds at display size overhang a phone.
The request diagram is the exception: in its wide arrangement every title word fits its
column whole and a browser hyphenates greedily ("One dedupli-cated database"), so there it
is `manual`.

⚠️ **The email address is 1.25rem, flat.** It has been set at 2.875rem, 2.25rem and
1.75rem and every one of them was too big: an address is a thing you read, copy and type,
and past this size it stops looking like one. Contact gives the scale to the intro and the
button beside it instead.

**The one other register is the platform's monospace**, for a diagram service's badge
("Ultralytics YOLOv8m", "Written by hand, 20 rounds"). It loads nothing, which is why it
does not break the rule above. A web font here would.

---

## 5. Motion

All of it is CSS, and it is meant to be seen: things rise 48px and scale up from 96%,
headings rise into masks, tiles lift 4px under the pointer, marks jump, packets run through
the request diagrams. A per-section reveal was built and removed twice on the grounds that
an entrance on every section is a generated-page default, and that was the wrong call - it
is what Vuk asked for, several times.

The only script that touches motion anywhere is a game's, and nothing on any other page
draws with script. The system has two halves, chosen by one question: **is the element in
view at first paint?**

| | `.enter`, `.enter-line` | `.reveal`, `.reveal-item`, `.reveal-line` |
|---|---|---|
| Driven by | time | scroll position, `animation-timeline: view()` |
| Ordered by | `--enter-delay`, set inline per element | `animation-range`, stepped by `nth-child` |
| Used by | the hero, every page head, the 404 | every section below the fold |

**Why the split:** the hero is in view at first paint, and a `view()` timeline there would
sit at 100% and never animate.

- `.enter` rises 32px and fades in over 900ms on `--site-ease-out`.
- `.enter-line` and `.reveal-line` are a heading line rising into a mask: the outer
  `.line-mask` clips, the inner `.line-in` rises from 105% with a 2.5° skew, which is what
  makes it read as the line being lifted rather than slid. Both halves are `display: block`
  so a heading that wraps is revealed as one block.
- The hero adds its own beats in home.css: the whole portrait, in colour, pulls back into
  its frame out of a 1.22 zoom and a 14px blur, the tray's marks land one after another
  with an overshoot, and once the last is down **a signal runs through them** in the order
  they sit, lighting each one's edge and ground with the accent for a moment - the stack
  read as a path (`tray-lit`, fill `none`, so a held last frame cannot outrank the hover's
  tint). The dot before "Software engineer" is the signal colour and sends a ring out every
  2.4s. So does the current role's period.
- **The hero steps back as the page leaves it, in three depths.** The stage scales to 0.88
  from its foot, the portrait's frame to 0.84 and rises 2.5rem, and the masthead drifts up
  3.5rem and fades to 35%, so the three read as layers going away. All run linear on the
  stage's own `--hero` view timeline over `exit-crossing` - from its top reaching the top of
  the screen to its foot reaching it - so nothing moves before the reader scrolls. On the
  frame, not the photograph, which already carries the entrance's zoom and the hover's.
  ⚠️ **From 60rem only**, where the stage fits the screen. Stacked it is one and a half
  screens tall on a phone, its exit starts after 89px of scroll, and the portrait and the
  tray shrank while they were still being read.

⚠️ **Every keyframe moves with `translate`, `scale` and `rotate`, never `transform`.** An
animation beats a normal declaration in the cascade, and `fill-mode: both` holds the last
frame for as long as the page is open, so a `transform` in a reveal would hold at `none` and
eat every hover lift on the site - which is written as `transform`. The individual
properties compose with it instead. The same rule runs through every game file and
flow.css.

⚠️ **Stagger on a scroll timeline is `animation-range`, not `animation-delay`** -
`animation-delay` has no meaning on a scroll timeline. `.reveal-item` steps its start by
20px a child and flattens at `nth-child(n+4)`, so it goes on the direct children of a grid.
Wrapping the items resets the count.

### Why every range is `cover`, in pixels

**`cover`, not `entry`.** `entry` is measured in the *element's own height*, so a chip
34px tall started and finished its reveal inside 34 pixels of scrolling, at the very bottom
edge of the screen. `cover` spans the element's height **plus the viewport's**, so a short
tile gets a screen's worth of runway.

**Pixels, not percentages.** A percentage of `cover` grows with the viewport while the
page below an element is a fixed pixel quantity, so a range that finishes on a laptop runs
out of page on a tall monitor.

### The budget

An element's reachable travel is **`document height - its own offset top`**: once its top
crosses the bottom of the screen, that is every pixel of scrolling it will ever get. A
range that ends past it does not fail loudly - the element stops part way and stays there
for as long as the page is open.

The footer is a full block now, at least 480px of ink under the last section of any page,
so the tightest reveal on the site has well over 500px of runway (it had 159 when the footer
was one line). Ranges end by `cover 300px` for the traces and `cover 290px` for the reveals. To check a
candidate, scroll a page to the bottom and read `getComputedStyle` on the last `.reveal`:
`opacity` below 1 or a `translate` that is not `none` is the bug.

⚠️ **The footer's own name is the exception.** It is flush with the page's bottom edge, so
its whole runway is its own height - 40px on a phone. It reveals on `entry 0% entry 100%`,
which ends exactly when the name is fully on screen, which is the bottom of the scroll. A
`cover` range there parks it half risen.

### The trace, the statement and the deck

Three scroll-driven moments carry most of the homepage, all paint or compositing only:

- **The trace draws itself** into All projects. `.sec-trace-line` runs `trace-draw` on its own `view()` over
  `cover 60px` to `cover 300px`: a `polygon()` clip that uncovers the line from its start to
  its head. The polygon reaches 2rem past the box on every side, because the head hangs half
  its width outside the line's box and a clip at the box's edge shaved it. The standard
  curve, so the line's front tracks the thumb.
- **The About statement is said as it is read.** It is split into words at build
  ([About.astro](../src/components/About.astro)), each carrying `--p`, how far through the
  sentence it is. The paragraph is a named view timeline (`--statement`) and every word runs
  `word-ink` - from 44% of the ink to the ink - over a window a sixteenth of the timeline
  wide that starts `--p` of the way along, so the front moves through the sentence word by
  word in reading order. ⚠️ **This one range is in percentages of `cover`, on purpose**: the
  statement is the second thing on the page with thousands of pixels under it, so the budget
  cannot bite, and a percentage is what finishes the sentence at the same point of the
  screen on any height (its top about a fifth of the way down). ⚠️ **The first state is
  measured.** The statement is below the fold on load, so Lighthouse reads every word before
  the page reaches it, and each has to clear 3:1, the floor for text this size, on its own.
  44% of the ink is 3.3:1 on both grounds. A fainter start fails the statement word by word
  and costs Accessibility its colour-contrast audit.
- **The project deck stacks.** See §10. Each card's step back runs on the *next* card's view
  timeline - named per card, shared through `timeline-scope` on `.deck` - over the cover
  alone: from that card's top reaching this one's foot, `cover max(2rem, 100svh -
  var(--stick) - 40rem)`, to it reaching where it sticks, `cover calc(100svh - var(--stick)
  - 0.875rem)`. ⚠️ Started at the next card's top entering the screen, it ran while the card
  was still on its way up on any screen taller than a card, so a project stepped back
  before it had arrived. `scale` on the card
  and `opacity` on a layer of the stage's colour over it, so the drawings keep running under
  the dimming at no cost.

**Pages change scene.** `::view-transition-old(root)` sinks 12px and fades over 240ms, the
new page rises 16px into place over 380ms on the ease-out, and the named titles and boards
still fly over both (below).

### The header and Back to top

The capsule's padding settles as the page scrolls: `head-settle` animates `--head-pad` on a
`scroll(root)` timeline over the first 8rem.

**A reading gauge runs along its floor**: `.head-progress`, a 2px accent line inset from the
capsule's round ends, scaled from 0 to 1 across the whole scroll on `scroll(root)`. It is
outside the motion guard - it reports a position rather than decorating one, and with less
motion asked for it is still a bar that grows - and it is `display: none` where scroll
timelines are missing, so a browser without them shows no gauge rather than a full one.

1. ⚠️ **`--head-pad` must stay `@property`-registered** (`<length>`, initial `0.45rem`),
   because an unregistered custom property jumps at the midpoint instead of interpolating.
2. ⚠️ **Its fallback in `.head-capsule` is load-bearing.** The keyframes are the only thing
   that ever sets it, so where the animation does not run the property is unset, and
   `var(--head-pad, 0.45rem)` is what keeps the capsule from collapsing.

`.to-top` is the other `scroll(root)` animation: out for the first half screen, in over the
next third of one. It is written inside the footer so the panel palette makes it an ink
circle, and it is `position: fixed`, so it floats for the whole scroll. It is the arrow
alone at every width, with the name in `aria-label`: as a labelled pill it covered the
right edge of the tiles. From about 1400px it sits in the gutter
(`right: max(0.9rem, (100vw - --site-shell) / 2 - 3.9rem)`), where it covers nothing.
⚠️ **Every page hides it below 64rem** (global.css): the gutter there is too narrow to hold
it, and it sat over the About statement, the project cards and the services on a phone,
and over the board on a game page.

⚠️ **`visibility` is in `to-top-in`.** `opacity: 0` alone still takes a tap, so the hidden
button would be a dead spot in the corner of the hero.

### Hover

Tiles lift 4px on `--site-ease-out`. Marks jump and turn on `--site-spring`, icons in their
squares turn a few degrees, the crumb's arrow leans back, a footer link slides in behind a
trace that draws in ahead of it, a service's row draws a trace down its left edge and fills
its icon, a button's darker fill sweeps in from the left, a game card leans a degree and
glows in its game's colour, a school's crest turns, the portrait zooms 4% inside its frame.
Nothing reflows: every hover is a transform, a colour or a `background-size`.

### Degradation

**Nothing is hidden by default.** Every scroll reveal is defined only inside
`@media (prefers-reduced-motion: no-preference)` and `@supports (animation-timeline:
view())`, and there is no base `opacity: 0` anywhere - a browser without scroll-driven
animations simply shows the content, and so does a reader who asked for less motion.

Under `prefers-reduced-motion: reduce`, durations collapse to `0.01ms` and
`scroll-behavior` goes to `auto`. The view-transition pseudo-elements are named explicitly,
because `*` does not reach them.

`@view-transition { navigation: auto }` makes moving between pages, and switching language,
read as one site changing scene rather than a reload. Cross-document, so Chrome, and Safari
from 18.2. Firefox navigates as it always has.

### A card opens into its page

A project or a game keeps its name across the click that opens it: the card's title grows
into the page's title, and a game card's picture into the board. Each pair shares a
`view-transition-name` written inline from the slug - `project-<slug>-title`,
`game-<slug>-title`, `game-<slug>-board` - and a `view-transition-class` (`title` or
`board`), which the rules at the foot of global.css style. The same pairs carry the way
back and a language switch, where the title changes words in place.

- ⚠️ **A name may appear once per page.** Two, and the browser drops the whole transition,
  not just that pair. A page that ever lists the same project twice needs one of the two
  unnamed.
- ⚠️ **A name goes on a box that is never split across lines** - the heading, not the link
  inside it, which wraps. A fragmented named box also drops the transition.
- **The page title's named box is its `.line-in`**, the line that rises into its mask. The
  group follows it as it rises, so the title flies onto the rising line and lands with it,
  and the mask takes over once the line is all but home.
- **A title scales by its height, not its width.** Neither heading hugs its words - the
  card's is as wide as the card, the page's as wide as the shell - but their heights are
  their lines, so on the same line breaks the words grow by exactly the ratio of the two
  sizes.
- **600ms on the standard ease, and the swap from the card's rendering to the page's is
  over in 180ms**, while the pair is still near the card's size. On the entrance's ease-out
  the pair covered most of the way at once and the words showed twice at full size.
- **The board lands at 750ms.** The game's stage rises in from 0 opacity 240ms after load,
  and that fade is not part of the board's picture: at 600ms the stage was at 94%, and a
  dark board like Accretion's lightened for a frame when the flight ended.
- **A name with no partner** - the other cards' titles, on the way out - leaves at the
  page's own 250ms (`:only-child`), rather than hanging over the new page for a flight.
- **Not the request diagram.** The page's diagram starts 809 to 978px down, below the fold
  at 1280x800, 1440x900 and on a phone, and it assembles as it scrolls in, so the card's
  small one would have flown off the screen into an empty frame.

### The theme spreads from the toggle

Changing theme uncovers the new one as a circle growing from the sun or moon button to the
farthest corner, over 650ms on the standard ease. [ThemeToggle.astro](../src/components/ThemeToggle.astro)
runs its flip inside a same-document view transition, marks the root with
`data-theme-flip` while it runs, and writes the button's centre and the radius as
`--flip-x`, `--flip-y` and `--flip-r`. The `theme-flip` rules in global.css leave the old
page whole underneath and clip the new one to the circle.

- ⚠️ **Every other `view-transition-name` is dropped while it runs.** A card's title or a
  board is a layer of its own in a transition, above the page, so it changed theme all at
  once while the circle was still on its way.
- Without `startViewTransition`, or with reduced motion asked for, the theme simply
  changes. Firefox is the case today.
- It is the one change to the site's script budget since the redesign: the toggle's block
  grew by about half a kilobyte, and it is still inline.

---

## 6. The request diagram

[ArchitectureDiagram.astro](../src/components/ArchitectureDiagram.astro) draws one request
through a project, and it is the opening image of a project page, because **the shape is
the argument**: a run reaches a single address, fans out into services that do not know
about each other, and gathers back into one answer.

It is HTML and CSS: real tiles, real chips and mark tiles, native text wrapping in four
languages, and connectors that are borders. Every colour in it is `--site-accent`, so on a
project page it is drawn in the project's hue (`data-hue`, §1), and so is its miniature on
the project's card. The rules are [flow.css](../src/styles/flow.css),
imported by the component, so they are inlined into the project pages alone. An SVG composition with a per-character
width estimator was here before, and it had to guess how wide "Ein Ordner, rekursiv in
Bytes gelesen" would set; the browser now wraps it.

### What it reads

The component takes `lang` and `project`. The copy is `projects.items.<id>.flow` and
`projects.flowCaptions` in the dictionaries; the topology is `flowShape`, and the
technology each node runs on is `flowTech`, both in [site.ts](../src/site.ts):

```ts
flowTech: { entry: TechName[]; core: TechName[]; branches: TechName[][]; exit: TechName[] }
```

An empty list is a real answer: the node runs on nothing and shows no marks. ⚠️ **The
component throws at build** if `branches` has a different length from the dictionary's
`flow.branches`, or if a name is missing from that project's `stack` - the diagram may only
show what the project page's stack lists.

⚠️ **The shape is fixed**, and it is the one all four projects share: an entry, a core, a
lane of two or three parallel services, then either an exit (`pipeline`) or back to the
entry (`roundTrip`). A fifth project with another shape means extending the component
deliberately, not feeding it different data.

### The cards

| Node | Surface |
|---|---|
| entry and exit | the terminals: a tile tinted with the accent under an accent edge |
| core | the ink `.panel`, the strongest object in the drawing. In dark mode, where the panel is lifted rather than black, it takes an accent edge at 55% so it does not read weaker than the terminals |
| services | white tiles inside a recessed lane captioned "In parallel" |

Every card shows its caption (a `.tile-label` with a role icon, sentence case), its title,
its marks, its badge in the platform monospace, and the exit's note as a footnote with an
icon. A single mark lies down beside its name; a pair stands side by side sharing the
card's width.

### One markup, two arrangements

`.flow-stage` is the query container, and from `@container flow (min-width: 60rem)` -
about a 1105px window - the diagram is **one grid row**. Below that it is **a vertical
spine**: the request runs down the left edge and the answer or the output down the right.

Wide columns are fractions tuned so that no mark name, title or chip overflows in any of
the four languages at 1106, 1140, 1200, 1280 and 1440, each scanned programmatically.
Pipeline: entry 1fr, core 1.15fr, lane 1.5fr, exit 1.2fr, with gap columns between. A round
trip gives the gap between entry and core `clamp(13rem, 18cqi, 15.5rem)`, because it holds
both payload labels and "multipart/form-data" has to fit unbroken.

### Connectors are borders

⚠️ **Every connector is a CSS border, never a filled box.** A straight line is a box with
one 2px side, and a branch is a box with two or three sides and one rounded corner.
Arrowheads are `clip-path` triangles.

⚠️ **A packet runs its line's own outline, by `offset-path`.** A branch's path is
`inset(1px round …)`, the middle of its border round the border's own corner, and
`--pk-from` / `--pk-to` pick the stretch that is the line, written from the branch's own
size (each line is a `container-type: size`, so `100cqi` and `100cqb` are its width and
height) and `--rm`, the corner's radius at the middle of the border. A straight line is a
two-point `polygon()`, run 0% to 50%. So the dot turns every corner on the curve at one
speed: a `translate` between the corner points cut across each curve and, eased per
keyframe, stopped dead at every corner. ⚠️ Not `inset()` for a straight line: a box with
no width is an outline of no area, and WebKit moves nothing along it.

⚠️ **Everything leaves and lands on one axis**, the middle of the service stack. On a
pipeline the lane's caption pushes the stack down, so the axis is half a caption below the
row's middle and node cards take `margin-top: var(--cap)` to centre on it. A round trip
keeps a channel exactly one caption tall under its lane, which puts the axis back on the
row's middle.

⚠️ **`grid-auto-rows: 1fr` on `.flow-stack` is load-bearing.** Every branch finds the
stack's middle from inside its own service, through a pitch and the service's index written
inline - which is only true when every service is the same height. A service stretched to
its neighbour's height keeps its content together in the middle (`align-content: center`).

⚠️ **Wide node cards span their whole column** and are centred at their natural height, so
a line in a gap column ends exactly on a card's edge without knowing the card's height.
Stretched to the row, they left the caption at the top, the title at the foot and a hole
between.

⚠️ **The round trip's way back runs behind the core.** `.flow-back` is an absolutely
positioned child of the grid placed on the core's grid area, so the core's area is its
containing block: it runs from the channel under the lane up into the core's floor, and the
upward arrowhead belongs to the core, because only the core knows where its floor is.

**A payload rides beside its line**, in Archivo on a borderless plate that masks the dot
grid, led by a small copy of the packet so it reads as what the dots carry. French gets a
non-breaking space before `:` and `;` from `keep()` in the component, so a narrow tile never
starts a line with a lone colon; the dictionary text is untouched.

### The motion

**It assembles as it scrolls into view.** In the row the whole stage is one named view
timeline and every element takes a step of it, so everything is done by about `entry 96%` -
the diagram is finished the moment its foot is on screen. ⚠️ The old SVG version finished
late and left a reader who stopped scrolling looking at a half-drawn diagram; measured
now, no animation is unfinished with the stage's foot at the viewport bottom, for all four
projects in German at 1440x900, 1280x800 and 1106x760. On the spine each element runs its own
`view()`, because one timeline would hold the top tiles back until the foot of a phone-tall
stage arrived. Tiles rise and scale from 96%, lines draw from their start by `clip-path`,
the lane opens, labels fade.

**Then a request runs through it, on a loop.** Packets - 12px accent dots with a soft ring,
not a glow - travel entry to core, fan out into every service at once, and go on to the
exit or back through the core to the entry, and each tile lights with a ring as its packet
arrives. One cycle per shape (6s for a round trip, 4.8s for a pipeline); each line starts
at its own fraction of it, written inline from a story table in the component. ⚠️ Each
start is the previous line's start plus its window, so changing one means moving the rest.

A run from one tile to the next is often several lines - the trunk out of the core and a
branch into a service, or a service's answer, the channel and the back leg - so the
keyframes are named for the part a line plays, not its direction: `solo` tile to tile,
`depart` from a tile to a join (it gathers speed, then runs on), `arrive` from a join to a
tile (it runs on, then settles), `settle` and `gather` for the middle service of three,
whose line runs straight on from the trunk, and `channel` and `back` join to join. ⚠️ **At
a join the packet neither fades nor slows**: the one arriving is whole until its window
closes and the next is whole from the instant its own opens, at the same point. Eased to
a stop and faded there, the two read as a dot that stalled, blinked out and started
again. The windows are split by the lines' typical lengths so the speed carries across -
4% of the cycle for a trunk and 14% for a branch, 9.5%, 13.5% and 9.5% for the row's way
back - and a round trip's core lights as the packet passes under its floor, at 0.63 of
the cycle, before the back leg's window closes under the tile. Sampled every 5ms in
Chrome and WebKit, every hand-over on all four projects at 390, 820, 1106, 1280 and 1440
happens at one instant and within 2px, and every half millisecond across a join, Chrome,
WebKit and Firefox all overlap the two packets by under a millisecond, never showing
neither.

Both halves sit behind `prefers-reduced-motion: no-preference`, the packets also behind
`@supports (offset-path: inset(0))`, and the assembly behind
`@supports (animation-timeline: view())`, so without either the diagram is simply
there, finished.

### The card thumbnail

[FlowMini.astro](../src/components/FlowMini.astro) draws each project card's picture as a
miniature of the page's diagram, built the same way - HTML tiles and 2px border connectors
rather than a scaled drawing - so every node carries its title from the dictionary in the
reader's language, and is as tall as its words need. Its rules are in its own scoped
`<style>`. It takes `project`, `lang`, `loop` (`hover`, `always` or `off`) and `class`.

- **Two arrangements, chosen by `@container fm (min-width: 30rem)`**: a vertical spine below
  30rem, which is a case on a phone, and left to right from 30rem, which is every case from
  a tablet up - stacked there, the drawing has the card's whole width, and beside the words
  from 64rem it has 7 of 12. ⚠️ That 5 : 7 split is what gives the drawing its 30rem at a
  1024 window. A wider text side drops it to the spine.
- **Each node shows its title and its `flowTech` marks as icons.** A round trip writes its
  `entryLabel` and `exitLabel` beside its two lines; a service's badge appears only left to
  right; captions and the exit note stay on the page. Titles never set below 12px, labels
  and badges never below 11px, and node titles are not hyphenated left to right, for the
  page's reason. A zero-width break after "/" lets `multipart/form-data` wrap only when
  its column is too narrow.
- **Arrows are the page's**: accent lines with heads whose tips touch the tile they enter,
  entry to core, a fan into each service, then gathered into the exit, or down a rail into a
  channel under the lane and back up into the core on the round trip. ⚠️ The core does not
  lift on hover any more: it would pull away from the heads that touch it.
- **The picture is sized by its content, never by an aspect ratio.** A case stretches it to
  the height of the words beside it (`.case-flow`) with the drawing centred on its ground,
  and in the deck, where the cards are one height, to the card's.
- **The packets reuse the page's story** - its timings and its two cycles - always on the
  first case and on hover or focus on the others, behind
  `prefers-reduced-motion: no-preference`. The picture is `aria-hidden`: the card's words
  carry its meaning.

### Accessibility

The stage is `aria-hidden`. The run is announced from an `sr-only` ordered list in the
order the request takes it: the entry, its payload, the core, the lane as one item with the
services nested under it, then the answer's payload or the exit with its note. Each line is
the caption, the title, then the badge and marks.

---

## 7. The active-section indicator, and the site's script budget

Every page but the seven games ships **no JavaScript file**. Five inline blocks cover the
pre-paint theme script, the theme toggle, the dismissal of every disclosure, this, and the
command menu.

### The command menu

⌘K or Ctrl+K on any page, the Search button in the header from lg, or the first row of the
phone menu opens [CommandPalette.astro](../src/components/CommandPalette.astro): a native
modal `<dialog>` near the top of the screen with a field and the options in groups - the
homepage's sections, the projects, the games, the page in the other languages, and the
actions (the theme, through the header's own toggle so it still spreads from its button;
copying the email, which says so on the row; LinkedIn and GitHub). Every option is rendered
at build in the page's language, so the script only filters (case and accents ignored),
moves with the arrows and acts on Enter or a click. ⚠️ **It stops every key at the dialog**,
or a game listening on the window - 2048, the cube, Accretion - would move its board while
the reader moves through the list. The key hint reads ⌘K on a Mac and Ctrl K elsewhere.

A nav link cannot be styled from the section it points at: the two are in different
subtrees, and `:target` only knows what was clicked, not what is on screen. So the second
block in [Base.astro](../src/layouts/Base.astro) is an `IntersectionObserver` over a band
from 28% to 45% down the viewport, which sets `aria-current="location"` on every link
carrying the matching `data-section-link`.

- **The state is announced as well as drawn.** `.nav-link[aria-current='location']` fills
  the label's pill with the accent; `.nav-row` (the phone menu) takes a tinted row instead.
- **It runs on every page and observes nothing where the sections do not exist.** The nav
  hrefs are absolute (`/#about`), so on a project page `getElementById` returns null.
- **Off the homepage the header still says where the reader is, with no script.**
  [Nav.astro](../src/components/Nav.astro) reads the path at build: under `/projects/`
  the Projects link carries `aria-current="true"`, under `/games/` the Games pill and the
  phone menu's Games row carry it (`page` on the games index itself, the page they open).
  `true` is drawn the same as `location`, and the Games pill fills with the accent. ⚠️
  This holds only because the observer finds none of the homepage's sections there and so
  never clears it: a page that gains an element with one of their ids would have it
  cleared.

### The header

The header is a transparent sticky strip and what is drawn is the ink capsule inside it,
on the shell's measure. The strip takes no clicks and the capsule takes them back, so the
ground either side of it is still the page under it. The wordmark is Vuk's own V mark -
`/apple-touch-icon.png`, the file the favicon set already ships - beside his name.

- ⚠️ **Between 64rem and 80rem the name is clipped to the accessible name only**, and the
  mark stands alone: with the six section links in the capsule, the German rail ran over
  "Vuk Cvetković" at 1024.
- **Below lg the capsule holds the wordmark, the theme and the menu**, and nothing else
  fits beside the name at 360px. The language switcher moves into the menu as a row of the
  four autonyms, and the Games link as the menu's last row.
- ⚠️ **The menu and the language switcher are both `details[data-menu]`**, so a script that
  opens "the menu" with `querySelector` gets the switcher, which is `display: none` below
  lg. Take the last one.

---

## 8. Theming is class-based, except for two tags

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Dark mode is a **class on `<html>`**, not `prefers-color-scheme`, so the toggle can win.
Three pieces cooperate:

1. The `is:inline` script in [Base.astro](../src/layouts/Base.astro) sets the class before
   first paint, from `localStorage` or else `prefers-color-scheme`. It must stay inline or
   it flashes.
2. [ThemeToggle.astro](../src/components/ThemeToggle.astro) only flips the class and writes
   `localStorage`. A storage exception is swallowed - the choice just does not persist.
3. `:root`, `.dark`, `.panel` and `.tile-cobalt` set `color-scheme`, which is what makes
   `light-dark()` pick a mark's colour for the surface it is on.

⚠️ **The `theme-color` meta tags are the exception, and the only raw hex values outside
the stylesheets.** They match `--site-bg`: the header is a capsule floating on the page
with the ground round it, so the browser chrome sits directly above the ground rather than
above ink. They duplicate the token in both themes and must be changed with it. By their
media queries they follow the system's theme, which is right until the visitor chooses one:
then the inline script (on load, from `localStorage`) and ThemeToggle.astro (on a click) set
the chosen tag's `media` to `all` and the other's to `not all`, so the bar in Chrome on a
phone and in Safari before 26 follows the page. The tags carry `data-scheme` for the scripts to find them, and sit
above the inline script in `<head>` because it runs before anything after it is parsed.

**Safari 26 ignores `theme-color`.** It paints the strip under its bottom bar, and the
bounce past either end of the page, in the page's background colour, which WebKit takes as
the `html` background with the body's laid over it. An opaque body decides it alone, so on
an iPhone the ink footer ended on a light band of ground. The body runs `canvas-ink` on a
`scroll(root)` timeline in global.css: `--site-bg` for the first 98% of the scroll, then
`--site-panel-bg` by 99%, held to the end, so the top still meets the ground and the bottom
meets the footer. The last 1% is held because a phone stops a fraction of a pixel short of
100%.

⚠️ **The ground under the sections is painted by `main`, not the body.** Otherwise the gaps
between the last tiles would turn with it. The body shows only in the header's own slot at
the top of the document, which is off screen long before the turn.

⚠️ **The animation must stay on `body`.** On `html` it changes the canvas in Chrome and
nothing in Safari, so a check in Chrome alone passes either way.

---

## 9. The game boards, and the one place the palette opens up

⚠️ **Each game's CSS is its own file**, [src/styles/games/](../src/styles/games/)`<slug>.css`:
its tokens on `:root` and `.dark`, its rules, the rules that make its board into a thumbnail,
and its keyframes. The game's component and its thumbnail import it, so it is inlined into
the game's own page, its locale twins and the games index, and into nothing else. The chrome
every game page shares - the head, the stage, the figures and buttons, how to play, the
build notes, the sound switch, the burst and the jolt - is `shared.css`, imported by each
game component after its own file, and the games index is `index.css`.

⚠️ **The rules are in a cascade layer of their own, `games`, between `components` and
`utilities`.** Astro does not promise where in a page an imported stylesheet lands: on the
cube's page and the games index a game's file comes out ahead of global.css, and on Memory's
after it. A game's rules are written to win a tie against the site's own - a game's
`.game-actions .cta-ghost` over `.cta-ghost:hover` - and a layer after `components` keeps
that true wherever the bytes fall, while `utilities` still beats both.
Every file under games/ and global.css open with the same `@layer` line, because the first
stylesheet to name the layers is the one that orders them. The move was checked by comparing
the computed style of every element and pseudo-element on every game page, the index and
the home page against a build with the rules still in global.css, on a seeded deal: nothing
differed but the phase of the animations that run on a clock.

Seven pages carry a game, and all seven are built the way the rest of the site is: markup,
tokens, and no canvas or game library anywhere. They are deliberately different from each
other, which is most of what this section is about.

| | [2048](../src/games/2048/game.ts) | [Minesweeper](../src/games/minesweeper/game.ts) | [Memory](../src/games/memory/game.ts) | [Accretion](../src/games/accretion/game.ts) | [Battleship](../src/games/battleship/game.ts) | [Cube](../src/games/cube/game.ts) | [Four in a Row](../src/games/four/game.ts) |
|---|---|---|---|---|---|---|---|
| what it is made of | 16 divs that move | up to 480 buttons that change state | up to 60 buttons that turn over | up to 46 circles that fall | 200 buttons, and 10 drawn ships over them | up to 150 stickers in a 3D scene | a drawn face with 42 holes, up to 42 discs behind it, and 7 buttons over both |
| the hard part | motion, at sixty frames | the rules, and the keyboard | the turn, and keeping three animations off each other | the solver, and making it settle | the opponent, and what it is not allowed to see | the drag: which layer a finger means, and how fast it turns under it | the opponent, and seeing far enough ahead in a third of a second |
| the board in the markup | yes, 16 cells, fixed | no, the module builds it | no, the module deals it, and a face-down card holds no picture | no, play creates every body | no, and the fleet is a layer of its own | yes, the face and the seven columns, and the module drops every disc |
| to a screen reader | hidden, narrated by a live region | a real `role="grid"` | a real `role="grid"`, and a live region for each turn | a live region, and the sequence below it | two `role="grid"`s and a live region for the turn | seven buttons named by column, and a live region for every disc and the result |
| what a turn costs | two custom properties | a class | one attribute, and a transition on `rotate` | a frame of simulation | a class, and a count over 200 placements | a transform on each sticker in the layer, every frame the layer moves | one element and one `translate` animation |
| runs when idle | no | no | no | **yes** | no | no | no |

### The chrome every game page shares

Seven games, one family. Everything around a board is [games/shared.css](../src/styles/games/shared.css),
imported by every game component after its own file:

```
.page-head.game-head       crumb row (crumb + GameStamp), line-mask .page-title, .page-lead
.game-play > .shell
  [data-game] .enter       the game's root, arriving at 240ms
    .game-stage            one stage on the game's own ground (--game-ground), at
                           --site-radius-stage, the rank of the hero's stage
      .game-hud            the figures (.game-stat) and the buttons (.game-actions)
      .game-board          the board itself
      .game-fill           optional: what uses the height the board leaves
      .game-hint           the controls, as a row with an icon
Section "How to play"      ol.card.game-steps: numbered rows inside one tile
Section "How it is built"  tone="panel": .game-notes-lead, then .prose-columns.game-notes-cols
```

**The game is the page's subject, and the layout says so.** The head is compact - a
smaller title, and from 64rem the lead beside it, the title's column `fit-content(50%)` so
"2048" leaves the lead the line and "Vier in einer Reihe" wraps rather than squeezing it -
and **`.game-stage-side` puts the board in the wide column from 64rem**: the board's column
is `minmax(0, 1fr)` on the left and the menu a narrow column of its own, `--hud-w` (about
21rem), on the right, in the areas `'board hud' 'board fill' 'board hint'`. The board is
centred in its column on a play surface drawn by the stage's `::before` - a grid item on the
board's area, in `--game-surface` - so the width the board does not use still belongs to the
game. ⚠️ It was the other way round, the menu `1fr` and the board `auto`, and since a board is
sized by the screen's height the menu grew with the window until the game sat in a third of
the stage; Vuk's verdict was that the game was in the background.

⚠️ In the side layout `.game-fill` is a size container, so its content contributes nothing
to the row: **the board alone decides how tall the stage is**, and a fill has to lay itself
out to fill a given box (grids of `1fr`, sizes in `cqi`/`cqb`), never size itself from its
content. In the narrow menu column that means a fill is compact by construction: 2048's
ladder is three across and four down there, the pickers are small tiles.

⚠️ **A picker radio carrying `data-stage-wide` vetoes the side layout while it is
checked** - Minesweeper's expert board, 30 by 16, which needs the full width. Every
side-mode rule is guarded by `:not(:has([data-stage-wide]:checked))`, so the stage and the
board's own sizing can never disagree. The attribute is derived from the level's data
(columns over rows), not its id.

⚠️ **An inline-size container in an `auto` column collapses to its padding.** The board
column is `auto` in the side layout, and Minesweeper's expert board once came out 24px wide
inside it - which is why a board that is a container gives up `container-type` in side mode.

**The menu tightens rather than wraps in its narrowest width.** The HUD is a container
(`game-hud`) beside the board, and under 20rem - an 18rem column from 1024 to about 1250
wide - the buttons and figures take less padding and the figures a 5rem basis, so three
still share a row; each figure is a container too and drops its icon under 7.5rem, where
"Bestzeit" beside a square ran out of its block. ⚠️ The board is `align-self: start` in its
column, not centred: where a long hint makes the menu taller than the board, centring
pushed a board sized to be whole on load down by half the difference.

**The figures and the buttons are one size on every game.** A `.game-stat` is a label in
sentence case with an icon in a `.tile-icon`, and a tabular value at 118% stretch - compact
in the menu column, where the figures wrap and grow so each row is filled by what is on it
(three sit three across, four go two and two). Exactly one figure per game, the first, is
`.tile-cobalt`. Every button in `.game-actions` is a `.cta-ghost` with a 3rem minimum height
and 1rem text; in the menu column and below 40rem the sound switch collapses to its icon,
its word clipped but still its accessible name.

⚠️ **A pressed-state rule has to name its button by `data-action`.** The sound switch is
`aria-pressed="true"` whenever the sound is on, so a rule written for "the pressed button in
the bar" turns it red - which is what the minefield's flag-mode rule once did.

⚠️ **Order does not decide a tie between a game's file and shared.css.** Both are in the
`games` layer and Astro does not promise which lands first, so a game overrides a shared
rule by specificity. Tailwind utilities beat both, which is why a button's icon carries
only `shrink-0` and gets its size from the stylesheet.

**Every picker speaks one vocabulary** - the opponents on Battleship and Four in a Row, the
puzzles on the Cube, the levels on Memory and the boards on Minesweeper: a visible
`.tile-label` legend with an icon, tiles on `--site-card` with a hairline that lift 2px on
hover, and the chosen one marked by an accent edge, a 9% accent tint and an inset ring, not
a fill. Focus is drawn on the label with `:has(:focus-visible)`, since the radio inside is
`sr-only`.

**How to play is rows inside one tile**, never a grid of cards: four cards with
descriptions of different lengths left empty bottoms in every one but the longest. A row is
a number square (the accent on a tint, turning on hover), the title in a column of up to
17rem, and the description beside it from 52rem.

**The build notes** open with their first paragraph in the ink at lead size, and the rest
in balanced columns. ⚠️ From 60rem the column paragraphs may break across the columns and
run on with an indent rather than a gap: Chrome ignores `widows` in a balanced multicol
(measured, a paragraph split three lines and one despite `widows: 4`), and keeping every
paragraph whole left a hole of about 150px at the foot of one column.

**Boards are sized to the screen.** Every game sizes its board as
`100svh - var(--game-reserve)`, where `--game-reserve` (21.5rem, in shared.css) is
everything on screen that is not the board at 1440x900 - the header strip, the compact
head at its tallest, the stage's padding and a little air - so the board is fully in view on
load. On the old pages no game was. It is one number on purpose: change the head and every
board follows.

Back to top is hidden below 64rem on every page (§5), which on a game page keeps the fixed
circle off a corner of the board.

### The games index

[GameIndex.astro](../src/components/GameIndex.astro) is a `.bento` wall of seven tiles,
every row full: from 64rem **6 + 6, 4 + 4 + 4, 6 + 6**, from 40rem two per row with the
seventh across both, one column on a phone. The spans are set by position in
[index.css](../src/styles/games/index.css), so the display order stays whatever `site.games`
declares. ⚠️ The composition is for exactly seven: an eighth would sit alone at half width,
so adding a game means deciding the wall again.

The head sets the title and the intro side by side from 64rem, aligned on the last
baseline, so the intro is two full lines beside the title rather than one long line and a
stray second one. **The title's letters drop onto their line** one after another and
bounce twice as they land, like discs into a Four in a Row board (`games-drop`, the 404's
drop in small) - the one page that plays before it is asked to. The letters are
`aria-hidden` boxes and the word is said once from an `sr-only` copy, so a screen reader
hears "Games" and not five letters.

**Each card is its game's cabinet.** `data-game` (the slug) picks `--game-hue`, taken from
the board rather than chosen for it - 2048's amber tile, the minefield's red three,
Memory's gold edge, Accretion's night, the sea, a cube face's green, the red disc - and a
card picked up glows in it: an edge and a wash under it, the title tinted, and a lean of
0.8 degrees, one way and the other along the wall, like cabinets not quite in a line
(`rotate`, which composes with the lift's `transform`). A play mark in the hue appears in
the screen's top right on hover or keyboard focus. ⚠️ **Not at rest on a touch screen**: in
that corner it covered the minefield's flag and 2048's 256, the pieces those stills are
composed around. The hues are the only hex values in index.css, and like every game's
palette they live under styles/games/.

**A card is a flex column**: the thumbnail, a title row with the name at large tile size
and the status as a `.pill-status` at its right end, then the tagline. ⚠️ It is deliberately
not a subgrid: aligning the taglines across a row opened a hole under the titles of
row-mates whenever one name wrapped its pill onto a second line ("Bataille navale",
"Potapanje brodova").

**The thumbnail is framed like a screen in a console.** `.game-shot` is inset from the tile's
edge by `--shot-inset`, its radius is concentric with the tile's, and it draws a 1px ring
over the picture - which is what keeps the dark trays of 2048, the minefield and the cube
from merging into a dark card. `.game-art` inside it is an inline-size container at 5:2.

⚠️ **The thumbnails are built from the real game pieces**, and each game's file carries
the few overrides that make its board into a still. Every hover rule in index.css is rooted
at `.game-card`, which exists only on the index, and that root is what keeps the beats off
the game pages.

**On hover each thumbnail plays one beat of its own game**, and the card lifts: a pop wave
across the 2048 tiles and a new 2 springing into the empty cell, a press wave over the
minefield's numbers and the flag fluttering, the memory card caught mid-turn landing face up,
the planets drifting on their own headings, the ships bobbing and the misses pinging, the
three puzzles turning once, and the red disc dropping into the fifth column and the winning
diagonal pulsing. Anything that travels far is a transition, so leaving the card plays it
back to the still; only beats that move a few pixels are keyframes. They trigger on
`:is(:hover, :focus-within)`, so a keyboard user sees the same motion, and all of it is
behind `prefers-reduced-motion: no-preference`.

⚠️ **index.css picks pieces by position**, and each thumbnail component says so: Memory's
third card is the turning one, Four in a Row's discs 2, 7 and 11 are the diagonal the
falling disc completes, Battleship's two misses are adjacent so a sibling rule can delay the
second, and the cube's scenes are the only `div`s. Recompose a thumbnail and its beat has to
be moved with it.

### A tile keeps its element for its whole life

The board is never re-rendered from the state. A tile is a `div` in
`.g2048-layer` carrying `--x` and `--y`, and a move writes two numbers onto elements that
are already there:

```css
.g2048-tile {
  width: calc((100% - 3 * var(--g2048-gap)) / 4);
  transform: translate(
    calc(var(--x) * (100% + var(--g2048-gap))),
    calc(var(--y) * (100% + var(--g2048-gap)))
  );
  transition: transform var(--g2048-slide) var(--g2048-glide);
}
```

Two things fall out of that. The percentage in `translate` resolves against the **tile's
own** size, so a column step is `100% + gap` and nothing in the CSS or the module needs to
know how big the board is - a resize costs no script at all. And because the element
persists, the transition is a slide rather than a repaint: the move goes through the
compositor and never through layout, which is the whole of what makes it smooth.

⚠️ **`--g2048-slide` is set from the module**, in
[game.ts](../src/games/2048/game.ts), not from the stylesheet. The transition, the
`animation-delay` a spawning tile waits out, and the timer that resolves a merge are one
number, and it is `0ms` under `prefers-reduced-motion` - which the blanket rule at the
bottom of the stylesheet cannot do, because it cannot reach a `setTimeout`.

A spawning tile is `animation: … var(--g2048-slide) backwards`. The `backwards` fill is
what removes the second timer: the tile is in the DOM immediately and holds its opening
frame through the delay, so it cannot land early on a slow frame.

Two easing curves, and the split matters. ⚠️ **`--g2048-glide` must not overshoot.** The
board is a grid of hard edges, and a tile whose position sails past its column and comes
back reads as one passing through the wall rather than stopping at it, so the slide is a
hard ease-out. Scale has no wall to hit, so `--g2048-spring` overshoots and the pop and the
arrival are where the life in the board comes from.

**A move that arrives mid-slide is held, not run.** Cutting the previous slide short to
serve the new direction makes a fast player's tiles jump, which is the opposite of what
they were asking for. One move is queued and played the moment the board settles - one
deep, because a longer queue stops answering the keyboard and starts replaying it.

### The colour ramp

⚠️ **The three boards and the technology marks in [src/tech.ts](../src/tech.ts) are the
only colour on the site outside the accent**, and unlike everything else in this document none
of them is a decision about taste. Eleven values have to be told apart at a glance and at
speed, and a near-monochrome board makes that impossible. The minefield's eight numbers are
the same argument and are set out further down. Accretion's ten are the exception to the
exception: they were not chosen to be told apart at all, they are the planets' own colours,
and they happen to be distinguishable because planets are.

`--g2048-t1` to `--g2048-t12` are declared on `:root` and redefined in `.dark`, one step
per doubling. It is a single sequence rather than eleven picked colours: paper and sand for
the two smallest, then the site's own `--site-accent` at 16, then indigo, violet, magenta,
rose, coral and amber. Hue and heat both move one way, so bigger always looks hotter and
the board reads without reading a number on it. Every chromatic step carries white at
3.5:1 or better, which is the large-bold threshold and what these are; the two pale steps
and the 2048 itself take the ink instead.

The tier is `min(12, log2(value))`, written to `data-tier` by the module, so a long game
tops out on the ramp rather than running off the end of it.

The colours hang off `.g2048-tier` rather than off `.g2048-tile`, because the board is not
the only thing wearing them: the thumbnail on the games index is a still of a board -
markup and tokens, not an image - so it stays sharp at any size, costs nothing to serve,
and answers the theme toggle. See [Art2048.astro](../src/components/games/Art2048.astro).
Its five-by-two grid against a 5:2 box is the one pairing that keeps the cells square
however wide the card gets.

[ArtMinesweeper.astro](../src/components/games/ArtMinesweeper.astro) goes one further and
uses `.ms-cell` itself, overriding only the three things that are about being a thumbnail,
so the card cannot drift away from the game it advertises. The tray colour is the one thing
a thumbnail cannot share - `.game-art-2048`, `.game-art-ms` and `.game-art-acc` each bring
their own.

The frame around every thumbnail is `.game-shot` rather than `.game-art`, and the split is
not cosmetic: `.game-shot` carries the inset, the concentric corners, the clip and the ring
drawn over the picture (see "The games index" above), while `.game-art` inside it is the
container the board is sized against, and carries the `aria-hidden` a drawing of a board
wants.

⚠️ **[ArtAccretion.astro](../src/components/games/ArtAccretion.astro) is placed by hand and
has to be checked rather than judged.** All ten bodies are spread across the card, and three
things have to clear at once: every pair of centres against the two radii; Saturn's ring,
as the ellipse it is rather than as a circle around it, which would have more than twice
Saturn's radius and eat a fifth of the field; and the Sun's glow, about 2.4 units past the
disc, which the frame cuts. The tightest gap, 2.96 units, is also the budget the index's
hover drift may spend. The sizes are also *not* the game's radius table: real ratios
put the Sun at nine and a half Moons, which in a 5:2 box leaves the Moon at four pixels and
the card saying nothing, so they are compressed to about five to one.

### Numbers are sized off the board, not the viewport

`.g2048-board` is a `container-type: inline-size` container and the digits are in `cqi`,
stepped down by `data-digits` so a 2 and a 1024 both fill their tile. A `vw` clamp cannot
do this: the board stops growing at its own cap and the numbers would carry on.

**The board is `--g2048-size`**: `min(100%, 36rem, max(20rem, 100svh - 17rem))` stacked and
`min(44rem, 100vw - 30rem, max(22rem, 100svh - var(--game-reserve)))` in the board column
from 64rem, where `100vw - 30rem` keeps it inside its column on the narrowest screen that
sets the menu beside it. At 1440x900 it is 556px square and the stage ends above the fold.

**The menu holds a ladder**: eleven rungs from 2 to 2048, the 2048 across two columns,
wearing the ramp as far as the highest tile on the board and the empty-cell colour beyond
it. The page's `onAnnounce(score, highest)` sets `data-reached` and `data-top` on each rung,
and a rung that becomes the top pops in on `--g2048-spring`. It is `aria-hidden` because the
live region already says the highest tile. In the narrow menu column it is three across and
four down, stretched to the height the board leaves - six across left each rung a sliver -
and stacked it is a strip of twelve when its own container is 36rem wide, and square rungs
on a phone.

### The minefield is a grid, in both senses

⚠️ **`.ms-row` is `role="row"` with `display: contents`, and both halves are load bearing.**
A grid without rows gives a reader no position at all, and a row that is also a layout box
would nest every cell in a second grid and break the columns. The cells are `<button>`
elements carrying `role="gridcell"`, so one cell is in the tab order at a time and the
arrow keys walk the field rather than the Tab key walking 480 buttons.

That is the reason this game is on the site. 2048's board has to be `aria-hidden` and
described through a live region, because sixteen tiles that rewrite themselves on every
keypress cannot be read out. A minefield sits still and waits, which is what a grid is for.

**Three boards, and expert scrolls rather than shrinks.** From 64rem a cell is the smaller
of a height term - `100svh - var(--game-reserve)`, less the tray's padding and, over a
stacked board, the HUD above it (`--ms-hud`) - and a width term, `--ms-column`: the shell's
measure less the stage's edge, padding and surface margin and, beside the menu, the column
gap and `--hud-w`. It never goes under `--ms-min` on a desktop: 1.55rem for a finger, and
1.25rem under `(pointer: fine)`, which is what lets expert open whole under a 1280x800
laptop's head. Below about 25px a cell stops being a touch target, and 30 columns of that do
not fit a phone, so `.ms-scroll` takes the overflow there, with an edge fade on a scroll
timeline. From 64rem the tray hugs the board in both layouts and `.ms-scroll` is no longer
a query container, so the width term comes from the viewport. ⚠️ `--ms-rows` is a CSS copy
of the level table keyed off `data-level`, because the module writes only `--ms-cols` and
changing what it writes would change the game for the sake of its chrome.

**Beginner and intermediate stand beside the menu; expert stays stacked** (`data-stage-wide`),
under a HUD of one strip - the picker's tiles as wide as their words, the figures, the
buttons with the sound switch as its icon - and on a play surface like the others: 25px
cells, whole on load, at 1440x900, 36px at 1920x1080. ⚠️ **Beginner's cells are capped at
2.75rem**, 44px, a board of 444 square at 1440x900: sized by the height like intermediate it
came out 56px cells and read as too big, nine keys the size of a thumbnail. Intermediate is
still the height's, 30px cells at 1440x900. **Beside the board the picker is a
list of three rows** sharing a subgrid - the name with the size and the mine count, and a
drawing of the field, all three to one scale - so the drawings stay comparable in any
language; a short column (the `ms-levels` container under 11rem) turns each row into one
line with no drawing.

⚠️ **The board is `width: fit-content` with auto margins, not `justify-content: center`.**
Centred tracks that overflow a scroll container are clipped at the *start*, which makes the
first columns of an expert board unreachable. Auto margins go to zero when there is no free
space, so the board centres while it fits and overflows to the right when it does not.

The cell sizing is a container query for the same reason the 2048 digits are, and with the
same trap: `.ms-scroll` is the container and every `cqi` length is on `.ms-board` inside it.

### The press preview, and why a long press only plants

⚠️ **Holding a button down shows the cells a release would open, pushed in but untouched.**
It is the one piece of the original's feel that is not a rule, and it is what makes
chording usable: a ring of eight is too much to open on faith. `.ms-cell.is-armed` is a
class and an array of which nodes carry it - **the model never learns this is happening** -
so a preview that somehow outlives its press costs a wrong colour rather than a wrong
board. It clears on pointer up, on the pointer leaving the board, and on the window losing
focus, because the button can be released anywhere.

Chording has three ways in: the middle button (the original's gesture in the form modern
mice have), an ordinary press on a revealed number (which has nothing else a press could
mean), and both buttons at once while the preview is up. `auxclick` is what carries the
middle button - `click` does not fire for it.

⚠️ **A long press plants a flag and never takes one back.** A hold that toggles removes the
flag whenever the finger lands on one that is already there, which on a phone is most of
the time. Planting is also idempotent, which settles the harder problem underneath: a long
press produces a `contextmenu` *and* a timer, browsers disagree on the order, and two
plants leave the same flag where two toggles leave none. Flag mode is how a flag comes
back off on a phone, and a right click or `F` is how it comes off anywhere else.

The click a long press trails behind it is swallowed by comparing against **when** the hold
last fired rather than a boolean saying that one did. A boolean gets stuck: a browser that
suppresses the click after showing a context menu leaves it set, and the reader's next real
press is eaten. A timestamp stops mattering on its own.

### The wave, which is the only motion in it

A flood fill can open three hundred cells at once, and opening them on one frame reads as
the board flickering. Each cell carries `--d`, the ring it was found on, and waits
`calc(var(--d) * var(--ms-wave))` before it opens - so the fill spreads outward from the
press. The queue in the module is breadth first, which is what hands the animation its
distance for free.

`--ms-wave` is written from the module, the way `--g2048-slide` is, and the `backwards`
fill is the same trick: the cell holds its opening frame through the delay, so no second
timer has to exist and nothing lands early on a slow frame.

### The eight numbers

⚠️ **A third exception to the near-monochrome palette, on the same grounds as the ramp**
and not on taste: eight numbers have to be told apart in a cell the size of a fingertip
while the eye is elsewhere on the board.

`--ms-n1` to `--ms-n8` keep the original's *order* - a player who has met this game before
reads 1 as blue and 3 as red and should not have to relearn it - but not its values. Two of
its pairs collapse at this size: navy against blue, and black against grey on a light
ground. Navy becomes violet, and the last two separate by weight rather than hue.

**The flag and the mine are drawn with two pseudo-elements each, never an emoji.** An emoji
is a different picture on every platform and many are colour fonts that ignore `color`
outright, which would put the one shape that must answer the theme outside the theme.

### The field, and the solver

⚠️ **Accretion is the only thing on this site that runs on every frame.** The other games
are event driven and idle at nothing. This one integrates, resolves contacts and writes up
to 46 transforms on every frame the display draws, which is a budget the rest of the site
does not have and must not borrow. A well of 46 bodies costs 0.11ms of solver a step
against a 16.7ms frame, measured, and in Chrome at 120Hz the frame never went past 9.4ms
with the sky's parallax running, so the cost is the transform writes rather than the
mathematics.

**The simulation steps at 60Hz and the frame draws between steps.** Each body keeps where it
was when the step began, and the frame places it the fraction of the way to where it is now
that the accumulator has reached. Without it a 120Hz screen showed every position twice,
and any display that is not a multiple of 60 got an uneven step.

**The simulation runs in its own space and never learns how big it is being shown.**
`.acc-world` is a fixed 1200 by 1650 box carrying one `scale()`, so a resize is that single
number changing - not a radius, not a position, not a step. Without it the same gravity
would feel twice as heavy on a phone as on a desktop, and a resize mid-game would jolt the
pile.

⚠️ **`.acc-world`, the panels and the line are siblings, not nested.** Anything inside the
scaled layer is scaled with it, which is right for a planet and wrong for a sentence. The
line was inside it once, and rounding in the scale left it stopping short of the wall.

**Bodies spin in the solver and the spin is not drawn**, which is two decisions and
both are deliberate. Friction is measured between the two *surfaces* rather than the two
centres, so a body that is rolling has no slip and a body that is skidding is both slowed
and spun up - that is what lets one friction term serve a roll and a skid at once. Drawing
the angle is a different question and the answer is no: these are not featureless balls, and
a ring or a set of cloud bands is set by a planet's axis, so a Saturn resting at ninety
degrees reads as broken rather than as turned. Two attempts to have it both ways - easing a
settled body upright, then easing a moving one - were both visibly a body turning while
nothing turned it.

**The planets are gradients, not images.** One radial gradient makes the lit sphere from
`--acc-tint`, `--acc-form` lays a bounce-lit rim and a curved terminator over the top,
`--acc-shade` is that plus a specular, and each body stacks its own markings between the
two. Saturn's ring is two pseudo-elements, one behind the planet and one clipped to its
lower half in front, because a single ellipse on top reads as a hoop around a circle rather
than a ring around a sphere.

⚠️ **The two are split because Earth's land re-applies the shading.** The continents are
pseudo-elements drawn over the ocean, so without the stack on them they ignore the
terminator and read as stickers - but with the whole stack they take the specular too, and
the glint off the water ended up in the middle of North America. `--acc-form` is the part
that says "sphere" and is what the land uses.

**Four rules cover what each kind of body is made of, and they are worth knowing before
editing one.** A crater is three layers - a bright raised rim, a darker floor, and a shadow
thrown *back across the floor from the lit side*, because the wall the light falls on
outside is the wall that shades the inside. A gas giant's belts are written out rather than
repeated, because an even `repeating-linear-gradient` reads as a pattern laid over a ball
instead of as weather on one. An albedo feature - Syrtis Major, a mare - is several
hard-edged ellipses at one tone, which union into a wedge, where soft ones at different
tones read as a bruise with a hole in it. And the Sun takes no terminator at all: it is lit
from inside, so limb darkening is the whole of its shading, and it carries no repeating
surface texture because every cheap way of writing granulation comes out looking either
woven or like polka dots.

⚠️ **Earth's coastlines are projected, not drawn.** Two `clip-path: polygon()` rings of
about seventy points each, taken from the real outline in degrees and put through an
azimuthal equidistant projection centred on 22°N 34°W. Two rings because a body has two
pseudo-elements, and that is not a compromise - the Americas are one landmass joined at
Panama and Afro-Eurasia is one joined at Suez. Each ring traces its inland seas as bays, so
Hudson Bay, the Gulf of Mexico, the Mediterranean and the Red Sea stay water. ⚠️ The
projection is equidistant rather than orthographic on purpose: orthographic is what a camera
sees and its radius goes as the sine of the angle from the centre, which piles everything
past sixty degrees into the rim and left Europe a smear with Asia behind it. ⚠️ The
Mediterranean and the Red Sea are the only places the outline is not the true one, opened by
about three degrees on each shore - at their real widths Sicily touches Tunisia and the Red
Sea is a hairline, which on a body a centimetre across welds Europe onto Africa and leaves
Arabia as a spike.

⚠️ **Saturn paints above every other body**, on a `z-index: 1` that sits under `.acc-panel`
at 3. Its ring reaches 1.7 diameters across, so on a full field something is always under
one of the tips, and a tip that disappears behind a neighbour reads as a rendering fault
rather than as depth - it is a thin ellipse, and half of it simply goes missing. ⚠️ It has
to stay `z-index` alone: a `position` on that rule ties `.acc-world .acc-body` on
specificity, wins on order, and drops Saturn out of the field's absolute positioning.

⚠️ **That `z-index` is also why the back of the ring has to be masked rather than layered.**
It makes Saturn a stacking context, and inside one the element's own background paints
*before* its negative-`z-index` children - so `::before` at `-1` was never behind the
planet, and the far half of the ring could be read straight through it. It was faint enough
to miss while the ring was one soft band and impossible to miss once it had divisions in it.
The fix is a `mask-image` that is transparent inside the planet's silhouette and opaque
outside, which leaves nothing to show through. The two radii in it are arithmetic: the ring
box is 170% by 48% of a square body and its transform is a pure rotation, so the planet's
disc is still a circle in that box, at 50/170 of its width and 50/48 of its height.

⚠️ **`.acc-panel` re-declares the palette rather than styling its contents**, the way
`.panel` does (§1) and with more cause. The well is dark space in both themes, so in the
light theme every `--site-*` token under the panel is the wrong way round: `.cta-ghost`
painted `--site-card` at near-white and then took the panel's near-white text on top of it,
so New game was a button that was not there. The accent goes to `--site-panel-accent` in
both themes as well, because cobalt on a night sky is a button you have to look for. The
other two games need none of this, since their trays follow the theme.

⚠️ **The Sun takes no shading stack.** It is not lit from outside, so a terminator across it
is simply wrong.

⚠️ **Saturn's ring may not reach past the body.** At 208% of the width it hung 0.11 of a
radius below Saturn, so a Saturn resting on the floor had its ring sliced off by the edge of
the field - which reads as the planet having sunk halfway through the bottom. At 170% the
furthest point of the ring is inside the body's own silhouette. Uranus had a vertical ring
for the same reason its real ones are vertical, and it was removed: at the size a body
actually appears, a tall thin ellipse around a small circle stops reading as a planet.

⚠️ **Neither the ring nor the Sun's glow may use a percentage.** `border-width` and
`box-shadow` take lengths only, so the ring is drawn as a gradient annulus - whose stops
*are* percentages of the element - and the glow is in pixels and therefore confined to
`.acc-world`, where a Sun is always about the same size.

⚠️ **`--acc-line` is the colour and `--acc-line-at` is the position, and they cannot be one
name.** They were, set on `.acc-field` from an inline style, so a percentage inherited into
every rule below it and the dashes were drawn in `16%`.

### How the solver works

It is the **soft step** Box2D v3 settled on, for circles only: eight substeps a step, and in
each one velocity is integrated, every contact is solved as a stiff, heavily damped spring,
the bodies move, and every contact is solved again rigidly with no push at all - the relax.
The first solve gets two bodies out of each other and the relax takes back the speed that
did it, so an overlap is corrected without turning into a bounce. Bouncing is a last pass
once a step, and only for an impact above `BOUNCE_THRESHOLD`. Contacts are found afresh every
substep, including any pair still a few units apart, so a falling body stops exactly at the
surface it lands on.

**Each rule in it is there because of a measurement**, and every one of these was measured
with the rule switched off in a headless run of the real module. The numbers are also next
to the constants in [game.ts](../src/games/accretion/game.ts):

| Rule | Without it |
|---|---|
| mass is the radius, not the area | an Earth dropped onto a Moon lying on the floor comes back up at 569 to 1436 units a second instead of 34 to 124. Area puts ninety Moons in a Sun, and this family of solver converges on a heavy body over a light one about as slowly as the ratio is large |
| a warm start is held to the contact's running average, and may not leave a contact separating | the same drop comes back at 258 to 543. ⚠️ An impact is one huge impulse needed once, and carried into the next substep it throws the pair apart - and it rides on the Moon's contact with the floor, which looks like a contact at rest, so no test on closing speed can catch it |
| contacts at 120Hz rather than Box2D's 30 | a Sun and a Jupiter on a bed of small bodies sit up to 21% inside them, instead of half of one per cent |
| a merged body is born clear of everything and grows only while nothing on it is a fifth deep | bodies end up to twice their own radius inside a new one, instead of a third at most. The notch between the two that merged is where a third one is most likely to be resting |
| rolling resistance on the floor, and against the impact part of any contact | a body that lands on the shoulder of another rolls 600 to 700 units, to the wall, instead of coming to rest 73 to 228 from it |
| no rolling resistance between two bodies at rest | any at all holds a body balanced on the crown of another |
| a body on the crown of a single other body is tipped off it | 11 of 88 drops onto another body's top stay there for good. With it none does, and none sits on top for longer than half a second |
| the push-out is capped at 420 units a second | nothing, in normal play, since the growth rule keeps overlaps small. It is insurance for a body dropped into a well so full that it arrives inside another |

⚠️ **Merging runs inside the substep loop, before anything separates.** Run once a frame, two
equal bodies met, were held apart by every substep in between, and only then became one, so
every merge was visibly a collision followed by a merge.

⚠️ **The line counts per body, and a jolt pauses the count rather than restarting it.** A
body counts once it has landed and while it is slower than `CALM`, and the well is full once
one has spent half a second above the line. With one shared count reset on speed, every body
dropped onto a pile that had crossed knocked the ones above it back to zero, and a fast
player kept a lost game going for five seconds and seventeen drops. Now it ends within half
a second, with at most one more drop.

### What a merge looks like

**The size drawn is not the size simulated.** The solver's body starts small and waits for
room, and drawn from that a merge in a crowded spot started at a third of its size and
visibly inflated. So the drawing has its own curve: the new body appears at 86% of its size,
already larger than either of the two that made it, swells about 4% past full and settles,
over a third of a second. The two that made it leave the solver at once, and their nodes
slide from where they were last drawn into the new body's centre, shrinking and fading, in
0.13s. A ring in the new body's colour goes out from its rim.

⚠️ **Nothing here that is placed by `transform` may be animated with the `scale` property.**
The individual transform properties apply before `transform`, so a `scale` keyframe also
scales the element's translation and slides it towards the corner of the well. That is what
the old arrival and departure keyframes did to every drop and every merge, and what threw
the flash of two Suns off the field altogether. Every change of size a body has is written
into its transform by the frame, and the ring, the Sun flash, the near stars and the meteors
are placed with `translate`, which applies before `scale` and so is not scaled by it.

**Next shows the body after the one in the aim**, which is already in plain sight. The
module keeps a queue of one.

### The sky

**Four layers, generated once at build time by a seeded generator in
[games/accretion/sky.ts](../src/games/accretion/sky.ts)** and drawn by
[Accretion.astro](../src/components/Accretion.astro), so the sky is identical on every build, in every language and for
every reader: 260 faint stars thickest along a diagonal band, three nebulae of fractal noise,
70 brighter stars, and a near layer of eleven glowing stars - four of them throwing
diffraction spikes - a distant galaxy and two meteors on long cycles. A star is a
zero-length stroke with round caps and `vector-effect: non-scaling-stroke`, so it is a point
of light in pixels however large the well is, and all the stars of one size and tone share a
path. Each nebula's noise is confined to its own region by the filter's bounds and faded out
by a mask, so it is only computed where it is seen.

**The depth is parallax and nothing else.** The module finds the layers by `data-depth` and
moves each one by its depth as the aim crosses the well, eased, with a slow drift on top. The
layers are promoted, so moving one is a composite and the noise is not recomputed. Reduced
motion stops the parallax and the drift, and the stylesheet's blanket rule stops the twinkle
and the meteors.

⚠️ **It is markup in the components and not rules in accretion.css**, because that file is
inlined into every page that shows the game or its card, and a star should cost only the
pages that draw it. The markup adds 3.4 KB gz to this page.

**The card on the games index draws the same night**
([ArtAccretion.astro](../src/components/games/ArtAccretion.astro)): the well's ground, a
shared rule with `.acc-field`, and the dust and near stars from sky.ts, the dust sliced to
the card's 5:2 as the well's layers are to its shape. No nebulae, whose noise is the one
expensive thing in the sky, on a wall of seven cards that scale on hover, and the near stars
hold still, since the wall moves only under the pointer. It adds 2 KB gz to the index.

### The record is signed

`game-2048-best` holds `value.signature` rather than a bare number, and
[games/record.ts](../src/games/record.ts) throws away anything that does not carry its own
signature, clears the key and starts the record at zero. The signature is FNV-1a over the
key, the storage name and the value, in base 36, which is a dozen lines and no dependency.
The storage name is in there so a verified figure cannot be pasted under a second game's
key.

**It is shared because keeping a record is the one thing every game does, and what differs
between them is one predicate.** `scoreRecord(name, plausible)` owns the storage and the
signing, and the caller says what its own scoring could have produced. 2048 passes
`value % 4 === 0`, which is worth more than it looks: a merge scores the tile it made,
always a power of two of at least four, so **a real score is a multiple of four** and most
invented numbers fail on arithmetic before the signature is reached.

The key comes from `PUBLIC_GAME_SIGN_KEY`, with the literal in the module as a fallback so
a build without the variable still works. ⚠️ **The `PUBLIC_` prefix is not optional and
it is the whole caveat**: this is client code, a variable without that prefix is not there
to read at all, and one with it is substituted into the shipped bundle at build time. Env
keeps the key out of the repository and out of nothing else.

⚠️ **It is a signature and not encryption, and it is not a security measure.** The key ships
in the bundle however it is set, so anyone willing to read 2.7 KB can mint a record that
verifies, and nothing run on the client can prevent that - the page and the person editing
the page are the same machine. Encrypting the number would hide it from nobody for exactly
the same reason.

What it is for is that the obvious edit fails silently instead of sticking, and that a
half-written or corrupted value never reaches the game as a number. That is proportionate,
because the record is private to one browser and claims nothing to anybody. A figure that
meant something to other people would have to be **derived by a server** from a
server-issued seed and the move log, with the client's own claim about its score ignored,
and that is a feature rather than a hardening step.

### Three layers, and why a ship is not a square

The sea is a grid of buttons with **no gap between them**, over a board that carries the
ruling itself as two repeating gradients stepped by `--bs-size`. So it is one surface rather
than a hundred tiles, which is what makes the rest possible: a hull cut into five squares
with a channel of background between each pair is a row of counters, not a ship.

⚠️ **The ruling has to be on the board and not on the squares.** It was an inset shadow per
cell, and a cell carrying a mark has to sit *above* the fleet for that mark to be readable
over a hull - which dragged its two grid lines up there with it, and a line drawn across a
ship reads as the ship being cut in half.

So the fleet is a layer over the water, one element per ship spanning its squares, with
inline `<svg>`s inside it that are `<use>`s of symbols in
[BattleshipSprites.astro](../src/components/games/BattleshipSprites.astro) - a carrier with
a flight deck, an island and parked aircraft, a battleship with three twin turrets and two
capped funnels, a submarine that is a teardrop with a sail and a cruciform tail. A third
layer over both carries what a shot left behind, so a peg or a burst reads the same over a
hull as over open water.

⚠️ **There are two symbols per ship and the pair is deliberate.** `bs-ship-N` carries every
detail and `bs-hull-N` is the outline alone, because a hull is drawn eight times over to
give it a side (below) and only the top copy is ever looked at. Seven clones of a carrier's
flight deck, island and aircraft is seven times the geometry for a shape nobody can see the
inside of.

⚠️ **The rounding is bands, not gradients.** A `<linearGradient>` declared inside a symbol
is not reliably resolved from inside a `<use>` shadow tree, while a flat fill mixed off
`--bs-hull` always is. Five bands - a lit sheer, the deck, the flank, the shaded flank, and
the boot topping at the waterline - read as a round hull and cost nothing.

⚠️ **Detail is layered by contrast, not by count.** Everything that has to survive a ship
two centimetres long - the silhouette, the deck, the turrets, the island, the sail - carries
a full step of tone. Everything that is there for the close look - plating seams, armour
belts, guardrails, uptake gratings, limber holes, hatch covers - is a hairline a few percent
off its own ground, so it enriches the hull at size and fades out instead of turning into
noise on the board. The one thing that has to be watched is a *large* light shape: the
carrier's lit sheer was a quarter of the flight deck at two thirds white and read as a sheet
of glass laid over the bow, and the battleship's citadel at a full step was a white slab
across the middle of the ship. Both are now a strip and a hairline respectively.

⚠️ **The detailed symbol has to open with the same outline the silhouette is.** The
silhouette is what the flank underneath is extruded from, so changing one without the other
makes the side of the ship stop lining up with the deck on top of it.

⚠️ **Colour reaches a symbol through `style`, never through a `fill` attribute.** A
document stylesheet cannot select into a `<use>` shadow tree, and inherited custom
properties are the only thing that gets in. That is also what makes a wreck one rule:
`.bs-hull.is-sunk` redefines three tokens and every shape in every symbol follows.

### The tilt has no perspective in it, deliberately

The plot is `rotateX(22deg)` with `transform-style: preserve-3d` down to each hull, and
**no `perspective` anywhere**. A vanishing point makes the far edge narrower than the near
one, which turns a square board into a trapezoid: the columns stop being parallel and the
ten rows stop being equal, and a grid a reader names squares on cannot afford either.
Rotating without one is an orthographic view - a true rectangle, shortened front to back by
the cosine of the angle, which at twenty-two degrees is seven per cent.

The depth survives it. Under `rotateX` alone a `translateZ` still lifts a thing off the
surface, by the sine of the angle, so a ship is drawn eight times up the Z axis: the bottom
copy is its shadow on the water, six in the middle are the flank, and the top one is the
deck. Six rather than four because at a third of a square the gaps between four were visible
as banding down the side. ⚠️ A `filter` or an `opacity` anywhere on the chain from the plot down to the hull
flattens it and the whole fleet drops onto the water - which is why the shadow's
`brightness(0)` is on a leaf and never on the hull.

### A shot crosses the table, and the board opens before it lands

A round is positioned against `.bs-frame`, which holds both boards, because it leaves one of
your own hulls and lands in their water. Both ends are measured off the squares with
`getBoundingClientRect`, so the tilt is already in the numbers rather than being computed a
second time.

⚠️ **It is decoration over a result that has already happened.** `fire` has run and the
board is settled before a round is created: what waits for the flight is the *paint*. Three
timer slots rather than one - your round landing, theirs landing, and the pause between -
because the board unlocks the moment they fire rather than when their round arrives, so two
flights are genuinely in the air at once and a single handle would have a new shot
cancelling the arrival of an old one.

---

### A card is three layers, and the answer is not in the page

The memory table is up to sixty buttons, and a card is three elements deep because three
different things move it:

| Layer | Moves by | For |
|---|---|---|
| `.mem-card`, the button | `translate`, `scale` | the deal from the middle of the table, the hover lift, the press |
| `.mem-card-body` | `translate`, `scale` | the shake on a miss and the cheer through a cleared board. It holds the `perspective` |
| `.mem-card-inner` | `rotate` | the turn, and nothing else |

⚠️ **They are separate because two animations cannot share an element.** The deal and the
shake were on one layer once: adding the shake's class replaced the deal's
`animation-name`, and taking it away put the deal's name back - which a browser treats as a
new animation, so every card that missed flew back into the middle of the table and was
dealt a second time. Every keyframe in the family uses the individual transform properties
rather than `transform` for the same reason, so none of them overrides another's transform
or the hover underneath.

**The turn is a transition, not an animation**, because a turn called back halfway has to
go back from wherever it got to. It is `rotate: y 180deg` on the inner layer, both faces
carry `backface-visibility: hidden` (with the `-webkit-` prefix, which Safari still needs),
and the front is turned 180 degrees inside it, so the browser shows whichever face is
towards you. `--mem-turn` overshoots by a few degrees and settles, which is what reads as a
flat card with weight in it. The lift that rides on the turn is two keyframes with the same
frames and different names, `mem-lift-up` and `mem-lift-down`, because a card that went up
and came back would otherwise be asked to re-run an animation it already ran. **Each card
carries its own `perspective`**, at 4.2 times its own size, so a card on the four card
board and one on the sixty card board turn through the same depth.

⚠️ **A face-down card has no picture.** The front's `<use>` has no `href` until the moment
the card is turned, so the table in the page holds no answers and the deck lives in the
module's closure. The `href` is written once and never cleared, which is also the
battleship preview's lesson: rewriting a `<use>` rebuilds its shadow tree even when the
value is the same.

**`--mem-flip` is written from the module**, the way `--g2048-slide` is. The turn, the lift
and the timer that waits for a card to land before sealing a pair are one number, and it is
`0ms` under reduced motion, which the blanket rule cannot reach into a timer to do. The
module also zeroes `--mem-deal-step` there, because that rule shortens a duration and leaves
a delay alone. The hold on a pair that did not match, 820ms, is *not* zeroed: it is how long
you get to look, which is a rule rather than an animation, and pressing the next card
calls the pair back at once.

The deal needs no measuring. Each card carries `--gx` and `--gy`, its distance from the
middle of the table in cards, and `translate` resolves its percentage against the card's
own size, so `calc(var(--gx) * (100% + var(--mem-gap)))` is exactly the way back to the
middle at any board size.

### The table fits the screen, and turns on a phone

A memory board you have to scroll is one you cannot see. **The table is the whole board
column at every level**, with no slot margin, `100svh - var(--game-reserve)` plus that margin
tall between 22rem and 50rem, and it paints `--game-surface` in its own colour - a grey
table inset in a band of another grey read as a frame round a frame. The cards are sized to
the room inside it, capped at 17rem so level 1's four fill its height. ⚠️ No level is
`data-stage-wide`: beside the menu, 9 by 6 and 10 by 6 deal cards of 85 and 77 pixels whole
on load at 1440x900, where stacked they opened with their last rows under the fold. The
level picker is the fill, six by two, or four by three with a larger number once the picker
is 17rem tall, and the four campaign figures go two and two.

Below 64rem the table is stacked, and there `.mem-fit` is the smallest of the table's width,
a card of 8.5rem, and `(100svh - --mem-reserve) * cols / rows`, with `--mem-reserve` at
17.5rem, or 24rem below 40rem: a budget for the board once it is scrolled to, because no
phone or tablet shows the head, the picker and a whole sixty-card table at once.

⚠️ **On a portrait screen the board is turned a quarter and not one node moves.** Ten
across on a 390 phone is a 30px card and six across is a 51px one, so under
`(orientation: portrait)` the grid swaps its counts and fills by column: the markup's rows
become columns on screen. The grid a screen reader walks never changes shape, the arrow
keys swap axes in the module to keep meaning the way they point, the deal swaps `--gx` and
`--gy`, and each level tile carries both sizes and shows the one that screen will deal.

The table itself stays full width at every level and the board grows inside it. That is the
point of the shape: the table does not move while the deal gets bigger, which is what makes
a bigger board read as progress.

### The deck is drawn, and its colour is the content

⚠️ **The memory deck is the fifth and widest place the palette opens up, and on different
grounds from the other four.** Those needed colour so that states could be told apart. A
memory card face *is* a picture, and thirty pictures in near-monochrome are thirty grey
shapes. So `--mem-*` is an illustrator's palette of thirteen hues, each a colour, a
highlight and a shade, and it is the same in both themes: a card remembered in one theme
has to be the same card in the other. What follows the theme is the ground each picture is
drawn on, ten pastels and a night sky with a deep value each.

The thirty symbols live in
[MemorySprites.astro](../src/components/games/MemorySprites.astro), each a full card face on
a 100 unit square with its own ground and a softer disc under the subject, so a pair shares
its colour as well as its shape. They are flat fills lit from the top left and nothing
else - no gradient and no clip path, since both are `url(#…)` references and those do not
resolve reliably from inside a `<use>`. The back is cobalt, the site's own accent, because
it is the surface the eye spends longest on.

### How a turn feels, and the timing it depends on

The two cards of a turn are **held up** off the table, `translate: 0 -4px` with the heavier
shadow, and a found pair **lies back down** wearing a gold inset edge, so what is done
reads at a glance against what is in play. A face-down back catches a **glint** as the
pointer arrives - an animation rather than a transition, so it runs once per arrival and
never backwards - and only under `(hover: hover)`, since a phone keeps `:hover` on the last
card tapped. A gold line along the top of the table is the board found so far, one element
scaled by `--mem-done`, and the tile a cleared board unlocks pops open in the strip.

**The sounds are synthesized**, and the table's five voices are in
[games/memory/sounds.ts](../src/games/memory/sounds.ts). The engine and the switch are
shared by every game - see "Sound, the burst and the jolt" below.

⚠️ **A delayed effect is checked against the turn, never against the cards.** The shake of
a miss waits for the pair to land, and a fast player can call the miss back and have one of
the same cards up again in a new turn before it does. Asking "is this card still up" said
yes, the wrong card shook, and a pair found a moment later wore the red ring instead of the
gold one. The callback now keeps the `turned` array it was scheduled for and does nothing
if `settle` has replaced it. Found by clearing boards at ten milliseconds a press.

The clock stops while the tab is hidden, by moving its start forward by the time away.

**The star marks were measured**, not chosen: a simulated player with perfect memory played
200,000 games on every board, `three` in `LEVELS` is what it needed nine games in ten, and
`two` is half as much again. Its mean came out at 1.61 moves a pair, which is the known
result for this game and how the simulation was checked. **The record is also the lock**: a
level is open when the one before it has a record, so no second key can disagree about how
far a reader has got.

### The cube is a scene, and a sticker is placed by its slot

The cube page is the one board here that is a solid rather than a surface: a `preserve-3d`
scene of one element per sticker - 24 on the 2×2, 150 on the 5×5, 36 on the pyramid -
turned as a whole by one `matrix3d` and projected by the browser, which also sorts the
depth. Four layers, each for one job:

| Layer | Carries | For |
|---|---|---|
| `.cube-stage` | `container-type: size`, and `--u` | every length in the scene, and the surface a press lands on |
| `.cube-camera` | `perspective` | the projection, and the scale and fade a new puzzle arrives with |
| `.cube-view` | `transform-style: preserve-3d`, one `matrix3d` from the module | the reader's view of the puzzle, and the float |
| `.cube-tile` | a `transform`, and `--lit` | one sticker: its plastic, its colour and its brightness |

⚠️ **Nothing between the view and a sticker may carry an `opacity`, a `filter`, an
`overflow` or a `clip`**, for Battleship's reason: each flattens the context and the
puzzle folds onto the screen. The arrival fades the camera, which is outside the context,
and a sticker's brightness is a filter on the sticker, which is a leaf.

**`--u` is declared on the stage and resolved on every sticker.** An unregistered custom
property is carried as its tokens, so the `cqw` in it is measured against the nearest
container of the element that *uses* it, which for a sticker is still the stage. One unit
is 0.74 of the stage's smaller side over the puzzle's span - the diameter of the sphere it
turns in, which the module writes as `--cube-span` - so a resize is the stage changing size
and no script runs. The thumbnail gives `--u` and the perspective again, because a card is
only an inline-size container and a `cqh` there would be the screen's.

**A sticker's element is placed by the slot it is in, never by the rotations it has been
through.** While a layer turns, each of its stickers carries the turn's rotation in front
of its slot's placement. When the turn lands the rotation is dropped and the element takes
the placement of the slot it arrived in, which can differ from the rotated one by a quarter
turn in the sticker's own plane - invisible, because every sticker is symmetric about its
centre, and the reason nothing drifts however long a solve runs. ⚠️ **So nothing drawn on
a sticker may have a direction.** A highlight in one corner would jump a quarter turn on
every landing, which is why the sheen is a radial gradient from the middle and the
pyramid's sticker is a triangle centred on its own centroid.

**No turn is written down.** A puzzle is a list of slots and a turn is an axis, a slab of
depth along it and an angle: `permutation` rotates each slot in the slab and looks up the
slot that is then in the same place, and caches the answer. The cube and the pyramid share
all of it. The module was checked headlessly - every slab of every puzzle is a bijection,
every turn repeated a whole cycle is the identity, a scramble undone in reverse is solved,
and on the 3×3 R U has order 105, R U R' U' order 6 and R U' order 63, which is the known
answer and what catches a face whose turn runs the wrong way.

**Two plates slide into every cut a turn opens**, one on each side, in the darker plastic
of a real core. Without them a turning layer shows the inside of the puzzle, which is
nothing, and the far stickers show through the gap. For the cube a plate is the whole
cross section. For the pyramid it is the triangle the cut makes, which grows the further
down it is.

**The light is fixed to the reader, not the puzzle**, above and to the left, so the face on
top is always the bright one. It is `AMBIENT` 0.84 and `DIFFUSE` 0.3, which keeps the face
turned away at 0.84 of the one on top: at 0.6 and 0.52 the side faces were a dull red and a
dark green, and Vuk read the whole puzzle as too dark. The module writes `--lit` only when
it changes by 0.02. Measured in Chrome at 120Hz, relighting all 150 stickers of a 5×5 on
every frame of a drag holds 8.3ms a frame, the same with the filter as without it.

⚠️ **The six colours are the same in both themes**, for Memory's reason: they are the
puzzle, and a white face is white on every cube in the world. They are the bright colours
of a stickerless cube rather than the printed ones of the original, and only the stage
follows the theme. This is the sixth place the palette opens up.

### One drag, one step

**A drag turns a layer by one step at most** - a quarter on a cube, a third on the pyramid -
and past it the layer gives `GIVE`, about eight degrees, easing out, before it stops. A
flick carries `CARRY` of its speed past the release and the goal is clamped to one step
either way. ⚠️ A drag once carried as far as the finger went, and a long one turned a
layer twice or three times, which read as the layer running away from the hand.

⚠️ **A drag is read along the row, at one rate for the whole turn.** The rate is how fast
the grabbed sticker sets off along its face, through the same projection the browser
draws with, fixed when the turn is picked. Measured on the 3×3 as it opens, the sticker
stays within about a tenth of the finger turning towards a side the reader can see - 171
pixels of sticker for 156 of finger, 209 for 208 - and falls behind turning away, where it
goes out of sight. Worked out again on every move to keep the sticker under the finger all
the way, the layer sped up under a steady finger as its sticker turned away, to twice as
fast by the end, and the drag read as twitchy. The angle comes from how far the finger is
from the press rather than from moves added up, so a finger that comes back has the layer
back exactly where it started. `FLOOR` bounds the rate on a face seen edge on, where a hair
of finger would otherwise spin the layer.

**Which layer a drag means is chosen once**, when the finger has gone `AIM` - ten pixels
with a mouse, fourteen with a finger - and points plainly one way: within about thirty
degrees of a row or a column on the cube, fifteen on the pyramid. A closer call waits for
more of the drag, up to 24 and 32 pixels, and then the nearest way is taken. Nothing moves
while it waits, and the layer then catches up with the whole of the drag. ⚠️ A press on a
trackpad or a glass moves a few pixels by itself, often straight down, and read after five
pixels that was the direction a drag along a row often got.

⚠️ **The way each layer would go is taken along the face**, as a row or a column runs on
screen, not the way the sticker's centre sets off round its circle. The two agree only in
the middle of a row: anywhere else the circle dips into the puzzle. In the view the page
opens with, 13 of the 72 drags along a row or a column from a visible sticker turned the
wrong layer that way - the bottom row dragged to the right from its left sticker at the
front, or from the right side, turned a column. Along the face none do. Driven through the
page in Chrome from five views, 330 of 336 such drags turned the right layer, and the six
were on a face seen within ten degrees of edge on, where a row and a column run almost the
same way on screen. On the pyramid a drag on the middle row takes the tip with it, since a
tip left behind is a quirk of the mechanism rather than a move anyone means.

**Let go and a spring takes the layer to its step**, at a damping ratio of 0.78: one degree
of overshoot and no wobble. The click is played as the layer first reaches the step, not
when the spring stops ringing. A layer still landing is landed at once only when a new
drag gets going, not on the press, so a tap during a landing costs nothing. ⚠️ It is
landed before the pressed sticker's place is read: until then a sticker in the landing
layer is still in its old place, on another face, and a drag along the bottom row just
after R was read as a drag on the bottom face.

⚠️ **The whole puzzle turns freely and stays where it is left.** A drag off the puzzle, or
with the right button on it, turns it like a trackball, and a flick coasts, its speed
falling to a third every `COAST` seconds until it drops under 0.3 radians a second. It used
to settle back square to the nearest of the orientations the solid maps onto, and that
read as the puzzle refusing to be turned. The keys still reorient by quarters, and the
letters always mean the faces as they are seen now: U is whatever is on top.

### Hints follow a method, not the shortest solution

A hint shows the next move and says what it is for: the step of the method it belongs to,
the piece it is about as chips of that piece's colours, and, when the move is part of a
sequence, the sequence with this move picked out. The planner is
[hint.ts](../src/games/cube/hint.ts), loaded the first time a hint is asked for, so a solve
that never asks costs nothing.

⚠️ **The methods are the ones people are taught.** A shortest solution can only say that a
move is one closer, and on the 3×3 it needs a solver several times the size of the game.
So the 3×3 is solved layer by layer in seven steps, the 2×2 in three around one fixed white
corner - it has no centres, so that corner says which colour every face is, and only the
three faces it is not on are turned - and the pyramid in three: tips, centres, edges. The
4×4 and 5×5 have no hint.

**Judgement is a search, sequences are sequences.** Which cross edge to bring down and how
is the fewest moves for that one piece that keep every piece already placed where it is,
found by iterative deepening over a handful of tracked stickers, which is what an
experienced person does by eye. Corners and middle edges are the taught procedure - take it
out if it is in the wrong slot, turn the top until it is over its place, apply the sequence
- with the easiest piece first. The last layer is a short breadth first search over the
top turns and the step's one sequence, used whole. Following the plan from 500 random
scrambles of each puzzle solved every one, and a plan takes about a millisecond on the
cubes and twenty on the pyramid.

**A plan is kept while the puzzle follows it.** Each step carries the state it leaves, so a
turn that lands where the plan said picks up the next step without planning again. A half
turn made as one quarter gets the other quarter. Anything else is planned again from where
the puzzle is, so a hint is never about a puzzle that is not the one on screen. After each
turn the next hint appears by itself until the card is closed.

⚠️ **The puzzle is turned to the way the method holds it**, whenever that changes: white
face up for the cross, where it can be seen being built, then yellow face up and the
sequence's own front in front. Otherwise "the top layer" and the R in R U R' U' would mean
some other face whenever the reader had turned the puzzle. It is not turned on every move,
since a reader who turned it to look at something would have it snatched back.

⚠️ **Every hint opens with the move in plain words**, the largest line on the card: "Turn
the right side up", "Turn the top layer to the left", "Turn the front face clockwise",
"Turn the top layer half way round". The notation is under it for whoever wants to learn it,
but a reader who has never seen R U R' U' has to be told which layer and which way in the
terms of the puzzle in front of them, and the first version of the card, which only said
why, left Vuk not knowing what to turn. `describeTurn` in
[game.ts](../src/games/cube/game.ts) works both out from the view: the way is where the
nearest sticker of the layer that faces the reader goes on screen - up, down, left or right,
or clockwise for a layer whose axis points out of the screen - and the layer is named by the
same split, a side for one whose stickers go up or down, a top or bottom layer for one whose
stickers go across. It is said again when turning the whole puzzle changes it. Checked
against the real motion of that sticker for every face turn in 400 random views of each
puzzle: the way agreed in all 15,186. ⚠️ An earlier version read the way off the axis alone
and was wrong for about one move in twenty-five once the view was tilted, because the axis
only agrees with what the reader sees while the view is square on. On the pyramid the
corners are named top, back, and left or right of each other.

**The layer to turn rocks towards the way it should go**, about sixteen degrees and back,
then rests, and is a shade brighter. It is drawn exactly like a turn - the plates open, the
light follows - and it is only ever a picture of one: a press puts it back before a hand can
take hold. A solve made with a hint is not a record, and the panel says so.

### The stage is a height, not a ratio

⚠️ **Stacked, `.cube-stage` takes its height off `.cube-frame`'s width in `cqi`, and must
not go back to an `aspect-ratio`.** A `max-height` on an element with a ratio is carried
across the ratio to its width, so on a short screen the stage narrowed to keep 16:10 and sat
in the left two thirds of the shell with nothing beside it.

**From 64rem the scene fills the whole board column**, standing in for the shared play
surface, and `.cube-frame` is `display: contents`, so the scene, the hint card and the burst
become items of the stage. The scene is 2048's board budget plus its margin -
`min(44rem, max(22rem, 100svh - var(--game-reserve))) + 2 * var(--stage-gap)` - so the two
stages are the same height, and at 1440x900 the sphere the puzzle turns in is 465px across.
The menu column holds three figures sized to their text, one row of buttons (Sound, Hint and
Undo as icons, Scramble with its word), the puzzle picker three by two with the pyramid
across two cells - dropping the best times, then the names, then becoming one strip of five
as the column gets shorter - and the hint line. The hint card covers the picker and the
hint line together. Stacked, the picker comes after the scene in the markup, so a phone
opens on the figures, the buttons and the puzzle.

⚠️ **The side-mode scene must have an explicit height.** Stretched to its row, or at
`height: 100%`, Chrome resolved `cqh` against the size-contained height, which is zero,
every sticker and the perspective came out 0px, and the puzzle drew as one black triangle.

The scene and its thumbnail share one wall-to-floor linear sweep; the radial pool of light
under the puzzle is gone. In dark mode the studio takes a 1px edge and the puzzle icons a
ring, because the black plastic merged into a near-black page.

⚠️ **The puzzle icons size their padding and gaps off `--s`, not in percentages.** A
percentage of padding is taken from the *parent's* width, which here is the whole tile, and
it left the colours a quarter of the icon wide.

### Four in a Row: a toy in a studio

The board stands in a studio drawn the way a toy is photographed: one light high on the
left and a backdrop that sweeps from wall to floor in a plain linear gradient, with the
board's shadow under it. The board is the one loud thing, and everything round it is quiet
so that it can be.

**The page uses the family's side stage, and the studio fills the board column** edge to
edge. The score is the cobalt figure across the full width of the menu - you, the tally,
them - with whose move it is as its label, the side to move ringed by a breathing ring. The
five status sentences share one grid cell and only one is visible, so the cell is always as
tall as the longest and the score never grows when a game ends.

**The opponents are the stage's fill, after the board in the markup**, so a phone opens on
the score and the board, with the picker under it, and on a desktop they sit under the
score and the buttons. Beside the board they are four rows - the chess piece (a pawn, a
knight, a rook and a queen, since the titles are a chess ladder), the name and the rank
marks - because a podium of quarter-width blocks could not hold the single-word
"Grandmaster", "Großmeister" or "Velemajstor". ⚠️ The fieldset needs `height: 100%` there:
its anonymous content box otherwise treats the height as unknown and the `1fr` rows
collapsed to 12px at 1280x800.

⚠️ **The plastic is an SVG laid over the discs, not a background under them.**
[FourFace.astro](../src/components/games/FourFace.astro) is one path - a rounded frame with
42 holes cut in it by `evenodd` - and a disc is 0.86 of a square against a hole of 0.78, so
its rim is always behind the plastic and a falling disc passes behind the bars between the
rows. A CSS background with holes was the first idea and cannot do the frame: a repeating
hole runs on into the border, and stopping it there takes three mask layers composited
against each other. `.four-board` itself has no background at all, which is what makes the
holes holes: what shows through an empty one is the studio behind, barely tinted by
`.four-back`, the way the real board is see-through.

**What makes it plastic** is all in that one drawing: a gloss along the top edge, a bevel
round every hole that is dark where it faces down and light where it faces up - one
`<circle>` per hole stroked with a gradient in `objectBoundingBox` units, so every hole is
lit the same way - and inside each hole the shadow its own rim throws on the disc behind
it. The face also casts a `drop-shadow` into the holes, which puts the plastic in front of
the discs rather than level with them. A disc is a domed gradient with a raised rim of two
inset shadows, a recessed face with concentric grooves in fractions of its own radius, and
one glint.

⚠️ **The board's thickness is a strip along its bottom edge and nothing more.** It sits
behind everything on the board, and the first version was a slab the size of the board:
it showed through every hole, and every empty hole looked filled with navy. For the same
reason each foot starts 12 units above the board's edge, below the corner holes, which
end 29 above it.

The order inside `.four-board` is the design: the feet and the edge, the back, the discs,
the face, the winning lines, and the seven column buttons over all of it, reaching up over
the space above the board so a press on a hole, a bar or the air above is that column.

⚠️ **One number sizes the board.** `--cell` is declared on `.four-well`, an inline-size
container, as a 7.36th of its width - seven squares and a frame of 0.18 each side - and
resolved on the children, for the reason `--u` is on the cube's stage. In the board column
the board is `--four-w`, `max(20rem, (100svh - var(--game-reserve) + 2 * var(--stage-gap) -
0.25rem) / 1.2)` - everything from the space above the board to its feet is 1.2 of its width,
and a bottom row below the fold is a row you drop into blind; the two stage gaps come back
because the studio keeps no margin - capped by the studio, an inline-size container, at
`(100cqi - 2rem) / 1.14`, the 1.14 being the feet, which spread half a square past each side.
Stacked, the well is `min((100% - 0.5rem) / 1.14, 34rem, (100svh - 6.5rem) / 1.2)`.

⚠️ **"Play again" hangs in the space above the board**, absolutely placed in the well and
shown only when a game has ended, rather than taking a row of its own. As a row, the scene
grew by a button's height the moment a game ended and pushed the board down under the last
disc.

⚠️ **The dimming at the end is opacity alone, and only a little.** A yellow disc taken
further back, or desaturated, turns mustard against the dark theme's navy - the one colour
on the board that reads as dirty rather than dim. The same limit keeps the badges not
chosen blue rather than grey.

**The thumbnail is a product shot rather than a crop**: the whole board on the studio
floor, three discs standing on their edges in front of it, and a red disc half through the
slot over the fifth column. ⚠️ The discs stand rather than lie in a stack: a stack of red
and yellow seen from the front was a hamburger. The position is one a game could reach, six discs each and red to move, and the
disc going in is the one that finishes the diagonal.

### A disc falls under gravity, not for a duration

A fall of six squares and a fall of one cannot share a duration, so `fall` in
[game.ts](../src/games/four/game.ts) works the time out from the distance: square root, with
`GRAVITY` set so the longest fall takes about four tenths of a second. The disc then
bounces twice, to at most 0.16 of a square and then a fifth of that. The keyframes are
`translate` in pixels through the exact Bézier halves of `t²`, so the curve is free fall
rather than an easing that looks like it, and the win pulse is `scale`, so the two never
meet on one property. Three clicks land on the same three moments, read from the same
`fall`. A new game empties the board the way the slider under the real one does: every disc
drops out of the bottom at once, the lowest first.

⚠️ **The model moves when the disc leaves the hand, and the picture follows.** `play` has
run before the fall starts, so nothing waits on an animation, and a new game in the middle
of one costs an element rather than a state to unwind.

### The opponent keeps its own score as it goes

The board has 69 lines of four. A `Position` counts each colour in each line and keeps
every line's worth and their total, and a disc changes only the lines through its square -
13 at most - so a win is a count reaching four, a threat is a three next to an open square,
and the value of a position is a running total rather than a sum at every leaf. The worth
is 1, 4 and 16 for one, two and three discs in a live line, and a threat whose open square
is on its owner's rows is worth 12 more: with perfect play the side that went first ends
up with the odd rows and the other side with the even ones. Checked against a fresh sum
after 2,000 random games of play and undo, and against a brute force scan for wins over
3,000, with no difference in either.

⚠️ **The search never runs on the game's own position.** Running out of time is an
exception thrown from twelve moves deep, and every disc dropped on the way down was still
on the board when it reached the `catch` - a column that filled itself. `chooseColumn` copies
the position first.

The four opponents, weakest first, and what they cost:

| | how it chooses | time a move |
|---|---|---|
| beginner | its own four three times in four, otherwise a column weighted to the middle | nothing |
| amateur | three moves ahead: a win, a block, never a gift, then anything within 12 of its best | under a millisecond |
| master | seven moves ahead, among the moves within 3 of its best that do not lose by force | about 3ms |
| grandmaster | iterative deepening with a table of 262,144 positions until `THINK_MS`, 320ms | 13 to 15 moves ahead from the opening, and from about the sixteenth disc a known result |

Measured over sixty simulated games per pair with the first move alternating: the amateur
beat the beginner 60 times, the master beat the amateur 57, and the grandmaster
beat the master 57 and drew twice.

### Their turn starts at your landing

⚠️ **The choice is made the moment your disc hits, while it is still bouncing.** The bounce
is a compositor animation, so the grandmaster's third of a second on the main thread is
spent under a picture that is already moving. `REPLY_MS` from your landing is the beat
before their disc appears, however long the thinking took, since the weaker three decide
in milliseconds and a reply on the same beat reads as part of your move. Their disc then
glides to its column and sometimes stops over another one first. That stop is theatre, and
the write-up on the page says so.

⚠️ **The disc in hand is one element for both players, so the pointer moves it only on
your turn.** It moved it on theirs as well, and a mouse left over the board had their disc
following it about on the spot and then dropping into a column nowhere near it. `setAim`
keeps the column on every move and draws it only when it is yours, and `showHand` puts your
disc there when your turn comes rather than sliding it over from where theirs let go. An exchange, from your press to your next turn, takes
about a second and a half to two against the grandmaster.

### Sound, the burst and the jolt, shared by all seven

Every game has sound now, and every win throws a burst. Both are shared the way
[games/record.ts](../src/games/record.ts) is: the one thing that differs between games is
handed in, and everything else is written once.

| Module | Owns | A game hands it |
|---|---|---|
| [games/sound.ts](../src/games/sound.ts) | the `AudioContext`, one master gain, the switch, the gesture rule, a rate limit, and the two endings `fanfare` and `fall` | a `voices` object, one small function per cue, in `src/games/<slug>/sounds.ts` |
| [games/burst.ts](../src/games/burst.ts) | the confetti pieces and their lifetime | its own palette, as `var(--…)` strings |
| [SoundToggle.astro](../src/components/SoundToggle.astro) | the button in every bar | nothing |

⚠️ **The context is only ever created inside a gesture.** `bind` listens for `pointerdown`
and `keydown` on the *window* - 2048 and the well take their keys from the whole page, so
the first arrow press has to be able to wake the sound it is about to make - and a cue that
arrives before any gesture is dropped. A context made on load starts suspended and logs a
warning for it, which is exactly what this avoids.

⚠️ **One switch for seven games**, stored once as `game-sound`. Turning the sound off in one
game and finding it on in the next is the thing a reader notices.

**The modules emit cues and never play anything.** Each game's module gains an `onCue`
callback, timed to what is on screen rather than to the press - a 2048 merge is heard when
it pops a slide later, a battleship shot when its round lands - and the page routes it to
the engine. Whether there is sound is the page's call, and the engine drops the same cue
inside 40ms of itself, because a flood in the minefield or a chain in the well can ask for
one sound many times in a frame.

**What each game sounds like, kept sparse on purpose:**

| Game | Cues |
|---|---|
| 2048 | a soft slide on every move, a merge pop climbing C major pentatonic with the tile, a fanfare at 2048, a fall when stuck, a reversed slide on undo. A push that moves nothing is **silent** - it would nag a player shoving a full board |
| Minesweeper | a tick for one cell, a sweep for a flood whose length follows the count, a high note for a flag and a lower one taking it off, a boom for a mine. Worked out in one place, `heard`, from the counts before and after a press, since a chord calls `reveal` eight times |
| Memory | paper for a turn and for the deal, two notes a fifth apart for a pair, one falling note for a miss |
| Accretion | a rush of air for a drop, a merge note falling down the pentatonic as bodies grow, a shimmer over a boom when two Suns go off. Two merges on one frame are one sound, the bigger |
| Cube | two clicks a few milliseconds apart over a short low knock when a layer lands on its step, and a third click for a half turn. A faint tick at each step a drag passes, a softer click for a layer let go short of a step and falling back, a rattle for each turn of a scramble over a rush of air, and the fanfare 0.12s after the last click |
| Four in a Row | three clicks of plastic for a landing - the hit and two bounces, each quieter, on the moments the disc is drawn at - over a knock through the board, harder for a longer fall and a few semitones higher for yellow. A slide for a disc let go, a rattle for the board emptying, a knock for a full column. The endings are `delayed` 0.28s, past the bounces |
| Battleship | a thump when a round leaves, then a splash, a blast or a sinking where it lands - theirs the same at 62%, which is all "further away" has to mean - and a lift, a clunk and a tick while placing. Both endings are `delayed` 0.45s so they do not land on top of the last sinking |

**The polish that came with it.** The burst on every win, in 2048's ramp, the minefield's
numbers, the planets, the five hull paints and the two discs over the board's blue. `.game-quake` on the minefield when a mine
goes off, on the well when two Suns go off and on the battleship table when a ship sinks.
2048 leaning towards the wall a push hit, and its 2048 tile catching the light once.

⚠️ **The battleship jolt is on `.bs-frame`, outside the tilted scene.** A `translate` on an
ancestor of a `preserve-3d` context is harmless, while anything on the chain down to a hull
flattens the fleet onto the water - see "The tilt has no perspective in it".

⚠️ **A pressed-state rule has to name its button.** The minefield styled
`.ms-actions .cta-ghost[aria-pressed='true']` as flag mode, and the sound switch beside it
is pressed whenever the sound is on - so it came out red. The rule now selects
`[data-action='flagging']`.

**Accretion's well stands in the board column from 64rem**, sized to the screen:
`--acc-h: clamp(22rem, 100svh - var(--game-reserve) + 3.5rem, 52rem)` and the width through
the well's own 1200 : 1650 ratio, 445 by 612 at 1440x900. The 3.5rem is the room the
reserve keeps under a board for the stage's foot: the well takes it so its smallest bodies
are a tenth larger, ends 18px above the fold, and only the stage's lower edge is below it. The column around it reads as space -
`--game-surface` is the well's own dark tone, with a nebula glow on the stage's `::before`,
in both themes - and the well takes a starlit edge and a halo there, because its walls are
what the bodies roll against and a 1px edge vanished on that ground. Next has a row of its
own in the menu, the label at one end and the planet and its name at the other: three
figures across the column could not hold "Mercury" or "Als Nächstes".

**The sequence is a ladder in the menu column**: two columns of five read downwards, each
body beside its name, every rung a size container so the body is the rung's height. Where
the column is short - its content box 15rem or less, at 1280x800 or where a French or
German hint takes a third line - it falls back to five by two with the names under the
bodies. A body the game has reached springs to full opacity and its name to the ink.
⚠️ `.acc-panel` and the strip re-declare their palette from the panel tokens, with no blur,
because the well is dark whatever the theme says.

⚠️ **Battleship's missile animation must never be gated behind a reduced-motion query**:
the module removes each round on `animationend`, and the global blanket shortens it to
0.01ms, which still fires the event. The splash and the ring stay ungated for the same
reason.

**Battleship keeps a stacked stage** - two waters side by side are the shell's width - and
everything above them is a menu of four groups, parted by space rather than stretched to
meet: the opponent legend, the four on a tray of the inset grey and the note, then the
figures on a tray at the row's left end and the two groups of buttons, each on a tray, at
its right end, with the room between them as the separation. A hairline under the menu
parts it from the waters. ⚠️ **Nothing in the menu stretches**: with the figures' tray grown
to the buttons and the opponents' spanning the stage, four trays read as two grey bars edge
to edge, which is the "all merged" the menu was rejected for. The two button groups share
`.bs-buttons`, so when the placing group wraps (1024 in German, a tablet) it lands under
the other, flush right, not at the left edge. The figures' counts keep two digits' room, so
9 to 10 does not move anything. `--bs-reserve` is 20rem and deliberately not
`--game-reserve`: it is what has to stay on screen with the waters once the stage is
scrolled to the figures, so on any screen about 870px or taller the width sets the square - 54px
at 1440 - and on a shorter one the height does (48px at 1280x800, 45px at 1366x768), and the
waters and their fleets are whole once the figures reach the header. Whole on load at
1440x900 would have meant 39px squares.
⚠️ Its figures, and the cube's in the menu, set `container-type: normal`: shared.css makes
every figure an inline-size container, and these two need a figure sized by its own text.

---

## 10. The pages

Each page is a sequence of scenes, no two composed alike, with one memorable thing - and every
row still fills its columns.

### The homepage

[Home.astro](../src/components/Home.astro), styled by [home.css](../src/styles/home.css)
(and project.css for the Projects section).

- **The hero is one ink stage set like the cover of a magazine**: the role with its signal
  dot and the place ("Niš, Serbia", `hero.location`), then the name as the masthead, one
  line across the whole stage (§4), and under it the lead, the buttons and the stack on the
  left with the portrait framed at its own 3:4 on the right. The stage carries a studio
  light - a cobalt glow behind the portrait falling off to the ink, and a faint wash where
  the masthead starts - there for the reason a photographer puts one behind a sitter.
  Skills lights its Backend with the same cobalt (§10).
- **The buttons** are one row where they fit. Under 40rem they do not, and wrapped they
  left GitHub alone on a second row, so there Contact me takes a row at full width and
  LinkedIn and GitHub share the row under it, half each.
- **The tray** is a wrapping row whose tiles grow, with a basis of a sixth of the row less
  its gaps and a pixel, so eleven always set six and five from a tablet up and sit along the
  foot of the left column, level with the portrait's foot. ⚠️ A basis in rem set eleven in
  one row at 64px beside the portrait, where "MongoDB" broke in two, and eight and three on
  a tablet. On a phone it is four to a row, 4, 4 and 3. Two rows would be six across at
  about 48px, too narrow for "MongoDB" at the 11px floor.
- ⚠️ **The portrait is never cropped in CSS.** Its frame is the photograph's own ratio to
  three decimal places, so `cover` crops nothing; framing it at any other ratio cuts the arm
  off at the edge or the head in half on a phone. It is not stretched to the row's height.
- **The portrait is the page's largest paint**, so two things about it are there for LCP.
  It is emitted at 360, 600 and 730 wide with a `sizes` that follows the layout, because a
  phone was sent the 730 for a frame 340px wide (the 600 is for the 1.75x phone Lighthouse
  emulates). And ⚠️ **nothing in its entrance hides it**: the whole photograph is there from
  the first frame, in colour, and pulls back out of a zoom and a blur. A browser
  does not count a paint it cannot see, and a reveal from fully clipped held the LCP back
  894ms, so a clip, a mask or an opacity fade on it costs the score. webp rather than AVIF,
  which came out larger at this quality.
- **About** is the opening statement across the full measure at display size, straight on
  the ground, taking its ink word by word as it is read (§5), then the other two
  paragraphs as tiles, labelled Education and Games, at 4 and 8 columns. The Education tile names the master's and its thesis only: both theses are on the
  Experience rail, with their links. It is lit the way the Skills groups are - a wash and a
  light of the accent from the top and its top left corner, an edge that catches it, a
  white rim - with its icon white on cobalt. The Games tile is on cobalt, the tile a link to the
  games, and under its paragraph are the seven games drawn small
  ([GameMinis.astro](../src/components/GameMinis.astro)), each a link to its game that opens
  into the board. Each plays one move of its game - two tiles merge, a field opens round a
  flag, a pair turns up, a moon falls in, a shot lands, the cube half turns, a disc
  completes a row - one after the next along the row on a shared 8s cycle, then the row
  rests: an arcade's attract mode. The wider column is the Games tile's so the boards can
  take the height between its paragraph and Education's, so the two tiles end level. The
  split is chosen for that (the measurements are in About.astro). On a phone the boards
  are four and three. They are drawings rather than the games index's thumbnails, which
  bring every game's CSS with them.
- **Skills is a diagram of the stack**, drawn with the request diagram's method (§6) but
  written in home.css, because flow.css is on the project pages alone. Frontend, Backend
  and Data sit in a row with a line through each gap, and Cloud & DevOps runs across the foot
  under a line down out of Backend. Backend is the ink tile, three marks by two: NestJS a
  feature down its first column with its mark at 88px, and the other four as a two-by-two
  beside it. **Every line has a head at each end**, because the answer comes back the way
  the request went, and on a 5s loop a packet runs out from Frontend to Data and Cloud and
  back home, each group lighting with a ring as a packet lands - Frontend and Backend twice,
  the second ring on `::before`.
  - **A group is lit the way its marks are**: a wash of the accent at the top of the tile,
    gone by the middle, and an edge that catches it - the accent along the top running down
    into the hairline, drawn as a gradient on the border box under a transparent border,
    since `border-image` drops the radius - with a white rim along the top. Backend is lit
    from above in cobalt on the ink, the hero's studio light, and keeps the brightest edge
    in the drawing. The stage has a faint light of the accent over the middle, and each line
    a faint glow of its own.
  - **Each group has a title bar**: its label across the tile to both edges with a hairline
    under it, and its icon white on a cobalt square. The label stretches to its row, so
    where groups share the row through a subgrid the hairlines run level whichever name
    wraps, and a name whose one word does not fit beside the icon drops under it
    (`flex-basis: min-content`) - "Données" in half a phone's stage. In the row the icon and
    the name follow the stage (30px and 16px where the row starts, where Frontend's bar is
    119px, up to 36px and 19px), and Cloud's title is a column instead, with a hairline down
    its right edge on Backend's left one.
  - **A mark's tile is lit in the mark's own colour**: a tint of it over the tile, a light of
    it falling from the top edge (a radial gradient), an edge of it and a white rim, so the
    drawing carries the colour the marks brought rather than eleven white boxes. More of the
    colour on the ink and at night, and SQL, which has no brand, is lit in the accent. The
    mark is 48px on a tile about 110px tall - the tiles were 380 by 170 round a 30px mark
    where Frontend and Data stretched to Backend's height. The hover is written in home.css
    rather than left to `.mark-tile:hover`, which ties with it on specificity.
  - **Every mark in the row is one width.** Each group holds two rows of marks, so the three
    come out level without stretching. `--m` is the stage (`100cqi`) less the two line gaps,
    six group paddings and borders and Backend's two mark gaps, over five; Frontend and Data
    are one mark and their frame, and Backend takes the rest (174px each at 1440).
  - **One markup, two arrangements**, by `@container skills (min-width: 52rem)`, about a
    960px window. Below it the drawing is a column: Frontend, Backend, then two lines down
    into Data and Cloud side by side. Backend is three by two from 36rem of stage; under
    that, on a phone, NestJS runs across the tile over a two-by-two. Every group and line is
    placed by grid area, so the markup keeps site.ts's order.
  - ⚠️ **Cloud & DevOps is a subgrid of the stage's columns** in the row. A subgrid's
    padding lands on the items in its edge tracks, so its label lines up with Frontend's
    content, its marks start on NestJS's left edge and end on MongoDB's right one. The label
    spans the gap after Frontend too, so it holds one line at 1000px. The three in the row
    share their label and marks rows through a subgrid, and so do Data and Cloud in the
    column, where "Cloud & DevOps" wraps.
  - The gaps are grid tracks rather than `gap`, so each line's area is exactly the gap it
    crosses.
  - ⚠️ **It arrives whole**, the stage one `reveal` like any block. Built group by group
    along the flow as it scrolled in, the loop ran ahead of it: a packet reached the end of
    Data's line with Data still to come, and the right of the row stood empty.
- **Experience** is one wide tile per role: the company's initial, the name and the title
  across the top with the period at the far end from 60rem, and the points under them,
  starting where the name does. Beside each other, the head took a column the height of
  the points and filled a third of it. A 2px rail runs from the first initial to the last, through the tiles and the
  gaps, and fills with the accent as the page scrolls; the current role's initial and
  period take the accent, the period's dot is the signal and pulses so "2024 -" reads as
  running, and an
  initial the rail has reached takes an accent ring. Stacked, the bullets' checks sit on
  the rail as its stops.
  - **The tiles are lit the way the Skills groups are**: a wash of the accent at the top,
    an edge that catches it (a gradient on the border box) and a white rim, the current
    role harder, from its top left corner. The current initial is white on solid cobalt
    with a glow of its own blue, the others a lit fill inside their ring, and the checks
    and the icons are on cobalt too.
  - **From 60rem each point is a recessed tile** lit the way the thesis is, two across
    with an odd last one across both, so no row stops short, and from 84rem, where the
    shell stops growing, all of a role's points in one row (`auto-fit`), three across for
    Ncoded. Three across any narrower set a point under 35 characters a line. Stacked they
    are parted by hairlines on the tile, since a tile would cut the rail through their
    checks. The text is a step darker than the muted ink.
  - **The thesis runs the tile's width** from 60rem, so it is two columns: the label and
    title on the left, the tagline on the right past a hairline. It rises to meet the
    pointer, its edge taking the accent.
  - **"Education" is a chapter heading**, in the names' display voice a size under them,
    and its 2.75rem icon is a stop on the rail, centred on it, halfway down a gap of
    `--chapter` 4.5rem.
  - ⚠️ **Each tile draws its own stretch**, because a tile paints over everything the tile
    above it draws: `-out` from its initial to its bottom edge, `-in` from the tile above,
    across the gap, to its initial. The gap is the lower tile's - drawn by the upper one it
    hung into empty space until the lower tile came in.
  - **One front, with nothing measured.** Every stretch fills on its own
    `view(50% 50%)` timeline, which shrinks the viewport to one line across the middle of
    the screen, so each runs empty to full exactly while that line crosses it, and
    together they read as one line filled to the middle. Linear, or the front drifts.
  - **The tiles slide in off the rail**, from `cover 150px` to `cover 400px` - later than
    other tiles, which were in place before anyone looked at them - and the rail does not
    slide with them: `rail-hold` undoes the tile's translate on the tile's own `--role`
    timeline, so the line stays put and the tile comes in under it.
  - At rest, or without scroll-driven animation, the rail is whole and every initial it
    reaches is lit.
  - **The degrees are the rail's second chapter**, not a section of their own: under an
    "Education" caption on the rail, in a wider gap (`--chapter`), each with the school's
    crest at the initial's size and place, lit with an outline as the rail reaches it, and
    its thesis where a role has its points - a recessed tile, the whole of it a link to the
    project, with the label ("Master's thesis"), the project's title and its tagline.
    Which project each thesis was is `thesis` on the degree in site.ts. On a phone the
    thesis starts at the name's edge, clear of the rail, and drops its tagline.
- **Projects** is the one full-width dark stage in the middle of the page (`tone="panel"`
  and `class="theater"`, on `--site-stage`), and on it the projects as a deck of case
  studies (see "Project cards" below). A project with a measured result leads with it,
  after its description: the figure large in the project's hue on a trace, and the words
  round it with what it is compared with - `outcome` in site.ts, `projects.outcomes` in the
  dictionaries.
- **Services** is a list, not a grid: four rows across the measure, each the service's icon
  and name at a large tile-title size, then what it covers with the technologies it is done
  in under it, and at the row's far end "In practice": the place on the site it is shown
  done, a project's page or the role in Experience where no project is. Read down, the
  names are the list, and read across, a row is the whole claim and its proof. A row is lit
  the way the roles are (a wash of the accent at the top and a light from its top left
  corner, an edge that catches it, a white rim), and its icon is white on cobalt as the
  Skills groups' are. The proof is lit the way a Skills mark is lit in its brand, in the
  colour of what it points to: a project's proof carries the project's `data-hue`, so
  Easy Breathe's is green, and a role's is `--hue-plum`, the same for both companies and apart from every project's hue. Under the pointer a trace draws
  down the row's left edge, the edge takes more of the accent and the icon tips. The tags
  and the proof are `services` in site.ts, by position, checked against the dictionaries at
  build. ⚠️ **Not
  four across and not two by two**: in a row of four the first description ran twice the
  others and the tiles beside it stood with up to 229px of nothing above their proof, and
  four equal icon-and-text tiles were the template look. Stacked below 64rem, the icon
  beside the name and everything else under the two.
- **Contact** is the close, on ink: the intro at display size on cobalt with Contact me and
  a white wash from the button's corner, beside the three channels as the rows of one tile,
  each row the whole target.

### Project cards, on the homepage and the index

One card shape, the **case**, in [Projects.astro](../src/components/Projects.astro) and
[ProjectIndex.astro](../src/components/ProjectIndex.astro), styled by
[project.css](../src/styles/project.css). They repeat their markup rather than share a
component: the heading level and the arrival differ, and two similar blocks are not
duplication worth an abstraction.

- **A case** is the project's request drawn large (`FlowMini`, in the project's hue) with
  its technologies as tags under it, beside the year on a tint of the hue and the context,
  the title, the tagline, the description, the measured result and "Read the write-up". 5 :
  7 from 64rem, the words and then the drawing, which is what gives the drawing the 30rem it
  is drawn left to right from. Stacked on anything narrower, the drawing comes first.
- **On the homepage the cases are a deck.** From 64rem wide *and* 44rem tall, each card is
  `position: sticky` under the header, 0.875rem lower than the one before it (`--i`, its
  place, written inline), and as tall as the room under the header allows up to 40rem, so
  the cards are one size. As the next card comes up over it, the one underneath steps back
  to 0.94 and dims towards the stage (§5), and the strips of the ones before show above it
  like a hand of cards. Past the last card the deck ends and the whole hand scrolls away.
  Every card is in the normal flow: it is read and tabbed to in order, and stickiness only
  decides where it waits.
  - ⚠️ **The two guards are load-bearing.** A sticky card taller than the screen cannot be
    scrolled to its foot while it is stuck, so below 44rem of height, or on a narrower screen
    where a case is a column, the cases simply follow each other.
  - ⚠️ **A card with keyboard focus comes to the front** (`z-index` on `:focus-within`).
    Tabbing backwards lands on a card stuck under the next one, which the browser counts as
    on screen and does not scroll to, so the ring was drawn under the card on top.
  - ⚠️ **The deck names six timelines.** A seventh project would not step back when the one
    after it came. The list in `timeline-scope` is where to add one.
  - `.surface` puts each card back on the theme's own paper on the ink stage, so its
    drawing - which has an ink core of its own - is drawn exactly as on the ground.
- **On the index the cases are spreads**: one after another down the page, each with the
  page's width to itself, the drawing alternating sides, coming in from its own side as
  the card arrives. The first is in view at first paint, so it enters on load.
- ⚠️ **"Read the write-up" is a styled span, not a link.** The card's title is the stretched
  link, and a second anchor would be announced twice; the span draws its full underline when
  the card is hovered or its title has keyboard focus.
- The first case's drawing runs its request from load, and the others run theirs when the card
  is picked up.

### A project page

[ProjectDetail.astro](../src/components/ProjectDetail.astro), styled by project.css and
flow.css.

- **The whole page is in the project's hue** (`data-hue` on the `<article>`): every trace,
  the request diagram, the step numbers, the result bars. The header and the footer are
  outside it and stay the site's own.
- **The head**: the crumb, the title rising into its mask, the tagline, and Year, Context and
  Domain as a **title block** - the boxed table in the corner of an engineering drawing that
  says what the drawing is, when and for whom: one tile ruled into three cells (3 : 5 : 4
  from 40rem), the year large in the hue on a tint of it with a trace down its edge. One
  record, so one tile rather than three.
- **The request diagram** on the band (§6).
- **Demo**, where the project has one (`demo` in site.ts, Object Detection only): the
  screen recording in a tile with a narrow frame, controls, no autoplay and
  `preload="none"`, so the page pays for the 153 KB webp poster and nothing else until
  the reader presses play. After the diagram, which names what the recording shows side
  by side, so every project page opens on the same two things. The poster is a frame
  with the pointer taken out. The clip is on R2, not in the repo
  (routing-and-deploy.md §5).
- ⚠️ **Tile rows are split at build, per locale.** `place()` scores every split of a row's
  columns by the estimated height of the text in each tile, and keeps the split whose shortest
  and tallest tiles come closest - so the steps, the features and the results notes finish
  level in German as well as in English. The rows run on 24 columns from 64rem and 12 from 40rem, twice the bento's count,
  so a split can land between twelfths while every outer edge still lines up. No tile gets
  less than 7 of 24. The estimate's assumptions (a tile's detail 16px at 0.43em a character, and so on)
  are beside the function; change the type and they have to move with it.
- **Architecture** is the five steps as a numbered sequence, 3 + 2 on a desktop and 2 + 2 + 1
  on a tablet, never two columns with a lonely fifth. Each step's accent disc has a line that
  runs across the gap to the next tile in its row and lands in an arrowhead, drawn as the
  row scrolls in; on a phone it runs down the gap from disc to disc. ⚠️ **A tile that ends
  its row has no line**, and on a phone none has one across: stopped at the tile's own edge,
  it led nowhere.
- **Results** is the table in a tile with the figures made visible: every ratio or time cell
  has a bar under its number (a ratio out of 1, a time as its share of the slowest run), and
  the best figure in each column - the highest ratio, the lowest time, never a count - is in
  the accent. The row-name and count columns are as narrow as their text, so the measured
  columns get the width and the bars read as a chart. On a phone the table scrolls inside
  its tile, with a sticky name column and a shadow at the right edge that disappears when
  the last column is reached.
- ⚠️ **The bars sit inside the table's own scroller**, so an anonymous `view()` would
  measure against that box and never run: the tile names its timeline (`--proj-results`) and
  the bars use it.
- **Overview** is text on the ground, not tiles: the opening paragraph across 7 of 12
  columns at a spoken size, and the rest beside it in the other 5 as a note on a trace in
  the hue, the way a margin note sits beside the text it qualifies.
- **Dataset and training** is a write-up in balanced columns on the ground, the paragraphs
  free to run from the foot of one column to the head of the next, indented where they
  start, so the columns end level. Not on the band: What it does right above takes it, and
  two bands in a row run together into one.
- **Technologies**, straight after the overview on every project page, is one tile per
  service, each a row of mark tiles, packed in order into rows and spanned so every mark in
  a row comes out the same width. A mark tile wider than 15rem sets its mark beside its
  name.
- **The takeaway** is on ink, its two paragraphs in columns, with All projects, and the
  footer's ask follows it on the same ink.
- The copy's spaced hyphen and the French space before `:` `;` `!` `?` are made
  non-breaking at render by `keep()`, the words unchanged, so no line starts with "- which"
  or a lone colon.

### The footer

The last scene of every page, on ink ([Footer.astro](../src/components/Footer.astro)). On
every page but the homepage it opens on **the ask**, `.foot-call`: Contact's intro at display
size with Contact me beside it (`call`, passed by [Base.astro](../src/layouts/Base.astro) as
"not the homepage", where Contact itself is the section right above and says the same).
Then the way back to every section, project and game - a link slides towards where it goes
behind a trace that draws in ahead of it - the channels, the languages, and the name as
wide as the page rising out of its floor, the accent sweeping across it once as it arrives
(a `background-clip: text` gradient moved by `word-sweep`, the letters' fill transparent
only where the clip is supported).

### The games index and the game pages

§9.

### The 404

[NotFound.astro](../src/components/NotFound.astro), styled by
[notfound.css](../src/styles/notfound.css).

**The three digits of the status are three tall tiles that drop in and bounce** - paper,
cobalt and ink, one each - beside a tile holding the heading, the body and the button. The
digits are set at the narrow end of Archivo's width axis, 62% at weight 900, because an
expanded 4 is too wide for a portrait tile; the numeral is `min(200cqi, 111cqh)` of its tile,
and `text-box: trim-both cap alphabetic` centres its ink exactly. The heading is sized in
its tile's own container so the longest first line in the four dictionaries, the Serbian
"Stranica nije", keeps every locale to two lines.

⚠️ **`place-self: stretch` on a digit tile is load-bearing on both axes.** A grid item with
an aspect ratio treats normal alignment as start, so without it the tiles neither followed a
taller text tile nor took their column's width - at 1024 in German they came out 195px wide
in 167px columns and overlapped.

⚠️ **The drop animates `translate` and `scale`, never `transform`**, with each keyframe
carrying its own timing function and the animation itself running linear: the fall eases in
to the impact, the squash spreads along the floor from a 50% 100% origin, and two bounces
settle it. `main:has(> .notfound)` makes main a column on the 404 only, so the composition is
centred in the space between the capsule and the footer on a tall screen.

---

## 11. Open items

| # | Item | Severity |
|---|---|---|
| 1 | **The hero repeats the full stack.** Eleven marks in the hero's tray answer what he works with immediately, and then Skills sets out the same eleven grouped a screen further down. It is deliberate - the hero should not need the reader to scroll to learn the domain - but the two are the same content twice and worth revisiting if the stack grows. | judgement call |
| 2 | **The games wall is composed for seven games.** The spans in [index.css](../src/styles/games/index.css) are set by position (6 + 6, 4 + 4 + 4, 6 + 6); an eighth game would sit alone at half width. | known limit |
| 3 | **Some boards are not whole on load.** Battleship's two waters and their fleets end at 1109 at 1440x900, so they need about 210px of scroll (54px squares were chosen over 39px ones that would fit). On a phone the head of every game page ends 350 to 400px down, so a board is whole once the stage is scrolled under the header. | known limit |
| 4 | **The project deck is written for up to six projects.** Each card's step back runs on the next card's named view timeline, and `timeline-scope` on `.deck` lists six names. A seventh project would stack but not step back when the eighth arrived. | known limit |
| 5 | **A project's hue is one of four.** `ProjectHue` in site.ts and `--hue-*` in global.css hold cobalt, berry, amber and green, one per project today. A fifth project repeats one or adds a fifth hue, with a light and a dark value checked against the contrast figures in §1. | known limit |

---

## Changelog

- 2026-09-30 - Accretion's card on the games index is drawn on the game's own sky, the
  stars generated once in games/accretion/sky.ts for both (§9).
- 2026-09-30 - the header lights Projects on the project pages and Games on the game
  pages, set at build (§7).
- 2026-09-30 - on a phone the hero's Contact me takes a row and LinkedIn and GitHub share
  the next, and Back to top is hidden below 64rem on every page, not only the games (§5,
  §10).
- 2026-09-30 - a service proved by a role is lit in `--hue-plum`, one colour for every
  company, rather than the cobalt that made Ncoded look like the object detection project
  (§10).
- 2026-09-30 - the project hues are cobalt, berry, amber and green: Encryptix moves from
  violet to berry and the Network Traffic Analyzer from teal to amber (§1).
- 2026-09-30 - Services and the Education tile are lit the way Skills and Experience are,
  their icons white on cobalt, and each service's proof is lit in the hue of the project it
  points to (§10).
- 2026-09-30 - a word of the About statement starts at 44% of the ink rather than 18%, so it
  clears 3:1 before the page reaches it and the homepage passes the colour-contrast audit (§5).
- 2026-09-29 - Experience is lit the way Skills is and sets its head across the top: the
  period at the far end, the points under it as tiles side by side, the thesis in two
  columns, "Education" a chapter heading whose icon is a stop on the rail, and the current
  initial, the checks and the icons on cobalt (§10).
- 2026-09-29 - a card in the project deck steps back only once the next one reaches its
  foot, not as soon as the next one enters the screen (§5).
- 2026-09-29 - Skills lights every mark's tile in the mark's own colour and every group
  with the accent, gives each group a title bar with its icon on cobalt, lights Backend in
  cobalt from above, sets the mark at 48px on a tile about 110px tall, and Backend as three
  by two with NestJS a feature down its first column, so no group stretches and every mark
  in the row is one width (§3, §10).
- 2026-09-29 - the trace is drawn only from "Projects" into All projects. Run out of every
  section title and down onto the first tile, it pointed at nothing a reader could name
  (§3, §5).
- 2026-09-29 - the site redrawn as the systems it is about: the trace (the request
  diagram's connector) runs out of every section title and down onto its first tile, along
  the header as a reading gauge, and into a footer link. The homepage is a sequence of
  scenes - a masthead hero with the stack lit by a passing signal, the About statement taking
  its ink word by word, the projects as a deck of case studies on a dark stage that stack as
  they are read, Services as rows, and Contact. Every project has a hue its card and its page
  are drawn in. A project page opens on a title block and sets its overview and dataset as
  text on the ground. The footer opens on the ask on every page but the homepage. The games
  index drops its title's letters in and each card glows in its game's colour. Pages change
  scene with a root view transition. New: `--paper-*`, `.surface`, `--site-signal`,
  `--site-stage`, `--site-radius-stage`. The width axis is never animated, and CLS is 0
  (§1-§5, §9, §10, §11).
- 2026-09-28 - the hero steps back from 60rem only, and the phone footer's rules come after
  the footer's own, which had kept the email over the name (§5, §10).
- 2026-09-28 - the site a size smaller: display type, leads and card padding down about a
  sixth, body 16/17px, and a tile's detail a step under the page's text in the muted ink so
  a row reads as its titles. A project page lists its technologies straight after the
  overview (§2, §10).
- 2026-09-28 - a project page shows a Demo section after its request diagram where the
  project has a recording, Object Detection's (§10).
- 2026-09-28 - the Games tile in About draws the seven games small, each playing a move,
  Education is the Experience rail's second chapter, a project card leads with its
  measured result, the ⌘K command menu opens anywhere, and the footer on a phone leaves
  the sections to the header's menu (§7, §10).
- 2026-09-28 - the Skills diagram arrives whole with its stage's reveal instead of building
  group by group, which let a packet run to a group not yet there (§10).
- 2026-09-28 - Education carries each thesis as a link to its project, and About no longer
  repeats the bachelor's; Services is two by two with tags and a proof per service; the
  hero's tray is four across on a phone; a step that ends its row draws no line (§10).
- 2026-09-28 - the hero steps back as the page scrolls past it: the tile shrinks a little
  and the portrait a little more (§5).
- 2026-09-28 - Experience is a timeline: a rail from initial to initial that fills to the
  middle of the screen as the page scrolls, with the tiles sliding in under it (§10).
- 2026-09-28 - the theme toggle uncovers the new theme as a circle growing from the button,
  through a same-document view transition (§5).
- 2026-09-28 - a project or game card opens into its page: the title grows into the page
  title and a game's picture into its board, by paired `view-transition-name`s (§5).
- 2026-09-28 - the request diagrams' packets run their lines by `offset-path`, round every
  corner on the curve at one speed, and hand over at a join without fading or slowing;
  the keyframes are by role and the story tables' windows are split by line length (§6).
- 2026-09-28 - Skills is a diagram of the stack: Frontend, Backend and Data in a row over
  Cloud & DevOps, joined by double-headed lines that a packet runs out and back along on a
  loop, Backend on ink, and the marks a size smaller (§1, §3, §10).
- 2026-09-27 - `canvas-ink` runs on the body, and `main` paints the ground: WebKit takes
  the page colour from an opaque body, so on `html` it changed nothing on an iPhone (§8).
- 2026-09-27 - the canvas turns to the footer's ink at the end of the scroll, so Safari 26's
  bottom bar and the bounce past the end match the footer instead of the ground (§8).
- 2026-09-27 - the browser's `theme-color` follows a theme chosen with the toggle, not only
  the system's: the scripts switch the two tags' `media`. That closes the open item it was,
  and the rest are renumbered (§8, §11).
- 2026-09-27 - Battleship's menu is four groups parted by space: the opponents on a tray
  between their name and the note, the figures as wide as their words at the left end, the
  buttons at the right end in `.bs-buttons`, and a hairline over the waters. `--bs-reserve`
  is 20rem for the taller menu. The French spacing typo in Minesweeper's how-to-play is
  fixed, which closes that open item (§9, §11).
- 2026-09-27 - Skills is a size smaller (2.1rem marks on 85px tiles, 399px against 478 at
  1440), the portrait's entrance shows the whole photograph in colour from the first frame,
  pulling back out of a zoom and a blur, beginner Minesweeper's cells are capped at 2.75rem
  (444px against 553), and Accretion's well takes the stage foot's 3.5rem, 445 by 612
  against 404 by 556 (§5, §9, §10).
- 2026-09-27 - game first: on every game page the board takes the wide column on a play
  surface and the menu is a narrow column beside it (or two compact rows above Battleship's
  waters), the head is compact with the lead beside the title, and every board is sized by
  one shared `--game-reserve` so it is whole on load at 1440x900. The menu tightens in its
  narrowest width and the board is top-aligned in its column (§9). The project cards' flow
  picture names every node in the reader's language with the page diagram's arrows (§6). The
  Latin font is preloaded and the portrait ships at three widths (§4, §10): mobile Lighthouse
  99 and desktop 100 on the build.
- 2026-09-27 - full visual redesign: ink, paper and cobalt set as a bento of tiles. New
  palette and a cobalt surface (`.tile-cobalt`) beside the ink panel; one 80rem measure for
  every section and page instead of six widths; bigger type everywhere, with the hero's name
  sized by its column in `cqi`; the tile family, mark tiles ([MarkTile.astro](../src/components/MarkTile.astro))
  and a 12-column bento; a floating header capsule and a full footer; headings rising into
  masks, reveals that rise 48px, and no keyframe on `transform` (§1-§5, §7, §10). The request
  diagram is rebuilt as HTML and CSS tiles with technology marks from `flowTech`, border
  connectors with arrowheads, an assembly that finishes once the diagram is on screen, and a
  packet loop; `diagram-tokens.ts` and `diagram-layout.ts` are gone (§6). Every game page
  shares one chrome - head, stage with a side HUD, one-size buttons, numbered how-to-play rows,
  build notes - and the games index is a 2 + 3 + 2 wall with a status pill and a beat of each
  game on hover (§9). CSS is split by page area (`home.css`, `project.css`, `flow.css`,
  `notfound.css`), and `theme-color` now matches the page ground.
- 2026-09-24 - Four in a Row redrawn as a toy in a studio: a sweep for a backdrop, the
  board glossy with a bevel and a shadow in every hole, feet on the floor, discs with a rim,
  grooves and a glint, the score inside the scene, the opponents as four chess pieces in a
  row, and a thumbnail that is a product shot of the whole board. The opponent's disc no
  longer follows your pointer while it thinks, which is what made its move look jerky (§9).
- 2026-09-24 - a seventh game, [Four in a Row](../src/games/four/game.ts): a seven by six
  board against four opponents, from a beginner that plays near the middle to a
  grandmaster that deepens its search for a third of a second, each beating the one below
  in 57 to 60 of 60 simulated games. The board is a drawn face over the discs, a disc falls
  under gravity and bounces twice, the board empties through the bottom for a new game, and
  the opponent's disc glides to its column. §9 records the layers, why the face is SVG,
  the running score and the parity rule in the evaluation, why the search works on a copy,
  and `--four-*`, the seventh place the palette opens up.
- 2026-09-24 - a cube drag turns the layer the finger is going along. The way each layer
  would go is read along the face, which 13 of 72 drags in the opening view got wrong
  before, the bottom row to the right among them, a layer still landing lands before the
  pressed sticker is read, and the way is picked after ten pixels and only when it is
  plain. The rate is fixed for the turn, so a steady finger turns the layer steadily (§9).
- 2026-09-24 - a cube hint opens with the move in plain words - which layer, by where it is
  on screen, and which way its stickers go - worked out from the view and checked against
  the real motion in 15,186 cases. The sentences under it now say why rather than what (§9).
- 2026-09-24 - the cube has hints on the 2×2, the 3×3 and the pyramid, from
  [hint.ts](../src/games/cube/hint.ts): the next move of a method people are taught, with
  its step, its piece and its sequence, the layer rocking the way it should turn, the
  puzzle turned to the way the method holds it, and a solve with hints kept out of the
  record. §9 records why the methods are taught ones rather than shortest solutions, how
  a plan is kept while the puzzle follows it, and how it was checked.
- 2026-09-24 - every game's CSS moved out of global.css into its own file under
  [src/styles/games/](../src/styles/games/), with the rules every game page shares in
  `shared.css` and the index grid in `index.css`, so a game's rules are inlined only into
  the pages that show it. They sit in a `games` cascade layer after `components`, which is
  what keeps a tie going their way now that Astro can place them before global.css. Every
  element's computed style was compared before and after on every game page, and nothing
  moved (§9).
- 2026-09-24 - a sixth game, [Cube](../src/games/cube/game.ts): the 2×2, 3×3, 4×4 and 5×5
  and the pyramid, as a `preserve-3d` scene of one element per sticker, on one engine that
  finds every turn from the geometry rather than a table. A drag turns one step at most and
  the sticker stays under the finger for the whole of it, the whole puzzle turns freely and
  coasts, and the stickers are lit from a light fixed to the reader. §9 records the four
  layers and what may not sit between them, why a sticker is placed by its slot, why the
  stage is a height rather than a ratio, and `--cube-*`, the sixth place the palette opens
  up.
- 2026-09-23 - Accretion's solver rewritten as a soft step, and what it looks like with it.
  No body balances on another, a heavy one no longer bounces off a light one, a pile at rest
  is still, and the line ends a game within half a second. Merges are drawn near full size
  from the first frame with the two halves sliding in, the next body in the aim is what Next
  shows, the aim line is gone, the well is up to 32.5rem with the bar beside it on a wide
  screen, and the well has a sky of four parallax layers. The table of what each rule
  prevents, measured, is in §9, along with why nothing placed by `transform` may take a
  `scale` keyframe, which had every drop and every merge sliding towards the corner.
- 2026-09-23 - sound and polish on all five games, from [games/sound.ts](../src/games/sound.ts)
  and [games/burst.ts](../src/games/burst.ts), shared like the record, with one switch for
  all of them. Each game's cues and what they sound like are in §9, along with the jolt, the
  2048 bump and shine, the minefield's flag-mode rule that turned the switch red, and why
  Accretion's bar is now two rows in every language.
- 2026-09-23 - Memory gained its feel: the cards of a turn are held up and a found pair
  lies back down with a gold edge, a glint crosses a back on hover, a gold line along the
  top of the table fills as pairs are found, the unlocked tile pops, and every moment has a
  synthesized sound behind a remembered toggle. The miss shake is checked against the turn
  it was scheduled for, which fixed a found pair wearing the red ring under very fast
  play (§9).
- 2026-09-23 - a fifth game, [Memory](../src/games/memory/game.ts): twelve levels from two by
  two to ten by six, a free play mode with every board open, and thirty pictures drawn as
  symbols in [MemorySprites.astro](../src/components/games/MemorySprites.astro). §9 records
  the three layers of a card and why the deal and the shake cannot share one, the turn as a
  transition with an overshoot, the table sized to the screen and turned a quarter on a
  portrait one without moving a node, and `--mem-*`, which opens the palette because the
  colour is the content rather than a signal.
- 2026-09-21 - the three opponents that search got harder and, more to the point, stopped
  searching the same way twice. The gunner and the captain no longer fire into a pocket too
  small to hold anything still afloat (60 shots to 55, and 51 to 50), and the captain's
  lattice takes its family and its phase from a plan drawn per game rather than from the
  file. ⚠️ **A fixed search is a solved search**: the captain used exactly 50 of the 100
  squares to open a game and the admiral used 8, with one square taking an eighth of every
  opening shot it ever fired, so one game taught you where to hide a fleet for good. The
  admiral now draws its opening in proportion to the count instead of taking the top of it,
  bounded to squares within an eighth of the best, which opens 32 squares instead of 8 for a
  mean that is unchanged at 44.7 and a worst game that improved from 73 shots to 66. ⚠️ Its
  mean is at the floor of this family of algorithms and several attempts to move it all
  landed inside the noise - the write-up is on `chooseShot` in
  [games/battleship/game.ts](../src/games/battleship/game.ts) (§9).
- 2026-09-21 - every ship in the fleet redrawn at production detail: the carrier gained an
  angled deck with its centreline, arrestor wires, two catapult tracks, deck-edge lifts and
  sponsons; the battleship triple turrets on barbette rings, an armour belt, deck planking
  and grated funnel caps; the cruiser and the destroyer a coamed launcher with real cells,
  panel arrays on the bridge and an approach line into the landing circle; the submarine a
  casing with limber holes, flood ports and a bridge cut-out in the sail. ⚠️ Detail is
  layered by contrast rather than by count, and a large light shape is the thing that breaks
  it - the carrier's sheer is now a strip along the deck edge and the battleship's citadel a
  hairline, where both used to be panes (§9).
- 2026-09-21 - all ten of Accretion's bodies redrawn. Craters are three layers with the
  shadow thrown back across the floor from the lit side, gas-giant belts are written out
  instead of repeated, albedo features are hard-edged ellipses unioned into a wedge, Saturn's
  ring has five rings and three real gaps and casts its own shadow on the planet, and the
  Sun runs hot in the middle to deep red at the limb with no repeating surface texture at
  all - every cheap way of writing granulation came out either woven or as polka dots (§9).
- 2026-09-21 - Earth's continents are real coastlines, projected. Two `clip-path: polygon()`
  rings of about seventy points from the outline in degrees, through an azimuthal equidistant
  projection centred on 22°N 34°W, with the inland seas traced as bays. ⚠️ Equidistant and
  not orthographic: orthographic piles everything past sixty degrees into the rim, which left
  Europe a smear. Nothing built from ellipses ever became a coastline - soft they are blobs,
  hard they are a chain of circles with the joins showing (§9).
- 2026-09-21 - `--acc-shade` split into `--acc-form` plus a specular. Earth's land is drawn
  over the ocean and re-applies the shading so it answers the terminator, and re-applying the
  whole stack put the glint off the water in the middle of North America (§9).
- 2026-09-21 - the back half of Saturn's ring is masked out of the planet's silhouette
  instead of relying on `z-index: -1`. ⚠️ It never worked: the `z-index: 1` that lifts Saturn
  over its neighbours makes it a stacking context, and inside one the element's own
  background paints before its negative children - so the far side of the ring was being read
  straight through the planet, faintly enough to miss until the ring had divisions in it
  (§9).
- 2026-09-17 - the wreck on Battleship's thumbnail sits one column further in, so the status
  ribbon cut across the bottom-right corner lands on open water instead of across the ship
  it is advertising. ⚠️ That corner is spoken for on every game card, so a still has to be
  composed around it rather than filled evenly (§3, §9).
- 2026-09-17 - the opponent selector gained a visible legend, four strength marks per card
  and one line under the set about whichever is chosen. The marks are on every card rather
  than only the chosen one, because the question is not "how good is this one" but "which of
  these four should I pick", and that is a comparison - it needs all four answers at once.
  Strength is position in the list, so there is no figure kept anywhere (§9).
- 2026-09-17 - the placement preview is put away when the pointer leaves the *chart*, not
  when it leaves the *grid*. The grid has a one pixel border and sits in a tray with padding
  around it, so a pointer moving anywhere near the edge leaves it into the tray and comes
  straight back, several times a second - and every one of those put the carried ship away
  while the next move brought it back, which is a ship blinking at frame rate. This was the
  flicker, through four wrong diagnoses before it. ⚠️ **It never reproduced under synthetic
  events, because dispatching `pointermove` does not generate the boundary events a real
  pointer does** - it was found by logging the stack behind every hide while a person moved
  a real mouse, and 58 of 60 came from this one listener (§9).
- 2026-09-17 - pressing the chip of the ship you are already holding does nothing, where it
  used to deselect. That left the ship lifted off the board and in nobody's hand: the count
  said one still to place, the water showed nothing, and the preview showed nothing either,
  because there was nothing to preview. A ship in hand has to go somewhere, so there is
  nothing for cancelling to mean (§9).
- 2026-09-17 - the preview's layer is flattened out of the board's 3D scene. It was a second
  `preserve-3d` layer directly over the fleet's, with its hull at the same `translateZ` as
  every real deck - two sibling 3D contexts whose contents are coplanar, which is the
  textbook recipe for z-fighting: the surfaces swap places on any compositor tick, so the
  ship winks in and out while nothing changes. That is why the flicker was worst with the
  pointer moving *inside* one square, where 120 pointer events produce zero DOM writes and
  the only thing being asked to work is the compositor (§9).
- 2026-09-17 - hulls are placed by `translate` rather than by `left` and `top`, and the
  preview skips any pointer event that does not change which square it is on. Those two
  together are what finally made carrying a ship smooth, and neither shows up in the DOM:
  `left` and `top` are layout, so moving a hull with them re-laid the board out and, inside
  a `preserve-3d` context, rasterised the whole 3D scene again - once per pointer event.
  Measured after: 171 pointer events across four squares produce 14 attribute writes, where
  every one of the 171 used to write. A square is forty pixels across and a pointer reports
  every few, so nineteen events in twenty never needed to do anything at all (§9).
- 2026-09-17 - Turn now turns the ship in your hand, instead of waiting for the hand to
  move. The keyboard's R always redrew the preview and the button did not, which is the
  whole of why the button read as unresponsive (§9).
- 2026-09-17 - the preview no longer transitions its position, and a square no longer lights
  up under a ship you are carrying. Between them these were the flicker that survived making
  the element permanent, and both only showed on the line between two squares: a ninety
  millisecond slide turns the pointer's own jitter into motion, because holding still on a
  boundary crosses it a dozen times a second and each crossing reverses the last, while the
  hover underneath flicked on and off with it. A preview snapped to a grid should snap (§9).
- 2026-09-17 - the placement preview is built with the board and never removed from it. It
  is hidden by a class and moved by two numbers, and that is its whole life. Creating it on
  the way in and removing it on the way out is the obvious shape and it is what made a
  carried ship blink: every path that cleared it dropped the element for a frame before the
  next event put it back, and a frame is exactly long enough to see. Found by stepping a
  screen recording frame by frame - the ship is simply absent in one frame out of thirty
  while the pointer has not moved (§9).
- 2026-09-17 - the preview's green is a signal green rather than a sea green, now that the
  cruiser is painted green and a preview in the same family read as a sixth ship (§9).
- 2026-09-17 - nothing a square draws takes a press any more. The ring a shot throws out ends
  its animation two and a half times the size of its square and is held there by `both`,
  invisible at zero opacity - and a square carrying a mark sits above the fleet, so that ring
  was covering its eight neighbours and swallowing clicks aimed at them. The more of the
  board you had fired at, the more squares refused to be pressed (§9).
- 2026-09-17 - the placement preview rewrites a `<use>`'s `href` only when the vessel
  changes. Setting it tears down and rebuilds the shadow tree even when the value is already
  there, and the preview writes on every pointer event - eight rebuilt shadow trees a frame
  is what the ship flickering in your hand was (§9).
- 2026-09-17 - the five ship colours pulled apart into five hues. They were taken from real
  naval camouflage and came out as five shades of one grey, with four of the five within a
  few points of each other - a fleet you cannot read without counting squares is not worth
  drawing in detail. The deck's white was cut back at the same time, because the deck is the
  largest surface in a plan view and was washing every hull out to the same pale grey (§9).
- 2026-09-17 - picking a ship up redraws the fleet layer, not just the squares. Lifting it
  from the model while the board still showed it meant putting it down left two of the same
  ship on the water, and taking one off the board with no preview in its place meant it
  simply vanished until the pointer moved (§9).
- 2026-09-17 - every ship redrawn with the detail a plan view needs, and split into two
  symbols: the drawing and its outline. Turrets with barrels, capped funnels, vertical
  launch cells, deck markings, a landing circle and a boot topping at every waterline. The
  submarine was the one that had to change rather than grow - it had a trapezoid for a
  conning tower and read as a sausage turned a quarter, and it is now a teardrop with a sail,
  dive planes crossing it and a cruciform tail (§9).
- 2026-09-17 - the games index is back to three cards a row. Two filled a square exactly at
  four games, and the games are a growing list rather than a set of four (§3).
- 2026-09-17 - the grid ruling moved from an inset shadow per square onto the board's own
  background. A square carrying a mark sits above the fleet so the mark reads over a hull,
  and it was taking its two grid lines up with it and drawing them across the ship (§9).
- 2026-09-17 - the placement preview is one element that moves rather than one built per
  pointer event, and its position is transitioned. Six elements and six `<use>` resolutions
  per frame read as the ship blinking rather than following, and a pointer crossing the
  board's border cleared it entirely - which is why a ship vanished whenever it got near the
  edge (§9).
- 2026-09-17 - `.bs-sprites` is taken out of flow. An `<svg>` holding nothing but `<defs>`
  still has a default inline size, and it was spending about a hundred and fifty points at
  the top of the game page and making the Battleship card taller than the other three (§9).
- 2026-09-17 - a fourth game, [Battleship](../src/games/battleship/game.ts), and the first
  board here with an opponent on the other side of it. Three new things in §9: the sea is a
  gapless grid so a ship can be drawn across it, the tilt is orthographic because a
  perspective would stop the columns being parallel, and a shot is an element on the frame
  that crosses from one board to the other. `--bs-*` on `:root` and `.dark`, including one
  base colour per ship class and a steel ground for the four rank portraits, which a light
  page would otherwise swallow along with the sailor's white cap.
- 2026-09-17 - the games index is two columns at every width and no longer three. A fourth
  game would have left one card alone on a second row beside two empty thirds, and four in a
  square fill the shell with bigger thumbnails than three ever did (§3).
- 2026-09-12 - games say how finished they are. `.game-status` is a band cut across the
  bottom-right corner of a thumbnail and `.page-status` the same word beside a page title;
  only Beta takes the accent (§3). The thumbnail grew a frame, `.game-shot`, which is what
  clips the band and what keeps it out of the art's `aria-hidden` (§9). Accretion's card was
  re-spread around the new corner, and §9 now lists all four things that layout has to clear.
- 2026-09-12 - the end-of-game panel in Accretion re-declares the palette instead of setting
  one text colour. New game was invisible in the light theme: a near-white ghost button
  under near-white text, because the well is dark whatever the theme says (§9).
- 2026-09-12 - Saturn paints above every other body in the field. Its ring is wider than
  anything else on the board, so one of its tips was always behind a neighbour, and half a
  thin ellipse going missing reads as a bug rather than as depth (§9).
- 2026-09-11 - a third game, [Accretion](../src/games/accretion/game.ts), and the first page
  here that runs on every frame. It brings a position-based solver written from scratch, ten
  planets drawn as gradients, and `--acc-*` on `:root` and `.dark`. §9 records the three
  things that made the pile refuse to settle, because each of them looks correct.
- 2026-09-11 - Accretion's bodies rotate in the solver, and the rotation is deliberately not
  drawn. Contact friction works on the surfaces rather than the centres, which is what tells
  rolling from sliding; drawing the angle is a separate question and §9 records why the
  answer is no. The same section now records how far a body slides and the one honest way to
  measure it.
- 2026-09-11 - the minefield holds a press: the ring a release would open goes down with
  the button, the middle button chords, and a long press plants a flag rather than toggling
  one. See "The press preview" in §9.
- 2026-09-11 - a second game, [Minesweeper](../src/games/minesweeper/game.ts), on the three
  original boards. It adds `--ms-n1` to `--ms-n8` and the board surfaces to `:root` and
  `.dark`, which is the third and last place the palette opens up. Nothing about the 2048
  board changed, and the two games share only the record and the thumbnail frame - §9 sets
  out where they deliberately go opposite ways.
- 2026-09-11 - the stored record is signed. `game-2048-best` holds `value.signature`, and a
  value that fails the signature or is not a multiple of four is cleared and the record
  restarts at zero. It lives in [games/record.ts](../src/games/record.ts) so the next game
  keeps its record the same way, and the key is `PUBLIC_GAME_SIGN_KEY` with a literal
  fallback. See "The record is signed" in §9 for what that is and is not worth.
- 2026-09-11 - the site has a game, and with it a colour ramp: `--g2048-t1` to
  `--g2048-t12` on `:root` and `.dark`, the second exception to the near-monochrome
  palette after the technology marks. The board itself adds no dependency -
  a tile is an element with two custom properties and the move is a `transform` transition.
  §9 records the two decisions worth knowing.
- 2026-09-09 - the request diagram **assembles itself as it crosses the screen**: inline SVG
  built from data at the full 72rem measure, drawn straight onto the band with no plate
  under it, scrubbed against a `view()` timeline with no script at all. Three tiers of card,
  each with its caption set inside it and its badge on a chip, a dashed lane around the
  parallel services, cubic beziers with no corner anywhere, and payloads annotated on their
  own line. It was pinned twice on the way here and is not now - §6 records why, because the
  runway a pin needs is empty page. Three files own it:
  `diagram-tokens.ts`, `diagram-layout.ts` and
  [ArchitectureDiagram.astro](../src/components/ArchitectureDiagram.astro). The 330 lines of
  `.flow*` are out of the stylesheet.
- 2026-09-09 - the request diagram is three layers rather than a chain of seven boxes: a
  full-width band the services hang off on their own stems, the payload annotated on the
  arrow, and 290 points of height where the chain took 640.
- 2026-09-09 - Back to top floats (`.to-top`), the arrow alone on a phone and the pill from
  48rem up, rather than waiting in the footer where it could only be reached from the one
  place it is not needed.
- 2026-09-09 - every scroll reveal range now finishes inside the 159px budget the foot of a
  page actually has: the last contact card and the `All projects` link used to hang at 17%
  and 41% opacity, permanently.
- 2026-09-08 - the close is three equal channel cards rather than an oversized email slab
  beside two small ones, and the footer leads with the name in the display voice.
- 2026-09-08 - dark mode is a six-surface ladder: `--site-panel-*` was identical to
  `--site-card`, so header, cards and bands all landed on one tone.
- 2026-09-08 - the diagram is a chain of cards with arrowheads on 2px connectors, and its
  three stage shapes (`terminal` / `hub` / `relay`) come from position rather than copy.
  The object-detection flow now names the React front end at both ends of the round trip.
- 2026-09-08 - the header takes `.panel`, so the bar is a different surface from the page
  in both themes, and the `theme-color` tags follow it rather than `--site-bg`.
- 2026-09-08 - Skills and a project's stack are rows inside one card (`.stack-card`),
  because a grid of cards stretches to the tallest and left short groups half empty.
- 2026-09-08 - full visual redesign: cobalt accent on a cool ground, `.card` as the page's
  unit, `.panel` as the one inverted block, one section shape instead of four head shapes,
  a featured project, and the portrait framed at its own 3:4 so nothing is cropped.
- 2026-09-08 - the active-section indicator, which is the site's third and last script.
- 2026-09-08 - scroll reveals moved from `entry` percentages to `cover` pixel offsets,
  which is what makes them visible at all.
- 2026-09-08 - project tag rows carry their technology marks (`.tag-icon`).
- 2026-09-08 - the request diagram takes any number of branches, driven by `--flow-n`.
- 2026-09-08 - first version of this page.
