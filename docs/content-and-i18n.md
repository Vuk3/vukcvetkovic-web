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
- **The results table is a fact.** Metric names (`Precision`, `mAP@0.5`) go untranslated
  and the values are numbers, so the whole table is language-neutral and sits in
  [src/site.ts](../src/site.ts). Only the two word column heads (`Model`, `Annotations`)
  are prose.

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
nothing errors - the page simply renders fewer. All 13 array paths currently match across
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
- **Four entries have no free brand mark** and use a lucide outline quoted as path data
  instead: `C#`, `SQL`, `AWS` and `ML.NET`. Amazon and Microsoft had theirs removed from
  simple-icons over trademark, and SQL is a standard rather than a product. `stroked: true`
  is what switches [TechIcon.astro](../src/components/TechIcon.astro) from a fill to a
  stroke.
- **`darkHex` exists because eight brand colours fail on the dark ground.** `hex` is the
  light-mode colour and `darkHex` the substitute.
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
  `before: string[]`, `branches: string[][]`, `after: string[]`. The diagram is hard-coded
  to one fork, so it draws a chain that fans out once and gathers back in once. A project
  with a different topology needs the component changed, not the data.
- **`results.values`** is aligned positionally with `results.metrics`, with `null` where a
  metric was not computed. The detail page prints `null` as `-`. Get the order wrong and
  the numbers land under the wrong headings with nothing to catch it.

Numbers are stored raw and formatted per locale in the component with `Intl.NumberFormat`,
so `17942` prints as `17,942` in English and `17.942` in Serbian and German. Metrics are
fixed at three fraction digits deliberately: `0.800` and `0.8` are not the same claim.

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

- **The build succeeds. 16 pages, zero warnings, zero errors.** Routing comes from
  `prefixedLocales`, not from Astro's `i18n` config, and `Astro.currentLocale` is unused
  (§2), so `/de/` and every page under it is still generated and still correct in
  isolation.
- **The sitemap drops the locale from every hreflang alternate set.** `/` goes from
  `en de fr sr` to `en fr sr`, while `/de` is still listed as a URL - an orphan no
  alternate points at.
- **The locale's 404 page gets indexed.** `@astrojs/sitemap` recognises `/de/404.html` as a
  404 only while `de` is a known locale. Without it the sitemap grows from 12 URLs to 13
  and `https://vukcvetkovic.com/de/404` is offered to crawlers.
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
- `results.values` misaligned with `results.metrics` - numbers under the wrong headings
- an unsupported `light-dark()` - the icon falls back to the text colour (§4)

---

## Changelog

- 2026-09-08 - first version of this page.
