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

/**
 * How one column's figures are printed. Two projects measure two different
 * kinds of thing, and the precision is part of the claim: three fraction digits
 * because 0.800 and 0.8 do not say the same thing, two on a stopwatch reading
 * because that is what the run reported.
 */
export type ResultFormat = "count" | "ratio" | "seconds";

interface ProjectResultRow {
  /** `null` where a figure was not computed for this row. */
  values: (number | null)[];
}

/**
 * A measured comparison, as numbers only.
 *
 * Every word in the table - the column heads and the row labels - lives in the
 * dictionaries instead, because whether a head needs translating depends on the
 * project: `mAP@0.5` and `Precision` are the same in all four languages, while
 * `Mode`, `Sequential` and `Encryption` are not. Keeping the numbers here and
 * the words there is the same split the rest of this file follows.
 *
 * ⚠️ Three lists have to stay aligned and nothing checks them: `formats` and
 * every row's `values` are one entry per figure column, and the dictionary's
 * `results.columns` carries one more (the row-label head) while its
 * `results.rows` is one label per row here.
 */
interface ProjectResults {
  formats: ResultFormat[];
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
    /*
     * Python sits where C# used to. C# was the one entry here that only ever
     * appeared alongside .NET, so it said nothing the entry beside it did not,
     * while Python is a language of its own on this list and carries a project.
     */
    items: ["NestJS", "Node.js", "Express", ".NET", "Python"],
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
      formats: ["count", "ratio", "ratio", "ratio", "ratio", "ratio"],
      rows: [
        { values: [8813, 0.738, 0.8, null, 0.79, 0.455] },
        { values: [17942, 0.894, 0.867, null, 0.916, 0.552] },
        { values: [8813, 0.669, 0.645, 0.657, 0.58, null] },
        { values: [17942, 0.862, 0.709, 0.778, 0.748, null] },
      ],
    },
    links: {},
  },
  {
    id: "encryptix",
    slug: "encryptix",
    year: "2023",
    tech: ["C#", ".NET", "WCF", "Windows Forms"],
    /*
     * Two processes, so two rows. The three ciphers are deliberately absent for
     * the same reason the two models are absent above: they are the subject of
     * the project rather than something it was built with, so they carry the
     * diagram and the prose instead of sitting in a list of chips.
     */
    stack: [
      { id: "client", items: ["Windows Forms", "C#"] },
      { id: "service", items: ["WCF", ".NET", "C#"] },
    ],
    results: {
      formats: ["count", "seconds", "seconds"],
      rows: [
        { values: [150, 68.91, 70.13] },
        { values: [150, 44.16, 40.39] },
      ],
    },
    links: {},
  },
  {
    id: "networkTrafficAnalyzer",
    slug: "network-traffic-analyzer",
    year: "2024",
    tech: ["Python", "Tkinter", "Pyshark", "Matplotlib"],
    /*
     * One process, so the groups name jobs rather than services: the window, the
     * reading of the capture, and the charts drawn from it.
     *
     * Wireshark is in the stack without being in `tech` above. Nothing imports
     * it, but Pyshark shells out to its tshark, so the analysis does not run
     * without it installed - which makes it a real dependency and a poor
     * summary chip.
     */
    stack: [
      { id: "interface", items: ["Python", "Tkinter"] },
      { id: "capture", items: ["Pyshark", "Wireshark"] },
      { id: "charts", items: ["Matplotlib"] },
    ],
    /*
     * No `results`: this one measures nothing. The paper is a survey of traffic
     * analysis with an application built to demonstrate it, not a comparison, so
     * the results section is simply absent from the page rather than padded with
     * a table that would have to invent its own subject.
     */
    links: {},
  },
  {
    id: "easyBreathe",
    slug: "easy-breathe",
    year: "2024",
    tech: ["React Native", "Expo", "NestJS", "MongoDB"],
    stack: [
      { id: "mobile", items: ["React Native", "Expo"] },
      { id: "api", items: ["NestJS", "MongoDB"] },
    ],
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
