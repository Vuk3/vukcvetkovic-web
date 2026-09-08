import type { Dict, Lang } from "./i18n/types";
import type { TechName } from "./tech";

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
type StackGroupId = keyof Dict["projects"]["stackGroups"];

interface SkillGroup {
  id: SkillGroupId;
  /**
   * Typed against the mark registry in src/tech.ts, so a technology listed here
   * with no icon behind it fails `astro check` rather than rendering a gap.
   */
  items: TechName[];
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

/** One row of a project's stack, as a service rather than as a category. */
interface ProjectStackGroup {
  id: StackGroupId;
  items: TechName[];
}

interface ProjectResultRow {
  /** The model, named the way its own ecosystem names it. */
  model: string;
  /**
   * Which version of the dataset produced this row. The annotation count is
   * what distinguishes the two versions and it is a number, so it needs no
   * translating - only formatting, which the page does per locale.
   */
  annotations: number;
  /** Aligned with `metrics`. `null` where a metric was not computed. */
  values: (number | null)[];
}

/**
 * A measured comparison. Metric names are the technical terms used untranslated
 * in every language, and the values are numbers, so the whole table is a
 * language-neutral fact and belongs here rather than in four dictionaries.
 */
interface ProjectResults {
  metrics: string[];
  rows: ProjectResultRow[];
}

/** Exported because the pages hand one to the components that render it. */
export interface Project {
  id: ProjectId;
  /** Last path segment of the project's own page, under /projects/. */
  slug: string;
  year: string;
  /**
   * The names that identify the project at a glance, for the rows on the
   * homepage and the index. `stack` below is the full list, grouped by which
   * service each name belongs to, and only the project's own page shows it.
   */
  tech: TechName[];
  stack: ProjectStackGroup[];
  results?: ProjectResults;
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

/**
 * Projects in display order.
 *
 * `stack` is grouped by service rather than by category, because on a system
 * built out of four processes that is the more useful fact: it says which names
 * belong to the Python side and which to the .NET side, which is the whole
 * subject of this project. Names are typed against the mark registry, so every
 * one of them renders with an icon or fails `astro check`.
 *
 * The two models are deliberately absent from the stack. YOLOv8m and ML.NET are
 * what the project measures, not what it was built with, so they appear in the
 * results table and in the prose instead of as two more chips in a list.
 *
 * `links` is empty while the repository is private. Filling in either URL is
 * enough for the link to appear - the rows drop the ones with no href.
 */
const projects: Project[] = [
  {
    id: "objectDetection",
    slug: "object-detection",
    year: "2026",
    tech: ["React", "NestJS", "FastAPI", "Ultralytics", "ASP.NET Core", "ML.NET"],
    stack: [
      { id: "frontend", items: ["React"] },
      { id: "gateway", items: ["NestJS"] },
      { id: "pythonService", items: ["Python", "FastAPI", "Ultralytics", "PyTorch", "OpenCV", "NumPy"] },
      { id: "dotnetService", items: ["ASP.NET Core", "C#", "ML.NET"] },
      { id: "data", items: ["Roboflow"] },
    ],
    results: {
      metrics: ["Precision", "Recall", "F1", "mAP@0.5", "mAP@0.5:0.95"],
      rows: [
        { model: "YOLOv8m", annotations: 8813, values: [0.738, 0.8, null, 0.79, 0.455] },
        { model: "YOLOv8m", annotations: 17942, values: [0.894, 0.867, null, 0.916, 0.552] },
        { model: "ML.NET", annotations: 8813, values: [0.669, 0.645, 0.657, 0.58, null] },
        { model: "ML.NET", annotations: 17942, values: [0.862, 0.709, 0.778, 0.748, null] },
      ],
    },
    links: {},
  },
];

export const site = {
  name: "Vuk Cvetković",
  domain: "vukcvetkovic.com",
  url: "https://vukcvetkovic.com",

  email: "vuk@vukcvetkovic.com",

  links: {
    linkedin: "https://www.linkedin.com/in/vuk3/",
    github: "https://github.com/Vuk3",
  },

  /** Open Graph image served from /public, 1200x630. */
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
