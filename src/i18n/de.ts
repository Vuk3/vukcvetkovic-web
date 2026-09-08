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
    all: 'Alle Projekte',
    view: 'Ausführlich lesen',
    back: 'Projekte',

    index: {
      metaTitle: 'Projekte - Vuk Cvetković',
      metaDescription:
        'Projekte von Vuk Cvetković, Backend-Entwickler in Niš: was jedes System tut, wie es gebaut ist und was dabei herauskam.',
      heading: 'Projekte',
      intro:
        'Arbeiten, über die ich vollständig schreiben kann, mit Architektur und Ergebnissen statt mit einem Screenshot. Vorerst eine, und jede bekommt ihre eigene Seite.',
    },

    detail: {
      year: 'Jahr',
      context: 'Rahmen',
      domain: 'Domäne',
      flow: 'Der Weg einer Anfrage',
      overview: 'Überblick',
      architecture: 'Architektur',
      features: 'Was es kann',
      dataset: 'Datensatz und Training',
      results: 'Ergebnisse',
      stack: 'Technologien',
      takeaway: 'Was ich daraus mitnehme',
    },

    results: {
      model: 'Modell',
      annotations: 'Annotationen',
    },

    stackGroups: {
      frontend: 'Frontend',
      gateway: 'Gateway',
      pythonService: 'Python-Service',
      dotnetService: '.NET-Service',
      data: 'Datensatz',
    },

    items: {
      objectDetection: {
        title: 'Vergleichendes System zur Objekterkennung',
        tagline: 'Dasselbe Bild durch zwei Machine-Learning-Ökosysteme, mit einer Antwort in einem Format.',
        description:
          'Meine Masterarbeit. Dasselbe Bild läuft durch ein YOLOv8m-Modell in Python und ein ML.NET-Modell in .NET, beide hinter einem Gateway, das in einem einzigen Format antwortet, sodass ein React-Frontend jedes der beiden Ergebnisse zeichnet. Eine erneute Annotation des Datensatzes brachte YOLOv8m auf 0,916 mAP@0.5 gegenüber 0,748 für ML.NET.',
        metaTitle: 'Vergleichendes System zur Objekterkennung - Vuk Cvetković',
        metaDescription:
          'Ein System aus meiner Masterarbeit: YOLOv8m in Python und ML.NET in .NET hinter einem NestJS-Gateway, verglichen auf demselben Datensatz zu Schutzausrüstung.',
        context: 'Masterarbeit, Fakultät für Elektronik in Niš',
        domain: 'Persönliche Schutzausrüstung auf der Baustelle',

        flow: {
          before: ['Bild, multipart/form-data', 'NestJS-Gateway'],
          branches: [
            ['FastAPI-Service', 'Ultralytics YOLOv8m'],
            ['ASP.NET-Core-Service', 'ML.NET-Modell'],
          ],
          after: ['Ein JSON-Format', 'Rahmen, Klassen, Konfidenz'],
        },

        overview: [
          'Die Frage war nicht, welches Modell im Abstrakten am besten erkennt. Die Frage war, was sich ändert, wenn dieselbe Erkennungsaufgabe zweimal gebaut wird, einmal im Ökosystem, nach dem die Forschung greift, und einmal in dem, das das Backend ohnehin betreibt. Das System trainiert deshalb ein YOLOv8m-Modell in Python und ein ML.NET-Modell in .NET auf denselben annotierten Bildern, stellt beide hinter eine API und schickt ein Bild durch eines von beiden oder durch beide.',
          'Die Domäne ist persönliche Schutzausrüstung auf einer Baustelle, über sechs Klassen: Helm, Weste und Handschuhe, jeweils vorhanden oder fehlend. Die negativen Klassen sind der eigentliche Punkt. So ein System nützt nur, wenn es sagen kann, dass jemand keinen Helm trägt, und nicht bloß, dass irgendwo im Bild ein Helm liegt.',
        ],

        steps: [
          {
            title: 'Das Frontend sendet das Bild',
            body: 'React schickt die Datei als multipart/form-data, mit dem gewählten Modell in einem zweiten Feld. Wer beide anfordert, löst zwei parallele Anfragen aus, sodass der Vergleich über ein Bild in einem Moment läuft.',
          },
          {
            title: 'Das Gateway leitet sie weiter',
            body: 'NestJS ist die einzige Adresse, die das Frontend kennt. Es nimmt den Upload an und gibt ihn an den FastAPI-Service oder den ASP.NET-Core-Service weiter, wodurch sich die beiden ML-Services unabhängig vom Client ändern können.',
          },
          {
            title: 'Der Service führt die Inferenz aus',
            body: 'Python liest das Bild als RGB ein und übergibt es an YOLOv8m, wobei die geladenen Gewichte im Speicher bleiben, damit die .pt-Datei nicht bei jeder Anfrage neu gelesen wird. Die .NET-Seite konvertiert nach MLImage und wählt das ML.NET-Modell über seine Id.',
          },
          {
            title: 'Beide antworten in derselben Form',
            body: 'Klasse, Score und ein Rahmen als x1, y1, x2, y2, dazu die Modell-Id, der Annotationssatz, auf dem trainiert wurde, und die ursprünglichen Bildmaße. Die .NET-Seite begrenzt ihre Koordinaten zuerst auf diese Maße, damit ein Rahmen das Bild nie verlassen kann.',
          },
          {
            title: 'Das Frontend zeichnet es',
            body: 'Weil die Antwort in beiden Fällen identisch ist, gibt es in der Oberfläche keinen YOLO-Zweig und keinen ML.NET-Zweig. Sie skaliert die Koordinaten von der Originalgröße auf die angezeigte Größe und malt Rahmen, Klassen und Konfidenzwerte über das Bild.',
          },
        ],

        features: [
          {
            title: 'Ein Modell oder beide',
            body: 'Ein Service allein oder beide gleichzeitig in zwei Panels über demselben Bild, mit allen vier trainierten Modellen namentlich auswählbar.',
          },
          {
            title: 'Eine Konfidenzschwelle, die Sie einstellen',
            body: 'Ein Slider verbirgt alles unterhalb der Schwelle, so wie ein echter Betrieb nur auf Vorhersagen oberhalb einer Grenze reagiert und nicht auf alles, was das Modell zurückgibt.',
          },
          {
            title: 'Jede Erkennung, als Liste',
            body: 'Klasse und Score pro Erkennung, und wer eine auswählt, hebt sie im Bild heraus, womit sich eine Szene mit acht überlappenden Rahmen prüfen lässt.',
          },
          {
            title: 'Umriss, Füllung, Zoom und Pan',
            body: 'Rahmen als Umriss oder als gefüllte Fläche, eine Erkennung oder alle, und Zoom, um zu sehen, wo ein Rahmen wirklich sitzt und nicht nur ungefähr.',
          },
          {
            title: 'Die beiden Antworten nebeneinander',
            body: 'Dauer der Anfrage, Zahl der Erkennungen, mittlere Konfidenz, stärkste Erkennung und welcher Service zuerst geantwortet hat.',
          },
          {
            title: 'Health-Checks',
            body: 'Gateway, Python-API und .NET-API melden je Status und Antwortzeit, denn drei Prozesse fallen unabhängig voneinander aus, und ein leeres Panel sollte sagen, welcher.',
          },
        ],

        dataset: [
          'Der Datensatz wurde in Roboflow aus zwei öffentlichen Sätzen zusammengestellt, dann durchgesehen und zu einem vereint: 2.911 Bilder, aufgeteilt in 2.374 für das Training, 290 für die Validierung und 247 für den Test, automatisch ausgerichtet und auf 640x640 skaliert. Die Python-Seite nimmt ihn im YOLO-Format, die .NET-Seite im COCO-Format, weil Model Builder das für Erkennung erwartet: jedes Werkzeug bekommt das Format, das es will, über identische Bilder und identische Klassen.',
          'Und dann der Teil, den ich nicht geplant hatte. Der erste Durchgang hatte 8.813 Annotationen, ein erneuter Durchgang brachte ihn auf 17.942, was heißt, dass mehr als die Hälfte der Objekte nicht ausgezeichnet war. Ein Objekt, das im Bild vorhanden ist, in den Labels aber fehlt, lehrt das Modell im Training, dass es Hintergrund ist, und wird ihm in der Auswertung als Fehler angerechnet, wenn es es trotzdem erkennt.',
          'Beide Modelle wurden 50 Epochen bei 640x640 aus vortrainierten Gewichten trainiert, mit über beide Datensatzversionen konstant gehaltenen Parametern, damit ein Unterschied in den Ergebnissen als Unterschied in der Annotationsqualität und nicht in der Konfiguration zu lesen ist. Model Builder endet beim trainierten Modell, also brauchte die .NET-Seite einen eigenen Evaluation-Service: er lädt die COCO-Annotationen, sagt über den Validierungssatz vorher und berechnet Precision, Recall, F1 und mAP@0.5 samt Konfusionsmatrizen und Precision-Recall-Kurven, was ML.NET auf dieselbe Grundlage stellt wie das, was Ultralytics von sich aus ausgibt.',
        ],

        results: [
          'Die erneute Annotation hat jede Metrik beider Modelle bewegt. YOLOv8m ging von 0,790 auf 0,916 mAP@0.5 und ML.NET von 0,580 auf 0,748, relativ gesehen gewinnt also das schwächere Modell am meisten, 29 Prozent gegenüber 16. Der erste Durchgang hatte es am stärksten zurückgehalten.',
          'YOLOv8m liegt bei den Zahlen vorn, und der Abstand, auf den es ankommt, ist der Recall: 0,867 gegenüber 0,709 auf dem korrigierten Satz, bei nahezu gleicher Precision. Bei Schutzausrüstung ist genau diese Asymmetrie der ganze Punkt, denn eine verpasste Erkennung ist ein Mensch, den das System still als in Ordnung meldet, und die Precision allein kann Ihnen nicht sagen, dass das passiert ist.',
          'Der Vergleich hört dort auf, wo er ehrlich bleiben kann. Beide Modelle sahen eine Bilddomäne und sechs Klassen, und die Parameter blieben vergleichbar statt auf das jeweils Beste hin abgestimmt: das sind zwei Konfigurationen, gegeneinander gemessen, und nicht die Obergrenze des einen oder anderen Werkzeugs.',
        ],

        takeaway: [
          'Das Ergebnis lag mehr in den Daten als in der Wahl des Frameworks. Die Annotationen derselben 2.911 Bilder zu überarbeiten hat beide Modelle weiter bewegt als der Abstand zwischen den beiden Ökosystemen ML.NET bewegt hat, und das ist nicht der Schluss, den ich zu schreiben erwartet hatte.',
          'Die technische Hälfte ist praktischer. Python gab mir Raum zum Experimentieren und lieferte das Auswertungsmaterial gratis mit, .NET gab mir ein Modell, das ohne Brücke dazwischen in einen ASP.NET-Core-Service fällt, und die standardisierte Antwort ist der einzige Grund, warum ein Frontend sie als austauschbar behandeln kann.',
        ],
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
    body: 'Die Adresse ist möglicherweise falsch, oder die Seite wurde verschoben. Der Link unten führt zurück zum Anfang, und alles Weitere auf der Website ist einen Schritt davon entfernt.',
    cta: 'Zurück zur Startseite',
  },
};

export default de;
