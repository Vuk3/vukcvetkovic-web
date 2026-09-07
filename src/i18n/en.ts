/**
 * English copy — the source of truth for the dictionary shape.
 *
 * `Dict` in ./types.ts is derived from this object (`type Dict = typeof en`),
 * so every other locale is typed against it and a missing key fails the build.
 *
 * Only prose belongs here. Names, URLs, employers, dates and technology labels
 * live in src/site.ts. The keys under `skills.groups`, `experience.roles` and
 * `projects.items` match the `id` fields there.
 */
const en = {
  meta: {
    title: 'Vuk Cvetković — Full-stack developer',
    description:
      'Full-stack developer working in .NET, NestJS, AWS, React and TypeScript. Backend systems, cloud infrastructure, and the interfaces on top of them.',
    ogImageAlt: 'Vuk Cvetković, full-stack developer',
  },

  nav: {
    skipToContent: 'Skip to content',
    sections: 'Sections',
    about: 'About',
    skills: 'Skills',
    experience: 'Experience',
    projects: 'Projects',
    services: 'Services',
    contact: 'Contact',
    themeToggle: 'Toggle dark theme',
    language: 'Language',
  },

  hero: {
    positioning:
      'Full-stack developer. Backend systems in .NET and NestJS, interfaces in React and TypeScript, running on AWS.',
    cta: 'Contact me',
    portraitAlt: 'Portrait of Vuk Cvetković',
    portraitPlaceholder: 'TODO: portrait',
  },

  about: {
    label: 'About',
    paragraphs: [
      "I'm a full-stack developer. Most of my work sits on the backend — designing APIs and the services behind them in .NET and NestJS — and carries through to the React and TypeScript interfaces on top of them.",
      'I care about systems that are still understandable after the first release: clear boundaries between services, types that describe the domain rather than restate the database, and infrastructure a small team can operate without ceremony. Most of what I build runs on AWS.',
      'TODO: a paragraph in your own words — where you are based, how you got into this work, and what you are focused on right now.',
    ],
  },

  skills: {
    label: 'Skills',
    groups: {
      backend: { name: 'Backend' },
      frontend: { name: 'Frontend' },
      cloud: { name: 'Cloud & DevOps' },
    },
  },

  experience: {
    label: 'Experience',
    roles: {
      roleOne: {
        role: 'TODO: Job title',
        bullets: [
          'TODO: what you built or owned, and for whom.',
          'TODO: a technical decision you made and why.',
          'TODO: an outcome — scope, scale, or what it replaced.',
        ],
      },
      roleTwo: {
        role: 'TODO: Job title',
        bullets: [
          'TODO: what you built or owned, and for whom.',
          'TODO: a technical decision you made and why.',
        ],
      },
    },
  },

  projects: {
    label: 'Projects',
    liveLabel: 'Live',
    sourceLabel: 'Source',
    items: {
      projectOne: {
        title: 'TODO: Project name',
        description:
          'TODO: one or two sentences — what it does, who it is for, and what was interesting to build.',
      },
      projectTwo: {
        title: 'TODO: Project name',
        description:
          'TODO: one or two sentences — what it does, who it is for, and what was interesting to build.',
      },
      projectThree: {
        title: 'TODO: Project name',
        description:
          'TODO: one or two sentences — what it does, who it is for, and what was interesting to build.',
      },
    },
  },

  services: {
    label: 'What I can help with',
    items: [
      {
        title: 'Backend and API development',
        description:
          'Services and APIs in .NET or NestJS: data modelling, authentication, third-party integrations, and the tests that keep them honest.',
      },
      {
        title: 'Full-stack product work',
        description:
          'A feature taken from schema to screen — the API, the React front end, and the TypeScript contract between them.',
      },
      {
        title: 'AWS architecture and deployment',
        description:
          'Setting up cloud infrastructure or tightening what already runs: environments, CI/CD pipelines, and a review of cost and reliability.',
      },
      {
        title: 'Technical review and consulting',
        description:
          'A second pair of eyes on an existing codebase or architecture: code review, a refactoring plan, and an honest answer on whether a rewrite is worth it.',
      },
    ],
  },

  contact: {
    label: 'Contact',
    intro:
      'Email is the fastest way to reach me. If you have a project in mind, a rough description of the problem is enough to start.',
    emailLabel: 'Email',
    linkedinLabel: 'LinkedIn',
    githubLabel: 'GitHub',
  },

  footer: {
    backToTop: 'Back to top',
  },
};

export default en;
