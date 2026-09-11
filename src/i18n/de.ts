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
      'Backend-Entwickler in Niš, Serbien. Ich baue Services in Node.js (NestJS, Express), ereignisgetriebene Infrastruktur auf AWS und die React-Oberflächen davor.',
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
    games: 'Spiele',
    themeToggle: 'Design wechseln',
    language: 'Sprache',
  },

  hero: {
    positioning:
      'Backend-Entwickler bei Ncoded Solutions, in Niš. Ich baue Services in Node.js (NestJS, Express), und in .NET, wenn ein Kunde damit schon arbeitet, und bringe sie dann auf AWS: Container, Queues und die Events, die dazwischen laufen.',
    cta: 'Kontakt aufnehmen',
    portraitAlt: 'Porträt von Vuk Cvetković',
    portraitPlaceholder: 'Porträt',
  },

  about: {
    label: 'Über mich',
    paragraphs: [
      'Der größte Teil meiner Arbeit liegt im Backend. Ich entwerfe APIs und die Services dahinter, überwiegend in Node.js (NestJS, Express), und führe dieselbe Arbeit bis zu den React-Oberflächen darüber weiter, wenn ein Projekt das braucht.',
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
          'Backend-Services in Node.js (NestJS, Express): REST-APIs, JWT-Authentifizierung, rollenbasierte Zugriffskontrolle und Integrationen von Drittanbietern, über SQL- wie Dokumentdatenbanken.',
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
        'Arbeiten, über die ich vollständig schreiben kann, mit Architektur und Ergebnissen statt mit einem Screenshot. Jede bekommt ihre eigene Seite.',
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

    flowCaptions: {
      entry: 'Eingang',
      core: 'Orchestrierung',
      lane: 'Parallel',
      exit: 'Ausgabe',
    },

    stackGroups: {
      frontend: 'Frontend',
      gateway: 'Gateway',
      pythonService: 'Python-Service',
      dotnetService: '.NET-Service',
      data: 'Datensatz',
      client: 'Client',
      service: 'Service',
      interface: 'Oberfläche',
      capture: 'Mitschnitt lesen',
      charts: 'Diagramme',
      mobile: 'Mobile App',
      api: 'API',
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
          entry: 'React-Frontend',
          entryLabel: 'Bild, multipart/form-data',
          core: 'NestJS-Gateway',
          branches: [
            { title: 'FastAPI-Service', badge: 'Ultralytics YOLOv8m' },
            { title: 'ASP.NET-Core-Service', badge: 'ML.NET-Modell' },
          ],
          exit: '',
          exitLabel: 'Ein JSON-Format: Rahmen, Klassen, Konfidenz',
          exitNote: '',
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

        results: {
          columns: [
            'Modell',
            'Annotationen',
            'Precision',
            'Recall',
            'F1',
            'mAP@0.5',
            'mAP@0.5:0.95',
          ],
          rows: ['YOLOv8m', 'YOLOv8m', 'ML.NET', 'ML.NET'],
          notes: [
            'Die erneute Annotation hat jede Metrik beider Modelle bewegt. YOLOv8m ging von 0,790 auf 0,916 mAP@0.5 und ML.NET von 0,580 auf 0,748, relativ gesehen gewinnt also das schwächere Modell am meisten, 29 Prozent gegenüber 16. Der erste Durchgang hatte es am stärksten zurückgehalten.',
            'YOLOv8m liegt bei den Zahlen vorn, und der Abstand, auf den es ankommt, ist der Recall: 0,867 gegenüber 0,709 auf dem korrigierten Satz, bei nahezu gleicher Precision. Bei Schutzausrüstung ist genau diese Asymmetrie der ganze Punkt, denn eine verpasste Erkennung ist ein Mensch, den das System still als in Ordnung meldet, und die Precision allein kann Ihnen nicht sagen, dass das passiert ist.',
            'Die beiden Spalten lassen sich gegeneinander lesen, weil die Messung darauf angelegt war: eine Bilddomäne, dieselben sechs Klassen und über beide Modelle vergleichbar gehaltene Parameter statt getrennt abgestimmter. Das macht den Unterschied in den Zahlen zu einem Unterschied zwischen den Modellen und den Annotationen und zu nichts anderem.',
          ],
        },

        takeaway: [
          'Das Ergebnis lag mehr in den Daten als in der Wahl des Frameworks. Die Annotationen derselben 2.911 Bilder zu überarbeiten hat beide Modelle weiter bewegt als der Abstand zwischen den beiden Ökosystemen ML.NET bewegt hat, und das ist nicht der Schluss, den ich zu schreiben erwartet hatte.',
          'Die technische Hälfte ist praktischer. Python gab mir Raum zum Experimentieren und lieferte das Auswertungsmaterial gratis mit, .NET gab mir ein Modell, das ohne Brücke dazwischen in einen ASP.NET-Core-Service fällt, und die standardisierte Antwort ist der einzige Grund, warum ein Frontend sie als austauschbar behandeln kann.',
        ],
      },

      encryptix: {
        title: 'Encryptix',
        tagline:
          'Drei Verfahren hinter einem Service, und an beiden Enden ein Hash als Beweis, dass die Datei zurückgekommen ist.',
        description:
          'Meine Bachelorarbeit. Ein Desktop-Client übergibt einen ganzen Ordner an einen WCF-Service, der jede Datei mit AES, RC6 oder XXTEA verschlüsselt - die letzten beiden nach ihrer Spezifikation geschrieben statt aus einer Bibliothek genommen - und vor und nach jedem Durchgang einen SHA-512-Hash festhält, sodass der Rückweg bewiesen und nicht angenommen wird. Die Dateien parallel zu verarbeiten brachte einen Durchgang über 150 Dateien von 68,91 auf 44,16 Sekunden.',
        metaTitle: 'Encryptix - Vuk Cvetković',
        metaDescription:
          'Ein Projekt aus der Bachelorarbeit: ein Windows-Forms-Client und ein WCF-Service, die einen ganzen Ordner mit AES, RC6 oder XXTEA verschlüsseln, mit SHA-512-Prüfung an beiden Enden.',
        context: 'Bachelorarbeit, Fakultät für Elektronik in Niš',
        domain: 'Dateiverschlüsselung auf dem Desktop',

        flow: {
          entry: 'Ein Ordner, rekursiv in Bytes gelesen',
          entryLabel: '',
          core: 'WCF-Service',
          branches: [
            { title: 'AES', badge: 'CBC, aus der .NET-Bibliothek' },
            { title: 'RC6', badge: 'Von Hand geschrieben, 20 Runden' },
            { title: 'XXTEA', badge: 'Von Hand geschrieben, Feistel-Netzwerk' },
          ],
          exit: 'Eine verschlüsselte Datei je Eingabe',
          exitLabel: '',
          exitNote: 'SHA-512 vor und nach dem Durchgang',
        },

        overview: [
          'Die Arbeitseinheit ist hier ein Ordner, keine Datei. Sie zeigen der Anwendung ein Verzeichnis, sie liest alles darin und in jedem Unterordner, und dann läuft eines von drei symmetrischen Verfahren über den ganzen Satz - wobei der verschlüsselte Baum, der entschlüsselte Baum und das Hash-Protokoll jeweils dorthin geschrieben werden, wo Sie es wählen.',
          'Dass es drei sind, liegt daran, dass nur eines fertig mitkam. AES ist die Implementierung der .NET-Bibliothek, also das, was jede vernünftige Anwendung nutzen würde. RC6 und XXTEA sind aus ihren Spezifikationen gebaut, und darin bestand das Projekt eigentlich: die Schlüsselexpansion, das Auffüllen der Blöcke, die Rotationen und der bewusste Ganzzahlüberlauf, auf den XXTEA sich stützt.',
        ],

        steps: [
          {
            title: 'Der Client liest den Ordner',
            body: 'Ein Ordnerdialog, dann ein rekursiver Durchlauf, der jede Datei unabhängig von der Endung als rohe Bytes liest und Name, Endung, Verzeichnis und Inhalt als einen Datensatz zusammenhält. Nichts deutet die Datei, also nehmen eine .txt und eine .exe denselben Weg durch das Programm.',
          },
          {
            title: 'Ein Hintergrund-Task hält das Fenster lebendig',
            body: 'Windows Forms gibt der Anwendung einen Thread, und dieser Thread besitzt die Steuerelemente, sodass das Lesen eines großen Ordners darauf das Fenster einfrieren und genau die Ladeanzeige stoppen würde, die es zeigen soll. Das Lesen läuft deshalb als Task, und die Fortsetzung wird zurück auf den Synchronisationskontext des Formulars geplant, die einzige Stelle, von der aus die Schaltflächen legal wieder freigegeben werden können.',
          },
          {
            title: 'Die Liste geht an den Service',
            body: 'Der Client ruft den WCF-Service über HTTP. Beide Seiten mussten für die Datenmenge umkonfiguriert werden: die Puffergrenzen gehen auf den größten Wert, den ein int fassen kann, und der Übertragungsmodus wechselt von gepuffert auf gestreamt, sodass nur der Nachrichtenkopf gepuffert wird und nicht die ganze Dateiliste, mit zehn Minuten Zeitlimit auf jeder Seite.',
          },
          {
            title: 'Der Service verschlüsselt, Datei für Datei',
            body: 'Der gewählte Algorithmus bekommt die Liste, den Schlüssel und - bei AES - den Initialisierungsvektor. RC6 und XXTEA brauchen eine Eingabe, die ganze Blöcke füllt, also füllt jeder das Byte-Array auf seine Blockgröße auf und schreibt die ursprüngliche Länge in die ersten vier Bytes, und genau das erlaubt der Entschlüsselung, diese Auffüllung wieder abzuschneiden statt zu raten, wo die Datei endete.',
          },
          {
            title: 'Beide Enden werden gehasht',
            body: 'Jede Datei bekommt eine Textdatei daneben mit vier SHA-512-Zeilen: vor dem Verschlüsseln, nach dem Verschlüsseln, vor dem Entschlüsseln, nach dem Entschlüsseln. Die erste und die letzte sind die, auf die es ankommt, und sie müssen identisch sein. Das ist die ganze Integritätsaussage, und jeder kann sie prüfen, indem er die Datei öffnet.',
          },
        ],

        features: [
          {
            title: 'Ein ganzer Ordner auf einmal',
            body: 'Unterordner eingeschlossen, in jeder Tiefe. Der Ausgabebaum spiegelt den Eingabebaum, was aus der Differenz zwischen dem Pfad jeder Datei und der Wurzel kommt und nicht aus einem Mitzählen der Rekursion.',
          },
          {
            title: 'Drei Verfahren, ein Formular',
            body: 'AES mit einem Schlüssel aus 32 Zeichen und einem IV aus 16, RC6 und XXTEA mit Schlüsseln aus 16 Zeichen. Jedes hat sein eigenes Fenster, und jedes Feld wird geprüft, bevor irgendetwas geschrieben wird.',
          },
          {
            title: 'Der Beweis, dass sie zurück ist',
            body: 'Der SHA-512 des Klartexts vor dem Verschlüsseln gegen den SHA-512 des Klartexts nach dem Entschlüsseln. Gleich heißt, der Hin- und Rückweg war verlustfrei.',
          },
          {
            title: 'Sequenziell oder parallel',
            body: 'Beide Modi sind eingebaut, und ein Kontrollkästchen wählt zwischen ihnen. Der parallele Durchgang verteilt die Dateiliste auf eine parallele Schleife, und weil jede Datei für sich gelesen, umgewandelt und geschrieben wird, gibt es keine Konflikte zu lösen - er ist damit schneller fertig als eine Datei nach der anderen.',
          },
          {
            title: 'Ein Fortschrittsbalken, der mit der Arbeit fertig wird',
            body: 'Getaktet über die Gesamtzahl der Bytes, während der Service arbeitet, und über ein Cancellation Token in dem Moment gefüllt, in dem der eigentliche Aufruf zurückkehrt, sodass er dem Lauf folgt und mit ihm abschließt statt nach ihm.',
          },
          {
            title: 'Der Dateibaum vorab',
            body: 'Eine Baumansicht von allem, was geladen wurde, ausgeklappt, bevor man sich zum Verschlüsseln entscheidet. Vor allem nützlich, um zu merken, dass man den falschen Ordner gewählt hat.',
          },
        ],

        dataset: [],

        results: {
          columns: ['Modus', 'Dateien', 'Verschlüsselung (s)', 'Entschlüsselung (s)'],
          rows: ['Sequenziell', 'Parallel'],
          notes: [
            'Dieselben 150 Dateien, derselbe RC6-Schlüssel, dieselben Ausgabeordner, je ein Durchlauf. Das parallele Verschlüsseln war in 44,16 Sekunden fertig gegenüber 68,91, das Entschlüsseln in 40,39 gegenüber 70,13 - ein Drittel weniger in beide Richtungen.',
            'Der Gewinn kommt aus der Form der Arbeit. Dateien hängen hier nie voneinander ab, die Liste verteilt sich also auf eine parallele Schleife, ohne gemeinsamen Zustand zu schützen, ohne Konflikte zu lösen und ohne Reihenfolge zu bewahren, und keine Datei wartet auf die vorige. Deshalb nimmt die parallele Verarbeitung rund ein Drittel des ganzen Durchgangs weg und nicht ein paar Prozent.',
          ],
        },

        takeaway: [
          'Dafür war das Projekt da: zwei der drei Verfahren sind implementiert und nicht aufgerufen. Es sind kurze Algorithmen, bei denen fast jede Zeile Last trägt: in welche Richtung eine Rotation geht, wo die ursprüngliche Länge liegt, und die Tatsache, dass XXTEA verlangt, dass seine Arithmetik überläuft statt einen Fehler zu werfen. Die übereinstimmenden Hashes sind der Beweis, dass all das Byte für Byte aufgeht.',
          'Die andere Hälfte ist die Trennung in Client und Service. Weil die Verfahren hinter einem Service liegen, bleibt die Kryptografie außerhalb des Prozesses, der das Fenster zeichnet, und genau das erlaubt es, einen Ordner beliebiger Größe zu übergeben, ohne dass die Oberfläche stehen bleibt - und dieselben drei Algorithmen stehen allem anderen offen, das den Service aufrufen kann.',
        ],
      },

      networkTrafficAnalyzer: {
        title: 'Network Traffic Analyzer',
        tagline:
          'Ein Mitschnitt einmal gelesen, dann zwölf Fragen an jedes Paket darin gestellt.',
        description:
          'Eine Seminararbeit über Verkehrsanalyse, mit einer Desktop-Anwendung, die sie vorführt. Sie öffnet einen .pcapng-Mitschnitt über Pyshark, geht jedes Paket Schicht für Schicht durch und holt heraus, was jedes Protokoll trägt - HTTP-Header, DNS-Anfragen, TCP-Flags, FTP-Zugangsdaten - in einen aufklappbaren Baum, samt einem Diagramm der Protokollverteilung.',
        metaTitle: 'Network Traffic Analyzer - Vuk Cvetković',
        metaDescription:
          'Ein Projekt aus einer Seminararbeit in Python: eine Tkinter-Anwendung, die .pcapng-Mitschnitte über Pyshark liest, zwölf Protokolle je Paket auswertet und die Protokollverteilung zeichnet.',
        context: 'Seminararbeit, Fakultät für Elektronik in Niš',
        domain: 'Analyse von Paketmitschnitten',

        flow: {
          entry: 'Ein .pcapng-Mitschnitt',
          entryLabel: '',
          core: 'Pyshark, über Wiresharks tshark',
          branches: [
            { title: 'Anwendungsprotokolle', badge: 'HTTP, HTTPS, DNS, FTP, SMTP' },
            { title: 'Transport und Steuerung', badge: 'TCP, UDP, ICMP, ARP' },
            { title: 'Adressierung', badge: 'IP, Ethernet' },
          ],
          exit: 'Eine Zeile je Paket',
          exitLabel: '',
          exitNote: 'Aufklappbar, und in die Diagramme gezählt',
        },

        overview: [
          'Die Arbeit handelt davon, wie Netzwerkverkehr analysiert wird und warum sich das PCAP-Format als das durchgesetzt hat, auf das sich alle geeinigt haben. Die Anwendung ist der Teil, der funktionieren musste: man zeigt ihr einen Mitschnitt, und sie sagt, was wirklich darin steht, und nicht bloß, dass Pakete vorbeigekommen sind.',
          'Wireshark läuft darunter - Pyshark steuert dessen tshark - und das gibt dem Parsen seine Reichweite. Darauf aufbauend stellt die Anwendung jedem Paket der Datei denselben festen Satz Fragen und legt die Antworten an einer Stelle aus, was genau die Form ist, die man braucht, wenn man etwas sucht und noch nicht weiß, in welchem Paket es steckt.',
        ],

        steps: [
          {
            title: 'Der Mitschnitt wird einmal gelesen',
            body: 'Ein Dateidialog nimmt eine .pcapng oder .pcap, Pyshark öffnet sie, und alle Pakete wandern in eine Liste im Speicher, bevor die Datei geschlossen wird. Danach liest nichts die Datei erneut, und das macht die Filter günstig: sie laufen über die Liste statt den Mitschnitt neu zu parsen.',
          },
          {
            title: 'Jedes Paket wird Schicht für Schicht durchgegangen',
            body: 'Die Protokollnamen kommen aus dem Schichtenstapel des Pakets selbst und nicht aus einer Tabelle, sodass ein Paket meldet, was es tatsächlich enthält, und die Zählung am Ende echte Schichten zählt. Danach laufen zwölf Extraktoren der Reihe nach, und jeder fragt zuerst, ob sein Protokoll vorhanden ist, bevor er irgendetwas anfasst.',
          },
          {
            title: 'Jeder Extraktor fragt, bevor er liest',
            body: 'Ein Feld, das ein Paket nicht trägt, ist kein Fehler, sondern der Normalfall, also prüft jeder Extraktor das Vorhandensein jedes Attributs vor dem Lesen und lässt Fehlendes einfach weg. Deshalb ist der Baum ungleichmäßig: ein HTTP-Paket zeigt ein Dutzend Felder, das nächste zwei, und beides ist richtig.',
          },
          {
            title: 'Was im Klartext liegt, kommt im Klartext heraus',
            body: 'HTTP-Basic-Zugangsdaten sind base64 und keine Verschlüsselung, also dekodiert der Extraktor sie. FTP schickt Benutzername und Passwort als Text, also kommen die ebenfalls heraus. Das ist die ehrliche Vorführung, die die Arbeit wollte: nicht die Behauptung, diese Protokolle seien unsicher, sondern die dekodierte Zeichenkette, die in einem Baum vor Ihnen steht.',
          },
          {
            title: 'Die Ergebnisse landen in einem Baum und in Diagrammen',
            body: 'Jedes Paket wird eine Zeile - Zeitstempel, Quell- und Ziel-IP, Länge, Protokollliste - die sich in einen Knoten je Protokoll und ein Blatt je Feld aufklappt. Derselbe Durchgang liefert eine Zählung je Protokoll, die Matplotlib als Kreis- und Balkendiagramm direkt in das Fenster zeichnet.',
          },
        ],

        features: [
          {
            title: 'Zwölf Protokolle, je Paket',
            body: 'HTTP, HTTPS, DNS, FTP, SMTP, ARP, ICMP, IP, Ethernet, TCP, UDP und FPP, jedes mit eigenem Extraktor und eigenem Satz Felder.',
          },
          {
            title: 'Filter über fünf Kriterien',
            body: 'Ein Datums- und Zeitbereich, eine Quell-IP, eine Ziel-IP und eine durch Kommas getrennte Protokollliste. Eine leer gelassene Zeit deckt den ganzen Tag ab, von 00:00:00 bis 23:59:59.',
          },
          {
            title: 'Ein Baum, keine Textwand',
            body: 'Paket, dann Protokoll, dann Feld. Das Interessante liegt meist drei Klicks tiefer, und nichts zwingt dazu, an den Paketen vorbeizuscrollen, die nicht interessieren.',
          },
          {
            title: 'Protokollverteilung auf einen Blick',
            body: 'Ein Kreisdiagramm für den Anteil und ein Balkendiagramm für die Anzahl, bei jeder Filteranwendung neu gezeichnet, sodass sichtbar wird, was der Filter tatsächlich entfernt hat.',
          },
          {
            title: 'Zugangsdaten im Klartext, als solche gezeigt',
            body: 'Dekodierte HTTP-Basic-Authentifizierung und FTP-Benutzernamen und -Passwörter, das kürzestmögliche Argument dafür, diese Protokolle nicht unverschlüsselt zu verwenden.',
          },
          {
            title: 'Beide PCAP-Generationen',
            body: 'Der Dialog nimmt .pcapng und .pcap. Das neuere Format trägt mehr Metadaten und mehrere Schnittstellen und wird über denselben Code gelesen.',
          },
        ],

        dataset: [],

        results: {
          columns: [],
          rows: [],
          notes: [],
        },

        takeaway: [
          'Die Disziplin, die das Format erzwingt, ist der Grund, warum das mit jedem Mitschnitt funktioniert. Ein Paket verspricht nichts darüber, welche Felder es trägt, also ist jeder Zugriff abgesichert und ein fehlendes Feld ein normaler Ausgang statt eines Ausfalls. Die zwölf Extraktoren einzeln auszuschreiben hält genau das ausdrücklich, und deshalb gehen ein Mitschnitt mit zwei Paketen und einer mit zweitausend durch denselben Code, ohne einen einzigen Sonderfall.',
          'Dass der Mitschnitt einmal gelesen wird, ist der Grund, warum sich alles Weitere unmittelbar anfühlt. Jeder Filter, jede Neuzählung und jedes neu gezeichnete Diagramm arbeiten auf der Liste, die schon im Speicher liegt, sodass eine geänderte Datumsangabe oder IP-Adresse sofort eine neue Sicht auf denselben Mitschnitt liefert, ohne zurück in die Datei zu gehen.',
        ],
      },

      easyBreathe: {
        title: 'Easy Breathe',
        tagline:
          'Serbiens öffentliche Pollenmessungen, eingegrenzt auf die, die eine einzelne Person braucht.',
        description:
          'Eine mobile App auf offenen Verwaltungsdaten. Serbiens Umweltagentur veröffentlicht Pollenmessungen von Stationen im ganzen Land, und die App spiegelt sie nach Zeitplan in ihre eigene Datenbank, um sie dann auf die Allergene einzugrenzen, die eine Person ausgewählt hat, in einem Radius, den sie selbst wählt - auf einer Karte, nach Konzentrationsstufe, und als Push-Nachricht, wenn eine Stufe steigt.',
        metaTitle: 'Easy Breathe - Vuk Cvetković',
        metaDescription:
          'Eine React-Native- und Expo-App auf einer NestJS-API: Serbiens offene Pollendaten, nach Zeitplan gespiegelt und nach Ort, Radius und ausgewählten Allergenen gefiltert.',
        context: 'Seminararbeit über E-Government-Systeme, Fakultät für Elektronik in Niš',
        domain: 'Offene Verwaltungsdaten, Pollen und Allergene',

        flow: {
          entry: 'Fünf offene Endpunkte',
          entryLabel: '',
          core: 'Geplantes Einlesen',
          branches: [
            { title: 'Monatlich', badge: 'Allergene, Typen, Orte' },
            { title: 'Stündlich, 9 bis 12 Uhr', badge: 'Pollen, Konzentrationen' },
          ],
          exit: 'Eine Datenbank ohne Duplikate',
          exitLabel: '',
          exitNote: 'Eingegrenzt auf Radius, Tag und Ihre Allergene',
        },

        overview: [
          'Die öffentlichen Daten sind da und sie sind gut: Serbiens Umweltagentur veröffentlicht täglich Pollenmessungen von Messstationen im ganzen Land, als offene API ohne Schlüssel und ohne Limit. Was sie nicht leistet, ist einer Person mit Ambrosia-Allergie zu sagen, ob heute dort, wo sie gerade steht, ein schlechter Tag ist. Diese Lücke ist die ganze App.',
          'Die Arbeit teilt sich deshalb in zwei Hälften. Die API spiegelt die offenen Daten nach Zeitplan in ihre eigene Datenbank, denn ein Telefon soll nicht Hunderttausende landesweite Messungen durchblättern, um eine lokale Frage zu beantworten. Die App stellt dieser Spiegelung dann eine einzige Frage - was liegt in der Luft in meiner Nähe, von dem, worauf ich reagiere - und beantwortet sie auf einer Karte, in vier Stufen und in einer Nachricht.',
        ],

        steps: [
          {
            title: 'Die offenen Daten werden nach zwei Uhren gespiegelt',
            body: 'Die fünf Endpunkte ändern sich nicht im gleichen Tempo, also werden sie auch nicht im gleichen Tempo abgerufen. Allergene, Allergentypen und Orte werden am Ersten des Monats um neun eingelesen. Pollen und Konzentrationen, also das, was sich bewegt, werden stündlich zwischen neun und zwölf geholt, wenn die Messungen des Tages erscheinen.',
          },
          {
            title: 'Das Einlesen lässt sich gefahrlos wiederholen',
            body: 'Jeder Einleser sieht zuerst nach, welche Ids er schon hält, behält nur die fehlenden und fügt diese ein. Ein stündlicher Lauf, der nichts Neues findet, schreibt also nichts, derselbe Lauf lässt sich ohne doppelte Messung wiederholen, und das angefragte Fenster reicht eine Woche zurück - was eine Messung einfängt, die erst Tage nach der Erhebung veröffentlicht wurde.',
          },
          {
            title: 'Ein Ort und ein Radius werden zu einer Menge Stationen',
            body: 'Die Koordinaten der Person und ihr gewählter Radius in Kilometern gehen in eine geografische MongoDB-Abfrage, wobei der Radius durch den der Erde geteilt wird, um die von der Abfrage erwartete Kugel zu erhalten. Zurück kommt jede Messstation, die nah genug ist, um für diese Person zu zählen.',
          },
          {
            title: 'Stationen und ein Datum ergeben die Messungen, die zählen',
            body: 'Diese Stations-Ids und das heutige Datum wählen die Pollendatensätze des Tages aus, von denen jeder die Ids der mit ihm gemessenen Konzentrationen trägt. Diese Konzentrationen werden dann geholt und auf die tatsächlich ausgewählten Allergene gekürzt, sodass die Antwort nur Messungen enthält, die zugleich nah und relevant sind.',
          },
          {
            title: 'Jede Messung bekommt eine Stufe und einen Ort',
            body: 'Eine Zahl in der Luft sagt allein nichts, also wird jede Konzentration gegen die veröffentlichten Margen ihres eigenen Allergens verglichen und kommt als Low, Normal, High oder Very high heraus. Die Messung wird dann mit dem Allergen und der Station formatiert, von der sie kommt, und genau das zeigen der Kartenmarker und die Detailansicht.',
          },
        ],

        features: [
          {
            title: 'Eigene Allergene wählen',
            body: 'Rund dreißig sind veröffentlicht, und das Profil ist eine Mehrfachauswahl über alle. Alles Weitere - Karte, Stufen, Nachrichten - folgt dieser Liste.',
          },
          {
            title: 'Ihr Radius, Ihr Intervall',
            body: 'Der Suchradius in Kilometern und wie oft geprüft wird in Stunden, beides im Profil eingestellt. Das Intervall ist da, damit die Prüfung so häufig sein kann, wie jemand möchte, ohne dass der Akku darüber entscheidet.',
          },
          {
            title: 'Eine Karte, die man auf einen Blick liest',
            body: 'Marker auf den Messstationen in der Nähe, nach Stufe eingefärbt. Ein Tippen darauf listet, welche Ihrer Allergene dort gemessen wurden und wie hoch jedes lag.',
          },
          {
            title: 'Vier Stufen, mit Anzahl',
            body: 'Low, Normal, High und Very high, jede mit der Zahl der nahen Allergene auf dieser Stufe. Ein Tippen auf eine Stufe gibt die Liste, ein Tippen auf einen Eintrag die Station, die Beschreibung und den Messwert.',
          },
          {
            title: 'Eine Nachricht, wenn es steigt',
            body: 'Eine Push-Nachricht und ein Hinweis in der App, sobald etwas aus der gewählten Liste in der Nähe eine hohe Konzentration erreicht, sodass die App nützt, ohne geöffnet zu werden.',
          },
          {
            title: 'Konten, schlicht gehalten',
            body: 'Registrierung und Anmeldung per E-Mail, mit dem Profil, das Allergene, Radius und Intervall hält, sodass dieselbe Auswahl dem Konto folgt und nicht dem Telefon.',
          },
        ],

        dataset: [],

        results: {
          columns: [],
          rows: [],
          notes: [],
        },

        takeaway: [
          'Die Lektion, die geblieben ist: offene Daten sind nicht dasselbe wie nutzbare Daten. Fünf Endpunkte, die sich über Ids gegenseitig referenzieren, ein landesweiter Maßstab und keine Möglichkeit, eine geografische Frage zu stellen - der Wert liegt vollständig im Spiegeln und im Verknüpfen. Zu entscheiden, was kopiert wird, wie oft, und wie zweimaliges Kopieren harmlos bleibt, da lag die eigentliche Ingenieursarbeit.',
          'Die andere Hälfte ist, dass die Antwort ankommen muss, ohne erfragt zu werden. Wer eine Allergie hat, öffnet keine App zum Nachsehen - er will es gesagt bekommen, in einem Radius und Intervall, das einmal eingestellt wird. Push-Nachrichten auf einem geplant arbeitenden Backend sind das, was einen öffentlichen Datensatz in etwas verwandelt, das eine Person an dem Tag erreicht, an dem es zählt.',
        ],
      },
    },
  },

  games: {
    label: 'Spiele',

    index: {
      metaTitle: 'Spiele - Vuk Cvetković',
      metaDescription:
        'Browserspiele von Vuk Cvetković: 2048, Minesweeper und ein Spiel, in dem Welten zu größeren verschmelzen. Jedes bekommt eine eigene Seite.',
      heading: 'Spiele',
      intro:
        'Spiele, die mehr als eine Runde wert sind. Jedes hat eine eigene Seite, und darunter einen Text dazu, wie es gebaut ist, für alle die das auch wissen wollen.',
    },

    items: {
      twentyFortyEight: {
        name: '2048',

        /** One line, for the card on the index. */
        tagline:
          'Schiebe das Brett, und jede Kachel rutscht so weit sie kann. Zwei gleiche Zahlen werden zu einer doppelten, bis hinauf zu 2048.',

        metaDescription:
          "Das Kachelspiel. Das Brett schieben, gleiche Zahlen verschmelzen, und eine einzelne Kachel mit 2048 erreichen.",
        lead: "Schiebe das Brett in eine beliebige Richtung und jede Kachel rutscht so weit sie kann. Zwei gleiche Zahlen verschmelzen zu einer doppelten, und das Ziel ist eine einzelne Kachel mit 2048.",

        score: "Punkte",
        best: "Bestwert",
        highest: "Größte Kachel",
        newGame: "Neues Spiel",
        undo: "Rückgängig",
        hint: "Pfeiltasten oder WASD, am Telefon wischen.",

        won: {
          title: "2048",
          body: "Die Kachel liegt auf dem Brett. Hier muss aber nicht Schluss sein - das Spiel läuft, solange sich etwas bewegen lässt.",
          keepGoing: "Weiterspielen",
        },

        over: {
          title: "Kein Zug mehr",
          body: "Das Brett ist voll und nichts passt zu seinem Nachbarn. Ein Schritt zurück steht noch offen, falls der letzte Zug den Ausschlag gegeben hat.",
          restart: "Nochmal spielen",
        },

        how: {
          label: "So wird gespielt",
          items: [
            {
              title: "Du schiebst das ganze Brett",
              description:
                "Pfeiltasten oder WASD auf der Tastatur, am Telefon ein Wisch in eine beliebige Richtung. Jede Kachel legt in einem Zug die ganze mögliche Strecke zurück, nicht ein Feld.",
            },
            {
              title: "Gleiche Zahlen verschmelzen",
              description:
                "Zwei Kacheln mit derselben Zahl werden zu einer doppelten. Eine gerade verschmolzene Kachel ist für diesen Zug fertig, eine Reihe aus vier 2en ergibt also zwei 4en und keine 8.",
            },
            {
              title: "Nach jedem Zug eine neue Kachel",
              description:
                "Sie erscheint auf einem freien Feld und ist in neun von zehn Fällen eine 2. Ein Schub, der nichts verändert, ist kein Zug: es kommt nichts dazu, und ein Versuch kostet nichts.",
            },
            {
              title: "Nimm eine Ecke und bleib dort",
              description:
                "Halte die größte Kachel in einer Ecke und schiebe nie von ihr weg. Der größere Teil des Spiels besteht darin, den Zug abzulehnen, der sie herausholt.",
            },
          ],
        },

        close: {
          label: "Wie es gebaut ist",
          paragraphs: [
            "Kein Canvas und keine Spielbibliothek. Eine Kachel ist ein Element mit zwei benutzerdefinierten Eigenschaften, ihre Position ist ein Translate gegen ihre eigene Größe, und das Gleiten setzt der Browser zusammen. Daher kommt die Weichheit: ein Zug ändert eine Transformation und sonst nichts, kein Teil davon läuft durch das Layout.",
            "Die andere Hälfte ist, dass jede Kachel ihr Element behält, solange es sie gibt. Das Brett wird nie aus dem Zustand neu gezeichnet - ein Zug aktualisiert Zahlen auf Knoten, die schon da sind, und deshalb legt eine Kachel den Weg sichtbar zurück, statt zu verschwinden und anderswo wieder aufzutauchen.",
            "Die Zahlen sind Text, also so scharf wie der Rest der Seite und in der Größe, die der Leser eingestellt hat. Die Farben sind Tokens im selben Stylesheet wie alles andere, und deshalb antwortet das Brett auf den Themenschalter im Kopf.",
            "Die Eingabe läuft aus drei Richtungen durch eine einzige Funktion, damit Taste, Wisch und Tipp nicht anfangen, leicht Verschiedenes zu bedeuten. Die Pfeiltasten gehören dem Brett nur, solange es im Bild ist, und ein Zug, der vor der Landung des vorigen kommt, wird gehalten statt verworfen - deshalb kostet schnelles Spielen nie einen Zug.",
          ],
        },
      },

      minesweeper: {
        name: 'Minesweeper',

        tagline:
          'Öffne jedes Feld, das keine Mine ist. Jede Zahl zählt die Minen, die sie berühren, und der Rest wird daraus hergeleitet.',

        metaDescription:
          'Minesweeper im Browser, auf den Brettern Anfänger, Fortgeschritten und Experte, mit einem ersten Klick, der nicht verlieren kann.',
        lead: 'Öffne jedes Feld, das keine Mine ist. Eine Zahl sagt, wie viele der acht Felder um sie herum vermint sind, und alles Weitere folgt daraus. Drei Bretter in den Größen, mit denen das Original ausgeliefert wurde, und ein erster Klick, der nicht verlieren kann.',

        boards: 'Brett',
        levels: {
          beginner: 'Anfänger',
          intermediate: 'Fortgeschritten',
          expert: 'Experte',
        },

        mines: 'Minen',
        time: 'Zeit',
        best: 'Bestzeit',
        newGame: 'Neues Spiel',
        flagMode: 'Fahnen',
        hint: 'Drücken öffnet, Rechtsklick oder F setzt eine Fahne, am Telefon langes Drücken. Eine fertige Zahl öffnet den Rest ihrer Umgebung per Druck oder mit der mittleren Taste.',

        gridLabel: 'Minenfeld',
        cells: {
          hidden: 'Verdeckt',
          flagged: 'Fahne',
          mine: 'Mine',
          empty: 'Leer',
          wrong: 'Falsche Fahne',
        },

        won: {
          title: 'Geräumt',
          body: 'Jedes Feld, das keine Mine war, ist offen.',
          record: 'Eine neue Bestzeit auf diesem Brett.',
          again: 'Nochmal spielen',
        },

        lost: {
          title: 'Mine',
          body: 'Das Feld wird so gezeigt, wie es war. Eine Fahne auf einem leeren Feld ist markiert, und dort ist die Überlegung meistens abgebogen.',
          again: 'Nochmal versuchen',
        },

        how: {
          label: 'So wird gespielt',
          items: [
            {
              title: 'Der erste Klick ist sicher',
              description:
                'Die Minen werden erst danach gelegt, rund um die gedrückte Stelle. Der erste Zug kann also nicht verlieren und öffnet immer freies Feld. Fang irgendwo an.',
            },
            {
              title: 'Eine Zahl zählt ihre Nachbarn',
              description:
                'Sie sagt, wie viele der acht angrenzenden Felder eine Mine tragen. Ein Feld ohne Mine in der Nachbarschaft öffnet die ganze Region mit einem Druck.',
            },
            {
              title: 'Markiere, was du hergeleitet hast',
              description:
                'Rechtsklick am Rechner, F auf der Tastatur, langes Drücken am Telefon. Langes Drücken setzt nur, ein langsamer Finger kann also nicht wegnehmen, was er gerade gesetzt hat - weggenommen wird im Fahnenmodus, und den willst du ohnehin, wenn gleich mehrere anstehen. Der Zähler zeigt Minen minus Fahnen.',
            },
            {
              title: 'Drücke eine Zahl, die fertig ist',
              description:
                'Sobald eine Zahl so viele Fahnen um sich hat, wie sie angibt, öffnet ein Druck auf sie den Rest ihrer Umgebung auf einmal, und die mittlere Taste tut dasselbe. Halte die Taste gedrückt, und die Felder, die aufgingen, gehen mit ihr nach unten - du siehst die acht, bevor du dich festlegst. Daher kommt das Tempo in diesem Spiel, und die meisten finden es nie.',
            },
          ],
        },

        close: {
          label: 'Wie es gebaut ist',
          paragraphs: [
            'Kein Canvas und keine Spielbibliothek, und anders als beim anderen Spiel hier auch keine Bewegung. Es gibt keine Schleife und nichts im Flug: ein Feld ist ein Button, es wechselt den Zustand oder eben nicht, und das ganze Brett sind in Expertengröße vierhundertachtzig davon. Was es im Betrieb kostet, ist eine Klasse auf einem Element.',
            'Die Minen werden beim ersten Druck gelegt statt zu Beginn, um das gedrückte Feld und die acht angrenzenden herum. Ein vorab verteiltes Feld muss entweder den ersten Zug verlieren lassen, was ein Münzwurf ist und kein Spiel, oder so lange neu verteilen, bis es das nicht mehr tut, was die Wahrscheinlichkeiten überall sonst still verbiegt. Spätes Legen ergibt ein ehrliches Feld und einen ersten Zug, der immer eine Region öffnet.',
            'Eine Region zu öffnen ist eine Warteschlange und keine Rekursion, die ein Telefon bei vierhundert Ebenen Tiefe zu Recht ablehnen darf, und diese Warteschlange liefert der Animation ihr Timing gleich mit: der Ring, auf dem ein Feld gefunden wurde, ist sein Abstand zum Druck, also wartet jedes so viele Schritte, bevor es aufgeht. Das Öffnen kommt als etwas, das sich nach außen ausbreitet, statt als Brett, das auf einmal umspringt, und es kostet eine benutzerdefinierte Eigenschaft und eine Verzögerung.',
            'Das Brett ist ein echtes Grid: Zeilen, Zellen, eine Zeilen- und Spaltenzahl, und genau ein Feld in der Tabulatorfolge, damit die Pfeiltasten es abgehen statt der Tabulatortaste. Dafür ist dieses Spiel hier. Das andere muss vor dem Screenreader versteckt und über eine Live-Region beschrieben werden, weil sechzehn Kacheln, die sich bei jedem Tastendruck neu schreiben, nicht lesbar sind. Ein Minenfeld ist eine Tabelle, die stillhält und wartet, und genau dafür gibt es ein Grid.',
          ],
        },
      },
      accretion: {
        name: 'Akkretion',

        tagline:
          'Lass Himmelskörper fallen. Zwei gleiche werden zum nächsten, vom Mond bis hinauf zur Sonne.',

        metaDescription:
          'Ein Verschmelzungsspiel im Browser: Himmelskörper fallen lassen, und zwei gleiche werden zum nächsten, vom Mond bis zur Sonne.',
        lead: 'Lass einen Himmelskörper fallen. Zwei gleiche verschmelzen zum nächsten, vom Mond über die Planeten bis zur Sonne, und der Raum füllt sich, ob du bereit bist oder nicht.',

        score: 'Punkte',
        best: 'Bestwert',
        next: 'Als Nächstes',
        newGame: 'Neues Spiel',
        hint: 'Bewegen zum Zielen, drücken zum Loslassen. Die Pfeiltasten zielen, die Leertaste lässt los.',
        sequence: 'Die Reihe, von der kleinsten zur größten',

        planets: [
          'Mond',
          'Merkur',
          'Mars',
          'Venus',
          'Erde',
          'Neptun',
          'Uranus',
          'Saturn',
          'Jupiter',
          'Sonne',
        ],

        won: {
          title: 'Ein Stern',
          body: 'Die Reihe hat kein Weiter mehr. Zwei Sonnen können nichts werden, also gehen sie stattdessen hoch, und der Platz, den sie hinterlassen, ist die einzige Art, wie ein voller Raum je wieder leer wird.',
          keepGoing: 'Weiterspielen',
        },

        over: {
          title: 'Kein Platz mehr',
          body: 'Etwas liegt zu lange über der Linie. Hier gibt es keine Decke, nur eine Linie, und ein Körper, der darüber zur Ruhe kommt, hat kein Weiter.',
          restart: 'Nochmal spielen',
        },

        how: {
          label: 'So wird gespielt',
          items: [
            {
              title: 'Zielen, dann loslassen',
              description:
                'Über den Rand bewegen, um einen Körper auszurichten, und drücken, um ihn fallen zu lassen. Es kommen nur die fünf kleinsten, alles jenseits der Erde muss also gebaut werden.',
            },
            {
              title: 'Zwei gleiche berühren sich und verschmelzen',
              description:
                'Sie müssen nicht gedrückt oder gehalten werden: sobald zwei gleiche Körper aneinander zur Ruhe kommen, werden sie die nächste Stufe, und eine Verschmelzung neben einer anderen löst eine Kette aus.',
            },
            {
              title: 'In die Breite bauen, nicht in die Höhe',
              description:
                'Ein Körper, der auf einen hohen Haufen fällt, rollt, und wo er landet, ist nicht, wohin gezielt wurde. Die großen unten zu halten ist der größere Teil des Spiels, denn genau sie haben kein Weiter.',
            },
            {
              title: 'Die Linie ist eine Frist, keine Wand',
              description:
                'Nichts hindert einen Körper daran, darüber zu gehen. Vorbei ist es erst, wenn eine Sekunde später noch etwas dort oben liegt: ein Aufspritzen übersteht man, ein dort liegen gebliebener Jupiter nicht.',
            },
          ],
        },

        close: {
          label: 'Wie es gebaut ist',
          paragraphs: [
            'Kein Canvas, keine Physikbibliothek und überhaupt keine Abhängigkeit. Ein Körper ist ein div mit einem Eckenradius, seine Farbe ist ein Verlauf im selben Stylesheet wie der Rest der Seite, und das Bild schreibt eine Transformation auf jeden einzelnen. Deshalb skalieren die Planeten mit der Seite, bleiben in jedem Zoom scharf und kosten keine Anfrage. Eine Physik-Engine wäre sechsmal so schwer wie diese ganze Seite.',
            'Der Solver arbeitet über Positionen: ein Körper merkt sich, wo er ist und wo er war, und der Abstand dazwischen ist seine Geschwindigkeit. Nichts berechnet einen Impuls. Ein Kontakt drückt zwei Körper auseinander, und weil die vorige Position stehen bleibt, nimmt dieses Auseinanderdrücken genau die Geschwindigkeit heraus, die sie zusammengebracht hat - und das ist ein unelastischer Stoß. Vierzig solcher Durchgänge laufen pro Bild, jeder gegen Positionen, die sich schon bewegt haben, und ein voller Raum mit sechsundvierzig Körpern kostet unter einem Zehntel einer Millisekunde bei einem Budget von fast siebzehn.',
            'Die Arbeit war, es zur Ruhe zu bringen. Drei getrennte Dinge fügten still Energie hinzu, statt sie zu entziehen: eine Wand, die die Position eines Körpers begrenzte, ohne die vorige mitzunehmen, wodurch die Tiefe einer Landung zur Geschwindigkeit eines Abprallers wurde; tangentiale Reibung, berechnet aus einer Geschwindigkeit, die derselbe Durchgang gerade änderte, weshalb ein dichter Haufen nach acht Sekunden immer noch Körper herumwarf; und eine Verschmelzungsregel, die so viel Überlappung verlangte, dass überhaupt nie etwas verschmolz. Jedes davon wurde durch Messen gefunden und nicht durch Lesen, und die Zahlen, die dabei herauskamen, stehen neben den Konstanten, die sie begründen.',
            'Die Simulation läuft in ihrem eigenen Raum aus tausend Einheiten und erfährt nie, wie groß sie gezeigt wird. Eine Transformation auf einem Element bringt den ganzen Raum auf die Breite, die die Seite ihm gegeben hat, eine Größenänderung ändert also diese eine Zahl und sonst nichts - keinen Radius, keine Position, keinen Schritt. Deshalb spielt sich dasselbe Spiel auf dem Telefon genau wie am Rechner, statt auf einem von beiden die doppelte Schwerkraft zu haben.',
          ],
        },
      },
    },
  },

  services: {
    label: 'Womit ich helfen kann',
    items: [
      {
        title: 'Backend- und API-Entwicklung',
        description:
          'Services und APIs in Node.js (NestJS, Express) oder .NET: Datenmodellierung, Authentifizierung, Integrationen von Drittanbietern und die Tests, die das Ganze ehrlich halten.',
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
