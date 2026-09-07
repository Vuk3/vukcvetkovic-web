/**
 * French copy.
 *
 * Formal address (vous) throughout, and the typographic apostrophe rather than
 * the straight one, which is correct French and also saves escaping it inside
 * these single-quoted strings.
 *
 * Typed as `Dict`, so this file must keep exactly the keys en.ts has.
 */
import type { Dict } from "./types";

const fr: Dict = {
  meta: {
    title: "Vuk Cvetković - Développeur backend",
    description:
      "Développeur backend à Niš, en Serbie. Des services en NestJS et Node.js, une infrastructure événementielle sur AWS, et les interfaces React devant.",
    ogImageAlt: "Vuk Cvetković, développeur backend",
  },

  nav: {
    skipToContent: "Aller au contenu",
    sections: "Sections",
    about: "À propos",
    skills: "Compétences",
    experience: "Expérience",
    education: "Formation",
    projects: "Projets",
    services: "Services",
    contact: "Contact",
    themeToggle: "Changer de thème",
    language: "Langue",
  },

  hero: {
    positioning:
      "Développeur backend chez Ncoded Solutions, à Niš. Je construis des services en NestJS et Node.js, et en .NET quand un client y est déjà, puis je les fais tourner sur AWS : conteneurs, files d’attente et les événements qui circulent entre eux.",
    cta: "Me contacter",
    portraitAlt: "Portrait de Vuk Cvetković",
    portraitPlaceholder: "portrait",
  },

  about: {
    label: "À propos",
    paragraphs: [
      "L’essentiel de mon travail se situe côté backend. Je conçois des API et les services derrière, surtout en NestJS et Node.js, et je poursuis le même travail jusqu’aux interfaces React au-dessus quand le projet le demande.",
      "Je tiens aux systèmes qui restent compréhensibles après la première mise en production : des frontières nettes entre les services, des types qui décrivent le domaine plutôt que de répéter la base de données, et une infrastructure qu’une petite équipe peut exploiter sans cérémonie. L’essentiel de ce que je construis tourne sur AWS.",
      "Je vis à Niš, en Serbie. J’ai commencé du côté full-stack, en construisant des services .NET Web API derrière des sites ASP.NET MVC, puis je me suis déplacé vers le backend et l’infrastructure en dessous. En parallèle, je termine un master en génie logiciel.",
    ],
  },

  skills: {
    label: "Compétences",
    groups: {
      backend: { name: "Backend" },
      frontend: { name: "Frontend" },
      data: { name: "Données" },
      cloud: { name: "Cloud et DevOps" },
    },
  },

  experience: {
    label: "Expérience",
    roles: {
      ncoded: {
        role: "Développeur backend",
        bullets: [
          "Des services backend en NestJS et Node.js : API REST, authentification JWT, contrôle d’accès par rôles et intégrations tierces, sur des bases SQL comme documentaires.",
          "Le même travail en .NET quand un client y est déjà, structuré en Clean Architecture pour que la logique métier reste séparable du framework autour.",
          "Le côté AWS : S3, ECS, EC2, Lambda, Route 53 et EventBridge, ce qui couvre les déploiements et les chemins événementiels entre les services.",
        ],
      },
      novateq: {
        role: "Développeur full-stack",
        bullets: [
          "Des services backend en .NET Web API et le site de l’entreprise en ASP.NET MVC, adaptés tous les deux aux besoins de chaque client.",
          "Maintien de la plateforme Sportsbook en traitant les incidents remontés, et revue de projets de jeux de casino pour comprendre comment ce côté se construit.",
        ],
      },
    },
  },

  education: {
    label: "Formation",
    degrees: {
      master: {
        degree: "Master, génie logiciel",
        school: "Faculté de génie électronique, Université de Niš",
      },
      bachelor: {
        degree: "Licence, informatique",
        school: "Faculté de génie électronique, Université de Niš",
      },
    },
  },

  projects: {
    label: "Projets",
    liveLabel: "En ligne",
    sourceLabel: "Code source",
    items: {
      projectOne: {
        title: "TODO: Project name",
        description:
          "TODO: one or two sentences: what it does, who it is for, and what was interesting to build.",
      },
      projectTwo: {
        title: "TODO: Project name",
        description:
          "TODO: one or two sentences: what it does, who it is for, and what was interesting to build.",
      },
      projectThree: {
        title: "TODO: Project name",
        description:
          "TODO: one or two sentences: what it does, who it is for, and what was interesting to build.",
      },
    },
  },

  services: {
    label: "Ce sur quoi je peux aider",
    items: [
      {
        title: "Développement backend et API",
        description:
          "Des services et des API en NestJS, Node.js ou .NET : modélisation des données, authentification, intégrations tierces, et les tests qui les tiennent honnêtes.",
      },
      {
        title: "Travail produit full-stack",
        description:
          "Une fonctionnalité menée du schéma à l’écran : l’API, le front React, et le contrat typé entre les deux.",
      },
      {
        title: "Architecture et déploiement AWS",
        description:
          "Mettre en place une infrastructure cloud ou resserrer celle qui tourne déjà : environnements, pipelines CI/CD, et une revue du coût et de la fiabilité.",
      },
      {
        title: "Revue technique et conseil",
        description:
          "Un deuxième regard sur un code ou une architecture existants : revue de code, plan de refactorisation, et une réponse honnête sur l’intérêt d’une réécriture.",
      },
    ],
  },

  contact: {
    label: "Contact",
    intro:
      "L’e-mail est le moyen le plus rapide de me joindre. Si vous avez un projet en tête, une description sommaire du problème suffit pour commencer.",
    emailLabel: "E-mail",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
  },

  footer: {
    backToTop: "Haut de page",
  },
};

export default fr;
