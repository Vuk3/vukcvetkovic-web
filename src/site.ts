import type { Dict, Lang } from "./i18n/types";

/**
 * Facts, not copy.
 *
 * Anything identical in every language — the name, email, social URLs,
 * employers, dates, technology labels — lives here so it is maintained once
 * instead of four times. Prose lives in src/i18n/{en,sr,fr,de}.ts.
 *
 * The `id` of each entry is its key in the dictionaries, and the id types below
 * are derived from the dictionary itself: adding an entry here without adding
 * its copy to en.ts (and therefore to every locale) is a type error.
 */

type SkillGroupId = keyof Dict["skills"]["groups"];
type RoleId = keyof Dict["experience"]["roles"];
type DegreeId = keyof Dict["education"]["degrees"];
type ProjectId = keyof Dict["projects"]["items"];

interface SkillGroup {
  id: SkillGroupId;
  items: string[];
}

interface Role {
  id: RoleId;
  company: string;
  period: string;
  /** The role he holds now, which is the one place the accent earns a second use. */
  current?: boolean;
}

interface Degree {
  id: DegreeId;
  period: string;
}

interface Project {
  id: ProjectId;
  tech: string[];
  /** Omit or leave empty to hide a link. */
  links: { live?: string; source?: string };
}

/**
 * Grouped skills. Group names are translated, the entries are proper nouns.
 *
 * Node-side first, .NET after it, which is the order Vuk wants read. TypeScript
 * is deliberately absent: naming it next to Node and React states the obvious.
 */
const skillGroups: SkillGroup[] = [
  {
    id: "backend",
    items: ["NestJS", "Node.js", "Express", ".NET", "C#"],
  },
  {
    id: "frontend",
    items: ["React", "Astro"],
  },
  {
    id: "data",
    items: ["SQL", "MongoDB"],
  },
  {
    id: "cloud",
    items: ["AWS", "Docker"],
  },
];

/**
 * Roles, newest first.
 *
 * Periods are open-ended rather than saying "Present", which would be an
 * English word sitting in the language-neutral file and would need translating
 * in four places.
 */
const experience: Role[] = [
  {
    id: "ncoded",
    company: "Ncoded Solutions",
    period: "2024 -",
    current: true,
  },
  {
    id: "novateq",
    company: "Novateq Global",
    period: "2023 - 2024",
  },
];

/**
 * Degrees, newest first. Only the dates live here.
 *
 * The school name sits in the dictionaries instead, unlike `company` above: a
 * company name is the same word in every language, while this faculty is
 * "Elektronski fakultet" in Serbian and "Fakultat fur Elektronik" in German.
 * Treating it as a language-neutral fact left English on the other three pages.
 */
const education: Degree[] = [
  {
    id: "master",
    period: "2023 - 2026",
  },
  {
    id: "bachelor",
    period: "2019 - 2023",
  },
];

/** Projects in display order. TODO: fill in tech tags and links. */
const projects: Project[] = [
  {
    id: "projectOne",
    tech: ["TODO: tech", "TODO: tech"],
    links: {},
  },
  {
    id: "projectTwo",
    tech: ["TODO: tech", "TODO: tech"],
    links: {},
  },
  {
    id: "projectThree",
    tech: ["TODO: tech", "TODO: tech"],
    links: {},
  },
];

export const site = {
  name: "Vuk Cvetković",
  domain: "vukcvetkovic.com",
  url: "https://vukcvetkovic.com",

  email: "vuk.cvetkovic11@gmail.com",

  links: {
    linkedin: "https://www.linkedin.com/in/vuk3/",
    github: "https://github.com/Vuk3",
  },

  /** Open Graph image served from /public. TODO: add public/og.png at 1200×630. */
  ogImage: "/og.png",

  skillGroups,
  experience,
  education,
  projects,
};

/** Autonyms — shown in their own language in every locale, so never translated. */
export const languageNames: Record<Lang, string> = {
  en: "English",
  sr: "Srpski",
  fr: "Français",
  de: "Deutsch",
};
