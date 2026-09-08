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
    all: "Svi projekti",
    view: "Pročitaj ceo tekst",
    back: "Projekti",

    index: {
      metaTitle: "Projekti - Vuk Cvetković",
      metaDescription:
        "Projekti Vuka Cvetkovića, backend developera iz Niša: šta svaki sistem radi, kako je napravljen i šta je iz njega izašlo.",
      heading: "Projekti",
      intro:
        "Radovi o kojima mogu da pišem u celini, sa arhitekturom i rezultatima umesto sa jednim screenshotom. Za sada jedan, a svaki dobija svoju stranicu.",
    },

    detail: {
      year: "Godina",
      context: "Kontekst",
      domain: "Domen",
      flow: "Kako prolazi jedan zahtev",
      overview: "Pregled",
      architecture: "Arhitektura",
      features: "Šta radi",
      dataset: "Skup podataka i obučavanje",
      results: "Rezultati",
      stack: "Tehnologije",
      takeaway: "Šta sam iz ovoga izvukao",
    },

    results: {
      model: "Model",
      annotations: "Anotacije",
    },

    stackGroups: {
      frontend: "Frontend",
      gateway: "Gateway",
      pythonService: "Python servis",
      dotnetService: ".NET servis",
      data: "Skup podataka",
    },

    items: {
      objectDetection: {
        title: "Uporedni sistem za detekciju objekata",
        tagline: "Ista slika kroz dva ekosistema mašinskog učenja, sa odgovorom u jednom formatu.",
        description:
          "Moj master rad. Ista slika prolazi kroz YOLOv8m model u Python-u i ML.NET model u .NET-u, oba iza jednog gateway-a koji odgovara u jednom formatu, pa jedan React front end iscrtava bilo koji od dva rezultata. Ponovno anotiranje skupa podataka podiglo je YOLOv8m na 0,916 mAP@0.5 prema 0,748 za ML.NET.",
        metaTitle: "Uporedni sistem za detekciju objekata - Vuk Cvetković",
        metaDescription:
          "Sistem iz master rada: YOLOv8m u Python-u i ML.NET u .NET-u iza jednog NestJS gateway-a, upoređeni nad istim skupom podataka o zaštitnoj opremi.",
        context: "Master rad, Elektronski fakultet u Nišu",
        domain: "Lična zaštitna oprema na gradilištu",

        flow: {
          before: ["Slika, multipart/form-data", "NestJS gateway"],
          branches: [
            ["FastAPI servis", "Ultralytics YOLOv8m"],
            ["ASP.NET Core servis", "ML.NET model"],
          ],
          after: ["Jedan JSON format", "Okviri, klase, pouzdanost"],
        },

        overview: [
          "Pitanje nije bilo koji model detektuje najbolje u apstraktnom smislu. Pitanje je bilo šta se menja kada se isti zadatak detekcije napravi dva puta, jednom u ekosistemu za kojim istraživanje poseže, a jednom u onom koji već drži backend. Zato sistem obučava YOLOv8m model u Python-u i ML.NET model u .NET-u nad istim anotiranim slikama, stavlja oba iza jednog API-ja i pušta sliku kroz jedan ili kroz oba.",
          "Domen je lična zaštitna oprema na gradilištu, kroz šest klasa: šlem, prsluk i rukavice, svaka kao prisutna ili odsutna. Negativne klase su ovde poenta. Takav sistem je koristan samo ako može da kaže da neko ne nosi šlem, a ne samo da se šlem nalazi negde u kadru.",
        ],

        steps: [
          {
            title: "Frontend šalje sliku",
            body: "React šalje fajl kao multipart/form-data, sa izabranim modelom u drugom polju. Ako tražiš oba, ispaljuje dva zahteva paralelno, pa je poređenje nad jednom slikom u jednom trenutku.",
          },
          {
            title: "Gateway ga usmerava",
            body: "NestJS je jedina adresa koju frontend zna. Prima upload i prosleđuje ga FastAPI servisu ili ASP.NET Core servisu, što ostavlja dva ML servisa da se menjaju nezavisno od klijenta.",
          },
          {
            title: "Servis pokreće inference",
            body: "Python učitava sliku u RGB i predaje je YOLOv8m modelu, držeći učitane težine u memoriji da se .pt fajl ne čita na svaki zahtev. .NET strana konvertuje u MLImage i bira ML.NET model po id-u.",
          },
          {
            title: "Oba odgovaraju u istom obliku",
            body: "Klasa, score i okvir kao x1, y1, x2, y2, uz id modela, skup anotacija nad kojim je obučen i originalne dimenzije slike. .NET strana prvo ograničava svoje koordinate na te dimenzije, pa okvir nikada ne može da izađe iz slike.",
          },
          {
            title: "Frontend to iscrtava",
            body: "Pošto je odgovor identičan u oba slučaja, u interfejsu ne postoji YOLO grana ni ML.NET grana. Skalira koordinate sa originalne na prikazanu veličinu i iscrtava okvire, nazive klasa i pouzdanosti preko slike.",
          },
        ],

        features: [
          {
            title: "Jedan model ili oba",
            body: "Bilo koji servis sam, ili oba istovremeno u dva panela nad istom slikom, sa sva četiri obučena modela dostupna po imenu.",
          },
          {
            title: "Prag pouzdanosti koji ti kontrolišeš",
            body: "Slajder skriva sve ispod praga, onako kako pravi sistem reaguje samo na predikcije iznad granice, a ne na sve što model vrati.",
          },
          {
            title: "Svaka detekcija, u listi",
            body: "Klasa i score po detekciji, a izborom jedne ona se izdvaja na slici, što je način da proveriš kadar sa osam okvira koji se preklapaju.",
          },
          {
            title: "Okviri, ispuna, zoom i pan",
            body: "Okviri kao linije ili kao ispunjeni regioni, jedna detekcija ili sve, i zoom, da vidiš gde okvir zaista stoji a ne gde je otprilike.",
          },
          {
            title: "Dva odgovora jedan uz drugi",
            body: "Trajanje zahteva, broj detekcija, prosečna pouzdanost, najjača detekcija i koji servis je prvi odgovorio.",
          },
          {
            title: "Health provere",
            body: "Gateway, Python API i .NET API javljaju status i vreme odgovora, jer tri procesa padaju nezavisno, a prazan panel treba da kaže koji je od njih pao.",
          },
        ],

        dataset: [
          "Skup podataka je sastavljen u Roboflow-u iz dva javna skupa, pa pregledan i objedinjen u jedan: 2.911 slika podeljenih na 2.374 za trening, 290 za validaciju i 247 za test, sa auto-orientation obradom i promenom veličine na 640x640. Python strana ga uzima u YOLO formatu, a .NET strana u COCO, jer je to ono što Model Builder očekuje za detekciju, pa oba alata dobijaju format koji im treba nad identičnim slikama i identičnim klasama.",
          "A onda deo koji nisam planirao. Prvi prolaz je imao 8.813 anotacija, a ponovni prolaz kroz njega doveo je taj broj na 17.942, što znači da više od polovine objekata nije bilo označeno. Objekat koji postoji na slici ali ga nema u oznakama uči model tokom obučavanja da je to pozadina, a onda mu se tokom evaluacije upisuje kao greška kada ga ipak detektuje.",
          "Oba modela su obučavana 50 epoha na 640x640 iz pretrained težina, sa parametrima koji su ostali isti između dve verzije skupa, da bi se razlika u rezultatima čitala kao razlika u kvalitetu anotacija a ne u konfiguraciji. Model Builder se zaustavlja na obučenom modelu, pa je .NET strani trebao sopstveni evaluation servis: učitava COCO anotacije, predviđa nad validacionim skupom i računa precision, recall, F1 i mAP@0.5 sa matricama konfuzije i precision-recall krivama, što je ML.NET dovelo na istu ravan sa onim što Ultralytics ispisuje sam.",
        ],

        results: [
          "Ponovno anotiranje pomerilo je svaku metriku kod oba modela. YOLOv8m je otišao sa 0,790 na 0,916 mAP@0.5, a ML.NET sa 0,580 na 0,748, pa je u relativnom smislu slabiji model dobio najviše, 29 procenata prema 16. Prvi prolaz je njega najviše i držao.",
          "YOLOv8m je ispred po brojevima, a razlika koja je važna je recall: 0,867 prema 0,709 na ispravljenom skupu, uz skoro isti precision. Za zaštitnu opremu ta asimetrija je cela poenta, jer propuštena detekcija je čovek koga sistem tiho prijavi kao ispravnog, a precision sam po sebi ne može da ti kaže da se to dogodilo.",
          "Poređenje se zaustavlja tamo gde još može da bude iskreno. Oba modela su videla jedan domen slika i šest klasa, a parametri su ostavljeni uporedivim a ne doterani za najbolji rezultat svakog modela, pa su ovo dve konfiguracije izmerene jedna prema drugoj, a ne plafon nijednog od dva alata.",
        ],

        takeaway: [
          "Ishod je više ležao u podacima nego u izboru framework-a. Ponovno anotiranje istih 2.911 slika pomerilo je oba modela dalje nego što je razdaljina između dva ekosistema pomerila ML.NET, a to nije zaključak koji sam očekivao da ću pisati.",
          "Inženjerska polovina je praktičnija. Python mi je dao prostor za eksperiment i sam proizveo materijal za evaluaciju, .NET mi je dao model koji ulazi u ASP.NET Core servis bez ikakvog mosta između, a standardizovan odgovor je jedini razlog zašto jedan frontend može da ih tretira kao zamenjive.",
        ],
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

  notFound: {
    metaTitle: "Stranica nije pronađena - Vuk Cvetković",
    status: "404",
    heading: "Stranica nije pronađena",
    body: "Adresa je možda pogrešna ili je stranica premeštena. Link ispod vodi na početak, a sve na sajtu je jedan korak odatle.",
    cta: "Nazad na početnu",
  },
};

export default sr;
