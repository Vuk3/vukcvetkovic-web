/**
 * German copy - placeholders, not translations.
 *
 * Every value is the English string from en.ts prefixed with `TODO:`.
 * Replace the text and drop the prefix as you translate.
 *
 * Typed as `Dict`, so this file must keep exactly the keys en.ts has.
 */
import type { Dict } from './types';

const de: Dict = {
  meta: {
    title: 'TODO: Vuk Cvetković - Backend developer',
    description:
      'TODO: Backend developer in Niš, Serbia. Services in NestJS and Node.js, event-driven infrastructure on AWS, and the React interfaces in front of them.',
    ogImageAlt: 'TODO: Vuk Cvetković, backend developer',
  },

  nav: {
    skipToContent: 'TODO: Skip to content',
    sections: 'TODO: Sections',
    about: 'TODO: About',
    skills: 'TODO: Skills',
    experience: 'TODO: Experience',
    education: 'TODO: Education',
    projects: 'TODO: Projects',
    services: 'TODO: Services',
    contact: 'TODO: Contact',
    themeToggle: 'TODO: Toggle dark theme',
    language: 'TODO: Language',
  },

  hero: {
    positioning:
      'TODO: Backend developer at Ncoded Solutions, in Niš. I build services in NestJS and Node.js, and in .NET where a client already runs it, then put them on AWS: containers, queues, and the events that pass between them.',
    cta: 'TODO: Contact me',
    portraitAlt: 'TODO: Portrait of Vuk Cvetković',
    portraitPlaceholder: 'TODO: portrait',
  },

  about: {
    label: 'TODO: About',
    paragraphs: [
      'TODO: Most of my work sits on the backend. I design APIs and the services behind them, mainly in NestJS and Node.js, and carry the same work through to the React interfaces on top of them when a project needs it.',
      'TODO: I care about systems that are still understandable after the first release: clear boundaries between services, types that describe the domain rather than restate the database, and infrastructure a small team can operate without ceremony. Most of what I build runs on AWS.',
      'TODO: I am based in Niš, Serbia. I started on the full-stack side, building .NET Web API services behind ASP.NET MVC sites, and have moved steadily towards the backend and the infrastructure under it. Alongside the work I am finishing a master’s in software engineering.',
    ],
  },

  skills: {
    label: 'TODO: Skills',
    groups: {
      backend: { name: 'TODO: Backend' },
      frontend: { name: 'TODO: Frontend' },
      data: { name: 'TODO: Data' },
      cloud: { name: 'TODO: Cloud & DevOps' },
    },
  },

  experience: {
    label: 'TODO: Experience',
    roles: {
      ncoded: {
        role: 'TODO: Backend developer',
        bullets: [
          'TODO: Backend services in NestJS and Node.js: REST APIs, JWT authentication, role-based access control and third-party integrations, over both SQL and document databases.',
          'TODO: The same work in .NET where a client already runs it, structured with Clean Architecture so the business logic stays separable from the framework around it.',
          'TODO: The AWS side: S3, ECS, EC2, Lambda, Route 53 and EventBridge, covering deployments and the event-driven paths between services.',
        ],
      },
      novateq: {
        role: 'TODO: Full-stack developer',
        bullets: [
          'TODO: Backend services in .NET Web API and the company site in ASP.NET MVC, adapted to what individual clients needed.',
          'TODO: Kept the Sportsbook platform stable by working through incoming issues, and reviewed casino game projects to learn how that side is built.',
        ],
      },
    },
  },

  education: {
    label: 'TODO: Education',
    degrees: {
      master: {
        degree: 'TODO: MSc, Software Engineering',
      },
      bachelor: {
        degree: 'TODO: BSc, Computing and Informatics',
      },
    },
  },

  projects: {
    label: 'TODO: Projects',
    liveLabel: 'TODO: Live',
    sourceLabel: 'TODO: Source',
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
    label: 'TODO: What I can help with',
    items: [
      {
        title: 'TODO: Backend and API development',
        description:
          'TODO: Services and APIs in NestJS, Node.js or .NET: data modelling, authentication, third-party integrations, and the tests that keep them honest.',
      },
      {
        title: 'TODO: Full-stack product work',
        description:
          'TODO: A feature taken from schema to screen: the API, the React front end, and the typed contract between them.',
      },
      {
        title: 'TODO: AWS architecture and deployment',
        description:
          'TODO: Setting up cloud infrastructure or tightening what already runs: environments, CI/CD pipelines, and a review of cost and reliability.',
      },
      {
        title: 'TODO: Technical review and consulting',
        description:
          'TODO: A second pair of eyes on an existing codebase or architecture: code review, a refactoring plan, and an honest answer on whether a rewrite is worth it.',
      },
    ],
  },

  contact: {
    label: 'TODO: Contact',
    intro:
      'TODO: Email is the fastest way to reach me. If you have a project in mind, a rough description of the problem is enough to start.',
    emailLabel: 'TODO: Email',
    linkedinLabel: 'TODO: LinkedIn',
    githubLabel: 'TODO: GitHub',
  },

  footer: {
    backToTop: 'TODO: Back to top',
  },
};

export default de;
