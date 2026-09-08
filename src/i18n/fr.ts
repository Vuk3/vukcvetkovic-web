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
    all: "Tous les projets",
    view: "Lire le détail",
    back: "Projets",

    index: {
      metaTitle: "Projets - Vuk Cvetković",
      metaDescription:
        "Les projets de Vuk Cvetković, développeur backend à Niš : ce que fait chaque système, comment il est construit, et ce qui en est ressorti.",
      heading: "Projets",
      intro:
        "Des travaux que je peux détailler entièrement, avec l’architecture et les résultats plutôt qu’une capture d’écran. Un seul pour l’instant, et chacun a sa propre page.",
    },

    detail: {
      year: "Année",
      context: "Cadre",
      domain: "Domaine",
      flow: "Le parcours d’une requête",
      overview: "Aperçu",
      architecture: "Architecture",
      features: "Ce que ça fait",
      dataset: "Données et entraînement",
      results: "Résultats",
      stack: "Technologies",
      takeaway: "Ce que j’en retiens",
    },

    results: {
      model: "Modèle",
      annotations: "Annotations",
    },

    stackGroups: {
      frontend: "Front end",
      gateway: "Passerelle",
      pythonService: "Service Python",
      dotnetService: "Service .NET",
      data: "Jeu de données",
    },

    items: {
      objectDetection: {
        title: "Système comparatif de détection d’objets",
        tagline:
          "La même image à travers deux écosystèmes d’apprentissage automatique, avec une réponse dans un seul format.",
        description:
          "Mon mémoire de master. La même image traverse un modèle YOLOv8m en Python et un modèle ML.NET en .NET, tous deux derrière une passerelle qui répond dans un format unique, si bien qu’un seul front React dessine l’un ou l’autre résultat. Une reprise des annotations a porté YOLOv8m à 0,916 de mAP@0.5 contre 0,748 pour ML.NET.",
        metaTitle: "Système comparatif de détection d’objets - Vuk Cvetković",
        metaDescription:
          "Un système de mémoire de master : YOLOv8m en Python et ML.NET en .NET derrière une passerelle NestJS, comparés sur le même jeu de données d’équipements de protection.",
        context: "Mémoire de master, Faculté de génie électronique de Niš",
        domain: "Équipements de protection individuelle sur chantier",

        flow: {
          before: ["Image, multipart/form-data", "Passerelle NestJS"],
          branches: [
            ["Service FastAPI", "Ultralytics YOLOv8m"],
            ["Service ASP.NET Core", "Modèle ML.NET"],
          ],
          after: ["Un seul format JSON", "Cadres, classes, confiance"],
        },

        overview: [
          "La question n’était pas de savoir quel modèle détecte le mieux dans l’abstrait. Elle était de savoir ce qui change quand la même tâche de détection est construite deux fois, une fois dans l’écosystème vers lequel va la recherche, une fois dans celui qui fait déjà tourner le backend. Le système entraîne donc un modèle YOLOv8m en Python et un modèle ML.NET en .NET sur les mêmes images annotées, place les deux derrière une seule API, et fait passer une image par l’un ou par les deux.",
          "Le domaine est l’équipement de protection individuelle sur un chantier, réparti en six classes : casque, gilet et gants, chacun présent ou absent. Les classes négatives sont tout l’intérêt. Un tel système ne sert que s’il peut dire que quelqu’un ne porte pas de casque, et pas seulement qu’un casque se trouve quelque part dans le cadre.",
        ],

        steps: [
          {
            title: "Le front envoie l’image",
            body: "React envoie le fichier en multipart/form-data, avec le modèle choisi dans un second champ. Si vous demandez les deux, il lance les deux requêtes en parallèle : la comparaison porte sur une image à un instant donné.",
          },
          {
            title: "La passerelle l’oriente",
            body: "NestJS est la seule adresse que le front connaît. Elle reçoit le fichier et le transmet au service FastAPI ou au service ASP.NET Core, ce qui laisse les deux services ML évoluer indépendamment du client.",
          },
          {
            title: "Le service exécute l’inférence",
            body: "Python charge l’image en RGB et la passe à YOLOv8m, en gardant les poids en mémoire pour ne pas relire le fichier .pt à chaque requête. Le côté .NET convertit en MLImage et sélectionne le modèle ML.NET par son identifiant.",
          },
          {
            title: "Les deux répondent dans la même forme",
            body: "Classe, score et cadre sous la forme x1, y1, x2, y2, avec l’identifiant du modèle, le jeu d’annotations sur lequel il a été entraîné et les dimensions d’origine de l’image. Le côté .NET borne d’abord ses coordonnées à ces dimensions, pour qu’un cadre ne puisse jamais sortir de l’image.",
          },
          {
            title: "Le front le dessine",
            body: "Puisque la réponse est identique dans les deux cas, il n’y a ni branche YOLO ni branche ML.NET dans l’interface. Elle met les coordonnées à l’échelle de la taille affichée et trace les cadres, les classes et les scores de confiance sur l’image.",
          },
        ],

        features: [
          {
            title: "Un modèle ou les deux",
            body: "Un service seul, ou les deux à la fois dans deux panneaux sur la même image, avec les quatre modèles entraînés accessibles par leur nom.",
          },
          {
            title: "Un seuil de confiance réglable",
            body: "Un curseur masque tout ce qui passe sous le seuil, comme un déploiement réel n’agit que sur les prédictions au-dessus d’une limite plutôt que sur tout ce que renvoie le modèle.",
          },
          {
            title: "Chaque détection, en liste",
            body: "Classe et score par détection, et en sélectionner une l’isole dans l’image, ce qui permet de vérifier une scène où huit boîtes se chevauchent.",
          },
          {
            title: "Contours, remplissage, zoom et déplacement",
            body: "Des cadres en contour ou en surface remplie, une détection ou toutes, et un zoom, pour voir où un cadre se trouve vraiment et pas approximativement.",
          },
          {
            title: "Les deux réponses côte à côte",
            body: "Durée de la requête, nombre de détections, confiance moyenne, meilleure détection, et quel service a répondu le premier.",
          },
          {
            title: "Contrôles de santé",
            body: "La passerelle, l’API Python et l’API .NET indiquent chacune leur état et leur temps de réponse, car trois processus tombent indépendamment et un panneau vide devrait dire lequel.",
          },
        ],

        dataset: [
          "Le jeu de données a été assemblé dans Roboflow à partir de deux ensembles publics, puis relu et fusionné en un seul : 2 911 images réparties en 2 374 pour l’entraînement, 290 pour la validation et 247 pour le test, réorientées automatiquement et redimensionnées en 640x640. Le côté Python le prend au format YOLO et le côté .NET au format COCO, puisque c’est ce que Model Builder attend pour la détection : chaque outil reçoit le format qu’il veut sur des images et des classes identiques.",
          "Puis la partie que je n’avais pas prévue. Le premier passage comptait 8 813 annotations, et une reprise complète l’a porté à 17 942, ce qui veut dire que plus de la moitié des objets n’étaient pas étiquetés. Un objet présent dans l’image mais absent des étiquettes apprend au modèle, pendant l’entraînement, qu’il s’agit du fond, puis lui est compté comme une erreur pendant l’évaluation lorsqu’il le détecte quand même.",
          "Les deux modèles ont été entraînés sur 50 epochs en 640x640 à partir de poids pré-entraînés, avec des paramètres tenus constants entre les deux versions du jeu de données, pour qu’un écart de résultats se lise comme un écart de qualité d’annotation et non de configuration. Model Builder s’arrête au modèle entraîné, il a donc fallu écrire un service d’évaluation pour le côté .NET : il charge les annotations COCO, prédit sur le jeu de validation et calcule precision, recall, F1 et mAP@0.5 avec les matrices de confusion et les courbes precision-recall, ce qui a mis ML.NET au même niveau que ce qu’Ultralytics produit tout seul.",
        ],

        results: [
          "La reprise des annotations a déplacé toutes les métriques des deux modèles. YOLOv8m est passé de 0,790 à 0,916 de mAP@0.5 et ML.NET de 0,580 à 0,748 : en relatif, c’est le modèle le plus faible qui gagne le plus, 29 pour cent contre 16. C’est lui que le premier passage retenait le plus.",
          "YOLOv8m est devant sur les chiffres, et l’écart qui compte est le recall : 0,867 contre 0,709 sur le jeu corrigé, à precision presque égale. Pour de l’équipement de protection, cette asymétrie est tout le sujet, car une détection manquée est une personne que le système signale tranquillement comme conforme, et la precision seule ne peut pas vous dire que c’est arrivé.",
          "La comparaison s’arrête là où elle peut rester honnête. Les deux modèles n’ont vu qu’un domaine d’images et six classes, et les paramètres sont restés comparables plutôt qu’optimisés pour chaque modèle : ce sont deux configurations mesurées l’une contre l’autre, pas le plafond de l’un ou de l’autre outil.",
        ],

        takeaway: [
          "Le résultat tenait davantage aux données qu’au choix du framework. Reprendre les annotations des mêmes 2 911 images a déplacé les deux modèles plus loin que la distance entre les deux écosystèmes n’a déplacé ML.NET, et ce n’est pas la conclusion que je m’attendais à écrire.",
          "La moitié ingénierie est plus pratique. Python m’a laissé de la place pour expérimenter et a produit le matériel d’évaluation gratuitement, .NET m’a donné un modèle qui entre dans un service ASP.NET Core sans aucun pont, et la réponse standardisée est la seule raison pour laquelle un seul front peut les traiter comme interchangeables.",
        ],
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

  notFound: {
    metaTitle: "Page introuvable - Vuk Cvetković",
    status: "404",
    heading: "Page introuvable",
    body: "L’adresse est peut-être incorrecte, ou la page a été déplacée. Le lien ci-dessous ramène au début, et tout le reste du site est à un pas de là.",
    cta: "Retour à l’accueil",
  },
};

export default fr;
