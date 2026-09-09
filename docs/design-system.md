# Design system

One stylesheet, [src/styles/global.css](../src/styles/global.css), and almost every number
in it carries a comment saying how it was arrived at. The system is near-monochrome with a
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

All of it is CSS. The one script on the site is the active-section observer in §7, and it
draws no animation. The reveal system has two halves, chosen by one question: **is the
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

The site ships **no JavaScript file**. Four inline blocks cover the pre-paint theme
script, the theme toggle, the dismissal of every disclosure, and this. The request diagram was built with a fourth - an
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

## 9. Open items

| # | Item | Severity |
|---|---|---|
| 1 | **`theme-color` disagrees with the toggle.** The two tags in [Base.astro](../src/layouts/Base.astro) key on `prefers-color-scheme`, while everything else keys on the `.dark` class, so a visitor whose system is light and who switches the site to dark gets the light-theme chrome colour. It is much less visible than it was, since both values are now near-black, but it is still wrong. Fixing it needs the inline script to write the tag, which is script doing a job CSS cannot. | cosmetic |
| 2 | **A dead class reference in a comment.** The doc comment in [TechIcon.astro](../src/components/TechIcon.astro) points at `.stack-icon` in the stylesheet. No such class exists - the callers pass `.chip-icon` or `.tag-icon`. Anyone following the pointer finds nothing. | stale prose |
| 3 | **The hero repeats the full stack as chips.** Eleven chips under the lead answer what he works with immediately, and then Skills sets out the same eleven names grouped a screen further down. It is deliberate - the hero should not need the reader to scroll to learn the domain - but the two lists are the same content twice and worth revisiting if the stack grows. | judgement call |

---

## Changelog

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
