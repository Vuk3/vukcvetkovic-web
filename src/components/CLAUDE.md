# src/components

Every component here is an `.astro` file with no framework runtime behind it. Design
reference: **[docs/design-system.md](../../docs/design-system.md)**.

## The site ships no JavaScript file

One CSS file, three woff2 faces, five webp variants. The three `<script>` blocks that exist
are small enough that Astro inlines them into each page - about 1.2 KB total, no extra
request.

- **Reach for CSS first.** The language switcher and the mobile menu are native `<details>`
  elements. The header's scroll behaviour is a `scroll(root)` timeline. The section reveals
  are `view()` timelines. None of that costs script.
- **If something genuinely needs a script, ask before adding it.** Two exist today: the
  theme toggle, and the layout's single dismissal listener.
- **Dismissal is already solved.** A disclosure gets `data-menu` and
  [Base.astro](../layouts/Base.astro) handles Escape, pointer-down outside and clicking a
  link inside, for every disclosure on the page at once. Do not add a second listener.

## Go through Section.astro

[Section.astro](./Section.astro) owns the four things that make a section: `width`, `head`,
`tone`, `space`. A homepage or project-page section is `<Section …>` with content inside,
never a hand-rolled `<section>` with its own wrapper.

- **`width` is a key of the `.shell-*` family** in
  [global.css](../styles/global.css). Adding a width means adding both the CSS class and the
  `SectionWidth` union member. `hero` is deliberately not in that union - it is applied
  directly by the header, hero, footer and 404.
- **`tone` is spent twice on the homepage and three times on a project page.** It is not
  decoration for a new section: the head shape and the width are what separate sections
  from each other. Do not reintroduce alternating bands.
- `head="rule"` is for content that wants the full column, `head="statement"` for a label
  that is a sentence rather than a word.

## Conventions

- **Every component takes `lang: Lang` and calls `getDict(lang)`.** Nothing reads
  `Astro.currentLocale`, and nothing hardcodes a string a reader will see.
- **A page's body lives in one shared component** so the unprefixed route and its `[lang]`
  twin cannot drift - [Home.astro](./Home.astro),
  [NotFound.astro](./NotFound.astro), [ProjectIndex.astro](./ProjectIndex.astro),
  [ProjectDetail.astro](./ProjectDetail.astro). See
  [src/CLAUDE.md](../CLAUDE.md).
- **No raw hex.** Colour comes from the `--site-*` tokens or the Tailwind utilities mapped
  to them (`text-muted`, `bg-band`, `border-hairline`). Brand colours for technology marks
  are the exception and they live in [src/tech.ts](../tech.ts).
- **Tailwind utilities for one-off layout, a named class in
  [global.css](../styles/global.css) for anything that repeats or carries reasoning.** A
  clamp with a comment explaining how the number was arrived at belongs in the stylesheet.
- Comment **why**. This codebase does so at a density well above normal, deliberately -
  match it.

## Which reveal class

Decided by one question: is the element in view at first paint?

| Situation | Class |
|---|---|
| in view at first paint (hero, page heads, 404) | `enter`, ordered with an inline `style="--enter-delay:…"` |
| a block arriving on scroll | `reveal` |
| a repeated item that should stagger within its list | `reveal-item` |

`reveal-item` staggers by `nth-child`, so it goes on the `<li>` directly inside the list.
Wrapping the items in another element resets the count. The same is true of the technology
tiles, which is why they sit directly inside `<dd class="skill-items">`.

Full mechanics, including the two `@property` registrations and the longhands-only rule:
[docs/design-system.md §Motion](../../docs/design-system.md#5-motion).

## Accessibility details already decided

- Icons are `aria-hidden="true"` when a text label sits beside them.
- The Education crest has `alt=""` - the school is named in the line next to it, and
  announcing the crest as well reads the same thing twice.
- The mobile menu carries **no landmark**. The desktop `<nav>` already has one named
  "Sections", and a second with the same name gives a screen reader two identical entries.
- `data-current` is passed as `''` or `undefined`, never a boolean: Astro renders `false` as
  `data-current="false"`, which `[data-current]` would still match.
