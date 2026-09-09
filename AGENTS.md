# AGENTS.md

This file orients Claude Code (and any AI agent) working in this repository:
`vukcvetkovic.com`, a four-language personal site built with Astro and deployed to
Cloudflare.

> **`CLAUDE.md` is a symlink to this file**, committed as one, so the two names can never
> drift and there is only ever one file to edit. Do not replace the symlink with a second
> copy.

## Start here

Documentation is layered, so you only pay for what the task needs:

1. **This file** - the working rules below. Always loaded.
2. **[docs/README.md](./docs/README.md)** - the map: what the site is, where each kind of
   change lives, and the index of every deep-dive. Read it when you need to find
   something, not as a matter of course.
3. **A nested `CLAUDE.md`** in the directory you are editing, loaded on top of this one:
   [src/i18n](./src/i18n/CLAUDE.md) (copy) ·
   [src/components](./src/components/CLAUDE.md) ·
   [src](./src/CLAUDE.md) (routes and layout).
4. **[docs/](./docs/)** - the detail. Three deep-dives, each written to be self-sufficient:
   paste one link into a prompt and start working.

**If you already know which area you are in, go straight to its deep-dive.** You should
not need the map to change a dictionary, add a project, or touch the stylesheet.

## Working rules

- **`npm run check` is the only gate this project has.** There is no test runner and no
  linter - nothing to run but `astro check`, which reports 0 errors across 40 files. Do
  not add Vitest, ESLint or Prettier without asking.
- **`npm run build` runs `astro check` first**, so a failed build is usually a type error
  rather than a build error. Read the first failure, not the last line.
- **Do not start the dev server.** Vuk runs it himself. Verify with `npm run check` and
  `npm run build` instead. If he does ask for it, start it detached with
  `astro dev --background` and manage it with `astro dev stop`, `astro dev status` and
  `astro dev logs`.
- **The type system is the safety net, so let it work.** Ids in
  [src/site.ts](./src/site.ts) are typed against the dictionary, technology names against
  the mark registry, and every locale against English, so a change that skips a step
  usually fails `astro check` rather than rendering a gap. That now covers
  [astro.config.ts](./astro.config.ts) as well: it is `.ts` so that it can import the
  locale list instead of repeating it, and tsconfig reaches the repo root - see
  [docs/content-and-i18n.md](./docs/content-and-i18n.md#6-adding-a-locale).
- **Update the doc that owns what you changed**, in the same commit, and add a dated line
  to that page's changelog.
- **Describe the present.** Dates and "changed from X" belong in git and on a changelog
  line, never in a behavioural claim.
- **Verify against the code.** Prose can lag. The files it links to are the authority.

## Code conventions

### Comments

- This codebase comments **why**, at a density well above normal, and that is deliberate:
  most declarations in [src/styles/global.css](./src/styles/global.css) and
  [src/site.ts](./src/site.ts) carry the reasoning behind the number. Match it. A new
  magic value with no note about how it was arrived at does not belong here.
- **When you touch a file, delete comments that no longer earn their place.** Clearing a
  stale one is part of the change, not a separate cleanup.
- Prefer deleting dead code to commenting it out. Git remembers.

### Content and copy

- **Prose lives in [src/i18n](./src/i18n/), facts live in [src/site.ts](./src/site.ts).**
  If it reads the same in all four languages - a name, a URL, an employer, a date, a
  technology label - it is a fact and belongs in one place, not four.
- **No em dash and no semicolon in copy.** Use a plain hyphen or a colon.
- Copy changes touch all four dictionaries or none. English alone is a half-shipped change.

### Styling and markup

- **Colour, spacing and easing come from the `--site-*` tokens** in
  [src/styles/global.css](./src/styles/global.css). A raw hex in a component is a bug -
  the only two in the codebase are the `theme-color` meta tags, and they are a known
  duplication.
- **The site ships no JavaScript file.** Three inline blocks, about 1.2 KB in total, cover
  the theme toggle and menu dismissal. Anything new should be CSS first. If it genuinely
  needs script, ask before adding it.
- Reach for an existing component before writing a new one. Sections go through
  [Section.astro](./src/components/Section.astro), which owns the widths and the three
  head shapes.

### Abstractions and dependencies

- **Do not introduce a new abstraction or a new dependency without asking** - a base
  component, a generic helper, a utility library, a content collection. Two similar blocks
  are not duplication worth abstracting.
- Keep it concrete and local. Match the shape of the surrounding code rather than
  importing a pattern from elsewhere.
- **No formatter is configured** and quote style is genuinely mixed across files
  ([src/site.ts](./src/site.ts) uses double, [src/tech.ts](./src/tech.ts) single). Match
  the file you are in rather than reformatting it.

### Uncertainty

- **When a choice would change the result and the answer is not in the code or the docs,
  ask rather than guess.** This is a personal site, so the questions that matter are about
  taste, positioning and wording, and none of them are recoverable from the codebase.
- If part of a task is blocked on an answer, do everything that is not, then ask.

## Commit messages

Conventional commits, **one line**: `type: description`. No scope, no body, no trailer -
the whole log is single subjects, and 11 of the 12 commits are `feat:` or `fix:` (the
twelfth is `first commit`).

- Types in use: `feat`, `fix`.
- No scope. `feat: add project pages with a per-service technology section`, not
  `feat(projects): ...`.
- Lowercase after the prefix, imperative verb, and subjects run to about 76 characters.
- **Never append a PR number** and never add a `Co-Authored-By` trailer.
