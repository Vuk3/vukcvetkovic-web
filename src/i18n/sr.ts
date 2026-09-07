/**
 * Serbian copy.
 *
 * Latin script, and the formal address throughout: the page speaks to a client
 * or a recruiter, not to a friend. Technology names stay in English, which is
 * how they are written in Serbian technical prose anyway.
 *
 * Typed as `Dict`, so this file must keep exactly the keys en.ts has.
 */
import type { Dict } from "./types";

const sr: Dict = {
  meta: {
    title: "Vuk Cvetković - Backend developer",
    description:
      "Backend developer iz Niša. Servisi u NestJS-u i Node.js-u, event-driven infrastruktura na AWS-u i React interfejsi ispred njih.",
    ogImageAlt: "Vuk Cvetković, backend developer",
  },

  nav: {
    skipToContent: "Pređi na sadržaj",
    sections: "Sekcije",
    about: "O meni",
    skills: "Veštine",
    experience: "Iskustvo",
    education: "Obrazovanje",
    projects: "Projekti",
    services: "Usluge",
    contact: "Kontakt",
    themeToggle: "Promeni temu",
    language: "Jezik",
  },

  hero: {
    positioning:
      "Backend developer u Ncoded Solutions, u Nišu. Gradim servise u NestJS-u i Node.js-u, i u .NET-u kada ga klijent već koristi, pa ih puštam na AWS: kontejneri, redovi i događaji koji prolaze između njih.",
    cta: "Kontaktirajte me",
    portraitAlt: "Portret Vuka Cvetkovića",
    portraitPlaceholder: "portret",
  },

  about: {
    label: "O meni",
    paragraphs: [
      "Najveći deo mog posla je na backendu. Projektujem API-je i servise iza njih, pretežno u NestJS-u i Node.js-u, i isti posao vodim do React interfejsa iznad njih kada projektu to treba.",
      "Stalo mi je do sistema koji se i posle prvog izdanja mogu razumeti: jasne granice između servisa, tipovi koji opisuju domen a ne prepričavaju bazu, i infrastruktura kojom mali tim može da upravlja bez ceremonije. Najviše toga što gradim radi na AWS-u.",
      "Živim u Nišu. Počeo sam sa full-stack strane, gradeći .NET Web API servise iza ASP.NET MVC sajtova, i postepeno se pomerao ka backendu i infrastrukturi ispod njega. Uz posao završavam master na softverskom inženjerstvu.",
    ],
  },

  skills: {
    label: "Veštine",
    groups: {
      backend: { name: "Backend" },
      frontend: { name: "Frontend" },
      data: { name: "Podaci" },
      cloud: { name: "Cloud i DevOps" },
    },
  },

  experience: {
    label: "Iskustvo",
    roles: {
      ncoded: {
        role: "Backend developer",
        bullets: [
          "Backend servisi u NestJS-u i Node.js-u: REST API-ji, JWT autentikacija, kontrola pristupa po rolama i integracije sa trećim stranama, nad SQL i dokument bazama.",
          "Isti posao u .NET-u kada ga klijent već koristi, po Clean Architecture, tako da poslovna logika ostane odvojiva od okvira oko sebe.",
          "AWS strana: S3, ECS, EC2, Lambda, Route 53 i EventBridge, što pokriva deploy i event-driven putanje između servisa.",
        ],
      },
      novateq: {
        role: "Full-stack developer",
        bullets: [
          "Backend servisi u .NET Web API-ju i sajt firme u ASP.NET MVC-u, oba prilagođavana onome što je pojedinačnom klijentu trebalo.",
          "Održavao Sportsbook platformu radeći na prijavljenim problemima, i pregledao casino projekte da naučim kako se ta strana pravi.",
        ],
      },
    },
  },

  education: {
    label: "Obrazovanje",
    degrees: {
      master: {
        degree: "Master, Softversko inženjerstvo",
        school: "Elektronski fakultet, Univerzitet u Nišu",
      },
      bachelor: {
        degree: "Osnovne studije, Računarstvo i informatika",
        school: "Elektronski fakultet, Univerzitet u Nišu",
      },
    },
  },

  projects: {
    label: "Projekti",
    liveLabel: "Uživo",
    sourceLabel: "Kod",
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
    label: "Sa čim mogu da pomognem",
    items: [
      {
        title: "Razvoj backenda i API-ja",
        description:
          "Servisi i API-ji u NestJS-u, Node.js-u ili .NET-u: modelovanje podataka, autentikacija, integracije sa trećim stranama, i testovi koji ih drže u redu.",
      },
      {
        title: "Full-stack rad na proizvodu",
        description:
          "Funkcionalnost od šeme do ekrana: API, React front end i tipizirani ugovor između njih.",
      },
      {
        title: "AWS arhitektura i deploy",
        description:
          "Postavljanje cloud infrastrukture ili doterivanje onoga što već radi: okruženja, CI/CD pipeline-ovi i pregled troška i pouzdanosti.",
      },
      {
        title: "Tehnički pregled i konsalting",
        description:
          "Drugi par očiju na postojećem kodu ili arhitekturi: code review, plan refaktorisanja i iskren odgovor na to da li se prepisivanje isplati.",
      },
    ],
  },

  contact: {
    label: "Kontakt",
    intro:
      "Mejl je najbrži način da me dobijete. Ako imate projekat na umu, dovoljan je grub opis problema za početak.",
    emailLabel: "Email",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
  },

  footer: {
    backToTop: "Na vrh",
  },
};

export default sr;
