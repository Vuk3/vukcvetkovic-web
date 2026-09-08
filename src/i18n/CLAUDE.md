# src/i18n

The four dictionaries and the types that bind them. Full reference:
**[docs/content-and-i18n.md](../../docs/content-and-i18n.md)**.

## Only prose belongs here

Names, emails, URLs, employers, dates, slugs, years and technology labels live in
[src/site.ts](../site.ts). If it reads identically in all four languages it is a fact and
belongs there, written once instead of four times.

The borderline cases are already decided: `company` is a fact, `school` is prose (the
faculty's name is genuinely different in Serbian and German), and the results table is a
fact because metric names go untranslated and the values are numbers.

## en.ts is the contract

`Dict` is `typeof import('./en').default`, and `sr.ts`, `fr.ts` and `de.ts` are each
annotated `: Dict`. So:

- **Add the key to [en.ts](./en.ts) first.** Everything else is then a type error until it
  is filled in, which is the compiler walking you through the change.
- A key that is missing, misspelled or the wrong shape fails `astro check`, and therefore
  fails `npm run build`.
- Keys under `skills.groups`, `experience.roles`, `education.degrees`, `projects.items` and
  `projects.stackGroups` are the `id` fields in [src/site.ts](../site.ts). They are the
  join key between the two files.

⚠️ **Array lengths are not checked.** A locale with two paragraphs where English has three
builds clean and renders shorter. Adding a bullet, a service or a step means editing four
files, not one.

⚠️ **Every entry under `projects.items` must carry the same keys**, using an empty array
rather than a missing one where a project has nothing to say. `Dict` is derived from this
file, so a project with a different shape turns every access on the detail page into a
union.

## Writing the copy

- **No em dash and no semicolon.** Use a plain hyphen or a colon. This applies to every
  locale.
- **TypeScript is never a listed skill or a named technology.** Naming it next to Node and
  React states the obvious.
- The positioning is Node-first: NestJS and Node.js lead, .NET follows as the thing a client
  already runs.
- Periods and other language-neutral values are not here. If you find yourself translating
  "Present", the value is in the wrong file.

## Adding a locale

Six places, and **two of them are not type-checked** because
[astro.config.mjs](../../astro.config.mjs) is `.mjs` and cannot import a typed const. An
incomplete registration builds clean and quietly damages the sitemap. The full list and the
verified failure modes are in
[docs/content-and-i18n.md §6](../../docs/content-and-i18n.md#6-adding-a-locale) - read it
before starting.

## utils.ts

`localizePath` is coupled to `build.format: 'preserve'` - it adds a trailing slash only for
paths with no file extension, because the 404 pages are served as `404.html`. Read
[docs/routing-and-deploy.md §3](../../docs/routing-and-deploy.md#3-buildformat-preserve-and-the-three-things-coupled-to-it)
before changing it.

`getDict` falls back to English for an unknown locale rather than throwing. That path is
unreachable from the routes as written, so English copy appearing under a prefix means the
bug is in the route params, not here.
