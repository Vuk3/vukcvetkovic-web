/**
 * Drawing a share card: the type, measuring and breaking text, and turning a
 * tree of boxes into a PNG.
 *
 * satori lays the tree out with flexbox and writes it as SVG with every glyph
 * as a path, resvg rasterises that, and sharp packs the PNG. All three run at
 * build, in Node (see integration.ts); nothing here reaches a browser.
 *
 * ⚠️ **The type is four static cuts of Archivo in src/og/fonts**, because
 * satori reads neither woff2 nor a variable font's axes and the site ships
 * only the variable woff2. Each is the latin and latin-ext subsets merged and
 * pinned at one weight and width with fontTools' instancer:
 *
 *   display  wght 720, wdth 125   titles, the site's wide masthead voice
 *   tile     wght 680, wdth 112   numbers and node titles, as the boards set them
 *   label    wght 600, wdth 108   the name, labels, the address line
 *   text     wght 440, wdth 100   taglines and captions
 *
 * They cover the four locales' alphabets. A character outside them does not
 * fall back silently: `measure` throws on it, naming the text, and satori is
 * told to throw rather than fetch a font, so the build fails.
 */
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

export type Face = 'display' | 'tile' | 'label' | 'text';

export const FACES: Face[] = ['display', 'tile', 'label', 'text'];

/** The family each cut is registered under, so a style names the cut rather
 *  than a weight satori would have to match. */
export const family = (face: Face) => `og-${face}`;

/** A box in the tree satori lays out. */
export interface Node {
  type: string;
  props: Record<string, unknown>;
}

export type Style = Record<string, string | number>;

export const h = (type: string, style: Style, children?: unknown): Node => ({
  type,
  props: { style, children },
});

export const img = (src: string, width: number, height: number, style: Style = {}): Node => ({
  type: 'img',
  props: { src, width, height, style: { width, height, ...style } },
});

/** An SVG drawn by hand, as an image satori places and resvg paints. */
export const svg = (markup: string) => `data:image/svg+xml;base64,${Buffer.from(markup).toString('base64')}`;

interface Metrics {
  upm: number;
  advance(codePoint: number): number | undefined;
}

/**
 * Advance widths and coverage straight from a TrueType file: `head` for the
 * units per em, `hhea` and `hmtx` for the advances, and the format 4 `cmap`
 * (the only one fontTools wrote) for which characters exist. Kerning is left
 * out, which errs a little wide, and wide is the safe side for a line that
 * must fit.
 */
function metrics(buffer: Buffer): Metrics {
  const u16 = (at: number) => buffer.readUInt16BE(at);
  const u32 = (at: number) => buffer.readUInt32BE(at);

  const tables = new Map<string, number>();
  for (let i = 0; i < u16(4); i++) {
    const record = 12 + i * 16;
    tables.set(buffer.toString('latin1', record, record + 4), u32(record + 8));
  }
  const table = (tag: string) => {
    const offset = tables.get(tag);
    if (offset === undefined) throw new Error(`share cards: the font has no ${tag} table`);
    return offset;
  };

  const upm = u16(table('head') + 18);
  const hMetrics = u16(table('hhea') + 34);
  const hmtx = table('hmtx');

  const cmap = table('cmap');
  let format4: number | undefined;
  for (let i = 0; i < u16(cmap + 2); i++) {
    const subtable = cmap + u32(cmap + 8 + i * 8);
    if (u16(subtable) === 4) format4 = subtable;
  }
  if (format4 === undefined) throw new Error('share cards: the font has no format 4 cmap');

  const segments = u16(format4 + 6) / 2;
  const ends = format4 + 14;
  const starts = ends + segments * 2 + 2;
  const deltas = starts + segments * 2;
  const ranges = deltas + segments * 2;

  const glyph = (codePoint: number) => {
    if (codePoint > 0xffff) return 0;
    for (let i = 0; i < segments; i++) {
      if (codePoint > u16(ends + i * 2)) continue;
      const start = u16(starts + i * 2);
      if (codePoint < start) return 0;
      const delta = buffer.readInt16BE(deltas + i * 2);
      const range = u16(ranges + i * 2);
      if (range === 0) return (codePoint + delta) & 0xffff;
      const id = u16(ranges + i * 2 + range + (codePoint - start) * 2);
      return id === 0 ? 0 : (id + delta) & 0xffff;
    }
    return 0;
  };

  return {
    upm,
    advance(codePoint) {
      const id = glyph(codePoint);
      return id === 0 ? undefined : u16(hmtx + 4 * Math.min(id, hMetrics - 1));
    },
  };
}

export interface Type {
  /** What satori is handed. */
  fonts: { name: string; data: Buffer; weight: 400; style: 'normal' }[];
  measure(face: Face, size: number, text: string, tracking?: number): number;
}

export function loadType(root: string): Type {
  const files = new Map(FACES.map((face) => [face, readFileSync(join(root, 'src/og/fonts', `archivo-${face}.ttf`))]));
  const read = new Map(FACES.map((face) => [face, metrics(files.get(face)!)]));

  return {
    fonts: FACES.map((face) => ({ name: family(face), data: files.get(face)!, weight: 400, style: 'normal' })),

    /** Width in pixels, with `tracking` in em as a style's letter spacing. */
    measure(face, size, text, tracking = 0) {
      const font = read.get(face)!;
      let units = 0;
      for (const char of text) {
        const advance = font.advance(char.codePointAt(0)!);
        if (advance === undefined) {
          throw new Error(`share cards: "${char}" (U+${char.codePointAt(0)!.toString(16)}) is not in the ${face} cut, in "${text}"`);
        }
        units += advance;
      }
      return (units / font.upm) * size + [...text].length * tracking * size;
    },
  };
}

/**
 * Text broken into lines no wider than `max`, and then balanced: the
 * narrowest width that still gives as many lines, so the last line is not
 * one word under a full one. What `text-wrap: balance` does on the site.
 */
export function lines(type: Type, face: Face, size: number, text: string, max: number, tracking = 0, split = false): string[] {
  const wide = (word: string) => type.measure(face, size, word, tracking) > max;

  /*
   * With `split`, a word wider than the line is broken with a hyphen - at a
   * German compound's joint where there is one (the linking s of
   * "Anwendungs-protokolle"), otherwise as late as it fits. Only ever the last
   * resort of `fit`, for a word no size on its list can hold.
   */
  const broken = (word: string): string[] => {
    if (!wide(word)) return [word];
    let cut = 1;
    while (cut < word.length - 1 && !wide(`${word.slice(0, cut + 1)}-`)) cut++;
    const joint = word.slice(0, cut).search(/[^s]s(?=[^s]{0,5}$)/) + 1;
    if (joint > 3 && word.length - joint > 4) cut = joint + 1;
    return [`${word.slice(0, cut)}-`, ...broken(word.slice(cut))];
  };

  const words = text.split(/\s+/).filter(Boolean).flatMap((word) => (split ? broken(word) : [word]));

  const fit = (width: number) => {
    const out: string[] = [];
    let line = '';
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (line && type.measure(face, size, next, tracking) > width) {
        out.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) out.push(line);
    return out;
  };

  const greedy = fit(max);
  if (greedy.length < 2) return greedy;

  let low = Math.max(...words.map((word) => type.measure(face, size, word, tracking)));
  let high = max;
  while (high - low > 1) {
    const mid = (low + high) / 2;
    if (fit(mid).length <= greedy.length) high = mid;
    else low = mid;
  }
  return fit(high);
}

/**
 * The largest of `sizes` at which `text` sets in no more than `most` lines
 * of `max`, with no single word wider than the line, and - given `tall`, the
 * height the block may take at `leading` - no taller than that. Where no size
 * will do, the smallest, with any word still too wide broken across lines
 * (see `lines`), so a card never overflows: a node in a project's drawing is
 * a third of the lane, and German puts a whole phrase in one word.
 */
export function fit(
  type: Type,
  face: Face,
  text: string,
  sizes: number[],
  max: number,
  most: number,
  tracking = 0,
  tall = Infinity,
  leading = 1,
): { size: number; lines: string[] } {
  for (const size of sizes) {
    const set = lines(type, face, size, text, max, tracking);
    const widest = Math.max(...set.map((line) => type.measure(face, size, line, tracking)));
    if (set.length <= most && widest <= max && set.length * size * leading <= tall) return { size, lines: set };
  }
  const size = sizes[sizes.length - 1];
  return { size, lines: lines(type, face, size, text, max, tracking, true) };
}

export const WIDTH = 1200;
export const HEIGHT = 630;

/**
 * The tree as a PNG. resvg is given no fonts of its own: satori has already
 * turned every glyph into a path, and a card that asked resvg for a font
 * would be drawing text this file never measured.
 *
 * sharp then packs it into a palette PNG, dithered, which takes a card to
 * about a quarter of resvg's size (2048's, 146 KB to 40) with no difference
 * to be seen at the size a preview shows it.
 */
export async function png(type: Type, tree: Node): Promise<Buffer> {
  const markup = await satori(tree as never, {
    width: WIDTH,
    height: HEIGHT,
    fonts: type.fonts,
    loadAdditionalAsset: async (code: string, segment: string) => {
      throw new Error(`share cards: no font for "${segment}" (${code})`);
    },
  });
  const raster = new Resvg(markup, { fitTo: { mode: 'width', value: WIDTH }, font: { loadSystemFonts: false } })
    .render()
    .asPng();
  return sharp(raster).png({ palette: true, quality: 95, colours: 256, dither: 0.6, compressionLevel: 9, effort: 10 }).toBuffer();
}
