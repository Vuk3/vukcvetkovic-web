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
    title: 'Vuk Cvetković - Software Engineer',
    description:
      'Software Engineer in Niš, Serbien. Vom Backend bis zum Frontend: Node.js (NestJS, Express), Deployment und ereignisgetriebene Kommunikation auf AWS, React.',
    ogImageAlt: 'Vuk Cvetković, Software Engineer',
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
    // English, as German tech writes it: "Ingenieur" is a protected title in Germany.
    role: 'Software Engineer',
    positioning:
      'Ich arbeite am ganzen Produkt, vom Datenmodell bis in die Produktion. Das Backend schreibe ich in Node.js (NestJS, Express) und .NET. Auf AWS kümmere ich mich um das Deployment und die ereignisgetriebene Kommunikation zwischen den Services, und alles, was der Nutzer sieht, baue ich in React.',
    cta: 'Kontakt aufnehmen',
    portraitAlt: 'Porträt von Vuk Cvetković',
    portraitPlaceholder: 'Porträt',
  },

  about: {
    label: 'Über mich',
    paragraphs: [
      'Ich arbeite an Kundenprojekten vom ersten Datenmodell bis zum Deployment auf AWS. Dabei fange ich immer bei der Domäne an: welche Daten es gibt, wer darauf zugreifen darf und mit welchen Systemen sie sprechen müssen. Daraus ergeben sich die API, die Services und die React-Oberfläche.',
      'Ich habe einen Master in Software Engineering. In meiner Masterarbeit habe ich zwei Machine-Learning-Ökosysteme anhand derselben Aufgabe verglichen: ein YOLOv8m-Modell in Python und ein ML.NET-Modell in .NET, beide hinter einem gemeinsamen NestJS-Gateway und einem React-Frontend. Für meine Bachelorarbeit habe ich die Verschlüsselungsverfahren RC6 und XXTEA nach ihren Spezifikationen implementiert.',
      'Das beste Beispiel für meine Frontend-Arbeit ist diese Website selbst: vier Sprachen und fünf Spiele, geschrieben ohne Canvas und ohne Spielbibliothek. Zu jedem Spiel gibt es einen Text darüber, wie es gebaut ist.',
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
          'Backend-Services in Node.js (NestJS, Express): REST-APIs, JWT-Authentifizierung, rollenbasierte Zugriffskontrolle und Integrationen mit Drittanbietern, mit SQL- und Dokumentdatenbanken.',
          'Dieselbe Arbeit in .NET, wo ein Kunde bereits damit arbeitet, nach Clean Architecture aufgebaut, damit die Geschäftslogik vom Framework getrennt bleibt.',
          'Auf AWS: S3, ECS, EC2, Lambda, Route 53 und EventBridge, für Deployments und die ereignisgetriebene Kommunikation zwischen den Services.',
        ],
      },
      novateq: {
        role: 'Full-Stack-Entwickler',
        bullets: [
          'Backend-Services in .NET Web API und die Firmenwebsite in ASP.NET MVC, beides nach den Anforderungen einzelner Kunden angepasst.',
          'Die Sportsbook-Plattform stabil gehalten und dafür eingehende Störungen abgearbeitet, außerdem Casino-Spielprojekte durchgesehen, um zu verstehen, wie dieser Bereich gebaut ist.',
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
        'Projekte von Vuk Cvetković, Software Engineer in Niš: was jedes System tut, wie es gebaut ist und was dabei herauskam.',
      heading: 'Projekte',
      intro:
        'Arbeiten, die ich ausführlich beschreiben kann: mit Architektur und Ergebnissen statt eines Screenshots. Jede hat eine eigene Seite.',
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
      capture: 'Mitschnitt',
      charts: 'Diagramme',
      mobile: 'Mobile App',
      api: 'API',
    },

    items: {
      objectDetection: {
        title: 'Vergleichendes System zur Objekterkennung',
        tagline: 'Ein Bild, zwei Machine-Learning-Ökosysteme, eine Antwort im selben Format.',
        description:
          'Meine Masterarbeit. Dasselbe Bild läuft durch ein YOLOv8m-Modell in Python und ein ML.NET-Modell in .NET. Beide liegen hinter einem Gateway, das immer im selben Format antwortet, sodass ein einziges React-Frontend beide Ergebnisse darstellt. Nach der Neuannotation des Datensatzes erreichte YOLOv8m 0,916 mAP@0.5, ML.NET 0,748.',
        metaTitle: 'Vergleichendes System zur Objekterkennung - Vuk Cvetković',
        metaDescription:
          'Ein System aus meiner Masterarbeit: YOLOv8m in Python und ML.NET in .NET hinter einem NestJS-Gateway, verglichen anhand desselben Datensatzes zu Schutzausrüstung.',
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
          'Die Masterarbeit geht der Frage nach, was sich ändert, wenn dieselbe Erkennungsaufgabe zweimal umgesetzt wird: einmal in Python, wie in der Forschung üblich, und einmal in .NET, auf dem das Backend ohnehin läuft. Das System trainiert ein YOLOv8m-Modell und ein ML.NET-Modell auf denselben annotierten Bildern, stellt beide hinter eine gemeinsame API und schickt ein Bild durch eines der beiden oder durch beide.',
          'Es geht um persönliche Schutzausrüstung auf der Baustelle, in sechs Klassen: Helm, Weste und Handschuhe, jeweils vorhanden oder fehlend. Entscheidend sind die negativen Klassen. So ein System nützt nur, wenn es erkennt, dass jemand keinen Helm trägt, und nicht bloß, dass irgendwo im Bild ein Helm zu sehen ist.',
        ],

        steps: [
          {
            title: 'Das Frontend sendet das Bild',
            body: 'React schickt die Datei als multipart/form-data, das gewählte Modell steht in einem zweiten Feld. Sind beide Modelle gewählt, gehen die zwei Anfragen parallel hinaus, und verglichen wird dasselbe Bild im selben Moment.',
          },
          {
            title: 'Das Gateway leitet es weiter',
            body: 'NestJS ist die einzige Adresse, die das Frontend kennt. Das Gateway nimmt den Upload an und gibt ihn an den FastAPI-Service oder den ASP.NET-Core-Service weiter. So können sich die beiden ML-Services unabhängig vom Client ändern.',
          },
          {
            title: 'Der Service führt die Inferenz aus',
            body: 'Python liest das Bild als RGB ein und übergibt es an YOLOv8m. Die geladenen Gewichte bleiben im Speicher, damit die .pt-Datei nicht bei jeder Anfrage neu gelesen wird. Die .NET-Seite konvertiert das Bild in ein MLImage und wählt das ML.NET-Modell anhand seiner Id.',
          },
          {
            title: 'Beide antworten in derselben Form',
            body: 'Klasse, Score und ein Rahmen als x1, y1, x2, y2, dazu die Modell-Id, der Annotationssatz, auf dem trainiert wurde, und die ursprünglichen Bildmaße. Die .NET-Seite begrenzt ihre Koordinaten zuerst auf diese Maße, damit ein Rahmen das Bild nie verlassen kann.',
          },
          {
            title: 'Das Frontend zeichnet es',
            body: 'Die Antwort ist in beiden Fällen gleich aufgebaut, deshalb gibt es in der Oberfläche keinen YOLO-Zweig und keinen ML.NET-Zweig. Das Frontend rechnet die Koordinaten von der Originalgröße auf die angezeigte Größe um und zeichnet Rahmen, Klassen und Konfidenzwerte über das Bild.',
          },
        ],

        features: [
          {
            title: 'Ein Modell oder beide',
            body: 'Ein Service allein oder beide gleichzeitig, in zwei Panels über demselben Bild. Alle vier trainierten Modelle lassen sich namentlich auswählen.',
          },
          {
            title: 'Eine Konfidenzschwelle, die Sie einstellen',
            body: 'Ein Schieberegler blendet alles unterhalb der Schwelle aus, so wie ein System im echten Einsatz nur auf Vorhersagen oberhalb eines Grenzwerts reagiert und nicht auf alles, was das Modell liefert.',
          },
          {
            title: 'Alle Erkennungen als Liste',
            body: 'Klasse und Score je Erkennung. Eine ausgewählte Erkennung wird im Bild freigestellt, und so lässt sich auch eine Szene mit acht überlappenden Rahmen prüfen.',
          },
          {
            title: 'Umriss, Füllung, Zoom und Pan',
            body: 'Rahmen als Umriss oder als gefüllte Fläche, eine Erkennung oder alle, dazu Zoom und Pan, um einen Rahmen mit den Pixeln darunter abzugleichen.',
          },
          {
            title: 'Die beiden Antworten nebeneinander',
            body: 'Dauer der Anfrage, Zahl der Erkennungen, mittlere Konfidenz, stärkste Erkennung und welcher Service zuerst geantwortet hat.',
          },
          {
            title: 'Health-Checks',
            body: 'Gateway, Python-API und .NET-API melden jeweils Status und Antwortzeit, denn drei Prozesse können unabhängig voneinander ausfallen, und bei einem leeren Panel soll erkennbar sein, welcher es ist.',
          },
        ],

        dataset: [
          'Der Datensatz entstand in Roboflow aus zwei öffentlichen Datensätzen, die geprüft und zusammengeführt wurden: 2.911 Bilder, davon 2.374 für das Training, 290 für die Validierung und 247 für den Test, automatisch ausgerichtet und auf 640x640 skaliert. Die Python-Seite bekommt ihn im YOLO-Format, die .NET-Seite im COCO-Format, weil Model Builder dieses Format für die Objekterkennung erwartet. So hat jedes Werkzeug sein Format, bei identischen Bildern und identischen Klassen.',
          'Dann kam der Teil, den ich nicht eingeplant hatte. Nach dem ersten Durchgang gab es 8.813 Annotationen, eine zweite Durchsicht brachte die Zahl auf 17.942. Mehr als die Hälfte der Objekte war also nicht gelabelt. Ein Objekt, das im Bild vorhanden ist, in den Labels aber fehlt, bringt dem Modell im Training bei, dass es Hintergrund ist, und zählt in der Auswertung als Fehler, wenn das Modell es trotzdem erkennt.',
          'Beide Modelle wurden ausgehend von vortrainierten Gewichten 50 Epochen lang bei 640x640 trainiert. Die Parameter blieben über beide Datensatzversionen gleich, damit sich ein Unterschied in den Ergebnissen auf die Annotationsqualität zurückführen lässt und nicht auf die Konfiguration. Model Builder hört beim trainierten Modell auf, deshalb brauchte die .NET-Seite einen eigenen Evaluation-Service: Er lädt die COCO-Annotationen, erstellt Vorhersagen für den Validierungssatz und berechnet Precision, Recall, F1 und mAP@0.5 samt Konfusionsmatrizen und Precision-Recall-Kurven. Damit steht ML.NET auf derselben Grundlage wie die Ausgabe, die Ultralytics von sich aus liefert.',
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
            'Die Neuannotation hat bei beiden Modellen jede Metrik verändert. YOLOv8m stieg von 0,790 auf 0,916 mAP@0.5, ML.NET von 0,580 auf 0,748. Relativ gesehen hat also das schwächere Modell am meisten gewonnen, 29 Prozent gegenüber 16. Der erste Durchgang hatte es am stärksten ausgebremst.',
            'YOLOv8m liegt in den Zahlen vorn, und am wichtigsten ist der Abstand beim Recall: 0,867 gegenüber 0,709 auf dem korrigierten Datensatz, bei nahezu gleicher Precision. Bei Schutzausrüstung kommt es genau auf diese Asymmetrie an, denn eine verpasste Erkennung ist ein Mensch, den das System stillschweigend als in Ordnung meldet, und an der Precision allein sieht man nicht, dass das passiert ist.',
            'Der Vergleich ist fair, weil der Aufbau auf beiden Seiten gleich war: eine Bilddomäne, dieselben sechs Klassen und vergleichbare Parameter statt einer getrennten Abstimmung für jedes Modell.',
          ],
        },

        takeaway: [
          'Über das Ergebnis haben eher die Daten entschieden als die Wahl des Frameworks. Die Annotationen derselben 2.911 Bilder zu überarbeiten, hat beide Modelle weiter vorangebracht, als der Abstand zwischen den beiden Ökosystemen ML.NET zurückgeworfen hat, und mit diesem Fazit hatte ich nicht gerechnet.',
          'Das technische Fazit ist praktischer. Python ließ mir Raum zum Experimentieren und lieferte das Auswertungsmaterial gleich mit, .NET lieferte ein Modell, das sich ohne Zwischenschicht in einen ASP.NET-Core-Service einfügt, und nur wegen der einheitlichen Antwort kann ein einziges Frontend die beiden als austauschbar behandeln.',
        ],
      },

      encryptix: {
        title: 'Encryptix',
        tagline:
          'Drei Verschlüsselungsverfahren hinter einem Service und ein Hash an beiden Enden als Beweis, dass die Datei unverändert zurückkommt.',
        description:
          'Meine Bachelorarbeit. Ein Desktop-Client übergibt einen ganzen Ordner an einen WCF-Service, der jede Datei mit AES, RC6 oder XXTEA verschlüsselt. RC6 und XXTEA habe ich nach ihrer Spezifikation selbst implementiert, statt sie aus einer Bibliothek zu übernehmen. Vor und nach jedem Durchgang wird ein SHA-512-Hash festgehalten, damit sich nachweisen lässt, dass der Hin- und Rückweg verlustfrei war. Parallel verarbeitet, dauerte ein Durchgang über 150 Dateien 44,16 statt 68,91 Sekunden.',
        metaTitle: 'Encryptix - Vuk Cvetković',
        metaDescription:
          'Ein Projekt aus der Bachelorarbeit: ein Windows-Forms-Client und ein WCF-Service, die einen ganzen Ordner mit AES, RC6 oder XXTEA verschlüsseln, mit SHA-512-Prüfung an beiden Enden.',
        context: 'Bachelorarbeit, Fakultät für Elektronik in Niš',
        domain: 'Dateiverschlüsselung auf dem Desktop',

        flow: {
          entry: 'Ein Ordner, rekursiv als Bytes gelesen',
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
          'Encryptix arbeitet mit ganzen Ordnern statt mit einzelnen Dateien. Sie wählen ein Verzeichnis, die Anwendung liest alles darin samt Unterordnern, und dann läuft eines von drei symmetrischen Verfahren über den gesamten Inhalt. Den verschlüsselten Baum, den entschlüsselten Baum und das Hash-Protokoll schreibt sie jeweils an einen Ort Ihrer Wahl.',
          'Von den drei Verfahren kam nur eines fertig mit. AES ist die Implementierung aus der .NET-Bibliothek, wie sie jede vernünftige Anwendung verwenden würde. RC6 und XXTEA sind nach ihren Spezifikationen gebaut, und darin lag die eigentliche Arbeit: die Schlüsselexpansion, das Auffüllen der Blöcke, die Rotationen und der bewusste Ganzzahlüberlauf, auf dem XXTEA beruht.',
        ],

        steps: [
          {
            title: 'Der Client liest den Ordner',
            body: 'Ein Ordnerdialog, dann ein rekursiver Durchlauf, der jede Datei unabhängig von der Endung als rohe Bytes liest und Name, Endung, Verzeichnis und Inhalt als einen Datensatz zusammenhält. Der Inhalt wird nirgends interpretiert, eine .txt und eine .exe nehmen also denselben Weg durch das Programm.',
          },
          {
            title: 'Ein Hintergrund-Task hält das Fenster reaktionsfähig',
            body: 'Windows Forms gibt der Anwendung einen einzigen Thread, und diesem Thread gehören die Steuerelemente. Würde ein großer Ordner auf ihm gelesen, fröre das Fenster ein, und mit ihm die Ladeanzeige, die währenddessen laufen soll. Das Lesen läuft deshalb als Task, und die Fortsetzung läuft wieder im Synchronisationskontext des Formulars, denn nur von dort aus dürfen die Schaltflächen erneut freigegeben werden.',
          },
          {
            title: 'Die Liste geht an den Service',
            body: 'Der Client ruft den WCF-Service über HTTP auf. Für diese Datenmenge mussten beide Seiten umkonfiguriert werden: Die Puffergrenzen stehen auf dem größten Wert, den ein int fassen kann, und der Übertragungsmodus ist von gepuffert auf gestreamt umgestellt, sodass nur der Nachrichtenkopf gepuffert wird und nicht die ganze Dateiliste. Das Zeitlimit liegt auf beiden Seiten bei zehn Minuten.',
          },
          {
            title: 'Der Service verschlüsselt, Datei für Datei',
            body: 'Der gewählte Algorithmus bekommt die Liste, den Schlüssel und - bei AES - den Initialisierungsvektor. RC6 und XXTEA arbeiten nur mit vollen Blöcken, deshalb füllt jedes der beiden Verfahren das Byte-Array auf seine Blockgröße auf und schreibt die ursprüngliche Länge in die ersten vier Bytes. So kann die Entschlüsselung die Auffüllung wieder abschneiden, statt raten zu müssen, wo die Datei endete.',
          },
          {
            title: 'Beide Enden werden gehasht',
            body: 'Neben jeder Datei liegt eine Textdatei mit vier SHA-512-Zeilen: vor dem Verschlüsseln, nach dem Verschlüsseln, vor dem Entschlüsseln, nach dem Entschlüsseln. Entscheidend sind die erste und die letzte, und sie müssen identisch sein. Darin besteht die ganze Integritätsprüfung, und wer die Textdatei öffnet, kann sie selbst nachvollziehen.',
          },
        ],

        features: [
          {
            title: 'Ein ganzer Ordner auf einmal',
            body: 'Unterordner eingeschlossen, in beliebiger Tiefe. Der Ausgabebaum bildet den Eingabebaum nach. Die Struktur ergibt sich aus dem Pfad jeder Datei relativ zum Wurzelordner, nicht aus einem Mitzählen der Rekursion.',
          },
          {
            title: 'Drei Verfahren, ein Formular',
            body: 'AES mit einem Schlüssel aus 32 Zeichen und einem IV aus 16, RC6 und XXTEA mit Schlüsseln aus 16 Zeichen. Jedes hat sein eigenes Fenster, und jedes Feld wird geprüft, bevor irgendetwas geschrieben wird.',
          },
          {
            title: 'Der Beweis, dass nichts verloren ging',
            body: 'Der SHA-512 des Klartexts vor dem Verschlüsseln, verglichen mit dem SHA-512 des Klartexts nach dem Entschlüsseln. Stimmen beide überein, war der Hin- und Rückweg verlustfrei.',
          },
          {
            title: 'Sequenziell oder parallel',
            body: 'Beide Modi sind eingebaut, ein Kontrollkästchen schaltet zwischen ihnen um. Im parallelen Modus wird die Dateiliste auf eine parallele Schleife verteilt, und weil keine Datei von einer anderen abhängt, muss nichts gesperrt oder zusammengeführt werden. Was das bringt, zeigen die Ergebnisse unten.',
          },
          {
            title: 'Ein Fortschrittsbalken, der mit der Arbeit fertig wird',
            body: 'Während der Service arbeitet, richtet sich der Balken nach der Gesamtzahl der Bytes. Kehrt der eigentliche Aufruf zurück, füllt ihn ein Cancellation Token sofort auf, sodass er dem Lauf folgt und mit ihm fertig wird, nicht erst danach.',
          },
          {
            title: 'Der Dateibaum vorab',
            body: 'Eine Baumansicht von allem, was geladen wurde, vollständig ausgeklappt, damit Sie vor dem Start prüfen können, was verschlüsselt wird.',
          },
        ],

        dataset: [],

        results: {
          columns: ['Modus', 'Dateien', 'Verschlüsselung (s)', 'Entschlüsselung (s)'],
          rows: ['Sequenziell', 'Parallel'],
          notes: [
            'Dieselben 150 Dateien, derselbe RC6-Schlüssel, dieselben Ausgabeordner, in jedem Modus ein Durchlauf. Parallel dauerte das Verschlüsseln 44,16 statt 68,91 Sekunden, das Entschlüsseln 40,39 statt 70,13 - in beide Richtungen ein Drittel weniger.',
            'Der Gewinn kommt daher, dass die Dateien unabhängig voneinander sind: Die parallele Schleife braucht weder Sperren noch eine Reihenfolge, und keine Datei wartet auf die vorige.',
          ],
        },

        takeaway: [
          'Der eigentliche Zweck des Projekts war, zwei der drei Verfahren selbst zu implementieren, statt sie nur aufzurufen. Es sind kurze Algorithmen, in denen fast jede Zeile zählt: in welche Richtung eine Rotation geht, wo die ursprüngliche Länge steht und dass die Arithmetik bei XXTEA überlaufen muss, statt eine Ausnahme auszulösen. Die übereinstimmenden Hashes belegen, dass all das Byte für Byte stimmt.',
          'Dazu kommt die Trennung in Client und Service. Die Kryptografie läuft im Service und nicht in dem Prozess, der das Fenster zeichnet, und dieselben drei Algorithmen stehen jedem Programm zur Verfügung, das den Service aufrufen kann.',
        ],
      },

      networkTrafficAnalyzer: {
        title: 'Network Traffic Analyzer',
        tagline:
          'Ein Mitschnitt, einmal gelesen, und zwölf Fragen an jedes Paket darin.',
        description:
          'Eine Seminararbeit über die Analyse von Netzwerkverkehr, mit einer Desktop-Anwendung als praktischem Teil. Die Anwendung öffnet einen .pcapng-Mitschnitt über Pyshark, geht jedes Paket Schicht für Schicht durch und zeigt in einem aufklappbaren Baum, was jedes Protokoll enthält, etwa HTTP-Header, DNS-Anfragen, TCP-Flags und FTP-Zugangsdaten. Dazu kommt ein Diagramm der Protokollverteilung.',
        metaTitle: 'Network Traffic Analyzer - Vuk Cvetković',
        metaDescription:
          'Ein Projekt aus einer Seminararbeit in Python: eine Tkinter-Anwendung, die .pcapng-Mitschnitte über Pyshark liest, zwölf Protokolle je Paket auswertet und die Protokollverteilung grafisch darstellt.',
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
          exitNote: 'Aufklappbar und in den Diagrammen gezählt',
        },

        overview: [
          'Die Arbeit behandelt, wie Netzwerkverkehr analysiert wird und warum PCAP dafür zum Standardformat wurde. Die Anwendung setzt das praktisch um: Nach dem Öffnen eines Mitschnitts zeigt sie, was jedes Paket enthält, Protokoll für Protokoll.',
          'Darunter arbeitet Wireshark: Pyshark steuert dessen tshark, und daher kommt die Breite beim Parsen. Darauf aufbauend stellt die Anwendung jedem Paket der Datei dieselben festen Fragen und zeigt alle Antworten an einer Stelle. Genau das braucht man, wenn man etwas sucht und noch nicht weiß, in welchem Paket es steckt.',
        ],

        steps: [
          {
            title: 'Der Mitschnitt wird einmal gelesen',
            body: 'Ein Dateidialog nimmt eine .pcapng- oder .pcap-Datei entgegen, Pyshark öffnet sie, und alle Pakete landen in einer Liste im Speicher, bevor die Datei geschlossen wird. Danach wird die Datei nicht mehr gelesen, deshalb kosten die Filter kaum etwas: Sie laufen über die Liste, statt den Mitschnitt neu zu parsen.',
          },
          {
            title: 'Jedes Paket wird Schicht für Schicht durchgegangen',
            body: 'Die Protokollnamen kommen aus dem Schichtenstapel des Pakets selbst und nicht aus einer Nachschlagetabelle. So meldet jedes Paket, was es tatsächlich enthält, und die Zählung am Ende erfasst echte Schichten. Danach laufen zwölf Extraktoren nacheinander, und jeder prüft zuerst, ob sein Protokoll vorhanden ist, bevor er irgendetwas anfasst.',
          },
          {
            title: 'Jeder Extraktor fragt, bevor er liest',
            body: 'Dass einem Paket ein Feld fehlt, ist kein Fehler, sondern der Normalfall. Deshalb prüft jeder Extraktor vor dem Lesen, ob ein Attribut existiert, und lässt Fehlendes einfach weg. Darum ist der Baum ungleichmäßig: Ein HTTP-Paket zeigt ein Dutzend Felder, das nächste zwei, und beides stimmt.',
          },
          {
            title: 'Was im Klartext übertragen wird, erscheint im Klartext',
            body: 'HTTP-Basic-Zugangsdaten sind nur base64-kodiert, nicht verschlüsselt, also dekodiert der Extraktor sie. FTP schickt Benutzername und Passwort als Klartext, also erscheinen auch sie. So zeigt die Arbeit, wie unsicher diese Protokolle sind: Die dekodierte Zeichenkette steht im Baum vor Ihnen.',
          },
          {
            title: 'Die Ergebnisse landen in einem Baum und in Diagrammen',
            body: 'Jedes Paket wird zu einer Zeile mit Zeitstempel, Quell- und Ziel-IP, Länge und Protokollliste, die sich in einen Knoten je Protokoll und ein Blatt je Feld aufklappen lässt. Derselbe Durchgang liefert die Anzahl je Protokoll, die Matplotlib als Kreis- und Balkendiagramm direkt ins Fenster zeichnet.',
          },
        ],

        features: [
          {
            title: 'Zwölf Protokolle, je Paket',
            body: 'HTTP, HTTPS, DNS, FTP, SMTP, ARP, ICMP, IP, Ethernet, TCP, UDP und FPP, jedes mit eigenem Extraktor und eigenen Feldern.',
          },
          {
            title: 'Filter nach fünf Kriterien',
            body: 'Ein Datums- und Zeitbereich, eine Quell-IP, eine Ziel-IP und eine durch Kommas getrennte Protokollliste. Bleibt die Uhrzeit leer, gilt der ganze Tag, von 00:00:00 bis 23:59:59.',
          },
          {
            title: 'Ein Baum, keine Textwand',
            body: 'Paket, dann Protokoll, dann Feld, und jede Ebene erscheint erst, wenn Sie sie aufklappen. So bleibt auch ein Mitschnitt mit Tausenden Paketen übersichtlich.',
          },
          {
            title: 'Protokollverteilung auf einen Blick',
            body: 'Ein Kreisdiagramm für die Anteile und ein Balkendiagramm für die Anzahl, bei jedem Filtern neu gezeichnet, sodass sichtbar wird, was ein Filter tatsächlich entfernt hat.',
          },
          {
            title: 'Zugangsdaten im Klartext, als solche gezeigt',
            body: 'Dekodierte HTTP-Basic-Zugangsdaten sowie FTP-Benutzernamen und -Passwörter: das kürzeste Argument dagegen, diese Protokolle unverschlüsselt zu verwenden.',
          },
          {
            title: 'Beide PCAP-Generationen',
            body: 'Der Dialog akzeptiert .pcapng und .pcap. Das neuere Format enthält mehr Metadaten und kann mehrere Schnittstellen abbilden, gelesen wird es vom selben Code.',
          },
        ],

        dataset: [],

        results: {
          columns: [],
          rows: [],
          notes: [],
        },

        takeaway: [
          'Dass die Anwendung mit jedem Mitschnitt funktioniert, liegt an der Disziplin, die das Format erzwingt. Ein Paket garantiert nicht, welche Felder es enthält, also ist jeder Zugriff abgesichert, und ein fehlendes Feld ist ein normales Ergebnis und kein Fehler. Weil die zwölf Extraktoren einzeln ausgeschrieben sind, bleibt das überall sichtbar, und deshalb laufen ein Mitschnitt mit zwei Paketen und einer mit zweitausend ohne einen einzigen Sonderfall durch denselben Code.',
          'Weil der Mitschnitt nur einmal gelesen wird, reagiert alles Weitere sofort. Jeder Filter, jede Neuzählung und jedes neu gezeichnete Diagramm arbeitet mit der Liste, die schon im Speicher liegt. Ändert man ein Datum oder eine IP-Adresse, erscheint gleich eine neue Ansicht desselben Mitschnitts, ohne dass die Datei erneut gelesen wird.',
        ],
      },

      easyBreathe: {
        title: 'Easy Breathe',
        tagline:
          'Serbiens öffentliche Pollenmessungen, gefiltert auf das, was eine einzelne Person wissen muss.',
        description:
          'Eine mobile App auf Basis offener Verwaltungsdaten. Serbiens Umweltagentur veröffentlicht Pollenmessungen von Stationen im ganzen Land. Die App spiegelt sie nach Zeitplan in eine eigene Datenbank und filtert sie auf die Allergene, die eine Person ausgewählt hat, in einem Radius, den sie selbst festlegt. Die Ergebnisse erscheinen auf einer Karte, nach Konzentrationsstufen geordnet, und als Push-Nachricht, wenn eine Stufe steigt.',
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
          'Die öffentlichen Daten sind vorhanden, und sie sind gut: Serbiens Umweltagentur veröffentlicht täglich Pollenmessungen von Messstationen im ganzen Land, als offene API ohne Schlüssel und ohne Limit. Was die API nicht kann: einer Person mit Ambrosia-Allergie sagen, ob heute dort, wo sie gerade ist, ein schlechter Tag ist. Genau diese Lücke schließt die App.',
          'Die Arbeit teilt sich deshalb in zwei Teile. Die eigene API spiegelt die offenen Daten nach Zeitplan in ihre Datenbank, denn ein Smartphone soll nicht Hunderttausende landesweite Messungen durchgehen, um eine lokale Frage zu beantworten. Die App stellt dieser Kopie dann eine einzige Frage: Welche meiner Allergene sind gerade in meiner Nähe in der Luft? Die Antwort kommt auf einer Karte, in vier Stufen und als Nachricht.',
        ],

        steps: [
          {
            title: 'Die offenen Daten werden in zwei Takten gespiegelt',
            body: 'Die fünf Endpunkte ändern sich unterschiedlich schnell, also werden sie auch unterschiedlich oft abgerufen. Allergene, Allergentypen und Orte werden am Ersten jedes Monats um neun Uhr eingelesen. Pollen und Konzentrationen, die sich laufend ändern, werden zwischen neun und zwölf Uhr stündlich geholt, denn in dieser Zeit erscheinen die Messungen des Tages.',
          },
          {
            title: 'Das Einlesen lässt sich gefahrlos wiederholen',
            body: 'Jeder Einlesejob prüft zuerst, welche Ids schon in der Datenbank liegen, und fügt nur die fehlenden ein. Ein stündlicher Lauf, der nichts Neues findet, schreibt also nichts, derselbe Lauf lässt sich ohne doppelte Messungen wiederholen, und das abgefragte Zeitfenster reicht eine Woche zurück. So kommt auch eine Messung an, die erst einige Tage nach der Erhebung veröffentlicht wurde.',
          },
          {
            title: 'Aus Ort und Radius wird eine Auswahl von Stationen',
            body: 'Die Koordinaten der Person und der gewählte Radius in Kilometern gehen in eine Geo-Abfrage in MongoDB. Der Radius wird dafür durch den Erdradius geteilt, weil die Kugelabfrage ihn in dieser Form erwartet. Zurück kommt jede Messstation, die nah genug liegt, um für diese Person relevant zu sein.',
          },
          {
            title: 'Aus Stationen und Datum werden die relevanten Messungen',
            body: 'Mit diesen Stations-Ids und dem heutigen Datum werden die Pollendatensätze des Tages ausgewählt, und jeder davon enthält die Ids der zugehörigen Konzentrationen. Diese Konzentrationen werden geladen und auf die Allergene reduziert, die die Person tatsächlich ausgewählt hat. Die Antwort enthält also nur Messungen, die in der Nähe liegen und relevant sind.',
          },
          {
            title: 'Jede Messung bekommt eine Stufe und einen Ort',
            body: 'Ein Messwert allein sagt nichts, deshalb wird jede Konzentration mit den veröffentlichten Grenzwerten ihres Allergens verglichen und als Low, Normal, High oder Very high eingestuft. Anschließend wird die Messung zusammen mit dem Allergen und der Station aufbereitet, von der sie stammt, und genau das zeigen der Kartenmarker und die Detailansicht.',
          },
        ],

        features: [
          {
            title: 'Eigene Allergene wählen',
            body: 'Rund dreißig sind veröffentlicht, und im Profil lassen sich beliebig viele davon auswählen. Alles Weitere - Karte, Stufen, Nachrichten - richtet sich nach dieser Liste.',
          },
          {
            title: 'Ihr Radius, Ihr Intervall',
            body: 'Der Suchradius in Kilometern und das Prüfintervall in Stunden, beides im Profil eingestellt. Ein kürzeres Intervall bringt aktuellere Hinweise, ein längeres schont den Akku.',
          },
          {
            title: 'Eine Karte, die sich auf einen Blick lesen lässt',
            body: 'Marker auf den Messstationen in der Nähe, nach Stufe eingefärbt. Ein Tipp auf einen Marker zeigt, welche Ihrer Allergene dort gemessen wurden und wie hoch die Werte waren.',
          },
          {
            title: 'Vier Stufen, mit Anzahl',
            body: 'Low, Normal, High und Very high, jeweils mit der Zahl der Allergene in der Nähe, die auf dieser Stufe liegen. Ein Tipp auf eine Stufe öffnet die Liste, ein Tipp auf einen Eintrag zeigt Station, Beschreibung und Messwert.',
          },
          {
            title: 'Eine Nachricht, wenn die Belastung steigt',
            body: 'Eine Push-Nachricht und ein Hinweis in der App, sobald etwas aus der gewählten Liste in der Nähe eine hohe Konzentration erreicht, sodass die App auch dann nützt, wenn sie geschlossen ist.',
          },
          {
            title: 'Konten, schlicht gehalten',
            body: 'Registrierung und Anmeldung per E-Mail. Allergene, Radius und Intervall liegen im Profil, sodass die Auswahl am Konto hängt und nicht am Smartphone.',
          },
        ],

        dataset: [],

        results: {
          columns: [],
          rows: [],
          notes: [],
        },

        takeaway: [
          'Was hängen geblieben ist: Offene Daten sind noch keine nutzbaren Daten. Die API liefert fünf Endpunkte, die sich gegenseitig über Ids referenzieren, Daten für das ganze Land und keine Möglichkeit, geografisch abzufragen. Der ganze Nutzen entsteht also erst beim Spiegeln und Verknüpfen. Die eigentliche Arbeit lag in den Entscheidungen, was kopiert wird, wie oft und wie ein doppelter Durchlauf harmlos bleibt.',
          'Außerdem muss die Antwort kommen, ohne dass jemand danach fragt. Wer eine Allergie hat, öffnet keine App, um nachzusehen. Er will benachrichtigt werden, in einem Radius und Intervall, die er einmal einstellt. Erst Push-Nachrichten auf einem Backend, das nach Zeitplan arbeitet, bringen die öffentlichen Daten an dem Tag zu einer Person, an dem es darauf ankommt.',
        ],
      },
    },
  },

  games: {
    label: 'Spiele',

    /** "Erstellt" rather than "Gebaut": it is what German says of a piece of
     *  software that was written, not of a thing that was assembled. See the
     *  note in en.ts. */
    built: 'Erstellt:',

    sound: 'Ton',

    /** Both are the loanwords German already uses for this. See the note in
     *  en.ts. */
    status: {
      live: 'Live',
      beta: 'Beta',
    },

    index: {
      metaTitle: 'Spiele - Vuk Cvetković',
      metaDescription:
        'Browserspiele von Vuk Cvetković: 2048, Minesweeper, Memory in zwölf Leveln, Schiffe versenken gegen vier Gegner und ein Spiel, in dem Welten zu größeren verschmelzen. Jedes hat eine eigene Seite.',
      heading: 'Spiele',
      intro:
        'Spiele, die mehr als eine Runde wert sind. Jedes hat eine eigene Seite, und darunter steht für alle, die es interessiert, wie es gebaut ist.',
    },

    items: {
      twentyFortyEight: {
        name: '2048',

        /** One line, for the card on the index. */
        tagline:
          'Schiebe das Brett, und jede Kachel rutscht so weit wie möglich. Aus zwei gleichen Zahlen wird eine doppelt so große, bis hinauf zu 2048.',

        metaDescription:
          "Das Kachelspiel: das Brett schieben, gleiche Zahlen verschmelzen und eine einzelne Kachel mit 2048 erreichen.",
        lead: "Schiebe das Brett in eine beliebige Richtung, und jede Kachel rutscht so weit wie möglich. Zwei gleiche Zahlen verschmelzen zu einer doppelt so großen, und das Ziel ist eine einzelne Kachel mit 2048.",

        score: "Punkte",
        best: "Bestwert",
        highest: "Größte Kachel",
        newGame: "Neues Spiel",
        undo: "Rückgängig",
        hint: "Pfeiltasten oder WASD, am Smartphone wischen.",

        won: {
          title: "2048",
          body: "Die Kachel liegt auf dem Brett. Hier muss aber nicht Schluss sein - das Spiel läuft, solange sich etwas bewegen lässt.",
          keepGoing: "Weiterspielen",
        },

        over: {
          title: "Kein Zug mehr",
          body: "Das Brett ist voll, und keine zwei benachbarten Kacheln passen zusammen. Einen Zug kannst du noch zurücknehmen, falls es am letzten lag.",
          restart: "Nochmal spielen",
        },

        how: {
          label: "So wird gespielt",
          items: [
            {
              title: "Schiebe das ganze Brett",
              description:
                "Pfeiltasten oder WASD auf der Tastatur, am Smartphone ein Wisch in eine beliebige Richtung. Jede Kachel rutscht in einem Zug so weit wie möglich, nicht nur ein Feld.",
            },
            {
              title: "Gleiche Zahlen verschmelzen",
              description:
                "Zwei Kacheln mit derselben Zahl werden zu einer mit doppeltem Wert. Eine gerade entstandene Kachel verschmilzt im selben Zug nicht noch einmal, eine Reihe aus vier 2en ergibt also zwei 4en und keine 8.",
            },
            {
              title: "Nach jedem Zug eine neue Kachel",
              description:
                "Sie erscheint auf einem freien Feld und ist in neun von zehn Fällen eine 2. Ein Schieben, das nichts verändert, zählt nicht als Zug: Es kommt keine neue Kachel dazu, und der Versuch kostet nichts.",
            },
            {
              title: "Such dir eine Ecke und bleib dort",
              description:
                "Halte die größte Kachel in einer Ecke und schiebe nie von ihr weg. Der größte Teil des Spiels besteht darin, den Zug nicht zu machen, der sie dort herausholt.",
            },
          ],
        },

        close: {
          label: "Wie es gebaut ist",
          paragraphs: [
            "Kein Canvas und keine Spielbibliothek. Eine Kachel ist ein Element mit zwei benutzerdefinierten Eigenschaften, ihre Position ist ein translate relativ zu ihrer eigenen Größe, und das Gleiten übernimmt der Browser beim Compositing. Daher läuft es so flüssig: Ein Zug ändert eine Transformation und sonst nichts, und nichts davon geht durch das Layout.",
            "Außerdem behält jede Kachel ihr Element, solange es sie gibt. Das Brett wird nie aus dem Zustand neu gerendert: Ein Zug ändert nur die Zahlen auf Knoten, die schon da sind. Deshalb sieht man eine Kachel ihren Weg zurücklegen, statt dass sie verschwindet und anderswo wieder auftaucht.",
            "Die Zahlen sind Text, also so scharf wie der Rest der Seite, und sie wachsen mit der Schriftgröße, die der Leser eingestellt hat. Die Farben sind Tokens im selben Stylesheet wie alles andere, deshalb folgt das Brett dem Design-Schalter in der Kopfzeile.",
            "Alle drei Eingabewege laufen durch eine einzige Funktion, damit Taste, Wisch und Tipp nicht allmählich leicht Verschiedenes bedeuten. Die Pfeiltasten gehören dem Brett nur, solange es sichtbar ist, und ein Zug, der kommt, bevor der vorige fertig ist, wird vorgemerkt statt verworfen. Deshalb verliert man auch beim schnellen Spielen nie einen Zug.",
          ],
        },
      },

      minesweeper: {
        name: 'Minesweeper',

        tagline:
          'Öffne jedes Feld, das keine Mine ist. Jede Zahl gibt an, wie viele Minen an ihr Feld grenzen, und alles andere ergibt sich daraus.',

        metaDescription:
          'Minesweeper im Browser, in den Stufen Anfänger, Fortgeschritten und Experte, und der erste Klick ist immer sicher.',
        lead: 'Öffne jedes Feld, das keine Mine ist. Eine Zahl sagt, wie viele der acht Felder um sie herum vermint sind, und alles Weitere folgt daraus. Drei Bretter in den Größen des Originals, und der erste Klick ist immer sicher.',

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
        hint: 'Drücken öffnet ein Feld, Rechtsklick oder F setzt eine Fahne, am Smartphone geht das mit langem Drücken. Hat eine Zahl alle ihre Fahnen, öffnet ein Druck auf sie oder die mittlere Maustaste den Rest ihrer Umgebung.',

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
          body: 'Das Minenfeld wird aufgedeckt, wie es war. Falsch gesetzte Fahnen sind markiert, und meistens lag genau dort der Denkfehler.',
          again: 'Nochmal versuchen',
        },

        how: {
          label: 'So wird gespielt',
          items: [
            {
              title: 'Der erste Klick ist sicher',
              description:
                'Die Minen werden erst danach gelegt, und zwar so, dass die gedrückte Stelle frei bleibt. Der erste Zug kann also nicht verlieren und öffnet immer eine freie Fläche. Fang irgendwo an.',
            },
            {
              title: 'Eine Zahl zählt ihre Nachbarn',
              description:
                'Sie gibt an, wie viele der acht angrenzenden Felder eine Mine enthalten. Ein Feld ohne Minen ringsum öffnet mit einem Druck die ganze Fläche um sich herum.',
            },
            {
              title: 'Markiere, was du herausgefunden hast',
              description:
                'Rechtsklick am Rechner, F auf der Tastatur, langes Drücken am Smartphone. Langes Drücken setzt immer nur eine Fahne, ein langsamer Finger kann also nicht gleich wieder entfernen, was er gerade gesetzt hat. Entfernt wird im Fahnenmodus, und den willst du ohnehin, wenn mehrere Fahnen auf einmal anstehen. Der Zähler zeigt Minen minus Fahnen.',
            },
            {
              title: 'Drücke auf eine erfüllte Zahl',
              description:
                'Sobald um eine Zahl so viele Fahnen liegen, wie sie angibt, öffnet ein Druck auf sie den Rest ihrer Umgebung auf einmal, und die mittlere Maustaste macht dasselbe. Hältst du die Taste gedrückt, erscheinen die Felder, die aufgehen würden, schon eingedrückt, und du siehst alle acht, bevor du dich festlegst. Darin liegt das Tempo dieses Spiels, und die meisten entdecken es nie.',
            },
          ],
        },

        close: {
          label: 'Wie es gebaut ist',
          paragraphs: [
            'Kein Canvas und keine Spielbibliothek, und anders als bei 2048 auch keine Bewegung. Es gibt keine Schleife und nichts, was sich gerade bewegt: Ein Feld ist ein Button, der seinen Zustand wechselt oder eben nicht, und in der Expertengröße besteht das Brett aus vierhundertachtzig davon. Zur Laufzeit kostet es eine Klasse auf einem Element.',
            'Die Minen werden erst beim ersten Druck gelegt, nicht schon zu Beginn, und zwar außerhalb des gedrückten Feldes und seiner acht Nachbarn. Wer die Minen vorab verteilt, muss entweder den ersten Zug verlieren lassen, was ein Münzwurf ist und kein Spiel, oder so lange neu verteilen, bis das nicht mehr passiert, und das verzerrt unbemerkt die Wahrscheinlichkeiten auf dem restlichen Feld. Werden die Minen spät gelegt, bleibt das Feld fair, und der erste Zug öffnet immer eine ganze Fläche.',
            'Eine Fläche wird über eine Warteschlange geöffnet, nicht rekursiv, denn eine Rekursion mit vierhundert Ebenen darf ein Smartphone zu Recht verweigern. Die Warteschlange liefert der Animation das Timing gleich mit: Der Ring, auf dem ein Feld gefunden wurde, ist sein Abstand zum gedrückten Feld, also wartet jedes Feld entsprechend viele Schritte, bevor es aufgeht. So breitet sich das Öffnen nach außen aus, statt dass das ganze Brett auf einmal umspringt, und das kostet eine benutzerdefinierte Eigenschaft und eine Verzögerung.',
            'Das Brett ist ein echtes Grid: Zeilen, Zellen, eine Zeilen- und Spaltenzahl und immer genau ein Feld in der Tabulatorreihenfolge, sodass man es mit den Pfeiltasten durchläuft statt mit der Tabulatortaste. 2048 muss vor dem Screenreader verborgen und über eine Live-Region beschrieben werden, weil sechzehn Kacheln, die sich bei jedem Tastendruck neu schreiben, nicht lesbar sind. Ein Minenfeld ist eine Tabelle, die stillhält und wartet, und genau dafür ist ein Grid da.',
          ],
        },
      },

      memory: {
        name: 'Memory',

        tagline:
          'Deck zwei Karten auf und merk dir, was darunter war. Zwölf Level, von vier bis sechzig Karten, und mit jedem geschafften Level ein größeres Brett.',

        metaDescription:
          'Memory im Browser: zwölf Level von vier bis sechzig Karten, bis zu drei Sterne pro Brett und ein freies Spiel, in dem jedes Brett von Anfang an offen ist.',
        lead: 'Deck immer zwei Karten auf und finde jedes Paar. Zwölf Level, jedes Brett größer als das vorige, von vier bis zu sechzig Karten, das größte mit dreißig Bildern. Schaff ein Level, um das nächste freizuschalten, oder spring im freien Spiel direkt zu jeder Größe.',

        modes: 'Modus',
        modeNames: {
          campaign: 'Level',
          free: 'Freies Spiel',
        },

        boards: 'Wähle ein Level',
        level: 'Level',

        locked: 'Gesperrt',
        open: 'Noch nicht geschafft',
        stars: ['Ein Stern', 'Zwei Sterne', 'Drei Sterne'],

        moves: 'Züge',
        time: 'Zeit',
        best: 'Wenigste Züge',
        goal: 'Sterne',
        newGame: 'Neues Spiel',
        hint: 'Drück auf eine Karte, um sie umzudrehen, dann auf eine zweite. Ein Paar bleibt offen liegen, alles andere dreht sich zurück. Mit den Pfeiltasten bewegst du dich über den Tisch, Enter dreht eine Karte um.',

        gridLabel: 'Karten',
        cells: {
          hidden: 'Verdeckt',
          matched: '{name}, Paar gefunden',
        },

        messages: {
          pair: '{name}. Ein Paar.',
          miss: '{name}. Kein Paar.',
        },

        pictures: {
          apple: 'Apfel',
          cherries: 'Kirschen',
          lemon: 'Zitrone',
          strawberry: 'Erdbeere',
          watermelon: 'Wassermelone',
          pear: 'Birne',
          grapes: 'Trauben',
          orange: 'Orange',
          banana: 'Banane',
          pineapple: 'Ananas',
          sun: 'Sonne',
          moon: 'Mond',
          cloud: 'Gewitterwolke',
          rainbow: 'Regenbogen',
          snowflake: 'Schneeflocke',
          leaf: 'Ahornblatt',
          tulip: 'Tulpe',
          mushroom: 'Pilz',
          cactus: 'Kaktus',
          tree: 'Tanne',
          rocket: 'Rakete',
          balloon: 'Heißluftballon',
          anchor: 'Anker',
          key: 'Schlüssel',
          crown: 'Krone',
          heart: 'Herz',
          star: 'Stern',
          gem: 'Edelstein',
          bell: 'Glocke',
          umbrella: 'Regenschirm',
        },

        won: {
          title: 'Alle Paare gefunden',
          record: 'So wenige Züge wie noch nie auf diesem Level.',
          final: 'Das war das letzte Level. Was jetzt noch bleibt: drei Sterne auf allen zwölf.',
          next: 'Nächstes Level',
          bigger: 'Nächstes Brett',
          again: 'Noch einmal',
        },

        how: {
          label: 'So wird gespielt',
          items: [
            {
              title: 'Zwei Karten pro Zug',
              description:
                'Drück auf eine Karte, um sie umzudrehen, dann auf eine zweite. Zeigen beide dasselbe Bild, bleiben sie offen liegen. Wenn nicht, bleiben sie lange genug offen, dass du sie dir merken kannst, und drehen sich dann zurück. Drückst du vorher auf die nächste Karte, drehen sie sich sofort zurück.',
            },
            {
              title: 'Jeder Zug zählt',
              description:
                'Zwei Karten sind ein Zug, Paar oder nicht. Drei Sterne gibt es für ein Brett, das etwa so schnell abgeräumt ist, wie ein perfektes Gedächtnis es schaffen würde, zwei für höchstens anderthalbmal so viele Züge und einen dafür, dass du es schaffst. Die Sterne über dem Tisch erlöschen, sobald du eine Marke überschreitest.',
            },
            {
              title: 'Zwölf Level, jedes größer',
              description:
                'Von zwei mal zwei bis zehn mal sechs. Ein geschafftes Level schaltet das nächste frei, und für jedes wird deine niedrigste Zugzahl gespeichert. Die ersten fünf verwenden jeweils nur einen Teil des Stapels, Obst, Natur oder Gegenstände, und ab dem sechsten sind alle dreißig Bilder im Spiel.',
            },
            {
              title: 'Oder spring direkt weiter',
              description:
                'Im freien Spiel sind alle Bretter auf einmal offen, ohne Sterne und ohne Sperren. Derselbe Stapel und dieselben Regeln, für die Momente, in denen du gleich den großen Tisch willst.',
            },
          ],
        },

        close: {
          label: 'So ist es gebaut',
          paragraphs: [
            'Kein Canvas und keine Spielbibliothek, wie bei den anderen auch. Eine Karte ist ein Button mit zwei Seiten, und das Umdrehen ist eine Transition auf einer einzigen Eigenschaft: Die Ebene mit beiden Seiten dreht sich um 180 Grad um ihre senkrechte Achse, jede Seite verbirgt ihre eigene Rückseite, und der Browser zeigt die, die dir zugewandt ist. Die Drehung schießt ein paar Grad über das Ziel hinaus und pendelt sich dann ein. Dadurch wirkt die Karte, als hätte sie Gewicht, und nicht wie ein Quadrat, das sich dreht. Jede Karte bringt ihre eigene Perspektive mit, passend zu ihrer Größe, sodass sich eine Karte auf dem kleinsten Brett und eine auf dem größten mit derselben räumlichen Tiefe drehen.',
            'Die dreißig Bilder werden gezeichnet, nicht heruntergeladen: ein Sprite-Sheet in der Seite, ein Symbol pro Bild, und jede Kartenseite verweist auf eines davon. Jedes Bild besteht aus flachen Farben in drei Tönen, der Farbe selbst, einem Glanzlicht zur Lichtseite hin und einem Schatten auf der abgewandten Seite, auf einem eigenen Hintergrund. Die Bilder behalten ihre Farben in beiden Designs, nur die Hintergründe folgen der Seite, sodass ein im hellen Design gemerkter Apfel im dunklen derselbe Apfel ist. Die Klänge entstehen ebenfalls im Browser, aus ein paar Oszillatoren und gefiltertem Rauschen, es gibt also auch keine Audiodatei auf der Seite.',
            'Eine Karte weiß erst, was sie ist, wenn sie umgedreht wird. Der verdeckte Tisch in der Seite enthält keine einzige Lösung: Die Vorderseite jeder Karte verweist auf nichts, und das Bild wird erst eingesetzt, wenn sie sich umdreht. Der Stapel wird einmal pro Brett gemischt und liegt nur im Spiel selbst, wo die Seite ihn nicht auslesen kann.',
            'Die Sterngrenzen sind gemessen, nicht ausgedacht. Ein Spieler mit perfektem Gedächtnis, der nie eine schon gesehene Karte umdreht, außer sie vervollständigt ein Paar, hat auf jedem Brett zweihunderttausend Partien gespielt. Drei Sterne gibt es für die Zugzahl, die er in neun von zehn Partien geschafft hat. Sein Schnitt lag bei 1,61 Zügen pro Paar. Das ist der bekannte Wert für dieses Spiel, und daran wurde die Simulation überprüft.',
            'Das Brett ist so bemessen, dass es auf den Bildschirm passt, denn ein Memory-Brett, das man scrollen muss, kann man nicht überblicken. Auf einem hochkant gehaltenen Smartphone dreht es sich um 90 Grad, aus zehn Karten nebeneinander werden sechs, und keine einzige Karte wandert dafür: Das Grid füllt sich spaltenweise statt zeilenweise, die Pfeiltasten tauschen passend ihre Achsen, und ein Screenreader liest weiter dieselbe Tabelle.',
          ],
        },
      },

      accretion: {
        name: 'Akkretion',

        tagline:
          'Lass einen Himmelskörper auf einen anderen fallen. Zwei gleiche verschmelzen zum nächstgrößeren, vom Mond bis hinauf zur Sonne.',

        metaDescription:
          'Ein Merge-Spiel im Browser: Himmelskörper fallen lassen, und zwei gleiche werden zum nächstgrößeren, vom Mond bis zur Sonne.',
        lead: 'Lass einen Himmelskörper fallen. Zwei gleiche verschmelzen zum nächstgrößeren, vom Mond über die Planeten bis zur Sonne, und der Raum füllt sich, ob du bereit bist oder nicht.',

        score: 'Punkte',
        best: 'Bestwert',
        next: 'Als Nächstes',
        newGame: 'Neues Spiel',
        hint: 'Zum Zielen bewegen, zum Fallenlassen drücken. Mit den Pfeiltasten zielen, mit der Leertaste fallen lassen.',
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

        over: {
          title: 'Kein Platz mehr',
          body: 'Etwas liegt zu lange über der Linie. Hier gibt es keine Decke, nur eine Linie, und ein Körper, der darüber liegen bleibt, kann nirgendwo mehr hin.',
          restart: 'Nochmal spielen',
        },

        how: {
          label: 'So wird gespielt',
          items: [
            {
              title: 'Zielen, dann loslassen',
              description:
                'Oben entlang bewegen, um einen Körper auszurichten, und drücken, um ihn fallen zu lassen. Es kommen nur die fünf kleinsten, alles, was größer ist als die Erde, muss also erst gebaut werden.',
            },
            {
              title: 'Zwei gleiche berühren sich und verschmelzen',
              description:
                'Man muss sie weder zusammendrücken noch festhalten: Sobald zwei gleiche Körper aneinander zur Ruhe kommen, werden sie zum nächstgrößeren, und landet das Ergebnis neben einem gleichen Körper, löst es eine Kette aus.',
            },
            {
              title: 'In die Breite bauen, nicht in die Höhe',
              description:
                'Ein Körper, der auf einen hohen Haufen fällt, rollt und landet nicht dort, wohin gezielt wurde. Die großen unten zu halten ist der größte Teil des Spiels, denn sie können nirgendwo mehr hin.',
            },
            {
              title: 'Die Linie ist eine Frist, keine Wand',
              description:
                'Nichts hindert einen Körper daran, über die Linie zu geraten. Vorbei ist es erst, wenn einer dort oben gelandet ist und eine halbe Sekunde später noch da liegt. Ein kurzes Hochspringen übersteht man, ein liegen gebliebener Jupiter nicht.',
            },
          ],
        },

        close: {
          label: 'Wie es gebaut ist',
          paragraphs: [
            'Kein Canvas, keine Physikbibliothek und überhaupt keine Abhängigkeit. Ein Körper ist ein div mit border-radius, seine Farbe ein Verlauf im selben Stylesheet wie der Rest der Seite, und jeder Frame schreibt eine Transformation auf jeden einzelnen. Deshalb skalieren die Planeten mit der Seite, bleiben bei jedem Zoom scharf und müssen nicht extra geladen werden. Eine allgemeine Physik-Engine allein wäre fünfmal so groß wie dieses ganze Spiel.',
            'Der Solver macht viele kleine Schritte statt weniger großer, acht pro Frame. In jedem Schritt wird jeder Kontakt als steife, stark gedämpfte Feder gelöst, die Körper bewegen sich, und dann wird jeder Kontakt noch einmal gelöst, diesmal starr, was die Geschwindigkeit wieder wegnimmt, die ihnen das Wegdrücken gegeben hat. So wird eine Überlappung korrigiert, ohne dass daraus ein Abprall wird, und ein ruhender Haufen liegt vollkommen still. Ein Kontakt wird schon erkannt, solange noch ein Spalt da ist, deshalb hält ein fallender Planet genau an der Oberfläche an, auf der er landet, statt einzusinken und wieder herausgedrückt zu werden.',
            'Der Rest sorgt dafür, dass die Planeten schwer wirken und nicht federnd. Reibung wirkt zwischen den beiden Oberflächen, Drehung eingeschlossen, sodass ein rutschender Körper zu rollen beginnt. Eine harte Landung schluckt die Drehung, mit der ein Körper ankommt, sodass ein Planet, der einen anderen an der Schulter streift, neben ihm liegen bleibt, statt quer durch das Spielfeld zu rollen. Ein Stoß wird dort aufgezehrt, wo er passiert, und nie in den nächsten Schritt mitgenommen. Deshalb prallt ein großer Körper nicht von einem kleinen ab. Und ein Planet, der oben auf einem anderen balanciert, wird sofort heruntergeschubst: Das Gleichgewicht mag physikalisch stimmen, aber ein Planet, der wie ein Schneemann auf einem anderen steht, sieht aus, als hinge er fest.',
            'Die Simulation läuft in ihrem eigenen Raum von 1200 mal 1650 Einheiten und weiß nie, wie groß sie angezeigt wird. Eine einzige Transformation auf einem Element skaliert das ganze Spielfeld auf die Breite, die ihm die Seite gibt, eine Größenänderung ändert also nur diese eine Zahl - keinen Radius, keine Position, keinen Schritt. Jeder Frame zeichnet jeden Körper interpoliert zwischen den letzten beiden Schritten, sodass ein 120-Hz-Bildschirm bei jeder Bildwiederholung eine neue Position bekommt. Der Himmel dahinter wird einmal beim Build der Website gezeichnet: dreihundert Sterne als Punkte auf wenigen Pfaden, Nebel aus fraktalem Rauschen und vier Ebenen, die beim Zielen unterschiedlich schnell mitgleiten.',
          ],
        },
      },

      battleship: {
        name: 'Schiffe versenken',

        tagline:
          'Verstecke fünf Schiffe und finde die des Gegners zuerst. Vier Gegner, vom zufälligen Schützen bis zu einem, der jede Aufstellung zählt, die für deine Flotte noch möglich ist.',

        metaDescription:
          'Schiffe versenken im Browser, gegen vier Gegner: die klassische Flotte auf einem Feld von zehn mal zehn und ein Gegner, der jede Aufstellung zählt, die die bisherigen Schüsse noch zulassen.',
        lead: 'Verstecke fünf Schiffe und finde die gegnerischen, bevor der Gegner deine findet. Geschossen wird abwechselnd, ein Schuss pro Zug, und die Schwierigkeit hängt allein vom gewählten Gegner ab: Der schwächste schießt irgendwohin, wo er noch nicht war, der stärkste zählt jede Aufstellung, die für deine Flotte noch möglich ist, und schießt auf das Feld, das in den meisten davon vorkommt.',

        /** Ränge statt Adjektive: "leicht" und "schwer" sagen, wie es für dich
         *  ausgeht, ein Rang sagt, wer gegenüber sitzt, und das ist es, was
         *  gewählt wird. */
        opponents: 'Wähle deinen Gegner',
        levels: {
          sailor: {
            name: 'Matrose',
            note: 'Schießt zufällig. Braucht etwa 95 Schüsse für ein Feld, gegen ihn zu verlieren ist also richtig schwer.',
          },
          gunner: {
            name: 'Kanonier',
            note: 'Bleibt an einem Treffer dran. Etwa 55 Schüsse, und er bestraft einen langsamen Start.',
          },
          captain: {
            name: 'Kapitän',
            note: 'Sucht das Feld systematisch ab. Etwa 50 Schüsse, ein fairer Kampf.',
          },
          admiral: {
            name: 'Admiral',
            note: 'Etwa 45 Schüsse, nah am besten Wert, der je erreicht wurde. Rechne mit einer Niederlage.',
          },
        },

        shots: 'Schüsse',
        /** ⚠️ Nicht "Bestwert": eine Zählung, bei der weniger besser ist, und
         *  unter diesem Wort liest sich eine nackte Zahl als Punktestand. */
        best: 'Wenigste Schüsse',
        toPlace: 'Zu setzen',
        rotate: 'Drehen',
        shuffle: 'Neu verteilen',
        start: 'Starten',
        newGame: 'Neues Spiel',

        /** Die Überschrift über jedem Feld, und der Name des Rasters selbst. */
        sides: {
          enemy: 'Gegnerische Gewässer',
          own: 'Deine Flotte',
        },

        /** Was ein Feld sagt, wenn darauf nichts zu lesen ist. */
        cells: {
          water: 'Wasser',
          ship: 'Schiff',
          miss: 'Daneben',
          hit: 'Treffer',
          sunk: 'Versenkt',
        },

        ships: ['Flugzeugträger', 'Schlachtschiff', 'Kreuzer', 'U-Boot', 'Zerstörer'],

        /** Die Zeile unter einem Feld nach einem Schuss darauf. `{ship}` wird
         *  durch den Namen aus der Liste darüber ersetzt. */
        messages: {
          hit: 'Treffer.',
          miss: 'Daneben.',
          sunk: '{ship} sinkt.',
          waiting: 'Der Gegner zielt.',
          ready: 'Du bist dran.',
        },

        setupHint:
          'Deine Flotte liegt schon im Wasser. Drücke auf ein Schiff, um es aufzunehmen, und auf das Wasser, um es abzusetzen. Drehen kannst du es vorher.',
        hint: 'Drücke auf ein Feld in den gegnerischen Gewässern, um zu schießen. Mit den Pfeiltasten bewegst du dich über ein Spielfeld, Enter schießt, und R dreht ein Schiff beim Setzen.',

        won: {
          title: 'Die gegnerische Flotte ist versenkt',
          body: 'Alle fünf versenkt, und deine Flotte war schneller.',
          record: 'So wenige Schüsse wie noch nie gegen diesen Gegner.',
          again: 'Noch einmal',
        },

        lost: {
          title: 'Deine Flotte ist versenkt',
          body: 'Die gegnerischen Schiffe werden dort gezeigt, wo sie lagen, damit du siehst, wonach du gesucht hast.',
          again: 'Nochmal versuchen',
        },

        how: {
          label: 'So wird gespielt',
          items: [
            {
              title: 'Setze fünf Schiffe ins Wasser',
              description:
                'Beim Öffnen der Seite wird dir sofort eine Flotte aufgestellt, du kannst also gleich loslegen. Drücke auf ein Schiff, um es aufzunehmen, dreh es, und drücke auf ein Feld, um es abzusetzen. Schiffe dürfen sich berühren: Das ist die Standardregel und die, die am wenigsten verrät.',
            },
            {
              title: 'Ein Schuss pro Seite, abwechselnd',
              description:
                'Ein Treffer bringt keinen zweiten Schuss, auf keiner Seite. Du schießt zuerst, der Gegner antwortet, und vorbei ist es, sobald bei einer Flotte alle siebzehn Felder getroffen sind.',
            },
            {
              title: 'Ein Treffer ist eine Spur',
              description:
                'Da liegt etwas, und es erstreckt sich in eine von vier Richtungen. Zwei Treffer in einer Reihe legen die Richtung fest, und bis das Schiff sinkt, lohnen sich nur noch die Felder an den beiden Enden dieser Reihe.',
            },
            {
              title: 'Wähle, gegen wen du spielst',
              description:
                'Der Matrose braucht etwa fünfundneunzig Schüsse für ein Feld, der Kanonier fünfundfünfzig, der Kapitän fünfzig und der Admiral fünfundvierzig. Siebzehn ist die Untergrenze. Dein Bestwert wird für jeden getrennt gespeichert, denn ein Sieg über den einen ist kein Sieg über den anderen.',
            },
          ],
        },

        close: {
          label: 'Wie es gebaut ist',
          paragraphs: [
            'Kein Canvas und keine Spielbibliothek, wie bei den anderen auch. Das Meer ist ein Raster aus Schaltflächen und die Flotte eine Schicht darüber: ein Element je Schiff, das sich über alle seine Felder erstreckt, mit einer Zeichnung darin. Ein Flugzeugträger hat ein Flugdeck, eine Insel und Markierungen, ein U-Boot liegt tief im Wasser und hat gar nichts an Deck, und nichts davon übersteht das Zerschneiden in Felder. Ein Rumpf ist deshalb eine durchgehende Form über die ganze Länge und kein abgerundetes Ende, das auf jedes Feld geklebt wurde. Jedes Schiff ist zweimal gezeichnet: als vollständiger Grundriss mit Türmen, Schornsteinen und Flugdeck und als bloße Silhouette. Die Silhouette verwenden die Kopien, die unter einem Rumpf gestapelt sind und ihm eine Bordwand geben, so wird das Detail nur einmal je Schiff aufgelöst statt achtmal. Ein quer liegendes Schiff ist dieselbe Zeichnung, um 90 Grad gedreht.',
            'Das Feld ist geneigt, die Schiffe stehen darüber, und beides ist echtes 3D, nicht aufgemalt. Die Karte ist dreidimensional gedreht und die Flotte entlang der Achse angehoben, die diese Drehung übrig lässt, also steht ein Rumpf über seinem eigenen Schatten und dreht seine Bordwand mit, wenn er gedreht wird. Perspektive gibt es nirgends, und zwar mit Absicht: Ein Fluchtpunkt würde die hintere Kante schmaler machen als die vordere, und auf einem Raster, dessen Felder man benennt, müssen die Spalten parallel bleiben. Auch ein Schuss wird gezeichnet: Er fliegt von einem deiner Rümpfe zu dem Feld, auf dem er landet, denn ein Zug ist hier eine Flotte, die auf eine andere feuert, und nicht bloß eine Markierung, die erscheint.',
            'Der Gegner sieht die Flotte nicht, auf die er schießt, und das garantiert der Aufbau des Codes, nicht bloß ein Kommentar. Die Funktion, die ein Feld wählt, bekommt zwei Dinge: die Liste ihrer eigenen Schüsse und die Längen der Schiffe, die sie schon versenkt hat. Die Aufstellung ist dort, wo entschieden wird, gar nicht erreichbar, es gibt also keine Zeile, bei der man aufpassen müsste. Welches Schiff gesunken ist, ist öffentlich, so wie ein Spieler es laut ansagt, und genau damit lässt sich die Suche eingrenzen.',
            'Der stärkste der vier rät nicht. Für jedes Schiff, das noch schwimmt, geht er jede Position durch, die es einnehmen könnte, verwirft die, die ein Fehlschuss oder ein Wrack ausschließt, und gibt jedem unbekannten Feld, das eine der verbleibenden Positionen abdeckt, eine Stimme. Geschossen wird auf das Feld mit den meisten Stimmen. Suchen und das Verfolgen eines Treffers sind dieselbe Rechnung und keine zwei Modi: Ist nichts ungeklärt, entsteht die bekannte Glockenform über der Mitte des Feldes. Liegt ein Treffer vor, fallen die Positionen weg, die ihn nicht erklären, und das Gewicht sammelt sich um ihn herum.',
            'Das Verfolgen eines Treffers wird meist als Warteschlange von Feldern geschrieben, die noch auszuprobieren sind, und genau hier entstehen in solchen Programmen die Fehler: Die Warteschlange muss bereinigt werden, wenn ein Schiff sinkt, wenn ein anderer Schuss einen ihrer Einträge erledigt und wenn zwei Schiffe nebeneinander liegen. Hier werden die Folgefelder in jedem Zug neu aus dem Spielfeld abgeleitet, es gibt also nichts zu speichern und nichts, was veralten kann. Vier Gegner, vierzigtausend simulierte Partien gegen einen unabhängig geschriebenen Verteidiger und kein einziger unzulässiger Schuss.',
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
          'REST-APIs und Services in Node.js (NestJS, Express) oder .NET, mit Datenmodellierung, Authentifizierung, rollenbasierter Zugriffskontrolle und Integrationen mit Drittanbietern.',
      },
      {
        title: 'Full-Stack-Produktarbeit',
        description:
          'Ein ganzes Feature aus einer Hand: das Datenbankschema, die API und die React-Oberflächen, die sie nutzen.',
      },
      {
        title: 'AWS-Architektur und Deployment',
        description:
          'Cloud-Infrastruktur neu aufsetzen oder die bestehende verbessern: Umgebungen, CI/CD-Pipelines und eine Prüfung von Kosten und Zuverlässigkeit.',
      },
      {
        title: 'Technische Durchsicht und Beratung',
        description:
          'Ein Review von bestehendem Code oder einer bestehenden Architektur: was zuerst behoben werden sollte, ein Refactoring-Plan und ob sich eine Neuentwicklung lohnt.',
      },
    ],
  },

  contact: {
    label: 'Kontakt',
    intro:
      'Per E-Mail erreichen Sie mich am schnellsten. Wenn Sie ein Projekt planen, reicht für den Anfang eine grobe Beschreibung des Problems.',
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
    body: 'Vielleicht ist die Adresse falsch, oder die Seite wurde verschoben. Der Link unten führt zur Startseite, und von dort ist alles auf der Website nur einen Klick entfernt.',
    cta: 'Zurück zur Startseite',
  },
};

export default de;
