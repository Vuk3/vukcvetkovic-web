/**
 * The seven games' boards, drawn for a share card at any size.
 *
 * Each is the game at a moment of play, in the game's own dark-theme colours,
 * read from its stylesheet (styles/games/<game>.css) rather than written out
 * again, and with its own drawings where it has them - Memory's pictures and
 * card back, Battleship's ships and Accretion's stars are the sprites and the
 * sky the game draws. The dark theme because every card is on the ink.
 *
 * 2048 and Minesweeper are boxes satori lays out, since their numbers are set
 * in the site's type. The other five are one SVG each, which is how their
 * circles, bevels and sprites come out whole.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { far, mid, near } from '../games/accretion/sky';
import { WORLD_H, WORLD_W } from '../games/accretion/game';
import { family, h, img, svg, type Node } from './render';

/* ---- Colour ------------------------------------------------------------ */

type RGB = [number, number, number];

const hexRgb = (hex: string): RGB => {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? [...value].map((c) => c + c).join('') : value;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as RGB;
};

const rgbHex = (rgb: RGB) => `#${rgb.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')}`;

/* OKLab, so a mix here comes out as `color-mix(in oklab, …)` does on the site. */
const toLinear = (c: number) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c: number) => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function oklab([r, g, b]: RGB): RGB {
  const [lr, lg, lb] = [r, g, b].map(toLinear);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function fromOklab([L, a, b]: RGB): RGB {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(fromLinear) as RGB;
}

/** `color-mix(in oklab, a share%, b)`. */
export function mix(a: string, share: number, b: string): string {
  const [x, y] = [oklab(hexRgb(a)), oklab(hexRgb(b))];
  return rgbHex(fromOklab(x.map((v, i) => v * share + y[i] * (1 - share)) as RGB));
}

export const alpha = (hex: string, a: number) => `rgba(${hexRgb(hex).join(',')},${a})`;

/* ---- A game's tokens ---------------------------------------------------- */

export type Tokens = (name: string) => string;

/**
 * A game's custom properties as its dark theme sees them: the `:root` block,
 * then the `.dark` block over it. A value is resolved as far as a card needs
 * - a hex, a `var()` of one, or `color-mix(in oklab, <colour> N%, <colour>)`
 * with `transparent` - and a token a card asks for that is missing or cannot
 * be resolved throws, so a renamed token fails the build instead of drawing
 * black.
 */
export function readTokens(root: string, game: string): Tokens {
  const css = readFileSync(join(root, 'src/styles/games', `${game}.css`), 'utf8');
  const block = (selector: string) => {
    const at = css.search(new RegExp(`^${selector.replace('.', '\\.')} \\{`, 'm'));
    if (at < 0) return '';
    return css.slice(at, css.indexOf('\n}', at));
  };
  const raw = new Map<string, string>();
  for (const body of [block(':root'), block('.dark')]) {
    for (const [, name, value] of body.matchAll(/^\s*(--[a-z0-9-]+):\s*([^;]+);/gm)) raw.set(name, value.trim());
  }

  const colour = (value: string): string => {
    value = value.trim();
    if (value === 'transparent') return 'transparent';
    if (value === 'white') return '#ffffff';
    if (value === 'black') return '#000000';
    if (/^#[0-9a-f]{3,6}$/i.test(value)) return value;
    const ref = value.match(/^var\((--[a-z0-9-]+)\)$/);
    if (ref) return token(ref[1]);
    const mixed = value.match(/^color-mix\(in oklab,\s*(.+?)\s+([\d.]+)%,\s*(.+)\)$/);
    if (mixed) {
      const [a, share, b] = [colour(mixed[1]), Number(mixed[2]) / 100, colour(mixed[3])];
      if (b === 'transparent') return alpha(a, share);
      return mix(a, share, b);
    }
    throw new Error(`share cards: cannot read "${value}" in ${game}.css`);
  };

  const token = (name: string): string => {
    const value = raw.get(name);
    if (value === undefined) throw new Error(`share cards: ${name} is not in ${game}.css`);
    return colour(value);
  };

  return (name) => token(name.startsWith('--') ? name : `--${name}`);
}

/**
 * One symbol of a game's sprite sheet (components/games/<Sheet>.astro) as
 * standalone SVG markup, its `var()` fills replaced by the tokens they name.
 */
function sprite(root: string, sheet: string, id: string, tokens: Tokens, extra: Record<string, string> = {}) {
  const source = readFileSync(join(root, 'src/components/games', `${sheet}.astro`), 'utf8');
  const match = source.match(new RegExp(`<symbol id="${id}" viewBox="([^"]+)">([\\s\\S]*?)</symbol>`));
  if (!match) throw new Error(`share cards: no symbol #${id} in ${sheet}.astro`);
  const body = match[2].replace(/var\((--[a-z0-9-]+)\)/g, (_, name: string) => extra[name] ?? tokens(name));
  return { viewBox: match[1], body };
}

/* ---- The boards --------------------------------------------------------- */

export interface Board {
  /** The card's colour for this game: the title, the glow, the rule. */
  hue: string;
  draw(size: number): Node;
}

/**
 * 2048, won the way it is won: the numbers snake from the corner, so the
 * 2048 sits bottom right with every tile once and the row above it empty.
 */
function twentyFortyEight(t: Tokens): Board {
  const tiers: Record<number, string> = { 2: 't1', 4: 't2', 8: 't3', 16: 't4', 32: 't5', 64: 't6', 128: 't7', 256: 't8', 512: 't9', 1024: 't10', 2048: 't11' };
  const rows = [
    [0, 0, 0, 0],
    [0, 2, 4, 8],
    [128, 64, 32, 16],
    [256, 512, 1024, 2048],
  ];
  const hue = t('g2048-t11');

  return {
    hue,
    draw(size) {
      const pad = size * 0.034;
      const gap = size * 0.0255;
      const cell = (size - 2 * pad - 3 * gap) / 4;
      const tile = (value: number) => {
        if (!value) return h('div', { width: cell, height: cell, borderRadius: cell * 0.16, backgroundColor: t('g2048-cell') });
        const digits = String(value).length;
        const fg = value <= 4 ? t('g2048-low-fg') : value === 2048 ? '#14161a' : '#ffffff';
        return h(
          'div',
          {
            width: cell,
            height: cell,
            borderRadius: cell * 0.16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: t(`g2048-${tiers[value]}`),
            backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0) 55%)',
            boxShadow: value === 2048 ? `0 0 ${cell * 0.34}px ${alpha(hue, 0.55)}` : `0 ${cell * 0.06}px ${cell * 0.14}px rgba(0,0,0,0.35)`,
            fontFamily: family('tile'),
            fontSize: cell * (digits >= 4 ? 0.3 : digits === 3 ? 0.38 : 0.46),
            letterSpacing: -cell * 0.01,
            color: fg,
          },
          String(value),
        );
      };
      return h(
        'div',
        {
          display: 'flex',
          flexDirection: 'column',
          gap,
          padding: pad,
          borderRadius: size * 0.064,
          backgroundColor: t('g2048-tray'),
          border: '1px solid #222837',
          boxShadow: `0 ${size * 0.064}px ${size * 0.128}px rgba(0,0,0,0.45)`,
        },
        rows.map((row) => h('div', { display: 'flex', gap }, row.map(tile))),
      );
    },
  };
}

/**
 * A beginner field part cleared: ten mines, a flood opened from the middle
 * with its numbers round the edge, and three of the mines it touches flagged.
 * Worked out from the mines rather than drawn, so every number is right.
 */
function minesweeper(t: Tokens): Board {
  const N = 9;
  const mines = new Set(['0,6', '0,8', '1,1', '2,7', '3,0', '5,8', '6,2', '7,6', '8,0', '8,4']);
  const flags = new Set(['1,1', '6,2', '2,7']);
  const count = (r: number, c: number) => {
    let n = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if ((dr || dc) && mines.has(`${r + dr},${c + dc}`)) n++;
    return n;
  };
  const open = new Set<string>();
  const stack = [[4, 4]];
  while (stack.length) {
    const [r, c] = stack.pop()!;
    const key = `${r},${c}`;
    if (r < 0 || c < 0 || r >= N || c >= N || open.has(key) || mines.has(key)) continue;
    open.add(key);
    if (count(r, c) === 0) for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if (dr || dc) stack.push([r + dr, c + dc]);
  }

  const flag = svg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="30" y="18" width="7" height="64" rx="2" fill="${t('ms-mine')}"/><path d="M37 18 L78 34 L37 50 Z" fill="${t('ms-flag')}"/><rect x="22" y="78" width="36" height="8" rx="3" fill="${t('ms-mine')}"/></svg>`,
  );

  return {
    hue: t('ms-n3'),
    draw(size) {
      const pad = size * 0.032;
      const gap = size * 0.012;
      const cell = (size - 2 * pad - (N - 1) * gap) / N;
      const square = (r: number, c: number) => {
        const key = `${r},${c}`;
        const radius = cell * 0.14;
        if (open.has(key)) {
          const n = count(r, c);
          return h(
            'div',
            {
              width: cell,
              height: cell,
              borderRadius: radius,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t('ms-open'),
              fontFamily: family('tile'),
              fontSize: cell * 0.62,
              color: n ? t(`ms-n${n}`) : 'transparent',
            },
            n ? String(n) : '',
          );
        }
        return h(
          'div',
          {
            width: cell,
            height: cell,
            borderRadius: radius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: t('ms-cell'),
            backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0) 60%)',
            boxShadow: `0 ${cell * 0.05}px ${cell * 0.1}px rgba(0,0,0,0.4)`,
          },
          flags.has(key) ? img(flag, cell * 0.8, cell * 0.8) : undefined,
        );
      };
      return h(
        'div',
        {
          display: 'flex',
          flexDirection: 'column',
          gap,
          padding: pad,
          borderRadius: size * 0.06,
          backgroundColor: t('ms-tray'),
          border: '1px solid #222837',
          boxShadow: `0 ${size * 0.064}px ${size * 0.128}px rgba(0,0,0,0.45)`,
        },
        Array.from({ length: N }, (_, r) => h('div', { display: 'flex', gap }, Array.from({ length: N }, (_, c) => square(r, c)))),
      );
    },
  };
}

/**
 * A table of twelve mid-game: two pairs found and edged in gold, one card
 * turned up and waiting for its partner, the rest face down on the game's
 * cobalt back with its lattice, its light and its printed frame.
 */
function memory(root: string, t: Tokens): Board {
  const layout: (string | null)[] = ['apple', null, null, 'tulip', null, 'star', null, 'apple', 'tulip', null, null, null];
  const found = new Set(['apple', 'tulip']);
  const faces = new Map([...new Set(layout.filter(Boolean) as string[])].map((id) => [id, sprite(root, 'MemorySprites', `mem-${id}`, t)]));
  const emblem = sprite(root, 'MemorySprites', 'mem-back', t);
  const gold = t('mem-gold');

  return {
    hue: gold,
    draw(size) {
      const cols = 4;
      const rows = 3;
      const pad = size * 0.04;
      const gap = size * 0.03;
      const card = (size - 2 * pad - (cols - 1) * gap) / cols;
      const height = 2 * pad + rows * card + (rows - 1) * gap;
      const r = card * 0.12;
      const cards = layout
        .map((id, i) => {
          const x = pad + (i % cols) * (card + gap);
          const y = pad + Math.floor(i / cols) * (card + gap);
          const clip = `c${i}`;
          const shadow = `<rect x="${x}" y="${y + card * 0.05}" width="${card}" height="${card}" rx="${r}" fill="rgba(0,0,0,0.45)" filter="url(#soft)"/>`;
          if (!id) {
            const lattice = Array.from({ length: 24 }, (_, k) => {
              const o = -card + (k * card) / 8;
              return `<path d="M${x + o} ${y} l${card} ${card}M${x + o + card} ${y} l${-card} ${card}" stroke="rgba(255,255,255,0.09)" stroke-width="${card * 0.012}"/>`;
            }).join('');
            return `${shadow}<g clip-path="url(#${clip})"><rect x="${x}" y="${y}" width="${card}" height="${card}" fill="${t('mem-back')}"/>${lattice}<rect x="${x}" y="${y}" width="${card}" height="${card}" fill="url(#backlight)"/><svg x="${x}" y="${y}" width="${card}" height="${card}" viewBox="${emblem.viewBox}">${emblem.body}</svg></g><rect x="${x + card * 0.06}" y="${y + card * 0.06}" width="${card * 0.88}" height="${card * 0.88}" rx="${r * 0.6}" fill="none" stroke="${alpha(t('mem-back-ink'), 0.42)}" stroke-width="${Math.max(1, card * 0.008)}"/>`;
          }
          const face = faces.get(id)!;
          const edge = found.has(id) ? `<rect x="${x + card * 0.012}" y="${y + card * 0.012}" width="${card * 0.976}" height="${card * 0.976}" rx="${r}" fill="none" stroke="${gold}" stroke-width="${card * 0.024}"/>` : '';
          return `${shadow}<g clip-path="url(#${clip})"><svg x="${x}" y="${y}" width="${card}" height="${card}" viewBox="${face.viewBox}">${face.body}</svg></g>${edge}`;
        })
        .join('');
      const clips = layout
        .map((_, i) => `<clipPath id="c${i}"><rect x="${pad + (i % cols) * (card + gap)}" y="${pad + Math.floor(i / cols) * (card + gap)}" width="${card}" height="${card}" rx="${r}"/></clipPath>`)
        .join('');
      const markup = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${height}" viewBox="0 0 ${size} ${height}"><defs>${clips}<radialGradient id="backlight" cx="25%" cy="15%" r="90%"><stop offset="0" stop-color="#fff" stop-opacity="0.2"/><stop offset="0.55" stop-color="#fff" stop-opacity="0"/></radialGradient><filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${card * 0.04}"/></filter></defs><rect width="${size}" height="${height}" rx="${size * 0.06}" fill="${t('mem-table')}"/>${cards}</svg>`;
      return img(svg(markup), size, height);
    },
  };
}

/**
 * The ten bodies from the Moon to the Sun, spread across the well's own
 * night: its ground, the game's dust and a few of its near stars, from the
 * same generator the game draws its sky with. Each body is the game's sphere
 * - a light from the upper left over its tint, a shade to the lower right -
 * with the one mark that names it: the Moon's seas, Mars's cap, Earth's
 * land, Neptune's spot, Saturn's ring, Jupiter's belts and spot, the Sun's
 * glow.
 */
function accretion(t: Tokens): Board {
  return {
    hue: '#9d85ff',
    draw(size) {
      const s = size;
      /* Place as fractions of the square: centre and radius. */
      const bodies = [
        { tier: 0, x: 0.1, y: 0.47, r: 0.036 },
        { tier: 1, x: 0.9, y: 0.9, r: 0.042 },
        { tier: 2, x: 0.11, y: 0.9, r: 0.05 },
        { tier: 3, x: 0.555, y: 0.555, r: 0.062 },
        { tier: 4, x: 0.885, y: 0.61, r: 0.072 },
        { tier: 5, x: 0.52, y: 0.85, r: 0.085 },
        { tier: 6, x: 0.74, y: 0.8, r: 0.092 },
        { tier: 7, x: 0.3, y: 0.23, r: 0.11 },
        { tier: 8, x: 0.3, y: 0.65, r: 0.165 },
        { tier: 9, x: 0.72, y: 0.28, r: 0.195 },
      ];

      const defs: string[] = [];
      const art: string[] = [];

      /* The ground, as the well's: a band of light and three pools. */
      defs.push(
        `<linearGradient id="band" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0.22" stop-color="#6f7cc8" stop-opacity="0"/><stop offset="0.38" stop-color="#6f7cc8" stop-opacity="0.11"/><stop offset="0.5" stop-color="#8e7ec8" stop-opacity="0.09"/><stop offset="0.68" stop-color="#8e7ec8" stop-opacity="0"/></linearGradient>`,
        `<radialGradient id="poolA" cx="0.78" cy="0.14" r="0.55"><stop offset="0" stop-color="#5b4ea8" stop-opacity="0.3"/><stop offset="1" stop-color="#5b4ea8" stop-opacity="0"/></radialGradient>`,
        `<radialGradient id="poolB" cx="0.16" cy="0.34" r="0.5"><stop offset="0" stop-color="#2f5c99" stop-opacity="0.26"/><stop offset="1" stop-color="#2f5c99" stop-opacity="0"/></radialGradient>`,
        `<radialGradient id="poolC" cx="0.5" cy="1.04" r="0.7"><stop offset="0" stop-color="#1a2340" stop-opacity="0.7"/><stop offset="1" stop-color="#1a2340" stop-opacity="0"/></radialGradient>`,
      );
      art.push(
        `<rect width="${s}" height="${s}" fill="${t('acc-well')}"/>`,
        ...['band', 'poolA', 'poolB', 'poolC'].map((id) => `<rect width="${s}" height="${s}" fill="url(#${id})"/>`),
      );

      /* The dust, a square out of the middle of the world, each star a dot
         of its own pixel size rather than scaled with the square. */
      const top = (WORLD_H - WORLD_W) / 2;
      const scale = s / WORLD_W;
      for (const group of [...far, ...mid]) {
        const fill = group.tone === 'cool' ? t('acc-star-cool') : group.tone === 'warm' ? t('acc-star-warm') : '#ffffff';
        for (const [, x, y] of group.d.matchAll(/M(-?\d+) (-?\d+)h0/g)) {
          const [px, py] = [Number(x) * scale, (Number(y) - top) * scale];
          if (px < 0 || py < 0 || px > s || py > s) continue;
          art.push(`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(group.size * 0.55).toFixed(2)}" fill="${fill}" opacity="${group.alpha}"/>`);
        }
      }
      for (const star of near.slice(0, 7)) {
        const [x, y, glow] = [(star.x / 100) * s, (star.y / 100) * s, star.size * 0.9];
        const tint = star.tone === 'cool' ? t('acc-star-cool') : star.tone === 'warm' ? t('acc-star-warm') : '#ffffff';
        art.push(`<circle cx="${x}" cy="${y}" r="${glow}" fill="url(#near-${star.tone})"/><circle cx="${x}" cy="${y}" r="${glow * 0.16}" fill="#fff"/>`);
        if (star.spikes) art.push(`<path d="M${x - glow * 1.4} ${y}h${glow * 2.8}M${x} ${y - glow * 1.4}v${glow * 2.8}" stroke="${alpha(tint, 0.55)}" stroke-width="1"/>`);
      }
      for (const tone of ['white', 'cool', 'warm']) {
        const tint = tone === 'cool' ? t('acc-star-cool') : tone === 'warm' ? t('acc-star-warm') : '#ffffff';
        defs.push(`<radialGradient id="near-${tone}"><stop offset="0.12" stop-color="#fff" stop-opacity="0.9"/><stop offset="0.22" stop-color="${tint}" stop-opacity="0.75"/><stop offset="0.52" stop-color="${tint}" stop-opacity="0.16"/><stop offset="1" stop-color="${tint}" stop-opacity="0"/></radialGradient>`);
      }

      for (const body of bodies) {
        const tint = t(`acc-p${body.tier}`);
        const [cx, cy, r] = [body.x * s, body.y * s, body.r * s];
        const id = `b${body.tier}`;
        defs.push(
          `<radialGradient id="${id}" cx="0.32" cy="0.26" r="0.78"><stop offset="0" stop-color="${mix(tint, 0.52, '#ffffff')}"/><stop offset="0.22" stop-color="${mix(tint, 0.84, '#ffffff')}"/><stop offset="0.48" stop-color="${tint}"/><stop offset="0.84" stop-color="${mix(tint, 0.74, '#000000')}"/><stop offset="1" stop-color="${mix(tint, 0.52, '#000000')}"/></radialGradient>`,
          `<clipPath id="${id}c"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>`,
        );
        const marks: string[] = [];
        const dark = mix(tint, 0.62, '#000000');
        const light = mix(tint, 0.6, '#ffffff');
        if (body.tier === 0) marks.push(`<circle cx="${cx - r * 0.3}" cy="${cy - r * 0.2}" r="${r * 0.28}" fill="${dark}" opacity="0.5"/><circle cx="${cx + r * 0.25}" cy="${cy + r * 0.2}" r="${r * 0.2}" fill="${dark}" opacity="0.45"/>`);
        if (body.tier === 1) marks.push(`<circle cx="${cx + r * 0.2}" cy="${cy - r * 0.25}" r="${r * 0.16}" fill="${dark}" opacity="0.5"/><circle cx="${cx - r * 0.3}" cy="${cy + r * 0.3}" r="${r * 0.12}" fill="${dark}" opacity="0.45"/>`);
        if (body.tier === 2) marks.push(`<ellipse cx="${cx}" cy="${cy - r * 0.86}" rx="${r * 0.5}" ry="${r * 0.2}" fill="#f4efe8"/><path d="M${cx - r} ${cy + r * 0.1} q${r * 0.6} ${-r * 0.3} ${r * 1.1} ${-r * 0.05} t${r} ${r * 0.1}" stroke="${dark}" stroke-width="${r * 0.22}" fill="none" opacity="0.45"/>`);
        if (body.tier === 3) marks.push(`<path d="M${cx - r} ${cy - r * 0.2} q${r} ${-r * 0.35} ${r * 2} 0M${cx - r} ${cy + r * 0.3} q${r} ${-r * 0.3} ${r * 2} 0" stroke="${light}" stroke-width="${r * 0.18}" fill="none" opacity="0.55"/>`);
        if (body.tier === 4) marks.push(`<path d="M${cx - r * 0.55} ${cy - r * 0.55} c${r * 0.35} ${-r * 0.2} ${r * 0.6} ${r * 0.1} ${r * 0.45} ${r * 0.45} s${-r * 0.1} ${r * 0.5} ${-r * 0.35} ${r * 0.35} s${-r * 0.3} ${-r * 0.6} ${-r * 0.1} ${-r * 0.8}Z" fill="#4f9a55"/><path d="M${cx + r * 0.2} ${cy + r * 0.05} c${r * 0.3} ${-r * 0.1} ${r * 0.55} ${r * 0.25} ${r * 0.4} ${r * 0.55} s${-r * 0.45} ${r * 0.2} ${-r * 0.5} ${-r * 0.1}Z" fill="#6d9a4a"/><path d="M${cx - r} ${cy + r * 0.05} q${r} ${-r * 0.35} ${r * 2} ${-r * 0.1}" stroke="#ffffff" stroke-width="${r * 0.12}" fill="none" opacity="0.55"/><ellipse cx="${cx}" cy="${cy - r * 0.9}" rx="${r * 0.45}" ry="${r * 0.14}" fill="#f4f7fb"/>`);
        if (body.tier === 5) marks.push(`<ellipse cx="${cx - r * 0.1}" cy="${cy + r * 0.1}" rx="${r * 0.28}" ry="${r * 0.15}" fill="${dark}" opacity="0.6"/><path d="M${cx - r} ${cy - r * 0.35} h${r * 2}" stroke="${light}" stroke-width="${r * 0.08}" opacity="0.35"/>`);
        if (body.tier === 6) marks.push(`<path d="M${cx - r} ${cy - r * 0.1} h${r * 2}" stroke="${light}" stroke-width="${r * 0.3}" opacity="0.25"/>`);
        if (body.tier === 7) marks.push(...[-0.45, -0.1, 0.25, 0.55].map((dy, k) => `<path d="M${cx - r} ${cy + r * dy} h${r * 2}" stroke="${k % 2 ? dark : light}" stroke-width="${r * 0.16}" opacity="0.35"/>`));
        if (body.tier === 8) marks.push(...[-0.55, -0.22, 0.12, 0.42, 0.7].map((dy, k) => `<path d="M${cx - r} ${cy + r * dy} h${r * 2}" stroke="${k % 2 ? light : dark}" stroke-width="${r * 0.15}" opacity="${k % 2 ? 0.3 : 0.45}"/>`), `<ellipse cx="${cx + r * 0.3}" cy="${cy + r * 0.28}" rx="${r * 0.22}" ry="${r * 0.12}" fill="#b5503a" opacity="0.8"/>`);

        const ring = (front: boolean) =>
          `<g transform="rotate(-16 ${cx} ${cy})"><path d="M${cx - r * 1.7} ${cy} a${r * 1.7} ${r * 0.48} 0 0 ${front ? 0 : 1} ${r * 3.4} 0" stroke="${mix(tint, 0.78, '#ffffff')}" stroke-width="${r * 0.2}" fill="none" opacity="0.9"/><path d="M${cx - r * 1.45} ${cy} a${r * 1.45} ${r * 0.38} 0 0 ${front ? 0 : 1} ${r * 2.9} 0" stroke="${dark}" stroke-width="${r * 0.08}" fill="none" opacity="0.6"/></g>`;

        if (body.tier === 9) {
          defs.push(`<radialGradient id="glow"><stop offset="0.45" stop-color="#ffd06a" stop-opacity="0.55"/><stop offset="0.62" stop-color="#ff8a1e" stop-opacity="0.22"/><stop offset="1" stop-color="#e84d0c" stop-opacity="0"/></radialGradient>`);
          art.push(`<circle cx="${cx}" cy="${cy}" r="${r * 1.6}" fill="url(#glow)"/>`);
        }
        if (body.tier === 7) art.push(ring(false));
        art.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/><g clip-path="url(#${id}c)">${marks.join('')}<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#shade)"/></g>`);
        if (body.tier === 7) art.push(ring(true));
      }
      defs.push(`<radialGradient id="shade" cx="0.3" cy="0.25" r="0.85"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/></radialGradient>`);

      const markup = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><defs>${defs.join('')}<clipPath id="well"><rect width="${s}" height="${s}" rx="${s * 0.05}"/></clipPath></defs><g clip-path="url(#well)">${art.join('')}</g><rect x="0.5" y="0.5" width="${s - 1}" height="${s - 1}" rx="${s * 0.05}" fill="none" stroke="${t('acc-well-edge')}"/></svg>`;
      return img(svg(markup), s, s);
    },
  };
}

/**
 * Your own waters in the middle of a battle: the fleet placed, their shots
 * across it - three hits on the battleship, one on the cruiser, the rest in
 * the sea - drawn with the game's ships on its grid, eight across rather than
 * ten so a ship is large enough to be one.
 */
function battleship(root: string, t: Tokens): Board {
  const fleet = [
    { ship: 0, row: 1, col: 1, length: 5, hits: [1, 2, 3] },
    { ship: 1, row: 7, col: 4, length: 4, hits: [] },
    { ship: 2, row: 4, col: 4, length: 3, hits: [0] },
    { ship: 3, row: 6, col: 0, length: 3, hits: [] },
    { ship: 4, row: 3, col: 0, length: 2, hits: [] },
  ];
  const misses = ['0,3', '2,6', '3,4', '5,1', '5,7', '6,5', '2,2', '0,7'];
  const sprites = fleet.map(({ ship }) => {
    const hull = t(`bs-s${ship}`);
    return sprite(root, 'BattleshipSprites', `bs-ship-${ship}`, t, {
      '--bs-hull': hull,
      '--bs-hull-edge': mix(hull, 0.88, '#ffffff'),
      '--bs-hull-deck': mix(hull, 0.54, '#ffffff'),
    });
  });

  return {
    hue: '#4f9ce8',
    draw(size) {
      const N = 8;
      const pad = size * 0.03;
      const cell = (size - 2 * pad) / N;
      const art: string[] = [`<rect width="${size}" height="${size}" rx="${size * 0.05}" fill="${t('bs-tray')}"/>`, `<rect x="${pad}" y="${pad}" width="${cell * N}" height="${cell * N}" fill="${t('bs-sea')}"/>`];
      for (let i = 0; i <= N; i++) {
        art.push(`<path d="M${pad + i * cell} ${pad}v${cell * N}M${pad} ${pad + i * cell}h${cell * N}" stroke="${t('bs-grid')}" stroke-width="1"/>`);
      }
      fleet.forEach((ship, k) => {
        const [x, y] = [pad + ship.col * cell, pad + ship.row * cell];
        for (const hit of ship.hits) art.push(`<rect x="${x + hit * cell}" y="${y}" width="${cell}" height="${cell}" fill="${alpha(t('bs-hit'), 0.28)}"/>`);
        art.push(`<svg x="${x}" y="${y + cell * 0.04}" width="${cell * ship.length}" height="${cell * 0.92}" viewBox="${sprites[k].viewBox}">${sprites[k].body}</svg>`);
        for (const hit of ship.hits) {
          const [cx, cy, a] = [x + (hit + 0.5) * cell, y + cell / 2, cell * 0.26];
          art.push(`<path d="M${cx - a} ${cy - a}L${cx + a} ${cy + a}M${cx + a} ${cy - a}L${cx - a} ${cy + a}" stroke="${t('bs-hit')}" stroke-width="${cell * 0.1}" stroke-linecap="round"/>`);
        }
      });
      for (const miss of misses) {
        const [r, c] = miss.split(',').map(Number);
        art.push(`<circle cx="${pad + (c + 0.5) * cell}" cy="${pad + (r + 0.5) * cell}" r="${cell * 0.14}" fill="${t('bs-miss')}"/>`);
      }
      const markup = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><defs><clipPath id="tray"><rect width="${size}" height="${size}" rx="${size * 0.05}"/></clipPath></defs><g clip-path="url(#tray)">${art.join('')}</g><rect x="0.5" y="0.5" width="${size - 1}" height="${size - 1}" rx="${size * 0.05}" fill="none" stroke="${t('bs-tray-edge')}"/></svg>`;
      return img(svg(markup), size, size);
    },
  };
}

/**
 * A 3×3 cube mid-solve, seen from above a corner: the top layer done in
 * white, the two sides half there. Drawn in isometric projection on the
 * game's black plastic, each sticker rounded and inset, the sides shaded as
 * the light falls on them.
 */
function cube(t: Tokens): Board {
  const c = [0, 1, 2, 3, 4, 5].map((i) => t(`cube-c${i}`));
  /* Top all white; the left face green with a stray, the right red with two. */
  const top = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const left = [2, 2, 2, 5, 2, 3, 2, 4, 2];
  const right = [1, 1, 1, 3, 1, 1, 5, 1, 4];

  return {
    hue: c[2],
    draw(size) {
      const e = size * 0.4; /* one edge of the cube, projected */
      const [ox, oy] = [size / 2, size * 0.06];
      const cos = Math.cos(Math.PI / 6);
      const at = (x: number, y: number, z: number) => [ox + (x - y) * cos * e, oy + (x + y) * 0.5 * e + (1 - z) * e * 1.04] as const;
      const poly = (points: (readonly [number, number])[], fill: string, extra = '') => `<path d="M${points.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L')}Z" fill="${fill}" ${extra}/>`;
      const inset = (points: (readonly [number, number])[], k: number) => {
        const [mx, my] = points.reduce(([a, b], [x, y]) => [a + x / points.length, b + y / points.length], [0, 0]);
        return points.map(([x, y]) => [mx + (x - mx) * k, my + (y - my) * k] as const);
      };
      const art: string[] = [];
      art.push(`<ellipse cx="${ox}" cy="${oy + e * 2.12}" rx="${e * 1.5}" ry="${e * 0.3}" fill="rgba(0,0,0,0.45)" filter="url(#blur)"/>`);
      /* The body. */
      art.push(poly([at(0, 0, 1), at(1, 0, 1), at(1, 1, 1), at(0, 1, 1)], t('cube-plastic')));
      art.push(poly([at(0, 1, 1), at(1, 1, 1), at(1, 1, 0), at(0, 1, 0)], mix(t('cube-plastic'), 0.85, '#000000')));
      art.push(poly([at(1, 0, 1), at(1, 1, 1), at(1, 1, 0), at(1, 0, 0)], mix(t('cube-plastic'), 0.7, '#000000')));
      const faces: [number[], (i: number, j: number) => (readonly [number, number])[], number][] = [
        [top, (i, j) => [at(j / 3, i / 3, 1), at((j + 1) / 3, i / 3, 1), at((j + 1) / 3, (i + 1) / 3, 1), at(j / 3, (i + 1) / 3, 1)], 1],
        [left, (i, j) => [at(j / 3, 1, 1 - i / 3), at((j + 1) / 3, 1, 1 - i / 3), at((j + 1) / 3, 1, 1 - (i + 1) / 3), at(j / 3, 1, 1 - (i + 1) / 3)], 0.86],
        [right, (i, j) => [at(1, 1 - j / 3, 1 - i / 3), at(1, 1 - (j + 1) / 3, 1 - i / 3), at(1, 1 - (j + 1) / 3, 1 - (i + 1) / 3), at(1, 1 - j / 3, 1 - (i + 1) / 3)], 0.7],
      ];
      for (const [stickers, corners, light] of faces) {
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const colour = c[stickers[i * 3 + j]];
            const lit = light === 1 ? colour : mix(colour, light, '#000000');
            art.push(poly(inset(corners(i, j), 0.84), lit, `stroke="${lit}" stroke-width="${e * 0.03}" stroke-linejoin="round"`));
          }
        }
      }
      /* A glint across the top face. */
      art.push(poly([at(0, 0, 1), at(1, 0, 1), at(1, 1, 1), at(0, 1, 1)], 'url(#glint)'));
      const markup = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><defs><filter id="blur" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="${e * 0.12}"/></filter><linearGradient id="glint" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.18"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>${art.join('')}</svg>`;
      return img(svg(markup), size, size);
    },
  };
}

/**
 * The frame on its feet with red about to win: seven discs each, the last
 * red one closing a diagonal from the bottom left, which is ringed as the
 * game rings a four.
 */
function fourInARow(t: Tokens): Board {
  const grid = ['.......', '.......', '....R..', '...RY..', '..RYRY.', 'YRYRYYR'];
  const four = new Set(['5,1', '4,2', '3,3', '2,4']);

  return {
    hue: t('four-red-light'),
    draw(size) {
      const cols = 7;
      const rows = 6;
      const pad = size * 0.045;
      const pitch = (size - 2 * pad) / cols;
      const height = 2 * pad + rows * pitch;
      const hole = pitch * 0.38;
      const art: string[] = [];
      art.push(`<rect x="0" y="0" width="${size}" height="${height}" rx="${size * 0.05}" fill="url(#board)"/>`);
      for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
          const [cx, cy] = [pad + (col + 0.5) * pitch, pad + (r + 0.5) * pitch];
          const disc = grid[r][col];
          art.push(`<circle cx="${cx}" cy="${cy}" r="${hole * 1.08}" fill="${t('four-board-deep')}" opacity="0.55"/>`);
          if (disc === '.') {
            art.push(`<circle cx="${cx}" cy="${cy}" r="${hole}" fill="#070b16"/>`);
          } else {
            const id = disc === 'R' ? 'red' : 'yellow';
            art.push(`<circle cx="${cx}" cy="${cy}" r="${hole}" fill="url(#${id})"/><circle cx="${cx}" cy="${cy}" r="${hole * 0.66}" fill="none" stroke="${disc === 'R' ? t('four-red-deep') : t('four-yellow-deep')}" stroke-width="${hole * 0.08}" opacity="0.6"/>`);
            if (four.has(`${r},${col}`)) art.push(`<circle cx="${cx}" cy="${cy}" r="${hole * 1.02}" fill="none" stroke="#ffffff" stroke-width="${hole * 0.14}"/>`);
          }
        }
      }
      const gradient = (id: string, light: string, base: string, deep: string) =>
        `<radialGradient id="${id}" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="${light}"/><stop offset="0.45" stop-color="${base}"/><stop offset="1" stop-color="${deep}"/></radialGradient>`;
      const markup = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${height}" viewBox="0 0 ${size} ${height}"><defs><linearGradient id="board" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t('four-board-light')}"/><stop offset="0.18" stop-color="${t('four-board')}"/><stop offset="1" stop-color="${t('four-board-deep')}"/></linearGradient>${gradient('red', t('four-red-light'), t('four-red'), t('four-red-deep'))}${gradient('yellow', t('four-yellow-light'), t('four-yellow'), t('four-yellow-deep'))}</defs>${art.join('')}</svg>`;
      return img(svg(markup), size, height);
    },
  };
}

export type GameId = 'twentyFortyEight' | 'minesweeper' | 'memory' | 'accretion' | 'battleship' | 'cube' | 'fourInARow';

export function loadBoards(root: string): Record<GameId, Board> {
  return {
    twentyFortyEight: twentyFortyEight(readTokens(root, '2048')),
    minesweeper: minesweeper(readTokens(root, 'minesweeper')),
    memory: memory(root, readTokens(root, 'memory')),
    accretion: accretion(readTokens(root, 'accretion')),
    battleship: battleship(root, readTokens(root, 'battleship')),
    cube: cube(readTokens(root, 'cube')),
    fourInARow: fourInARow(readTokens(root, 'four')),
  };
}
