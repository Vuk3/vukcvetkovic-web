/**
 * French copy.
 *
 * Formal address (vous) throughout, and the typographic apostrophe rather than
 * the straight one, which is correct French.
 *
 * Typed as `Dict`, so this file must keep exactly the keys en.ts has.
 */
import type { Dict } from "./types";

const fr: Dict = {
  meta: {
    title: "Vuk Cvetković - Ingénieur logiciel",
    description:
      "Ingénieur logiciel à Niš, en Serbie, de bout en bout : backend Node.js (NestJS, Express), déploiement et communication événementielle sur AWS, frontend React.",
    ogImageAlt: "Vuk Cvetković, ingénieur logiciel",
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
    games: "Jeux",
    themeToggle: "Changer de thème",
    language: "Langue",
  },

  hero: {
    role: "Ingénieur logiciel",
    positioning:
      "Je travaille sur l’ensemble du produit, du modèle de données jusqu’à la mise en production. J’écris le backend en Node.js (NestJS, Express) et en .NET. Sur AWS, je m’occupe du déploiement et de la communication événementielle entre les services, et tout ce que voit l’utilisateur, je le construis en React.",
    cta: "Me contacter",
    portraitAlt: "Portrait de Vuk Cvetković",
    portraitPlaceholder: "portrait",
  },

  about: {
    label: "À propos",
    paragraphs: [
      "Je travaille sur des projets clients, du premier modèle de données jusqu’au déploiement sur AWS. Je pars toujours du domaine : quelles sont les données, qui peut y accéder et avec quels systèmes elles doivent communiquer. L’API, les services et l’interface React en découlent.",
      "Je suis titulaire d’un master en génie logiciel. Mon mémoire comparait deux écosystèmes d’apprentissage automatique sur une même tâche : un modèle YOLOv8m en Python et un modèle ML.NET en .NET, derrière une seule passerelle NestJS et un seul frontend React. Pour mon mémoire de licence, j’ai implémenté les algorithmes de chiffrement RC6 et XXTEA à partir de leur spécification.",
      "Le meilleur exemple de mon travail frontend, c’est ce site : quatre langues et six jeux écrits sans canvas ni bibliothèque de jeu. Chaque jeu est accompagné d’un texte qui explique comment il a été construit.",
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
          "Le même travail en .NET chez les clients qui l’utilisent déjà, structuré en Clean Architecture pour que la logique métier reste découplée du framework.",
          "Côté AWS : S3, ECS, EC2, Lambda, Route 53 et EventBridge, pour les déploiements et la communication événementielle entre les services.",
        ],
      },
      novateq: {
        role: "Développeur full-stack",
        bullets: [
          "Des services backend en .NET Web API et le site de l’entreprise en ASP.NET MVC, adaptés tous les deux aux besoins de chaque client.",
          "Maintien de la stabilité de la plateforme Sportsbook par le traitement des incidents remontés, et revue de projets de jeux de casino pour comprendre comment ce type de produit se construit.",
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
    view: "Voir le détail",
    back: "Projets",

    index: {
      metaTitle: "Projets - Vuk Cvetković",
      metaDescription:
        "Les projets de Vuk Cvetković, ingénieur logiciel à Niš : ce que fait chaque système, comment il est construit, et ce qui en est ressorti.",
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
      features: "Fonctionnalités",
      dataset: "Données et entraînement",
      results: "Résultats",
      stack: "Technologies",
      takeaway: "Ce que j’en retiens",
    },

    flowCaptions: {
      entry: "Entrée",
      core: "Orchestration",
      lane: "En parallèle",
      exit: "Sortie",
    },

    stackGroups: {
      frontend: "Frontend",
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
          "Une même image soumise à deux écosystèmes d’apprentissage automatique, avec une réponse au même format.",
        description:
          "Mon mémoire de master. Une même image passe par un modèle YOLOv8m en Python et par un modèle ML.NET en .NET, tous deux derrière une passerelle qui répond dans un format unique, si bien qu’un seul frontend React affiche l’un ou l’autre résultat. La reprise des annotations a porté YOLOv8m à un mAP@0.5 de 0,916, contre 0,748 pour ML.NET.",
        metaTitle: "Système comparatif de détection d’objets - Vuk Cvetković",
        metaDescription:
          "Système développé pour un mémoire de master : YOLOv8m en Python et ML.NET en .NET derrière une passerelle NestJS, comparés sur un même jeu de données d’équipements de protection.",
        context: "Mémoire de master, Faculté de génie électronique de Niš",
        domain: "Équipements de protection individuelle sur chantier",

        flow: {
          entry: "Frontend React",
          entryLabel: "Image, multipart/form-data",
          core: "Passerelle NestJS",
          branches: [
            { title: "Service FastAPI", badge: "Ultralytics YOLOv8m" },
            { title: "Service ASP.NET Core", badge: "Modèle ML.NET" },
          ],
          exit: "",
          exitLabel: "Un seul format JSON : cadres, classes, confiance",
          exitNote: "",
        },

        overview: [
          "Le mémoire étudie ce qui change quand une même tâche de détection est réalisée deux fois : une fois en Python, l’écosystème privilégié par la recherche, et une fois en .NET, celui sur lequel tourne déjà le backend. Le système entraîne un modèle YOLOv8m et un modèle ML.NET sur les mêmes images annotées, place les deux derrière une seule API, et fait passer une image par l’un, l’autre ou les deux.",
          "Le domaine est l’équipement de protection individuelle sur chantier, en six classes : casque, gilet et gants, chacun présent ou absent. Tout l’intérêt est dans les classes négatives. Un tel système ne sert que s’il peut dire que quelqu’un ne porte pas de casque, et pas seulement qu’un casque se trouve quelque part dans l’image.",
        ],

        steps: [
          {
            title: "Le frontend envoie l’image",
            body: "React envoie le fichier en multipart/form-data, avec le modèle choisi dans un second champ. Si vous demandez les deux, il lance les deux requêtes en parallèle : la comparaison porte donc sur une même image au même instant.",
          },
          {
            title: "La passerelle l’aiguille",
            body: "La passerelle NestJS est la seule adresse que connaît le frontend. Elle reçoit le fichier et le transmet au service FastAPI ou au service ASP.NET Core, ce qui laisse les deux services ML évoluer indépendamment du client.",
          },
          {
            title: "Le service exécute l’inférence",
            body: "Python charge l’image en RGB et la passe à YOLOv8m, en gardant les poids en mémoire pour ne pas relire le fichier .pt à chaque requête. Le côté .NET convertit l’image en MLImage et sélectionne le modèle ML.NET par son identifiant.",
          },
          {
            title: "Les deux répondent au même format",
            body: "Classe, score et cadre sous la forme x1, y1, x2, y2, avec l’identifiant du modèle, le jeu d’annotations sur lequel il a été entraîné et les dimensions d’origine de l’image. Le côté .NET borne d’abord ses coordonnées à ces dimensions, pour qu’un cadre ne puisse jamais sortir de l’image.",
          },
          {
            title: "Le frontend affiche le résultat",
            body: "Puisque la réponse est identique dans les deux cas, il n’y a ni branche YOLO ni branche ML.NET dans l’interface. Elle ramène les coordonnées de la taille d’origine à la taille affichée et trace les cadres, les classes et les scores de confiance sur l’image.",
          },
        ],

        features: [
          {
            title: "Un modèle ou les deux",
            body: "Un service seul, ou les deux à la fois dans deux panneaux sur la même image, avec les quatre modèles entraînés accessibles par leur nom.",
          },
          {
            title: "Un seuil de confiance réglable",
            body: "Un curseur masque tout ce qui passe sous le seuil, comme en production, où l’on n’agit que sur les prédictions au-dessus d’une limite et non sur tout ce que renvoie le modèle.",
          },
          {
            title: "Toutes les détections, en liste",
            body: "Classe et score pour chaque détection. En sélectionner une l’isole dans l’image, ce qui permet de vérifier une scène où huit cadres se chevauchent.",
          },
          {
            title: "Contours, remplissage, zoom et déplacement",
            body: "Des cadres en contour ou remplis, une seule détection ou toutes, avec zoom et déplacement pour vérifier un cadre au pixel près.",
          },
          {
            title: "Les deux réponses côte à côte",
            body: "Durée de la requête, nombre de détections, confiance moyenne, meilleure détection, et le service qui a répondu le premier.",
          },
          {
            title: "État des services",
            body: "La passerelle, l’API Python et l’API .NET indiquent chacune leur état et leur temps de réponse, car trois processus peuvent tomber indépendamment, et un panneau vide doit dire lequel est en panne.",
          },
        ],

        dataset: [
          "Le jeu de données a été assemblé dans Roboflow à partir de deux ensembles publics, puis relu et fusionné en un seul : 2 911 images réparties en 2 374 pour l’entraînement, 290 pour la validation et 247 pour le test, réorientées automatiquement et redimensionnées en 640x640. Le côté Python l’utilise au format YOLO et le côté .NET au format COCO, puisque c’est ce que Model Builder attend pour la détection : chaque outil reçoit son format, sur des images et des classes identiques.",
          "Vient ensuite ce que je n’avais pas prévu. La première version comptait 8 813 annotations, et une reprise complète a porté ce total à 17 942 : plus de la moitié des objets n’étaient donc pas étiquetés. Un objet présent dans l’image mais absent des étiquettes apprend au modèle, pendant l’entraînement, qu’il fait partie du fond, puis lui est compté comme une erreur à l’évaluation quand il le détecte malgré tout.",
          "Les deux modèles ont été entraînés pendant 50 epochs en 640x640 à partir de poids pré-entraînés, avec des paramètres identiques entre les deux versions du jeu de données, pour qu’un écart de résultats reflète la qualité des annotations et non la configuration. Model Builder s’arrête au modèle entraîné, il a donc fallu écrire un service d’évaluation pour le côté .NET : il charge les annotations COCO, prédit sur le jeu de validation et calcule precision, recall, F1 et mAP@0.5 avec les matrices de confusion et les courbes precision-recall, ce qui a mis ML.NET à égalité avec ce qu’Ultralytics fournit d’office.",
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
            "La reprise des annotations a fait évoluer toutes les métriques des deux modèles. YOLOv8m est passé de 0,790 à 0,916 en mAP@0.5 et ML.NET de 0,580 à 0,748 : en relatif, c’est le modèle le plus faible qui gagne le plus, 29 pour cent contre 16. C’est lui que la première version pénalisait le plus.",
            "YOLOv8m l’emporte sur les chiffres, et l’écart qui compte est celui du recall : 0,867 contre 0,709 sur le jeu corrigé, à precision presque égale. Pour des équipements de protection, tout se joue sur cette asymétrie : une détection manquée, c’est une personne que le système déclare conforme sans rien signaler, et la precision seule ne permet pas de le voir.",
            "La comparaison est équitable parce que les conditions étaient les mêmes des deux côtés : un seul domaine d’images, les mêmes six classes, et des paramètres comparables plutôt qu’un réglage séparé pour chaque modèle.",
          ],
        },

        takeaway: [
          "Le résultat dépendait plus des données que du choix du framework. Reprendre les annotations des mêmes 2 911 images a fait progresser les deux modèles plus que l’écart entre les deux écosystèmes ne pénalisait ML.NET, et ce n’est pas la conclusion que je pensais écrire.",
          "Côté ingénierie, les enseignements sont plus pratiques. Python m’a laissé de la place pour expérimenter et m’a fourni les éléments d’évaluation sans effort, .NET m’a donné un modèle qui s’intègre à un service ASP.NET Core sans couche intermédiaire, et c’est uniquement grâce à la réponse standardisée qu’un seul frontend peut les traiter comme interchangeables.",
        ],
      },

      encryptix: {
        title: "Encryptix",
        tagline:
          "Trois chiffrements derrière un seul service, et une empreinte aux deux bouts pour prouver que le fichier est revenu intact.",
        description:
          "Mon mémoire de licence. Une application de bureau confie un dossier entier à un service WCF, qui chiffre chaque fichier avec AES, RC6 ou XXTEA - les deux derniers implémentés d’après leur spécification plutôt que tirés d’une bibliothèque - et enregistre une empreinte SHA-512 avant et après chaque passage, ce qui permet de prouver l’aller-retour au lieu de le supposer. Le traitement en parallèle a fait passer un lot de 150 fichiers de 68,91 à 44,16 secondes.",
        metaTitle: "Encryptix - Vuk Cvetković",
        metaDescription:
          "Un projet de mémoire de licence : un client Windows Forms et un service WCF qui chiffrent un dossier entier avec AES, RC6 ou XXTEA, et une vérification SHA-512 aux deux bouts.",
        context: "Mémoire de licence, Faculté de génie électronique de Niš",
        domain: "Chiffrement de fichiers sur le poste de travail",

        flow: {
          entry: "Un dossier, lu récursivement en octets",
          entryLabel: "",
          core: "Service WCF",
          branches: [
            { title: "AES", badge: "CBC, bibliothèque .NET" },
            { title: "RC6", badge: "Implémenté à la main, 20 tours" },
            { title: "XXTEA", badge: "Implémenté à la main, réseau de Feistel" },
          ],
          exit: "Un fichier chiffré par fichier d’entrée",
          exitLabel: "",
          exitNote: "SHA-512 enregistrée avant et après",
        },

        overview: [
          "Ici, on travaille sur un dossier, pas sur un fichier. Vous indiquez un répertoire à l’application, elle lit tout son contenu, sous-dossiers compris, puis l’un des trois chiffrements symétriques traite l’ensemble. L’arborescence chiffrée, l’arborescence déchiffrée et le journal des empreintes sont écrits à l’emplacement de votre choix.",
          "S’il y en a trois, c’est qu’un seul était fourni tout fait. AES est l’implémentation de la bibliothèque .NET, celle que toute application raisonnable utiliserait. RC6 et XXTEA sont implémentés d’après leur spécification, et c’est là qu’était le vrai travail : l’expansion de la clé, le remplissage des blocs, les rotations et le dépassement d’entier volontaire sur lequel repose XXTEA.",
        ],

        steps: [
          {
            title: "Le client lit le dossier",
            body: "Une boîte de dialogue, puis un parcours récursif qui lit chaque fichier en octets bruts, quelle que soit son extension, et regroupe son nom, son extension, son répertoire et son contenu dans un seul enregistrement. Le contenu n’est jamais interprété : un .txt et un .exe suivent le même chemin dans le programme.",
          },
          {
            title: "Une tâche de fond pour ne pas figer la fenêtre",
            body: "Sous Windows Forms, l’application n’a qu’un seul thread, et c’est lui qui possède les contrôles : lire un gros dossier sur ce thread figerait la fenêtre, et avec elle l’indicateur qu’elle est censée afficher. La lecture s’exécute donc dans une Task, et la continuation est replanifiée sur le contexte de synchronisation du formulaire, le seul endroit d’où l’on a le droit de réactiver les boutons.",
          },
          {
            title: "La liste passe au service",
            body: "Le client appelle le service WCF en HTTP. Les deux côtés ont dû être reconfigurés pour la taille des messages : les limites de tampon sont portées à la valeur maximale d’un int, et le mode de transfert passe de Buffered à Streamed, pour que seul l’en-tête du message soit mis en tampon et non toute la liste des fichiers, avec un délai d’expiration de dix minutes de chaque côté.",
          },
          {
            title: "Le service chiffre, fichier par fichier",
            body: "L’algorithme choisi reçoit la liste, la clé et - pour AES - le vecteur d’initialisation. RC6 et XXTEA exigent que leur entrée remplisse des blocs entiers, donc chacun complète le tableau d’octets jusqu’à sa taille de bloc et inscrit la longueur d’origine dans les quatre premiers octets, ce qui permet au déchiffrement de retirer ce remplissage au lieu de devoir deviner où le fichier s’arrêtait.",
          },
          {
            title: "Une empreinte à chaque bout",
            body: "À côté de chaque fichier, un fichier texte contient quatre empreintes SHA-512 : avant chiffrement, après chiffrement, avant déchiffrement, après déchiffrement. Ce sont la première et la dernière qui comptent, et elles doivent être identiques. Toute la garantie d’intégrité est là, et n’importe qui peut la vérifier en ouvrant le fichier.",
          },
        ],

        features: [
          {
            title: "Un dossier entier d’un coup",
            body: "Sous-dossiers compris, à n’importe quelle profondeur. L’arborescence de sortie reproduit celle d’entrée : elle est calculée à partir du chemin de chaque fichier relatif à la racine, et non en suivant la récursion.",
          },
          {
            title: "Trois chiffrements, un formulaire",
            body: "AES avec une clé de 32 caractères et un IV de 16, RC6 et XXTEA avec des clés de 16 caractères. Chacun a sa fenêtre, et chaque champ est validé avant toute écriture.",
          },
          {
            title: "La preuve de l’aller-retour",
            body: "L’empreinte SHA-512 du texte clair avant chiffrement, comparée à celle du texte clair après déchiffrement. Si elles sont égales, l’aller-retour s’est fait sans perte.",
          },
          {
            title: "Séquentiel ou parallèle",
            body: "Les deux modes sont disponibles, et une case à cocher permet de choisir. En mode parallèle, la liste des fichiers est répartie sur une boucle parallèle, et comme aucun fichier ne dépend d’un autre, il n’y a rien à verrouiller ni à fusionner. Les résultats ci-dessous chiffrent le gain.",
          },
          {
            title: "Une barre de progression qui finit avec le traitement",
            body: "Elle avance au rythme du nombre total d’octets pendant que le service travaille, et se remplit dès que l’appel réel revient, grâce à un jeton d’annulation : elle suit le traitement et se termine avec lui, pas après.",
          },
          {
            title: "L’arborescence d’abord",
            body: "Une arborescence de tout ce qui a été chargé, entièrement dépliée, pour vérifier ce qui va être chiffré avant de lancer l’opération.",
          },
        ],

        dataset: [],

        results: {
          columns: ["Mode", "Fichiers", "Chiffrement (s)", "Déchiffrement (s)"],
          rows: ["Séquentiel", "Parallèle"],
          notes: [
            "Les mêmes 150 fichiers, la même clé RC6, les mêmes dossiers de sortie, une exécution dans chaque mode. Le chiffrement parallèle a pris 44,16 secondes contre 68,91, et le déchiffrement 40,39 contre 70,13 : un tiers de moins dans les deux sens.",
            "Le gain vient de l’indépendance des fichiers : la boucle parallèle n’a besoin ni de verrou ni d’ordre, et aucun fichier n’attend le précédent.",
          ],
        },

        takeaway: [
          "Le projet avait pour but d’implémenter deux des trois chiffrements plutôt que de les appeler. Ce sont des algorithmes courts où presque chaque ligne compte : le sens d’une rotation, l’endroit où est stockée la longueur d’origine, et le fait que XXTEA exige que son arithmétique déborde au lieu de lever une erreur. Les empreintes identiques prouvent que tout est juste, octet par octet.",
          "L’autre volet du projet, c’est la séparation client-serveur. La cryptographie s’exécute dans le service et non dans le processus qui affiche la fenêtre, et les trois algorithmes sont disponibles pour tout autre programme capable d’appeler ce service.",
        ],
      },

      networkTrafficAnalyzer: {
        title: "Network Traffic Analyzer",
        tagline:
          "Une capture lue une seule fois, puis douze questions posées à chacun de ses paquets.",
        description:
          "Un mémoire de séminaire sur l’analyse du trafic, avec une application de bureau qui la met en pratique. L’application ouvre une capture .pcapng via Pyshark, parcourt chaque paquet couche par couche et présente ce que transporte chaque protocole - en-têtes HTTP, requêtes DNS, drapeaux TCP, identifiants FTP - dans une arborescence dépliable, avec un graphique de la répartition des protocoles.",
        metaTitle: "Network Traffic Analyzer - Vuk Cvetković",
        metaDescription:
          "Un projet de mémoire de séminaire en Python : une application Tkinter qui lit des captures .pcapng via Pyshark, extrait douze protocoles par paquet et trace la répartition des protocoles.",
        context: "Mémoire de séminaire, Faculté de génie électronique de Niš",
        domain: "Analyse de captures de paquets",

        flow: {
          entry: "Une capture .pcapng",
          entryLabel: "",
          core: "Pyshark, via le tshark de Wireshark",
          branches: [
            { title: "Protocoles applicatifs", badge: "HTTP, HTTPS, DNS, FTP, SMTP" },
            { title: "Transport et contrôle", badge: "TCP, UDP, ICMP, ARP" },
            { title: "Adressage", badge: "IP, Ethernet" },
          ],
          exit: "Une ligne par paquet",
          exitLabel: "",
          exitNote: "Dépliable, et comptée dans les graphiques",
        },

        overview: [
          "Le mémoire traite de l’analyse du trafic réseau et explique pourquoi PCAP en est devenu le format standard. L’application met cela en pratique : ouvrez une capture, et elle affiche ce que transporte chaque paquet, protocole par protocole.",
          "En dessous, c’est Wireshark qui décode : Pyshark pilote son tshark, et l’analyse profite de toute sa couverture des protocoles. Par-dessus, l’application pose la même série de questions à chaque paquet du fichier et rassemble les réponses au même endroit, ce qui est pratique quand on cherche quelque chose sans savoir encore dans quel paquet.",
        ],

        steps: [
          {
            title: "La capture est lue une seule fois",
            body: "Une boîte de dialogue accepte un .pcapng ou un .pcap, Pyshark l’ouvre, et tous les paquets sont chargés dans une liste en mémoire avant la fermeture du fichier. Le fichier n’est plus jamais relu, d’où des filtres peu coûteux : ils parcourent de nouveau la liste au lieu de réanalyser la capture.",
          },
          {
            title: "Chaque paquet est parcouru couche par couche",
            body: "Les noms de protocoles viennent de la pile de couches du paquet lui-même et non d’une table, si bien qu’un paquet déclare ce qu’il contient vraiment et que le décompte final porte sur des couches réelles. Douze extracteurs s’exécutent ensuite l’un après l’autre, chacun vérifiant d’abord que son protocole est présent avant de lire quoi que ce soit.",
          },
          {
            title: "Chaque extracteur vérifie avant de lire",
            body: "Un champ qu’un paquet donné ne transporte pas n’est pas une erreur, c’est le cas normal : chaque extracteur vérifie donc l’existence de chaque attribut avant de le lire et omet simplement ce qui manque. D’où un arbre irrégulier : un paquet HTTP montre une douzaine de champs, le suivant en montre deux, et les deux sont corrects.",
          },
          {
            title: "Ce qui est en clair ressort en clair",
            body: "Les identifiants HTTP Basic sont du base64, pas du chiffrement, donc l’extracteur les décode. FTP envoie le nom d’utilisateur et le mot de passe en texte, ils apparaissent donc aussi. C’est la démonstration que voulait le mémoire : la chaîne décodée, affichée dans l’arbre, sous vos yeux.",
          },
          {
            title: "Les résultats : un arbre et des graphiques",
            body: "Chaque paquet devient une ligne - horodatage, IP source et destination, longueur, liste de protocoles - qui se déplie en un nœud par protocole et une feuille par champ. Le même parcours produit un décompte par protocole, que Matplotlib trace en camembert et en diagramme en barres, intégrés directement dans la fenêtre.",
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
            title: "Un arbre, pas un pavé de texte",
            body: "Paquet, puis protocole, puis champ, et chaque niveau ne s’ouvre que lorsque vous le demandez : une capture de plusieurs milliers de paquets reste lisible.",
          },
          {
            title: "La répartition des protocoles d’un coup d’œil",
            body: "Un camembert pour les proportions et un diagramme en barres pour les nombres, redessinés à chaque filtre appliqué : vous voyez ce que le filtre a réellement retiré.",
          },
          {
            title: "Des identifiants en clair, montrés comme tels",
            body: "L’authentification HTTP Basic décodée, les noms d’utilisateur et les mots de passe FTP : l’argument le plus court possible pour ne pas utiliser ces protocoles sans chiffrement.",
          },
          {
            title: "Les deux générations de PCAP",
            body: "La boîte de dialogue accepte .pcapng et .pcap. Le format le plus récent contient davantage de métadonnées et gère plusieurs interfaces, et il est lu par le même code.",
          },
        ],

        dataset: [],

        results: {
          columns: [],
          rows: [],
          notes: [],
        },

        takeaway: [
          "L’application fonctionne sur n’importe quelle capture grâce à la discipline qu’impose le format. Un paquet ne garantit rien sur les champs qu’il contient : chaque lecture est donc protégée par une vérification, et un champ absent est un résultat normal, pas un échec. Écrire les douze extracteurs un par un rend cela explicite, et c’est pourquoi une capture de deux paquets et une de deux mille passent par le même code, sans aucun cas particulier.",
          "Comme la capture n’est lue qu’une fois, tout le reste est immédiat. Chaque filtre, chaque recomptage et chaque graphique redessiné partent de la liste déjà en mémoire : changer une date ou une adresse IP affiche aussitôt une nouvelle vue de la même capture, sans relire le fichier.",
        ],
      },

      easyBreathe: {
        title: "Easy Breathe",
        tagline:
          "Les relevés publics de pollen en Serbie, filtrés pour ne garder que ceux qui concernent une personne.",
        description:
          "Une application mobile construite sur des données publiques ouvertes. L’agence serbe de l’environnement publie les relevés de pollen des stations de tout le pays, et l’application les copie à intervalles réguliers dans sa propre base, puis ne garde que les allergènes choisis par l’utilisateur, dans le rayon qu’il a fixé - sur une carte, par niveau de concentration, et par une notification push quand un niveau augmente.",
        metaTitle: "Easy Breathe - Vuk Cvetković",
        metaDescription:
          "Une application React Native et Expo adossée à une API NestJS : les données ouvertes sur le pollen en Serbie, importées à intervalles réguliers et filtrées par lieu, rayon et allergènes choisis.",
        context: "Mémoire de séminaire sur les systèmes d’e-administration, Faculté de génie électronique de Niš",
        domain: "Données publiques ouvertes, pollen et allergènes",

        flow: {
          entry: "Cinq endpoints de données ouvertes",
          entryLabel: "",
          core: "Import planifié",
          branches: [
            { title: "Mensuel", badge: "Allergènes, types, lieux" },
            { title: "Horaire, de 9 h à 12 h", badge: "Pollens, concentrations" },
          ],
          exit: "Une base dédoublonnée",
          exitLabel: "",
          exitNote: "Réduite à un rayon, un jour et vos allergènes",
        },

        overview: [
          "Les données publiques existent, et elles sont de qualité : l’agence serbe de l’environnement publie chaque jour les relevés de pollen des stations de mesure du pays, sous forme d’API ouverte, sans clé ni limite. Ce qu’elle ne fait pas, c’est dire à une personne allergique à l’ambroisie si la journée sera difficile là où elle se trouve. L’application sert à combler cet écart.",
          "Le travail se partage donc en deux. L’API copie les données ouvertes dans sa propre base à intervalles réguliers, car un téléphone n’a pas à parcourir des centaines de milliers de relevés nationaux pour répondre à une question locale. L’application pose ensuite une seule question à cette copie - qu’y a-t-il dans l’air près de moi, parmi ce à quoi je suis allergique - et y répond sur une carte, en quatre niveaux, et par une notification.",
        ],

        steps: [
          {
            title: "Les données ouvertes sont copiées à deux rythmes",
            body: "Les cinq endpoints n’évoluent pas au même rythme, ils ne sont donc pas interrogés à la même fréquence. Les allergènes, les types d’allergènes et les lieux sont chargés le premier de chaque mois à neuf heures. Les pollens et les concentrations, qui sont les données qui bougent, sont récupérés toutes les heures entre neuf heures et midi, quand paraissent les relevés du jour.",
          },
          {
            title: "Un import qu’on peut relancer sans risque",
            body: "Chaque tâche d’import vérifie d’abord les identifiants qu’elle a déjà en base, ne garde que ceux qui manquent et n’insère que ceux-là. Une exécution horaire qui ne trouve rien de nouveau n’écrit donc rien, la même exécution peut être relancée sans dupliquer un relevé, et la période demandée remonte une semaine en arrière, ce qui permet de récupérer un relevé publié quelques jours après la mesure.",
          },
          {
            title: "Une position et un rayon donnent une liste de stations",
            body: "Les coordonnées de l’utilisateur et le rayon choisi, en kilomètres, alimentent une requête géospatiale MongoDB, le rayon étant divisé par celui de la Terre pour obtenir la sphère qu’attend la requête. Elle renvoie toutes les stations de mesure assez proches pour concerner cette personne.",
          },
          {
            title: "Stations et date donnent les relevés utiles",
            body: "Les identifiants de ces stations et la date du jour sélectionnent les relevés de pollen de la journée, chacun contenant les identifiants des concentrations mesurées. Ces concentrations sont ensuite récupérées et filtrées sur les allergènes que l’utilisateur a sélectionnés : la réponse ne contient que des relevés à la fois proches et pertinents.",
          },
          {
            title: "Chaque relevé reçoit un niveau et un lieu",
            body: "Une concentration brute ne veut rien dire en soi : chacune est comparée aux seuils publiés pour son allergène et classée Low, Normal, High ou Very high. Le relevé est ensuite mis en forme avec l’allergène et la station d’origine, et c’est ce qu’affichent le marqueur sur la carte et la vue détaillée.",
          },
        ],

        features: [
          {
            title: "Choisissez vos allergènes",
            body: "Une trentaine d’allergènes sont publiés, et le profil permet d’en sélectionner autant que vous voulez. La carte, les niveaux et les notifications découlent tous de cette liste.",
          },
          {
            title: "Votre rayon, votre intervalle",
            body: "Le rayon de recherche en kilomètres et la fréquence de vérification en heures, tous deux réglés dans le profil. Un intervalle plus court donne des alertes plus à jour, un intervalle plus long économise la batterie.",
          },
          {
            title: "Une carte lisible d’un coup d’œil",
            body: "Des marqueurs sur les stations de mesure proches de vous, colorés selon le niveau. Touchez-en un pour voir lesquels de vos allergènes y ont été mesurés, et à quel niveau.",
          },
          {
            title: "Quatre niveaux, avec leur décompte",
            body: "Low, Normal, High et Very high, chacun avec le nombre d’allergènes proches à ce niveau. Touchez un niveau pour afficher la liste, puis une entrée pour voir la station, la description et le relevé.",
          },
          {
            title: "Une notification quand ça monte",
            body: "Une notification push et une alerte dans l’application dès qu’un allergène de votre liste atteint une forte concentration à proximité : l’application est utile même fermée.",
          },
          {
            title: "Des comptes simples",
            body: "Inscription et connexion par e-mail. Le profil enregistre les allergènes, le rayon et l’intervalle : la sélection est liée au compte, pas au téléphone.",
          },
        ],

        dataset: [],

        results: {
          columns: [],
          rows: [],
          notes: [],
        },

        takeaway: [
          "La principale leçon : des données ouvertes ne sont pas forcément des données exploitables. Cinq endpoints qui se référencent par identifiants, une échelle nationale et aucun moyen de poser une question géographique : toute la valeur est dans la copie et les jointures. Décider quoi copier, à quelle fréquence, et comment rendre une double copie sans effet, c’est là qu’était le vrai travail d’ingénierie.",
          "L’autre leçon, c’est que l’information doit arriver sans qu’on la demande. Une personne allergique n’ouvre pas une application pour vérifier : elle veut être prévenue, dans un rayon et à un intervalle réglés une fois pour toutes. Grâce aux notifications push sur un backend planifié, un jeu de données public devient une alerte qui prévient la personne concernée le jour où cela compte.",
        ],
      },
    },
  },

  games: {
    label: "Jeux",

    /** The space before the colon is French typography and therefore part of
     *  the string, which is why the label carries its own punctuation. See the
     *  note in en.ts. */
    built: "Réalisé :",

    sound: "Son",

    /** Left in English on purpose: "en ligne" says live *play*, not released.
     *  See the note in en.ts. */
    status: {
      live: "Live",
      beta: "Bêta",
    },

    index: {
      metaTitle: "Jeux - Vuk Cvetković",
      metaDescription:
        "Les jeux de navigateur de Vuk Cvetković : 2048, le démineur, un Memory en douze niveaux, la bataille navale contre quatre adversaires, un jeu où l’on fusionne des mondes pour en former de plus grands, et un cube en 3D du 2×2 au 5×5. Chacun a sa propre page.",
      heading: "Jeux",
      intro:
        "Des jeux qui méritent plus d’une partie. Chacun a sa page, avec en dessous un texte sur la façon dont il est construit, pour ceux que cela intéresse.",
    },

    items: {
      twentyFortyEight: {
        name: "2048",

        /** One line, for the card on the index. */
        tagline:
          "Poussez le plateau et chaque tuile glisse aussi loin qu’elle le peut. Deux nombres identiques fusionnent en un seul, de valeur double, jusqu’à 2048.",

        metaDescription:
          "Le jeu de tuiles. Poussez le plateau, fusionnez les nombres identiques, et atteignez une tuile 2048.",
        lead: "Poussez le plateau dans n’importe quelle direction et chaque tuile glisse aussi loin qu’elle le peut. Deux nombres identiques fusionnent en un seul, de valeur double, et le but est d’obtenir une tuile 2048.",

        score: "Score",
        best: "Record",
        highest: "Plus grande tuile",
        newGame: "Nouvelle partie",
        undo: "Annuler",
        hint: "Les flèches ou WASD, et un balayage sur téléphone.",

        won: {
          title: "2048",
          body: "La tuile est sur le plateau. Rien n’oblige à s’arrêter là : la partie continue tant qu’une tuile peut bouger.",
          keepGoing: "Continuer",
        },

        over: {
          title: "Plus aucun coup",
          body: "Le plateau est plein et aucune tuile ne peut fusionner avec sa voisine. Vous pouvez encore annuler le dernier coup si c’est lui qui a tout fait basculer.",
          restart: "Rejouer",
        },

        how: {
          label: "Comment jouer",
          items: [
            {
              title: "Poussez tout le plateau",
              description:
                "Les flèches ou WASD au clavier, un balayage dans n’importe quelle direction sur téléphone. Chaque tuile parcourt en un coup toute la distance possible, et non une seule case.",
            },
            {
              title: "Les nombres identiques fusionnent",
              description:
                "Deux tuiles portant le même nombre n’en font plus qu’une, de valeur double. Une tuile qui vient de fusionner ne peut plus fusionner pendant ce coup : une rangée de quatre 2 donne donc deux 4, et non un 8.",
            },
            {
              title: "Une nouvelle tuile à chaque coup",
              description:
                "Elle apparaît sur une case libre, et c’est un 2 neuf fois sur dix. Une poussée qui ne change rien n’est pas un coup : rien de nouveau n’apparaît, et vous ne perdez rien à essayer.",
            },
            {
              title: "Choisissez un coin et restez-y",
              description:
                "Gardez la plus grande tuile dans un coin et ne poussez jamais dans l’autre sens. L’essentiel du jeu consiste à refuser le coup qui l’en ferait sortir.",
            },
          ],
        },

        close: {
          label: "Comment c’est construit",
          paragraphs: [
            "Ni canvas ni bibliothèque de jeu. Une tuile est un élément doté de deux propriétés personnalisées, sa position est une translation calculée par rapport à sa propre taille, et le navigateur gère le glissement à l’étape de composition. D’où la fluidité : un coup ne modifie qu’une transformation, et rien ne passe par le calcul de la mise en page.",
            "Autre point : chaque tuile garde le même élément pendant toute sa vie. Le plateau n’est jamais reconstruit à partir de l’état : un coup met à jour les nombres sur des nœuds déjà présents, c’est pourquoi on voit une tuile parcourir le chemin depuis sa place au lieu de disparaître et de réapparaître ailleurs.",
            "Les chiffres sont du texte : ils sont aussi nets que le reste de la page et suivent la taille de texte réglée par le lecteur. Les couleurs sont des variables de la même feuille de style que tout le reste, c’est pourquoi le plateau suit le sélecteur de thème de l’en-tête.",
            "Toutes les commandes passent par une seule fonction, appelée depuis trois endroits, si bien qu’une touche, un balayage et un appui ne peuvent pas finir par avoir des effets légèrement différents. Les flèches ne sont captées par le plateau que lorsqu’il est à l’écran, et un coup joué avant que le précédent soit terminé est mis en attente plutôt qu’ignoré : jouer vite ne coûte jamais un coup.",
          ],
        },
      },

      minesweeper: {
        name: "Démineur",

        tagline:
          "Ouvrez toutes les cases qui ne cachent pas de mine. Chaque nombre indique combien de mines l’entourent, et tout le reste s’en déduit.",

        metaDescription:
          "Le démineur dans le navigateur, sur les plateaux débutant, intermédiaire et expert, avec un premier clic qui ne fait jamais perdre.",
        lead: "Ouvrez toutes les cases qui ne cachent pas de mine. Un nombre indique combien des huit cases qui l’entourent sont minées, et tout le reste s’en déduit. Trois plateaux, aux dimensions de l’original, et un premier clic qui ne fait jamais perdre.",

        boards: "Plateau",
        levels: {
          beginner: "Débutant",
          intermediate: "Intermédiaire",
          expert: "Expert",
        },

        mines: "Mines",
        time: "Temps",
        best: "Record",
        newGame: "Nouvelle partie",
        flagMode: "Drapeaux",
        hint: "Appuyez pour ouvrir. Clic droit ou F pour poser un drapeau, appui long sur téléphone. Un appui ou le bouton du milieu sur un nombre complet ouvre les cases restantes autour de lui.",

        gridLabel: "Champ de mines",
        cells: {
          hidden: "Fermée",
          flagged: "Drapeau",
          mine: "Mine",
          empty: "Vide",
          wrong: "Drapeau erroné",
        },

        won: {
          title: "Terrain déminé",
          body: "Toutes les cases qui ne cachaient pas de mine sont ouvertes.",
          record: "Un nouveau record sur ce plateau.",
          again: "Rejouer",
        },

        lost: {
          title: "Mine",
          body: "Le terrain est révélé tel qu’il était. Un drapeau posé sur une case sans mine est signalé : c’est souvent là que le raisonnement a déraillé.",
          again: "Réessayer",
        },

        how: {
          label: "Comment jouer",
          items: [
            {
              title: "Le premier clic est sûr",
              description:
                "Les mines sont placées après lui, en épargnant l’endroit où vous avez appuyé :le premier coup ne peut donc pas faire perdre et ouvre toujours une zone dégagée. Commencez où vous voulez.",
            },
            {
              title: "Un nombre compte ses voisines",
              description:
                "C’est le nombre de mines parmi les huit cases qui le touchent. Une case sans aucune mine autour d’elle ouvre toute la zone alentour d’un seul appui.",
            },
            {
              title: "Marquez ce que vous avez déduit",
              description:
                "Clic droit sur ordinateur, F au clavier, appui long sur téléphone. L’appui long ne fait que poser un drapeau, pour qu’un doigt trop lent ne retire pas celui qu’il vient de mettre : pour en enlever un, passez en mode drapeaux, qui est de toute façon plus pratique pour en poser toute une série. Le compteur affiche le nombre de mines moins le nombre de drapeaux.",
            },
            {
              title: "Appuyez sur un nombre complet",
              description:
                "Dès qu’un nombre a autant de drapeaux autour de lui qu’il l’annonce, appuyer dessus ouvre d’un coup toutes les autres cases autour, et le bouton du milieu fait de même. Maintenez le bouton enfoncé et les cases qui s’ouvriraient s’enfoncent aussi : vous voyez les huit avant de valider. C’est là que se gagne la vitesse dans ce jeu, et la plupart des joueurs ne le découvrent jamais.",
            },
          ],
        },

        close: {
          label: "Comment c’est construit",
          paragraphs: [
            "Ni canvas ni bibliothèque de jeu, et contrairement à 2048, pas de mouvement non plus. Il n’y a ni boucle ni animation en cours : une case est un bouton, qui change d’état ou non, et le plateau expert en compte quatre cent quatre-vingts. Le coût d’exécution se résume à une classe sur un élément.",
            "Les mines sont placées au premier appui et non au départ, en épargnant la case touchée et les huit qui l’entourent. Un terrain tiré à l’avance doit soit laisser le premier coup perdre, ce qui relève du pile ou face et non du jeu, soit être redistribué jusqu’à ce que ce ne soit plus le cas, ce qui fausse discrètement les probabilités partout ailleurs. Placer les mines au dernier moment donne un terrain honnête et un premier coup qui ouvre toujours une zone.",
            "Une zone s’ouvre avec une file d’attente et non par récursion, qu’un téléphone a le droit de refuser à quatre cents niveaux de profondeur, et cette file fournit au passage le minutage de l’animation : l’anneau où une case a été trouvée donne sa distance au point d’appui, et chaque case attend autant de pas avant de s’ouvrir. L’ouverture se propage ainsi vers l’extérieur au lieu de changer le plateau d’un bloc, pour le prix d’une propriété personnalisée et d’un délai.",
            "Le plateau est une vraie grille : des lignes, des cellules, un nombre de lignes et de colonnes, et une seule case à la fois dans l’ordre de tabulation, pour qu’on le parcoure avec les flèches plutôt qu’avec la touche Tab. Le plateau de 2048, lui, doit être masqué aux lecteurs d’écran et décrit par une région live, parce que seize tuiles qui se réécrivent à chaque touche sont impossibles à lire. Un champ de mines est un tableau immobile qui attend, et c’est exactement à cela que sert une grille.",
          ],
        },
      },

      memory: {
        name: "Memory",

        tagline:
          "Retournez deux cartes et retenez ce qu’elles cachaient. Douze niveaux, de quatre cartes à soixante, et un plateau plus grand à chaque niveau réussi.",

        metaDescription:
          "Le Memory dans le navigateur : douze niveaux de quatre à soixante cartes, jusqu’à trois étoiles par plateau, et une partie libre où tous les plateaux sont ouverts dès le départ.",
        lead: "Retournez deux cartes à la fois et trouvez toutes les paires. Douze niveaux, chaque plateau plus grand que le précédent, de quatre cartes à soixante, avec trente images au total. Réussissez un niveau pour ouvrir le suivant, ou passez directement à n’importe quelle taille en partie libre.",

        modes: "Mode",
        modeNames: {
          campaign: "Niveaux",
          free: "Partie libre",
        },

        boards: "Choisissez un niveau",
        level: "Niveau",

        locked: "Verrouillé",
        open: "Pas encore réussi",
        stars: ["Une étoile", "Deux étoiles", "Trois étoiles"],

        moves: "Coups",
        time: "Temps",
        best: "Minimum de coups",
        goal: "Étoiles",
        newGame: "Nouvelle partie",
        hint: "Appuyez sur une carte pour la retourner, puis sur une autre. Une paire reste visible et le reste se retourne. Les flèches parcourent la table et Entrée retourne une carte.",

        gridLabel: "Cartes",
        cells: {
          hidden: "Face cachée",
          matched: "{name}, paire trouvée",
        },

        messages: {
          pair: "{name}. Une paire.",
          miss: "{name}. Pas une paire.",
        },

        pictures: {
          apple: "Pomme",
          cherries: "Cerises",
          lemon: "Citron",
          strawberry: "Fraise",
          watermelon: "Pastèque",
          pear: "Poire",
          grapes: "Raisin",
          orange: "Orange",
          banana: "Banane",
          pineapple: "Ananas",
          sun: "Soleil",
          moon: "Lune",
          cloud: "Nuage d’orage",
          rainbow: "Arc-en-ciel",
          snowflake: "Flocon de neige",
          leaf: "Feuille d’érable",
          tulip: "Tulipe",
          mushroom: "Champignon",
          cactus: "Cactus",
          tree: "Sapin",
          rocket: "Fusée",
          balloon: "Montgolfière",
          anchor: "Ancre",
          key: "Clé",
          crown: "Couronne",
          heart: "Cœur",
          star: "Étoile",
          gem: "Diamant",
          bell: "Cloche",
          umbrella: "Parapluie",
        },

        won: {
          title: "Toutes les paires trouvées",
          record: "Moins de coups que jamais sur ce niveau.",
          final: "C’était le dernier niveau. Il ne reste plus qu’à décrocher les trois étoiles sur les douze.",
          next: "Niveau suivant",
          bigger: "Plateau suivant",
          again: "Rejouer",
        },

        how: {
          label: "Comment jouer",
          items: [
            {
              title: "Deux cartes par tour",
              description:
                "Appuyez sur une carte pour la retourner, puis sur une deuxième. Si les images sont identiques, les deux restent face visible. Sinon, elles restent visibles le temps de les mémoriser puis se retournent, et appuyer sur la carte suivante les retourne aussitôt.",
            },
            {
              title: "Chaque tour est un coup",
              description:
                "Deux cartes font un coup, paire ou non. Trois étoiles : le plateau est terminé presque aussi vite qu’avec une mémoire parfaite. Deux étoiles : jusqu’à moitié plus de coups. Une étoile : vous êtes allé au bout. Les étoiles au-dessus de la table s’éteignent à mesure que vous franchissez chaque seuil.",
            },
            {
              title: "Douze niveaux, chacun plus grand",
              description:
                "De deux sur deux à dix sur six. Réussir un niveau débloque le suivant, et votre minimum de coups est conservé pour chacun. Les cinq premiers puisent chacun dans une famille d’images, les fruits, la nature ou les objets, et à partir du sixième, les trente images sont en jeu.",
            },
            {
              title: "Ou allez droit au but",
              description:
                "La partie libre ouvre tous les plateaux d’un coup, sans étoile à gagner et sans rien de verrouillé. Les mêmes cartes et les mêmes règles, pour quand vous voulez directement la grande table.",
            },
          ],
        },

        close: {
          label: "Comment c’est construit",
          paragraphs: [
            "Pas de canvas ni de bibliothèque de jeu, comme pour les autres. Une carte est un bouton à deux faces, et la retourner tient en une seule transition sur une seule propriété : le calque qui porte les deux faces fait un demi-tour autour de son axe vertical, chaque face a son revers masqué, et le navigateur affiche celle qui est tournée vers vous. La rotation dépasse de quelques degrés avant de se stabiliser, ce qui donne à la carte du poids, là où un simple carré ne ferait que pivoter. Chaque carte a sa propre perspective, proportionnelle à sa taille, si bien qu’une carte du plus petit plateau et une du plus grand tournent avec la même profondeur.",
            "Les trente images sont dessinées, pas téléchargées : une seule planche de sprites dans la page, un symbole par image, et chaque face de carte y fait référence. Chacune est en aplats de trois tons, la couleur elle-même, un reflet du côté de la lumière et une ombre à l’opposé, sur un fond qui lui est propre. Les images gardent leurs couleurs dans les deux thèmes et seuls les fonds suivent la page, si bien qu’une pomme retenue en thème clair est la même pomme en thème sombre. Les sons sont produits de la même manière, dans le navigateur, avec quelques oscillateurs et une salve de bruit filtré : la page ne charge donc aucun fichier audio non plus.",
            "Une carte ne sait pas ce qu’elle est avant d’être retournée. La table face cachée ne contient aucune réponse dans la page : la face de chaque carte ne pointe vers aucune image, et l’image n’y est écrite qu’au moment où la carte se retourne. Les cartes sont mélangées une fois par plateau, et leur ordre reste dans le code du jeu, là où la page ne peut pas le lire.",
            "Les seuils des étoiles ont été mesurés, pas choisis. Un joueur à la mémoire parfaite, qui ne retourne jamais une carte déjà vue sauf pour compléter une paire, a joué deux cent mille parties sur chaque plateau, et le seuil des trois étoiles correspond au nombre de coups qui lui a suffi neuf parties sur dix. Sa moyenne est de 1,61 coup par paire, la valeur connue pour ce jeu, qui a servi à vérifier la simulation.",
            "Le plateau est dimensionné pour tenir à l’écran, parce qu’un plateau de Memory qu’il faut faire défiler, on ne le voit jamais en entier. Sur un téléphone tenu à la verticale, il pivote d’un quart de tour et passe de dix cartes de large à six, sans qu’aucune carte ne bouge pour autant : la grille se remplit par colonnes au lieu de par lignes, les flèches échangent leurs axes en conséquence, et un lecteur d’écran parcourt toujours le même tableau.",
          ],
        },
      },

      accretion: {
        name: "Accrétion",

        tagline:
          "Laissez tomber des corps célestes. Deux identiques fusionnent en l’astre suivant, de la Lune jusqu’au Soleil.",

        metaDescription:
          "Un jeu de fusion dans le navigateur : laissez tomber des corps célestes, et deux identiques fusionnent en l’astre suivant, de la Lune au Soleil.",
        lead: "Laissez tomber un corps céleste. Deux identiques fusionnent en l’astre suivant, de la Lune au Soleil en passant par les planètes, et l’espace se remplit, que vous soyez prêt ou non.",

        score: "Score",
        best: "Record",
        next: "Suivant",
        newGame: "Nouvelle partie",
        hint: "Déplacez-vous pour viser et appuyez pour lâcher. Au clavier, les flèches pour viser, la barre d’espace pour lâcher.",
        sequence: "L’ordre, du plus petit au plus grand",

        planets: [
          "Lune",
          "Mercure",
          "Mars",
          "Vénus",
          "Terre",
          "Neptune",
          "Uranus",
          "Saturne",
          "Jupiter",
          "Soleil",
        ],

        over: {
          title: "Plus de place",
          body: "Un corps est resté trop longtemps au-dessus de la ligne. Il n’y a pas de plafond, seulement une ligne, et un corps qui s’immobilise au-dessus n’a plus nulle part où aller.",
          restart: "Rejouer",
        },

        how: {
          label: "Comment jouer",
          items: [
            {
              title: "Visez, puis lâchez",
              description:
                "Déplacez-vous le long du haut du champ pour placer un corps et appuyez pour le lâcher. Seuls les cinq plus petits vous sont donnés, donc tout ce qui vient après la Terre doit être obtenu par fusion.",
            },
            {
              title: "Deux identiques se touchent et fusionnent",
              description:
                "Inutile de les presser l’un contre l’autre ou de les maintenir : dès que deux corps identiques s’immobilisent l’un contre l’autre, ils deviennent l’astre suivant, et une fusion qui aboutit à côté d’une autre déclenche une réaction en chaîne.",
            },
            {
              title: "Construisez en largeur, pas en hauteur",
              description:
                "Un corps lâché sur une pile haute roule, et il ne s’arrête pas là où vous l’avez visé. L’essentiel du jeu consiste à garder les gros corps au fond, car ce sont eux qui n’ont plus nulle part où aller.",
            },
            {
              title: "La ligne est un délai, pas un mur",
              description:
                "Rien n’empêche un corps de la dépasser. La partie n’est perdue que si un corps s’est posé au-dessus et y est encore une demi-seconde plus tard : un rebond passager ne coûte rien, un Jupiter installé là, si.",
            },
          ],
        },

        close: {
          label: "Comment c’est construit",
          paragraphs: [
            "Pas de canvas, pas de bibliothèque de physique et aucune dépendance. Un corps est un div avec un border-radius, sa couleur est un dégradé dans la même feuille de style que le reste de la page, et à chaque image, une seule transformation est écrite sur chacun. Les planètes suivent donc l’échelle de la page, restent nettes à tout niveau de zoom et n’ajoutent rien à télécharger. Un moteur physique généraliste pèserait à lui seul cinq fois ce jeu tout entier.",
            "Le solveur fait beaucoup de petits pas plutôt que quelques grands, huit par image. À chaque pas, chaque contact est résolu comme un ressort raide et très amorti, les corps se déplacent, puis chaque contact est résolu une seconde fois, de façon rigide, ce qui annule la vitesse que la poussée leur avait donnée. Un recouvrement est ainsi corrigé sans jamais devenir un rebond, et une pile au repos reste parfaitement immobile. Un contact est détecté alors qu’il reste encore un écart, si bien qu’une planète qui tombe s’arrête exactement sur la surface où elle se pose au lieu de s’y enfoncer puis d’en être repoussée.",
            "Le reste sert à donner du poids plutôt que de l’élasticité. Le frottement agit entre les deux surfaces, rotation comprise, donc un corps qui glisse se met à rouler. Un atterrissage brutal absorbe la rotation avec laquelle le corps arrive, si bien qu’une planète qui en accroche une autre sur le côté s’arrête près d’elle au lieu de traverser le champ en roulant. Un choc est dissipé sur place et jamais reporté au pas suivant, ce qui empêche un gros corps de rebondir sur un petit. Enfin, une planète en équilibre au sommet d’une autre en est aussitôt délogée : l’équilibre a beau être réel, une planète posée sur une autre comme un bonhomme de neige a l’air coincée.",
            "La simulation tourne dans son propre espace de 1200 sur 1650 unités et ignore à quelle taille elle est affichée. Une seule transformation sur un seul élément met tout le champ à l’échelle de la largeur que la page lui accorde : un redimensionnement change ce nombre et rien d’autre, ni un rayon, ni une position, ni un pas. À chaque image, chaque corps est dessiné entre ses positions des deux derniers pas, si bien qu’un écran à 120 Hz reçoit une nouvelle position à chaque rafraîchissement. Le ciel en arrière-plan est dessiné une seule fois, à la génération du site : trois cents étoiles en points le long de quelques tracés, des nébuleuses faites de bruit fractal et quatre couches qui glissent à des vitesses différentes pendant que vous visez.",
          ],
        },
      },

      battleship: {
        name: "Bataille navale",

        tagline:
          "Cachez cinq navires, puis trouvez les leurs en premier. Quatre adversaires, de celui qui tire au hasard à celui qui compte chaque position où votre flotte peut encore se trouver.",

        metaDescription:
          "La bataille navale dans le navigateur, contre quatre adversaires : la flotte classique sur une grille de dix sur dix, et un adversaire qui compte chaque disposition que les tirs déjà joués autorisent encore.",
        lead: "Cachez cinq navires, puis trouvez les leurs avant qu’ils ne trouvent les vôtres. Chacun tire à son tour, et toute la difficulté tient à l’adversaire choisi : le plus faible tire là où il n’a pas encore tiré, et le plus fort compte chaque position où votre flotte peut encore se trouver et vise la case qui apparaît dans le plus grand nombre d’entre elles.",

        /** Des grades plutôt que des adjectifs : « facile » et « difficile »
         *  disent comment cela va se passer pour vous, un grade dit qui est en
         *  face, et c'est cela que l'on choisit. */
        opponents: "Choisissez votre adversaire",
        levels: {
          sailor: {
            name: "Matelot",
            note: "Tire au hasard. Environ 95 tirs pour couler toute la flotte : il faut vraiment le vouloir pour perdre.",
          },
          gunner: {
            name: "Canonnier",
            note: "Exploite chaque coup au but. Environ 55 tirs, et il sanctionne un départ trop lent.",
          },
          captain: {
            name: "Capitaine",
            note: "Fouille la grille méthodiquement. Environ 50 tirs : un combat équilibré.",
          },
          admiral: {
            name: "Amiral",
            note: "Environ 45 tirs, tout près du meilleur résultat jamais atteint. Attendez-vous à perdre.",
          },
        },

        shots: "Tirs",
        /** ⚠️ Pas "Record" : un décompte où moins vaut mieux, et sous ce mot un
         *  nombre nu se lit comme un score où plus vaut mieux. */
        best: "Minimum de tirs",
        toPlace: "À placer",
        rotate: "Pivoter",
        shuffle: "Redisposer",
        start: "Commencer",
        newGame: "Nouvelle partie",

        /** Le titre au-dessus de chaque grille, et le nom de la grille. */
        sides: {
          enemy: "Leurs eaux",
          own: "Votre flotte",
        },

        /** Ce que dit une case quand il n'y a rien à y lire. */
        cells: {
          water: "Eau",
          ship: "Navire",
          miss: "Manqué",
          hit: "Touché",
          sunk: "Coulé",
        },

        ships: ["Porte-avions", "Cuirassé", "Croiseur", "Sous-marin", "Contre-torpilleur"],

        /** La ligne sous une grille après un tir. `{ship}` est remplacé par le
         *  nom pris dans la liste ci-dessus. */
        messages: {
          hit: "Touché.",
          miss: "Manqué.",
          sunk: "{ship} coule.",
          waiting: "Il vise.",
          ready: "À vous de tirer.",
        },

        setupHint:
          "Votre flotte est déjà à l’eau. Appuyez sur un navire pour le prendre, faites-le pivoter si besoin, puis appuyez sur l’eau pour le poser.",
        hint: "Appuyez sur une case dans leurs eaux pour tirer. Les flèches parcourent une grille, Entrée tire, et R fait pivoter un navire pendant que vous le placez.",

        won: {
          title: "Leur flotte est coulée",
          body: "Les cinq navires sont coulés, et votre flotte a été la plus rapide.",
          record: "En moins de tirs que jamais contre cet adversaire.",
          again: "Rejouer",
        },

        lost: {
          title: "Votre flotte est coulée",
          body: "Leurs navires sont révélés à leur emplacement, pour que vous voyiez ce que vous cherchiez.",
          again: "Réessayer",
        },

        how: {
          label: "Comment jouer",
          items: [
            {
              title: "Mettez cinq navires à l’eau",
              description:
                "Une flotte est placée pour vous dès l’ouverture de la page : vous pouvez commencer tout de suite. Appuyez sur un navire pour le prendre, faites-le pivoter, puis appuyez sur une case pour le poser. Les navires peuvent se toucher : c’est la règle standard, et celle qui révèle le moins d’informations.",
            },
            {
              title: "Un tir chacun, à tour de rôle",
              description:
                "Toucher un navire ne donne pas droit à un second tir, d’un côté comme de l’autre. Vous tirez en premier, l’adversaire répond, et la partie s’arrête dès que les dix-sept cases d’une flotte sont touchées.",
            },
            {
              title: "Un coup au but, une piste à suivre",
              description:
                "Il y a un navire, et il s’étend dans l’une des quatre directions. Deux coups au but alignés donnent l’orientation, et jusqu’à ce que le navire coule, seules les extrémités de cette ligne valent encore la peine d’être visées.",
            },
            {
              title: "Choisissez contre qui vous jouez",
              description:
                "Le matelot met environ quatre-vingt-quinze tirs à couler toute la flotte, le canonnier cinquante-cinq, le capitaine cinquante et l’amiral quarante-cinq. Le minimum possible est de dix-sept. Votre record est conservé séparément pour chacun, car battre l’un n’est pas battre l’autre.",
            },
          ],
        },

        close: {
          label: "Comment c’est construit",
          paragraphs: [
            "Pas de canvas ni de bibliothèque de jeu, comme pour les autres. La mer est une grille de boutons et la flotte est une couche au-dessus : un élément par navire, couvrant ses cases, avec un dessin à l’intérieur. Un porte-avions a un pont d’envol, un îlot et des marquages, un sous-marin flotte bas et n’a rien sur le pont, et rien de tout cela ne survit au découpage en cases. Une coque est donc une seule forme sur toute sa longueur, et non une extrémité arrondie collée sur chaque case. Chaque navire est dessiné deux fois : le plan complet, avec ses tourelles, ses cheminées et son pont d’envol, et la silhouette seule. C’est la silhouette qu’utilisent les copies empilées sous une coque pour lui donner un flanc, si bien que le détail n’est résolu qu’une fois par navire au lieu de huit. Un navire posé dans l’autre sens est le même dessin tourné d’un quart de tour.",
            "Le plateau est incliné et les navires se tiennent au-dessus, et les deux sont réels plutôt que dessinés. Le plateau pivote en trois dimensions et la flotte est soulevée le long de l’axe que cette rotation laisse libre : une coque se trouve donc au-dessus de sa propre ombre, et son flanc tourne avec elle quand elle pivote. Il n’y a de perspective nulle part, volontairement : un point de fuite rendrait le bord lointain plus étroit que le bord proche, et une grille dont on désigne les cases par leur nom ne peut pas se permettre des colonnes qui ne soient plus parallèles. Un tir est dessiné lui aussi, de l’une de vos coques jusqu’à la case où il tombe, car ici un tour, c’est une flotte qui tire sur une autre, pas une marque qui apparaît.",
            "L’adversaire ne voit pas la flotte sur laquelle il tire, et c’est garanti par la structure du code, pas par une promesse dans un commentaire. La fonction qui choisit une case reçoit deux choses : le relevé de ses propres tirs, et les longueurs des navires qu’il a déjà coulés. La disposition n’est pas accessible là où la décision se prend, il n’y a donc aucune ligne à surveiller. Le nom du navire coulé est public, comme quand un joueur l’annonce à voix haute, et cette information permet d’affiner le raisonnement.",
            "Le plus fort des quatre ne devine pas. Pour chaque navire encore à flot, il parcourt chaque position que ce navire pourrait occuper, écarte celles qu’un tir manqué ou une épave exclut, et ajoute une voix à chaque case inconnue couverte par les positions restantes. Il tire sur la case qui a le plus de voix. Chercher un navire et achever un coup au but relèvent du même calcul : sans rien d’inexpliqué, il produit la courbe en cloche habituelle au centre de la grille, et dès qu’un coup au but est sur la table, les positions qui ne l’expliquent pas sont écartées et tout le poids se concentre autour de lui.",
            "Achever un coup au but s’écrit d’ordinaire sous forme de file de cases à essayer, et c’est dans cette file que ce genre de programme se trompe : il faut la purger à chaque navire coulé, chaque fois qu’un autre tir règle l’une de ses entrées, et chaque fois que deux navires sont côte à côte. Ici, les cases à viser après un coup au but sont recalculées à partir de la grille à chaque tour : il n’y a rien à conserver et rien qui puisse devenir obsolète. Quatre adversaires, quarante mille parties simulées contre un défenseur écrit séparément, et pas un seul tir illégal.",
          ],
        },
      },

      cube: {
        /** Not the trade name. See the note in en.ts. */
        name: "Cube",

        tagline:
          "Mélangez-le et remettez-le en ordre, contre la montre. Quatre cubes du 2×2 au 5×5 et une pyramide, en vraie 3D, et chaque couronne se tourne en la faisant glisser.",

        metaDescription:
          "Un cube en 3D dans le navigateur : le 2×2, le 3×3, le 4×4, le 5×5 et la pyramide, que l’on tourne en faisant glisser une couronne, avec un chrono et un meilleur temps pour chacun.",
        lead: "Mélangez-le et remettez-le en ordre. Faites glisser une couronne pour la tourner, et faites glisser n’importe où autour du casse-tête pour le retourner en entier. Le chrono démarre à votre premier mouvement et s’arrête quand chaque face est de nouveau d’une seule couleur.",

        puzzles: "Choisissez un casse-tête",
        cube: "Cube",
        pyramid: "Pyramide",

        time: "Temps",
        moves: "Coups",
        best: "Record",
        scramble: "Mélanger",
        undo: "Annuler",

        cue: {
          idle: "Mélangez-le pour commencer",
          ready: "Le chrono démarre à votre premier mouvement",
        },

        hint: {
          cube: "Faites glisser une case pour tourner sa couronne, et faites glisser n’importe où autour du cube pour le tourner en entier. Au clavier, U, D, L, R, F et B tournent une face, Maj la tourne dans l’autre sens, un chiffre avant la lettre atteint une couronne plus profonde, et les flèches tournent le cube entier. H affiche un indice.",
          pyramid: "Faites glisser une case pour tourner son coin, et faites glisser n’importe où autour de la pyramide pour la tourner en entier. Au clavier, U, L, R et B tournent un coin, Maj le tourne dans l’autre sens, 1 avant la lettre tourne la pointe seule, et les flèches tournent la pyramide entière. H affiche un indice.",
        },

        messages: {
          scrambled: "Mélangé. Le chrono démarre à votre premier mouvement.",
        },

        /** See the note in en.ts. The layers carry their article, since the
         *  sentence is "Tournez {layer} {way}", `{piece}` is drawn as colour
         *  chips, and `left` carries its own colon, with the space French sets
         *  before it. */
        advice: {
          button: "Indice",
          step: "Étape {n} sur {total}",
          left: "Coups restants dans cette étape :",
          play: "Le jouer",
          close: "Fermer l’indice",
          colours: ["blanc", "rouge", "vert", "jaune", "orange", "bleu"],
          move: {
            turn: "Tournez {layer} {way}.",
            half: "Tournez {layer} d’un demi-tour.",
            layers: {
              top: "la couronne du haut",
              bottom: "la couronne du bas",
              left: "la face gauche",
              right: "la face droite",
              front: "la face avant",
              back: "la face arrière",
              middle: "la couronne du milieu",
              tipTop: "la pointe du haut",
              tipLeft: "la pointe de gauche",
              tipRight: "la pointe de droite",
              tipBack: "la pointe arrière",
              cornerTop: "le coin du haut",
              cornerLeft: "le coin de gauche",
              cornerRight: "le coin de droite",
              cornerBack: "le coin arrière",
            },
            ways: {
              up: "vers le haut",
              down: "vers le bas",
              left: "vers la gauche",
              right: "vers la droite",
              clockwise: "dans le sens des aiguilles d’une montre",
              anticlockwise: "dans le sens inverse des aiguilles d’une montre",
            },
          },
          stages: {
            cross: {
              title: "Croix blanche",
              place:
                "Cela amène l’arête {piece} vers la face blanche, entre le centre blanc et le centre de son autre couleur, sans déplacer les arêtes blanches déjà en place.",
            },
            corners: {
              title: "Coins blancs",
              out: "Le coin {piece} est dans la couronne blanche, mais au mauvais endroit, alors on le remonte d’abord dans la couronne du haut.",
              align: "Cela place le coin {piece} juste au-dessus de sa place.",
              insert: "Cette séquence fait descendre le coin {piece} à sa place, face blanche en bas. On la répète jusqu’à ce qu’il y soit.",
            },
            middle: {
              title: "Couronne du milieu",
              out: "L’arête {piece} est dans la couronne du milieu, mais au mauvais endroit, alors on la remonte d’abord en haut.",
              align: "Cela place l’arête {piece} au-dessus du centre de sa couleur.",
              right: "Cette séquence descend l’arête {piece} dans la couronne du milieu, vers la droite.",
              left: "Cette séquence descend l’arête {piece} dans la couronne du milieu, vers la gauche.",
            },
            yellowCross: {
              title: "Croix jaune",
              align: "Cela place la forme jaune comme la séquence le demande.",
              alg: "Cette séquence retourne les arêtes du haut face jaune vers le haut. Il faut parfois la faire deux fois.",
            },
            yellowEdges: {
              title: "Arêtes jaunes",
              align: "Cela aligne les arêtes du haut sur les centres en dessous.",
              alg: "Cette séquence échange des arêtes du haut sans toucher aux couronnes du dessous.",
            },
            yellowCorners: {
              title: "Coins jaunes à leur place",
              alg: "Cette séquence fait tourner trois coins du haut, et celui de devant à droite reste où il est.",
            },
            yellowTwist: {
              title: "Orienter les coins jaunes",
              twist:
                "On répète cette séquence jusqu’à ce que le coin du haut, devant à droite, montre le jaune vers le haut. Les couronnes du dessous se défont pendant ce temps et se remettent en place à la fin.",
              next: "Cela amène le coin suivant devant à droite.",
              finish: "Le dernier mouvement, et c’est résolu.",
            },
            layer: {
              title: "Première couronne",
              out: "Le coin {piece} est dans la couronne blanche, mais au mauvais endroit, alors on le remonte d’abord dans la couronne du haut.",
              align: "Cela place le coin {piece} juste au-dessus de sa place.",
              insert: "Cette séquence fait descendre le coin {piece} à sa place, face blanche en bas. On la répète jusqu’à ce qu’il y soit.",
            },
            orient: {
              title: "Le jaune en haut",
              align: "Cela place les coins comme la séquence le demande.",
              alg: "Cette séquence retourne les coins du haut face jaune vers le haut. Il faut parfois la faire plusieurs fois.",
            },
            permute: {
              title: "Dernière couronne",
              align: "Cela prépare l’échange.",
              alg: "Cette séquence échange des coins du haut sans toucher à la couronne du dessous.",
              finish: "Le dernier mouvement, et c’est résolu.",
            },
            tips: {
              title: "Pointes",
              place: "Cela tourne la pointe {piece} jusqu’à ce que ses couleurs correspondent au centre en dessous.",
            },
            centres: {
              title: "Centres",
              place: "Cela tourne un coin avec sa pointe jusqu’à ce que ses trois couleurs de centre correspondent aux faces qui l’entourent.",
            },
            edges: {
              title: "Arêtes",
              place: "Cela met l’arête {piece} en place, sans déplacer les centres ni les arêtes déjà placées.",
            },
          },
        },

        won: {
          title: "Résolu",
          record: "Votre meilleur temps sur ce casse-tête.",
          again: "Mélanger à nouveau",
          next: "Casse-tête suivant",
          assisted: "Résolu avec des indices, donc cela ne compte pas comme record.",
        },

        how: {
          label: "Comment jouer",
          items: [
            {
              title: "Faites glisser une couronne",
              description:
                "Appuyez sur une case et faites-la glisser dans le sens où vous voulez que sa rangée ou sa colonne aille. La couronne suit votre doigt et s’enclenche quand vous relâchez, et un geste rapide la mène jusqu’au bout.",
            },
            {
              title: "Faites glisser autour pour le retourner",
              description:
                "Faites glisser n’importe où hors du casse-tête pour le tourner en entier et voir un autre côté. Relâchez et il se replace face à vous, avec toujours trois faces bien visibles. Sur ordinateur, le bouton droit de la souris fait la même chose sur le casse-tête lui-même.",
            },
            {
              title: "Mélangez, puis battez le chrono",
              description:
                "Mélanger le brasse avec quelques dizaines de mouvements au hasard. Le chrono démarre à votre premier mouvement et s’arrête dès que chaque face est d’une seule couleur, et votre meilleur temps est gardé pour chaque casse-tête. Annuler reprend le dernier mouvement. Bloqué ? Indice montre le prochain mouvement et à quoi il sert, étape par étape, et une résolution avec des indices ne compte pas comme record.",
            },
            {
              title: "Cinq casse-têtes",
              description:
                "Le 2×2 est idéal pour commencer et le 3×3 est le grand classique. Le 4×4 et le 5×5 ajoutent des couronnes au milieu, et la pyramide tourne par tiers de tour autour de ses coins, avec des pointes qui tournent toutes seules.",
            },
          ],
        },

        close: {
          label: "Comment il est construit",
          paragraphs: [
            "Pas de canvas, pas de WebGL et pas de bibliothèque 3D. Le casse-tête est une scène d’éléments ordinaires, un par case, placés en trois dimensions avec des transformations CSS, et le navigateur dessine la perspective et calcule ce qui passe devant quoi. Un 5×5 en compte cent cinquante. Un mouvement écrit une rotation sur les cases de la couronne qui tourne et sur rien d’autre, et deux plaques sombres se glissent dans la coupe pour que l’intérieur du casse-tête ne soit jamais vide.",
            "Aucun mouvement n’est écrit nulle part. Un casse-tête est une liste de places où une case peut se trouver, chacune avec un centre et une direction, et un mouvement est un axe, une tranche de profondeur le long de cet axe et un angle. Les cases que prend un mouvement sont celles de la tranche, et l’endroit où chacune arrive se trouve en la faisant tourner puis en cherchant la place qui s’y trouve. Le cube et la pyramide n’ont rien de mécanique en commun et tournent sur le même code, et le 3×3 passe la vérification classique : R U, répété 105 fois, le ramène à l’état résolu.",
            "Un glissement est mesuré à travers la projection même que le navigateur utilise pour dessiner. Chaque axe autour duquel la case sous votre doigt pourrait tourner est essayé, et celui dont le mouvement à l’écran suit le mieux votre doigt l’emporte : la bonne couronne tourne sous n’importe quel angle, à une vitesse qui garde la case sous votre doigt. Quand vous relâchez, un ressort tire la couronne jusqu’au cran le plus proche. Il est réglé un peu en dessous de l’amortissement critique, si bien que la couronne dépasse d’un degré ou deux et revient, et c’est ce qui donne l’impression d’un plastique qui s’enclenche.",
            "Après un mouvement, une case prend la position de la place où elle est arrivée au lieu de garder la rotation qui l’y a menée. Les deux peuvent différer d’un quart de tour dans le plan de la case, ce qui ne se voit pas puisque chaque case est symétrique autour de son centre, et aucune erreur d’arrondi ne s’accumule, quelle que soit la durée de la partie.",
            "Chaque case est éclairée depuis une seule direction, fixée à vous plutôt qu’au casse-tête, si bien que la face du dessus est la plus claire et celle de droite la plus sombre, quelle que soit la façon dont il est tourné. La luminosité est recalculée pendant que la vue tourne et n’est écrite que lorsqu’elle change de façon visible. Les sons sont eux aussi produits dans le navigateur : chaque mouvement, c’est deux clics à quelques millisecondes d’écart sur un coup bref et grave.",
            "Les indices suivent la méthode qu’on apprend plutôt que la solution la plus courte, parce qu’une solution la plus courte peut seulement dire qu’un mouvement rapproche d’un coup, ce qui n’apprend rien. Le 3×3 se résout en sept étapes, couronne par couronne, le 2×2 en trois et la pyramide en trois, et chaque mouvement porte son étape, la pièce qu’il concerne et, au sein d’une séquence, la séquence elle-même. Là où une étape relève du jugement plutôt que d’une séquence, comme savoir quelle arête blanche descendre ensuite et comment, une courte recherche trouve le moins de mouvements pour cette seule pièce sans déplacer ce qui est déjà en place. Le plan est recalculé dès que le casse-tête n’est pas là où il devait être, et il a été vérifié en le suivant depuis mille cinq cents mélanges au hasard, qu’il a tous résolus.",
          ],
        },
      },
    },
  },

  services: {
    label: "Comment je peux vous aider",
    items: [
      {
        title: "Développement backend et API",
        description:
          "Des API REST et des services en Node.js (NestJS, Express) ou en .NET, avec la modélisation des données, l’authentification, le contrôle d’accès par rôles et les intégrations tierces.",
      },
      {
        title: "Développement produit full-stack",
        description:
          "Une fonctionnalité entière, confiée à une seule personne : le schéma de la base de données, l’API et les écrans React qui s’en servent.",
      },
      {
        title: "Architecture et déploiement AWS",
        description:
          "Mettre en place une infrastructure cloud ou consolider celle qui tourne déjà : environnements, pipelines CI/CD, et une revue des coûts et de la fiabilité.",
      },
      {
        title: "Revue technique et conseil",
        description:
          "L’audit d’une base de code ou d’une architecture existante : ce qu’il faut corriger en premier, un plan de refactorisation, et si une réécriture se justifie.",
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
    body: "L’adresse est peut-être incorrecte, ou la page a été déplacée. Le lien ci-dessous ramène à l’accueil, et tout le reste du site est à un clic de là.",
    cta: "Retour à l’accueil",
  },
};

export default fr;
