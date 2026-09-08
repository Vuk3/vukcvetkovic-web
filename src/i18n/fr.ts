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
      "Développeur backend à Niš, en Serbie. Des services en Node.js (NestJS, Express), une infrastructure événementielle sur AWS, et les interfaces React devant.",
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
      "Développeur backend chez Ncoded Solutions, à Niš. Je construis des services en Node.js (NestJS, Express), et en .NET quand un client y est déjà, puis je les fais tourner sur AWS : conteneurs, files d’attente et les événements qui circulent entre eux.",
    cta: "Me contacter",
    portraitAlt: "Portrait de Vuk Cvetković",
    portraitPlaceholder: "portrait",
  },

  about: {
    label: "À propos",
    paragraphs: [
      "L’essentiel de mon travail se situe côté backend. Je conçois des API et les services derrière, surtout en Node.js (NestJS, Express), et je poursuis le même travail jusqu’aux interfaces React au-dessus quand le projet le demande.",
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
          "Des services backend en Node.js (NestJS, Express) : API REST, authentification JWT, contrôle d’accès par rôles et intégrations tierces, sur des bases SQL comme documentaires.",
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
        "Des travaux que je peux détailler entièrement, avec l’architecture et les résultats plutôt qu’une capture d’écran. Chacun a sa propre page.",
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

    stackGroups: {
      frontend: "Front end",
      gateway: "Passerelle",
      pythonService: "Service Python",
      dotnetService: "Service .NET",
      data: "Jeu de données",
      client: "Client",
      service: "Service",
      interface: "Interface",
      capture: "Lecture de la capture",
      charts: "Graphiques",
      mobile: "Application mobile",
      api: "API",
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

        results: {
          columns: [
            "Modèle",
            "Annotations",
            "Precision",
            "Recall",
            "F1",
            "mAP@0.5",
            "mAP@0.5:0.95",
          ],
          rows: ["YOLOv8m", "YOLOv8m", "ML.NET", "ML.NET"],
          notes: [
            "La reprise des annotations a déplacé toutes les métriques des deux modèles. YOLOv8m est passé de 0,790 à 0,916 de mAP@0.5 et ML.NET de 0,580 à 0,748 : en relatif, c’est le modèle le plus faible qui gagne le plus, 29 pour cent contre 16. C’est lui que le premier passage retenait le plus.",
            "YOLOv8m est devant sur les chiffres, et l’écart qui compte est le recall : 0,867 contre 0,709 sur le jeu corrigé, à precision presque égale. Pour de l’équipement de protection, cette asymétrie est tout le sujet, car une détection manquée est une personne que le système signale tranquillement comme conforme, et la precision seule ne peut pas vous dire que c’est arrivé.",
            "Les deux colonnes se lisent l’une contre l’autre parce que la mesure a été montée pour cela : un seul domaine d’images, les mêmes six classes, et des paramètres tenus comparables sur les deux modèles plutôt qu’optimisés séparément. C’est ce qui fait que l’écart dans les chiffres est un écart entre les modèles et les annotations, et rien d’autre.",
          ],
        },

        takeaway: [
          "Le résultat tenait davantage aux données qu’au choix du framework. Reprendre les annotations des mêmes 2 911 images a déplacé les deux modèles plus loin que la distance entre les deux écosystèmes n’a déplacé ML.NET, et ce n’est pas la conclusion que je m’attendais à écrire.",
          "La moitié ingénierie est plus pratique. Python m’a laissé de la place pour expérimenter et a produit le matériel d’évaluation gratuitement, .NET m’a donné un modèle qui entre dans un service ASP.NET Core sans aucun pont, et la réponse standardisée est la seule raison pour laquelle un seul front peut les traiter comme interchangeables.",
        ],
      },

      encryptix: {
        title: "Encryptix",
        tagline:
          "Trois chiffrements derrière un seul service, et une empreinte aux deux bouts pour prouver que le fichier est revenu.",
        description:
          "Mon mémoire de licence. Un client de bureau confie un dossier entier à un service WCF, qui chiffre chaque fichier avec AES, RC6 ou XXTEA - les deux derniers écrits d’après leur spécification plutôt que pris dans une bibliothèque - et enregistre une empreinte SHA-512 avant et après chaque passage, si bien que l’aller-retour se prouve au lieu de se supposer. Traiter les fichiers en parallèle a fait passer un lot de 150 fichiers de 68,91 à 44,16 secondes.",
        metaTitle: "Encryptix - Vuk Cvetković",
        metaDescription:
          "Un projet de mémoire de licence : un client Windows Forms et un service WCF qui chiffrent un dossier entier avec AES, RC6 ou XXTEA, avec vérification SHA-512 aux deux bouts.",
        context: "Mémoire de licence, Faculté de génie électronique de Niš",
        domain: "Chiffrement de fichiers sur le poste de travail",

        flow: {
          before: ["Un dossier, lu récursivement en octets", "Service WCF"],
          branches: [
            ["AES", "CBC, depuis la bibliothèque .NET"],
            ["RC6", "Écrit à la main, 20 tours"],
            ["XXTEA", "Écrit à la main, réseau de Feistel"],
          ],
          after: [
            "Un fichier chiffré par fichier d’entrée",
            "SHA-512 enregistrée avant et après",
          ],
        },

        overview: [
          "L’unité de travail ici est un dossier, pas un fichier. Vous désignez un répertoire à l’application, elle lit tout ce qu’il contient et tout ce que contiennent ses sous-dossiers, puis l’un des trois chiffrements symétriques parcourt l’ensemble - l’arborescence chiffrée, l’arborescence déchiffrée et le journal d’empreintes étant écrits là où vous le choisissez.",
          "S’il y en a trois, c’est parce qu’un seul était fourni. AES est l’implémentation de la bibliothèque .NET, celle que toute application sensée utiliserait. RC6 et XXTEA sont construits d’après leur spécification, et c’est là que le projet se trouvait vraiment : l’expansion de la clé, le remplissage des blocs, les rotations et le dépassement d’entier délibéré sur lequel XXTEA repose.",
        ],

        steps: [
          {
            title: "Le client lit le dossier",
            body: "Une boîte de dialogue, puis un parcours récursif qui lit chaque fichier en octets bruts quelle que soit son extension et garde ensemble son nom, son extension, son répertoire et son contenu en un seul enregistrement. Rien n’interprète le fichier, donc un .txt et un .exe suivent le même chemin dans le programme.",
          },
          {
            title: "Une tâche de fond garde la fenêtre vivante",
            body: "Windows Forms ne donne à l’application qu’un seul fil, et ce fil possède les contrôles : lire un gros dossier dessus figerait la fenêtre et arrêterait justement l’indicateur qu’elle est censée afficher. La lecture s’exécute donc comme une tâche, et la continuation est replanifiée sur le contexte de synchronisation du formulaire, le seul endroit d’où les boutons peuvent légalement être réactivés.",
          },
          {
            title: "La liste passe au service",
            body: "Le client appelle le service WCF en HTTP. Les deux côtés ont dû être reconfigurés pour la charge : les limites de tampon montent à la plus grande valeur qu’un int puisse contenir, et le mode de transfert passe de mis en tampon à flux, si bien que seul l’en-tête du message est mis en tampon et non la liste entière des fichiers, avec un délai de dix minutes de chaque côté.",
          },
          {
            title: "Le service chiffre, fichier par fichier",
            body: "L’algorithme choisi reçoit la liste, la clé et - pour AES - le vecteur d’initialisation. RC6 et XXTEA exigent que leur entrée remplisse des blocs entiers, donc chacun complète le tableau d’octets jusqu’à sa taille de bloc et inscrit la longueur d’origine dans les quatre premiers octets, ce qui permet au déchiffrement de retirer ce remplissage au lieu de devoir deviner où le fichier s’arrêtait.",
          },
          {
            title: "Les deux bouts sont empreints",
            body: "Chaque fichier reçoit à côté de lui un fichier texte contenant quatre lignes SHA-512 : avant chiffrement, après chiffrement, avant déchiffrement, après déchiffrement. La première et la dernière sont celles qui comptent, et elles doivent être identiques. C’est toute la garantie d’intégrité, et n’importe qui peut la vérifier en ouvrant le fichier.",
          },
        ],

        features: [
          {
            title: "Un dossier entier d’un coup",
            body: "Sous-dossiers compris, à n’importe quelle profondeur. L’arborescence de sortie reflète celle d’entrée, ce qui vient de la différence entre le chemin de chaque fichier et la racine plutôt que d’un suivi de la récursion.",
          },
          {
            title: "Trois chiffrements, un formulaire",
            body: "AES avec une clé de 32 caractères et un IV de 16, RC6 et XXTEA avec des clés de 16 caractères. Chacun a sa fenêtre, et chaque champ est validé avant que quoi que ce soit soit écrit.",
          },
          {
            title: "La preuve du retour",
            body: "La SHA-512 du texte clair avant chiffrement contre la SHA-512 du texte clair après déchiffrement. Égales, l’aller-retour s’est fait sans perte.",
          },
          {
            title: "Séquentiel ou parallèle",
            body: "Les deux modes existent, et une case à cocher choisit entre eux. Le passage parallèle répartit la liste des fichiers sur une boucle parallèle, et comme chaque fichier est lu, transformé et écrit pour lui-même, il n’y a aucun conflit à résoudre : il finit donc plus vite qu’un fichier après l’autre.",
          },
          {
            title: "Une barre de progression qui finit avec le travail",
            body: "Cadencée sur le nombre total d’octets pendant que le service travaille, et remplie à l’instant où l’appel réel revient grâce à un jeton d’annulation, si bien qu’elle suit la marche et s’achève avec elle plutôt qu’après.",
          },
          {
            title: "L’arborescence d’abord",
            body: "Une vue en arbre de tout ce qui a été chargé, dépliée, avant de s’engager à le chiffrer. Utile surtout pour se rendre compte qu’on a choisi le mauvais dossier.",
          },
        ],

        dataset: [],

        results: {
          columns: ["Mode", "Fichiers", "Chiffrement (s)", "Déchiffrement (s)"],
          rows: ["Séquentiel", "Parallèle"],
          notes: [
            "Les mêmes 150 fichiers, la même clé RC6, les mêmes dossiers de sortie, une exécution dans chaque mode. Le chiffrement parallèle a fini en 44,16 secondes contre 68,91, et le déchiffrement en 40,39 contre 70,13 : un tiers de moins dans les deux sens.",
            "Le gain vient de la forme du travail. Les fichiers ne dépendent jamais les uns des autres ici, donc la liste se répartit sur une boucle parallèle sans état partagé à protéger, sans conflit à résoudre et sans ordre à préserver, et aucun fichier n’attend celui qui le précède. C’est pourquoi le traitement en parallèle retire environ un tiers du passage entier plutôt que quelques pour cent.",
          ],
        },

        takeaway: [
          "C’est pour cela que le projet existe : deux des trois chiffrements sont implémentés et non appelés. Ce sont des algorithmes courts où presque chaque ligne porte le poids : le sens d’une rotation, l’endroit où la longueur d’origine est rangée, et le fait que XXTEA exige que son arithmétique déborde au lieu de lever une erreur. Les empreintes qui concordent sont ce qui prouve que tout cela tombe juste, octet par octet.",
          "L’autre moitié, c’est la séparation client-service. Placer les chiffrements derrière un service garde la cryptographie hors du processus qui dessine la fenêtre, ce qui permet de confier un dossier de n’importe quelle taille sans que l’interface s’arrête, et cela veut dire que les mêmes trois algorithmes sont disponibles pour tout ce qui sait appeler ce service.",
        ],
      },

      networkTrafficAnalyzer: {
        title: "Network Traffic Analyzer",
        tagline:
          "Une capture lue une seule fois, puis douze questions posées à chacun de ses paquets.",
        description:
          "Un mémoire de séminaire sur l’analyse du trafic, avec une application de bureau qui la met en pratique. Elle ouvre une capture .pcapng via Pyshark, parcourt chaque paquet couche par couche et en extrait ce que chaque protocole transporte - en-têtes HTTP, requêtes DNS, drapeaux TCP, identifiants FTP - dans un arbre dépliable, avec un graphique de la répartition des protocoles.",
        metaTitle: "Network Traffic Analyzer - Vuk Cvetković",
        metaDescription:
          "Un projet de mémoire de séminaire en Python : une application Tkinter qui lit des captures .pcapng via Pyshark, extrait douze protocoles par paquet et trace la répartition des protocoles.",
        context: "Mémoire de séminaire, Faculté de génie électronique de Niš",
        domain: "Analyse de captures de paquets",

        flow: {
          before: ["Une capture .pcapng", "Pyshark, via le tshark de Wireshark"],
          branches: [
            ["Protocoles applicatifs", "HTTP, HTTPS, DNS, FTP, SMTP"],
            ["Transport et contrôle", "TCP, UDP, ICMP, ARP"],
            ["Adressage", "IP, Ethernet"],
          ],
          after: ["Une ligne par paquet", "Dépliable, et comptée dans les graphiques"],
        },

        overview: [
          "Le mémoire porte sur la manière dont on analyse le trafic réseau et sur les raisons pour lesquelles le format PCAP est celui qui s’est imposé. L’application est la partie qui devait fonctionner : on lui désigne une capture, et elle dit ce qu’il y a réellement dedans, pas seulement que des paquets sont passés.",
          "Wireshark tourne en dessous - Pyshark pilote son tshark - et c’est ce qui donne à l’analyse sa portée. Par-dessus, l’application pose le même jeu fixe de questions à chaque paquet du fichier et dispose les réponses au même endroit, ce qui est la forme utile quand on cherche quelque chose sans savoir encore dans quel paquet il se trouve.",
        ],

        steps: [
          {
            title: "La capture est lue une seule fois",
            body: "Une boîte de dialogue accepte un .pcapng ou un .pcap, Pyshark l’ouvre, et tous les paquets passent dans une liste en mémoire avant que le fichier ne soit refermé. Rien ne relit le fichier ensuite, et c’est ce qui rend les filtres peu coûteux : ils repassent sur la liste au lieu de réanalyser la capture.",
          },
          {
            title: "Chaque paquet est parcouru couche par couche",
            body: "Les noms de protocoles viennent de la pile de couches du paquet lui-même et non d’une table, si bien qu’un paquet déclare ce qu’il contient vraiment et que le décompte final compte des couches réelles. Douze extracteurs s’exécutent ensuite l’un après l’autre, chacun demandant d’abord si son protocole est présent avant de toucher à quoi que ce soit.",
          },
          {
            title: "Chaque extracteur demande avant de lire",
            body: "Un champ qu’un paquet donné ne transporte pas n’est pas une erreur, c’est le cas normal : chaque extracteur vérifie donc l’existence de l’attribut avant de le lire et omet simplement ce qui manque. D’où un arbre irrégulier : un paquet HTTP montre une douzaine de champs, le suivant en montre deux, et les deux sont justes.",
          },
          {
            title: "Ce qui est en clair ressort en clair",
            body: "Les identifiants HTTP Basic sont du base64, pas du chiffrement, donc l’extracteur les décode. FTP envoie son nom d’utilisateur et son mot de passe en texte, donc ils ressortent aussi. C’est la démonstration honnête que voulait le mémoire : non pas l’affirmation que ces protocoles sont peu sûrs, mais la chaîne décodée posée là, dans un arbre, devant vous.",
          },
          {
            title: "Les résultats arrivent dans un arbre et dans des graphiques",
            body: "Chaque paquet devient une ligne - horodatage, IP source et destination, longueur, liste de protocoles - qui se déplie en un nœud par protocole et une feuille par champ. Le même passage renvoie un compte par protocole, que Matplotlib trace en camembert et en barres, intégrés directement dans la fenêtre.",
          },
        ],

        features: [
          {
            title: "Douze protocoles, par paquet",
            body: "HTTP, HTTPS, DNS, FTP, SMTP, ARP, ICMP, IP, Ethernet, TCP, UDP et FPP, chacun avec son extracteur et son propre jeu de champs.",
          },
          {
            title: "Des filtres sur cinq critères",
            body: "Une plage de dates et d’heures, une IP source, une IP de destination et une liste de protocoles séparés par des virgules. Une heure laissée vide couvre la journée entière, de 00:00:00 à 23:59:59.",
          },
          {
            title: "Un arbre, pas un mur de texte",
            body: "Paquet, puis protocole, puis champ. La partie intéressante se trouve d’ordinaire trois clics plus bas, et rien n’oblige à défiler devant les paquets qui n’intéressent pas.",
          },
          {
            title: "La répartition des protocoles d’un coup d’œil",
            body: "Un camembert pour la part et des barres pour le compte, retracés à chaque application d’un filtre, si bien qu’on voit ce que le filtre a réellement retiré.",
          },
          {
            title: "Des identifiants en clair, montrés comme tels",
            body: "Authentification HTTP Basic décodée et noms d’utilisateur et mots de passe FTP, soit l’argument le plus court possible pour ne pas utiliser ces protocoles sans chiffrement.",
          },
          {
            title: "Les deux générations de PCAP",
            body: "La boîte de dialogue accepte .pcapng et .pcap. Le format plus récent porte davantage de métadonnées et plusieurs interfaces, et se relit par le même code.",
          },
        ],

        dataset: [],

        results: {
          columns: [],
          rows: [],
          notes: [],
        },

        takeaway: [
          "La discipline que le format impose est ce qui fait que cela fonctionne sur n’importe quelle capture. Un paquet ne promet rien sur les champs qu’il porte : chaque lecture est donc gardée et un champ absent est un résultat normal plutôt qu’un échec. Écrire les douze extracteurs un par un est ce qui garde cela explicite, et c’est pourquoi une capture de deux paquets et une de deux mille passent par le même code sans aucun cas particulier.",
          "Lire la capture une seule fois est ce qui rend tout le reste immédiat. Chaque filtre, chaque recomptage et chaque graphique retracé travaillent sur la liste déjà en mémoire, si bien que changer une date ou une adresse IP renvoie aussitôt une nouvelle vue de la même capture au lieu de repasser par le fichier.",
        ],
      },

      easyBreathe: {
        title: "Easy Breathe",
        tagline:
          "Les relevés publics de pollen en Serbie, ramenés à ceux dont une seule personne a besoin.",
        description:
          "Une application mobile posée sur des données publiques ouvertes. L’agence serbe de l’environnement publie les relevés de pollen des stations de tout le pays, et l’application les recopie dans sa propre base selon un calendrier, puis les réduit aux allergènes qu’une personne a sélectionnés dans un rayon qu’elle choisit - sur une carte, par niveau de concentration, et sous forme de notification lorsqu’un niveau monte.",
        metaTitle: "Easy Breathe - Vuk Cvetković",
        metaDescription:
          "Une application React Native et Expo sur une API NestJS : les données ouvertes de pollen en Serbie, recopiées selon un calendrier et filtrées par lieu, rayon et allergènes choisis.",
        context: "Mémoire de séminaire sur les systèmes d’e-administration, Faculté de génie électronique de Niš",
        domain: "Données publiques ouvertes, pollen et allergènes",

        flow: {
          before: ["Cinq points d’accès ouverts", "Alimentation planifiée"],
          branches: [
            ["Mensuelle", "Allergènes, types, lieux"],
            ["Horaire, de 9 h à 12 h", "Pollens, concentrations"],
          ],
          after: [
            "Une base dédoublonnée",
            "Réduite à un rayon, un jour et vos allergènes",
          ],
        },

        overview: [
          "Les données publiques existent et elles sont bonnes : l’agence serbe de l’environnement publie chaque jour les relevés de pollen des stations de mesure du pays, sous forme d’API ouverte, sans clé ni limite. Ce qu’elle ne fait pas, c’est dire à une personne allergique à l’ambroisie si aujourd’hui est un mauvais jour là où elle se trouve. Cet écart, c’est toute l’application.",
          "Le travail se partage donc en deux. L’API recopie les données ouvertes dans sa propre base selon un calendrier, parce qu’un téléphone n’a pas à parcourir des centaines de milliers de relevés nationaux pour répondre à une question locale. L’application pose ensuite une seule question à cette copie - qu’y a-t-il dans l’air près de moi, parmi ce à quoi je réagis - et y répond sur une carte, en quatre niveaux, et par une notification.",
        ],

        steps: [
          {
            title: "Les données ouvertes sont recopiées sur deux horloges",
            body: "Les cinq points d’accès ne changent pas au même rythme, ils ne sont donc pas interrogés au même rythme. Allergènes, types d’allergènes et lieux sont chargés à neuf heures le premier du mois. Pollens et concentrations, qui sont ce qui bouge, sont récupérés toutes les heures entre neuf heures et midi, moment où les relevés du jour apparaissent.",
          },
          {
            title: "L’alimentation se répète sans risque",
            body: "Chaque chargeur regarde d’abord quels identifiants il détient déjà, ne garde que ceux qui manquent, et insère ceux-là. Un passage horaire qui ne trouve rien de neuf n’écrit donc rien, le même passage peut être rejoué sans dupliquer un relevé, et la fenêtre demandée remonte d’une semaine, ce qui rattrape un relevé publié quelques jours après sa prise.",
          },
          {
            title: "Un lieu et un rayon deviennent un ensemble de stations",
            body: "Les coordonnées de la personne et son rayon en kilomètres entrent dans une requête géospatiale MongoDB, le rayon étant divisé par celui de la Terre pour obtenir la sphère attendue par la requête. Ce qui revient, c’est chaque station de mesure assez proche pour compter pour cette personne.",
          },
          {
            title: "Les stations et une date donnent les relevés qui comptent",
            body: "Ces identifiants de stations et la date du jour sélectionnent les enregistrements de pollen de la journée, chacun portant les identifiants des concentrations mesurées avec lui. Ces concentrations sont ensuite récupérées et réduites aux allergènes réellement sélectionnés, si bien que la réponse ne contient que des relevés à la fois proches et pertinents.",
          },
          {
            title: "Chaque relevé reçoit un niveau et un lieu",
            body: "Un chiffre dans l’air ne veut rien dire seul : chaque concentration est comparée aux marges publiées de son propre allergène et ressort en Low, Normal, High ou Very high. Le relevé est ensuite mis en forme avec l’allergène et la station d’origine, et c’est ce que montrent le marqueur sur la carte et la vue de détail.",
          },
        ],

        features: [
          {
            title: "Choisissez vos allergènes",
            body: "Une trentaine sont publiés, et le profil est une sélection multiple sur l’ensemble. Tout ce qui suit - la carte, les niveaux, les notifications - découle de cette liste.",
          },
          {
            title: "Votre rayon, votre intervalle",
            body: "Le rayon de recherche en kilomètres et la fréquence de vérification en heures, tous deux réglés sur le profil. L’intervalle est là pour que la vérification soit aussi fréquente qu’on le souhaite sans que la batterie en décide autrement.",
          },
          {
            title: "Une carte lisible d’un coup d’œil",
            body: "Des marqueurs sur les stations de mesure proches, colorés par niveau. Un appui sur l’un d’eux liste lesquels de vos allergènes y ont été mesurés et à quelle hauteur.",
          },
          {
            title: "Quatre niveaux, avec les comptes",
            body: "Low, Normal, High et Very high, chacun avec le nombre d’allergènes proches à ce niveau. Un appui sur un niveau donne la liste, un appui sur une entrée donne la station, la description et le relevé.",
          },
          {
            title: "Une notification quand ça monte",
            body: "Une notification push et une alerte dans l’application dès qu’un élément de la liste choisie atteint une forte concentration à proximité, si bien que l’application sert sans être ouverte.",
          },
          {
            title: "Des comptes, simplement",
            body: "Inscription et connexion par e-mail, avec le profil qui porte les allergènes, le rayon et l’intervalle, si bien que la même sélection suit le compte et non le téléphone.",
          },
        ],

        dataset: [],

        results: {
          columns: [],
          rows: [],
          notes: [],
        },

        takeaway: [
          "La leçon qui est restée, c’est que des données ouvertes ne sont pas des données utilisables. Cinq points d’accès qui se référencent par identifiants, une échelle nationale et aucun moyen de poser une question géographique : la valeur tient entièrement dans la recopie et dans les jointures. Décider quoi copier, à quelle fréquence, et comment rendre une double copie inoffensive, c’est là qu’était vraiment l’ingénierie.",
          "L’autre moitié, c’est que la réponse doit arriver sans être demandée. Une personne allergique n’ouvre pas une application pour vérifier : elle veut qu’on le lui dise, dans un rayon et à un intervalle réglés une fois pour toutes. Les notifications push posées sur un backend planifié sont ce qui transforme un jeu de données public en quelque chose qui atteint quelqu’un le jour où cela compte.",
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
          "Des services et des API en Node.js (NestJS, Express) ou .NET : modélisation des données, authentification, intégrations tierces, et les tests qui les tiennent honnêtes.",
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
