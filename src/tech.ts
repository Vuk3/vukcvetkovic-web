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
  siMongodb,
  siNestjs,
  siNodedotjs,
  siReact,
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
 * string: database.ts, cloud.ts and hash.ts respectively. */
const lucideDatabase = 'M3 5a9 3 0 1 0 18 0a9 3 0 1 0-18 0M3 5V19A9 3 0 0 0 21 19V5M3 12A9 3 0 0 0 21 12';
const lucideCloud = 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z';
const lucideHash = 'M4 9h16M4 15h16M10 3 8 21M16 3 14 21';

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
