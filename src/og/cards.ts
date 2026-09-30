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
 * the page it opens says, in its language. Titles are set as large as their
 * column allows in at most two lines (three for a project), and every block
 * of text is balanced so no line is left holding one word.
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

/* The ink card's own palette: the dark theme's panel, its ink and its muted. */
const INK = '#0b0f18';
const TEXT = '#f2f3f5';
const SOFT = '#c9cfda';
const MUTED = '#9da4b0';
const TILE = '#151a24';
const EDGE = '#2a3140';

/** The pad round the card, and the height its two columns share. */
const PAD_X = 64;
const PAD_Y = 56;
const INNER = HEIGHT - 2 * PAD_Y;

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
const set = (face: Face, size: number, broken: string[], style: Style, tracking = 0): Node =>
  h(
    'div',
    { display: 'flex', flexDirection: 'column' },
    broken.map((line) => h('div', { fontFamily: family(face), fontSize: size, letterSpacing: tracking * size, whiteSpace: 'pre', ...style }, line)),
  );

/** Text set in balanced lines of `width`. */
const block = (type: Type, face: Face, size: number, text: string, width: number, style: Style, tracking = 0): Node =>
  set(face, size, lines(type, face, size, text, width, tracking), style, tracking);

interface Frame {
  lang: Lang;
  /** The page's own path, unprefixed. */
  path: string;
  hue: string;
  column: number;
  title: string;
  titleSizes: number[];
  titleLines: number;
  /** The most height the title may take, so a long one steps down a size
   *  rather than push the column past the card. */
  titleHeight?: number;
  body: string;
  kicker?: Node;
  /** Under the text, where it fits: a project's measured result. */
  after?: Node;
  visual: Node;
  /** Where the visual's centre is, for the light behind it. */
  glowAt: number;
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
    `radial-gradient(560px 460px at ${x}px ${y}px, ${alpha(hue, 0.14)}, ${alpha(hue, 0)} 70%)`,
    `radial-gradient(640px 380px at 0px 0px, rgba(154,168,255,0.10), rgba(154,168,255,0) 70%)`,
  ].join(', '),
  color: TEXT,
});

const header = (mark: string) =>
  h('div', { display: 'flex', alignItems: 'center', gap: 14 }, [
    img(mark, 46, 46, { borderRadius: 11 }),
    h('div', { fontFamily: family('label'), fontSize: 27, color: TEXT }, site.name),
  ]);

/** The title in the display voice, as large as its box allows. */
function heading(type: Type, text: string, sizes: number[], width: number, most: number, hue: string, tall = Infinity): Node {
  const title = fit(type, 'display', text, sizes, width, most, -0.042, tall, 0.98);
  return h(
    'div',
    { display: 'flex', flexDirection: 'column' },
    title.lines.map((line) =>
      h(
        'div',
        { fontFamily: family('display'), fontSize: title.size, lineHeight: 0.98, letterSpacing: -0.042 * title.size, color: hue, whiteSpace: 'pre' },
        line,
      ),
    ),
  );
}

/** The page's address along the foot, on one line: the longest, the French
 *  network analyzer's, is what its smallest size is for. */
function address(type: Type, lang: Lang, path: string, hue: string, width: number): Node {
  const text = `vukcvetkovic.com${localizePath(path, lang).replace(/\/$/, '')}`;
  const { size } = fit(type, 'label', text, [23, 21, 20, 19, 18], width - 17, 1);
  return h('div', { display: 'flex', alignItems: 'center', gap: 14, fontFamily: family('label'), fontSize: size }, [
    h('div', { width: 3, height: size + 4, backgroundColor: hue }),
    h('div', { color: MUTED, whiteSpace: 'pre' }, text),
  ]);
}

function frame(type: Type, mark: string, f: Frame): Node {
  const body = fit(type, 'text', f.body, [26, 24, 22, 20], f.column, 3);

  return h('div', { ...ground(f.hue, f.glowAt), alignItems: 'center', justifyContent: 'space-between' }, [
    h('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: f.column, height: INNER }, [
      header(mark),
      h('div', { display: 'flex', flexDirection: 'column', gap: 18 }, [
        ...(f.kicker ? [f.kicker] : []),
        heading(type, f.title, f.titleSizes, f.column, f.titleLines, f.hue, f.titleHeight),
        block(type, 'text', body.size, f.body, f.column, { lineHeight: 1.42, color: SOFT }),
        ...(f.after ? [f.after] : []),
      ]),
      address(type, f.lang, f.path, f.hue, f.column),
    ]),
    f.visual,
  ]);
}

/* ---- Games -------------------------------------------------------------- */

const GAME_COLUMN = 540;
const BOARD = 470;
const GAME_TITLE = [168, 150, 132, 116, 104, 94, 84, 76, 68, 62, 56];

function gameCard(type: Type, mark: string, lang: Lang, id: GameId, board: Board): Node {
  const copy = getDict(lang).games.items[id];
  return frame(type, mark, {
    lang,
    path: `/games/${site.games[id].slug}/`,
    hue: board.hue,
    column: GAME_COLUMN,
    title: copy.name,
    titleSizes: GAME_TITLE,
    titleLines: 2,
    body: copy.tagline,
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
  const span = WIDTH - 2 * PAD_X;
  const gap = 14;
  const cell = Math.floor((span - (ids.length - 1) * gap) / ids.length);
  const introWidth = 520;
  const intro = fit(type, 'text', copy.intro, [24, 22, 20], introWidth, 3);

  return h('div', { ...ground(hue, WIDTH / 2, HEIGHT - PAD_Y - cell / 2), flexDirection: 'column', justifyContent: 'space-between' }, [
    header(mark),
    h('div', { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }, [
      heading(type, copy.heading, GAME_TITLE, span - introWidth - 48, 1, hue),
      block(type, 'text', intro.size, copy.intro, introWidth, { lineHeight: 1.42, color: SOFT }),
    ]),
    h(
      'div',
      { display: 'flex', gap, alignItems: 'center' },
      ids.map((id) => h('div', { display: 'flex', width: cell, height: cell, alignItems: 'center', justifyContent: 'center' }, boards[id].draw(cell))),
    ),
    address(type, lang, '/games/', hue, span),
  ]);
}

/* ---- Projects ----------------------------------------------------------- */

const FLOW = 440;
const PROJECT_COLUMN = 560;
const PROJECT_TITLE = [96, 88, 80, 72, 66, 60, 55, 50, 46, 42];
/** A project title's most height: three lines at 76px, or two at 116. */
const PROJECT_TITLE_TALL = 230;

/** A technology's mark, in its dark-ground colour. */
function markOf(name: TechName, size: number): Node {
  const icon = getTechIcon(name);
  const colour = icon.darkHex ?? icon.hex ?? SOFT;
  const body = icon.stroked
    ? `<path d="${icon.path}" fill="none" stroke="${colour}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="${icon.path}" fill="${colour}"/>`;
  return img(svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${body}</svg>`), size, size);
}

/** An arrowhead pointing down at (x, y), for a connector's end. */
const head = (x: number, y: number, up = false) => `M${x - 6} ${y + (up ? 9 : -9)}L${x} ${y}L${x + 6} ${y + (up ? 9 : -9)}Z`;

/**
 * The project's request, as its page draws it, turned to run down the card:
 * the entry, the core, the services side by side, and the exit - or, for a
 * round trip, the answer going back up beside the request. Nodes are tiles
 * with their titles from the dictionary and their marks from `flowTech`,
 * the core the lit one; connectors are the site's 2px lines with heads.
 */
function flow(type: Type, lang: Lang, project: Project, hues: Hues): Node {
  const copy = getDict(lang).projects.items[project.id].flow;
  const tech = project.flowTech;
  const roundTrip = project.flowShape === 'roundTrip';
  const W = FLOW;
  const stroke = hues.text;
  const line = (d: string, width: number, height: number, fills = '') =>
    img(
      svg(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><path d="${d}" fill="none" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="${fills}" fill="${stroke}"/></svg>`,
      ),
      width,
      height,
    );

  /*
   * The type of a row of nodes: the largest of `sizes` at which every word in
   * every one of them fits its tile, one size for the whole row so the lane
   * reads as one. A word that fits at none is broken with a hyphen at the
   * smallest: "Anwendungsprotokolle" is one word, in a third of the lane.
   */
  const rowSize = (face: Face, texts: string[], width: number, sizes: number[]) =>
    sizes.find((size) => texts.every((text) => text.split(/\s+/).every((word) => type.measure(face, size, word) <= width))) ??
    sizes[sizes.length - 1];
  const words = (face: Face, text: string, size: number, width: number, style: Style) =>
    set(face, size, lines(type, face, size, text, width, 0, true), style);

  const node = (title: string, marks: TechName[], width: number, variant: 'plain' | 'core' | 'exit', badge?: string, sizes = { title: 17, badge: 13 }) =>
    h(
      'div',
      {
        display: 'flex',
        flexDirection: 'column',
        gap: 7,
        width,
        padding: '11px 14px',
        borderRadius: 14,
        backgroundColor: variant === 'core' ? '#070a10' : variant === 'exit' ? alpha(hues.fill, 0.24) : TILE,
        border: `1px solid ${variant === 'plain' ? EDGE : alpha(stroke, 0.7)}`,
        boxShadow: variant === 'core' ? `0 0 28px ${alpha(stroke, 0.28)}` : '0 8px 18px rgba(0,0,0,0.35)',
      },
      [
        words('tile', title, sizes.title, width - 28, { lineHeight: 1.2, color: TEXT }),
        ...(badge ? [words('text', badge, sizes.badge, width - 28, { lineHeight: 1.3, color: MUTED })] : []),
        ...(marks.length ? [h('div', { display: 'flex', gap: 8 }, marks.map((name) => markOf(name, 20)))] : []),
      ],
    );

  const n = copy.branches.length;
  const gap = 12;
  const branchWidth = (W - (n - 1) * gap) / n;
  const centres = copy.branches.map((_, i) => i * (branchWidth + gap) + branchWidth / 2);
  const mid = W / 2;
  const spine = 280;

  /* Entry to core: one line down, or for a round trip the request down on
     the left and the answer up on the right, each with its words. */
  const between = 46;
  const labelWidth = (W - 60) / 2;
  const label = (text: string, align: 'left' | 'right') =>
    h('div', { display: 'flex', width: labelWidth, justifyContent: align === 'left' ? 'flex-start' : 'flex-end' }, text ? block(type, 'text', 14, text, labelWidth - 10, { lineHeight: 1.3, color: MUTED, textAlign: align }) : []);
  const first = roundTrip
    ? h('div', { display: 'flex', alignItems: 'center', width: W }, [
        label(copy.entryLabel, 'right'),
        line(`M20 2V${between - 3}M40 ${between - 2}V3`, 60, between, `${head(20, between - 1)}${head(40, 1, true)}`),
        label(copy.exitLabel, 'left'),
      ])
    : h('div', { display: 'flex', alignItems: 'center', width: W }, [
        h('div', { display: 'flex', width: labelWidth }),
        line(`M30 2V${between - 3}`, 60, between, head(30, between - 1)),
        label(copy.entryLabel, 'left'),
      ]);

  /* Core to the services: down the spine, across, and down into each; a
     round trip's lines carry a head at both ends, since the answer comes
     back the way the request went. */
  const drop = 40;
  const across = `M${mid} 2V${drop / 2}M${Math.min(...centres)} ${drop / 2}H${Math.max(...centres)}${centres.map((x) => `M${x} ${drop / 2}V${drop - 3}`).join('')}`;
  const heads = centres.map((x) => head(x, drop - 1)).join('') + (roundTrip ? head(mid, 1, true) : '');
  const second = line(across, W, drop, heads);

  const services = h(
    'div',
    { display: 'flex', gap, width: W, alignItems: 'stretch' },
    copy.branches.map((branch, i) =>
      node(branch.title, tech.branches[i] ?? [], branchWidth, 'plain', branch.badge, {
        title: rowSize('tile', copy.branches.map((b) => b.title), branchWidth - 28, [16, 15, 14, 13]),
        badge: rowSize('text', copy.branches.map((b) => b.badge), branchWidth - 28, [13, 12, 11]),
      }),
    ),
  );

  const parts: Node[] = [
    node(copy.entry, tech.entry, spine, 'plain'),
    first,
    node(copy.core, tech.core, spine, 'core'),
    second,
    services,
  ];
  if (!roundTrip) {
    const gather = `${centres.map((x) => `M${x} 2V${drop / 2}`).join('')}M${Math.min(...centres)} ${drop / 2}H${Math.max(...centres)}M${mid} ${drop / 2}V${drop - 3}`;
    parts.push(line(gather, W, drop, head(mid, drop - 1)), node(copy.exit, tech.exit, spine, 'exit'));
  }

  return h('div', { display: 'flex', flexDirection: 'column', alignItems: 'center', width: W }, parts);
}

function projectCard(type: Type, mark: string, lang: Lang, project: Project, hues: Hues): Node {
  const dict = getDict(lang);
  const copy = dict.projects.items[project.id];

  const kicker = h('div', { display: 'flex', alignItems: 'center', gap: 12 }, [
    h(
      'div',
      {
        display: 'flex',
        padding: '5px 13px',
        borderRadius: 999,
        backgroundColor: alpha(hues.fill, 0.3),
        border: `1px solid ${alpha(hues.text, 0.45)}`,
        fontFamily: family('label'),
        fontSize: 18,
        color: hues.text,
      },
      project.year,
    ),
    block(type, 'label', 17, copy.context, PROJECT_COLUMN - 90, { lineHeight: 1.3, color: MUTED }),
  ]);

  /*
   * The measured result, where a project has one, as the card on the
   * homepage leads with it: the figure large in the hue on a trace, and the
   * words round it. Under the text where the column has the room for it, and
   * under the drawing where it does not - a three-line title and a round trip
   * (whose drawing has no exit, so is short) is Object detection's case.
   */
  let outcome: Node | undefined;
  if (project.outcome) {
    const { value, from, digits, unit = '' } = project.outcome;
    const words = (dict.projects.outcomes as Partial<Record<string, string>>)[project.id];
    if (!words) throw new Error(`share cards: ${project.id} has an outcome and no projects.outcomes words`);
    const number = new Intl.NumberFormat(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits });
    outcome = h('div', { display: 'flex', alignItems: 'center', gap: 16 }, [
      h('div', { width: 3, alignSelf: 'stretch', backgroundColor: hues.text }),
      h('div', { display: 'flex', flexDirection: 'column', gap: 4 }, [
        h('div', { fontFamily: family('display'), fontSize: 50, lineHeight: 1, letterSpacing: -2, color: hues.text }, number.format(value) + unit),
        block(type, 'text', 16, words.replace('{from}', number.format(from) + unit), FLOW - 40, { lineHeight: 1.3, color: MUTED }),
      ]),
    ]);
  }

  const title = fit(type, 'display', copy.title, PROJECT_TITLE, PROJECT_COLUMN, 3, -0.042, PROJECT_TITLE_TALL, 0.98);
  const body = fit(type, 'text', copy.tagline, [26, 24, 22, 20], PROJECT_COLUMN, 3);
  const context = lines(type, 'label', 17, copy.context, PROJECT_COLUMN - 90).length;
  const middle = context * 17 * 1.3 + title.lines.length * title.size * 0.98 + body.lines.length * body.size * 1.42 + 2 * 18;
  /* The column less the name, the address and some air between them. */
  const outcomeLeft = middle + 18 + 96 <= INNER - 46 - 30 - 48;

  const drawing = flow(type, lang, project, hues);
  return frame(type, mark, {
    lang,
    path: `/projects/${project.slug}/`,
    hue: hues.text,
    column: PROJECT_COLUMN,
    kicker,
    title: copy.title,
    titleSizes: PROJECT_TITLE,
    titleLines: 3,
    titleHeight: PROJECT_TITLE_TALL,
    body: copy.tagline,
    after: outcomeLeft ? outcome : undefined,
    visual:
      outcome && !outcomeLeft
        ? h('div', { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, width: FLOW }, [drawing, outcome])
        : drawing,
    glowAt: WIDTH - PAD_X - FLOW / 2,
  });
}

/** The four projects as rows: each one's hue, year and title, and its line. */
function projectsIndexCard(type: Type, mark: string, lang: Lang, hues: Record<ProjectHue, Hues>): Node {
  const dict = getDict(lang);
  const width = 520;
  const rows = site.projects.map((project) => {
    const copy = dict.projects.items[project.id];
    const hue = hues[project.hue];
    return h(
      'div',
      {
        display: 'flex',
        gap: 16,
        width,
        padding: '15px 18px',
        borderRadius: 16,
        backgroundColor: TILE,
        border: `1px solid ${EDGE}`,
        backgroundImage: `linear-gradient(90deg, ${alpha(hue.fill, 0.28)}, ${alpha(hue.fill, 0)} 60%)`,
      },
      [
        h('div', { width: 4, borderRadius: 2, backgroundColor: hue.text }),
        h('div', { display: 'flex', flexDirection: 'column', gap: 5, width: width - 60 }, [
          h('div', { display: 'flex', alignItems: 'baseline', gap: 12 }, [
            h('div', { fontFamily: family('label'), fontSize: 15, color: hue.text }, project.year),
            block(type, 'tile', 21, copy.title, width - 130, { lineHeight: 1.15, color: TEXT }),
          ]),
          block(type, 'text', 15, copy.tagline, width - 60, { lineHeight: 1.35, color: MUTED }),
        ]),
      ],
    );
  });

  return frame(type, mark, {
    lang,
    path: '/projects/',
    hue: hues.cobalt.text,
    column: 470,
    title: dict.projects.index.heading,
    titleSizes: GAME_TITLE,
    titleLines: 2,
    body: dict.projects.index.intro,
    visual: h('div', { display: 'flex', flexDirection: 'column', gap: 12, width }, rows),
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
