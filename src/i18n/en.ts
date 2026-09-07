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
    title: 'Vuk Cvetković - Backend developer',
    description:
      'Backend developer in Niš, Serbia. Services in NestJS and Node.js, event-driven infrastructure on AWS, and the React interfaces in front of them.',
    ogImageAlt: 'Vuk Cvetković, backend developer',
  },

  nav: {
    skipToContent: 'Skip to content',
    sections: 'Sections',
    about: 'About',
    skills: 'Skills',
    experience: 'Experience',
    education: 'Education',
    projects: 'Projects',
    services: 'Services',
    contact: 'Contact',
    themeToggle: 'Toggle dark theme',
    language: 'Language',
  },

  hero: {
    positioning:
      'Backend developer at Ncoded Solutions, in Niš. I build services in NestJS and Node.js, and in .NET where a client already runs it, then put them on AWS: containers, queues, and the events that pass between them.',
    cta: 'Contact me',
    portraitAlt: 'Portrait of Vuk Cvetković',
    portraitPlaceholder: 'TODO: portrait',
  },

  about: {
    label: 'About',
    paragraphs: [
      'Most of my work sits on the backend. I design APIs and the services behind them, mainly in NestJS and Node.js, and carry the same work through to the React interfaces on top of them when a project needs it.',
      'I care about systems that are still understandable after the first release: clear boundaries between services, types that describe the domain rather than restate the database, and infrastructure a small team can operate without ceremony. Most of what I build runs on AWS.',
      'I am based in Niš, Serbia. I started on the full-stack side, building .NET Web API services behind ASP.NET MVC sites, and have moved steadily towards the backend and the infrastructure under it. Alongside the work I am finishing a master’s in software engineering.',
    ],
  },

  skills: {
    label: 'Skills',
    groups: {
      backend: { name: 'Backend' },
      frontend: { name: 'Frontend' },
      data: { name: 'Data' },
      cloud: { name: 'Cloud & DevOps' },
    },
  },

  experience: {
    label: 'Experience',
    roles: {
      ncoded: {
        role: 'Backend developer',
        bullets: [
          'Backend services in NestJS and Node.js: REST APIs, JWT authentication, role-based access control and third-party integrations, over both SQL and document databases.',
          'The same work in .NET where a client already runs it, structured with Clean Architecture so the business logic stays separable from the framework around it.',
          'The AWS side: S3, ECS, EC2, Lambda, Route 53 and EventBridge, covering deployments and the event-driven paths between services.',
        ],
      },
      novateq: {
        role: 'Full-stack developer',
        bullets: [
          'Backend services in .NET Web API and the company site in ASP.NET MVC, adapted to what individual clients needed.',
          'Kept the Sportsbook platform stable by working through incoming issues, and reviewed casino game projects to learn how that side is built.',
        ],
      },
    },
  },

  education: {
    label: 'Education',
    degrees: {
      master: {
        degree: 'MSc, Software Engineering',
      },
      bachelor: {
        degree: 'BSc, Computing and Informatics',
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
          'TODO: one or two sentences: what it does, who it is for, and what was interesting to build.',
      },
      projectTwo: {
        title: 'TODO: Project name',
        description:
          'TODO: one or two sentences: what it does, who it is for, and what was interesting to build.',
      },
      projectThree: {
        title: 'TODO: Project name',
        description:
          'TODO: one or two sentences: what it does, who it is for, and what was interesting to build.',
      },
    },
  },

  services: {
    label: 'What I can help with',
    items: [
      {
        title: 'Backend and API development',
        description:
          'Services and APIs in NestJS, Node.js or .NET: data modelling, authentication, third-party integrations, and the tests that keep them honest.',
      },
      {
        title: 'Full-stack product work',
        description:
          'A feature taken from schema to screen: the API, the React front end, and the typed contract between them.',
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
