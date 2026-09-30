/**
 * The sky behind Accretion's well, drawn at build time rather than by the page.
 *
 * Four layers at four depths: a dust of faint stars, thickest along a band
 * the way the Milky Way is; nebulae made of noise; a scatter of brighter stars;
 * and a handful near enough to glow, twinkle and throw diffraction spikes. The
 * module slides each layer by an amount that goes with its depth as the aim
 * moves across the well, which is what makes it read as depth rather than as
 * a painted backdrop.
 *
 * Seeded, so the sky is the same on every build, in every language and for
 * every reader. A star is one `M x y h0` in a path with round caps - a dot the
 * width of the stroke - and every star of one size and tone shares a path, so
 * three hundred of them are a few kilobytes of markup and no request.
 *
 * Here rather than in the page's frontmatter because two components draw it:
 * the game (Accretion.astro) and its thumbnail on the games index
 * (games/ArtAccretion.astro), which takes the same stars so the card cannot
 * show a different night from the game it opens. Markup rather than rules in
 * styles/games/accretion.css, which is inlined into the index as well, so a
 * star costs only the pages that draw it. Nothing here reaches a browser as
 * script: both components run it at build.
 */
import { WORLD_H, WORLD_W } from './game';

export function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TONES = ['white', 'cool', 'cool', 'white', 'warm'] as const;

/** `sizes` is a list of [stroke width in pixels, opacity], and `banded` the
 *  share of the stars that fall along the band rather than anywhere. */
function dust(seed: number, count: number, sizes: [number, number][], banded: number) {
  const random = seeded(seed);
  const groups = new Map<string, { d: string[]; size: number; alpha: number; tone: string }>();

  for (let i = 0; i < count; i++) {
    let x = random() * WORLD_W;
    let y = random() * WORLD_H;

    // The band runs corner to corner, up from the bottom left, and a star on
    // it is spread across it by a rough bell curve: three uniforms summed.
    if (random() < banded) {
      const along = random();
      const across = (random() + random() + random() - 1.5) * 170;
      x = -100 + along * 1400 + across * 0.64;
      y = 1400 - along * 1150 + across * 0.77;
    }

    const [size, alpha] = sizes[Math.floor(random() * sizes.length)];
    const tone = TONES[Math.floor(random() * TONES.length)];
    const key = `${size} ${tone}`;
    const group = groups.get(key) ?? { d: [], size, alpha, tone };
    group.d.push(`M${Math.round(x)} ${Math.round(y)}h0`);
    groups.set(key, group);
  }

  return [...groups.values()].map((group) => ({ ...group, d: group.d.join('') }));
}

export const far = dust(7, 260, [[0.9, 0.35], [1.1, 0.5], [1.4, 0.62]], 0.45);
export const mid = dust(19, 70, [[1.6, 0.72], [2, 0.84], [2.5, 0.95]], 0.2);

/** The three nebulae: the region each one's noise is computed over, in world
 *  units, and a seed and a grain each so no two look alike. */
export const clouds = [
  { id: 'a', x: 420, y: -60, w: 840, h: 820, seed: 4, frequency: '0.0026 0.0038' },
  { id: 'b', x: -80, y: 260, w: 860, h: 900, seed: 9, frequency: '0.0031 0.0024' },
  { id: 'c', x: 360, y: 900, w: 820, h: 760, seed: 13, frequency: '0.0034 0.003' },
];

/** The near stars: where, how big their glow is, how fast they twinkle, and
 *  whether they are bright enough to throw spikes. */
export const near = (() => {
  const random = seeded(31);
  return Array.from({ length: 11 }, (_, i) => ({
    x: Math.round(random() * 960 + 20) / 10,
    y: Math.round(random() * 960 + 20) / 10,
    size: Math.round(10 + random() * 12),
    tone: ['white', 'cool', 'warm'][i % 3],
    twinkle: Math.round((2.6 + random() * 3.4) * 10) / 10,
    delay: -Math.round(random() * 60) / 10,
    spikes: i % 3 === 0,
  }));
})();
