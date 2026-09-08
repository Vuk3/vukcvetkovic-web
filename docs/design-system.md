# Design system

One stylesheet, [src/styles/global.css](../src/styles/global.css), about 1600 lines, and
almost every number in it carries a comment saying how it was arrived at. The system is
near-monochrome with a single accent, one typeface on two axes, and all of its motion in
CSS.

> [docs/README.md](./README.md) is the map, but **you should not need it to work on the
> design** - everything below is self-contained. The rules that apply while editing a
> component are in [src/components/CLAUDE.md](../src/components/CLAUDE.md).

---

## 0. Working on the design

| I need to change… | Touch |
|---|---|
| a colour | the `--site-*` block on `:root` **and** its counterpart in `.dark` - §1 |
| **a Tailwind colour utility's meaning** (`text-muted`, `bg-band`) | the `@theme inline` block - §1. Do not remove `inline` |
| the page gutter | `--site-pad`, once, on `:root` |
| **how wide a section sits** | the `.shell-*` family - §2 - plus `SectionWidth` in [Section.astro](../src/components/Section.astro) |
| a section's head shape, tone or rhythm | props on [Section.astro](../src/components/Section.astro) - §3 |
| the display voice | `.display`, `.display-name`, `.sec-label`, `.sec-statement` - §4 |
| **the hero load sequence** | `--enter-delay` on the elements in [Hero.astro](../src/components/Hero.astro), not the keyframes - §5 |
| a scroll reveal | the `.reveal` / `.reveal-item` / `.tech` blocks at the bottom of the stylesheet - §5. **Longhands only** |
| the sticky header's behaviour | `.site-head`, `.head-inner`, the `head-settle` keyframes and `--head-pad` - §5 |
| dark mode | the `.dark` block, **and** the two `theme-color` tags in [Base.astro](../src/layouts/Base.astro) - §6 and open item 1 |

**Read §5 before touching any animation.** The `animation` shorthand silently breaks the
scroll timelines, and two custom properties have to stay registered.

---

## 1. The token path, and why `inline` is load-bearing

Colour flows through three stages:

```
:root { --site-accent: #0d5c5c }      ← the value, light
.dark { --site-accent: #5fc2b7 }      ← the value, dark
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

The palette is nine tokens. Three of them are less obvious than the rest:

| Token | What it is for |
|---|---|
| `--site-surface` | chips and insets |
| `--site-band` | the section band tone, kept **separate from `surface`** so the step between sections can be tuned without also darkening every chip |
| `--site-close` | the tinted closing tone, the only one carrying any hue, pulled towards the accent |

In dark mode `--site-band` is **lighter** than the ground, because a band cannot go darker
than `#0f0f0f`. Dark mode generally is a separate design rather than an inversion: the
accent is lightened until it carries, reaching 9.1:1 there against 8.5:1 on light.

`--site-muted` was darkened to `#67655f` when the bands arrived - on the deepest band the
previous value fell to 4.44:1, under AA. It clears 4.8:1 on all three light tones now.
**Check a muted-on-band pair before changing either.**

Two non-colour tokens are also global on purpose: `--site-ease` (one easing curve for the
whole site, so nothing moves in a different way) and `--site-pad` (the gutter, once, at
`clamp(1.25rem, 4vw, 3rem)`).

---

## 2. `.shell` is a family, not a width

Every section names its own measure. `.shell` centres it and adds the gutter **outside**
the named width, so changing the gutter never changes a measure:

```css
max-width: calc(var(--shell, 72rem) + 2 * var(--site-pad));
```

| Class | Width | Used by |
|---|---|---|
| `.shell-hero` | 72rem | the hero, the header, the footer, the 404 - the page's outer edge |
| `.shell-projects` | 69rem | Projects, and both project pages' heads |
| `.shell-skills` | 66rem | Skills, and a project's stack |
| `.shell-services` | 66rem | Services, and a project's feature grid |
| `.shell-timeline` | 58rem | Experience, Education, a project's steps and results |
| `.shell-contact` | 50rem | Contact |
| `.shell-about` | 49rem | About, and a project's prose - 560px of prose beside the rail, about 66 characters |

**The point of the family is the rhythm of edges.** Every section used to sit in the same
1024px column, and that uniformity is most of what made the page read as a CV rendered in a
browser: nothing about the width told you that a run of prose and a grid of logos are
different kinds of content.

⚠️ **`.shell-hero` is not a `SectionWidth`.** `SectionWidth` in
[Section.astro](../src/components/Section.astro) lists the six section measures and
deliberately omits `hero`, which is applied directly by
[Nav.astro](../src/components/Nav.astro), [Hero.astro](../src/components/Hero.astro),
[Footer.astro](../src/components/Footer.astro) and
[NotFound.astro](../src/components/NotFound.astro). Adding a width means adding both the CSS
class and the union member.

`.measure` (42rem, about 75 characters at the 17px body size) is separate: it caps a
paragraph sitting inside a column wider than itself, which after the width pass is just the
bullets and descriptions.

---

## 3. Sections: width, head, tone, space

[Section.astro](../src/components/Section.astro) takes four orthogonal props, and only two
of them are about looks.

**`head`** is the structural one:

| `head` | Shape | Why |
|---|---|---|
| `rail` (default) | the label hangs in the left margin on a corner bracket of two hairlines | **because each section sits at its own width, the bracket lands at a different x every time** - that shift is the page's rhythm, and it marks where a section starts without needing a band |
| `rule` | a full-contrast rule across the whole column with the label on it | for sections whose content wants the full width: Experience and Projects. Full contrast rather than the hairline tone, so it does not read as one more of the content rules below it |
| `statement` | the label sets as a large phrase across the top | for Services, whose label is a sentence ("What I can help with", 25 characters in French). A phrase cannot hang in an 11rem margin |

Only `rail` gets `.sec-grid`, which becomes a two-column grid at 64rem and flattens to a
rule with the label under it below that.

**`tone`** is spent sparingly and that is the whole design: `band` on About and Projects,
`close` on Contact, and nothing on the other five. Sections used to alternate ground and
band all the way down, and **strict alternation turned out to be its own kind of
uniformity** - eight blocks of equal weight, each starting and ending the same way. The
head shapes and the shifting rail carry the boundaries instead, which frees tone to do what
a band should do: set two sections apart. A project page spends it three times, the same
restraint.

**`space`** is `full` or `lite`. `.sec` is capped under 6rem of block padding because where
two sections both sit on the ground their paddings add up: at 7.5rem the gap between Skills
and Experience came to 240 points of nothing, which read as the page having run out rather
than as breathing room. Padding rather than a top margin, so two banded sections could meet
with no strip of ground showing between them.

---

## 4. Type: one family, two axes

`@fontsource-variable/archivo/wdth.css` - the **width** build, 62-125%, at 90 KB latin
against 35 KB for weight alone.

⚠️ **The display/text contrast on this site is width, not a second typeface.** Headings run
expanded and heavy, text runs at normal width. That is what the extra 55 KB buys, and it is
the whole type system. Do not add a second family.

`.display` (112% width, 620 weight) goes on type doing structural work - the name, section
headings, dates - and **never on anything meant to be read as prose**, where the expanded
width slows reading down.

`.display-name` is the one place the page is allowed to be loud, at
`clamp(2.75rem, 9.5vw, 8.75rem)`. Three things about it are measured rather than chosen:

- **It sets on two lines, one word each,** because that is what buys the size. On one line
  "Vuk Cvetković" runs out of measure around 60px. [Hero.astro](../src/components/Hero.astro)
  splits `site.name` on the space rather than hardcoding the halves, so the name is still
  stated in exactly one place, and it stays one `<h1>` with one accessible name.
- **Leading is 0.92, not tighter,** because the second line carries a `ć` whose accent
  collided with the baseline above at 0.86.
- **Neither line wraps at any width.** At the cap, "Cvetković" sets 730 wide in the 808 the
  column gives it, and the ratio only improves at every step down. This matters because a
  single word has nowhere to wrap to and would simply overhang the page.

Body copy is 17px (`1.0625rem`) at 1.7 line-height. `text-wrap: balance` on `h1`-`h4`,
`text-wrap: pretty` on `p`. Figures that sit in columns use `font-variant-numeric:
tabular-nums` - periods, the results table, the 404 status.

---

## 5. Motion

All of it is CSS. There is no observer and no library. The system has two halves and they
are chosen by one question: **is the element in view at first paint?**

| | `.enter` / `.enter-name` | `.reveal` / `.reveal-item` / `.tech` |
|---|---|---|
| Driven by | time | scroll position, `animation-timeline: view()` |
| Ordered by | `--enter-delay`, set inline per element | `animation-range`, stepped by `nth-child` |
| Used by | the hero, both project page heads, the 404 | every section below the fold |

**Why the split:** the hero is in view at first paint, and a `view()` timeline there would
sit at 100% and never animate.

**The delay is a custom property set inline in the markup**, not an `nth-child` rule in the
stylesheet, so the order of the hero sequence is readable where the elements are: first name
0, last name 120ms, portrait 300ms, then the rule and everything under it at 440ms.
`.enter-name` additionally blurs in from 10px - only the two name lines carry that, because
a blur on body copy would read as a rendering fault.

⚠️ **Stagger on a scroll timeline is `animation-range`, not `animation-delay`** -
`animation-delay` has no meaning on a scroll timeline. `.reveal-item` steps
`entry 6%/12%/18%` and flattens at `nth-child(n+4)`. `.tech` steps six times, the largest
skill group having five entries.

⚠️ **The `.tech` ranges count within their row, not across the section.** That is why the
tiles sit directly inside the `<dd class="skill-items">` in
[Skills.astro](../src/components/Skills.astro) - so the marks fill in group by group as the
row arrives. Wrapping them in another element resets the count and breaks the stagger.

### Three rules that are easy to break

1. ⚠️ **Longhands only, never the `animation` shorthand.** The shorthand resets
   `animation-timeline` and `animation-range` to their initial values, so writing it
   silently undoes the timeline on the line below. Every scroll-driven rule in the file
   spells out `animation-name`, `animation-timing-function`, `animation-fill-mode`,
   `animation-timeline` and `animation-range` separately.

2. ⚠️ **Two custom properties must stay `@property`-registered**, because an unregistered
   one jumps at the midpoint instead of interpolating:
   - `--brand-mix` (`<percentage>`, initial `100%`) fades a technology mark from the muted
     tone to its brand colour. Unregistered, the colour snaps on.
   - `--head-pad` (`<length>`, initial `0.85rem`) drives the header's padding as it settles.

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

### Interaction, and one rule about it

Every hover state on the page **moves nothing in the layout**. `.link` and `.mail` animate
two stacked background gradients rather than a border, because only `background-size` can be
animated directionally. `.nav-link` and `.entry::after` scale a pseudo-element from the
left. `.tech:hover` lifts 2px and nothing else - an accent underline was there, borrowed from
`.link`, and had to go: **these are spans, not links, and an underline on hover promises a
destination that does not exist.**

The accent is used for links, the CTA, and exactly one other thing: the period of the
current role, via `[data-current]`.

---

## 6. Theming is class-based, except for one tag

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
stylesheet.** [Base.astro](../src/layouts/Base.astro) hardcodes `#faf9f7` and `#0f0f0f`,
keyed on `prefers-color-scheme`. Two consequences: they duplicate `--site-bg` in both
themes and must be changed with it, and because they key on the media query rather than the
class, **a manual toggle does not change the browser chrome colour.** See open item 1.

---

## 7. Open items

| # | Item | Severity |
|---|---|---|
| 1 | **`theme-color` disagrees with the toggle.** The two tags in [Base.astro](../src/layouts/Base.astro) key on `prefers-color-scheme`, while everything else keys on the `.dark` class, so a visitor whose system is light and who switches the site to dark gets light browser chrome around a dark page. Fixing it needs the inline script to write the tag, which is script doing a job CSS cannot - worth deciding whether it is worth the bytes. | cosmetic |
| 2 | **A dead class reference in a comment.** The doc comment in [TechIcon.astro](../src/components/TechIcon.astro) points at `.stack-icon` in the stylesheet. No such class exists - it is `.tech-icon`. Anyone following the pointer finds nothing. | stale prose |
| 3 | **`hero-cta` is applied but never defined.** [Hero.astro](../src/components/Hero.astro) puts `class="hero-cta"` on the paragraph wrapping the CTA, and the stylesheet has no rule for it. Harmless, but it reads as a hook that does something. | dead code |

---

## Changelog

- 2026-09-08 - the request diagram takes any number of branches, driven by `--flow-n`.
- 2026-09-08 - first version of this page.
