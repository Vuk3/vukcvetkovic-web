# Content and i18n

Every word on the site is either a **fact** in [src/site.ts](../src/site.ts) or **prose**
in one of the four dictionaries under [src/i18n/](../src/i18n/). The type system stitches
the two together: ids are keyed off the dictionary, technology names off a mark registry,
and every translated locale off English, so most content mistakes fail `astro check`
rather than rendering a gap.

> [docs/README.md](./README.md) is the map, but **you should not need it to work on
> content** - everything below is self-contained. The rules that apply while editing a
> dictionary are in [src/i18n/CLAUDE.md](../src/i18n/CLAUDE.md).

---

## 0. Working on content

| I need to change… | Touch |
|---|---|
| wording in one language | that locale's file: [en.ts](../src/i18n/en.ts) · [sr.ts](../src/i18n/sr.ts) · [fr.ts](../src/i18n/fr.ts) · [de.ts](../src/i18n/de.ts) |
| **the shape of the dictionary** (a new key) | [en.ts](../src/i18n/en.ts) first, then all three others - `Dict` is derived from English (§2) |
| a name, email, social URL, employer, period | [src/site.ts](../src/site.ts) - the `site` object at the bottom |
| a skill group or the technologies in it | `skillGroups` in [src/site.ts](../src/site.ts) + a group name in every dictionary |
| **a technology's icon or brand colour** | [src/tech.ts](../src/tech.ts) - §4 |
| a project, its stack, its results table | `projects` in [src/site.ts](../src/site.ts) + `projects.items` in every dictionary - §5 |
| **add or remove a language** | six places, two unchecked by the compiler - §6. Read it before editing [astro.config.mjs](../astro.config.mjs) |
| how a locale prefix is put onto a path | `localizePath` in [src/i18n/utils.ts](../src/i18n/utils.ts) - and read [routing-and-deploy.md](./routing-and-deploy.md) first, it is coupled to `build.format` |

**Read §6 before adding a locale.** It is the only registration in the project the type
system cannot check, and an incomplete one builds clean.

---

## 1. The split: facts versus prose

| | [src/site.ts](../src/site.ts) | [src/i18n/*.ts](../src/i18n/) |
|---|---|---|
| Holds | name, email, social URLs, company names, periods, slugs, years, technology lists, the results table | everything a reader reads as a sentence, plus labels and meta titles |
| Written | once | four times |
| Test | does it read identically in all four languages? | would a translator change it? |

Two entries sit on the surprising side of that line, and both are deliberate:

- **`company` is a fact, `school` is prose.** "Ncoded Solutions" is the same word
  everywhere, but the faculty is "Elektronski fakultet" in Serbian, so `education` in
  [src/site.ts](../src/site.ts) carries only the period and the school name lives in each
  dictionary.
- **A results table is split, not sorted onto one side.** The figures are
  language-neutral and live in [src/site.ts](../src/site.ts), while every word in the
  table - the column heads and the row labels - lives in the dictionaries, because whether
  a head needs translating depends on the project. See §5.1.

Periods are written open-ended - `"2024 -"` - rather than "2024 - Present", because
"Present" would be an English word sitting in the language-neutral file.

The `current: true` flag on a role is not styling metadata that could live in CSS: it
drives `data-current` on the period, which is the one place on the homepage the accent
colour is used a second time. Astro renders `false` as `data-current="false"`, which
`[data-current]` would still match, so [Experience.astro](../src/components/Experience.astro)
passes an empty string or `undefined`, never the boolean.

---

## 2. The dictionary contract, and its one hole

[src/i18n/types.ts](../src/i18n/types.ts) derives the contract from English:

```ts
export type Dict = typeof import('./en').default;
```

`sr.ts`, `fr.ts` and `de.ts` are each annotated `: Dict`. So **English is the source of
truth for the shape**: a key that is missing, misspelled, or the wrong kind of value fails
`astro check`, and therefore fails `npm run build`.

⚠️ **Array lengths are not part of that contract.** A locale may carry two paragraphs
where English carries three, or four service items where English has four titles, and
nothing errors - the page simply renders fewer. All 48 array paths currently match across
the four locales, and there is no check that keeps them matching. If you add a bullet in
English, add it in three other files or the page quietly gets shorter in three languages.

`getDict` in [src/i18n/utils.ts](../src/i18n/utils.ts) **falls back to English** for an
unknown locale rather than throwing, via `resolveLang`. That fallback is unreachable from
the routes as written - every page resolves `lang` from a `getStaticPaths` param drawn
from `prefixedLocales` - so if you ever see English copy under a prefix, the bug is
upstream in the params, not here.

Note that `Astro.currentLocale` is **not used anywhere in the codebase**. Locale comes
from the route param, narrowed by `resolveLang`. That matters for §6.

---

## 3. Ids are round-tripped through the dictionary

[src/site.ts](../src/site.ts) does not declare its own id unions. It reads them back out of
the dictionary:

```ts
type SkillGroupId = keyof Dict["skills"]["groups"];
type RoleId       = keyof Dict["experience"]["roles"];
type DegreeId     = keyof Dict["education"]["degrees"];
type ProjectId    = keyof Dict["projects"]["items"];
type StackGroupId = keyof Dict["projects"]["stackGroups"];
```

The consequence is the useful part: **adding an entry to `site.ts` without adding its copy
to `en.ts` is a type error.** The id is the join key between the two files, and it cannot
name something that has no copy behind it. Going the other way is not an error - copy with
no entry pointing at it is simply unused.

---

## 4. The mark registry types every technology name

[src/tech.ts](../src/tech.ts) is an object of icon definitions closed with `satisfies
Record<string, TechIcon>`, and `TechName` is `keyof typeof techIcons`. `satisfies` rather
than an annotation is what keeps the keys a literal union instead of widening to `string`.

Every technology list in [src/site.ts](../src/site.ts) - skill groups, a project's `tech`
row, a project's grouped `stack` - is typed `TechName[]`. **So a technology with no mark
behind it fails `astro check` rather than rendering a gap.**

Three things about the registry are not obvious from reading it:

- **Icons are imported from `simple-icons`, not pasted.** It is a devDependency and Vite
  tree-shakes it, so only the marks actually referenced reach the bundle. No image file is
  involved, which is the point: a path taking `currentColor` works in both themes and costs
  no request.
- **Nine of the 28 entries have no free brand mark** and use a lucide outline quoted as
  path data instead. Amazon and Microsoft had theirs removed from simple-icons over
  trademark, SQL is a standard rather than a product, and Tkinter, Pyshark and Matplotlib
  simply have none. The four Microsoft ones all take the .NET violet, which keeps them a
  family, and every outline takes a glyph none of the others use. `stroked: true` is what
  switches [TechIcon.astro](../src/components/TechIcon.astro) from a fill to a stroke.
- **`darkHex` exists because a brand colour that carries on paper can close up on the
  dark ground** - 21 of the 28 entries need one. `hex` is the light-mode colour and
  `darkHex` the substitute. Four entries have **no `hex` at all** and so sit at the text
  tone: `SQL`, `Tkinter`, `Pyshark` and `Matplotlib` have no published colour to borrow,
  and a guessed one would be the only invented value in the file.
  [TechIcon.astro](../src/components/TechIcon.astro) emits them as one
  `--brand: light-dark(<hex>, <darkHex>)` custom property. Where `light-dark()` is
  unsupported the property is invalid at computed-value time and the icon inherits the text
  colour, which is the correct fallback rather than a broken one.

`getTechIcon(name)` exists only to widen the return type. Indexing `techIcons` directly
gives each value's own narrow type, so `.hex` would not exist on the four uncoloured
entries. Call the function.

### Adding a technology

1. Add the key to `techIcons` in [src/tech.ts](../src/tech.ts). Import the mark from
   `simple-icons` if it has one, otherwise quote a lucide outline as a string and set
   `stroked: true`.
2. Check the brand colour on the dark ground. If it closes up, add a `darkHex`.
3. Name it in a `skillGroups` entry or a project `stack` group in
   [src/site.ts](../src/site.ts).

A skill group's name needs copy under `skills.groups.<id>.name` in all four dictionaries.
A project stack group's name needs copy under `projects.stackGroups.<id>`, which is a plain
string rather than an object.

---

## 5. Adding a project

A project is one entry in [src/site.ts](../src/site.ts) plus its copy in four dictionaries.
No layout changes: the homepage row, the index row and the detail page are all frames that
take whatever is in the array.

**In [src/site.ts](../src/site.ts)**, append to `projects`:

| Field | Notes |
|---|---|
| `id` | the key under `projects.items` in the dictionaries. Must exist there first, or it is a type error (§3) |
| `slug` | last path segment under `/projects/`. Drives `getStaticPaths` in all four project routes |
| `year` | shown in the left column of the index row |
| `tech` | the short identifying list, for the homepage row and the index row |
| `stack` | the full list, grouped by **service** rather than category. Only the detail page shows it |
| `results` | optional. Omit it and the results section does not render |
| `links` | `{}` hides both links. Filling either `live` or `source` makes that one appear |

**In each of the four dictionaries**, add the matching entry under `projects.items`.

⚠️ **Every entry under `projects.items` must carry the same keys, even where a project has
nothing to say.** `Dict` is derived from `en.ts`, so a second project with a different
shape turns every access on the detail page into a union and breaks the component that
renders both. Use an empty array, not a missing key.
[ProjectDetail.astro](../src/components/ProjectDetail.astro) checks `.length > 0` on
`overview`, `steps`, `features`, `dataset`, `results` and `takeaway` and skips the section,
so an empty array renders nothing and costs nothing.

Two shapes are not free-form:

- **`flow`** feeds [ProjectFlow.astro](../src/components/ProjectFlow.astro) as
  `before: string[]`, `branches: string[][]`, `after: string[]`. Any number of branches
  works - the component hands the count to the stylesheet as `--flow-n` so the two
  connecting bars can find the first and last stems. What is fixed is the **topology**: one
  fan-out and one gather-in. A project that forks twice, or not at all, needs the component
  changed rather than the data.
- **The results table splits down the middle: numbers in
  [src/site.ts](../src/site.ts), every word in the dictionaries.** See §5.1.

### 5.1 The results table

Only a project that has a measured comparison carries `results`. Omit it and the section
does not render.

The split exists because two projects with a table answer the same question differently. `Precision`
and `mAP@0.5` are the terms the field uses and go untranslated in all four languages, while
`Mode`, `Sequential` and `Encryption (s)` plainly do not - so which column heads need a
translator is a **per-project** question, and the dictionary is where that gets decided.

| Where | What |
|---|---|
| [src/site.ts](../src/site.ts) | `formats`, one per figure column, and `rows[].values`, the figures themselves |
| the four dictionaries | `results.columns`, `results.rows`, `results.notes` |

⚠️ **Four lists have to stay aligned and nothing checks any of them.** `formats` and every
row's `values` are one entry per figure column. `columns` carries **one more** than that -
the head for the row-label column itself. `rows` is one label per row of figures. Get any
of them out of step and the page renders happily with numbers under the wrong headings.

`formats` picks the printing, and the precision is part of the claim rather than a display
preference:

| Format | Prints | Used for |
|---|---|---|
| `count` | a plain integer | annotation counts, file counts |
| `ratio` | exactly three fraction digits | metrics, where `0.800` and `0.8` are different statements |
| `seconds` | exactly two | a stopwatch reading, at the precision the run reported |

Numbers are stored raw and formatted per locale in the component with `Intl.NumberFormat`,
so `17942` prints as `17,942` in English and `17.942` in Serbian and German, and `68.91`
becomes `68,91` outside English. `null` in `values` prints as `-`.

`copy.metaTitle` and `copy.metaDescription` are passed to `Base` by the route, not by the
component, in all four project routes.

---

## 6. Adding a locale

⚠️ **This is the one registration the compiler cannot check end to end, and an incomplete
one builds clean.** There is no auto-discovery.

Adding a locale `xx` touches six places. Start at the top: widening `locales` in
[src/i18n/types.ts](../src/i18n/types.ts) widens `Lang`, and that turns the three
`Record<Lang, …>` maps below it into type errors until they are filled in - which is how
the compiler walks you through half the list.

| # | Where | File | Checked? |
|---|---|---|---|
| 1 | the new dictionary, annotated `: Dict` | `src/i18n/xx.ts` | ✅ every key against English |
| 2 | `locales` | [src/i18n/types.ts](../src/i18n/types.ts) | — the source. Widens `Lang` |
| 3 | `ogLocales` | [src/i18n/types.ts](../src/i18n/types.ts) | ✅ `Record<Lang, string>` |
| 4 | `dictionaries` | [src/i18n/utils.ts](../src/i18n/utils.ts) | ✅ `Record<Lang, Dict>` |
| 5 | `languageNames` | [src/site.ts](../src/site.ts) | ✅ `Record<Lang, string>` |
| 6 | `i18n.locales` **and** the `sitemap` i18n map | [astro.config.mjs](../astro.config.mjs) | ❌ **nothing checks these** |

`ogLocales` is separate from `locales` because Open Graph wants a full code (`de_DE`) where
hreflang takes the bare tag (`de`). `languageNames` holds autonyms - shown in their own
language in every locale, so never translated.

### What actually fails when step 6 is missed

[astro.config.mjs](../astro.config.mjs) is `.mjs` and cannot import the typed const, which
is why the file carries a comment saying to keep the list in sync. Verified by dropping
`de` from both lists and building:

- **The build succeeds, every page, zero warnings, zero errors.** Routing comes from
  `prefixedLocales`, not from Astro's `i18n` config, and `Astro.currentLocale` is unused
  (§2), so `/de/` and every page under it is still generated and still correct in
  isolation.
- **The sitemap drops the locale from every hreflang alternate set.** `/` goes from
  `en de fr sr` to `en fr sr`, while `/de` is still listed as a URL - an orphan no
  alternate points at.
- **The locale's 404 page gets indexed.** `@astrojs/sitemap` recognises `/de/404.html` as a
  404 only while `de` is a known locale. Without it the sitemap gains a URL and
  `https://vukcvetkovic.com/de/404` is offered to crawlers.
- **The page HTML and the sitemap now disagree.** `/de/index.html` still emits all four
  `hreflang` links plus `x-default`, because [Base.astro](../src/layouts/Base.astro) builds
  them from `locales` in `types.ts`.

So the whole cost is SEO, it is invisible locally, and the only way to catch it is to read
`dist/client/sitemap-0.xml`. **Check it after adding a locale.**

---

## 7. What throws, what warns, what falls back silently

**Fails `astro check`, so fails `npm run build`:**

- a key missing, misspelled or the wrong shape in `sr.ts`, `fr.ts` or `de.ts`
- an `id` in [src/site.ts](../src/site.ts) with no matching copy in `en.ts`
- a technology name with no entry in [src/tech.ts](../src/tech.ts)
- a `Record<Lang, …>` map missing a locale after `locales` is widened

**Silently degrades:**

- a translated array shorter than the English one - the page renders fewer items (§2)
- an unknown locale reaching `getDict` - English copy, no warning (§2)
- a missing `src/assets/portrait.*` - [Hero.astro](../src/components/Hero.astro) globs it
  rather than importing it, so the text placeholder stands in and the build still passes
- a locale missing from [astro.config.mjs](../astro.config.mjs) - see §6
- a results table whose `formats`, `values`, `columns` and `rows` are out of step - figures
  under the wrong headings (§5.1)
- an unsupported `light-dark()` - the icon falls back to the text colour (§4)

---

## Changelog

- 2026-09-08 - Easy Breathe added as a fourth project.
- 2026-09-08 - Network Traffic Analyzer added as a third project, and the first with no
  `results` at all, so the section is skipped rather than padded.
- 2026-09-08 - Python replaced C# in the backend skill group, and prose now names
  Node.js with NestJS and Express in parentheses rather than listing them as equals.
- 2026-09-08 - Encryptix added as a second project. The results table moved its words
  into the dictionaries and kept its figures in `site.ts` (§5.1), and `stackGroups` gained
  `client` and `service`.
- 2026-09-08 - first version of this page.
