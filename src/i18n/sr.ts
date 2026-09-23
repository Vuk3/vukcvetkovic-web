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
    title: "Vuk Cvetković - Software engineer",
    description:
      "Software engineer iz Niša. Radim ceo proizvod: backend u Node.js-u (NestJS, Express), deployment i event-driven komunikaciju na AWS-u i frontend u React-u.",
    ogImageAlt: "Vuk Cvetković, software engineer",
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
    // Left in English, as the job titles are: "softverski inženjer" reads as the academic title.
    role: "Software engineer",
    positioning:
      "Radim ceo proizvod, od modela podataka do produkcije. Backend pišem u Node.js-u (NestJS, Express) i u .NET-u. Na AWS-u radim deployment i event-driven komunikaciju između servisa, a sve što korisnik vidi pravim u React-u.",
    cta: "Kontaktirajte me",
    portraitAlt: "Portret Vuka Cvetkovića",
    portraitPlaceholder: "portret",
  },

  about: {
    label: "O meni",
    paragraphs: [
      "Radim na klijentskim projektima od prvog modela podataka do deploymenta na AWS-u. Uvek krećem od domena: koji su podaci, ko sme da im pristupa i sa kojim sistemima treba da komuniciraju, a iz toga proizlaze API, servisi i React interfejs.",
      "Završio sam master studije softverskog inženjerstva. U master radu sam poredio dva ekosistema mašinskog učenja na istom zadatku: YOLOv8m model u Python-u i ML.NET model u .NET-u, iza jednog NestJS gateway-a i jednog React frontenda. Za diplomski rad sam implementirao algoritme šifrovanja RC6 i XXTEA po njihovim specifikacijama.",
      "Najbolji primer mog frontend rada je sam ovaj sajt: četiri jezika i pet igara napisanih bez canvasa i bez biblioteke za igre. Uz svaku igru postoji tekst o tome kako je napravljena.",
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
          "Backend servisi u Node.js-u (NestJS, Express): REST API-ji, JWT autentikacija, kontrola pristupa po rolama i integracije sa eksternim sistemima, nad SQL i NoSQL bazama.",
          "Isti posao u .NET-u, kada klijent već radi na njemu, po principima Clean Architecture, tako da poslovna logika ostane odvojena od framework-a.",
          "Na AWS-u: S3, ECS, EC2, Lambda, Route 53 i EventBridge, za deployment i event-driven komunikaciju između servisa.",
        ],
      },
      novateq: {
        role: "Full-stack developer",
        bullets: [
          "Backend servisi u .NET Web API-ju i sajt firme u ASP.NET MVC-u, prilagođeni potrebama svakog klijenta.",
          "Rešavao prijavljene probleme na Sportsbook platformi i održavao njenu stabilnost, a prošao sam i kroz casino projekte da bih upoznao kako je taj deo napravljen.",
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
        "Projekti koje je napravio Vuk Cvetković, software engineer iz Niša: šta svaki sistem radi, kako je napravljen i kakvi su rezultati.",
      heading: "Projekti",
      intro:
        "Projekti o kojima mogu da pišem detaljno, sa arhitekturom i rezultatima, a ne samo sa screenshotom. Svaki ima svoju stranicu.",
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
      takeaway: "Šta sam naučio",
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
          "Moj master rad. Ista slika prolazi kroz YOLOv8m model u Python-u i ML.NET model u .NET-u, oba iza jednog gateway-a koji odgovara u istom formatu, pa isti React frontend iscrtava rezultat bilo kog od njih. Posle ponovnog anotiranja skupa podataka YOLOv8m je dostigao 0,916 mAP@0.5, a ML.NET 0,748.",
        metaTitle: "Uporedni sistem za detekciju objekata - Vuk Cvetković",
        metaDescription:
          "Sistem iz master rada: YOLOv8m u Python-u i ML.NET u .NET-u iza jednog NestJS gateway-a, upoređeni na istom skupu podataka o zaštitnoj opremi.",
        context: "Master rad, Elektronski fakultet u Nišu",
        domain: "Lična zaštitna oprema na gradilištu",

        flow: {
          entry: "React frontend",
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
          "Rad istražuje šta se menja kada se isti zadatak detekcije napravi dva puta: jednom u Python-u, koji je standard u istraživanju, i jednom u .NET-u, na kom već radi backend. Sistem obučava YOLOv8m i ML.NET model na istim anotiranim slikama, stavlja oba iza jednog API-ja i pušta sliku kroz jedan ili kroz oba.",
          "Domen je lična zaštitna oprema na gradilištu, sa šest klasa: šlem, prsluk i rukavice, svaka kao prisutna ili odsutna. Ključne su negativne klase: sistem je koristan samo ako može da kaže da neko ne nosi šlem, a ne samo da se šlem nalazi negde u kadru.",
        ],

        steps: [
          {
            title: "Frontend šalje sliku",
            body: "React šalje fajl kao multipart/form-data, a izabrani model ide u posebnom polju. Kada se traže oba, dva zahteva idu paralelno, pa se modeli porede na istoj slici u istom trenutku.",
          },
          {
            title: "Gateway prosleđuje zahtev",
            body: "NestJS je jedina adresa koju frontend poznaje. Prima upload i prosleđuje ga FastAPI ili ASP.NET Core servisu, pa se ML servisi mogu menjati nezavisno od klijenta.",
          },
          {
            title: "Servis pokreće inference",
            body: "Python učitava sliku u RGB i predaje je YOLOv8m modelu. Težine modela ostaju učitane u memoriji, pa se .pt fajl ne čita pri svakom zahtevu. .NET strana pretvara sliku u MLImage i bira ML.NET model po id-u.",
          },
          {
            title: "Oba servisa vraćaju isti format",
            body: "Klasa, score i okvir kao x1, y1, x2, y2, uz id modela, skup anotacija na kom je obučen i originalne dimenzije slike. .NET strana prvo ograničava koordinate na te dimenzije, pa okvir nikad ne izlazi van slike.",
          },
          {
            title: "Frontend iscrtava rezultat",
            body: "Pošto je odgovor isti u oba slučaja, interfejs nema posebnu granu ni za YOLO ni za ML.NET. Koordinate se skaliraju sa originalne na prikazanu veličinu, a okviri, klase i pouzdanosti se iscrtavaju preko slike.",
          },
        ],

        features: [
          {
            title: "Jedan model ili oba",
            body: "Jedan servis ili oba istovremeno, u dva panela nad istom slikom, uz izbor bilo kog od četiri obučena modela.",
          },
          {
            title: "Podesiv prag pouzdanosti",
            body: "Slajder skriva sve ispod praga, kao što i pravi sistem reaguje samo na predikcije iznad granice, a ne na sve što model vrati.",
          },
          {
            title: "Lista svih detekcija",
            body: "Klasa i score za svaku detekciju. Izborom jedne ona se izdvaja na slici, što pomaže kada se u kadru preklapa osam okvira.",
          },
          {
            title: "Okviri, ispuna, zoom i pan",
            body: "Okviri kao linije ili kao ispunjene površine, jedna detekcija ili sve, uz zoom i pan za proveru okvira naspram piksela ispod njega.",
          },
          {
            title: "Dva odgovora uporedo",
            body: "Trajanje zahteva, broj detekcija, prosečna pouzdanost, najjača detekcija i koji servis je prvi odgovorio.",
          },
          {
            title: "Provera stanja servisa",
            body: "Gateway, Python API i .NET API javljaju status i vreme odgovora. To su tri odvojena procesa, pa kada jedan ne radi, interfejs pokazuje koji.",
          },
        ],

        dataset: [
          "Skup podataka je sastavljen u Roboflow-u od dva javna skupa, koje sam pregledao i spojio u jedan: 2.911 slika, od čega 2.374 za trening, 290 za validaciju i 247 za test, automatski orijentisanih i svedenih na 640x640. Python strana ga koristi u YOLO formatu, a .NET strana u COCO formatu, jer Model Builder za detekciju očekuje COCO. Tako oba alata dobijaju svoj format, nad istim slikama i istim klasama.",
          "Onda je došao deo koji nisam planirao. Prva verzija je imala 8.813 anotacija, a posle ponovnog pregleda taj broj je narastao na 17.942, što znači da više od polovine objekata nije bilo označeno. Objekat koji postoji na slici, a nema ga u oznakama, tokom obučavanja uči model da je to pozadina, a tokom evaluacije mu se računa kao greška kada ga model ipak detektuje.",
          "Oba modela su obučavana 50 epoha na 640x640, polazeći od pretrained težina, sa istim parametrima za obe verzije skupa, da bi razlika u rezultatima poticala od kvaliteta anotacija, a ne od konfiguracije. Model Builder se zaustavlja na obučenom modelu, pa je za .NET stranu trebao poseban servis za evaluaciju: učitava COCO anotacije, radi predikciju nad validacionim skupom i računa precision, recall, F1 i mAP@0.5, uz matrice konfuzije i precision-recall krive. Tako ML.NET dobija iste metrike koje Ultralytics prikazuje sam.",
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
            "Ponovno anotiranje popravilo je svaku metriku kod oba modela. YOLOv8m je porastao sa 0,790 na 0,916 mAP@0.5, a ML.NET sa 0,580 na 0,748, pa je slabiji model relativno dobio više, 29 procenata prema 16. Loše anotacije su njega najviše i kočile.",
            "YOLOv8m je ispred po brojevima, a najvažnija razlika je u recall-u: 0,867 prema 0,709 na ispravljenom skupu, uz skoro isti precision. Kod zaštitne opreme to je presudno, jer propuštena detekcija znači da sistem čoveka bez opreme prijavi kao ispravno opremljenog, a precision to ne može da pokaže.",
            "Poređenje je fer jer su uslovi bili isti na obe strane: isti domen slika, istih šest klasa i uporedivi parametri, bez posebnog podešavanja za svaki model.",
          ],
        },

        takeaway: [
          "Na rezultat su više uticali podaci nego izbor framework-a. Ponovno anotiranje istih 2.911 slika popravilo je oba modela više nego što iznosi razlika između dva ekosistema, i to nije zaključak koji sam očekivao.",
          "Sa inženjerske strane, zaključci su praktičniji. Python je dao prostor za eksperimentisanje i sam generisao materijal za evaluaciju, .NET je dao model koji se direktno uklapa u ASP.NET Core servis, a zajednički format odgovora omogućava da jedan frontend radi sa oba modela bez ikakve razlike.",
        ],
      },

      encryptix: {
        title: "Encryptix",
        tagline: "Tri algoritma šifrovanja iza jednog servisa, i heš na oba kraja kao dokaz da je fajl vraćen bez izmene.",
        description:
          "Moj diplomski rad. Desktop klijent šalje ceo folder WCF servisu, koji svaki fajl šifruje AES, RC6 ili XXTEA algoritmom - poslednja dva sam napisao po specifikaciji, bez biblioteke - i beleži SHA-512 heš pre i posle svakog koraka, pa se može dokazati da je fajl vraćen bez izmene. Paralelna obrada je skratila obradu 150 fajlova sa 68,91 na 44,16 sekundi.",
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
            { title: "RC6", badge: "Ručna implementacija, 20 rundi" },
            { title: "XXTEA", badge: "Ručna implementacija, Fajstelova mreža" },
          ],
          exit: "Po jedan šifrovan fajl za svaki ulazni",
          exitLabel: "",
          exitNote: "SHA-512 upisan pre i posle",
        },

        overview: [
          "Aplikacija radi sa celim folderom, a ne sa pojedinačnim fajlom. Izabere se direktorijum, aplikacija pročita sve u njemu i u svim podfolderima, i jedan od tri simetrična algoritma šifruje ceo skup. Šifrovani fajlovi, dešifrovani fajlovi i heš zapisi upisuju se u foldere koje korisnik izabere.",
          "Algoritma ima tri, a samo je jedan gotov. AES je implementacija iz .NET biblioteke, koju bi koristila svaka ozbiljna aplikacija. RC6 i XXTEA sam napisao po njihovim specifikacijama, i u tome je bio glavni deo posla: proširenje ključa, dopunjavanje blokova, rotacije i namerno prekoračenje celobrojne vrednosti na koje se XXTEA oslanja.",
        ],

        steps: [
          {
            title: "Klijent čita folder",
            body: "Posle izbora foldera, rekurzivni obilazak čita svaki fajl kao niz bajtova, bez obzira na ekstenziju, i čuva ime, ekstenziju, putanju i sadržaj zajedno kao jedan zapis. Sadržaj se ne tumači, pa .txt i .exe prolaze isti put kroz program.",
          },
          {
            title: "Čitanje u pozadini, da prozor ne zablokira",
            body: "U Windows Forms-u sve kontrole pripadaju jednoj, UI niti. Kada bi se veliki folder čitao na njoj, prozor bi se zamrzao, zajedno sa loaderom koji treba da se vrti. Zato se čitanje izvršava kao Task, a nastavak se vraća na sinhronizacioni kontekst forme, jer se samo odatle dugmad smeju ponovo omogućiti.",
          },
          {
            title: "Lista se šalje servisu",
            body: "Klijent poziva WCF servis preko HTTP-a. Zbog količine podataka obe strane su morale drugačije da se konfigurišu: limiti bafera su podignuti na najveću vrednost koju int može da primi, a režim prenosa je prebačen sa buffered na streamed, pa se u baferu drži samo zaglavlje poruke, a ne cela lista fajlova. Tajmaut je deset minuta na obe strane.",
          },
          {
            title: "Servis šifruje, fajl po fajl",
            body: "Izabrani algoritam dobija listu, ključ i, za AES, inicijalizacioni vektor. RC6 i XXTEA rade samo sa celim blokovima, pa svaki dopunjava niz bajtova do veličine bloka i upisuje originalnu dužinu u prva četiri bajta. Tako dešifrovanje zna tačno koliko dopune da odbaci, umesto da pogađa gde se fajl završava.",
          },
          {
            title: "Heš na oba kraja",
            body: "Pored svakog fajla nastaje tekstualni fajl sa četiri SHA-512 vrednosti: pre šifrovanja, posle šifrovanja, pre dešifrovanja i posle dešifrovanja. Važne su prva i poslednja, i moraju biti identične. Na tome se zasniva provera integriteta, i svako može da je ponovi otvaranjem tog fajla.",
          },
        ],

        features: [
          {
            title: "Ceo folder odjednom",
            body: "Sa svim podfolderima, do bilo koje dubine. Izlazna struktura foldera prati ulaznu, a računa se iz putanje svakog fajla u odnosu na koreni folder, a ne praćenjem rekurzije.",
          },
          {
            title: "Tri algoritma, jedna forma",
            body: "AES sa ključem od 32 znaka i IV od 16 znakova, RC6 i XXTEA sa ključem od 16 znakova. Svaki algoritam ima svoj prozor, a svako polje se validira pre nego što se išta upiše.",
          },
          {
            title: "Dokaz da je fajl isti",
            body: "SHA-512 originalnog sadržaja pre šifrovanja poredi se sa SHA-512 sadržaja posle dešifrovanja. Ako su jednaki, ništa nije izgubljeno.",
          },
          {
            title: "Sekvencijalno ili paralelno",
            body: "Oba režima postoje, a bira se jednim checkbox-om. U paralelnom režimu lista fajlova se deli kroz paralelnu petlju, a pošto nijedan fajl ne zavisi od drugog, ništa ne mora da se zaključava ni spaja. Koliko to vredi, pokazuju rezultati ispod.",
          },
          {
            title: "Progress bar koji prati stvarni posao",
            body: "Dok servis radi, napreduje prema ukupnom broju bajtova, a kada se poziv vrati, cancellation token ga odmah dopuni do kraja. Tako se završava tačno kada i posao.",
          },
          {
            title: "Pregled fajlova pre početka",
            body: "Stablo svih učitanih fajlova, potpuno otvoreno, da se pre početka vidi šta će biti šifrovano.",
          },
        ],

        dataset: [],

        results: {
          columns: ["Režim", "Fajlova", "Šifrovanje (s)", "Dešifrovanje (s)"],
          rows: ["Sekvencijalno", "Paralelno"],
          notes: [
            "Istih 150 fajlova, isti RC6 ključ i isti izlazni folderi, jednom u svakom režimu. Paralelno šifrovanje je trajalo 44,16 sekundi umesto 68,91, a dešifrovanje 40,39 umesto 70,13, oko trećinu kraće u oba smera.",
            "Dobitak dolazi od toga što su fajlovi nezavisni: paralelnoj petlji ne trebaju ni zaključavanje ni redosled, pa nijedan fajl ne čeka prethodni.",
          ],
        },

        takeaway: [
          "Poenta projekta je bila da dva od tri algoritma napišem sam, a ne da ih pozovem iz biblioteke. To su kratki algoritmi u kojima je skoro svaka linija bitna: u kom smeru ide rotacija, gde se čuva originalna dužina, i to da XXTEA zahteva da se aritmetika pri prekoračenju prelije, a ne da baci grešku. Heševi koji se poklapaju dokazuju da je sve tačno, bajt po bajt.",
          "Druga polovina je podela na klijent i servis. Kriptografija radi u servisu, a ne u procesu koji iscrtava prozor, i ista tri algoritma može da koristi svako ko može da pozove taj servis.",
        ],
      },

      networkTrafficAnalyzer: {
        title: "Network Traffic Analyzer",
        tagline: "Snimak mrežnog saobraćaja učitan jednom, a svaki paket u njemu proveren na dvanaest protokola.",
        description:
          "Seminarski rad o analizi mrežnog saobraćaja, sa desktop aplikacijom kao demonstracijom. Aplikacija otvara .pcapng snimak preko Pyshark-a, prolazi kroz svaki paket sloj po sloj i izvlači podatke svakog protokola - HTTP zaglavlja, DNS upite, TCP flagove, FTP kredencijale - u stablo koje se otvara, uz grafikon raspodele protokola.",
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
          exitNote: "Otvara se u stablo i ulazi u grafikone",
        },

        overview: [
          "Rad obrađuje kako se analizira mrežni saobraćaj i zašto je PCAP postao standardni format za to. Aplikacija to primenjuje u praksi: otvori se snimak, a ona pokaže šta svaki paket nosi, protokol po protokol.",
          "Ispod svega radi Wireshark: Pyshark pokreće njegov tshark, i zato parser razume toliko protokola. Aplikacija nad tim proverava svaki paket po istom skupu pravila i sve rezultate slaže na jedno mesto, što je korisno kada se nešto traži, a još se ne zna u kom je paketu.",
        ],

        steps: [
          {
            title: "Snimak se čita jednom",
            body: "Dijalog prima .pcapng ili .pcap, Pyshark ga otvara, i svi paketi se učitaju u listu u memoriji pre nego što se fajl zatvori. Fajl se posle toga više ne čita, pa su filteri brzi: izvršavaju se nad listom, bez ponovnog parsiranja snimka.",
          },
          {
            title: "Svaki paket se čita sloj po sloj",
            body: "Imena protokola se uzimaju iz slojeva samog paketa, a ne iz neke tabele, pa paket pokazuje ono što stvarno sadrži, a statistika na kraju broji stvarne slojeve. Zatim se redom izvršava dvanaest ekstraktora, i svaki prvo proveri da li je njegov protokol prisutan.",
          },
          {
            title: "Svaki ekstraktor proverava pre čitanja",
            body: "Ako paket nema neko polje, to nije greška nego normalan slučaj, pa svaki ekstraktor proveri da li atribut postoji i preskoči ono čega nema. Zato stablo nije ujednačeno: jedan HTTP paket ima desetak polja, sledeći dva, i oba su ispravna.",
          },
          {
            title: "Ono što ide kao čist tekst, tako se i prikazuje",
            body: "HTTP Basic kredencijali su samo base64, bez šifrovanja, pa ih ekstraktor dekodira. FTP šalje korisničko ime i lozinku kao običan tekst, pa se i oni prikažu. To je demonstracija koja je radu trebala: umesto tvrdnje da su ti protokoli nesigurni, dekodirana lozinka stoji u stablu.",
          },
          {
            title: "Rezultati u stablu i na grafikonima",
            body: "Svaki paket postaje jedan red - vreme, izvorna i odredišna IP adresa, dužina, lista protokola - koji se otvara u čvor za svaki protokol i list za svako polje. Isti prolaz vraća i broj pojavljivanja svakog protokola, koji Matplotlib crta kao pie i bar grafikon, direktno u prozoru.",
          },
        ],

        features: [
          {
            title: "Dvanaest protokola u svakom paketu",
            body: "HTTP, HTTPS, DNS, FTP, SMTP, ARP, ICMP, IP, Ethernet, TCP, UDP i FPP, svaki sa svojim ekstraktorom i svojim skupom polja.",
          },
          {
            title: "Filteri po pet kriterijuma",
            body: "Opseg datuma i vremena, izvorna IP adresa, odredišna IP adresa i lista protokola razdvojena zapetama. Prazno vreme znači ceo dan, od 00:00:00 do 23:59:59.",
          },
          {
            title: "Stablo umesto zida teksta",
            body: "Paket, pa protokol, pa polje, a svaki nivo se otvara tek na klik, pa i snimak sa hiljadama paketa ostaje pregledan.",
          },
          {
            title: "Raspodela protokola na prvi pogled",
            body: "Pie grafikon za udeo i bar grafikon za broj, ponovo iscrtani posle svakog filtera, pa se vidi šta je filter izbacio.",
          },
          {
            title: "Kredencijali u čistom tekstu",
            body: "Dekodirani HTTP Basic kredencijali i FTP korisnička imena i lozinke, što je najkraći dokaz zašto se ti protokoli ne koriste bez šifrovanja.",
          },
          {
            title: "Oba PCAP formata",
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
          "Aplikacija radi sa bilo kojim snimkom zato što nijedno polje ne podrazumeva. Paket ne garantuje koja polja nosi, pa je svako čitanje zaštićeno, a polje koje nedostaje je normalan slučaj, ne greška. Dvanaest ekstraktora napisanih pojedinačno to drže eksplicitnim, pa snimak sa dva paketa i snimak sa dve hiljade prolaze kroz isti kod, bez ijednog posebnog slučaja.",
          "Zato što se snimak čita samo jednom, sve ostalo radi odmah. Svaki filter, svako prebrojavanje i svaki novi grafikon rade nad listom koja je već u memoriji, pa promena datuma ili IP adrese odmah daje novi prikaz, bez ponovnog čitanja fajla.",
        ],
      },

      easyBreathe: {
        title: "Easy Breathe",
        tagline: "Javna merenja polena u Srbiji, svedena na ona koja su važna jednom korisniku.",
        description:
          "Mobilna aplikacija nad otvorenim podacima države. Agencija za zaštitu životne sredine objavljuje merenja polena sa stanica širom Srbije, a aplikacija ih po rasporedu kopira u svoju bazu i filtrira na alergene koje je korisnik izabrao, u radijusu koji je sam podesio - na mapi, po nivou koncentracije i kao push notifikaciju kada nivo poraste.",
        metaTitle: "Easy Breathe - Vuk Cvetković",
        metaDescription:
          "React Native i Expo aplikacija nad NestJS API-jem: otvoreni podaci o polenu u Srbiji, preuzeti po rasporedu i filtrirani po lokaciji, radijusu i alergenima koje korisnik izabere.",
        context: "Seminarski rad o sistemima e-Uprave, Elektronski fakultet u Nišu",
        domain: "Otvoreni podaci države, polen i alergeni",

        flow: {
          entry: "Pet endpointa otvorenih podataka",
          entryLabel: "",
          core: "Seedovanje po rasporedu",
          branches: [
            { title: "Mesečno", badge: "Alergeni, tipovi, lokacije" },
            { title: "Svakog sata, od 9 do 12", badge: "Poleni, koncentracije" },
          ],
          exit: "Jedna baza, bez duplikata",
          exitLabel: "",
          exitNote: "Svedena na radijus, dan i tvoje alergene",
        },

        overview: [
          "Javni podaci postoje i dobri su: Agencija za zaštitu životne sredine svakog dana objavljuje merenja polena sa mernih stanica širom Srbije, kao otvoreni API bez ključa i bez ograničenja. Ali čoveku alergičnom na ambroziju ne kažu da li je danas loš dan tamo gde se nalazi. Aplikacija postoji da bi to rešila.",
          "Zato je posao podeljen na dva dela. API po rasporedu kopira otvorene podatke u svoju bazu, jer telefon ne treba da prolazi kroz stotine hiljada merenja iz cele zemlje da bi odgovorio na lokalno pitanje. Aplikacija zatim nad tom kopijom postavlja jedno pitanje - šta od onoga na šta sam alergičan ima u vazduhu oko mene - i odgovara na mapi, u četiri nivoa i notifikacijom.",
        ],

        steps: [
          {
            title: "Podaci se preuzimaju u dva ritma",
            body: "Pet endpointa se ne menja istom brzinom, pa se ni ne preuzimaju istom brzinom. Alergeni, tipovi alergena i lokacije preuzimaju se prvog u mesecu u devet časova. Poleni i koncentracije, koji se stvarno menjaju, preuzimaju se svakog sata od devet do podne, kada se objavljuju dnevna merenja.",
          },
          {
            title: "Seedovanje može bezbedno da se ponovi",
            body: "Svaki seeder prvo proveri koje id-jeve već ima i ubaci samo nove. Tako satni job koji ne nađe ništa novo ne upiše ništa, isto pokretanje može da se ponovi bez dupliranja merenja, a period koji se traži ide nedelju dana unazad, pa se uhvate i merenja objavljena nekoliko dana nakon što su izmerena.",
          },
          {
            title: "Od lokacije i radijusa do liste stanica",
            body: "Koordinate korisnika i izabrani radijus u kilometrima idu u MongoDB geoprostorni upit, a radijus se deli poluprečnikom Zemlje, jer upit tako očekuje radijus sfere. Rezultat su sve merne stanice dovoljno blizu korisnika.",
          },
          {
            title: "Od stanica i datuma do relevantnih merenja",
            body: "Id-jevi tih stanica i današnji datum izdvajaju dnevne zapise o polenu, a svaki zapis sadrži id-jeve koncentracija izmerenih uz njega. Te koncentracije se zatim učitaju i filtriraju na alergene koje je korisnik izabrao, pa odgovor sadrži samo merenja koja su i blizu i relevantna.",
          },
          {
            title: "Svako merenje dobija nivo i mesto",
            body: "Sam broj ne govori mnogo, pa se svaka koncentracija poredi sa objavljenim granicama za taj alergen i dobija nivo Low, Normal, High ili Very high. Uz merenje se zatim dodaju alergen i stanica, i to se prikazuje na markeru na mapi i u detaljnom prikazu.",
          },
        ],

        features: [
          {
            title: "Izaberi svoje alergene",
            body: "Objavljeno ih je tridesetak, a na profilu se biraju iz liste sa višestrukim izborom. Sve ostalo - mapa, nivoi, notifikacije - prati taj izbor.",
          },
          {
            title: "Tvoj radijus, tvoj interval",
            body: "Radijus pretrage u kilometrima i na koliko sati se proverava, oba se podešavaju na profilu. Kraći interval znači svežija upozorenja, a duži štedi bateriju.",
          },
          {
            title: "Pregledna mapa",
            body: "Markeri na mernim stanicama u blizini, obojeni po nivou. Klik na marker prikazuje koji su tvoji alergeni tu izmereni i koliki je nivo svakog.",
          },
          {
            title: "Četiri nivoa, sa brojevima",
            body: "Low, Normal, High i Very high, svaki sa brojem alergena u blizini na tom nivou. Klik na nivo otvara listu, a klik na stavku prikazuje stanicu, opis i izmerenu vrednost.",
          },
          {
            title: "Notifikacija kada poraste",
            body: "Push notifikacija i poruka u aplikaciji kada neki od izabranih alergena dostigne visoku koncentraciju u blizini, pa aplikacija radi svoj posao i kada nije otvorena.",
          },
          {
            title: "Jednostavni nalozi",
            body: "Registracija i prijava mejlom, a profil čuva alergene, radijus i interval, pa podešavanja idu uz nalog, a ne uz telefon.",
          },
        ],

        dataset: [],

        results: {
          columns: [],
          rows: [],
          notes: [],
        },

        takeaway: [
          "Glavna lekcija je da otvoreni podaci nisu isto što i upotrebljivi podaci. Pet endpointa koji se povezuju preko id-jeva, podaci za celu zemlju i nikakva mogućnost geografskog upita znače da je sva vrednost u kopiranju i spajanju podataka. Najviše inženjerskog posla je bilo u odlukama šta kopirati, koliko često i kako da dvostruko kopiranje ništa ne pokvari.",
          "Druga lekcija je da odgovor mora da stigne sam. Čovek sa alergijom ne otvara aplikaciju da proveri - želi da bude obavešten, u radijusu i intervalu koje jednom podesi. Push notifikacije i backend koji radi po rasporedu pretvaraju javne podatke u upozorenje koje stigne baš onog dana kada je potrebno.",
        ],
      },
    },
  },

  games: {
    label: "Igre",

    /** The colon is doing grammatical work here: the date Intl prints is
     *  nominative, and "Napravljeno" running into it would want the genitive.
     *  See the note in en.ts. */
    built: "Napravljeno:",

    sound: "Zvuk",

    /** Left in English on purpose: "uživo" says live *play*, not released. See
     *  the note in en.ts. */
    status: {
      live: "Live",
      beta: "Beta",
    },

    index: {
      metaTitle: "Igre - Vuk Cvetković",
      metaDescription:
        "Igre u pretraživaču koje je napravio Vuk Cvetković: 2048, Minolovac, Memorija u dvanaest nivoa, Potapanje brodova protiv četiri protivnika i igra u kojoj se planete spajaju u veće. Svaka ima svoju stranicu.",
      heading: "Igre",
      intro:
        "Igre koje vredi igrati više puta. Svaka ima svoju stranicu, a ispod igre i tekst o tome kako je napravljena, za one koje to zanima.",
    },

    items: {
      twentyFortyEight: {
        name: "2048",

        /** One line, for the card on the index. */
        tagline:
          "Pomeri tablu i sve pločice klize do kraja. Dve pločice sa istim brojem spajaju se u jednu duplo veću, sve do 2048.",

        metaDescription:
          "Igra sa pločicama: pomeraj tablu, spajaj iste brojeve i stigni do pločice 2048.",
        lead: "Pomeri tablu u bilo kom smeru i sve pločice klize do kraja. Dve pločice sa istim brojem spajaju se u jednu duplo veću, a cilj je da napraviš pločicu 2048.",

        score: "Rezultat",
        best: "Najbolje",
        highest: "Najveća pločica",
        newGame: "Nova igra",
        undo: "Poništi",
        hint: "Strelice ili WASD, a na telefonu prevlačenje.",

        won: {
          title: "2048",
          body: "Pločica 2048 je na tabli. Ne moraš tu da staneš - igra traje dok god ima poteza.",
          keepGoing: "Nastavi",
        },

        over: {
          title: "Nema više poteza",
          body: "Tabla je puna i nijedne dve susedne pločice nisu iste. Ako je presudio poslednji potez, i dalje možeš da ga poništiš.",
          restart: "Igraj ponovo",
        },

        how: {
          label: "Kako se igra",
          items: [
            {
              title: "Pomeraš celu tablu",
              description:
                "Strelice ili WASD na tastaturi, prevlačenje u bilo kom smeru na telefonu. Svaka pločica u jednom potezu ide do kraja, a ne samo jedno polje.",
            },
            {
              title: "Isti brojevi se spajaju",
              description:
                "Dve pločice sa istim brojem postaju jedna duplo veća. Pločica koja se upravo spojila ne može ponovo u istom potezu, pa red od četiri dvojke daje dve četvorke, a ne jednu osmicu.",
            },
            {
              title: "Nova pločica posle svakog poteza",
              description:
                "Pojavljuje se na slobodnom polju i u devet od deset slučajeva je dvojka. Pomeranje koje ništa ne promeni ne računa se kao potez, pa se tada ne pojavljuje nova pločica i ništa ne gubiš ako probaš.",
            },
            {
              title: "Izaberi ugao i ostani u njemu",
              description:
                "Drži najveću pločicu u jednom uglu i nikad ne pomeraj tablu od njega. Najveći deo igre je izbegavanje poteza koji je izvlači iz ugla.",
            },
          ],
        },

        close: {
          label: "Kako je napravljeno",
          paragraphs: [
            "Bez canvasa i bez biblioteke za igre. Pločica je element sa dva CSS custom property-ja, pozicija joj je translate izračunat u odnosu na njenu veličinu, a klizanje pretraživač radi kroz compositing. Zato je animacija glatka: potez menja samo transform, pa ništa ne prolazi kroz layout.",
            "Drugi deo je da svaka pločica zadržava isti element dok postoji. Tabla se nikad ne iscrtava ispočetka iz stanja - potez samo menja brojeve na elementima koji već postoje, pa se vidi kako pločica putuje, umesto da nestane i pojavi se na drugom mestu.",
            "Brojevi su običan tekst, pa su oštri kao i ostatak stranice i prate veličinu fonta koju je čitalac podesio. Boje su tokeni iz istog stylesheet-a kao i sve ostalo, pa tabla prati prekidač teme u zaglavlju.",
            "Tastatura, prevlačenje i dodir idu kroz istu funkciju, pa uvek rade isto. Strelice pomeraju tablu samo dok je tabla na ekranu, a potez napravljen pre nego što se prethodni završio čeka svoj red umesto da se izgubi, pa brzo igranje nikad ne košta potez.",
          ],
        },
      },

      minesweeper: {
        name: "Minolovac",

        tagline:
          "Otvori sva polja koja nisu mine. Svaki broj pokazuje koliko mina ga okružuje, a ostalo se zaključuje iz toga.",

        metaDescription:
          "Minolovac u pretraživaču, na početničkoj, srednjoj i ekspertskoj tabli, sa prvim klikom koji je uvek siguran.",
        lead: "Otvori sva polja koja nisu mine. Broj pokazuje koliko od osam susednih polja krije minu, a sve ostalo se zaključuje iz toga. Tri table, u veličinama iz originalne igre, i prvi klik koji je uvek siguran.",

        boards: "Tabla",
        levels: {
          beginner: "Početnik",
          intermediate: "Srednje",
          expert: "Ekspert",
        },

        mines: "Mine",
        time: "Vreme",
        best: "Najbolje",
        newGame: "Nova igra",
        flagMode: "Zastavice",
        hint: "Klik otvara polje, desni klik ili F postavlja zastavicu, a na telefonu dug pritisak. Klik ili srednji klik na završen broj otvara sva preostala polja oko njega.",

        gridLabel: "Minsko polje",
        cells: {
          hidden: "Zatvoreno",
          flagged: "Zastavica",
          mine: "Mina",
          empty: "Prazno",
          wrong: "Pogrešna zastavica",
        },

        won: {
          title: "Očišćeno",
          body: "Sva polja bez mina su otvorena.",
          record: "Novi najbolji rezultat za ovu tablu.",
          again: "Igraj ponovo",
        },

        lost: {
          title: "Mina",
          body: "Tabla je prikazana onakva kakva je bila. Pogrešne zastavice su označene, i tu je obično bila greška u zaključivanju.",
          again: "Probaj ponovo",
        },

        how: {
          label: "Kako se igra",
          items: [
            {
              title: "Prvi klik je siguran",
              description:
                "Mine se postavljaju tek posle prvog klika, dalje od mesta koje si pritisnuo, pa prvi potez ne može da izgubi i uvek otvori slobodan prostor. Počni bilo gde.",
            },
            {
              title: "Broj pokazuje susedne mine",
              description:
                "To je broj mina u osam polja oko njega. Polje bez ijedne mine u okolini otvara celu oblast odjednom.",
            },
            {
              title: "Označi ono što si zaključio",
              description:
                "Desni klik na računaru, F na tastaturi, dug pritisak na telefonu. Dug pritisak samo postavlja zastavicu, pa je ne možeš slučajno skloniti odmah posle - za to služi režim zastavica, koji ti ionako treba kad ih postavljaš više zaredom. Brojač pokazuje broj mina umanjen za broj zastavica.",
            },
            {
              title: "Klikni na završen broj",
              description:
                "Kad broj ima oko sebe onoliko zastavica koliko pokazuje, klik na njega otvara sva preostala polja oko njega, a isto radi i srednji klik. Ako držiš taster, polja koja bi se otvorila se utisnu, pa ih vidiš pre nego što se odlučiš. Odatle dolazi brzina u ovoj igri, a većina igrača to nikad ne otkrije.",
            },
          ],
        },

        close: {
          label: "Kako je napravljeno",
          paragraphs: [
            "Bez canvasa i bez biblioteke za igre, a za razliku od igre 2048 ovde nema ni kretanja. Nema petlje i ništa se ne animira: polje je dugme koje menja stanje ili ne, a ekspertska tabla ima četiristo osamdeset takvih. Sve što igra troši je promena klase na elementu.",
            "Mine se postavljaju na prvi klik, a ne na početku, tako da zaobiđu pritisnuto polje i osam oko njega. Tabla podeljena unapred mora ili da dozvoli da prvi potez izgubi, što je bacanje novčića a ne igra, ili da se deli ponovo dok to ne prestane, čime se neprimetno menjaju šanse na ostatku table. Kasno postavljanje daje poštenu tablu i prvi potez koji uvek otvori oblast.",
            "Otvaranje oblasti koristi red, a ne rekurziju, koju bi telefon na četiristo nivoa dubine s pravom odbio. Taj red usput daje i tajming animacije: krug u kom je polje pronađeno govori koliko je daleko od klika, pa svako polje čeka toliko koraka pre otvaranja. Oblast se tako otvara talasom od mesta klika, umesto da se cela tabla promeni odjednom, a to košta jedan custom property i jedno kašnjenje.",
            "Tabla je prava mreža: redovi, polja, broj redova i kolona, i samo jedno polje u redosledu tabulatora, pa se po njoj kreće strelicama umesto tasterom Tab. Igra 2048 mora da bude sakrivena od čitača ekrana i opisana kroz live region, jer šesnaest pločica koje se menjaju na svaki taster ne mogu da se pročitaju. Minsko polje je tabela koja miruje i čeka, a upravo za to mreža i postoji.",
          ],
        },
      },

      memory: {
        name: "Memorija",

        tagline:
          "Okreni dve kartice i zapamti šta je bilo ispod njih. Dvanaest nivoa, od četiri kartice do šezdeset, i veća tabla svaki put kad pređeš nivo.",

        metaDescription:
          "Memorija u pretraživaču: dvanaest nivoa od četiri kartice do šezdeset, do tri zvezdice po tabli, i slobodna igra sa svim tablama otvorenim od početka.",
        lead: "Okreći po dve kartice i pronađi svaki par. Dvanaest nivoa, svaka tabla veća od prethodne, od četiri kartice do šezdeset, sa trideset različitih sličica. Pređi nivo da otvoriš sledeći, ili u slobodnoj igri idi pravo na bilo koju veličinu.",

        modes: "Režim",
        modeNames: {
          campaign: "Nivoi",
          free: "Slobodna igra",
        },

        boards: "Izaberi nivo",
        level: "Nivo",

        /** Three phrases rather than a number and a noun, because "dve
         *  zvezdice" and "pet zvezdica" are different plurals. See en.ts. */
        locked: "Zaključano",
        open: "Još nije pređen",
        stars: ["Jedna zvezdica", "Dve zvezdice", "Tri zvezdice"],

        moves: "Potezi",
        time: "Vreme",
        best: "Najmanje poteza",
        goal: "Zvezdice",
        newGame: "Nova igra",
        hint: "Pritisni karticu da je okreneš, pa još jednu. Par ostaje okrenut, a sve ostalo se vraća. Strelicama se krećeš po stolu, a Enter okreće karticu.",

        gridLabel: "Kartice",
        cells: {
          hidden: "Zatvorena",
          matched: "{name}, par pronađen",
        },

        messages: {
          pair: "{name}. Par.",
          miss: "{name}. Nije par.",
        },

        pictures: {
          apple: "Jabuka",
          cherries: "Trešnje",
          lemon: "Limun",
          strawberry: "Jagoda",
          watermelon: "Lubenica",
          pear: "Kruška",
          grapes: "Grožđe",
          orange: "Pomorandža",
          banana: "Banana",
          pineapple: "Ananas",
          sun: "Sunce",
          moon: "Mesec",
          cloud: "Olujni oblak",
          rainbow: "Duga",
          snowflake: "Pahulja",
          leaf: "Javorov list",
          tulip: "Lala",
          mushroom: "Pečurka",
          cactus: "Kaktus",
          tree: "Bor",
          rocket: "Raketa",
          balloon: "Balon",
          anchor: "Sidro",
          key: "Ključ",
          crown: "Kruna",
          heart: "Srce",
          star: "Zvezda",
          gem: "Dijamant",
          bell: "Zvono",
          umbrella: "Kišobran",
        },

        won: {
          title: "Svi parovi pronađeni",
          record: "Manje poteza nego ikad na ovom nivou.",
          final: "To je bio poslednji nivo. Ostalo je još samo da osvojiš tri zvezdice na svih dvanaest.",
          next: "Sledeći nivo",
          bigger: "Sledeća tabla",
          again: "Igraj ponovo",
        },

        how: {
          label: "Kako se igra",
          items: [
            {
              title: "Dve kartice po potezu",
              description:
                "Pritisni karticu da je okreneš, pa drugu. Ako se sličice poklope, obe ostaju okrenute. Ako ne, ostaju otvorene taman toliko da ih zapamtiš i onda se zatvaraju, a klik na sledeću karticu ih zatvara odmah.",
            },
            {
              title: "Svaki potez se broji",
              description:
                "Dve kartice su jedan potez, bio par ili ne. Tri zvezdice dobijaš ako tablu pređeš otprilike brzo kao igrač sa savršenim pamćenjem, dve ako ti treba do pola više poteza, a jednu za to što si stigao do kraja. Zvezdice iznad stola se gase kako prelaziš svaku granicu.",
            },
            {
              title: "Dvanaest nivoa, svaki veći",
              description:
                "Od dva puta dva do deset puta šest. Pređen nivo otvara sledeći, a za svaki se pamti najmanji broj poteza. Prvih pet nivoa koristi samo jedan deo špila, voće, prirodu ili predmete, a od šestog su u igri svih trideset sličica.",
            },
            {
              title: "Ili preskoči napred",
              description:
                "Slobodna igra otvara sve table odjednom, bez zvezdica i bez zaključavanja. Isti špil i ista pravila, za kad odmah hoćeš najveći sto.",
            },
          ],
        },

        close: {
          label: "Kako je napravljena",
          paragraphs: [
            "Bez canvasa i bez biblioteke za igre, kao i ostale. Kartica je dugme sa dve strane, a okretanje je jedna tranzicija na jednom svojstvu: sloj sa obe strane rotira se za pola kruga oko vertikalne ose, svaka strana sakriva svoju poleđinu, i pretraživač prikazuje onu koja je okrenuta ka tebi. Okret ode nekoliko stepeni preko i vrati se, pa kartica deluje kao da ima težinu, a ne kao kvadrat koji se vrti. Svaka kartica ima svoju perspektivu, srazmernu veličini, pa se kartice na najmanjoj i na najvećoj tabli okreću kroz istu dubinu.",
            "Trideset sličica je nacrtano, a ne preuzeto: jedan sprite u stranici, jedan simbol po sličici, a svako lice kartice je referenca na jedan od njih. Svaka je u tri tona iste boje, osnovnom, svetlijem na strani svetla i tamnijem na strani senke, na sopstvenoj podlozi. Sličice zadržavaju boje u obe teme, a samo podloge prate stranicu, pa jabuka zapamćena u svetloj temi izgleda isto i u tamnoj. Zvukovi se prave na isti način, u pretraživaču, od nekoliko oscilatora i kratkog šuma kroz filter, pa na stranici nema nijednog audio fajla.",
            "Kartica ne zna šta je dok se ne okrene. Zatvorene kartice u stranici ne sadrže nijedan odgovor: lice svake kartice je prazno, a sličica se upisuje tek u trenutku okretanja. Špil se meša jednom po tabli i čuva se unutar igre, gde ga stranica ne može pročitati.",
            "Granice za zvezdice su izmerene, a ne izmišljene. Simulirani igrač sa savršenim pamćenjem, koji nikad ne okreće već viđenu karticu osim kad njome zatvara par, odigrao je dvesta hiljada partija na svakoj tabli, a tri zvezdice su broj poteza koji mu je bio dovoljan u devet partija od deset. Prosek mu je bio 1,61 potez po paru, što je poznat rezultat za ovu igru, i time je simulacija i proverena.",
            "Tabla uvek staje na ekran, jer tablu koju moraš da skroluješ ne vidiš celu. Na telefonu koji držiš uspravno tabla se okreće za četvrtinu, deset kartica u redu postaje šest, a nijedna kartica ne menja mesto: mreža se puni po kolonama umesto po redovima, strelice zamene ose, a čitač ekrana i dalje prolazi kroz istu tabelu.",
          ],
        },
      },

      accretion: {
        name: "Akrecija",

        tagline:
          "Pusti nebesko telo na drugo. Dva ista se spajaju u sledeće po redu, od Meseca sve do Sunca.",

        metaDescription:
          "Igra spajanja u pretraživaču: puštaj nebeska tela, a dva ista postaju sledeće po redu, od Meseca do Sunca.",
        lead: "Pusti nebesko telo da padne. Dva ista se spajaju u sledeće po redu, od Meseca preko planeta do Sunca, a prostor se puni, bio ti spreman ili ne.",

        score: "Rezultat",
        best: "Najbolje",
        next: "Sledeće",
        newGame: "Nova igra",
        hint: "Pomeraj da nanišaniš i klikni da pustiš. Strelice za nišanjenje, razmak za puštanje.",
        sequence: "Niz, od najmanjeg do najvećeg",

        planets: [
          "Mesec",
          "Merkur",
          "Mars",
          "Venera",
          "Zemlja",
          "Neptun",
          "Uran",
          "Saturn",
          "Jupiter",
          "Sunce",
        ],

        over: {
          title: "Nema više mesta",
          body: "Neko telo je predugo iznad linije. Ovde nema plafona, samo linija, a telo koje se zaustavi iznad nje nema kuda dalje.",
          restart: "Igraj ponovo",
        },

        how: {
          label: "Kako se igra",
          items: [
            {
              title: "Nanišani pa pusti",
              description:
                "Pomeraj telo po vrhu da ga poravnaš i klikni da ga pustiš. Dobijaš samo pet najmanjih, pa sve veće od Zemlje moraš da napraviš spajanjem.",
            },
            {
              title: "Dva ista se dodirnu i spoje",
              description:
                "Ne moraju da se pritiskaju ni da se drže: čim se dva ista tela smire jedno uz drugo, postaju sledeće po redu, a ako novo telo završi pored istog takvog, spajanje se nastavlja lančano.",
            },
            {
              title: "Gradi u širinu a ne u visinu",
              description:
                "Telo pušteno na visoku gomilu se otkotrlja i ne završi tamo gde si nišanio. Najveći deo igre je držati veća tela pri dnu, jer ona nemaju kuda dalje.",
            },
            {
              title: "Linija je odlaganje a ne zid",
              description:
                "Ništa ne sprečava telo da pređe iznad nje. Kraj je tek kada neko telo tamo sleti i posle pola sekunde još uvek stoji gore, pa kratak skok preživiš, a Jupiter koji se tu smirio ne.",
            },
          ],
        },

        close: {
          label: "Kako je napravljeno",
          paragraphs: [
            "Bez canvasa, bez biblioteke za fiziku i bez ijedne zavisnosti. Telo je div sa border-radius-om, boja mu je gradijent iz istog stylesheet-a kao ostatak stranice, a svaki frejm upisuje po jedan transform na svako telo. Zato se planete skaliraju sa stranicom, ostaju oštre na svakom zumu i ne traže nijedan dodatni zahtev. Univerzalni fizički engine bi sam bio pet puta teži od cele ove igre.",
            "Solver pravi mnogo malih koraka umesto nekoliko velikih, osam po frejmu. U svakom koraku se svaki kontakt rešava kao kruta opruga sa jakim prigušenjem, tela se pomere, pa se svaki kontakt reši još jednom, kruto, čime se poništi brzina koju je opruga dala. Zato se preklapanje ispravi a da nikad ne pređe u odskok, a gomila koja miruje stoji potpuno mirno. Kontakt se otkriva još dok postoji razmak, pa se planeta koja pada zaustavi tačno na površini na koju pada, umesto da utone i bude izbačena nazad.",
            "Ostatak je zaslužan za to što tela deluju teško, a ne gumeno. Trenje deluje između površina, uključujući i rotaciju, pa telo koje klizi počne da se kotrlja. Jak udar poništi rotaciju sa kojom je telo stiglo, pa planeta koja okrzne drugu stane pored nje umesto da se otkotrlja preko celog polja. Udar se potroši tamo gde se desio i ne prenosi se u sledeći korak, pa veliko telo ne odskače od malog. A planeta koja ostane na samom vrhu druge odmah se skotrlja: takva ravnoteža može biti fizički moguća, ali planeta koja stoji na drugoj kao sneško belić izgleda kao da se zaglavila.",
            "Simulacija radi u sopstvenom prostoru od 1200 puta 1650 jedinica i ne zna u kojoj se veličini prikazuje. Jedan transform na jednom elementu skalira ceo prostor na širinu koju mu stranica da, pa promena veličine prozora menja samo taj broj, a ne poluprečnike, pozicije ni korak simulacije. Svaki frejm crta tela između poslednja dva koraka, pa ekran od 120 Hz dobija novu poziciju pri svakom osvežavanju. Nebo u pozadini se crta samo jednom, pri buildu sajta: trista zvezda kao tačke na nekoliko putanja, magline od fraktalnog šuma i četiri sloja koja se pomeraju različitom brzinom dok nišaniš.",
          ],
        },
      },

      battleship: {
        name: "Potapanje brodova",

        tagline:
          "Sakrij pet brodova i pronađi protivničke pre nego što on pronađe tvoje. Četiri protivnika, od onog koji puca nasumično do onog koji računa svaki mogući položaj tvoje flote.",

        metaDescription:
          "Potapanje brodova u pretraživaču, protiv četiri protivnika: klasična flota na tabli deset sa deset, i protivnik koji broji svaki raspored koji dosadašnji hici još dozvoljavaju.",
        lead: "Sakrij pet brodova i pronađi protivničke pre nego što on pronađe tvoje. Puca se naizmenično, jedan hitac po potezu, a težina igre zavisi samo od protivnika koga izabereš: najslabiji puca tamo gde još nije gađao, a najjači prebroji sve moguće položaje tvoje flote i gađa polje koje se pojavljuje u najviše njih.",

        /** Činovi, a ne pridevi: "lako" i "teško" govore kako će proći tebi, a
         *  čin govori ko je s druge strane, a to je ono što se bira. */
        opponents: "Izaberi protivnika",
        levels: {
          sailor: {
            name: "Mornar",
            note: "Puca nasumično. Treba mu oko 95 hitaca da potopi flotu, pa moraš baš da se potrudiš da izgubiš.",
          },
          gunner: {
            name: "Nišandžija",
            note: "Posle pogotka gađa okolna polja. Oko 55 hitaca, i kazniće spor početak.",
          },
          captain: {
            name: "Kapetan",
            note: "Pretražuje tablu sistematski. Oko 50 hitaca, fer borba.",
          },
          admiral: {
            name: "Admiral",
            note: "Oko 45 hitaca, blizu najboljeg što je iko postigao. Računaj da ćeš izgubiti.",
          },
        },

        shots: "Hici",
        /** ⚠️ Ne "Najbolje". Broj kod kog manje znači bolje, a pod tom rečju se
         *  čita kao poen gde veće znači bolje. Oznaka nosi i jedinicu i smer. */
        best: "Najmanje hitaca",
        toPlace: "Preostalo",
        rotate: "Okreni",
        shuffle: "Rasporedi",
        start: "Počni",
        newGame: "Nova igra",

        /** Naslov iznad svake table, i ime same mreže. */
        sides: {
          enemy: "Protivničke vode",
          own: "Tvoja flota",
        },

        /** Šta polje kaže kad na njemu nema šta da se pročita. */
        cells: {
          water: "Voda",
          ship: "Brod",
          miss: "Promašaj",
          hit: "Pogodak",
          sunk: "Potopljeno",
        },

        ships: ["Nosač aviona", "Bojni brod", "Krstarica", "Podmornica", "Razarač"],

        /**
         * Red ispod table posle hica na nju. `{ship}` se zamenjuje imenom iz
         * liste iznad.
         *
         * ⚠️ Brod je glagolom a ne pridevom: krstarica i podmornica su ženskog
         * roda, a razarač i nosač muškog, pa bi "Potopljen" bilo tačno za dva
         * od pet. "Tone" je isto za sve.
         */
        messages: {
          hit: "Pogodak.",
          miss: "Promašaj.",
          sunk: "{ship} tone.",
          waiting: "Nišani.",
          ready: "Tvoj hitac.",
        },

        setupHint:
          "Flota je već raspoređena. Klikni na brod da ga uzmeš, okreni ga ako treba, pa klikni na vodu da ga spustiš.",
        hint: "Klikni na polje u protivničkim vodama da pucaš. Strelicama se krećeš po tabli, Enter puca, a R okreće brod dok ga postavljaš.",

        won: {
          title: "Protivnička flota je potopljena",
          body: "Svih pet brodova je na dnu, a ti si bio brži.",
          record: "U manje hitaca nego ikad protiv ovog protivnika.",
          again: "Igraj ponovo",
        },

        lost: {
          title: "Tvoja flota je potopljena",
          body: "Protivnički brodovi su prikazani tamo gde su bili, da vidiš šta si tražio.",
          again: "Pokušaj ponovo",
        },

        how: {
          label: "Kako se igra",
          items: [
            {
              title: "Rasporedi pet brodova",
              description:
                "Flota se rasporedi sama čim se stranica otvori, pa možeš odmah da igraš. Klikni na brod da ga uzmeš, okreni ga i klikni na polje da ga spustiš. Brodovi smeju da se dodiruju, što je standardno pravilo i protivniku manje otkriva.",
            },
            {
              title: "Po jedan hitac, naizmenično",
              description:
                "Pogodak ne donosi drugi hitac, ni tebi ni njemu. Ti pucaš prvi, protivnik odgovara, i igra je gotova čim su pogođena svih sedamnaest polja jedne flote.",
            },
            {
              title: "Pogodak je trag",
              description:
                "Brod je tu i pruža se u jednom od četiri smera. Dva pogotka u liniji otkrivaju smer, a dok brod ne potone, vredi gađati samo krajeve te linije.",
            },
            {
              title: "Biraš protiv koga igraš",
              description:
                "Mornaru treba oko devedeset pet hitaca da potopi flotu, nišandžiji pedeset pet, kapetanu pedeset, a admiralu četrdeset pet. Manje od sedamnaest nije moguće. Rekord se čuva posebno za svakog protivnika, jer pobeda nad jednim nije isto što i pobeda nad drugim.",
            },
          ],
        },

        close: {
          label: "Kako je napravljena",
          paragraphs: [
            "Bez canvasa i bez biblioteke za igre, kao i ostale. More je mreža dugmadi, a flota je sloj iznad nje: po jedan element za svaki brod, preko svih njegovih polja, sa crtežom unutra. Nosač ima poletnu palubu, komandno ostrvo i oznake, podmornica leži nisko i nema ništa na palubi, a ništa od toga ne bi preživelo sečenje na kvadrate - zato je trup jedan oblik celom dužinom, a ne zaobljeni krajevi zalepljeni na svako polje. Svaki brod je nacrtan dvaput: ceo, sa kupolama, dimnjacima i poletnom palubom, i kao sama silueta. Siluetu koriste kopije naslagane ispod trupa da bi mu dale bok, pa se detalji crtaju jednom po brodu umesto osam puta. Brod okrenut u drugom smeru je isti crtež zarotiran za četvrtinu kruga.",
            "Tabla je nagnuta, a brodovi stoje iznad nje, i to stvarno, a ne samo nacrtano. Tabla je zarotirana u 3D, a flota podignuta duž ose koju ta rotacija ostavlja, pa je trup iznad sopstvene senke i pri okretanju pokazuje bok. Perspektive nema nigde, i to namerno: sa nedoglednom tačkom dalja ivica bi bila uža od bliže, a na mreži sa imenovanim poljima kolone moraju da ostanu paralelne. Nacrtan je i sam hitac, kako leti od jednog tvog broda do polja u koje pada, jer je potez ovde jedna flota koja gađa drugu, a ne oznaka koja se pojavi.",
            "Protivnik ne vidi flotu na koju puca, i to je obezbeđeno strukturom koda, a ne obećanjem u komentaru. Funkcija koja bira polje dobija samo dve stvari: listu sopstvenih hitaca i dužine brodova koje je već potopio. Raspored tvoje flote joj uopšte nije dostupan, pa nema ni prilike da ga slučajno iskoristi. Koji je brod potonuo zna se javno, kao kad igrač to kaže naglas, i upravo to protivniku sužava izbor.",
            "Najjači od četvorice ne nagađa. Za svaki brod koji je još na vodi prođe kroz sve položaje koje taj brod može da zauzme, izbaci one koje isključuju promašaji ili potopljeni brodovi, i svakom neotkrivenom polju koje preostali položaji pokrivaju doda po glas. Polje sa najviše glasova je sledeći hitac. Traženje i dovršavanje pogotka su ista računica, a ne dva režima: kad nema otvorenih pogodaka, dobija se poznata raspodela sa vrhom u sredini table, a kad postoji pogodak, otpadaju položaji koji ga ne objašnjavaju i sva težina se skupi oko njega.",
            "Dovršavanje pogotka se obično piše kao red polja koja treba probati, i baš tu ovakvi programi najčešće greše: red mora da se čisti svaki put kad brod potone, kad neki drugi hitac razreši polje iz njega i kad dva broda stoje jedan uz drugi. Ovde se polja za dovršavanje izračunavaju iz table u svakom potezu, pa nema šta da se čuva ni šta da zastari. Četiri protivnika, četrdeset hiljada simuliranih partija protiv nezavisno napisanog protivnika, i nijedan nedozvoljen hitac.",
          ],
        },
      },
    },
  },

  services: {
    label: "U čemu mogu da pomognem",
    items: [
      {
        title: "Razvoj backenda i API-ja",
        description:
          "REST API-ji i servisi u Node.js-u (NestJS, Express) ili .NET-u: modelovanje podataka, autentikacija, kontrola pristupa po rolama i integracije sa eksternim sistemima.",
      },
      {
        title: "Full-stack razvoj",
        description:
          "Cela funkcionalnost od jedne osobe: šema baze, API i React ekrani koji ga koriste.",
      },
      {
        title: "AWS arhitektura i deployment",
        description:
          "Postavljanje nove AWS infrastrukture ili poboljšanje postojeće: okruženja, CI/CD pipeline-ovi i analiza troškova i pouzdanosti.",
      },
      {
        title: "Tehnički pregled i konsalting",
        description:
          "Pregled postojećeg koda ili arhitekture: šta prvo popraviti, plan refaktorisanja i procena da li se prepisivanje isplati.",
      },
    ],
  },

  contact: {
    label: "Kontakt",
    intro:
      "Najbrže ćete me dobiti mejlom. Ako imate projekat na umu, za početak je dovoljan kratak opis problema.",
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
    body: "Adresa je možda pogrešna ili je stranica premeštena. Link ispod vodi na početnu stranu, a odatle je sve na sajtu udaljeno jedan klik.",
    cta: "Nazad na početnu",
  },
};

export default sr;
