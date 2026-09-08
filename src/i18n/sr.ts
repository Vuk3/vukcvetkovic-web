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
      "Backend developer iz Niša. Servisi u Node.js-u (NestJS, Express), event-driven infrastruktura na AWS-u i React interfejsi ispred njih.",
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
      "Backend developer u Ncoded Solutions, u Nišu. Gradim servise u Node.js-u (NestJS, Express), i u .NET-u kada ga klijent već koristi, pa ih puštam na AWS: kontejneri, redovi i događaji koji prolaze između njih.",
    cta: "Kontaktirajte me",
    portraitAlt: "Portret Vuka Cvetkovića",
    portraitPlaceholder: "portret",
  },

  about: {
    label: "O meni",
    paragraphs: [
      "Najveći deo mog posla je na backendu. Projektujem API-je i servise iza njih, pretežno u Node.js-u (NestJS, Express), i isti posao vodim do React interfejsa iznad njih kada projektu to treba.",
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
          "Backend servisi u Node.js-u (NestJS, Express): REST API-ji, JWT autentikacija, kontrola pristupa po rolama i integracije sa trećim stranama, nad SQL i dokument bazama.",
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
        "Radovi o kojima mogu da pišem u celini, sa arhitekturom i rezultatima umesto sa jednim screenshotom. Svaki dobija svoju stranicu.",
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

    stackGroups: {
      frontend: "Frontend",
      gateway: "Gateway",
      pythonService: "Python servis",
      dotnetService: ".NET servis",
      data: "Skup podataka",
      client: "Klijent",
      service: "Servis",
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

        results: {
          columns: [
            "Model",
            "Anotacije",
            "Precision",
            "Recall",
            "F1",
            "mAP@0.5",
            "mAP@0.5:0.95",
          ],
          rows: ["YOLOv8m", "YOLOv8m", "ML.NET", "ML.NET"],
          notes: [
            "Ponovno anotiranje pomerilo je svaku metriku kod oba modela. YOLOv8m je otišao sa 0,790 na 0,916 mAP@0.5, a ML.NET sa 0,580 na 0,748, pa je u relativnom smislu slabiji model dobio najviše, 29 procenata prema 16. Prvi prolaz je njega najviše i držao.",
            "YOLOv8m je ispred po brojevima, a razlika koja je važna je recall: 0,867 prema 0,709 na ispravljenom skupu, uz skoro isti precision. Za zaštitnu opremu ta asimetrija je cela poenta, jer propuštena detekcija je čovek koga sistem tiho prijavi kao ispravnog, a precision sam po sebi ne može da ti kaže da se to dogodilo.",
            "Poređenje se zaustavlja tamo gde još može da bude iskreno. Oba modela su videla jedan domen slika i šest klasa, a parametri su ostavljeni uporedivim a ne doterani za najbolji rezultat svakog modela, pa su ovo dve konfiguracije izmerene jedna prema drugoj, a ne plafon nijednog od dva alata.",
          ],
        },

        takeaway: [
          "Ishod je više ležao u podacima nego u izboru framework-a. Ponovno anotiranje istih 2.911 slika pomerilo je oba modela dalje nego što je razdaljina između dva ekosistema pomerila ML.NET, a to nije zaključak koji sam očekivao da ću pisati.",
          "Inženjerska polovina je praktičnija. Python mi je dao prostor za eksperiment i sam proizveo materijal za evaluaciju, .NET mi je dao model koji ulazi u ASP.NET Core servis bez ikakvog mosta između, a standardizovan odgovor je jedini razlog zašto jedan frontend može da ih tretira kao zamenjive.",
        ],
      },

      encryptix: {
        title: "Encryptix",
        tagline: "Tri šifre iza jednog servisa, i heš na oba kraja kao dokaz da se fajl vratio ceo.",
        description:
          "Moj diplomski rad. Desktop klijent predaje ceo folder WCF servisu, koji svaki fajl šifruje pomoću AES-a, RC6 ili XXTEA - poslednja dva napisana po specifikaciji, a ne uzeta iz biblioteke - i upisuje SHA-512 heš pre i posle svakog prolaza, pa se povratak fajla može dokazati a ne pretpostaviti. Paralelna obrada fajlova skratila je prolaz kroz 150 fajlova sa 68,91 na 44,16 sekundi.",
        metaTitle: "Encryptix - Vuk Cvetković",
        metaDescription:
          "Projekat iz diplomskog rada: Windows Forms klijent i WCF servis koji šifruju ceo folder pomoću AES-a, RC6 ili XXTEA, sa SHA-512 verifikacijom na oba kraja.",
        context: "Diplomski rad, Elektronski fakultet u Nišu",
        domain: "Šifrovanje fajlova na desktopu",

        flow: {
          before: ["Folder, pročitan rekurzivno u bajtove", "WCF servis"],
          branches: [
            ["AES", "CBC, iz .NET biblioteke"],
            ["RC6", "Napisan rukom, 20 rundi"],
            ["XXTEA", "Napisan rukom, Fajstelova mreža"],
          ],
          after: ["Po jedan šifrovan fajl za svaki ulazni", "SHA-512 upisan pre i posle"],
        },

        overview: [
          "Jedinica rada ovde je folder, ne fajl. Pokažeš aplikaciji direktorijum, ona pročita sve u njemu i u svakom podfolderu, pa jedna od tri simetrične šifre prođe kroz ceo skup - a šifrovano drvo, dešifrovano drvo i heš zapis se upisuju tamo gde ti izabereš.",
          "Razlog zašto ih ima tri je to što je samo jedna došla gotova. AES je implementacija iz .NET biblioteke, ono što bi svaka razumna aplikacija i koristila. RC6 i XXTEA su napravljeni po svojim specifikacijama, i tu je projekat zapravo i bio: proširenje ključa, dopunjavanje bloka, rotacije i namerno prekoračenje celobrojne vrednosti na koje se XXTEA oslanja.",
        ],

        steps: [
          {
            title: "Klijent čita folder",
            body: "Dijalog za izbor foldera, pa rekurzivni obilazak koji svaki fajl čita kao sirove bajtove bez obzira na ekstenziju i drži njegovo ime, ekstenziju, putanju i sadržaj zajedno kao jedan zapis. Ništa ne tumači fajl, pa .txt i .exe idu istim putem kroz program.",
          },
          {
            title: "Zadatak u pozadini drži prozor živim",
            body: "Windows Forms daje aplikaciji jednu nit i ta nit poseduje kontrole, pa bi čitanje velikog foldera na njoj zamrzlo prozor i zaustavilo upravo onaj loader koji treba da se vrti. Čitanje se zato izvršava kao Task, a nastavak se raspoređuje natrag na sinhronizacioni kontekst same forme, što je jedino mesto sa kog se dugmići smeju ponovo omogućiti.",
          },
          {
            title: "Lista prelazi na servis",
            body: "Klijent poziva WCF servis preko HTTP-a. Obe strane su morale da se prekonfigurišu zbog količine podataka: granice bafera idu na najveću vrednost koju int može da primi, a mod prenosa se menja sa baferovanog na streamed, pa se baferuje samo zaglavlje poruke a ne cela lista fajlova, uz tajmaut od deset minuta na svakoj strani.",
          },
          {
            title: "Servis šifruje, fajl po fajl",
            body: "Izabrani algoritam dobija listu, ključ i - za AES - vektor inicijalizacije. RC6 i XXTEA zahtevaju da ulaz ispuni cele blokove, pa svaki dopunjava niz bajtova do svoje veličine bloka i upisuje originalnu dužinu u prva četiri bajta, što je ono što dešifrovanju dozvoljava da tu dopunu skrati umesto da pogađa gde se fajl završio.",
          },
          {
            title: "Oba kraja se hešuju",
            body: "Svaki fajl dobija tekstualni fajl pored sebe sa četiri SHA-512 linije: pre šifrovanja, posle šifrovanja, pre dešifrovanja, posle dešifrovanja. Prva i poslednja su one koje su važne, i moraju biti identične. To je cela tvrdnja o integritetu, i može da je proveri svako ko otvori fajl.",
          },
        ],

        features: [
          {
            title: "Ceo folder odjednom",
            body: "Sa podfolderima, do bilo koje dubine. Izlazno drvo prati ulazno, a to dolazi iz razlike putanje svakog fajla prema korenu, a ne iz praćenja rekurzije.",
          },
          {
            title: "Tri šifre, jedna forma",
            body: "AES sa ključem od 32 znaka i IV od 16 znakova, RC6 i XXTEA sa ključem od 16 znakova. Svaki dobija svoj prozor, a svako polje se proverava pre nego što se bilo šta upiše.",
          },
          {
            title: "Dokaz da se vratio",
            body: "SHA-512 otvorenog teksta pre šifrovanja prema SHA-512 otvorenog teksta posle dešifrovanja. Jednaki znače da je put tamo i natrag prošao bez gubitka.",
          },
          {
            title: "Sekvencijalno ili paralelno",
            body: "Oba režima postoje, a polje za izbor bira između njih. Paralelni prolaz raspoređuje listu fajlova kroz paralelnu petlju, a kako se svaki fajl čita, transformiše i upisuje sam za sebe, nema konflikata koje treba rešavati, pa se završava brže od obrade fajl po fajl.",
          },
          {
            title: "Progress bar koji se ne meša",
            body: "On je procena, odmerena po ukupnom broju bajtova, jer servis ne prijavljuje ništa dok radi. Cancellation token ga preseca i napuni u trenutku kada se pravi poziv vrati, pa može da odmakne ispred posla ali nikada da zaostane za njim.",
          },
          {
            title: "Drvo fajlova unapred",
            body: "Prikaz svega što je učitano, rašireno, pre nego što se odlučiš da to šifruješ. Korisno pre svega da uhvatiš da si izabrao pogrešan folder.",
          },
        ],

        dataset: [],

        results: {
          columns: ["Režim", "Fajlova", "Šifrovanje (s)", "Dešifrovanje (s)"],
          rows: ["Sekvencijalno", "Paralelno"],
          notes: [
            "Istih 150 fajlova, isti RC6 ključ, isti izlazni folderi, pokrenuto po jednom na svaki način. Paralelno šifrovanje je završilo za 44,16 sekundi prema 68,91, a dešifrovanje za 40,39 prema 70,13 - trećina manje u oba smera.",
            "Dobitak dolazi iz oblika samog posla. Fajlovi ovde nikada ne zavise jedan od drugog, pa se lista deli kroz paralelnu petlju bez deljenog stanja koje treba čuvati, bez konflikata koje treba rešavati i bez redosleda koji treba održati, i nijedan fajl ne čeka onaj pre sebe. Zato paralelna obrada skida oko trećine celog prolaza, a ne nekoliko procenata.",
          ],
        },

        takeaway: [
          "Ono što bih zadržao je to da sam dve šifre implementirao a ne pozvao. To su kratki algoritmi i skoro svaka linija nosi teret: u kom smeru ide rotacija, gde se čuva originalna dužina, i činjenica da XXTEA zahteva da mu se aritmetika prelije pri prekoračenju a ne da podigne grešku. Jedna pogrešna pretpostavka daje izlaz koji izgleda ispravno dok se heševi ne raziđu.",
          "Nedostaci su danas isto tako jasni kao što je rad rekao da jesu. Sve ovde je simetrično, pa je razmena ključeva ostavljena u potpunosti onome ko aplikaciju koristi, a očigledan sledeći korak je asimetrični algoritam i hibrid od AES-a i RSA koji iz njega sledi. WCF i Windows Forms takođe iskreno smeštaju projekat u vreme - ni jedno ni drugo nije ono za čim bih danas posegnuo, a odlazak sa tog steka je dobar deo onoga što sam od tada radio.",
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
          "Servisi i API-ji u Node.js-u (NestJS, Express) ili .NET-u: modelovanje podataka, autentikacija, integracije sa trećim stranama, i testovi koji ih drže u redu.",
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
