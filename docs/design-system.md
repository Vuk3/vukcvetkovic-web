# Design system

One stylesheet for the site, [src/styles/global.css](../src/styles/global.css), one per game
under [src/styles/games/](../src/styles/games/), and almost every number in them carries a
comment saying how it was arrived at. The system is near-monochrome with a
single cobalt accent, one typeface on two axes, a **card** as the page's structural unit,
and all of its motion in CSS.

> [docs/README.md](./README.md) is the map, but **you should not need it to work on the
> design** - everything below is self-contained. The rules that apply while editing a
> component are in [src/components/CLAUDE.md](../src/components/CLAUDE.md).

---

## 0. Working on the design

| I need to change… | Touch |
|---|---|
| a colour | the `--site-*` block on `:root` **and** its counterpart in `.dark` - §1 |
| **a Tailwind colour utility's meaning** (`text-muted`, `bg-card`) | the `@theme inline` block - §1. Do not remove `inline` |
| **the look of a dark block** (header, close, takeaway) | the `--site-panel-*` tokens, not the block - §1 |
| the page gutter | `--site-pad`, once, on `:root` |
| **how wide a section sits** | the `.shell-*` family - §2 - plus `SectionWidth` in [Section.astro](../src/components/Section.astro) |
| a section's tone or rhythm | props on [Section.astro](../src/components/Section.astro) - §3 |
| **how a card looks anywhere on the site** | `.card`, `.card-hover`, `.inset` - §3 |
| a chip, a pill, the CTA | `.chip`, `.tag`, `.cta`, `.cta-ghost` - §3 |
| the display voice | `.display-name`, `.sec-label` and the per-block rules - §4 |
| **the hero load sequence** | `--enter-delay` on the elements in [Hero.astro](../src/components/Hero.astro), not the keyframes - §5 |
| a scroll reveal | the `.reveal` / `.reveal-item` block at the bottom of the stylesheet - §5. **Longhands only** |
| the sticky header's behaviour | `.site-head`, `.head-inner`, the `head-settle` keyframes and `--head-pad` - §5 |
| the floating Back to top | `.to-top` beside the footer rules, the `to-top-in` keyframes, and the markup in [Footer.astro](../src/components/Footer.astro) - §5 |
| **a number in the request diagram** | [diagram-tokens.ts](../src/diagram-tokens.ts) - §6. Nothing downstream carries one |
| **the request diagram's composition** | [diagram-layout.ts](../src/diagram-layout.ts) - §6. **Two arrangements, and the 56rem breakpoint in the component has to match** |
| how fast the request diagram tells itself | `motion.story` and `--dg-hold` - §6. **It is not pinned, and §6 says why** |
| what the request diagram *says* | `flow` in the dictionaries and `flowShape` in [site.ts](../src/site.ts) - §6 |
| the active-section indicator | the second `<script>` in [Base.astro](../src/layouts/Base.astro) and `.nav-link[aria-current]` - §7 |
| dark mode | the `.dark` block, **and** the two `theme-color` tags in [Base.astro](../src/layouts/Base.astro) - §8 and open item 1 |
| **the 2048 board or its colour ramp** | [game.ts](../src/games/2048/game.ts), [Game2048.astro](../src/components/Game2048.astro), the `--g2048-*` tokens - §9 |
| **a game's styles, its colours or its keyframes** | its own file under [src/styles/games/](../src/styles/games/), never global.css - §9 |
| **a game's sounds, the switch, or the burst on a win** | `src/games/<slug>/sounds.ts` for what a game sounds like, [games/sound.ts](../src/games/sound.ts) and [games/burst.ts](../src/games/burst.ts) for the rest - §9 |
| **a memory card, its turn, or a picture on it** | [game.ts](../src/games/memory/game.ts), [Memory.astro](../src/components/Memory.astro), [MemorySprites.astro](../src/components/games/MemorySprites.astro), the `--mem-*` tokens - §9 |
| **the cube: a puzzle, how a drag turns it, its colours or its light** | [game.ts](../src/games/cube/game.ts), [Cube.astro](../src/components/Cube.astro), [ArtCube.astro](../src/components/games/ArtCube.astro), the `--cube-*` tokens - §9 |

**Read §5 before touching any animation.** The `animation` shorthand silently breaks the
scroll timelines, and one custom property has to stay registered.

---

## 1. The token path, `inline`, and the panel

Colour flows through three stages:

```
:root { --site-accent: #2331c8 }      ← the value, light
.dark { --site-accent: #92a3ff }      ← the value, dark
@theme inline { --color-accent: var(--site-accent) }
                                       ← Tailwind's name for it
text-accent, bg-accent, border-accent  ← what a component writes
```

⚠️ **`@theme inline` rather than `@theme`.** With `inline`, utilities emit
`var(--site-accent)` and therefore follow the `.dark` override **at runtime**. Without it
Tailwind resolves the value **at build time**, every utility freezes at the light value, and
dark mode silently stops working for anything written as a utility class. This is the single
most consequential word in the file.

There is no `tailwind.config`. The whole theme is these two blocks.

### The palette

| Token | What it is for |
|---|---|
| `--site-bg` | the page ground |
| `--site-card` | the tone of a card, **lighter** than the ground in light mode |
| `--site-inset` | a block *inside* a card - a stack list, a figure - going back **towards** the ground, so the nesting reads as depth |
| `--site-band` | the section band tone, kept separate from `card` so the step between sections can be tuned without also retoning every card |
| `--site-lift` / `--site-lift-hover` | the one shadow on the site, and only on cards. Anything heavier and a page of cards turns into a dashboard |

**The accent is cobalt, and it is borrowed rather than invented:** it is the navy of the
suit in the portrait, which is the one photograph on the site. That is why it sits with the
image instead of arguing with it. It reaches 8.0:1 on the light ground and 8.1:1 on the
dark one.

**Dark mode is a ladder, and the order is the design:** band, ground, card, inset, panel,
panel card - six distinct surfaces, each a step above the last. A band **recesses** below
the ground there while a card lifts above it, which is the opposite of light mode.

⚠️ **In dark mode `--site-panel-*` has to stay clear of `--site-card`, not merely differ
from `--site-bg`.** Both were `#14171c`, so the header, every card and the banded sections
landed on one tone and the page read as a single flat surface with borders drawn on it -
which is exactly what it looked like. The panel is the *lifted* surface: two steps above the
ground, one above a card. That is what makes the header a bar and the close a block rather
than three more cards.

⚠️ **Check a muted-on-band pair before changing either.** `--site-muted` is the tightest
contrast on the site at **5.25:1** on the light band. Everything else clears 6:1.

### `.panel`, the one inverted block

```css
.panel {
  --site-bg: var(--site-panel-bg);
  --site-card: var(--site-panel-card);
  --site-fg: var(--site-panel-fg);
  /* …and muted, hairline, inset, accent */
}
```

**A panel re-declares the palette rather than styling its own contents.** Because
`@theme inline` maps every Tailwind colour to a `var(--site-*)`, that override is the whole
implementation: `.card`, `.link`, `.chip`, `.mail`, `text-muted` and `border-hairline`
inside a panel all come out correct with **no panel-specific rule anywhere**.

It is spent three times, and all three are the same idea - the page is bracketed in ink:

1. the **header** ([Nav.astro](../src/components/Nav.astro)), which is why the bar is a
   different surface from the page in both themes;
2. the **close** - Contact on the homepage, the takeaway on a project page;
3. the **footer** ([Footer.astro](../src/components/Footer.astro)), so every page on the
   site ends the same way and a panelled section above it merges into one closing block.

A fourth thing lives off that third one. **`.to-top` is written inside the footer and is
`position: fixed`**, so Back to top floats at the bottom right for the whole scroll instead
of waiting at the end of the page. It stays a child of the footer precisely because of the
paragraph above: the panel re-declares the palette, so `.cta-ghost` resolves to the panel's
card and hairline and the button is a dark pill on a light page - the header's surface,
with no second set of colours to keep in step. On a phone the label is `display: none` and
the `aria-label` carries the name, so what floats is a 48px circle around the arrow.

⚠️ **Do not nest a panel inside a panel.** Nothing does, and the tokens would resolve to
themselves.

⚠️ **The header's translucency is 96%, not the 88% cards use.** The lower the alpha, the
more of a *light* page mixes up into the bar: at 88% the ink came out a washed charcoal. Four
percent is enough to see the page move underneath without paying for it in the bar's colour.

Two non-colour tokens are global on purpose: `--site-ease` (one easing curve, so nothing
moves in a different way) and `--site-pad` (the gutter, once). Radius is three values -
`--site-radius` 8px for small objects, `--site-radius-card` 18px for cards, and
`--site-radius-pill` for anything pill-shaped.

---

## 2. `.shell` is a family, not a width

Every section names its own measure. `.shell` centres it and adds the gutter **outside**
the named width, so changing the gutter never changes a measure:

```css
max-width: calc(var(--shell, 72rem) + 2 * var(--site-pad));
```

| Class | Width | Used by |
|---|---|---|
| `.shell-hero` | 75rem | the hero, the header, the footer, the 404 - the page's outer edge |
| `.shell-wide` | 72rem | Skills, Services, a project's features and stack |
| `.shell-projects` | 72rem | Projects, and both project pages' heads and steps |
| `.shell-contact` | 72rem | Contact |
| `.shell-text` | 68rem | About, and a project's prose |
| `.shell-timeline` | 68rem | Experience, Education, a project's results |

⚠️ **`.shell-hero` is not a `SectionWidth`.** `SectionWidth` in
[Section.astro](../src/components/Section.astro) lists the five section measures and
deliberately omits `hero`, which is applied directly by
[Nav.astro](../src/components/Nav.astro), [Hero.astro](../src/components/Hero.astro),
[Footer.astro](../src/components/Footer.astro) and
[NotFound.astro](../src/components/NotFound.astro). Adding a width means adding both the
CSS class and the union member.

`.measure` (38rem, about 68 characters at the 17px body size) is separate: it caps a
paragraph sitting inside a column wider than itself.

---

## 3. Sections, and the card

### `Section.astro` is one shape

[Section.astro](../src/components/Section.astro) takes `id`, `label`, `width`, `tone` and
`space`, plus an optional `aside` slot for what a section wants beside its heading - which
today is only the link out to the project index.

**There is no `head` prop.** Four head shapes and a sticky label column were built and
thrown out for the same reason: they spent about 12rem of every measure on a caption and
left the content to spread thinly across what was left, which is what made the page read as
a document. The heading is a real heading at real size, the rule under it closes the head
off from the content, and **the content is a grid of cards** - which is what carries the
page.

**`tone`** is spent twice on the homepage: `band` on Projects, because it is the section
the page is for and a step in the ground is what lets a reader find it by scrolling, and
`panel` on Contact. A project page spends it twice as well - `band` on the diagram and the
features, `panel` on the takeaway.

**`space`** is `full` or `lite`; `lite` is Education, the one block that is meant to read
quieter than its neighbours.

### The card is the unit

```css
.card        /* border + card tone + one quiet shadow + 18px radius */
.card-hover  /* border to accent, lift 2px - only where the card is a target */
.inset       /* a block inside a card, going back towards the ground */
```

One class, used everywhere: a service, a role, a degree, a project, a channel, a step, the
results table, the stack rows. `.card-hover` is added **only** where the whole card is a
link. The request diagram is the one block that does not go through it - it is SVG, and its
surfaces are the same ladder built with `color-mix` instead (§6).

⚠️ **A grid of cards stretches to the tallest of them, and that is a trap.** Skills was
built as a card per group and Backend's five entries set the height, so Data's two came out
as a box with 200 points of nothing under them. Where the content per group is uneven, use
**rows inside one card** - `.stack-card` / `.stack-row` - not a grid of cards. That pair
renders both the homepage's Skills section and a project page's grouped stack, which is why
those two cannot drift apart.

### Clickable cards

`.stretch` on the card's title link paints a pseudo-element over the whole card, so a click
anywhere on it navigates **while the accessible name stays the title alone**.

⚠️ **Anything that must stay clickable inside a stretched card needs `.above`** - an
outbound Live or Source link, for instance - or the stretched pseudo-element covers it.

### Small objects

| Class | What it is |
|---|---|
| `.chip` | a technology name with its mark. The page's smallest repeated object, and most of what gives it its texture - it appears in the hero, in Skills, in every stack |
| `.tag` | a year or a short label, with no mark or a small one |
| `.cta` | the only filled thing on the page: solid accent at rest, inverting on hover |
| `.cta-ghost` | the same pill outlined, for the secondary action beside it |
| `.game-status` | a game's Live or Beta, as a band cut across the bottom-right corner of its thumbnail |
| `.page-status` | the same word beside a page title, as a pill - a heading has no corner for a ribbon to cut |

Both status marks take `Beta` in the accent and leave `Live` at the card's own tone. The
odd one out is the one worth pointing at, and three accent ribbons on a row of three cards
point at nothing. Every card on the index carries one even so, because "Beta" only means
something with a "Live" sitting beside it - the game's own page badges nothing when it is
finished, since there is nothing there to compare against.

---

## 4. Type: one family, two axes

`@fontsource-variable/archivo/wdth.css` - the **width** build, 62-125%, at 90 KB latin
against 35 KB for weight alone.

⚠️ **The display/text contrast on this site is width, not a second typeface.** Headings run
expanded and heavy, text runs at normal width. That is what the extra 55 KB buys, and it is
the whole type system. Do not add a second family.

The display voice is set per rule rather than through one shared utility - `.display-name`,
`.sec-label`, `.role-company`, `.project-featured-title`, `.dg-title` and the rest each name
their own width and weight. A generic `.display` helper existed and nothing applied it.

**The one exception is the request diagram's annotation voice**, which is set in the
platform's own monospace (`fonts.mono` in
[diagram-tokens.ts](../src/diagram-tokens.ts)), uppercase, at 10.5-11.5px on 0.08em. It is a
register, not a typeface: inside the diagram a node's title says what a thing *is* and the
mono says what is *known about it* - a model, a mode, a protocol list, a payload. It loads
nothing, which is why it does not break the rule above. A web font here would.

`.display-name` is the one place the page is allowed to be loud, at
`clamp(3rem, 11vw, 7rem)`. Three things about it are measured rather than chosen:

- **It sets on two lines, one word each,** because that is what buys the size. On one line
  "Vuk Cvetković" runs out of measure around 60px. [Hero.astro](../src/components/Hero.astro)
  splits `site.name` on the space rather than hardcoding the halves, so the name is still
  stated in exactly one place, and it stays one `<h1>` with one accessible name.
- **Leading is 0.88, not tighter,** because the second line carries a `ć` whose accent
  collided with the baseline above at 0.84.
- **Neither line wraps at any width.** The floor is 11vw rather than a fixed 2.875rem
  because at 8.2vw the name set at 41px on a 390 phone, which is a heading and not a
  masthead. At 500px "Cvetković" measures 297 in the 464 the column gives it, and the ratio
  only improves upward. A single word has nowhere to wrap to and would simply overhang the
  page.

`.sec-label` is a real heading at `clamp(1.625rem, 3vw, 2.375rem)`, which is what lets
Services set its label as the sentence it is ("What I can help with", 25 characters in
French) without needing a shape of its own.

⚠️ **The email address is 1.1875rem, flat.** It has been set at 2.875rem, 2.25rem and
1.75rem and every one of them was too big: an address is a thing you read, copy and type,
and past this size it stops looking like one. What marks it as the primary channel now is
one step of size over the two URLs beside it, the accent, and being first - not scale. It
had a card of its own at display size and came out as a slab with an address adrift in it.

Body copy is 17px (`1.0625rem`) at 1.65 line-height. `text-wrap: balance` on `h1`-`h4`,
`text-wrap: pretty` on `p`. Figures that sit in columns use `font-variant-numeric:
tabular-nums` - periods, the results table, the 404 status.

---

## 5. Motion

All of it is CSS. The only script that touches motion anywhere on the site is the game in
§9, which is a game; the active-section observer in §7 draws no animation, and nothing on
any other page does either. The reveal system has two halves, chosen by one question: **is the
element in view at first paint?**

| | `.enter` / `.enter-name` / `.enter-portrait` | `.reveal` / `.reveal-item` |
|---|---|---|
| Driven by | time | scroll position, `animation-timeline: view()` |
| Ordered by | `--enter-delay`, set inline per element | `animation-range`, stepped by `nth-child` |
| Used by | the hero, both project page heads, the 404 | every section below the fold |

**Why the split:** the hero is in view at first paint, and a `view()` timeline there would
sit at 100% and never animate.

**The delay is a custom property set inline in the markup**, not an `nth-child` rule in the
stylesheet, so the order of the hero sequence is readable where the elements are: role 0,
first name 0, last name 110ms, portrait 240ms, then the lead and everything under it at
380ms. `.enter-name` additionally blurs in from 10px - only the two name lines carry that,
because a blur on body copy would read as a rendering fault. `.enter-portrait` scales the
**photograph inside its card** rather than the card, so what arrives is the picture and not
the frame.

⚠️ **Stagger on a scroll timeline is `animation-range`, not `animation-delay`** -
`animation-delay` has no meaning on a scroll timeline. `.reveal-item` steps its start
`12/22/32px` and flattens at `nth-child(n+4)` on `40px`. The step is 10px because the whole
range has to land inside a 159px budget - see below.

### Why every range is `cover`, in pixels

Two decisions in the ranges are not free choices, and both were arrived at the hard way.

**`cover`, not `entry`.** `entry` is the obvious phase and it is measured in the *element's
own height*: it runs from the element's top edge reaching the bottom of the screen to its
bottom edge reaching it. A chip is about 34px tall, so on `entry` a whole reveal started and
finished inside 34 pixels of scrolling, at the very bottom edge of the screen. The
animations ran correctly and were invisible. `cover` spans the element's height **plus the
viewport's**, so a short card gets a screen's worth of runway instead of its own height.

**Pixels, not percentages.** The amount of page below any element is a fixed pixel quantity,
while a percentage of `cover` grows with the viewport. `cover 30%` is 375px on a laptop and
600px on an 1800px monitor, so a percentage range that finishes on a laptop **runs out of
page on a tall screen** and leaves the section permanently a few pixels low and slightly
transparent. In pixels the budget is identical on a 667px phone and an 1800px monitor.

### The 159px budget

An element's reachable travel is **`document height - its own offset top`**: once its top
edge crosses the bottom of the screen, that is every pixel of scrolling it will ever get.
Measured across the site, the floor is the **`All projects` link at the foot of a project
page** - 48px tall over a 111px footer, so **159px** - and the tightest card is the last
contact channel on the homepage at 191px. Both numbers hold on every viewport, because both
terms are document quantities.

A range that ends past its element's budget does not fail loudly. The element stops where
the page ran out and stays there for as long as the page is open. At `cover 60px` to
`cover 300px` that left the GitHub channel card **parked at 17% opacity and 23px low**, and
the `All projects` link at 41% - reported from a phone, where there is no cursor to nudge
the page further.

So every range here is built to finish inside 159: sections run `8px` to `128px`, cards
`12px` to `122px` stepping to `40px` to `150px`. ⚠️ **Push any end value past `cover 150px`
and something at the foot of a page will hang half-arrived.** To check a candidate value,
scroll a page to the bottom and read `getComputedStyle` on the last `.reveal` - `opacity`
below 1 or a `transform` that is not `none` is the bug.

### The floating Back to top

`.to-top` is the third thing on a `scroll(root)` timeline, next to the header. It is out of
the way for the first half screen and fades in over the next third of one
(`animation-range: 50vh 85vh`): a button offering a reader at the top of the page a way to
the top of the page is dead weight, and on a phone it would cover the portrait to be it.
Where there is no scroll timeline, or the reader asked for less motion, it is simply there
from the first paint - **nothing on this site is hidden by default**.

Two details in `to-top-in` are load-bearing:

- ⚠️ **`translate` and `scale`, not `transform`.** An animation beats a normal declaration
  in the cascade, so a `transform` in these keyframes would hold at `none` for as long as
  the button is visible and eat `.cta-ghost:hover`'s 1px lift. The individual properties
  compose with `transform` instead of replacing it.
- ⚠️ **`visibility` is in the keyframes.** `opacity: 0` alone still takes a tap, so the
  hidden button would be a dead spot in the corner of the hero.

### Three rules that are easy to break

1. ⚠️ **Longhands only, never the `animation` shorthand.** The shorthand resets
   `animation-timeline` and `animation-range` to their initial values, so writing it
   silently undoes the timeline on the line below. Every scroll-driven rule in the file
   spells out `animation-name`, `animation-timing-function`, `animation-fill-mode`,
   `animation-timeline` and `animation-range` separately.

2. ⚠️ **`--head-pad` must stay `@property`-registered** (`<length>`, initial `0.85rem`),
   because an unregistered custom property jumps at the midpoint instead of interpolating.
   It drives the header's padding as it settles.

3. ⚠️ **`--head-pad`'s fallback in `.head-inner` is load-bearing.** The `head-settle`
   keyframes are the only thing that ever sets it, so anywhere that animation does not run
   the property is unset and `padding-block: var(--head-pad, 0.85rem)` is the only thing
   keeping the header from collapsing to zero height.

### Degradation

Nothing is hidden by default. `.reveal` and `.reveal-item` are defined **only** inside
`@media (prefers-reduced-motion: no-preference)` and `@supports (animation-timeline:
view())`, and there is no base `opacity: 0` anywhere - so a browser with no scroll-driven
animations simply shows the content. `.site-head` carries a permanent hairline for the same
reason: it is the resting state where `head-settle` never runs.

Under `prefers-reduced-motion: reduce`, durations collapse to `0.01ms` and
`scroll-behavior` goes to `auto`. Note the view-transition pseudo-elements are named
explicitly - `*` does not reach them.

`@view-transition { navigation: auto }` makes switching language read as one page changing
rather than a reload. Cross-document, so Chrome only for now, and everywhere else the
navigation is simply instant.

### Interaction

Hover states move a card 2px and nothing in the layout reflows. `.link` and `.mail` animate
two stacked background gradients rather than a border, because only `background-size` can be
animated directionally.

The accent is used for links, the CTA, the active nav label, the diagram's connectors and
its two terminals, and exactly one other thing: the period of the current role, via
`[data-current]`.

---

## 6. The request diagram

[ArchitectureDiagram.astro](../src/components/ArchitectureDiagram.astro) draws one request
as inline SVG. It is the opening image of a project page and the one place either page is
allowed to be a diagram, because **the shape is the argument**: a run reaches a single
address, fans out into services that do not know about each other, and gathers back into
one answer.

### Three files, and nothing else holds a number

| File | Owns |
|---|---|
| [diagram-tokens.ts](../src/diagram-tokens.ts) | every number and every colour, per mode. Colour as `--site-*` *expressions*, so the theme toggle still reaches it |
| [diagram-layout.ts](../src/diagram-layout.ts) | the geometry. Takes a spec, returns boxes, paths, text runs and reveal delays |
| [ArchitectureDiagram.astro](../src/components/ArchitectureDiagram.astro) | writes the attributes out, and arms the reveal |

**A diagram is data.** The component takes `spec={{ id, stages, edges }}` and knows nothing
about projects; the join between a project's copy and that spec is thirty lines at the top
of [ProjectDetail.astro](../src/components/ProjectDetail.astro), which is where to look when
a fifth project does not fit. The layout is not a general graph engine and should not become
one: it draws a terminal, a core, one lane of parallel services, and then either an exit
terminal or a return to where it started.

### The card, and three tiers of it

Every node is a card with the same anatomy, which is what stops it reading as a labelled
rectangle:

```
CAPTION        uppercase mono, inside the card - tiers 1 and 2 only
Title          the sans, 17-18px, the thing itself
[ BADGE ]      uppercase mono on a chip - tier 3 only
```

⚠️ **The caption is set inside the card, not floating over it.** Over the box it was a word
pointing at a plain rectangle; inside it the card has a header and a body. It also means
nothing reserves vertical space above anything, which is where a good deal of the diagram's
old emptiness came from.

⚠️ **A badge sits on a chip sized to its own text**, never to its card. A full-width bar
under a title reads as a second title; a chip reads as something *on* the card. The width
comes from the same estimator that wrapped it.

| Tier | What | How it reads |
|---|---|---|
| 1 | the terminals - where a run starts and where the answer lands | the card surface carrying a 10% accent tint under a 42% accent border. The only accent on a box anywhere on the site |
| 2 | the core - the gateway, the service, the parser | the widest node and the brightest plain surface, under a border at 26% of the ink |
| 3 | a parallel service - a title and its model, mode or protocol list on a chip | a step back towards the band, under a hairline |

⚠️ **No shadows, no glow, no gradient.** The surfaces are a ladder built with `color-mix`
towards `--site-card` rather than from named tokens, precisely so it holds in both themes:
mixing towards the card lightens on a light page *and* on a dark one, while `--site-inset`
flips direction between them.

The parallel services sit inside a **lane** - a dashed, unfilled container with its caption
in its own top-left. That is the load-bearing move: once parallelism is structural, the
connectors no longer have to express it, which is what makes the fan two or three quiet
curves instead of a bus.

### The connector spec

⚠️ **Every connector is one cubic bezier with both control points offset along the flow
axis**, at 40% of the distance between the anchors. There is no polyline, no corner and no
staircase anywhere in the drawing, and because the offsets are on the axis, every line
leaves and lands parallel to it - so an arrowhead is always square to the node it enters
without anything computing an angle.

⚠️ **A fan leaves along an edge, never from a point.** Anchors are distributed down the
core's right edge, or across its floor in a column layout. Since they come out in the same
order as the services they feed, the mapping is monotone and **a crossing is impossible
rather than merely avoided.**

Two consequences worth knowing:

- **A round trip returns once, from the lane, not once per service.** Three lines coming
  back would have to cross the three going out or travel over the boxes they left. It is
  also the truer statement: the services do not know about each other, so what returns to
  the core is the lane. The return hugs the underside of the lane and lands on the core's
  right edge below every line that left it, which is why the fan sits ten units high on a
  round trip.
- **A payload rides on its line, never in a box.** It is set at the bezier's own midpoint
  and stroked in the band colour underneath itself (`paint-order: stroke fill`), so the
  connector reads as passing behind it. On a round trip the two nodes *grow* until their
  edges are long enough to hold both annotations clear of each other - the separation is
  derived from the wrapped line count, not chosen.

### One diagram, two arrangements, never both

⚠️ An SVG with a viewBox scales its text with its container, so the landscape composition
that reads at 1150 would set its 18px titles at 5px on a phone. A portrait arrangement below
56rem is the floor, not a preference - and there is no third, because the wide composition
holds its type down to about an 896 viewport, which is where the switch is.

| Mode | From | Composition |
|---|---|---|
| `wide` | 56rem | stages left to right, services stacked in a lane on the right. Built to 1152, the measure the page's sections already use |
| `narrow` | 0 | everything stacks, and the lane is wired as a single block: three curves into three stacked boxes is a knot, and the lane's border already says they run together. Capped at 30rem so it grows to about 1.45x rather than stretching to fill a tablet |

⚠️ **`display` for the two is set in exactly three rules and nowhere else.** The shared
`.dg-svg` rule must never carry one: it comes later in the sheet at the same specificity, so
a `display: block` there beats the `none` above it and **both arrangements render at once** -
which is precisely what happened the first time.

Each SVG is capped at its own design width, so it only ever scales *down*. A round trip is
drawn in place in `wide` and as a straight chain with its core and terminal named a second
time in `narrow` - at that width a return rail has nowhere to put the sentence it carries.

### Text is measured, not guessed

[diagram-layout.ts](../src/diagram-layout.ts) estimates set width from a per-character
advance table and wraps with 3% of the measure in hand. It earns that on a four-language
site: the same node holds "WCF service" in English and "Ein Ordner, rekursiv in Bytes
gelesen" in German, and the box has to be as tall as whichever locale is being built. Node
heights, lane heights and the whole drawing's height all fall out of the wrapped line count.

### The story, and why it is not pinned

**The scroll is the clock.** The diagram is an ordinary block in the section - heading
directly above it, Overview directly below - and as it crosses the screen the run assembles
in the order a request takes it: terminal, its line, the core, the fan, the services
together, the return, the answer.

⚠️ **It was pinned, twice, and the pin is the reason it is not.** A sticky stage needs a
runway to spend and **a runway is empty page** - 160svh of it, which is most of a screen of
nothing before the diagram and most of another after it. A viewport-tall stage then has to
centre a 400-unit drawing in 900 units of screen, which is 250 more either side. Both
attempts were made and both were rejected for the same reason each time, from opposite
directions:

| Attempt | What went wrong |
|---|---|
| stage `height: 100svh`, drawing centred | the drawing is 2.4:1 and a laptop's content box nearer 1.5:1, so centring one in the other turned the difference into a letterbox - most of a viewport of grey between the heading and the diagram |
| stage sized to its content, stuck at `top: 5.25rem` | the drawing sat in the top third of the screen with a full screen of dead page under it for the whole pin |

There is no third arrangement to try: the emptiness *is* the pin. What was given up is the
page holding still while the run plays; what was bought is a section that is exactly as tall
as its diagram.

⚠️ **There is no script, no observer and no duration anywhere in it.** The track carries
`view-timeline-name: --dg-track` and every element takes a slice of that timeline:

```css
--dg-slot: calc(var(--dg-span) / var(--dg-steps));
--dg-at:   calc(var(--dg-from) + var(--i) * var(--dg-slot));
animation-range: cover var(--dg-at) cover calc(var(--dg-at) + var(--dg-slot) * var(--dg-hold));
```

`--i` is the element's step in the run, written inline by the layout. `--dg-steps` is how
many steps that arrangement has, counted from what the drawing actually used - so the story
fills its range whether it runs to eight steps or nine.

⚠️ **`--dg-hold` is what makes it feel continuous rather than stepped**, and it is the first
thing to reach for if the motion reads as choppy. At `1` each element owns its slot alone
and the run is a row of separate events. At `1.8` an element is still arriving while the
next two begin, and the sequence dissolves forwards; a line takes `2.4`, because travelling
is the whole point of a line and it should still be reaching for the node it feeds as that
node arrives.

The track is exactly as tall as the drawing, so a 400-unit drawing in a 900-unit viewport is
fully on screen between about 31% and 69% of `cover`. The story runs 22% to 56%: it starts
as the diagram arrives and finishes well before it begins to leave.

Scrolling back up unbuilds it. That is what a scrubbed animation is, not a bug.

### Two more things that were tried and are not there

1. ⚠️ **There is no plate.** A framed surface under the drawing was built twice - hugging
   the content, and again with a minimum height - and both times the frame was the problem
   rather than its size: before an element arrives, a plate is a grey rectangle waiting for
   it. Drawn straight onto the section's band, what precedes an element is simply the page,
   and an empty box is impossible. This is why `--dg-halo` is `--site-band`: with no plate,
   that is the ground an annotation actually sits on.
2. ⚠️ **Nothing rests at a ghost opacity.** The whole system drawn at 15% and lighting up as
   the run reached it is a well-known pattern and it read here as a rendering fault - a
   half-printed diagram - rather than as one waiting its turn. Elements start at zero. There
   is no minimum height either, for the same family of reasons: 540 and then 560 were set so
   the four diagrams would be one object, and it padded the two-service ones by 150 units of
   nothing. Every diagram is now exactly as tall as what is in it.

⚠️ **Nothing is hidden without scroll-driven animation.** Every rule that hides anything
lives inside `@supports (animation-timeline: view())` and `prefers-reduced-motion:
no-preference` - so a browser without the feature, or a reader who asked for less motion,
gets a finished diagram and scrolls straight past it. Same degradation as `.reveal` in §5.

⚠️ **The arrowhead's placing transform is on a group and its animation on the path inside.**
A CSS `transform` overrides the presentation attribute outright, so animating the path where
it sits drops every arrowhead at the origin. Nesting it also means the head's slide happens
in its own rotated space, so it arrives *along* its line whichever way that line runs. For
the same family of reasons every animated SVG element carries `transform-box: fill-box` -
an SVG transform origin is the user-space origin by default, and a scale without it flings
the box towards the top left of the drawing.

### Text is measured, not guessed

[diagram-layout.ts](../src/diagram-layout.ts) estimates set width from a per-character
advance table and wraps with 3% of the measure in hand. It earns that on a four-language
site: the same node holds "WCF service" in English and "Ein Ordner, rekursiv in Bytes
gelesen" in German, and the box has to be as tall as whichever locale is being built. Node
heights, lane heights and the whole drawing's height all fall out of the wrapped line count.

### Accessibility

The SVGs are `aria-hidden` and the content is announced from a `sr-only` ordered list above
them, walked in edge order so it reads as the run rather than as an inventory. Two reasons:
SVG text is read inconsistently across screen readers, and there are three copies of it
here.

### What it replaced

Three stacked layers in CSS: a full-width band the services hung off on short stems, with
the payload annotated beside an arrow. It had no elbow in it either, but every card carried
the same weight, the fan and the return were expressed as straight vertical stems from a
shared edge, and it capped at 44rem - a third of the width the section gives it. The version
before *that* drew a rectangular bus around the whole diagram.

---

## 7. The active-section indicator, and the site's script budget

Every page but `/games/2048/` ships **no JavaScript file**. Four inline blocks cover the
pre-paint theme script, the theme toggle, the dismissal of every disclosure, and this. The request diagram was built with a fourth - an
`IntersectionObserver` arming a reveal - and it is gone: a `view()` timeline on a sticky
track does the same job, scrubbed rather than triggered, and costs nothing (§6).

A nav link cannot be styled from the section it points at: the two are in different
subtrees, and `:target` only knows what was clicked, not what is on screen. So the third
block in [Base.astro](../src/layouts/Base.astro) is an `IntersectionObserver` over a band
from 28% to 45% down the viewport, which sets `aria-current="location"` on every link
carrying the matching `data-section-link`.

Two consequences worth knowing:

- **The state is announced as well as drawn.** `.nav-link[aria-current='location']` fills
  the label's pill in the accent; `.nav-row` (the phone menu, where a pill on each row would
  read as a list of buttons) takes an accent bar on its left edge instead. That border is
  **always present and transparent at rest**, so marking a row shifts nothing.
- **It runs on every page and observes nothing where the sections do not exist.** The nav
  hrefs are absolute (`/#about`), so on a project page `getElementById` returns null and the
  observer is simply given nothing to watch.

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
3. `:root` and `.dark` set `color-scheme`, which is what makes `light-dark()` work inside
   [TechIcon.astro](../src/components/TechIcon.astro) - one declaration covering both
   themes for the brand marks.

⚠️ **The `theme-color` meta tags are the exception, and the only raw hex values outside the
stylesheet.** They match `--site-panel-bg`, **not** `--site-bg`: the browser chrome sits
directly above the header, and the header is the ink panel in both themes, so matching the
page ground would put a light strip over a dark bar. Two consequences: they duplicate the
token in both themes and must be changed with it, and because they key on the media query
rather than the class, **a manual toggle does not change the browser chrome colour.** See
open item 1.

---

## 9. The game boards, and the one place the palette opens up

⚠️ **Each game's CSS is its own file**, [src/styles/games/](../src/styles/games/)`<slug>.css`:
its tokens on `:root` and `.dark`, its rules, the rules that make its board into a thumbnail,
and its keyframes. The game's component and its thumbnail import it, so it is inlined into
the game's own page, its locale twins and the games index, and into nothing else. The rules
every game page shares - the sound switch, the burst, the jolt - are `shared.css`, imported
by each game component after its own file, and the grid of the index is `index.css`.

⚠️ **The rules are in a cascade layer of their own, `games`, between `components` and
`utilities`.** Astro does not promise where in a page an imported stylesheet lands: on the
cube's page and the games index a game's file comes out ahead of global.css, and on Memory's
after it. A game's rules are written to win a tie against the site's own - a game's
`.mem-actions .cta-ghost` over `.cta-ghost:hover` - and a layer after `components` keeps
that true wherever the bytes fall, while `utilities` still beats both.
Every file under games/ and global.css open with the same `@layer` line, because the first
stylesheet to name the layers is the one that orders them. The move was checked by comparing
the computed style of every element and pseudo-element on every game page, the index and
the home page against a build with the rules still in global.css, on a seeded deal: nothing
differed but the phase of the animations that run on a clock.

Six pages carry a game, and all six are built the way the rest of the site is: markup,
tokens, and no canvas or game library anywhere. They are deliberately different from each
other, which is most of what this section is about.

| | [2048](../src/games/2048/game.ts) | [Minesweeper](../src/games/minesweeper/game.ts) | [Memory](../src/games/memory/game.ts) | [Accretion](../src/games/accretion/game.ts) | [Battleship](../src/games/battleship/game.ts) | [Cube](../src/games/cube/game.ts) |
|---|---|---|---|---|---|---|
| what it is made of | 16 divs that move | up to 480 buttons that change state | up to 60 buttons that turn over | up to 46 circles that fall | 200 buttons, and 10 drawn ships over them | up to 150 stickers in a 3D scene |
| the hard part | motion, at sixty frames | the rules, and the keyboard | the turn, and keeping three animations off each other | the solver, and making it settle | the opponent, and what it is not allowed to see | the drag: which layer a finger means, and keeping the sticker under it |
| the board in the markup | yes, 16 cells, fixed | no, the module builds it | no, the module deals it, and a face-down card holds no picture | no, play creates every body | no, and the fleet is a layer of its own | no, the module builds the scene from the geometry |
| to a screen reader | hidden, narrated by a live region | a real `role="grid"` | a real `role="grid"`, and a live region for each turn | a live region, and the sequence below it | two `role="grid"`s and a live region for the turn | hidden, and a live region for the scramble and the solve |
| what a turn costs | two custom properties | a class | one attribute, and a transition on `rotate` | a frame of simulation | a class, and a count over 200 placements | a transform on each sticker in the layer, every frame the layer moves |
| runs when idle | no | no | no | **yes** | no | no |

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

The frame around all three is `.game-shot` rather than `.game-art`, and the split is not
cosmetic: `.game-shot` carries the bleed, the top corners and the clip, so the status
ribbon can be a straight band long enough to run off both edges it crosses. It also keeps
the ribbon out of the `aria-hidden` the art carries, which is right for a drawing of a
board and wrong for the word "Beta".

⚠️ **[ArtAccretion.astro](../src/components/games/ArtAccretion.astro) is placed by hand and
has to be checked rather than judged.** All ten bodies are spread across the card, and four
things have to clear at once: every pair of centres against the two radii; Saturn's ring,
as the ellipse it is rather than as a circle around it, which would have more than twice
Saturn's radius and eat a fifth of the field; the Sun's glow, about 2.4 units past the
disc, which the frame now cuts; and the ribbon's corner, roughly 20 units in along each
edge on a one-column phone. The sizes are also *not* the game's radius table: real ratios
put the Sun at nine and a half Moons, which in a 5:2 box leaves the Moon at four pixels and
the card saying nothing, so they are compressed to about five to one.

### Numbers are sized off the board, not the viewport

`.g2048-board` is a `container-type: inline-size` container and the digits are in `cqi`,
stepped down by `data-digits` so a 2 and a 1024 both fill their tile. A `vw` clamp cannot
do this: the board stops growing at its 36rem cap and the numbers would carry on.

### The minefield is a grid, in both senses

⚠️ **`.ms-row` is `role="row"` with `display: contents`, and both halves are load bearing.**
A grid without rows gives a reader no position at all, and a row that is also a layout box
would nest every cell in a second grid and break the columns. The cells are `<button>`
elements carrying `role="gridcell"`, so one cell is in the tab order at a time and the
arrow keys walk the field rather than the Tab key walking 480 buttons.

That is the reason this game is on the site. 2048's board has to be `aria-hidden` and
described through a live region, because sixteen tiles that rewrite themselves on every
keypress cannot be read out. A minefield sits still and waits, which is what a grid is for.

**Three boards, and expert scrolls rather than shrinks.** `--ms-size` is
`clamp(1.55rem, 100cqi / var(--ms-cols) - var(--ms-gap), 2.4rem)`, so a cell is as large as
the width allows between two bounds it may not leave. Below about 25px a cell stops being a
touch target, and 30 columns of that do not fit a phone, so `.ms-scroll` takes the overflow.

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

**Four layers, drawn once at build time in [Accretion.astro](../src/components/Accretion.astro)
from a seeded generator**, so the sky is identical on every build, in every language and for
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

⚠️ **It is markup in the component and not rules in accretion.css**, because that file is
inlined into the games index as well, for the thumbnail, and only this page has a sky. The
markup adds 3.4 KB gz to this page and nothing anywhere else.

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

`.mem-fit` is the smallest of the table's width, a card of 8.5rem, and whatever makes the
whole board fit the height of the screen: `(100svh - --mem-reserve) * cols / rows`. A
memory board you have to scroll is one you cannot see. `--mem-reserve` is 12rem on a
desktop and 17.5rem on a phone, where the bar above the table stacks into two rows of
meters, measured at 390 by 844 so that the sixty card board fills the screen with the bar
still in view.

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

⚠️ **The rate of a drag is worked out on every move, from where the sticker is now.** It
was measured once, at the start, and the sticker trailed the finger by a quarter of the
way by the end of a turn - 200 pixels of finger for 173 of sticker - because a sticker goes
round a circle and on screen its motion slows and bends as it turns towards a side face.
`follow` takes the sticker's screen velocity at the current angle through the same
projection the browser draws with, so the sticker stays under the finger for the whole
turn. `FLOOR` bounds that velocity from below, since a sticker whose path runs straight at
the reader barely moves on screen and a hair of finger would otherwise spin the layer.

**Which layer a drag means is chosen once**, after `SLOP`: every axis the sticker could turn
about is tried, and the one whose motion on screen best matches the finger wins, so the
right layer turns from any angle the puzzle has been left at. On the pyramid a drag on the
middle row takes the tip with it, since a tip left behind is a quirk of the mechanism
rather than a move anyone means.

**Let go and a spring takes the layer to its step**, at a damping ratio of 0.78: one degree
of overshoot and no wobble. The click is played as the layer first reaches the step, not
when the spring stops ringing. A layer still landing is landed at once only when a new
drag actually grips, not on the press, so a tap during a landing costs nothing.

⚠️ **The whole puzzle turns freely and stays where it is left.** A drag off the puzzle, or
with the right button on it, turns it like a trackball, and a flick coasts, its speed
falling to a third every `COAST` seconds until it drops under 0.3 radians a second. It used
to settle back square to the nearest of the orientations the solid maps onto, and that
read as the puzzle refusing to be turned. The keys still reorient by quarters, and the
letters always mean the faces as they are seen now: U is whatever is on top.

### The stage is a height, not a ratio

⚠️ **`.cube-stage` takes its height off `.cube-frame`'s width in `cqi`, and must not go
back to an `aspect-ratio`.** A `max-height` on an element with a ratio is carried across the
ratio to its width, so on a short screen the stage narrowed to keep 16:10 and sat in the
left two thirds of the shell with nothing beside it. The frame is an inline-size container
for exactly this.

⚠️ **The puzzle icons size their padding and gaps off `--s`, not in percentages.** A
percentage of padding is taken from the *parent's* width, which here is the whole tile, and
it left the colours a quarter of the icon wide.

### Sound, the burst and the jolt, shared by all six

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

⚠️ **One switch for six games**, stored once as `game-sound`. Turning the sound off in one
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
| Battleship | a thump when a round leaves, then a splash, a blast or a sinking where it lands - theirs the same at 62%, which is all "further away" has to mean - and a lift, a clunk and a tick while placing. Both endings are `delayed` 0.45s so they do not land on top of the last sinking |

**The polish that came with it.** The burst on every win, in 2048's ramp, the minefield's
numbers, the planets and the five hull paints. `.game-quake` on the minefield when a mine
goes off, on the well when two Suns go off and on the battleship table when a ship sinks.
2048 leaning towards the wall a push hit, and its 2048 tile catching the light once.

⚠️ **The battleship jolt is on `.bs-frame`, outside the tilted scene.** A `translate` on an
ancestor of a `preserve-3d` context is harmless, while anything on the chain down to a hull
flattens the fleet onto the water - see "The tilt has no perspective in it".

⚠️ **A pressed-state rule has to name its button.** The minefield styled
`.ms-actions .cta-ghost[aria-pressed='true']` as flag mode, and the sound switch beside it
is pressed whenever the sound is on - so it came out red. The rule now selects
`[data-action='flagging']`.

⚠️ **Accretion's bar is two rows below 64rem, and a column beside the well above it.**
Stacked, the switch beside New game stopped the French, German and Serbian bars fitting on
one line while the English one still did, so the readouts share the first row and the
buttons the second. On a wide screen the bar is the left-hand column and the sequence the
right-hand one, and the well is sized to the screen: the height below the header, turned
into a width through the well's own ratio, between 30rem and 32.5rem. ⚠️ Each side is one
grid item. Placed a readout per row, the two columns shared row heights and the tall Next
card opened a gap between Score and Best.

---

## 10. Open items

| # | Item | Severity |
|---|---|---|
| 1 | **`theme-color` disagrees with the toggle.** The two tags in [Base.astro](../src/layouts/Base.astro) key on `prefers-color-scheme`, while everything else keys on the `.dark` class, so a visitor whose system is light and who switches the site to dark gets the light-theme chrome colour. It is much less visible than it was, since both values are now near-black, but it is still wrong. Fixing it needs the inline script to write the tag, which is script doing a job CSS cannot. | cosmetic |
| 2 | **A dead class reference in a comment.** The doc comment in [TechIcon.astro](../src/components/TechIcon.astro) points at `.stack-icon` in the stylesheet. No such class exists - the callers pass `.chip-icon` or `.tag-icon`. Anyone following the pointer finds nothing. | stale prose |
| 3 | **The hero repeats the full stack as chips.** Eleven chips under the lead answer what he works with immediately, and then Skills sets out the same eleven names grouped a screen further down. It is deliberate - the hero should not need the reader to scroll to learn the domain - but the two lists are the same content twice and worth revisiting if the stack grows. | judgement call |

---

## Changelog

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
  [diagram-tokens.ts](../src/diagram-tokens.ts),
  [diagram-layout.ts](../src/diagram-layout.ts) and
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
