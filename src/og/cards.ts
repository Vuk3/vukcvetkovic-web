/**
 * The share cards: one per game, per project and per index, in every locale.
 *
 * One frame for all of them, the family of the site's own card (og.png): the
 * ink ground, the V mark and the name at the top, the page's title large in
 * its own colour, its line under it, and its address along the foot - with
 * the thing itself on the right, drawn rather than described: a game's board
 * mid-play, a project's request as its page draws it, the seven boards or the
 * four projects for the indexes.
 *
 * Every word is the page's own, from the dictionaries, so a card says what
 * the page it opens says, in its language, and every block of text is
 * balanced so no line is left holding one word.
 *
 * ⚠️ **Everything is as large as the card will hold, and that is measured,
 * not guessed.** A preview shows a card at about half its size, so the
 * type is set from the room it has rather than from a fixed scale: the line
 * under a title takes the largest size at which it and the title fit the
 * column's height, the title stepping down only as far as it must, and a
 * project's drawing is scaled to the largest that fits the card. Heights
 * are worked out from the same lines satori is handed - every line is its
 * own box with its own line height - so what is measured is what is drawn.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Lang } from '../i18n/types';
import { getDict, localizePath } from '../i18n/utils';
import { site, type Project, type ProjectHue } from '../site';
import { getTechIcon, type TechName } from '../tech';
import { alpha, loadBoards, type Board, type GameId } from './boards';
import { ogImagePath } from './paths';
import { family, fit, h, HEIGHT, img, lines, svg, WIDTH, type Face, type Node, type Style, type Type } from './render';

/* The ink card's own palette: the dark theme's panel and its ink, the soft
   and muted text a step brighter than the site's, since a preview shows the
   card at half its size. */
const INK = '#0b0f18';
const TEXT = '#f2f3f5';
const SOFT = '#d5dae3';
const MUTED = '#afb6c2';
const TILE = '#151a24';
const EDGE = '#2a3140';

/** The pad round the card: as little as keeps a crop from cutting in. */
const PAD_X = 46;
const PAD_Y = 40;
const INNER = HEIGHT - 2 * PAD_Y;
const SPAN = WIDTH - 2 * PAD_X;
const COLUMN_GAP = 44;

/** The name at the top and the address at the foot, and the least air
 *  between them and the middle of the column. */
const MARK = 52;
const ADDRESS = 36;
const AIR = 22;
const MIDDLE = INNER - MARK - ADDRESS - 2 * AIR;

const TITLE_LEADING = 0.98;
const TITLE_TRACKING = -0.042;
const BODY_LEADING = 1.34;
const BODY_SIZES = [36, 34, 32, 30, 28, 26, 24];
const BODY_LINES = 5;
const GAP = 20;

interface Hues {
  /** The hue as text on the ink: the dark theme's value. */
  text: string;
  /** The hue as a fill: the light theme's, deeper. */
  fill: string;
}

/**
 * The project hues as global.css declares them, the light value first and
 * the dark one second, so a card's colour is the page's without being
 * written down twice.
 */
function readHues(root: string): Record<ProjectHue, Hues> {
  const css = readFileSync(join(root, 'src/styles/global.css'), 'utf8');
  const found = new Map<string, string[]>();
  for (const [, name, value] of css.matchAll(/--hue-([a-z]+):\s*(#[0-9a-f]{6});/gi)) {
    found.set(name, [...(found.get(name) ?? []), value]);
  }
  const hue = (name: ProjectHue): Hues => {
    const [fill, text] = found.get(name) ?? [];
    if (!fill || !text) throw new Error(`share cards: --hue-${name} needs a light and a dark value in global.css`);
    return { text, fill };
  };
  return { cobalt: hue('cobalt'), berry: hue('berry'), amber: hue('amber'), green: hue('green') };
}

/** Lines already broken, one box each so satori cannot break them again. */
const set = (face: Face, size: number, broken: string[], style: Style, tracking = 0, align: 'flex-start' | 'flex-end' = 'flex-start'): Node =>
  h(
    'div',
    { display: 'flex', flexDirection: 'column', alignItems: align },
    broken.map((line) => h('div', { fontFamily: family(face), fontSize: size, letterSpacing: tracking * size, whiteSpace: 'pre', ...style }, line)),
  );

interface Setting {
  size: number;
  lines: string[];
}

/** How tall a setting stands at a line height. */
const tall = (setting: Setting, leading: number) => setting.lines.length * setting.size * leading;

/**
 * The title and the line under it, as large as `room` allows with `fixed`
 * taken by whatever else shares the column. The line is what is read at a
 * glance in a feed, so its size is chosen first, largest down: the title
 * gives way for it, down to three fifths of the largest size it could set at
 * alone, and only then does the line step down a size and the title get its
 * room back.
 */
function settle(type: Type, title: string, titleSizes: number[], most: number, body: string, width: number, fixed: number, room: number) {
  const titles: Setting[] = titleSizes
    .map((size) => ({ size, lines: lines(type, 'display', size, title, width, TITLE_TRACKING) }))
    .filter((t) => t.lines.length <= most && t.lines.every((line) => type.measure('display', t.size, line, TITLE_TRACKING) <= width));
  if (!titles.length) titles.push(fit(type, 'display', title, titleSizes, width, most, TITLE_TRACKING));
  const floor = titles[0].size * 0.6;

  const bodies: Setting[] = BODY_SIZES.map((size) => ({ size, lines: lines(type, 'text', size, body, width) })).filter((b) => b.lines.length <= BODY_LINES);

  for (const b of bodies) {
    for (const t of titles) {
      if (t.size < floor) break;
      if (fixed + tall(t, TITLE_LEADING) + GAP + tall(b, BODY_LEADING) <= room) return { title: t, body: b };
    }
  }
  return { title: titles[titles.length - 1], body: bodies[bodies.length - 1] ?? { size: 24, lines: lines(type, 'text', 24, body, width) } };
}

/** The ink ground, with a light of the page's colour behind its picture and
 *  the site's faint cobalt from the top left. */
const ground = (hue: string, x: number, y = HEIGHT / 2): Style => ({
  width: WIDTH,
  height: HEIGHT,
  display: 'flex',
  padding: `${PAD_Y}px ${PAD_X}px`,
  backgroundColor: INK,
  backgroundImage: [
    `radial-gradient(600px 500px at ${x}px ${y}px, ${alpha(hue, 0.15)}, ${alpha(hue, 0)} 70%)`,
    `radial-gradient(640px 380px at 0px 0px, rgba(154,168,255,0.10), rgba(154,168,255,0) 70%)`,
  ].join(', '),
  color: TEXT,
});

const header = (mark: string) =>
  h('div', { display: 'flex', alignItems: 'center', gap: 16, height: MARK }, [
    img(mark, MARK, MARK, { borderRadius: 12 }),
    h('div', { fontFamily: family('label'), fontSize: 31, color: TEXT }, site.name),
  ]);

const title = (setting: Setting, hue: string) =>
  set('display', setting.size, setting.lines, { lineHeight: TITLE_LEADING, color: hue }, TITLE_TRACKING);

const body = (setting: Setting) => set('text', setting.size, setting.lines, { lineHeight: BODY_LEADING, color: SOFT });

/** The page's address along the foot, on one line, as large as the line
 *  holds: the longest, the network analyzer's in French, is what the
 *  smaller sizes are for. */
function address(type: Type, lang: Lang, path: string, hue: string, width: number): Node {
  const text = `vukcvetkovic.com${localizePath(path, lang).replace(/\/$/, '')}`;
  const { size } = fit(type, 'label', text, [30, 28, 26, 24, 22, 20], width - 18, 1);
  return h('div', { display: 'flex', alignItems: 'center', gap: 14, height: ADDRESS, fontFamily: family('label'), fontSize: size }, [
    h('div', { width: 4, height: size + 4, borderRadius: 2, backgroundColor: hue }),
    h('div', { color: MUTED, whiteSpace: 'pre' }, text),
  ]);
}

interface Frame {
  lang: Lang;
  /** The page's own path, unprefixed. */
  path: string;
  hue: string;
  column: number;
  title: Setting;
  body: Setting;
  kicker?: Node;
  /** Under the text, where it fits: a project's measured result. */
  after?: Node;
  visual: Node;
  /** Where the visual's centre is, for the light behind it. */
  glowAt: number;
}

function frame(type: Type, mark: string, f: Frame): Node {
  return h('div', { ...ground(f.hue, f.glowAt), alignItems: 'center', justifyContent: 'space-between' }, [
    h('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: f.column, height: INNER }, [
      header(mark),
      h('div', { display: 'flex', flexDirection: 'column', gap: GAP }, [
        ...(f.kicker ? [f.kicker] : []),
        title(f.title, f.hue),
        body(f.body),
        ...(f.after ? [f.after] : []),
      ]),
      address(type, f.lang, f.path, f.hue, f.column),
    ]),
    f.visual,
  ]);
}

/* ---- Games -------------------------------------------------------------- */

/** A board nearly the height of the card: a little under, so the column
 *  beside it has the width for its line and for an address like
 *  /games/minesweeper at the address's full size. */
const BOARD = 516;
const GAME_COLUMN = SPAN - BOARD - COLUMN_GAP;
const GAME_TITLE = [176, 162, 148, 136, 124, 114, 104, 96, 88, 80, 72, 66, 60];

function gameCard(type: Type, mark: string, lang: Lang, id: GameId, board: Board): Node {
  const copy = getDict(lang).games.items[id];
  const settled = settle(type, copy.name, GAME_TITLE, 2, copy.tagline, GAME_COLUMN, 0, MIDDLE);
  return frame(type, mark, {
    lang,
    path: `/games/${site.games[id].slug}/`,
    hue: board.hue,
    column: GAME_COLUMN,
    ...settled,
    visual: h('div', { display: 'flex', width: BOARD, justifyContent: 'center' }, board.draw(BOARD)),
    glowAt: WIDTH - PAD_X - BOARD / 2,
  });
}

/**
 * The wall, as the index opens: the heading with its intro beside it, as the
 * page sets them, and under them the seven boards in a row in the index's
 * order. The one card laid out across rather than in two columns, because
 * seven boards want the width: four over three beside the text left each
 * one too small to read as its game.
 */
function gamesIndexCard(type: Type, mark: string, lang: Lang, boards: Record<GameId, Board>, hue: string): Node {
  const copy = getDict(lang).games.index;
  const ids = Object.keys(site.games) as GameId[];
  const gap = 12;
  const cell = Math.floor((SPAN - (ids.length - 1) * gap) / ids.length);
  const room = INNER - MARK - cell - ADDRESS - 3 * AIR;

  const heading = fit(type, 'display', copy.heading, GAME_TITLE, SPAN * 0.5, 1, TITLE_TRACKING, room, TITLE_LEADING);
  const headingWidth = type.measure('display', heading.size, heading.lines[0], TITLE_TRACKING);
  const introWidth = SPAN - headingWidth - COLUMN_GAP;
  const intro =
    BODY_SIZES.map((size) => ({ size, lines: lines(type, 'text', size, copy.intro, introWidth) })).find(
      (b) => b.lines.length <= BODY_LINES && tall(b, BODY_LEADING) <= room,
    ) ?? { size: 22, lines: lines(type, 'text', 22, copy.intro, introWidth) };

  return h('div', { ...ground(hue, WIDTH / 2, HEIGHT - PAD_Y - cell / 2), flexDirection: 'column', justifyContent: 'space-between' }, [
    header(mark),
    h('div', { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }, [
      title(heading, hue),
      h('div', { display: 'flex', width: introWidth }, body(intro)),
    ]),
    h(
      'div',
      { display: 'flex', gap, alignItems: 'center' },
      ids.map((id) => h('div', { display: 'flex', width: cell, height: cell, alignItems: 'center', justifyContent: 'center' }, boards[id].draw(cell))),
    ),
    address(type, lang, '/games/', hue, SPAN),
  ]);
}

/* ---- Projects ----------------------------------------------------------- */

/** The drawing's width; the text takes the rest. */
const FLOW = 540;
const PROJECT_COLUMN = SPAN - FLOW - COLUMN_GAP;
const PROJECT_TITLE = [112, 102, 94, 86, 78, 72, 66, 60, 56, 52, 48, 44];

/** A technology's mark, in its dark-ground colour. */
function markOf(name: TechName, size: number): Node {
  const icon = getTechIcon(name);
  const colour = icon.darkHex ?? icon.hex ?? SOFT;
  const body = icon.stroked
    ? `<path d="${icon.path}" fill="none" stroke="${colour}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="${icon.path}" fill="${colour}"/>`;
  return img(svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${body}</svg>`), size, size);
}

/**
 * The project's request, as its page draws it, turned to run down the card:
 * the entry, the core, the services side by side, and the exit - or, for a
 * round trip, the answer going back up beside the request. Nodes are tiles
 * with their titles from the dictionary and their marks from `flowTech`,
 * the core the lit one; connectors are the site's lines with heads.
 *
 * Drawn at the largest of a run of scales whose height fits `room`: every
 * size in it - type, marks, padding, the connectors - is a base times the
 * scale, and the height is added up from the same broken lines the tiles
 * are given.
 */
function flow(type: Type, lang: Lang, project: Project, hues: Hues, room: number): Node {
  const copy = getDict(lang).projects.items[project.id].flow;
  const tech = project.flowTech;
  const roundTrip = project.flowShape === 'roundTrip';
  const W = FLOW;
  const stroke = hues.text;
  const n = copy.branches.length;

  const plan = (s: number) => {
    const r = (v: number) => Math.round(v * s * 2) / 2;
    const size = { spine: r(20), label: r(16.5), mark: Math.round(25 * s), padY: r(12), padX: r(16), gap: r(8) };
    const between = r(36);
    const drop = r(32);
    const laneGap = r(14);
    const spine = Math.round(W * 0.6);
    const branchWidth = (W - (n - 1) * laneGap) / n;
    const inner = (width: number) => width - 2 * size.padX - 2;

    /*
     * The type of a row of nodes: the largest size at which every word in
     * every one of them fits its tile, one for the whole row so the lane reads
     * as one. A word that fits at none is left out of the choice and broken
     * with a hyphen at the size the rest allow: "Anwendungsprotokolle" is one
     * word, in a third of the lane, and would otherwise shrink its row.
     */
    const rowSize = (face: Face, texts: string[], width: number, base: number) => {
      const sizes = [1, 0.94, 0.88, 0.82, 0.76].map((k) => r(base * k));
      const smallest = sizes[sizes.length - 1];
      const words = texts.flatMap((text) => text.split(/\s+/)).filter((word) => type.measure(face, smallest, word) <= width);
      return sizes.find((sz) => words.every((word) => type.measure(face, sz, word) <= width)) ?? smallest;
    };
    const branchTitle = rowSize('tile', copy.branches.map((b) => b.title), inner(branchWidth), 18);
    const badgeSize = rowSize('text', copy.branches.map((b) => b.badge), inner(branchWidth), 15.5);

    const broken = (face: Face, text: string, sz: number, width: number) => lines(type, face, sz, text, width, 0, true);

    interface Tile {
      title: string[];
      titleSize: number;
      badge?: string[];
      badgeSize: number;
      marks: TechName[];
      width: number;
      variant: 'plain' | 'core' | 'exit';
      height: number;
      beside: boolean;
    }
    /*
     * A tile on the spine - the entry, the core, the exit - sets its marks
     * beside its title, since it has the width and the drawing is short of
     * height; a tile in the lane, a third of the width, sets them under.
     */
    const tile = (text: string, marks: TechName[], width: number, variant: Tile['variant'], titleSize: number, badge?: string): Tile => {
      const beside = variant !== 'plain' || !badge;
      const marksWidth = marks.length ? marks.length * size.mark + (marks.length - 1) * size.gap + size.gap * 1.5 : 0;
      const title = broken('tile', text, titleSize, inner(width) - (beside ? marksWidth : 0));
      const badgeLines = badge ? broken('text', badge, badgeSize, inner(width)) : undefined;
      const titleHeight = title.length * titleSize * 1.2;
      const height =
        2 +
        2 * size.padY +
        (beside ? Math.max(titleHeight, marks.length ? size.mark : 0) : titleHeight) +
        (badgeLines ? size.gap + badgeLines.length * badgeSize * 1.28 : 0) +
        (!beside && marks.length ? size.gap + size.mark : 0);
      return { title, titleSize, badge: badgeLines, badgeSize, marks, width, variant, height, beside };
    };

    const entry = tile(copy.entry, tech.entry, spine, 'plain', size.spine);
    const core = tile(copy.core, tech.core, spine, 'core', size.spine);
    const branches = copy.branches.map((b, i) => tile(b.title, tech.branches[i] ?? [], branchWidth, 'plain', branchTitle, b.badge));
    const exit = roundTrip ? undefined : tile(copy.exit, tech.exit, spine, 'exit', size.spine);

    const labelWidth = (W - 64) / 2 - 8;
    const labels = {
      left: roundTrip && copy.entryLabel ? broken('text', copy.entryLabel, size.label, labelWidth) : [],
      right: (roundTrip ? copy.exitLabel : copy.entryLabel) ? broken('text', roundTrip ? copy.exitLabel : copy.entryLabel, size.label, labelWidth) : [],
    };
    const first = Math.max(between, Math.max(labels.left.length, labels.right.length) * size.label * 1.28);
    const lane = Math.max(...branches.map((b) => b.height));

    const height = entry.height + first + core.height + drop + lane + (exit ? drop + exit.height : 0);
    return { s, size, between, drop, laneGap, spine, branchWidth, entry, core, branches, exit, labels, labelWidth, first, lane, height };
  };

  const scales = [1.45, 1.36, 1.28, 1.2, 1.13, 1.06, 1, 0.94, 0.88, 0.82, 0.76];
  const p = scales.map(plan).find((candidate) => candidate.height <= room) ?? plan(scales[scales.length - 1]);

  const width = 2.6 * p.s;
  const arrow = 6 * p.s;
  const head = (x: number, y: number, up = false) => `M${x - arrow} ${y + (up ? 1.5 : -1.5) * arrow}L${x} ${y}L${x + arrow} ${y + (up ? 1.5 : -1.5) * arrow}Z`;
  const line = (d: string, w: number, hgt: number, fills: string) =>
    img(
      svg(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${hgt}" viewBox="0 0 ${w} ${hgt}"><path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/><path d="${fills}" fill="${stroke}"/></svg>`,
      ),
      w,
      hgt,
    );

  const draw = (t: (typeof p)['entry']) =>
    h(
      'div',
      {
        display: 'flex',
        flexDirection: 'column',
        gap: p.size.gap,
        width: t.width,
        height: t.variant === 'plain' && t.badge ? p.lane : t.height,
        padding: `${p.size.padY}px ${p.size.padX}px`,
        borderRadius: 14 * p.s,
        backgroundColor: t.variant === 'core' ? '#070a10' : t.variant === 'exit' ? alpha(hues.fill, 0.26) : TILE,
        border: `1px solid ${t.variant === 'plain' ? EDGE : alpha(stroke, 0.7)}`,
        boxShadow: t.variant === 'core' ? `0 0 ${30 * p.s}px ${alpha(stroke, 0.3)}` : '0 8px 18px rgba(0,0,0,0.35)',
      },
      t.beside
        ? [
            h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: p.size.gap * 1.5 }, [
              set('tile', t.titleSize, t.title, { lineHeight: 1.2, color: TEXT }),
              ...(t.marks.length ? [h('div', { display: 'flex', gap: p.size.gap }, t.marks.map((name) => markOf(name, p.size.mark)))] : []),
            ]),
          ]
        : [
            set('tile', t.titleSize, t.title, { lineHeight: 1.2, color: TEXT }),
            ...(t.badge ? [set('text', t.badgeSize, t.badge, { lineHeight: 1.28, color: MUTED })] : []),
            ...(t.marks.length ? [h('div', { display: 'flex', gap: p.size.gap }, t.marks.map((name) => markOf(name, p.size.mark)))] : []),
          ],
    );

  const mid = W / 2;
  const centres = p.branches.map((_, i) => i * (p.branchWidth + p.laneGap) + p.branchWidth / 2);

  /* Entry to core: one line down, or for a round trip the request down on
     the left and the answer up on the right, each with its words. */
  const label = (broken: string[], align: 'left' | 'right') =>
    h(
      'div',
      { display: 'flex', width: (W - 64) / 2, justifyContent: align === 'left' ? 'flex-start' : 'flex-end' },
      broken.length ? set('text', p.size.label, broken, { lineHeight: 1.28, color: MUTED }, 0, align === 'left' ? 'flex-start' : 'flex-end') : [],
    );
  const f = p.first;
  const first = roundTrip
    ? h('div', { display: 'flex', alignItems: 'center', width: W }, [
        label(p.labels.left, 'right'),
        line(`M20 2V${f - 3}M44 ${f - 2}V3`, 64, f, `${head(20, f - 1)}${head(44, 1, true)}`),
        label(p.labels.right, 'left'),
      ])
    : h('div', { display: 'flex', alignItems: 'center', width: W }, [
        h('div', { display: 'flex', width: (W - 64) / 2 }),
        line(`M32 2V${f - 3}`, 64, f, head(32, f - 1)),
        label(p.labels.right, 'left'),
      ]);

  /* Core to the services: down the spine, across, and down into each; a
     round trip's lines carry a head at both ends, since the answer comes
     back the way the request went. */
  const d = p.drop;
  const across = `M${mid} 2V${d / 2}M${Math.min(...centres)} ${d / 2}H${Math.max(...centres)}${centres.map((x) => `M${x} ${d / 2}V${d - 3}`).join('')}`;
  const heads = centres.map((x) => head(x, d - 1)).join('') + (roundTrip ? head(mid, 1, true) : '');

  const parts: Node[] = [
    draw(p.entry),
    first,
    draw(p.core),
    line(across, W, d, heads),
    h('div', { display: 'flex', gap: p.laneGap, width: W, alignItems: 'stretch' }, p.branches.map(draw)),
  ];
  if (p.exit) {
    const gather = `${centres.map((x) => `M${x} 2V${d / 2}`).join('')}M${Math.min(...centres)} ${d / 2}H${Math.max(...centres)}M${mid} ${d / 2}V${d - 3}`;
    parts.push(line(gather, W, d, head(mid, d - 1)), draw(p.exit));
  }

  return h('div', { display: 'flex', flexDirection: 'column', alignItems: 'center', width: W }, parts);
}

function projectCard(type: Type, mark: string, lang: Lang, project: Project, hues: Hues): Node {
  const dict = getDict(lang);
  const copy = dict.projects.items[project.id];

  /* The year in a pill of the hue, and the context beside it. */
  const pillSize = 22;
  const pillWidth = type.measure('label', pillSize, project.year) + 32;
  const contextSize = 21;
  const context = lines(type, 'label', contextSize, copy.context, PROJECT_COLUMN - pillWidth - 14);
  const kickerHeight = Math.max(pillSize * 1.2 + 14, context.length * contextSize * 1.28);
  const kicker = h('div', { display: 'flex', alignItems: 'center', gap: 14 }, [
    h(
      'div',
      {
        display: 'flex',
        padding: '6px 15px',
        borderRadius: 999,
        backgroundColor: alpha(hues.fill, 0.32),
        border: `1px solid ${alpha(hues.text, 0.5)}`,
        fontFamily: family('label'),
        fontSize: pillSize,
        color: hues.text,
      },
      project.year,
    ),
    set('label', contextSize, context, { lineHeight: 1.28, color: MUTED }),
  ]);

  /*
   * The measured result, where a project has one, as the card on the
   * homepage leads with it: the figure large in the hue on a trace, and the
   * words round it. Under the text where the column has the room for it, and
   * under the drawing where it does not - a three-line title and a round trip
   * (whose drawing has no exit, so is short) is Object detection's case.
   */
  const result = (width: number) => {
    if (!project.outcome) return undefined;
    const { value, from, digits, unit = '' } = project.outcome;
    const words = (dict.projects.outcomes as Partial<Record<string, string>>)[project.id];
    if (!words) throw new Error(`share cards: ${project.id} has an outcome and no projects.outcomes words`);
    const number = new Intl.NumberFormat(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits });
    const figure = 68;
    const captionSize = 21;
    const caption = lines(type, 'text', captionSize, words.replace('{from}', number.format(from) + unit), width - 22);
    return {
      height: figure + 6 + caption.length * captionSize * 1.28,
      node: h('div', { display: 'flex', alignItems: 'center', gap: 18 }, [
        h('div', { width: 4, alignSelf: 'stretch', borderRadius: 2, backgroundColor: hues.text }),
        h('div', { display: 'flex', flexDirection: 'column', gap: 6 }, [
          h('div', { fontFamily: family('display'), fontSize: figure, lineHeight: 1, letterSpacing: -2.5, color: hues.text }, number.format(value) + unit),
          set('text', captionSize, caption, { lineHeight: 1.28, color: MUTED }),
        ]),
      ]),
    };
  };

  const alone = settle(type, copy.title, PROJECT_TITLE, 3, copy.tagline, PROJECT_COLUMN, kickerHeight + GAP, MIDDLE);
  const left = result(PROJECT_COLUMN);
  const withResult = left ? settle(type, copy.title, PROJECT_TITLE, 3, copy.tagline, PROJECT_COLUMN, kickerHeight + GAP + left.height + GAP, MIDDLE) : undefined;
  /*
   * The result goes under the text if the text keeps a good size there - the
   * line at 26 or more, the title at no less than seven tenths of what it had
   * alone - because the drawing then has the card's whole height: under the
   * drawing it takes a fifth of it, and a five-level pipeline drawn in the
   * rest came out a size too small to read (Encryptix).
   */
  const resultLeft = Boolean(withResult && withResult.body.size >= 26 && withResult.title.size >= alone.title.size * 0.7);
  const under = left && !resultLeft ? result(FLOW) : undefined;

  const drawing = flow(type, lang, project, hues, under ? INNER - under.height - 28 : INNER);
  return frame(type, mark, {
    lang,
    path: `/projects/${project.slug}/`,
    hue: hues.text,
    column: PROJECT_COLUMN,
    kicker,
    ...(resultLeft && withResult ? withResult : alone),
    after: resultLeft ? left?.node : undefined,
    visual: under ? h('div', { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, width: FLOW }, [drawing, under.node]) : drawing,
    glowAt: WIDTH - PAD_X - FLOW / 2,
  });
}

/**
 * The four projects as rows: each one's hue down its edge, its year and
 * title, and its line, at the largest scale four of them fit the card's
 * height.
 */
function projectsIndexCard(type: Type, mark: string, lang: Lang, hues: Record<ProjectHue, Hues>): Node {
  const dict = getDict(lang);
  const width = 620;
  const column = SPAN - width - COLUMN_GAP;

  const plan = (s: number) => {
    const r = (v: number) => Math.round(v * s * 2) / 2;
    const size = { year: r(20), title: r(28), line: r(21), padY: r(16), padX: r(20), gap: r(13) };
    const text = width - 2 * size.padX - 2 - 4 - 18;
    const rows = site.projects.map((project) => {
      const copy = dict.projects.items[project.id];
      const yearWidth = type.measure('label', size.year, project.year);
      const title = lines(type, 'tile', size.title, copy.title, text - yearWidth - 14, 0, true);
      const tagline = lines(type, 'text', size.line, copy.tagline, text, 0, true);
      const height = 2 + 2 * size.padY + Math.max(size.year * 1.2, title.length * size.title * 1.15) + 6 + tagline.length * size.line * 1.3;
      return { project, title, tagline, height };
    });
    const height = rows.reduce((sum, row) => sum + row.height, 0) + (rows.length - 1) * size.gap;
    return { size, rows, height };
  };
  const scales = [1.3, 1.22, 1.15, 1.08, 1, 0.93, 0.86];
  const p = scales.map(plan).find((candidate) => candidate.height <= INNER) ?? plan(scales[scales.length - 1]);

  const rows = p.rows.map(({ project, title, tagline }) => {
    const hue = hues[project.hue];
    return h(
      'div',
      {
        display: 'flex',
        gap: 18,
        width,
        padding: `${p.size.padY}px ${p.size.padX}px`,
        borderRadius: 18,
        backgroundColor: TILE,
        border: `1px solid ${EDGE}`,
        backgroundImage: `linear-gradient(90deg, ${alpha(hue.fill, 0.3)}, ${alpha(hue.fill, 0)} 62%)`,
      },
      [
        h('div', { width: 4, borderRadius: 2, backgroundColor: hue.text }),
        h('div', { display: 'flex', flexDirection: 'column', gap: 6 }, [
          h('div', { display: 'flex', alignItems: 'baseline', gap: 14 }, [
            h('div', { fontFamily: family('label'), fontSize: p.size.year, color: hue.text }, project.year),
            set('tile', p.size.title, title, { lineHeight: 1.15, color: TEXT }),
          ]),
          set('text', p.size.line, tagline, { lineHeight: 1.3, color: MUTED }),
        ]),
      ],
    );
  });

  const settled = settle(type, dict.projects.index.heading, GAME_TITLE, 2, dict.projects.index.intro, column, 0, MIDDLE);
  return frame(type, mark, {
    lang,
    path: '/projects/',
    hue: hues.cobalt.text,
    column,
    ...settled,
    visual: h('div', { display: 'flex', flexDirection: 'column', gap: p.size.gap, width }, rows),
    glowAt: WIDTH - PAD_X - width / 2,
  });
}

/* ---- Every card --------------------------------------------------------- */

export interface Card {
  /** Where it is served, from paths.ts. */
  path: string;
  draw(): Node;
}

export function allCards(root: string, type: Type, langs: readonly Lang[]): Card[] {
  const mark = `data:image/png;base64,${readFileSync(join(root, 'public/apple-touch-icon.png')).toString('base64')}`;
  const boards = loadBoards(root);
  const hues = readHues(root);
  const gameIds = Object.keys(site.games) as GameId[];

  return langs.flatMap((lang): Card[] => [
    { path: ogImagePath(lang, 'games'), draw: () => gamesIndexCard(type, mark, lang, boards, hues.cobalt.text) },
    ...gameIds.map((id) => ({
      path: ogImagePath(lang, 'games', site.games[id].slug),
      draw: () => gameCard(type, mark, lang, id, boards[id]),
    })),
    { path: ogImagePath(lang, 'projects'), draw: () => projectsIndexCard(type, mark, lang, hues) },
    ...site.projects.map((project) => ({
      path: ogImagePath(lang, 'projects', project.slug),
      draw: () => projectCard(type, mark, lang, project, hues[project.hue]),
    })),
  ]);
}
