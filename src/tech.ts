/**
 * Marks for the stack, as data.
 *
 * Official paths come from simple-icons (CC0), imported rather than pasted: the
 * NestJS mark alone is 6KB of path data, and the package is a devDependency
 * that Vite tree-shakes at build, so only the eight marks used here ship. No
 * image files are involved, which is the point - a mark that takes
 * `currentColor` works in both themes and costs no extra request.
 *
 * Three entries have no free mark. Amazon and Microsoft both had theirs removed
 * from simple-icons over trademark, and SQL is a standard rather than a product,
 * so those use lucide outlines instead, quoted here as path data so every icon
 * renders through the same component.
 *
 * `TechName` is the union of the keys, and src/site.ts types its skill lists
 * against it, so listing a technology with no mark is a type error.
 */
import {
  siAstro,
  siDocker,
  siDotnet,
  siExpress,
  siFastapi,
  siMongodb,
  siNestjs,
  siNodedotjs,
  siNumpy,
  siOpencv,
  siPytorch,
  siPython,
  siReact,
  siRoboflow,
  siUltralytics,
} from 'simple-icons';

interface TechIcon {
  /** Path data on a 24x24 box, the box both icon sets draw on. */
  path: string;
  /** An outline rather than a filled mark, so it needs stroke attributes. */
  stroked?: boolean;
  /**
   * Brand colour for light mode. Left off where there is no brand, and the icon
   * then inherits the text colour.
   */
  hex?: string;
  /**
   * Light-mode colours that fail on a dark ground, and the reverse. Express is
   * near-black, .NET is a dark violet, and React publishes #087EA4 for light
   * grounds and #61DAFB for dark, which is the pair used here.
   */
  darkHex?: string;
}

/* lucide outlines, from node_modules/@lucide/astro/src/icons. The ellipse and
 * line elements are written as path data so the shape of an entry stays one
 * string: database.ts, cloud.ts, hash.ts and brain.ts respectively. */
const lucideDatabase = 'M3 5a9 3 0 1 0 18 0a9 3 0 1 0-18 0M3 5V19A9 3 0 0 0 21 19V5M3 12A9 3 0 0 0 21 12';
const lucideCloud = 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z';
const lucideHash = 'M4 9h16M4 15h16M10 3 8 21M16 3 14 21';
const lucideBrain =
  'M12 18V5M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5M17.997 5.125a4 4 0 0 1 2.526 5.77M18 18a4 4 0 0 0 2-7.464M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517M6 18a4 4 0 0 1-2-7.464M6.003 5.125a4 4 0 0 0-2.526 5.77';
/* app-window.ts and server.ts. Their `rect` elements are written out as path
 * data with the same 2px corner radius, for the same reason as above. */
const lucideAppWindow =
  'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM10 4v4M2 8h20M6 4v4';
const lucideServer =
  'M4 2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM4 14h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zM6 6h.01M6 18h.01';

export const techIcons = {
  NestJS: { path: siNestjs.path, hex: `#${siNestjs.hex}` },
  'Node.js': { path: siNodedotjs.path, hex: `#${siNodedotjs.hex}` },
  Express: { path: siExpress.path, hex: `#${siExpress.hex}`, darkHex: '#e8e8e8' },
  '.NET': { path: siDotnet.path, hex: `#${siDotnet.hex}`, darkHex: '#8a6cf1' },
  'C#': { path: lucideHash, stroked: true, hex: '#512bd4', darkHex: '#8a6cf1' },
  React: { path: siReact.path, hex: '#087ea4', darkHex: `#${siReact.hex}` },
  Astro: { path: siAstro.path, hex: `#${siAstro.hex}`, darkHex: '#d08bf5' },
  SQL: { path: lucideDatabase, stroked: true },
  MongoDB: { path: siMongodb.path, hex: `#${siMongodb.hex}`, darkHex: '#5cc063' },
  AWS: { path: lucideCloud, stroked: true, hex: '#e07c00', darkHex: '#ff9900' },
  Docker: { path: siDocker.path, hex: `#${siDocker.hex}` },

  /*
   * The project stacks. Python aside, nothing here is a listed skill - these are
   * the names a single project was built on, and they render on that project's
   * page and in the tag row that summarises it, which is why they sit in the
   * same registry without all being in site.skillGroups.
   *
   * Four of the brand colours are too dark to carry on the dark ground and get a
   * lighter pair: Ultralytics is near-navy, NumPy near-black, and OpenCV and
   * Python are both deep enough to close up. ML.NET is the fourth Microsoft mark
   * with no free logo, so it takes a lucide outline in the .NET violet, which
   * puts it in the same family as .NET and C# without repeating their glyph.
   */
  Python: { path: siPython.path, hex: `#${siPython.hex}`, darkHex: '#6ba8d8' },
  FastAPI: { path: siFastapi.path, hex: `#${siFastapi.hex}`, darkHex: '#2ec4b6' },
  Ultralytics: { path: siUltralytics.path, hex: `#${siUltralytics.hex}`, darkHex: '#8b9df2' },
  PyTorch: { path: siPytorch.path, hex: `#${siPytorch.hex}` },
  OpenCV: { path: siOpencv.path, hex: `#${siOpencv.hex}`, darkHex: '#9182f7' },
  NumPy: { path: siNumpy.path, hex: `#${siNumpy.hex}`, darkHex: '#4dabcf' },
  Roboflow: { path: siRoboflow.path, hex: `#${siRoboflow.hex}`, darkHex: '#a97ef0' },
  'ASP.NET Core': { path: siDotnet.path, hex: `#${siDotnet.hex}`, darkHex: '#8a6cf1' },
  'ML.NET': { path: lucideBrain, stroked: true, hex: '#512bd4', darkHex: '#8a6cf1' },

  /*
   * Two more Microsoft names with no free mark, so two more lucide outlines in
   * the .NET violet - the same family as .NET, C# and ML.NET, and each with a
   * glyph none of the others use. A window with a title bar for the desktop
   * client, stacked racks for the service it calls.
   */
  WCF: { path: lucideServer, stroked: true, hex: '#512bd4', darkHex: '#8a6cf1' },
  'Windows Forms': { path: lucideAppWindow, stroked: true, hex: '#512bd4', darkHex: '#8a6cf1' },
} satisfies Record<string, TechIcon>;

export type TechName = keyof typeof techIcons;

/**
 * `satisfies` keeps the keys as a literal union, which is what makes TechName
 * exact, but it also keeps each value's own narrow type, so indexing the object
 * directly gives a union that has no `hex` on the three uncoloured entries.
 * Widening to TechIcon here means callers read one shape.
 */
export function getTechIcon(name: TechName): TechIcon {
  return techIcons[name];
}
