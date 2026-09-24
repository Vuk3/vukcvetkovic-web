/**
 * English copy — the source of truth for the dictionary shape.
 *
 * `Dict` in ./types.ts is derived from this object (`type Dict = typeof en`),
 * so every other locale is typed against it and a missing key fails the build.
 *
 * Only prose belongs here. Names, URLs, employers, dates and technology labels
 * live in src/site.ts. The keys under `skills.groups`, `experience.roles` and
 * `projects.items` match the `id` fields there.
 */
const en = {
  meta: {
    title: "Vuk Cvetković - Software engineer",
    description:
      "Software engineer in Niš, Serbia. I build the whole product: Node.js backend (NestJS, Express), AWS deployment and event-driven communication, React front end.",
    ogImageAlt: "Vuk Cvetković, software engineer",
  },

  nav: {
    skipToContent: "Skip to content",
    sections: "Sections",
    about: "About",
    skills: "Skills",
    experience: "Experience",
    education: "Education",
    projects: "Projects",
    services: "Services",
    contact: "Contact",
    games: "Games",
    themeToggle: "Toggle dark theme",
    language: "Language",
  },

  hero: {
    /**
     * The headline over the name. Not the job title at Ncoded, which stays
     * `experience.roles.ncoded.role`: this is how he describes the work as a
     * whole, and the lead under it says where the weight sits.
     */
    role: "Software engineer",
    positioning:
      "I work across the whole product, from the data model to production. I write the backend in Node.js (NestJS, Express) and .NET. On AWS I handle deployment and event-driven communication between services, and I build everything the user sees in React.",
    cta: "Contact me",
    portraitAlt: "Portrait of Vuk Cvetković",
    /** Only rendered if src/assets/portrait.* is missing. */
    portraitPlaceholder: "portrait",
  },

  about: {
    label: "About",
    paragraphs: [
      "I work on client projects from the first data model to the deployment on AWS. I always start from the domain: what the data is, who can access it, and which systems it has to talk to, and the API, the services and the React interface follow from that.",
      "I have a master’s in software engineering. My thesis compared two machine learning ecosystems on the same task: a YOLOv8m model in Python and an ML.NET model in .NET, behind one NestJS gateway and one React front end. For my bachelor’s thesis I implemented the RC6 and XXTEA ciphers from their specifications.",
      "The best example of my front end work is this site itself: four languages, and six games written without a canvas or a game library. Each game has a write-up on how it was built.",
    ],
  },

  skills: {
    label: "Skills",
    groups: {
      backend: { name: "Backend" },
      frontend: { name: "Frontend" },
      data: { name: "Data" },
      cloud: { name: "Cloud & DevOps" },
    },
  },

  experience: {
    label: "Experience",
    roles: {
      ncoded: {
        role: "Backend developer",
        bullets: [
          "Backend services in Node.js (NestJS, Express): REST APIs, JWT authentication, role-based access control and third-party integrations, over both SQL and document databases.",
          "The same work in .NET where a client already runs it, structured with Clean Architecture so the business logic stays separable from the framework around it.",
          "The AWS side: S3, ECS, EC2, Lambda, Route 53 and EventBridge, covering deployments and the event-driven paths between services.",
        ],
      },
      novateq: {
        role: "Full-stack developer",
        bullets: [
          "Backend services in .NET Web API and the company site in ASP.NET MVC, adapted to what individual clients needed.",
          "Kept the Sportsbook platform stable by working through incoming issues, and reviewed casino game projects to learn how that side is built.",
        ],
      },
    },
  },

  education: {
    label: "Education",
    degrees: {
      master: {
        degree: "MSc, Software Engineering",
        school: "Faculty of Electronic Engineering, University of Niš",
      },
      bachelor: {
        degree: "BSc, Computing and Informatics",
        school: "Faculty of Electronic Engineering, University of Niš",
      },
    },
  },

  /*
   * Projects, in three layers: the rows on the homepage, the index at
   * /projects/, and one page per project.
   *
   * Every entry under `items` carries the same keys, even where a project has
   * less to say and an array comes out empty. `Dict` is derived from this file,
   * so a second project with a different shape would turn every access on the
   * detail page into a union - keeping the shape uniform is what lets one
   * component render any project. Sections with nothing in them are skipped.
   */
  projects: {
    label: "Projects",
    liveLabel: "Live",
    sourceLabel: "Source",
    /** Homepage section to the index. */
    all: "All projects",
    /** A row to the project's own page. */
    view: "Read the write-up",
    /** And back out of it. */
    back: "Projects",

    index: {
      metaTitle: "Projects - Vuk Cvetković",
      metaDescription:
        "Projects by Vuk Cvetković, software engineer in Niš: what each system does, how it is built, and what came out of it.",
      heading: "Projects",
      intro:
        "Work I can write about in full, with the architecture and the results rather than a screenshot. Each one gets a page of its own.",
    },

    /** Section headings on a project page. */
    detail: {
      year: "Year",
      context: "Context",
      domain: "Domain",
      flow: "How one request runs",
      overview: "Overview",
      architecture: "Architecture",
      features: "What it does",
      dataset: "Dataset and training",
      results: "Results",
      stack: "Technologies",
      takeaway: "What I took from it",
    },

    /**
     * The captions in the request diagram, shared by every project.
     *
     * They name what a stage *is* rather than what it holds, which is why they
     * are written once here instead of four times under `items`: the core
     * orchestrates on all four projects, the lane runs in parallel on all four,
     * and the terminal at the end is the output on the three that have one.
     *
     * Each is set inside the card it belongs to, in the diagram's mono voice -
     * so a node reads as a header and a body rather than as a box with a word
     * floating over it, and the reader can answer "where does this start" from
     * the card itself.
     */
    flowCaptions: {
      entry: "Entry",
      core: "Orchestration",
      lane: "In parallel",
      exit: "Output",
    },

    /** Stack rows are named by the service they belong to. */
    stackGroups: {
      frontend: "Front end",
      gateway: "Gateway",
      pythonService: "Python service",
      dotnetService: ".NET service",
      data: "Dataset",
      client: "Client",
      service: "Service",
      interface: "Interface",
      capture: "Capture",
      charts: "Charts",
      mobile: "Mobile app",
      api: "API",
    },

    items: {
      objectDetection: {
        title: "Comparative object detection system",
        tagline: "The same image through two machine learning ecosystems, answered in one format.",
        description:
          "My master's thesis. The same image runs through a YOLOv8m model in Python and an ML.NET model in .NET, both behind one gateway that answers in a single format, so one React front end draws either result. Reannotating the dataset took YOLOv8m to 0.916 mAP@0.5 against 0.748 for ML.NET.",
        metaTitle: "Comparative object detection system - Vuk Cvetković",
        metaDescription:
          "A master's thesis system: YOLOv8m in Python and ML.NET in .NET behind one NestJS gateway, compared on the same protective equipment dataset.",
        context: "Master's thesis, Faculty of Electronic Engineering in Niš",
        domain: "Personal protective equipment on site",

        /*
         * The request diagram, by role rather than by position.
         *
         * `exit` is empty because this run is a round trip - it comes back to
         * the terminal it started from, which `flowShape` in src/site.ts says
         * and the diagram draws. The two payloads are annotations on the lines
         * either side of the gateway, not stages of their own.
         */
        flow: {
          entry: "React front end",
          entryLabel: "Image, multipart/form-data",
          core: "NestJS gateway",
          branches: [
            { title: "FastAPI service", badge: "Ultralytics YOLOv8m" },
            { title: "ASP.NET Core service", badge: "ML.NET model" },
          ],
          exit: "",
          exitLabel: "One JSON shape: boxes, classes, confidence",
          exitNote: "",
        },

        overview: [
          "The thesis asks what changes when the same detection task is built twice: once in Python, the ecosystem research reaches for, and once in .NET, the one that already runs the backend. The system trains a YOLOv8m model and an ML.NET model on the same annotated images, puts both behind one API, and runs an image through either or both.",
          "The domain is personal protective equipment on a work site, over six classes: helmet, vest and gloves, each as present or missing. The negative classes are the point. A system like this is only useful if it can say that someone is not wearing a helmet, not merely that a helmet is somewhere in the frame.",
        ],

        steps: [
          {
            title: "The front end posts the image",
            body: "React sends the file as multipart/form-data with the chosen model as a second field. Ask for both and it fires the two requests in parallel, so the comparison is over one image at one moment.",
          },
          {
            title: "The gateway routes it",
            body: "NestJS is the only address the front end knows. It takes the upload and forwards it to the FastAPI service or the ASP.NET Core one, which leaves the two ML services free to change independently of the client.",
          },
          {
            title: "The service runs inference",
            body: "Python reads the image into RGB and hands it to YOLOv8m, holding the loaded weights in memory so the .pt file is not read again on every request. The .NET side converts to MLImage and selects the ML.NET model by id.",
          },
          {
            title: "Both answer in the same shape",
            body: "Class, score, and a box as x1, y1, x2, y2, alongside the model id, the annotation set it was trained on, and the original image dimensions. The .NET side clamps its coordinates to those dimensions first, so a box can never fall outside the image.",
          },
          {
            title: "The front end draws it",
            body: "Because the response is identical either way, there is no YOLO branch and no ML.NET branch in the interface. It scales the coordinates from the original size to the displayed size and paints the boxes, labels and confidences over the image.",
          },
        ],

        features: [
          {
            title: "One model or both",
            body: "Either service on its own, or both at once in two panels over the same image, with the four trained models selectable by name.",
          },
          {
            title: "A confidence threshold you control",
            body: "A slider hides everything under the threshold, the way a real deployment acts only on predictions above a cutoff rather than on everything the model returns.",
          },
          {
            title: "Every detection, listed",
            body: "Class and score per detection, and selecting one isolates it in the image, which is how you check a frame with eight overlapping boxes in it.",
          },
          {
            title: "Outlines, fill, zoom and pan",
            body: "Boxes as outlines or as filled regions, one detection or all of them, with zoom and pan for checking a box against the pixels under it.",
          },
          {
            title: "The two answers side by side",
            body: "Request duration, detection count, average confidence, the strongest detection, and which service answered first.",
          },
          {
            title: "Health checks",
            body: "Gateway, Python API and .NET API each report status and response time, because three processes fail independently and a blank panel should say which one is down.",
          },
        ],

        dataset: [
          "The dataset was assembled in Roboflow out of two public sets, then reviewed and merged into one: 2,911 images split 2,374 for training, 290 for validation and 247 for test, auto-oriented and resized to 640x640. The Python side takes it in YOLO format and the .NET side in COCO, since that is what Model Builder expects for detection, so the two tools get the formats they want over identical images and identical classes.",
          "Then the part I did not plan for. The first pass held 8,813 annotations, and going back through it brought that to 17,942, which means more than half the objects had been unlabelled. An object that is present in the image but missing from the labels teaches the model during training that it is background, and then counts against the model during evaluation when it detects it anyway.",
          "Both models trained for 50 epochs at 640x640 from pretrained weights, with the parameters held steady across the two dataset versions so a difference in results could be read as a difference in annotation quality rather than in configuration. Model Builder stops at the trained model, so the .NET side needed an evaluation service of its own: it loads the COCO annotations, predicts over the validation set, and computes precision, recall, F1 and mAP@0.5 with confusion matrices and precision-recall curves, which is what put ML.NET on the same footing as the output Ultralytics prints by itself.",
        ],

        /*
         * `columns` carries one head per column, the first naming the row-label
         * column itself. Metric names go untranslated in every locale - they
         * are the terms the field uses - but they still live here rather than
         * in src/site.ts, because whether a head needs translating is a
         * per-project question and Encryptix answers it the other way.
         */
        results: {
          columns: [
            "Model",
            "Annotations",
            "Precision",
            "Recall",
            "F1",
            "mAP@0.5",
            "mAP@0.5:0.95",
          ],
          rows: ["YOLOv8m", "YOLOv8m", "ML.NET", "ML.NET"],
          notes: [
            "Reannotating moved every metric for both models. YOLOv8m went from 0.790 to 0.916 mAP@0.5 and ML.NET from 0.580 to 0.748, so in relative terms the weaker model gained the most, 29 percent against 16. The first pass had been holding it back hardest.",
            "YOLOv8m is ahead on the numbers, and the gap that matters is recall: 0.867 against 0.709 on the corrected set, at almost the same precision. For protective equipment that asymmetry is the whole story, because a missed detection is a person the system quietly reports as fine, and precision on its own cannot tell you it happened.",
            "The comparison is fair because the setup was the same on both sides: one image domain, the same six classes, and comparable parameters instead of separate tuning for each model.",
          ],
        },

        takeaway: [
          "The outcome sat in the data more than in the choice of framework. Reannotating the same 2,911 images moved both models further than the distance between the two ecosystems moved ML.NET, and that is not the conclusion I expected to be writing up.",
          "The engineering half was more practical. Python gave me room to experiment and produced the evaluation material for free, .NET gave me a model that drops into an ASP.NET Core service with no bridge in between, and the standardized response is the only reason one front end can treat them as interchangeable.",
        ],
      },

      encryptix: {
        title: "Encryptix",
        tagline: "Three ciphers behind one service, and a hash at both ends to prove the file came back.",
        description:
          "My bachelor's thesis. A desktop client hands a whole folder to a WCF service, which encrypts every file with AES, RC6 or XXTEA - the last two written from the specification rather than taken from a library - and records a SHA-512 hash before and after each pass, so the round trip can be proved rather than assumed. Processing the files in parallel took a 150-file pass from 68.91 to 44.16 seconds.",
        metaTitle: "Encryptix - Vuk Cvetković",
        metaDescription:
          "A bachelor's thesis project: a Windows Forms client and a WCF service that encrypt a whole folder with AES, RC6 or XXTEA, with SHA-512 verification on both ends.",
        context: "Bachelor's thesis, Faculty of Electronic Engineering in Niš",
        domain: "File encryption on the desktop",

        flow: {
          entry: "A folder, read recursively into bytes",
          entryLabel: "",
          core: "WCF service",
          branches: [
            { title: "AES", badge: "CBC, from the .NET library" },
            { title: "RC6", badge: "Written by hand, 20 rounds" },
            { title: "XXTEA", badge: "Written by hand, Feistel network" },
          ],
          exit: "One encrypted file per input",
          exitLabel: "",
          /* The integrity claim, annotated beside the output rather than drawn
             as a stage: nothing passes through it. */
          exitNote: "SHA-512 recorded before and after",
        },

        overview: [
          "The unit of work here is a folder, not a file. You point the application at a directory, it reads everything inside it and inside every subfolder, and then one of three symmetric ciphers runs over the whole set - with the encrypted tree, the decrypted tree and the hash log each written somewhere you choose.",
          "The reason there are three is that only one of them came for free. AES is the .NET library's implementation, which is what any sensible application would use. RC6 and XXTEA are built from their specifications, and that is where the project actually was: the key expansion, the padding, the rotations and the deliberate integer overflow that XXTEA depends on.",
        ],

        steps: [
          {
            title: "The client reads the folder",
            body: "A folder dialog, then a recursive walk that reads every file as raw bytes regardless of extension and keeps its name, extension, directory and contents together as one record. Nothing interprets the file, so a .txt and an .exe take the same path through the program.",
          },
          {
            title: "A background task keeps the window alive",
            body: "Windows Forms gives the application one thread and that thread owns the controls, so reading a large folder on it would freeze the window and stop the spinner it is meant to be showing. The read runs as a Task instead, and the continuation is scheduled back onto the form's own synchronization context, which is the only place the buttons can legally be re-enabled.",
          },
          {
            title: "The list crosses to the service",
            body: "The client calls the WCF service over HTTP. Both sides had to be reconfigured for the payload: the buffer limits go up to the largest value an int will hold, and the transfer mode changes from buffered to streamed so only the message header is buffered rather than the whole file list, with a ten-minute timeout on each end.",
          },
          {
            title: "The service encrypts, file by file",
            body: "The chosen algorithm takes the list, the key and - for AES - the initialization vector. RC6 and XXTEA need their input to fill whole blocks, so each pads the byte array up to its block size and writes the original length into the first four bytes, which is what lets decryption trim the padding back off instead of guessing where the file ended.",
          },
          {
            title: "Both ends are hashed",
            body: "Every file gets a text file beside it holding four SHA-512 lines: before encryption, after encryption, before decryption, after decryption. The first and the last are the ones that matter, and they have to be identical. That is the whole integrity claim, and it is checkable by anyone who opens the file.",
          },
        ],

        features: [
          {
            title: "A whole folder at a time",
            body: "Subfolders included, to any depth. The output mirrors the input tree, which comes from diffing each file's path against the root rather than from tracking the recursion.",
          },
          {
            title: "Three ciphers, one form",
            body: "AES with a 32-character key and a 16-character IV, RC6 and XXTEA with 16-character keys. Each gets its own window, and every field is validated before anything is written.",
          },
          {
            title: "Proof it came back",
            body: "The SHA-512 of the plaintext before encryption against the SHA-512 of the plaintext after decryption. Equal means the round trip was lossless.",
          },
          {
            title: "Sequential or parallel",
            body: "Both modes are built in, and a checkbox picks between them. In parallel mode the file list is split across a parallel loop, and since no file depends on another, nothing has to be locked or merged. The results below show what that is worth.",
          },
          {
            title: "A progress bar that finishes with the job",
            body: "Paced from the total byte count while the service works, and filled the instant the real call returns by way of a cancellation token, so it tracks the run and completes with it rather than after it.",
          },
          {
            title: "The file tree up front",
            body: "A tree view of everything that was loaded, fully expanded, so you can check what is about to be encrypted before you start.",
          },
        ],

        dataset: [],

        results: {
          columns: ["Mode", "Files", "Encryption (s)", "Decryption (s)"],
          rows: ["Sequential", "Parallel"],
          notes: [
            "The same 150 files, the same RC6 key, the same output folders, run once each way. Parallel encryption finished in 44.16 seconds against 68.91, and decryption in 40.39 against 70.13 - a third off in each direction.",
            "The gain comes from the files being independent: the parallel loop needs no lock and no ordering, so no file waits for the one before it.",
          ],
        },

        takeaway: [
          "Implementing two of the three ciphers rather than calling them is what this project was for. They are short algorithms where almost every line is load-bearing: which direction a rotation goes, where the original length is stored, and the fact that XXTEA needs its arithmetic to wrap on overflow rather than raise. The matching hashes are what prove all of it lands correctly, byte for byte.",
          "The client-server split is the other half of it. The cryptography runs in the service rather than in the process that draws the window, and the same three algorithms are available to anything else that can call it.",
        ],
      },

      networkTrafficAnalyzer: {
        title: "Network Traffic Analyzer",
        tagline: "A packet capture read once, then asked twelve questions about every packet in it.",
        description:
          "A seminar paper on traffic analysis, with a desktop application to demonstrate it. It opens a .pcapng capture through Pyshark, walks every packet layer by layer, and pulls out what each protocol carries - HTTP headers, DNS queries, TCP flags, FTP credentials - into an expandable tree, alongside a chart of how the protocols divide up.",
        metaTitle: "Network Traffic Analyzer - Vuk Cvetković",
        metaDescription:
          "A seminar paper project in Python: a Tkinter application that reads .pcapng captures through Pyshark, extracts twelve protocols per packet, and charts the protocol distribution.",
        context: "Seminar paper, Faculty of Electronic Engineering in Niš",
        domain: "Packet capture analysis",

        flow: {
          entry: "A .pcapng capture",
          entryLabel: "",
          core: "Pyshark, over Wireshark's tshark",
          branches: [
            { title: "Application protocols", badge: "HTTP, HTTPS, DNS, FTP, SMTP" },
            { title: "Transport and control", badge: "TCP, UDP, ICMP, ARP" },
            { title: "Addressing", badge: "IP, Ethernet" },
          ],
          exit: "One row per packet",
          exitLabel: "",
          exitNote: "Expandable, and counted into the charts",
        },

        overview: [
          "The paper covers how network traffic is analysed and why PCAP became the standard format for it. The application puts that into practice: open a capture, and it shows what each packet carries, protocol by protocol.",
          "Wireshark runs underneath it - Pyshark drives its tshark - and that is what gives the parsing its reach. Built on top, the application asks the same fixed set of questions of every packet in a file and lays the answers out in one place, which is the shape you want when you are looking for something and do not yet know which packet it is in.",
        ],

        steps: [
          {
            title: "The capture is read once",
            body: "A file dialog takes a .pcapng or .pcap, Pyshark opens it, and every packet is pulled into a list in memory before the file handle is closed. Nothing reads the file again after that, which is what makes the filters cheap: they re-run over the list rather than re-parsing the capture.",
          },
          {
            title: "Each packet is walked layer by layer",
            body: "The protocol names come from the packet's own layer stack rather than from a lookup, so a packet reports what it actually contains and the tally at the end counts real layers. Twelve extractors then run in sequence, each one asking whether its protocol is present before it touches anything.",
          },
          {
            title: "Every extractor asks before it reads",
            body: "A field that a given packet does not carry is not an error, it is the normal case, so every extractor checks each attribute exists before reading it and simply omits what is absent. That is why the tree is uneven: one HTTP packet shows a dozen fields and the next shows two, and both are correct.",
          },
          {
            title: "What is in plain text comes out in plain text",
            body: "HTTP Basic credentials are base64, not encryption, so the extractor decodes them. FTP sends its username and password as text, so those come out too. That is the honest demonstration the paper wanted: not a claim that these protocols are insecure, but the decoded string sitting in a tree in front of you.",
          },
          {
            title: "The results land in a tree and in charts",
            body: "Each packet becomes one row - timestamp, source and destination IP, length, protocol list - which expands into a node per protocol and a leaf per field. The same pass returns a count per protocol, which Matplotlib draws as a pie and a bar chart embedded straight into the window.",
          },
        ],

        features: [
          {
            title: "Twelve protocols, per packet",
            body: "HTTP, HTTPS, DNS, FTP, SMTP, ARP, ICMP, IP, Ethernet, TCP, UDP and FPP, each with its own extractor and its own set of fields.",
          },
          {
            title: "Filters over five criteria",
            body: "A date and time range, a source IP, a destination IP, and a comma-separated protocol list. An empty time falls back to the whole day, from 00:00:00 to 23:59:59.",
          },
          {
            title: "A tree, not a wall of text",
            body: "Packet, then protocol, then field, and each level opens only when you ask for it, so a capture of thousands of packets stays readable.",
          },
          {
            title: "Protocol distribution at a glance",
            body: "A pie chart for the share and a bar chart for the count, redrawn every time a filter is applied, so you can see what a filter actually removed.",
          },
          {
            title: "Credentials in the clear, shown as such",
            body: "Decoded HTTP Basic authentication and FTP usernames and passwords, which is the shortest possible argument for why those protocols are not used unencrypted.",
          },
          {
            title: "Both PCAP generations",
            body: "The dialog accepts .pcapng and .pcap. The newer format carries more metadata and more interfaces, and reads back through the same code.",
          },
        ],

        dataset: [],

        results: {
          columns: [],
          rows: [],
          notes: [],
        },

        takeaway: [
          "The discipline the format forces is what makes this work on any capture you hand it. A packet promises nothing about which fields it holds, so every read is guarded and an absent field is a normal outcome rather than a failure. Writing the twelve extractors out one by one is what keeps that explicit, and it is why a two-packet capture and a two-thousand-packet one go through the same code with no special case.",
          "Reading the capture once is what makes the rest feel immediate. Every filter, every recount and every redrawn chart works from the list already in memory, so changing a date or an IP address returns a new view of the same capture straight away instead of going back to the file.",
        ],
      },

      easyBreathe: {
        title: "Easy Breathe",
        tagline: "Serbia's public pollen readings, narrowed to the ones a single person needs to know about.",
        description:
          "A mobile app on top of open government data. Serbia's environmental agency publishes pollen measurements from stations across the country, and the app mirrors them into its own database on a schedule, then narrows them to the allergens one person has selected within a radius they choose - on a map, by concentration level, and as a push notification when a level climbs.",
        metaTitle: "Easy Breathe - Vuk Cvetković",
        metaDescription:
          "A React Native and Expo app on a NestJS API: Serbia's open pollen data, seeded on a schedule and filtered by location, radius and the allergens a user selects.",
        context: "Seminar paper on e-government systems, Faculty of Electronic Engineering in Niš",
        domain: "Open government data, pollen and allergens",

        flow: {
          entry: "Five open-data endpoints",
          entryLabel: "",
          core: "Scheduled seeding",
          branches: [
            { title: "Monthly", badge: "Allergens, types, locations" },
            { title: "Hourly, 9 to 12", badge: "Pollens, concentrations" },
          ],
          exit: "One deduplicated database",
          exitLabel: "",
          exitNote: "Narrowed to a radius, a day and your allergens",
        },

        overview: [
          "The public data is there and it is good: Serbia's environmental agency publishes daily pollen readings from measuring stations across the country, as an open API with no key and no limit. What it does not do is tell one person with a ragweed allergy whether today is a bad day where they happen to be standing. That gap is the whole app.",
          "So the work splits in two. The API mirrors the open data into its own database on a schedule, because a phone should not page through hundreds of thousands of national measurements to answer a local question. The app then asks one question against that mirror - what is in the air near me, of the things I react to - and answers it on a map, in four levels, and in a notification.",
        ],

        steps: [
          {
            title: "The open data is mirrored on two clocks",
            body: "The five endpoints do not change at the same rate, so they are not fetched at the same rate. Allergens, allergen types and locations are seeded at nine on the first of the month. Pollens and concentrations, which are the ones that move, are fetched every hour between nine and noon, which is when the day's measurements appear.",
          },
          {
            title: "Seeding is safe to repeat",
            body: "Every seeder looks up which ids it already holds, keeps only the ones it does not, and inserts those. So an hourly job that finds nothing new writes nothing, the same run can be repeated without duplicating a measurement, and the window it asks for reaches a week back - which is what picks up a reading published a few days after it was taken.",
          },
          {
            title: "A location and a radius become a set of stations",
            body: "The user's coordinates and their chosen radius in kilometres go into a MongoDB geospatial query, dividing the radius by the earth's own to get the sphere the query needs. What comes back is every measuring station close enough to matter to that person.",
          },
          {
            title: "Stations and a date become the readings that count",
            body: "Those station ids and today's date select the day's pollen records, each of which carries the ids of the concentrations measured with it. Those concentrations are then fetched and cut down to the allergens the user actually selected, so the response holds only readings that are both nearby and relevant.",
          },
          {
            title: "Each reading gets a level and a place",
            body: "A number in the air means nothing on its own, so each concentration is compared against its own allergen's published margins and comes out as Low, Normal, High or Very high. The reading is then formatted with the allergen and the station it came from, which is what the map marker and the detail view show.",
          },
        ],

        features: [
          {
            title: "Pick your own allergens",
            body: "Around thirty are published, and the profile is a multiselect over all of them. Everything downstream - the map, the levels, the notifications - follows that list.",
          },
          {
            title: "Your radius, your interval",
            body: "The radius to search in kilometres and how often to check in hours, both set on the profile. A shorter interval means fresher alerts, a longer one saves battery.",
          },
          {
            title: "A map you can read at a glance",
            body: "Markers on the measuring stations near you, coloured by level. Tap one and it lists which of your allergens were measured there and how high each was.",
          },
          {
            title: "Four levels, with counts",
            body: "Low, Normal, High and Very high, each with the number of nearby allergens at that level. Tap a level for the list, tap an entry for the station, the description and the reading.",
          },
          {
            title: "A notification when it climbs",
            body: "A push notification and an in-app alert when something in the selected list reaches a high concentration nearby, so the app is useful without being opened.",
          },
          {
            title: "Accounts, kept simple",
            body: "Email sign-up and sign-in, with the profile that holds the allergens, the radius and the interval, so the same selection follows the account rather than the phone.",
          },
        ],

        dataset: [],

        results: {
          columns: [],
          rows: [],
          notes: [],
        },

        takeaway: [
          "The lesson that carried was that open data is not the same as usable data. Five endpoints that reference each other by id, a national scale, and no way to ask a geographic question means the value is entirely in the mirroring and the joining. Deciding what to copy, how often, and how to make copying it twice harmless is where the engineering actually was.",
          "The other half is that the answer has to arrive without being asked for. Someone with an allergy does not open an app to check - they want to be told, at a radius and an interval they set once. Push notifications on top of a scheduled backend are what turn a public dataset into something that reaches a person on the day it matters.",
        ],
      },
    },
  },

  /*
   * The games, at /games/ and one page per game.
   *
   * Same three layers as `projects`: the index, and an `items` map keyed by
   * the id in src/site.ts. A game's name and slug are not here - "2048" is
   * four characters in every language, so they are facts.
   *
   * ⚠️ Unlike a project, a game is not rendered by one shared component. Each
   * has its own implementation and its own route pair, so `items` only has to
   * carry the copy around a board, and two games are free to need different
   * keys. Read docs/content-and-i18n.md before adding one.
   */
  games: {
    label: "Games",

    /**
     * What the date on a game's own page is called. The day itself is a fact
     * and lives in `site.games.<id>.date`, written out per locale.
     *
     * ⚠️ The colon belongs to the label rather than to the markup, because it
     * is punctuation and punctuation is prose: French sets a space before it
     * and the other three do not. It also earns its keep grammatically - the
     * Serbian line reads "Napravljeno: 11. septembar 2026." because the date
     * Intl produces is nominative, and "Napravljeno" running straight into it
     * would want the genitive.
     */
    built: "Built:",

    /**
     * The sound switch in every game's bar. A toggle, so it names the thing
     * rather than the action, and one word for all six games because it is
     * one switch - see SoundToggle.astro.
     */
    sound: "Sound",

    /**
     * The two words a game's status can carry: on the ribbon across the corner
     * of its card, and on the badge beside its title. Which one a game gets is
     * `status` in src/site.ts, and a status with no word here is a type error
     * there.
     *
     * Both stay as they are in all four dictionaries, which is unusual enough
     * to be worth the note. "Beta" is the same loanword everywhere, and "live"
     * is the one that would go wrong if it were translated: "uživo" and "en
     * ligne" both say live *play* - an opponent on the other end - which is
     * the opposite of what a single-player game wants on its card.
     */
    status: {
      live: "Live",
      beta: "Beta",
    },

    index: {
      metaTitle: "Games - Vuk Cvetković",
      metaDescription:
        "Browser games by Vuk Cvetković: 2048, Minesweeper, Memory in twelve levels, Battleship against four opponents, a game about merging worlds into bigger ones, and a 3D cube from 2×2 to 5×5. Each gets a page of its own.",
      heading: "Games",
      intro:
        "Games worth more than one go. Each has a page of its own, and underneath it a write-up on how it was built, for anyone who wants that too.",
    },

    items: {
      twentyFortyEight: {
        /**
         * The title, in the page head, the card and the browser tab.
         *
         * Here rather than in site.ts, even though this one is the same in four
         * languages: the next one is not, and a rule with an exception in it is
         * not a rule. See the note on `Game` in src/site.ts.
         */
        name: "2048",

        /** One line, for the card on the index. */
        tagline:
          "Push the board and every tile slides as far as it can. Two of the same number merge into one worth double, all the way up to 2048.",

        metaDescription:
          "The tile game. Slide the board, merge matching numbers, and get to a single tile worth 2048.",
        lead: "Push the board in any direction and every tile slides as far as it can. Two of the same number merge into one worth double, and the aim is a single tile worth 2048.",

        score: "Score",
        best: "Best",
        /** Only ever read out, in the live region that stands in for the board. */
        highest: "Highest tile",
        newGame: "New game",
        undo: "Undo",
        hint: "Arrow keys or WASD, and a swipe on a phone.",

        won: {
          title: "2048",
          body: "The tile is on the board. It does not have to stop here, though - the game runs until nothing can move.",
          keepGoing: "Keep going",
        },

        over: {
          title: "No moves left",
          body: "The board is full and nothing beside anything matches. One step back is still there if the last move was the one that did it.",
          restart: "Play again",
        },

        how: {
          label: "How to play",
          items: [
            {
              title: "Push the whole board",
              description:
                "Arrow keys or WASD on a keyboard, a swipe in any direction on a phone. Every tile travels as far as it can in one move, not one square.",
            },
            {
              title: "Equal numbers merge",
              description:
                "Two tiles carrying the same number become one worth double. A tile that has just merged is finished for that move, so a row of four 2s gives you two 4s rather than one 8.",
            },
            {
              title: "A new tile every move",
              description:
                "It arrives in a free cell and it is a 2 nine times out of ten. A push that changes nothing is not a move, so nothing new appears and nothing is lost by trying one.",
            },
            {
              title: "Pick a corner and stay there",
              description:
                "Keep the largest tile in one corner and never push away from it. Most of the game is refusing the move that lifts it out.",
            },
          ],
        },

        close: {
          label: "How it is built",
          paragraphs: [
            "No canvas and no game library. A tile is an element with two custom properties on it, its position is a translate resolved against its own size, and the browser composites the slide. That is where the smoothness comes from: a move changes a transform and nothing else, so no part of it goes through layout.",
            "Keeping every tile's element for the life of that tile is the other half. The board is never re-rendered from the state - a move updates the numbers on nodes that are already there, which is why a tile visibly travels from where it was instead of disappearing and reappearing somewhere else.",
            "The numbers are text, so they are as sharp as the rest of the page and they scale with whatever size the reader has set. The colours are tokens in the same stylesheet as everything else, which is why the board answers the theme toggle in the header.",
            "Input runs through one function from three places, so a key, a swipe and a tap cannot drift into meaning slightly different things. The arrow keys belong to the board only while the board is on screen, and a move pushed before the last one has landed is held rather than dropped - which is why pushing quickly never costs you a turn.",
          ],
        },
      },

      minesweeper: {
        name: "Minesweeper",

        tagline:
          "Open every cell that is not a mine. Each number counts the mines touching it, and the rest is worked out from there.",

        metaDescription:
          "Minesweeper in the browser, on the beginner, intermediate and expert boards, with a first click that can never lose.",
        lead: "Open every cell that is not a mine. A number says how many of the eight cells around it are mined, and everything else is worked out from there. Three boards, the sizes the original shipped with, and a first click that can never lose.",

        boards: "Board",
        levels: {
          beginner: "Beginner",
          intermediate: "Intermediate",
          expert: "Expert",
        },

        mines: "Mines",
        time: "Time",
        best: "Best",
        newGame: "New game",
        flagMode: "Flag mode",
        hint: "Press to open, right click or F to flag, a long press on a phone. A finished number opens the rest of its ring on a press or the middle button.",

        /** The board itself, and the five words a screen reader reads off it.
         *  A revealed number needs none of them - the digit is real text. */
        gridLabel: "Minefield",
        cells: {
          hidden: "Hidden",
          flagged: "Flagged",
          mine: "Mine",
          empty: "Empty",
          wrong: "Wrong flag",
        },

        won: {
          title: "Cleared",
          body: "Every cell that was not a mine is open.",
          record: "A new best for this board.",
          again: "Play again",
        },

        lost: {
          title: "Mine",
          body: "The field is shown as it was. A flag on a clear cell is marked, which is usually where the reasoning went.",
          again: "Try again",
        },

        how: {
          label: "How to play",
          items: [
            {
              title: "The first click is safe",
              description:
                "The mines are laid after it, around wherever you pressed, so the opening move cannot lose and always breaks into open ground. Start anywhere.",
            },
            {
              title: "A number counts its neighbours",
              description:
                "It is how many of the eight cells touching it hold a mine. A cell with nothing near it opens the whole region around it in one press.",
            },
            {
              title: "Flag what you have worked out",
              description:
                "Right click on a desktop, F on a keyboard, a long press on a phone. A long press only ever plants one, so a slow finger cannot take back what it just put down - flag mode is what removes one, and it is what you want for a whole run of them anyway. The counter shows mines less flags.",
            },
            {
              title: "Press a number you have finished",
              description:
                "Once a number has as many flags around it as it says, pressing it opens the rest of its ring at once, and so does the middle button. Hold the button down first and the cells it would open go down with it, so you can see the eight before you commit. That is where the speed in this game is, and most players never find it.",
            },
          ],
        },

        close: {
          label: "How it is built",
          paragraphs: [
            "No canvas and no game library, and unlike 2048 no motion either. There is no loop and nothing in flight: a cell is a button, it changes state or it does not, and the whole board is four hundred and eighty of them at the expert size. What it costs to run is a class on an element.",
            "The mines are laid on the first press rather than at the start, around the cell that was pressed and the eight touching it. A field dealt in advance has to either let the opening move lose, which is a coin toss rather than a game, or deal again until it does not, which quietly bends the odds everywhere else. Laying them late gets an honest field and a first move that always opens into a region.",
            "Opening a region is a queue rather than a recursion, which a four hundred deep fill on a phone is entitled to refuse, and the queue hands the animation its timing for free: the ring a cell was found on is how far it is from the press, so each one waits that many steps before it opens. The fill arrives as something spreading outward instead of the board changing all at once, and it costs one custom property and a delay.",
            "The board is a real grid: rows, cells, a row and column count, and one cell in the tab order at a time so the arrow keys walk it rather than the Tab key. 2048 has to be hidden from a screen reader and described through a live region, because sixteen tiles that rewrite themselves on every keypress cannot be read. A minefield is a table that sits still and waits, which is exactly what a grid is for.",
          ],
        },
      },

      memory: {
        name: "Memory",

        tagline:
          "Turn two cards and remember what was under them. Twelve levels, from four cards to sixty, and a bigger board every time you clear one.",

        metaDescription:
          "Memory in the browser: twelve levels from four cards to sixty, up to three stars a board, and free play with every board open from the start.",
        lead: "Turn two cards at a time and find every pair. Twelve levels, each board bigger than the last, from four cards to sixty and thirty pictures. Clear a level to open the next, or go straight to any size in free play.",

        /** The two ways to play, and the legend over them. */
        modes: "Mode",
        modeNames: {
          campaign: "Levels",
          free: "Free play",
        },

        /** The legend over the twelve tiles, and the word in front of a
         *  level's number. "Level 5" is a word and a figure in all four
         *  languages, so the page composes it rather than carrying a template. */
        boards: "Choose a level",
        level: "Level",

        /**
         * What a tile tells a screen reader about itself.
         *
         * ⚠️ The stars are three phrases rather than a number and a noun, for
         * the reason ship counts are not a sentence in Battleship: "2 stars"
         * and "5 stars" take different plurals in Serbian, and none of the
         * dictionaries has machinery for that. Three is all there ever is, and
         * the page indexes this list by the count.
         */
        locked: "Locked",
        open: "Not cleared yet",
        stars: ["One star", "Two stars", "Three stars"],

        moves: "Moves",
        time: "Time",
        /** ⚠️ Not "Best", for Battleship's reason: this is a count where
         *  fewer wins, and a bare number under "Best" reads as a score. */
        best: "Fewest moves",
        goal: "Stars",
        newGame: "New game",
        hint: "Press a card to turn it, then another. A pair stays face up and anything else turns back over. The arrow keys walk the table and Enter turns a card.",

        /** The table, and what a card says when there is no picture to read.
         *  `{name}` is a picture from the list below. */
        gridLabel: "Cards",
        cells: {
          hidden: "Face down",
          matched: "{name}, pair found",
        },

        /** Read out after the second card of a turn, since a label that
         *  changes on the focused card is not reliably announced again. */
        messages: {
          pair: "{name}. A pair.",
          miss: "{name}. Not a pair.",
        },

        /**
         * The thirty pictures, keyed by the ids in the game module. The
         * drawings are in MemorySprites.astro and the id joins all three, so a
         * picture in the deck with no name here is a type error in the page.
         */
        pictures: {
          apple: "Apple",
          cherries: "Cherries",
          lemon: "Lemon",
          strawberry: "Strawberry",
          watermelon: "Watermelon",
          pear: "Pear",
          grapes: "Grapes",
          orange: "Orange",
          banana: "Banana",
          pineapple: "Pineapple",
          sun: "Sun",
          moon: "Moon",
          cloud: "Storm cloud",
          rainbow: "Rainbow",
          snowflake: "Snowflake",
          leaf: "Maple leaf",
          tulip: "Tulip",
          mushroom: "Mushroom",
          cactus: "Cactus",
          tree: "Pine tree",
          rocket: "Rocket",
          balloon: "Hot air balloon",
          anchor: "Anchor",
          key: "Key",
          crown: "Crown",
          heart: "Heart",
          star: "Star",
          gem: "Gem",
          bell: "Bell",
          umbrella: "Umbrella",
        },

        won: {
          title: "All pairs found",
          record: "Fewer moves than ever on this level.",
          final: "That was the last level. Three stars on all twelve is what is left.",
          next: "Next level",
          bigger: "Next board",
          again: "Play again",
        },

        how: {
          label: "How to play",
          items: [
            {
              title: "Two cards a turn",
              description:
                "Press a card to turn it over, then a second one. If the pictures match, both stay face up. If they do not, they stay up long enough to be remembered and then turn back, and pressing the next card turns them back at once.",
            },
            {
              title: "Every turn is a move",
              description:
                "Two cards are one move, pair or not. Three stars is a board cleared about as fast as a perfect memory would clear it, two is within half as many moves again, and one is for getting there. The stars over the table go out as you pass each mark.",
            },
            {
              title: "Twelve levels, each one bigger",
              description:
                "From two by two to ten by six. Clearing a level opens the next and your fewest moves are kept for each. The first five each deal from one part of the deck, fruit or nature or things, and from the sixth on all thirty pictures are in play.",
            },
            {
              title: "Or skip ahead",
              description:
                "Free play opens every board at once, with no stars to earn and nothing locked. The same deck and the same rules, for when the big table is the one you want.",
            },
          ],
        },

        close: {
          label: "How it is built",
          paragraphs: [
            "No canvas and no game library, like the rest of them. A card is a button with two faces, and turning it is one transition on one property: the layer holding both faces rotates half a turn about its vertical axis, each face hides its own back, and the browser shows whichever one is towards you. The turn overshoots by a few degrees and settles, which is what makes it read as a card with some weight in it rather than a square spinning. Every card carries its own perspective, scaled to its size, so a card on the smallest board and one on the largest turn through the same depth.",
            "The thirty pictures are drawn rather than downloaded: one sprite sheet in the page, one symbol per picture, and every card face is a reference to one of them. Each is flat colour in three tones, the colour itself, a highlight towards the light and a shade away from it, on a ground of its own. The pictures keep their colours in both themes and only the grounds follow the page, so an apple remembered in the light is the same apple in the dark. The sounds are made the same way, in the browser, from a few oscillators and a burst of filtered noise, so there is no audio file on the page either.",
            "A card does not know what it is until it is turned. The face-down table in the page holds no answers: the front of every card points at nothing, and the picture is written onto it at the moment it goes over. The deck is shuffled once per board and lives inside the game, where the page cannot read it.",
            "The star marks were measured rather than chosen. A player with perfect memory, one that never turns a card it has already seen unless that card completes a pair, played two hundred thousand games on every board, and three stars is the number of moves it needed in nine games out of ten. Its average came out at 1.61 moves a pair, which is the known answer for this game and how the simulation was checked.",
            "The board is sized to fit the screen, because a memory board you have to scroll is one you cannot see. On a phone held upright it turns a quarter, ten across becoming six across, and not one card moves to do it: the grid fills by column instead of by row, the arrow keys swap axes to match, and a screen reader still walks the same table.",
          ],
        },
      },

      accretion: {
        name: "Accretion",

        tagline:
          "Let one body fall onto another. Two of the same merge into the next one up, from the Moon all the way to the Sun.",

        metaDescription:
          "A merge game in the browser: let celestial bodies fall, and two of the same become the next one up, from the Moon to the Sun.",
        lead: "Let a body fall. Two of the same merge into the next one up, from the Moon through the planets to the Sun, and the space fills whether you are ready or not.",

        score: "Score",
        best: "Best",
        next: "Next",
        newGame: "New game",
        hint: "Move to aim and press to drop. Arrow keys aim, space drops.",
        sequence: "The sequence, from smallest to largest",

        /** The ten bodies, in order. The order is the solar system, the sizes
         *  are the game's - see the note on the radius table in game.ts. */
        planets: [
          "Moon",
          "Mercury",
          "Mars",
          "Venus",
          "Earth",
          "Neptune",
          "Uranus",
          "Saturn",
          "Jupiter",
          "Sun",
        ],

        over: {
          title: "Out of room",
          body: "Something has been resting above the line for too long. There is no ceiling here, only a line, and a body that stops above it has nowhere to go.",
          restart: "Play again",
        },

        how: {
          label: "How to play",
          items: [
            {
              title: "Aim, then drop",
              description:
                "Move across the top to line a body up and press to let it go. Only the five smallest ever arrive, so everything past Earth has to be built.",
            },
            {
              title: "Two of the same touch and merge",
              description:
                "They do not have to be pressed together or held: the moment two equal bodies come to rest against each other they become the next one up, and a merge that lands next to another sets off a chain.",
            },
            {
              title: "Build sideways, not upward",
              description:
                "A body dropped onto a tall pile rolls, and where it lands is not where it was aimed. Keeping the larger ones along the bottom is most of the game, because they are the ones with nowhere left to go.",
            },
            {
              title: "The line is a delay, not a wall",
              description:
                "Nothing stops a body going above it. It is only over when one has landed up there and is still there half a second later, so a splash is survivable and a settled Jupiter is not.",
            },
          ],
        },

        close: {
          label: "How it is built",
          paragraphs: [
            "No canvas, no physics library and no dependency of any kind. A body is a div with a border radius, its colour is a gradient in the same stylesheet as the rest of the page, and the frame writes one transform onto each. So the planets scale with the page, stay sharp at any zoom, and cost nothing to serve. A general physics engine would on its own weigh five times what this whole game does.",
            "The solver takes many small steps rather than a few large ones, eight to every frame. In each of them every contact is solved as a stiff, heavily damped spring, the bodies move, and then every contact is solved again, rigidly, which takes back whatever speed the push gave them. So an overlap is corrected without ever becoming a bounce, and a pile at rest is perfectly still. A contact is found while there is still a gap, so a falling planet stops exactly at the surface it lands on rather than sinking in and being pushed back out.",
            "The rest is what makes it read as heavy rather than springy. Friction acts between the two surfaces, spin included, so a body that skids starts to roll. A hard landing soaks up the spin it arrived with, so a planet that clips another on the shoulder comes to rest beside it instead of rolling across the field. An impact is spent where it happens and never carried into the next step, which is what keeps a large body from bouncing off a small one. And a planet balanced on the crown of another is tipped off it at once: the balance may be real, but a planet standing on another like a snowman reads as stuck.",
            "The simulation runs in its own space of 1200 by 1650 units and never learns how big it is being shown. One transform on one element scales the whole field onto whatever width the page has given it, so a resize changes that single number and nothing else - not a radius, not a position, not a step. The frame draws each body between the last two steps, so a 120Hz screen gets a new position every time it refreshes. The sky behind it is drawn once, when the site is built: three hundred stars as dots along a few paths, nebulae made of fractal noise, and four layers that slide at different speeds as you aim.",
          ],
        },
      },

      battleship: {
        name: "Battleship",

        tagline:
          "Hide five ships, then find theirs first. Four opponents, from one that fires at random to one that counts every position your fleet could still be in.",

        metaDescription:
          "Battleship in the browser, against four opponents: a classic fleet on a ten by ten grid, and an opponent that counts every placement the evidence still allows.",
        lead: "Hide five ships, then find theirs before they find yours. Shots alternate one at a time, and the opponent you pick is the whole of the difficulty: the weakest fires wherever it has not fired yet, and the strongest counts every position your fleet could still be in and shoots the square that appears in most of them.",

        /** The four opponents. Ranks rather than adjectives, because "easy" and
         *  "hard" say how it will go for you while a rank says who you are up
         *  against, and that is the thing being chosen. */
        opponents: "Choose your opponent",
        /**
         * A name and one line on how good each one is.
         *
         * ⚠️ **The line says how hard it will be, not how it works.** Which
         * algorithm is behind a rank is the write-up's job, further down the
         * page. What a reader needs before choosing is whether they are about
         * to be beaten, and the honest answer to that is the number of shots it
         * needs - which is also the one figure the whole game is scored in.
         */
        levels: {
          sailor: {
            name: "Sailor",
            note: "Fires at random. About 95 shots to clear a board, so losing to it takes real effort.",
          },
          gunner: {
            name: "Gunner",
            note: "Follows up on a hit. About 55 shots, and it will punish a slow start.",
          },
          captain: {
            name: "Captain",
            note: "Searches the board properly. About 50 shots, and a fair fight.",
          },
          admiral: {
            name: "Admiral",
            note: "About 45 shots, close to the best anyone has managed. Expect to lose.",
          },
        },

        shots: "Shots",
        /** ⚠️ Not "Best". It is a count where fewer wins, and a bare number under
         *  that word reads as a score where more does - which is what it means in
         *  2048 and Accretion. The label carries the unit and the direction. */
        best: "Fewest shots",
        toPlace: "To place",
        rotate: "Turn",
        shuffle: "Rearrange",
        start: "Start",
        newGame: "New game",

        /** The heading over each board, and the grid's own name. */
        sides: {
          enemy: "Their waters",
          own: "Your fleet",
        },

        /** What a square says when there is no number or glyph to read. */
        cells: {
          water: "Water",
          ship: "Ship",
          miss: "Miss",
          hit: "Hit",
          sunk: "Sunk",
        },

        /** The five ships, largest first. The lengths are in the game module
         *  and the order is what joins the two, the way the ten planets are. */
        ships: ["Carrier", "Battleship", "Cruiser", "Submarine", "Destroyer"],

        /** One line under a board after a shot at it. `{ship}` is replaced with
         *  the name from the list above. */
        messages: {
          hit: "Hit.",
          miss: "Miss.",
          sunk: "Sunk: {ship}.",
          waiting: "Taking aim.",
          ready: "Your shot.",
        },

        setupHint:
          "Your fleet is already at sea. Press a ship to pick it up, press the water to put it down, and turn it before you do.",
        hint: "Press a square in their waters to fire. Arrow keys walk a board, Enter fires, and R turns a ship while you are placing one.",

        won: {
          title: "Their fleet is down",
          body: "All five sunk, and yours got there first.",
          record: "In fewer shots than ever against this opponent.",
          again: "Play again",
        },

        lost: {
          title: "Your fleet is down",
          body: "Their ships are shown where they were standing, so you can see what you were looking for.",
          again: "Try again",
        },

        how: {
          label: "How to play",
          items: [
            {
              title: "Put five ships in the water",
              description:
                "A fleet is dealt for you the moment the page opens, so you can start straight away. Press a ship to pick it up, turn it, and press a square to set it down. Ships are allowed to touch, which is the standard rule and the one that gives less away.",
            },
            {
              title: "One shot each, in turn",
              description:
                "A hit does not buy a second shot, on either side. You fire first, the opponent answers, and the game is over as soon as one fleet has all seventeen of its squares hit.",
            },
            {
              title: "A hit is a thread to pull",
              description:
                "Something is there and it runs one of four ways. Two hits in a line settle the direction, and the ends of that line are the only squares still worth anything until the ship goes down.",
            },
            {
              title: "Pick who you are playing",
              description:
                "The sailor takes about ninety-five shots to clear a board, the gunner fifty-five, the captain fifty and the admiral forty-five. Seventeen is the floor. Your best is kept separately for each of them, because a win against one of them is not a win against another.",
            },
          ],
        },

        close: {
          label: "How it is built",
          paragraphs: [
            "No canvas and no game library, like the rest of them. The sea is a grid of buttons and the fleet is a layer over it: one element per ship, spanning its squares, with a drawing inside it. A carrier has a flight deck, an island and markings, a submarine sits low with nothing on deck at all, and none of that survives being cut into squares - so a hull is one shape across its whole length rather than a rounded end stuck on each square. Each vessel is drawn twice over: the full plan, with its turrets and funnels and flight deck, and the outline alone. The outline is what the copies stacked underneath a hull use to give it a side, so the detail is resolved once per ship rather than eight times. A ship laid the other way is the same drawing turned a quarter.",
            "The board is tilted and the ships stand off it, and both are real rather than drawn. The chart is rotated in three dimensions and the fleet is lifted along the axis that rotation leaves, so a hull is above its own shadow and turns its side with it when it turns. There is no perspective anywhere, deliberately: a vanishing point would make the far edge narrower than the near one, and a grid you name squares on cannot afford to have its columns stop being parallel. A shot is drawn too, crossing from one of your own hulls to the square it lands on, because a turn here is one fleet firing at another rather than a mark appearing.",
            "The opponent cannot see the fleet it is shooting at, and that is structural rather than a promise made in a comment. The function that picks a square takes two things: the record of its own shots, and the lengths of the ships it has already sunk. The layout is not in scope where the decision happens, so there is no line to be careful about. Which ship sank is public, the same way a player says it out loud, and it is what lets the reasoning narrow.",
            "The strongest of the four does not guess. For every ship still afloat it walks every position that ship could occupy, drops the ones a miss or a wreck has ruled out, and adds a vote to each unknown square the survivors cover. The heaviest square is the shot. Hunting and following up a hit are the same calculation rather than two modes: with nothing unexplained it produces the familiar bell over the middle of the board, and with a hit on the table the positions that fail to account for it are dropped and the weight collapses around it.",
            "Following up a hit is usually written as a queue of squares to try, and that queue is where this kind of program goes wrong: it has to be weeded every time a ship sinks, every time another shot resolves one of its entries, and every time two ships lie alongside each other. Here the follow-up squares are worked out from the board every turn, so there is nothing to keep and nothing to go stale. Four opponents, forty thousand simulated games against an independently written defender, and not one illegal shot between them.",
          ],
        },
      },

      cube: {
        /**
         * Not the puzzle's trade name, in any of the four. The names every
         * language uses for it in speech are someone's registered mark, so the
         * title is the plain word - and in German the plain word is
         * Zauberwürfel, which is what everyone there calls it anyway.
         */
        name: "Cube",

        tagline:
          "Scramble it and put it back, against the clock. Four cubes from 2×2 to 5×5 and a pyramid, in real 3D, and every layer turned by dragging it.",

        metaDescription:
          "A 3D cube in the browser: the 2×2, 3×3, 4×4 and 5×5 and the pyramid, turned by dragging a layer, with a clock and a best time for each.",
        lead: "Scramble it and put it back together. Drag a layer to turn it, and drag anywhere around the puzzle to turn the whole thing over. The clock starts with your first turn and stops when every face is one colour again.",

        /** The legend over the five tiles. A cube's name on a tile is its size,
         *  which is a number and is written by the page. `cube` is the word a
         *  screen reader hears in front of it, and `pyramid` is the fifth
         *  tile's whole name. */
        puzzles: "Choose a puzzle",
        cube: "Cube",
        pyramid: "Pyramid",

        time: "Time",
        moves: "Moves",
        /** A time, where lower wins, and the label says so: "Best" alone over
         *  a number reads as a score. */
        best: "Best time",
        scramble: "Scramble",
        undo: "Undo",

        /** The line along the foot of the stage, for the two states that are
         *  waiting on the reader. */
        cue: {
          idle: "Scramble it to start",
          ready: "The clock starts with your first turn",
        },

        /** One per kind of puzzle, since the cube and the pyramid are turned
         *  with different letters. The page shows the one that applies. */
        hint: {
          cube: "Drag a sticker to turn its layer, and drag anywhere around the cube to turn all of it. On a keyboard, U, D, L, R, F and B turn a face, Shift turns it the other way, a number first reaches a deeper layer, and the arrow keys turn the whole cube. H shows a hint.",
          pyramid: "Drag a sticker to turn its corner, and drag anywhere around the pyramid to turn all of it. On a keyboard, U, L, R and B turn a corner, Shift turns it the other way, 1 first turns the tip alone, and the arrow keys turn the whole pyramid. H shows a hint.",
        },

        /** Read out, since the scene itself cannot be. */
        messages: {
          scrambled: "Scrambled. The clock starts with your first turn.",
        },

        /**
         * The hint: the button, the card, and two things for every move.
         *
         * `move` is what to do, in the words of someone holding the puzzle:
         * which layer, named by where it is on screen, and which way the
         * stickers facing the reader go. The game works out both from the view
         * and the page puts them in `turn` or, for half a turn, `half`. So the
         * layers are written the way the sentence needs them, with their
         * article or case.
         *
         * `stages` is why: a sentence for every kind of move in every step of
         * every method, keyed by the step and the move as the hint module names
         * them.
         *
         * ⚠️ `{piece}` is where the page draws the piece's colours as chips,
         * not as words: a colour named in the sentence would have to agree
         * with "edge" or "corner" in every language, for every combination of
         * colours. `colours` is only what a screen reader hears for the chips,
         * in the order of the faces in the game module.
         *
         * ⚠️ `left` carries its own colon, for the reason `built` does.
         */
        advice: {
          button: "Hint",
          step: "Step {n} of {total}",
          left: "Moves left in this step:",
          play: "Play it",
          close: "Close the hint",
          colours: ["white", "red", "green", "yellow", "orange", "blue"],
          move: {
            turn: "Turn {layer} {way}.",
            half: "Turn {layer} half way round.",
            layers: {
              top: "the top layer",
              bottom: "the bottom layer",
              left: "the left side",
              right: "the right side",
              front: "the front face",
              back: "the back face",
              middle: "the middle layer",
              tipTop: "the top tip",
              tipLeft: "the left tip",
              tipRight: "the right tip",
              tipBack: "the back tip",
              cornerTop: "the top corner",
              cornerLeft: "the left corner",
              cornerRight: "the right corner",
              cornerBack: "the back corner",
            },
            ways: {
              up: "up",
              down: "down",
              left: "to the left",
              right: "to the right",
              clockwise: "clockwise",
              anticlockwise: "anticlockwise",
            },
          },
          stages: {
            cross: {
              title: "White cross",
              place:
                "This brings the {piece} edge towards the white face, between the white centre and the centre of its other colour, without moving the white edges already there.",
            },
            corners: {
              title: "White corners",
              out: "The {piece} corner is on the white layer but in the wrong place, so it comes out to the top layer first.",
              align: "This brings the {piece} corner right above its place.",
              insert: "This sequence drops the {piece} corner into place, white side down. It is repeated until it lands.",
            },
            middle: {
              title: "Middle layer",
              out: "The {piece} edge is in the middle layer but in the wrong place, so it comes out to the top first.",
              align: "This stands the {piece} edge over the centre of its own colour.",
              right: "This sequence takes the {piece} edge down into the middle layer, to the right.",
              left: "This sequence takes the {piece} edge down into the middle layer, to the left.",
            },
            yellowCross: {
              title: "Yellow cross",
              align: "This lines the yellow shape up for the sequence.",
              alg: "This sequence turns the top edges yellow side up. Sometimes it takes it twice.",
            },
            yellowEdges: {
              title: "Yellow edges",
              align: "This lines the top edges up with the centres below them.",
              alg: "This sequence swaps top edges round and leaves the layers below as they were.",
            },
            yellowCorners: {
              title: "Yellow corners in place",
              alg: "This sequence moves three top corners round, and the one at the front right stays where it is.",
            },
            yellowTwist: {
              title: "Twisting the yellow corners",
              twist:
                "This sequence is repeated until the top corner at the front right shows yellow on top. The layers below come apart meanwhile and go back together at the end.",
              next: "This brings the next corner to the front right.",
              finish: "The last turn, and it is solved.",
            },
            layer: {
              title: "First layer",
              out: "The {piece} corner is on the white layer but in the wrong place, so it comes out to the top layer first.",
              align: "This brings the {piece} corner right above its place.",
              insert: "This sequence drops the {piece} corner into place, white side down. It is repeated until it lands.",
            },
            orient: {
              title: "Yellow on top",
              align: "This lines the corners up for the sequence.",
              alg: "This sequence turns the top corners yellow side up. Sometimes it takes it more than once.",
            },
            permute: {
              title: "Last layer",
              align: "This sets up the swap.",
              alg: "This sequence swaps top corners and leaves the layer below as it was.",
              finish: "The last turn, and it is solved.",
            },
            tips: {
              title: "Tips",
              place: "This twists the {piece} tip until its colours match the centre under it.",
            },
            centres: {
              title: "Centres",
              place: "This turns a corner with its tip until its three centre colours match the faces around it.",
            },
            edges: {
              title: "Edges",
              place: "This brings the {piece} edge into place, keeping the centres and the edges already placed where they are.",
            },
          },
        },

        won: {
          title: "Solved",
          record: "Your best time on this puzzle.",
          again: "Scramble again",
          next: "Next puzzle",
          assisted: "Solved with hints, so it does not count as a record.",
        },

        how: {
          label: "How to play",
          items: [
            {
              title: "Drag a layer",
              description:
                "Press a sticker and drag it the way you want its row or column to go. The layer follows your finger and clicks into place when you let go, and a quick flick carries it the rest of the way.",
            },
            {
              title: "Drag around it to turn it over",
              description:
                "Drag anywhere off the puzzle to turn the whole thing and look at another side. Let go and it settles square to you again, so three faces are always in clear view. On a desktop the right mouse button does the same on the puzzle itself.",
            },
            {
              title: "Scramble, then beat the clock",
              description:
                "Scramble mixes it with a few dozen random turns. The clock starts with your first turn and stops the moment every face is one colour, and your best time is kept for each puzzle. Undo takes back the last turn. Stuck? Hint shows the next move and what it is for, one step of the method at a time, and a solve made with hints does not count as a record.",
            },
            {
              title: "Five puzzles",
              description:
                "The 2×2 is the place to start and the 3×3 is the classic. The 4×4 and 5×5 add layers in the middle, and the pyramid turns in thirds around its corners, with tips that twist on their own.",
            },
          ],
        },

        close: {
          label: "How it is built",
          paragraphs: [
            "No canvas, no WebGL and no 3D library. The puzzle is a scene of ordinary elements, one per sticker, placed in three dimensions with CSS transforms, and the browser draws the perspective and works out what is in front of what. A 5×5 is a hundred and fifty of them. A turn writes a rotation onto the stickers in the turning layer and onto nothing else, and two dark plates slide into the cut so the inside of the puzzle is never empty.",
            "No turn is written down anywhere. A puzzle is a list of places a sticker can be, each with a centre and a direction it faces, and a turn is an axis, a slice of depth along it and an angle. The stickers a turn takes are the ones in the slice, and where each one lands is found by rotating it and looking up the place that is there. The cube and the pyramid have nothing mechanical in common and run on the same code, and the 3×3 passes the classic check: R U, repeated 105 times, brings it back to solved.",
            "A drag is measured through the same projection the browser draws with. Every axis the sticker under your finger could turn about is tried, and the one whose motion on screen best matches your finger wins, so the right layer turns from any angle, at a speed that keeps the sticker under your finger. When you let go, a spring pulls the layer to the nearest step. It is set a little under critical damping, so the layer overshoots by a degree or two and settles back, which is what makes it read as plastic clicking into place.",
            "After a turn, a sticker takes the position of the place it landed in rather than keeping the rotation that got it there. The two can differ by a quarter turn in the sticker's own plane, which cannot be seen because every sticker is symmetric about its centre, and it means no rounding error builds up however long you play.",
            "Each sticker is lit from one direction, fixed to you rather than to the puzzle, so the face on top is the bright one and the face on the right the dim one however the puzzle is turned. The brightness is recalculated as the view turns and only written when it changes by a visible amount. The sounds are made in the browser as well: every turn is two clicks a few milliseconds apart over a short, low knock.",
            "The hints follow the method people are taught rather than the shortest solution, because a shortest solution can only say that a move is one closer, which teaches nothing. The 3×3 is solved in the seven steps of the layer by layer method, the 2×2 in three and the pyramid in three, and each move carries its step, the piece it is about and, inside a sequence, the sequence itself. Where a step is judgement rather than a sequence, such as which white edge to bring down next and how, a short search finds the fewest moves for that one piece that keep everything already placed in place. The plan is worked out again whenever the puzzle is not where it said it would be, and it was checked by following it from fifteen hundred random scrambles, every one of which it solved.",
          ],
        },
      },
    },
  },

  services: {
    label: "What I can help with",
    items: [
      {
        title: "Backend and API development",
        description:
          "REST APIs and services in Node.js (NestJS, Express) or .NET, with data modelling, authentication, role-based access and third-party integrations.",
      },
      {
        title: "Full-stack product work",
        description:
          "A whole feature from one person: the database schema, the API and the React screens that use it.",
      },
      {
        title: "AWS architecture and deployment",
        description:
          "Setting up cloud infrastructure or tightening what already runs: environments, CI/CD pipelines, and a review of cost and reliability.",
      },
      {
        title: "Technical review and consulting",
        description:
          "A review of an existing codebase or architecture: what to fix first, a refactoring plan, and whether a rewrite is worth it.",
      },
    ],
  },

  contact: {
    label: "Contact",
    intro:
      "Email is the fastest way to reach me. If you have a project in mind, a rough description of the problem is enough to start.",
    emailLabel: "Email",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
  },

  footer: {
    backToTop: "Back to top",
  },

  /**
   * The 404 page. `status` is the code itself, which is the same three
   * characters in every language and is only here so the page can label it.
   */
  notFound: {
    metaTitle: "Page not found - Vuk Cvetković",
    status: "404",
    heading: "Page not found",
    body: "The address may be wrong, or the page may have moved. The link below goes back to the start, and everything on the site is one step from there.",
    cta: "Back to the homepage",
  },
};

export default en;
