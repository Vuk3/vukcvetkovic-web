/**
 * German copy.
 *
 * Formal address (Sie) throughout, and technology names left in English with
 * German compounds hyphenated around them, which is how they are written in
 * German technical prose: Backend-Services, REST-APIs, React-Oberflächen.
 *
 * Typed as `Dict`, so this file must keep exactly the keys en.ts has.
 */
import type { Dict } from './types';

const de: Dict = {
  meta: {
    title: 'Vuk Cvetković - Backend-Entwickler',
    description:
      'Backend-Entwickler in Niš, Serbien. Services in NestJS und Node.js, ereignisgetriebene Infrastruktur auf AWS und die React-Oberflächen davor.',
    ogImageAlt: 'Vuk Cvetković, Backend-Entwickler',
  },

  nav: {
    skipToContent: 'Zum Inhalt springen',
    sections: 'Abschnitte',
    about: 'Über mich',
    skills: 'Kenntnisse',
    experience: 'Erfahrung',
    education: 'Ausbildung',
    projects: 'Projekte',
    services: 'Leistungen',
    contact: 'Kontakt',
    themeToggle: 'Design wechseln',
    language: 'Sprache',
  },

  hero: {
    positioning:
      'Backend-Entwickler bei Ncoded Solutions, in Niš. Ich baue Services in NestJS und Node.js, und in .NET, wenn ein Kunde damit schon arbeitet, und bringe sie dann auf AWS: Container, Queues und die Events, die dazwischen laufen.',
    cta: 'Kontakt aufnehmen',
    portraitAlt: 'Porträt von Vuk Cvetković',
    portraitPlaceholder: 'Porträt',
  },

  about: {
    label: 'Über mich',
    paragraphs: [
      'Der größte Teil meiner Arbeit liegt im Backend. Ich entwerfe APIs und die Services dahinter, überwiegend in NestJS und Node.js, und führe dieselbe Arbeit bis zu den React-Oberflächen darüber weiter, wenn ein Projekt das braucht.',
      'Mir liegt an Systemen, die auch nach dem ersten Release noch verständlich sind: klare Grenzen zwischen Services, Typen, die die Domäne beschreiben statt die Datenbank zu wiederholen, und eine Infrastruktur, die ein kleines Team ohne Zeremonie betreiben kann. Das meiste, was ich baue, läuft auf AWS.',
      'Ich lebe in Niš, Serbien. Angefangen habe ich auf der Full-Stack-Seite, mit .NET-Web-API-Services hinter ASP.NET-MVC-Seiten, und habe mich stetig zum Backend und der Infrastruktur darunter bewegt. Nebenher beende ich einen Master in Software Engineering.',
    ],
  },

  skills: {
    label: 'Kenntnisse',
    groups: {
      backend: { name: 'Backend' },
      frontend: { name: 'Frontend' },
      data: { name: 'Daten' },
      cloud: { name: 'Cloud & DevOps' },
    },
  },

  experience: {
    label: 'Erfahrung',
    roles: {
      ncoded: {
        role: 'Backend-Entwickler',
        bullets: [
          'Backend-Services in NestJS und Node.js: REST-APIs, JWT-Authentifizierung, rollenbasierte Zugriffskontrolle und Integrationen von Drittanbietern, über SQL- wie Dokumentdatenbanken.',
          'Dieselbe Arbeit in .NET, wenn ein Kunde damit schon arbeitet, mit Clean Architecture strukturiert, damit die Geschäftslogik vom umgebenden Framework trennbar bleibt.',
          'Die AWS-Seite: S3, ECS, EC2, Lambda, Route 53 und EventBridge, also Deployments und die ereignisgetriebenen Wege zwischen den Services.',
        ],
      },
      novateq: {
        role: 'Full-Stack-Entwickler',
        bullets: [
          'Backend-Services in .NET Web API und die Unternehmensseite in ASP.NET MVC, beides angepasst an das, was einzelne Kunden brauchten.',
          'Die Sportsbook-Plattform stabil gehalten, indem ich eingehende Störungen abgearbeitet habe, und Casino-Spielprojekte durchgesehen, um zu lernen, wie diese Seite gebaut wird.',
        ],
      },
    },
  },

  education: {
    label: 'Ausbildung',
    degrees: {
      master: {
        degree: 'Master, Software Engineering',
        school: 'Fakultät für Elektronik, Universität Niš',
      },
      bachelor: {
        degree: 'Bachelor, Informatik',
        school: 'Fakultät für Elektronik, Universität Niš',
      },
    },
  },

  projects: {
    label: 'Projekte',
    liveLabel: 'Live',
    sourceLabel: 'Quellcode',
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
    label: 'Womit ich helfen kann',
    items: [
      {
        title: 'Backend- und API-Entwicklung',
        description:
          'Services und APIs in NestJS, Node.js oder .NET: Datenmodellierung, Authentifizierung, Integrationen von Drittanbietern und die Tests, die das Ganze ehrlich halten.',
      },
      {
        title: 'Full-Stack-Produktarbeit',
        description:
          'Ein Feature vom Schema bis zum Bildschirm: die API, das React-Frontend und der typisierte Vertrag dazwischen.',
      },
      {
        title: 'AWS-Architektur und Deployment',
        description:
          'Cloud-Infrastruktur aufsetzen oder das Bestehende nachziehen: Umgebungen, CI/CD-Pipelines und eine Durchsicht von Kosten und Zuverlässigkeit.',
      },
      {
        title: 'Technische Durchsicht und Beratung',
        description:
          'Ein zweites Paar Augen auf bestehenden Code oder eine bestehende Architektur: Code-Review, ein Refactoring-Plan und eine ehrliche Antwort darauf, ob sich eine Neuentwicklung lohnt.',
      },
    ],
  },

  contact: {
    label: 'Kontakt',
    intro:
      'Per E-Mail erreichen Sie mich am schnellsten. Wenn Sie ein Projekt im Kopf haben, genügt eine grobe Beschreibung des Problems für den Anfang.',
    emailLabel: 'E-Mail',
    linkedinLabel: 'LinkedIn',
    githubLabel: 'GitHub',
  },

  footer: {
    backToTop: 'Nach oben',
  },

  notFound: {
    metaTitle: 'Seite nicht gefunden - Vuk Cvetković',
    status: '404',
    heading: 'Seite nicht gefunden',
    body: 'Die Adresse ist möglicherweise falsch, oder die Seite wurde verschoben. Die ganze Website steht auf einer einzigen Seite, und der Link unten führt Sie dorthin.',
    cta: 'Zurück zur Startseite',
  },
};

export default de;
