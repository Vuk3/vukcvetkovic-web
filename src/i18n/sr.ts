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
      "Backend developer iz Niša. Pravim servise u Node.js-u (NestJS, Express), event-driven infrastrukturu na AWS-u i React interfejse ispred njih.",
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
    games: "Igre",
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

    flowCaptions: {
      entry: "Ulaz",
      core: "Orkestracija",
      lane: "Paralelno",
      exit: "Izlaz",
    },

    stackGroups: {
      frontend: "Frontend",
      gateway: "Gateway",
      pythonService: "Python servis",
      dotnetService: ".NET servis",
      data: "Skup podataka",
      client: "Klijent",
      service: "Servis",
      interface: "Interfejs",
      capture: "Čitanje snimka",
      charts: "Grafikoni",
      mobile: "Mobilna aplikacija",
      api: "API",
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
          entry: "React front end",
          entryLabel: "Slika, multipart/form-data",
          core: "NestJS gateway",
          branches: [
            { title: "FastAPI servis", badge: "Ultralytics YOLOv8m" },
            { title: "ASP.NET Core servis", badge: "ML.NET model" },
          ],
          exit: "",
          exitLabel: "Jedan JSON format: okviri, klase, pouzdanost",
          exitNote: "",
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
            "Dve kolone se mogu čitati jedna prema drugoj zato što je merenje tako postavljeno: jedan domen slika, iste šest klasa, i parametri držani uporedivim kod oba modela a ne doterani odvojeno. To je ono što razliku u brojevima čini razlikom u modelima i anotacijama, i ničim drugim.",
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
          entry: "Folder, pročitan rekurzivno u bajtove",
          entryLabel: "",
          core: "WCF servis",
          branches: [
            { title: "AES", badge: "CBC, iz .NET biblioteke" },
            { title: "RC6", badge: "Napisan rukom, 20 rundi" },
            { title: "XXTEA", badge: "Napisan rukom, Fajstelova mreža" },
          ],
          exit: "Po jedan šifrovan fajl za svaki ulazni",
          exitLabel: "",
          exitNote: "SHA-512 upisan pre i posle",
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
            title: "Progress bar koji završi sa poslom",
            body: "Odmeren po ukupnom broju bajtova dok servis radi, i napunjen u trenutku kada se pravi poziv vrati, preko cancellation token-a, pa prati posao i završava zajedno sa njim a ne posle njega.",
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
          "Zbog toga je projekat i rađen: dve od tri šifre su implementirane a ne pozvane. To su kratki algoritmi kod kojih skoro svaka linija nosi teret: u kom smeru ide rotacija, gde se čuva originalna dužina, i činjenica da XXTEA zahteva da mu se aritmetika prelije pri prekoračenju a ne da podigne grešku. Heševi koji se poklapaju su ono što dokazuje da sve to staje na svoje mesto, bajt za bajtom.",
          "Druga polovina je podela na klijent i servis. Time što šifre stoje iza servisa, kriptografija ostaje van procesa koji iscrtava prozor, i to je ono što dozvoljava da se folder bilo koje veličine predaje bez zastoja u interfejsu, a znači i da su ista tri algoritma dostupna svemu drugom što ume da pozove taj servis.",
        ],
      },

      networkTrafficAnalyzer: {
        title: "Network Traffic Analyzer",
        tagline: "Snimak saobraćaja pročitan jednom, pa dvanaest pitanja postavljenih svakom paketu u njemu.",
        description:
          "Seminarski rad o analizi mrežnog saobraćaja, sa desktop aplikacijom koja to i pokazuje. Otvara .pcapng snimak kroz Pyshark, prolazi kroz svaki paket sloj po sloj i izvlači ono što svaki protokol nosi - HTTP zaglavlja, DNS upite, TCP flags, FTP kredencijale - u drvo koje se širi, uz grafikon kako se protokoli dele.",
        metaTitle: "Network Traffic Analyzer - Vuk Cvetković",
        metaDescription:
          "Projekat iz seminarskog rada u Python-u: Tkinter aplikacija koja čita .pcapng snimke kroz Pyshark, izvlači dvanaest protokola po paketu i prikazuje raspodelu protokola.",
        context: "Seminarski rad, Elektronski fakultet u Nišu",
        domain: "Analiza snimljenog mrežnog saobraćaja",

        flow: {
          entry: "Snimak u .pcapng formatu",
          entryLabel: "",
          core: "Pyshark, preko Wireshark-ovog tshark-a",
          branches: [
            { title: "Aplikativni protokoli", badge: "HTTP, HTTPS, DNS, FTP, SMTP" },
            { title: "Transport i kontrola", badge: "TCP, UDP, ICMP, ARP" },
            { title: "Adresiranje", badge: "IP, Ethernet" },
          ],
          exit: "Po jedan red za svaki paket",
          exitLabel: "",
          exitNote: "Širi se, i ulazi u grafikone",
        },

        overview: [
          "Rad je o tome kako se analizira mrežni saobraćaj i zašto je PCAP format ono na čemu su se svi ustalili. Aplikacija je deo koji je morao da radi: pokažeš joj snimak, a ona ti kaže šta je zaista unutra, a ne samo da su paketi prošli.",
          "Wireshark radi ispod svega ovoga - Pyshark vodi njegov tshark - i to je ono što parsiranju daje domašaj. Na tome aplikacija postavlja isti fiksni skup pitanja svakom paketu u fajlu i slaže odgovore na jedno mesto, što je oblik koji ti treba kada nešto tražiš a još ne znaš u kom je paketu.",
        ],

        steps: [
          {
            title: "Snimak se čita jednom",
            body: "Dijalog prima .pcapng ili .pcap, Pyshark ga otvori, i svi paketi se prevuku u listu u memoriji pre nego što se fajl zatvori. Ništa posle toga ne čita fajl ponovo, i to je ono što filtere čini jeftinim: oni se izvršavaju nad listom, a ne parsiraju snimak iznova.",
          },
          {
            title: "Svaki paket se obilazi sloj po sloj",
            body: "Imena protokola dolaze iz sopstvenog niza slojeva paketa, a ne iz nekakve tabele, pa paket prijavljuje ono što zaista sadrži i zbir na kraju prebrojava stvarne slojeve. Zatim se u nizu izvršava dvanaest ekstraktora, a svaki prvo pita da li je njegov protokol prisutan pre nego što bilo šta dotakne.",
          },
          {
            title: "Svaki ekstraktor pita pre nego što pročita",
            body: "Polje koje dati paket ne nosi nije greška, to je normalan slučaj, pa svaki ekstraktor proverava da li atribut postoji pre čitanja i prosto preskoči ono čega nema. Zato je drvo neravno: jedan HTTP paket pokaže desetak polja, sledeći dva, i oba su ispravna.",
          },
          {
            title: "Ono što je u čistom tekstu i izlazi kao čist tekst",
            body: "HTTP Basic kredencijali su base64, a ne šifrovanje, pa ih ekstraktor dekodira. FTP šalje korisničko ime i lozinku kao tekst, pa i oni izađu. To je iskren prikaz koji je rad i tražio: ne tvrdnja da su ti protokoli nesigurni, nego dekodiran string koji ti stoji u drvetu pred očima.",
          },
          {
            title: "Rezultati završavaju u drvetu i u grafikonima",
            body: "Svaki paket postane jedan red - vreme, izvorna i odredišna IP adresa, dužina, lista protokola - koji se širi u čvor po protokolu i list po polju. Isti prolaz vrati i broj pojavljivanja po protokolu, što Matplotlib iscrta kao pie i bar grafikon ugrađen pravo u prozor.",
          },
        ],

        features: [
          {
            title: "Dvanaest protokola, po paketu",
            body: "HTTP, HTTPS, DNS, FTP, SMTP, ARP, ICMP, IP, Ethernet, TCP, UDP i FPP, svaki sa svojim ekstraktorom i svojim skupom polja.",
          },
          {
            title: "Filteri po pet kriterijuma",
            body: "Opseg datuma i vremena, izvorna IP adresa, odredišna IP adresa i lista protokola razdvojena zapetama. Prazno vreme se vraća na ceo dan, od 00:00:00 do 23:59:59.",
          },
          {
            title: "Drvo, a ne zid teksta",
            body: "Paket, pa protokol, pa polje. Zanimljiv deo je obično tri klika niže, a ništa te ne tera da skroluješ pored paketa koji te ne zanimaju.",
          },
          {
            title: "Raspodela protokola na prvi pogled",
            body: "Pie grafikon za udeo i bar grafikon za broj, iscrtani ponovo svaki put kada se primeni filter, pa se vidi šta je filter zaista izbacio.",
          },
          {
            title: "Kredencijali u čistom tekstu, prikazani kao takvi",
            body: "Dekodirana HTTP Basic autentikacija i FTP korisnička imena i lozinke, što je najkraći mogući argument zašto se ti protokoli ne koriste nešifrovani.",
          },
          {
            title: "Obe generacije PCAP-a",
            body: "Dijalog prima .pcapng i .pcap. Noviji format nosi više metapodataka i više interfejsa, a čita se kroz isti kod.",
          },
        ],

        dataset: [],

        results: {
          columns: [],
          rows: [],
          notes: [],
        },

        takeaway: [
          "Disciplina koju format nameće je ono zbog čega ovo radi nad bilo kojim snimkom. Paket ne obećava ništa o tome koja polja nosi, pa je svako čitanje osigurano a polje kog nema je normalan ishod a ne otkaz. Pisanje dvanaest ekstraktora jednog po jednog je ono što to drži izričitim, i zato snimak sa dva paketa i snimak sa dve hiljade prolaze kroz isti kod bez ijednog specijalnog slučaja.",
          "To što se snimak čita jednom je ono zbog čega sve ostalo deluje trenutno. Svaki filter, svako prebrojavanje i svaki ponovo iscrtan grafikon rade nad listom koja je već u memoriji, pa promena datuma ili IP adrese odmah vraća novi pogled na isti snimak, bez vraćanja na fajl.",
        ],
      },

      easyBreathe: {
        title: "Easy Breathe",
        tagline: "Javna merenja polena u Srbiji, svedena na ona koja jednom čoveku zaista trebaju.",
        description:
          "Mobilna aplikacija nad otvorenim podacima države. Agencija za zaštitu životne sredine objavljuje merenja polena sa stanica širom Srbije, a aplikacija ih po rasporedu preslikava u sopstvenu bazu, pa ih svodi na alergene koje je jedan korisnik izabrao, u radijusu koji je sam odredio - na mapi, po nivou koncentracije, i kao push notifikaciju kada nivo poraste.",
        metaTitle: "Easy Breathe - Vuk Cvetković",
        metaDescription:
          "React Native i Expo aplikacija nad NestJS API-jem: otvoreni podaci o polenu u Srbiji, preslikani po rasporedu i filtrirani po lokaciji, radijusu i alergenima koje korisnik izabere.",
        context: "Seminarski rad o sistemima e-Uprave, Elektronski fakultet u Nišu",
        domain: "Otvoreni podaci države, polen i alergeni",

        flow: {
          entry: "Pet endpointa otvorenih podataka",
          entryLabel: "",
          core: "Seedovanje po rasporedu",
          branches: [
            { title: "Mesečno", badge: "Alergeni, tipovi, lokacije" },
            { title: "Na sat, od 9 do 12", badge: "Poleni, koncentracije" },
          ],
          exit: "Jedna baza, bez duplikata",
          exitLabel: "",
          exitNote: "Svedena na radijus, dan i tvoje alergene",
        },

        overview: [
          "Javni podaci postoje i dobri su: Agencija za zaštitu životne sredine svakodnevno objavljuje merenja polena sa mernih stanica širom Srbije, kao otvoreni API bez ključa i bez ograničenja. Ono što ne radi jeste da čoveku alergičnom na ambroziju kaže da li je danas loš dan tamo gde se on baš nalazi. Ta praznina je cela aplikacija.",
          "Zato se posao deli na dve strane. API preslikava otvorene podatke u sopstvenu bazu po rasporedu, jer telefon ne treba da prolazi kroz stotine hiljada merenja na nivou države da bi odgovorio na lokalno pitanje. Aplikacija onda postavlja jedno pitanje nad tim preslikom - šta je u vazduhu oko mene, od onoga na šta reagujem - i odgovara na mapi, u četiri nivoa, i u notifikaciji.",
        ],

        steps: [
          {
            title: "Otvoreni podaci se preslikavaju po dva sata",
            body: "Pet endpointa se ne menja istom brzinom, pa se ne ni pribavlja istom brzinom. Alergeni, tipovi alergena i lokacije se seeduju u devet, prvog u mesecu. Poleni i koncentracije, koji su ono što se menja, pribavljaju se na svaki sat između devet i podneva, kada se dnevna merenja i pojave.",
          },
          {
            title: "Seedovanje se bezbedno ponavlja",
            body: "Svaki seeder prvo pogleda koje id-jeve već ima, zadrži samo one koje nema, i njih ubaci. Tako posao na sat koji ne nađe ništa novo ne upiše ništa, isto pokretanje se može ponoviti bez dupliranja merenja, a prozor koji traži ide nedelju dana unazad - i to je ono što uhvati merenje objavljeno par dana posle nego što je uzeto.",
          },
          {
            title: "Lokacija i radijus postaju skup stanica",
            body: "Korisnikove koordinate i njegov izabrani radijus u kilometrima ulaze u MongoDB geoprostorni upit, uz deljenje radijusa Zemljinim da bi se dobila sfera koju upit traži. Ono što se vrati je svaka merna stanica dovoljno blizu da tom čoveku bude važna.",
          },
          {
            title: "Stanice i datum postaju merenja koja se računaju",
            body: "Ti id-jevi stanica i današnji datum izdvajaju dnevne zapise o polenu, a svaki od njih nosi id-jeve koncentracija izmerenih sa njim. Te koncentracije se onda pribave i skrate na alergene koje je korisnik stvarno izabrao, pa odgovor drži samo merenja koja su i blizu i relevantna.",
          },
          {
            title: "Svako merenje dobija nivo i mesto",
            body: "Broj u vazduhu sam po sebi ne znači ništa, pa se svaka koncentracija poredi sa objavljenim marginama sopstvenog alergena i izađe kao Low, Normal, High ili Very high. Merenje se onda formatira sa alergenom i stanicom sa koje je došlo, a to je ono što marker na mapi i detaljni prikaz prikazuju.",
          },
        ],

        features: [
          {
            title: "Izaberi svoje alergene",
            body: "Objavljeno ih je oko trideset, a profil je multiselect nad svima. Sve nizvodno - mapa, nivoi, notifikacije - prati tu listu.",
          },
          {
            title: "Tvoj radijus, tvoj interval",
            body: "Radijus pretrage u kilometrima i na koliko sati se proverava, oba se postavljaju na profilu. Interval postoji da provera može da bude česta koliko neko želi, a da baterija ne odlučuje umesto njega.",
          },
          {
            title: "Mapa koja se čita na prvi pogled",
            body: "Markeri na mernim stanicama u tvojoj blizini, obojeni po nivou. Klikneš na jedan i izlista ti koji su tvoji alergeni tu izmereni i koliko je svaki bio visok.",
          },
          {
            title: "Četiri nivoa, sa brojevima",
            body: "Low, Normal, High i Very high, svaki sa brojem alergena u blizini na tom nivou. Klik na nivo daje listu, klik na unos daje stanicu, opis i izmerenu vrednost.",
          },
          {
            title: "Notifikacija kada poraste",
            body: "Push notifikacija i poruka u aplikaciji kada nešto sa izabrane liste dostigne visoku koncentraciju u blizini, pa je aplikacija korisna i kada se ne otvori.",
          },
          {
            title: "Nalozi, bez komplikacija",
            body: "Registracija i prijava preko mejla, sa profilom koji drži alergene, radijus i interval, pa isti izbor prati nalog a ne telefon.",
          },
        ],

        dataset: [],

        results: {
          columns: [],
          rows: [],
          notes: [],
        },

        takeaway: [
          "Lekcija koja je ostala je da otvoreni podaci nisu isto što i upotrebljivi podaci. Pet endpointa koji se pozivaju jedan na drugi preko id-jeva, razmera na nivou države i nikakav način da se postavi geografsko pitanje znače da je vrednost u potpunosti u preslikavanju i spajanju. Odluka šta kopirati, koliko često, i kako kopiranje dva puta učiniti bezopasnim je mesto gde je inženjerski posao zaista bio.",
          "Druga polovina je to da odgovor mora da dođe a da se ne traži. Čovek sa alergijom ne otvara aplikaciju da proveri - želi da mu se kaže, u radijusu i intervalu koje postavi jednom. Push notifikacije nad backendom koji radi po rasporedu su ono što javni skup podataka pretvara u nešto što stigne do čoveka onog dana kada mu treba.",
        ],
      },
    },
  },

  games: {
    label: "Igre",

    index: {
      metaTitle: "Igre - Vuk Cvetković",
      metaDescription:
        "Igre u pretraživaču Vuka Cvetkovića, napravljene kao markup i CSS a ne kao canvas. Svaka dobija svoju stranicu.",
      heading: "Igre",
      intro:
        "Stvari napravljene zato što je vredelo. Rade u pretraživaču bez ijedne instalacije, i svaka ima stranicu o tome kako radi ispod.",
    },

    items: {
      twentyFortyEight: {
        /** One line, for the card on the index. */
        tagline:
          "Igra sa pločicama, napravljena od elemenata a ne od crteža, pa brojevi ostaju oštri a tabla prati temu.",

        metaDescription:
          "Igra sa pločicama, napravljena kao markup a ne kao canvas. Gurni tablu, spoji iste brojeve, i stigni do jedne pločice od 2048.",
        lead: "Gurni tablu u bilo kom smeru i svaka pločica klizi dokle može. Dve iste se spajaju u jednu dvostruku, a cilj je jedna pločica od 2048. Napravljeno od elemenata a ne od crteža, pa brojevi ostaju oštri na svakoj veličini i tabla prati temu.",

        score: "Rezultat",
        best: "Najbolje",
        highest: "Najveća pločica",
        newGame: "Nova igra",
        undo: "Poništi",
        hint: "Strelice ili WASD, a na telefonu prevlačenje.",

        won: {
          title: "2048",
          body: "Pločica je na tabli. Ne mora tu da se stane - igra traje dok ima šta da se pomeri.",
          keepGoing: "Nastavi",
        },

        over: {
          title: "Nema više poteza",
          body: "Tabla je puna i ništa se ni sa čim ne poklapa. Jedan korak unazad i dalje stoji ako je poslednji potez bio taj koji je odlučio.",
          restart: "Igraj ponovo",
        },

        how: {
          label: "Kako se igra",
          items: [
            {
              title: "Guraš celu tablu",
              description:
                "Strelice ili WASD na tastaturi, prevlačenje u bilo kom smeru na telefonu. Svaka pločica u jednom potezu putuje dokle god može, a ne jedno polje.",
            },
            {
              title: "Isti brojevi se spajaju",
              description:
                "Dve pločice sa istim brojem postaju jedna dvostruka. Pločica koja se upravo spojila je gotova za taj potez, pa red od četiri dvojke daje dve četvorke a ne jednu osmicu.",
            },
            {
              title: "Nova pločica posle svakog poteza",
              description:
                "Pojavi se na slobodnom polju i u devet od deset slučajeva je dvojka. Guranje koje ništa ne promeni nije potez, pa se ništa novo ne pojavljuje i ništa se ne gubi ako probaš.",
            },
            {
              title: "Izaberi ugao i ostani u njemu",
              description:
                "Drži najveću pločicu u jednom uglu i nikad ne guraj od njega. Veći deo igre je odbijanje poteza koji je odatle diže.",
            },
          ],
        },

        close: {
          label: "Kako je napravljeno",
          paragraphs: [
            "Nema canvasa ni biblioteke za igre. Pločica je element sa dve custom property vrednosti, njena pozicija je translate izračunat u odnosu na njenu sopstvenu veličinu, a klizanje kompozituje pretraživač. Odatle dolazi glatkoća: potez menja transform i ništa drugo, pa nijedan njegov deo ne prolazi kroz layout.",
            "Druga polovina je to da svaka pločica zadržava svoj element dok postoji. Tabla se nikad ne iscrtava iz stanja - potez ažurira brojeve na čvorovima koji su već tu, i zato pločica vidljivo putuje odakle je bila umesto da nestane i pojavi se na drugom mestu.",
            "Brojevi su tekst, pa su oštri kao i ostatak stranice i skaliraju se sa veličinom koju je čitalac podesio. Boje su tokeni u istom stilu kao i sve drugo, i zato tabla odgovara na prekidač teme u zaglavlju.",
            "Unos ide kroz jednu funkciju sa tri mesta, pa taster, prevlačenje i dodir ne mogu da počnu da znače malo različite stvari. Strelice pripadaju tabli samo dok je tabla na ekranu, a potez gurnut pre nego što je prethodni sleteo se zadržava umesto da se odbaci - i zato brzo igranje nikad ne košta potez.",
          ],
        },
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
