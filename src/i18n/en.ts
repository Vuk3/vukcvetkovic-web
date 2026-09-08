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
    title: "Vuk Cvetković - Backend developer",
    description:
      "Backend developer in Niš, Serbia. Services in Node.js (NestJS, Express), event-driven infrastructure on AWS, and the React interfaces in front of them.",
    ogImageAlt: "Vuk Cvetković, backend developer",
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
    themeToggle: "Toggle dark theme",
    language: "Language",
  },

  hero: {
    positioning:
      "Backend developer at Ncoded Solutions, in Niš. I build services in Node.js (NestJS, Express), and in .NET where a client already runs it, then put them on AWS: containers, queues, and the events that pass between them.",
    cta: "Contact me",
    portraitAlt: "Portrait of Vuk Cvetković",
    /** Only rendered if src/assets/portrait.* is missing. */
    portraitPlaceholder: "portrait",
  },

  about: {
    label: "About",
    paragraphs: [
      "Most of my work sits on the backend. I design APIs and the services behind them, mainly in Node.js (NestJS, Express), and carry the same work through to the React interfaces on top of them when a project needs it.",
      "I care about systems that are still understandable after the first release: clear boundaries between services, types that describe the domain rather than restate the database, and infrastructure a small team can operate without ceremony. Most of what I build runs on AWS.",
      "I am based in Niš, Serbia. I started on the full-stack side, building .NET Web API services behind ASP.NET MVC sites, and have moved steadily towards the backend and the infrastructure under it. Alongside the work I am finishing a master’s in software engineering.",
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
        "Projects by Vuk Cvetković, backend developer in Niš: what each system does, how it is built, and what came out of it.",
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

        flow: {
          before: ["Image, multipart/form-data", "NestJS gateway"],
          branches: [
            ["FastAPI service", "Ultralytics YOLOv8m"],
            ["ASP.NET Core service", "ML.NET model"],
          ],
          after: ["One JSON shape", "Boxes, classes, confidence"],
        },

        overview: [
          "The question was not which model detects best in the abstract. It was what changes when the same detection task is built twice, once in the ecosystem research reaches for and once in the one that already runs the backend. So the system trains a YOLOv8m model in Python and an ML.NET model in .NET on the same annotated images, puts both behind one API, and runs an image through either or both.",
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
            body: "Boxes as outlines or as filled regions, one detection or all of them, and zoom, so you can see where a box actually sits rather than roughly where it is.",
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
            "The comparison stops where it can still be honest. Both models saw one image domain and six classes, and parameters were left comparable rather than tuned to each model's best, so this is two configurations measured against each other and not the ceiling of either tool.",
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
          before: ["A folder, read recursively into bytes", "WCF service"],
          branches: [
            ["AES", "CBC, from the .NET library"],
            ["RC6", "Written by hand, 20 rounds"],
            ["XXTEA", "Written by hand, Feistel network"],
          ],
          after: ["One encrypted file per input", "SHA-512 recorded before and after"],
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
            body: "Both modes are built in, and a checkbox picks between them. The parallel run spreads the file list across a parallel loop, and because every file is read, transformed and written on its own there are no conflicts to resolve, so it finishes faster than taking one file at a time.",
          },
          {
            title: "A progress bar that gets out of the way",
            body: "It is an estimate, paced from the total byte count, because the service reports nothing back while it works. A cancellation token cuts it short and fills it the instant the real call returns, so it can run ahead of the work but never behind it.",
          },
          {
            title: "The file tree up front",
            body: "A tree view of everything that was loaded, expanded, before you commit to encrypting it. Useful mostly for catching that you picked the wrong folder.",
          },
        ],

        dataset: [],

        results: {
          columns: ["Mode", "Files", "Encryption (s)", "Decryption (s)"],
          rows: ["Sequential", "Parallel"],
          notes: [
            "The same 150 files, the same RC6 key, the same output folders, run once each way. Parallel encryption finished in 44.16 seconds against 68.91, and decryption in 40.39 against 70.13 - a third off in each direction.",
            "The gain comes from the shape of the work. Files here never depend on each other, so the list splits across a parallel loop with no shared state to guard, no conflicts to resolve and no ordering to keep, and no file waits on the one before it. That is why running them in parallel takes about a third off the whole pass rather than a few percent.",
          ],
        },

        takeaway: [
          "Implementing two ciphers rather than calling them is the part I would keep. They are short algorithms and almost every line is load-bearing: which direction a rotation goes, where the original length is stored, and the fact that XXTEA needs its arithmetic to wrap on overflow rather than raise. A single wrong assumption gives you output that looks correct until the hashes disagree.",
          "The gaps are as clear now as the thesis said they were. Everything here is symmetric, so key exchange is left entirely to whoever uses it, and the obvious next step is an asymmetric algorithm and the AES-plus-RSA hybrid that follows from it. WCF and Windows Forms also date the project honestly - neither is what I would reach for today, and moving away from that stack is a good part of what I have done since.",
        ],
      },

      networkTrafficAnalyzer: {
        title: "Network Traffic Analyzer",
        tagline: "A packet capture read once, then asked twelve questions about every packet in it.",
        description:
          "A term paper on traffic analysis, with a desktop application to demonstrate it. It opens a .pcapng capture through Pyshark, walks every packet layer by layer, and pulls out what each protocol carries - HTTP headers, DNS queries, TCP flags, FTP credentials - into an expandable tree, alongside a chart of how the protocols divide up.",
        metaTitle: "Network Traffic Analyzer - Vuk Cvetković",
        metaDescription:
          "A term paper project in Python: a Tkinter application that reads .pcapng captures through Pyshark, extracts twelve protocols per packet, and charts the protocol distribution.",
        context: "Term paper, Faculty of Electronic Engineering in Niš",
        domain: "Packet capture analysis",

        flow: {
          before: ["A .pcapng capture", "Pyshark, over Wireshark's tshark"],
          branches: [
            ["Application protocols", "HTTP, HTTPS, DNS, FTP, SMTP"],
            ["Transport and control", "TCP, UDP, ICMP, ARP"],
            ["Addressing", "IP, Ethernet"],
          ],
          after: ["One row per packet", "Expandable, and counted into the charts"],
        },

        overview: [
          "The paper is about how network traffic is analysed and why the PCAP format is what everyone standardised on. The application is the part that had to work: point it at a capture, and it tells you what is actually inside it rather than only that packets went by.",
          "It is not trying to be Wireshark. Wireshark is where you go to read one conversation in full, and it is what runs underneath this anyway - Pyshark drives its tshark. What this does instead is ask the same fixed set of questions of every packet in a file and lay the answers out in one place, which is the shape you want when you are looking for something and do not yet know which packet it is in.",
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
            body: "Packet, then protocol, then field. The interesting part is usually three clicks down, and nothing forces you to scroll past the packets you do not care about.",
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
          "The part I would keep is the discipline the format forces. A capture makes no promises about what any given packet holds, so every read has to be guarded and every absent field has to be a normal outcome rather than a failure. Writing twelve extractors against that is repetitive by design, and trying to be clever about it would only have hidden which fields are genuinely optional.",
          "The part I would change is that everything happens on one thread and every packet is held in memory. That is fine for the captures a paper runs on and wrong for a real one: a few hundred megabytes would freeze the window and exhaust the list. Streaming the file and moving the parse off the interface thread is the first thing this needs, and it is the same lesson the encryption project taught me a year earlier.",
        ],
      },
    },
  },

  services: {
    label: "What I can help with",
    items: [
      {
        title: "Backend and API development",
        description:
          "Services and APIs in Node.js (NestJS, Express) or .NET: data modelling, authentication, third-party integrations, and the tests that keep them honest.",
      },
      {
        title: "Full-stack product work",
        description:
          "A feature taken from schema to screen: the API, the React front end, and the typed contract between them.",
      },
      {
        title: "AWS architecture and deployment",
        description:
          "Setting up cloud infrastructure or tightening what already runs: environments, CI/CD pipelines, and a review of cost and reliability.",
      },
      {
        title: "Technical review and consulting",
        description:
          "A second pair of eyes on an existing codebase or architecture: code review, a refactoring plan, and an honest answer on whether a rewrite is worth it.",
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
