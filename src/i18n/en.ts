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
      "Backend developer in Niš, Serbia. Services in NestJS and Node.js, event-driven infrastructure on AWS, and the React interfaces in front of them.",
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
      "Backend developer at Ncoded Solutions, in Niš. I build services in NestJS and Node.js, and in .NET where a client already runs it, then put them on AWS: containers, queues, and the events that pass between them.",
    cta: "Contact me",
    portraitAlt: "Portrait of Vuk Cvetković",
    /** Only rendered if src/assets/portrait.* is missing. */
    portraitPlaceholder: "portrait",
  },

  about: {
    label: "About",
    paragraphs: [
      "Most of my work sits on the backend. I design APIs and the services behind them, mainly in NestJS and Node.js, and carry the same work through to the React interfaces on top of them when a project needs it.",
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
          "Backend services in NestJS and Node.js: REST APIs, JWT authentication, role-based access control and third-party integrations, over both SQL and document databases.",
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
        "Work I can write about in full, with the architecture and the results rather than a screenshot. One entry for now, and each gets a page of its own.",
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

    /** The two column heads of a results table that are words, not metrics. */
    results: {
      model: "Model",
      annotations: "Annotations",
    },

    /** Stack rows are named by the service they belong to. */
    stackGroups: {
      frontend: "Front end",
      gateway: "Gateway",
      pythonService: "Python service",
      dotnetService: ".NET service",
      data: "Dataset",
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

        results: [
          "Reannotating moved every metric for both models. YOLOv8m went from 0.790 to 0.916 mAP@0.5 and ML.NET from 0.580 to 0.748, so in relative terms the weaker model gained the most, 29 percent against 16. The first pass had been holding it back hardest.",
          "YOLOv8m is ahead on the numbers, and the gap that matters is recall: 0.867 against 0.709 on the corrected set, at almost the same precision. For protective equipment that asymmetry is the whole story, because a missed detection is a person the system quietly reports as fine, and precision on its own cannot tell you it happened.",
          "The comparison stops where it can still be honest. Both models saw one image domain and six classes, and parameters were left comparable rather than tuned to each model's best, so this is two configurations measured against each other and not the ceiling of either tool.",
        ],

        takeaway: [
          "The outcome sat in the data more than in the choice of framework. Reannotating the same 2,911 images moved both models further than the distance between the two ecosystems moved ML.NET, and that is not the conclusion I expected to be writing up.",
          "The engineering half was more practical. Python gave me room to experiment and produced the evaluation material for free, .NET gave me a model that drops into an ASP.NET Core service with no bridge in between, and the standardized response is the only reason one front end can treat them as interchangeable.",
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
          "Services and APIs in NestJS, Node.js or .NET: data modelling, authentication, third-party integrations, and the tests that keep them honest.",
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
