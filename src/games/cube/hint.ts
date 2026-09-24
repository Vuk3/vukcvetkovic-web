/**
 * Hints: the next move of a solve, and the reason it is the next move.
 *
 * ⚠️ **A hint follows a method a person would use, not the shortest solution.**
 * A shortest solution can only ever say "this is one move closer", which
 * teaches nothing, and on the three by three it needs a solver several times
 * the size of this whole game. So each puzzle is solved the way it is taught:
 * the three by three layer by layer in seven steps, the two by two a layer and
 * then the last layer in two, the pyramid tips, centres and edges. Every move
 * carries the step it belongs to, the piece it is about and, when it is part
 * of a sequence, the sequence and where in it this move is.
 *
 * The method is worked out from the geometry, like everything else here: a
 * piece is a cell of the cut arrangement, found by which side of every cut its
 * stickers lie on, a face's colour is its centre's, and a sequence such as
 * R U R' U' is spelled in a frame - which face is up, which is in front - so
 * one line of notation serves any corner of the cube.
 *
 * Where a step is a matter of judgement rather than a sequence - which cross
 * edge to place next, how to bring it down - a short search finds the fewest
 * moves for that one piece while keeping everything already placed in place,
 * which is what an experienced person does by eye.
 *
 * Loaded only when a hint is first asked for, so a solve that never asks costs
 * nothing.
 */

import { permutation, type Shape, type Turn } from './game';

type Vec = [number, number, number];

const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec, b: Vec): Vec => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

/** The steps of each method, in order. Their names are prose, in the
 *  dictionaries, keyed by these. */
export const METHODS = {
  three: ['cross', 'corners', 'middle', 'yellowCross', 'yellowEdges', 'yellowCorners', 'yellowTwist'],
  two: ['layer', 'orient', 'permute'],
  pyramid: ['tips', 'centres', 'edges'],
} as const;

export type Stage = (typeof METHODS)[keyof typeof METHODS][number];

/** What a move is doing within its step, which picks the sentence that
 *  explains it. */
export type Say = 'place' | 'out' | 'align' | 'insert' | 'right' | 'left' | 'alg' | 'twist' | 'next' | 'finish';

export interface Step {
  turn: Turn;
  stage: Stage;
  /** Which step of the method this is, from one, and how many there are. */
  number: number;
  of: number;
  say: Say;
  /** The colours of the piece the move is about, as face indices. Empty when
   *  it is about no one piece. */
  piece: number[];
  /** The sequence this move is part of, in notation, and where in it this
   *  move falls. */
  alg: string[] | null;
  at: number;
  /** Moves still to come in this step after this one. */
  left: number;
  /**
   * How the method holds the puzzle for this move: which face is up and, when
   * a sequence is under way, which is in front. The page turns the puzzle to
   * match, so "the top layer" and the R in R U R' U' are what the reader sees.
   * Null where nothing is said about up or front, as on the pyramid.
   */
  hold: { U: number; F: number | null } | null;
}

type Held = Step['hold'];

/* ---- The puzzle, as pieces and faces -------------------------------------- */

interface Model {
  shape: Shape;
  /** Slots grouped into physical pieces, and which piece each slot is in. */
  cells: number[][];
  cellOf: Int16Array;
  /** The outward normal of each face, by face index. */
  normals: Vec[];
}

const models = new WeakMap<Shape, Model>();

/**
 * The pieces are the cells of the cut arrangement: two stickers belong to one
 * piece exactly when they lie on the same side of every cut, along every
 * axis. That finds the cube's corners, edges and centres and the pyramid's
 * tips, centres and edges with one rule and no list of either.
 */
function model(shape: Shape): Model {
  const known = models.get(shape);
  if (known) return known;

  const bounds = [shape.extent[0] - 1, ...shape.cuts, shape.extent[1] + 1];
  const groups = new Map<string, number[]>();

  shape.slots.forEach((slot, s) => {
    const key = shape.axes
      .map((axis) => {
        const depth = dot(slot.piece, axis);
        return bounds.findIndex((b, i) => depth > b && depth < bounds[i + 1]);
      })
      .join();
    groups.set(key, [...(groups.get(key) ?? []), s]);
  });

  const cells = [...groups.values()];
  const cellOf = new Int16Array(shape.slots.length);
  cells.forEach((cell, c) => cell.forEach((s) => (cellOf[s] = c)));

  const normals: Vec[] = [];
  for (const slot of shape.slots) normals[slot.face] ??= slot.normal as Vec;

  const built = { shape, cells, cellOf, normals };
  models.set(shape, built);
  return built;
}

/** The colour on a slot: the face its sticker belongs to when solved. */
const colour = (m: Model, occ: Int16Array, s: number) => m.shape.slots[occ[s]].face;

const apply = (occ: Int16Array, map: Int16Array) => {
  const next = new Int16Array(occ.length);
  occ.forEach((e, s) => (next[map[s]] = e));
  return next;
};

/** A composed map: where a slot ends up after all of these, in order. */
const compose = (maps: Int16Array[], n: number) =>
  maps.reduce((acc, map) => acc.map((s) => map[s]) as Int16Array, new Int16Array(n).map((_, i) => i));

const faceOf = (m: Model, v: Vec) => m.normals.findIndex((n) => dot(n, v) > 0.9);
const opposite = (m: Model, f: number) => faceOf(m, m.normals[f].map((x) => -x) as Vec);

/** The faces a piece shows, one per sticker. */
const facesOf = (m: Model, cell: number) => m.cells[cell].map((s) => m.shape.slots[s].face);

const sameSet = (a: number[], b: number[]) => a.length === b.length && a.every((x) => b.includes(x));

/** Where the piece of these colours is now. */
const findPiece = (m: Model, occ: Int16Array, colours: number[]) =>
  m.cells.findIndex((cell) => sameSet(cell.map((s) => colour(m, occ, s)), colours));

/** Where the piece of these colours belongs, given the colour of every face. */
const homeOf = (m: Model, frame: number[], colours: number[]) =>
  m.cells.findIndex((_, c) => sameSet(facesOf(m, c).map((f) => frame[f]), colours));

/** The slot a piece's sticker of colour `c` is on now, and where it belongs. */
const slotNow = (m: Model, occ: Int16Array, colours: number[], c: number) =>
  m.cells[findPiece(m, occ, colours)].find((s) => colour(m, occ, s) === c)!;

const slotHome = (m: Model, frame: number[], colours: number[], c: number) =>
  m.cells[homeOf(m, frame, colours)].find((s) => frame[m.shape.slots[s].face] === c)!;

const placed = (m: Model, occ: Int16Array, frame: number[], cell: number) =>
  m.cells[cell].every((s) => colour(m, occ, s) === frame[m.shape.slots[s].face]);

/* ---- Turns and sequences ---------------------------------------------------- */

/** An outer face of the cube turned clockwise, as seen from outside it, by
 *  this many quarters. */
function faceTurn(m: Model, f: number, steps: number): Turn {
  const n = m.normals[f];
  const axis = n.findIndex((x) => Math.abs(x) > 0.5);
  const sign = Math.sign(n[axis]);
  const half = m.shape.extent[1];
  const [lo, hi] = sign > 0 ? [half - 1, half] : [-half, -half + 1];
  return { axis, lo, hi, turns: steps * sign };
}

/** A face, the way a person holding the cube names it: which face is up and
 *  which is in front decides which one is R. */
interface Hold {
  U: number;
  F: number;
}

function faces(m: Model, hold: Hold): Record<string, number> {
  const R = faceOf(m, cross(m.normals[hold.F], m.normals[hold.U]));
  return { U: hold.U, F: hold.F, R, D: opposite(m, hold.U), B: opposite(m, hold.F), L: opposite(m, R) };
}

/** A sequence in standard notation, as turns, for the cube held this way. */
function spell(m: Model, notation: string, hold: Hold): Turn[] {
  const named = faces(m, hold);
  return notation.split(' ').map((token) => {
    const steps = token.endsWith("'") ? -1 : token.endsWith('2') ? 2 : 1;
    return faceTurn(m, named[token[0]], steps);
  });
}

/* ---- Building a plan ----------------------------------------------------------- */

class Plan {
  readonly m: Model;
  occ: Int16Array;
  steps: Omit<Step, 'number' | 'of' | 'left'>[] = [];

  constructor(m: Model, occ: Int16Array) {
    this.m = m;
    this.occ = occ;
  }

  play(turns: Turn[], stage: Stage, say: Say, piece: number[], notation?: string, hold: Held = null) {
    const alg = notation ? notation.split(' ') : null;
    turns.forEach((turn, at) => {
      this.occ = apply(this.occ, permutation(this.m.shape, turn));
      this.steps.push({ turn, stage, say, piece, alg, at, hold });
    });
  }

  /** A trial run from where this plan has got to, with no steps of its own
   *  yet, to see how long one way of doing something is. */
  fork() {
    return new Plan(this.m, this.occ);
  }

  /** A trial's steps, kept. */
  adopt(trial: Plan) {
    this.steps.push(...trial.steps);
    this.occ = trial.occ;
  }
}

/**
 * The fewest turns from these that bring every tracked sticker home, by
 * iterative deepening with a bound from how far each sticker is on its own.
 *
 * Tracking a handful of stickers rather than the whole puzzle is what makes it
 * quick: a cross edge is two numbers, not fifty-four. Turns of one face are
 * never taken twice running, and of two opposite faces only in one order,
 * since either way round is the same.
 */
function fewest(
  start: number[],
  home: number[],
  moves: { map: Int16Array; face: number; opposite: number }[],
  limit: number,
): number[] | null {
  // How far each tracked sticker is from its own home, turn by turn.
  const tables = home.map((h) => {
    const dist = new Uint8Array(moves[0].map.length).fill(255);
    dist[h] = 0;
    let frontier = [h];
    for (let d = 1; frontier.length; d++) {
      const next: number[] = [];
      for (const s of frontier) {
        for (const move of moves) {
          const t = move.map[s];
          if (dist[t] === 255) {
            dist[t] = d;
            next.push(t);
          }
        }
      }
      frontier = next;
    }
    return dist;
  });

  const h = (state: number[]) => state.reduce((most, s, i) => Math.max(most, tables[i][s]), 0);
  const path: number[] = [];

  const search = (state: number[], depth: number, bound: number, last: number): boolean => {
    const estimate = h(state);
    if (estimate === 0) return true;
    if (depth + estimate > bound) return false;

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      if (move.face === last) continue;
      if (last >= 0 && move.opposite === last && move.face < last) continue;

      path.push(i);
      if (search(state.map((s) => move.map[s]), depth + 1, bound, move.face)) return true;
      path.pop();
    }

    return false;
  };

  for (let bound = h(start); bound <= limit; bound++) {
    if (search(start, 0, bound, -1)) return path;
  }

  return null;
}

/** One thing the last layer can do: a turn of the top, or a sequence. */
interface Option {
  turns: Turn[];
  say: Say;
  notation?: string;
  hold: Held;
}

/** The fewest of these sequences that reach the goal, by a breadth first
 *  search over whole states. For the last layer, where there are only a
 *  handful of sequences and they are always used whole. */
function sequences(
  plan: Plan,
  options: Option[],
  goal: (occ: Int16Array) => boolean,
  limit: number,
): number[] | null {
  const { m } = plan;
  const maps = options.map((o) => compose(o.turns.map((t) => permutation(m.shape, t)), m.shape.slots.length));
  const key = (occ: Int16Array) => Array.from(occ, (e) => m.shape.slots[e].face).join('');

  if (goal(plan.occ)) return [];

  const seen = new Set([key(plan.occ)]);
  let frontier: { occ: Int16Array; path: number[] }[] = [{ occ: plan.occ, path: [] }];

  for (let depth = 0; depth < limit; depth++) {
    const next: typeof frontier = [];
    for (const node of frontier) {
      for (let i = 0; i < maps.length; i++) {
        const occ = apply(node.occ, maps[i]);
        const k = key(occ);
        if (seen.has(k)) continue;
        seen.add(k);
        const path = [...node.path, i];
        if (goal(occ)) return path;
        next.push({ occ, path });
      }
    }
    frontier = next;
  }

  return null;
}

/* ---- The cube: shared pieces of method ---------------------------------------------- */

/** The colour of each face: a centre's on the three by three. */
function centres(m: Model, occ: Int16Array): number[] {
  const frame: number[] = [];
  m.cells.forEach((cell) => {
    if (cell.length === 1) frame[m.shape.slots[cell[0]].face] = colour(m, occ, cell[0]);
  });
  return frame;
}

const WHITE = 0;
const YELLOW = 3;

/** The four faces around the white one. */
const sidesOf = (m: Model, down: number) =>
  m.normals.map((_, f) => f).filter((f) => f !== down && f !== opposite(m, down));

/**
 * A corner slot on the white layer, and the sequence that inserts a corner
 * into it from the slot above: R U R' U' held with the slot at the front
 * right, or its mirror L' U' L U with the slot at the front left.
 *
 * `allowed` is the faces a sequence may turn. The three by three may turn any,
 * and the two by two may not turn the three faces its fixed corner is on,
 * which is why the mirror exists here at all.
 */
function insertion(
  m: Model,
  cell: number,
  up: number,
  allowed: Set<number>,
): { turns: Turn[]; notation: string; hold: Held } | null {
  const down = opposite(m, up);
  const sides = facesOf(m, cell).filter((f) => f !== down);

  // The right-hand one wherever it can be used, so a solve teaches one
  // sequence, and the mirror only where the right hand would move the corner
  // the two by two is built around.
  for (const [notation, side] of [["R U R' U'", 'R'], ["L' U' L U", 'L']] as const) {
    for (const front of sides) {
      const other = sides.find((f) => f !== front)!;
      const named = faces(m, { U: up, F: front });
      if (named[side] === other && allowed.has(other)) {
        return { turns: spell(m, notation, { U: up, F: front }), notation, hold: { U: up, F: front } };
      }
    }
  }

  return null;
}

/** The white corners, one at a time, the way they are taught: take a corner
 *  out if it is in the wrong place on the white layer, turn the top until it
 *  is over its place, and repeat the insertion until it drops in white side
 *  down. The next corner is always the one that takes fewest moves. */
function whiteCorners(plan: Plan, frame: number[], down: number, stage: Stage, allowed: Set<number>, skip = -1) {
  const { m } = plan;
  const up = opposite(m, down);

  const corners = m.cells
    .map((cell, c) => ({ cell, c }))
    .filter(({ cell, c }) => cell.length === 3 && facesOf(m, c).includes(down) && c !== skip)
    .map(({ c }) => facesOf(m, c).map((f) => frame[f]));

  const layerCells = m.cells.map((_, c) => c).filter((c) => m.cells[c].length === 3 && facesOf(m, c).includes(down));

  for (;;) {
    const open = corners.filter((colours) => !placed(m, plan.occ, frame, homeOf(m, frame, colours)));
    if (!open.length) return;

    let best: Plan | null = null;

    for (const colours of open) {
      const trial = plan.fork();
      const home = homeOf(m, frame, colours);
      const into = insertion(m, home, up, allowed);
      if (!into) continue;

      let at = findPiece(m, trial.occ, colours);

      if (layerCells.includes(at)) {
        const out = insertion(m, at, up, allowed);
        if (!out) continue;
        trial.play(out.turns, stage, 'out', colours, out.notation, out.hold);
        at = findPiece(m, trial.occ, colours);
      }

      // The slot above home is the top-layer cell on the same two sides.
      const sides = facesOf(m, home).filter((f) => f !== down);
      const above = m.cells.findIndex((_, c) => m.cells[c].length === 3 && sameSet(facesOf(m, c), [up, ...sides]));

      for (const steps of [0, 1, -1, 2]) {
        const turned = steps ? apply(trial.occ, permutation(m.shape, faceTurn(m, up, steps))) : trial.occ;
        if (findPiece(m, turned, colours) === above) {
          if (steps) trial.play([faceTurn(m, up, steps)], stage, 'align', colours, undefined, into.hold);
          break;
        }
      }

      for (let n = 0; n < 6 && !placed(m, trial.occ, frame, home); n++) {
        trial.play(into.turns, stage, 'insert', colours, into.notation, into.hold);
      }

      if (!best || trial.steps.length < best.steps.length) best = trial;
    }

    if (!best) return;
    plan.adopt(best);
  }
}

/* ---- The three by three ------------------------------------------------------------ */

function three(plan: Plan) {
  const { m } = plan;
  const frame = centres(m, plan.occ);
  const down = frame.indexOf(WHITE);
  const up = opposite(m, down);
  const sides = sidesOf(m, down);
  const every = new Set(m.normals.map((_, f) => f));

  const moves = m.normals.flatMap((_, f) =>
    [1, 2, -1].map((steps) => ({ turn: faceTurn(m, f, steps), map: permutation(m.shape, faceTurn(m, f, steps)), face: f, opposite: opposite(m, f) })),
  );

  /* 1. The white cross, one edge at a time, each by the fewest moves that
        keep the edges already down where they are. */
  const crossEdges = sides.map((f) => [WHITE, frame[f]]);
  const done: number[][] = crossEdges.filter((colours) => placed(m, plan.occ, frame, homeOf(m, frame, colours)));

  while (done.length < 4) {
    let best: { colours: number[]; path: number[] } | null = null;

    for (const colours of crossEdges) {
      if (done.includes(colours)) continue;
      const tracked = [...done, colours];
      const path = fewest(
        tracked.map((c) => slotNow(m, plan.occ, c, WHITE)),
        tracked.map((c) => slotHome(m, frame, c, WHITE)),
        moves,
        10,
      );
      if (path && (!best || path.length < best.path.length)) best = { colours, path };
    }

    if (!best) break;
    for (const i of best.path) plan.play([moves[i].turn], 'cross', 'place', best.colours, undefined, { U: down, F: null });
    done.push(best.colours);
  }

  /* 2. The white corners. */
  whiteCorners(plan, frame, down, 'corners', every);

  /* 3. The middle layer. */
  // Pairs of neighbouring sides: a pair of opposite ones has no edge between.
  const middle = sides
    .flatMap((a, i) => sides.slice(i + 1).map((b) => [frame[a], frame[b]]))
    .filter((colours) => homeOf(m, frame, colours) !== -1);

  const middleCell = (c: number) => m.cells[c].length === 2 && !facesOf(m, c).some((f) => f === up || f === down);

  for (;;) {
    const open = middle.filter((colours) => !placed(m, plan.occ, frame, homeOf(m, frame, colours)));
    if (!open.length) break;

    let best: Plan | null = null;

    for (const colours of open) {
      const trial = plan.fork();
      const right = "U R U' R' U' F' U F";
      const left = "U' L' U L U F U' F'";

      let at = findPiece(m, trial.occ, colours);

      // In the middle layer but wrong: the right-hand insertion at its own
      // slot lifts it out to the top.
      if (middleCell(at)) {
        const [a, b] = facesOf(m, at);
        const front = faces(m, { U: up, F: a }).R === b ? a : b;
        trial.play(spell(m, right, { U: up, F: front }), 'middle', 'out', colours, right, { U: up, F: front });
        at = findPiece(m, trial.occ, colours);
      }

      // Turn the top until the edge's side colour stands over its centre.
      for (const steps of [0, 1, -1, 2]) {
        const turned = steps ? apply(trial.occ, permutation(m.shape, faceTurn(m, up, steps))) : trial.occ;
        const cell = findPiece(m, turned, colours);
        const side = m.cells[cell].find((s) => m.shape.slots[s].face !== up)!;
        if (colour(m, turned, side) === frame[m.shape.slots[side].face]) {
          if (steps) trial.play([faceTurn(m, up, steps)], 'middle', 'align', colours, undefined, { U: up, F: null });
          break;
        }
      }

      at = findPiece(m, trial.occ, colours);
      const side = m.cells[at].find((s) => m.shape.slots[s].face !== up)!;
      const top = m.cells[at].find((s) => m.shape.slots[s].face === up)!;
      const front = m.shape.slots[side].face;
      const named = faces(m, { U: up, F: front });

      if (frame[named.R] === colour(m, trial.occ, top)) {
        trial.play(spell(m, right, { U: up, F: front }), 'middle', 'right', colours, right, { U: up, F: front });
      } else {
        trial.play(spell(m, left, { U: up, F: front }), 'middle', 'left', colours, left, { U: up, F: front });
      }

      if (!best || trial.steps.length < best.steps.length) best = trial;
    }

    if (!best) break;
    plan.adopt(best);
  }

  /* The last layer is sequences used whole, found by trying them. */
  const firstTwo = () =>
    m.cells.map((_, c) => c).filter((c) => !facesOf(m, c).includes(up));

  const lower = firstTwo();
  const topEdges = m.cells.map((_, c) => c).filter((c) => m.cells[c].length === 2 && facesOf(m, c).includes(up));
  const topCorners = m.cells.map((_, c) => c).filter((c) => m.cells[c].length === 3 && facesOf(m, c).includes(up));
  const onTop = (occ: Int16Array, c: number) =>
    colour(m, occ, m.cells[c].find((s) => m.shape.slots[s].face === up)!) === YELLOW;

  const settled = (occ: Int16Array) => lower.every((c) => placed(m, occ, frame, c));

  const lastLayer = (stage: Stage, notation: string, goal: (occ: Int16Array) => boolean, withTop: boolean) => {
    const options: Option[] = [
      ...(withTop
        ? [1, -1, 2].map((steps): Option => ({ turns: [faceTurn(m, up, steps)], say: 'align', hold: { U: up, F: null } }))
        : []),
      ...sides.map((front): Option => ({
        turns: spell(m, notation, { U: up, F: front }),
        say: 'alg',
        notation,
        hold: { U: up, F: front },
      })),
    ];
    const path = sequences(plan, options, goal, 5);
    for (const i of path ?? []) plan.play(options[i].turns, stage, options[i].say, [], options[i].notation, options[i].hold);
  };

  /* 4. The yellow cross: every top edge yellow side up. */
  lastLayer('yellowCross', "F R U R' U' F'", (occ) => settled(occ) && topEdges.every((c) => onTop(occ, c)), true);

  /* 5. The top edges over their centres. */
  lastLayer('yellowEdges', "R U R' U R U2 R'", (occ) => settled(occ) && topEdges.every((c) => placed(m, occ, frame, c)), true);

  /* 6. The top corners in their places, twisted or not. */
  lastLayer(
    'yellowCorners',
    "U R U' L' U R' U' L",
    (occ) =>
      settled(occ) &&
      topEdges.every((c) => placed(m, occ, frame, c)) &&
      topCorners.every((c) => homeOf(m, frame, m.cells[c].map((s) => colour(m, occ, s))) === c),
    false,
  );

  /* 7. Twisting the corners: R' D' R D at the front right until its yellow is
        up, then the top turned to bring the next one there. The lower layers
        come apart during this and come back together at the end. */
  const front = sides[0];
  const named = faces(m, { U: up, F: front });
  const corner = m.cells.findIndex((_, c) => m.cells[c].length === 3 && sameSet(facesOf(m, c), [up, front, named.R]));
  const twist = "R' D' R D";

  for (let k = 0; k < 4; k++) {
    if (topCorners.every((c) => onTop(plan.occ, c))) break;
    for (let n = 0; n < 6 && !onTop(plan.occ, corner); n++) {
      plan.play(spell(m, twist, { U: up, F: front }), 'yellowTwist', 'twist', [], twist, { U: up, F: front });
    }
    if (!topCorners.every((c) => onTop(plan.occ, c))) {
      plan.play([faceTurn(m, up, 1)], 'yellowTwist', 'next', [], undefined, { U: up, F: front });
    }
  }

  for (const steps of [1, -1, 2]) {
    const turned = apply(plan.occ, permutation(m.shape, faceTurn(m, up, steps)));
    if (m.cells.every((_, c) => placed(m, turned, frame, c))) {
      plan.play([faceTurn(m, up, steps)], 'yellowTwist', 'finish', [], undefined, { U: up, F: front });
      break;
    }
  }
}

/* ---- The two by two ------------------------------------------------------------------ */

/**
 * With no centres, one white corner is the reference: it never moves, its
 * colours say which colour every face is, and only the three faces it is not
 * on are turned. Every white corner is tried as that reference and the one
 * that makes the shortest solve is used, which is what a person does when they
 * pick the corner to start from.
 */
function two(plan: Plan): Plan {
  const { m } = plan;
  let best: Plan | null = null;

  for (const colours of [0, 1, 2, 3, 4, 5].flatMap((a) => [0, 1, 2, 3, 4, 5].map((b) => [WHITE, a, b]))) {
    // Only real corners, and each once.
    if (colours[1] >= colours[2] || colours.slice(1).some((c) => c === WHITE || c === YELLOW)) continue;
    if ((colours[1] + 3) % 6 === colours[2]) continue;

    const anchor = findPiece(m, plan.occ, colours);
    if (anchor === -1) continue;

    const trial = plan.fork();
    const white = m.cells[anchor].find((s) => colour(m, plan.occ, s) === WHITE)!;
    const down = m.shape.slots[white].face;
    const up = opposite(m, down);
    const [p, q] = facesOf(m, anchor).filter((f) => f !== down);
    const back = faceOf(m, cross(m.normals[down], m.normals[p])) === q ? p : q;
    const leftFace = back === p ? q : p;
    const front = opposite(m, back);
    const rightFace = opposite(m, leftFace);

    const frame: number[] = [];
    frame[down] = WHITE;
    frame[up] = YELLOW;
    frame[back] = colour(m, plan.occ, m.cells[anchor].find((s) => m.shape.slots[s].face === back)!);
    frame[leftFace] = colour(m, plan.occ, m.cells[anchor].find((s) => m.shape.slots[s].face === leftFace)!);
    frame[front] = (frame[back] + 3) % 6;
    frame[rightFace] = (frame[leftFace] + 3) % 6;

    const allowed = new Set([up, front, rightFace]);

    whiteCorners(trial, frame, down, 'layer', allowed, anchor);

    const lower = m.cells.map((_, c) => c).filter((c) => facesOf(m, c).includes(down));
    const topCells = m.cells.map((_, c) => c).filter((c) => facesOf(m, c).includes(up));
    const settled = (occ: Int16Array) => lower.every((c) => placed(m, occ, frame, c));
    const onTop = (occ: Int16Array, c: number) =>
      colour(m, occ, m.cells[c].find((s) => m.shape.slots[s].face === up)!) === YELLOW;

    const hold = { U: up, F: front };
    const tops: Option[] = [1, -1, 2].map((steps) => ({ turns: [faceTurn(m, up, steps)], say: 'align', hold }));

    const sune = "R U R' U R U2 R'";
    const orient: Option[] = [...tops, { turns: spell(m, sune, hold), say: 'alg', notation: sune, hold }];
    const oriented = sequences(trial, orient, (occ) => settled(occ) && topCells.every((c) => onTop(occ, c)), 8);
    for (const i of oriented ?? []) trial.play(orient[i].turns, 'orient', orient[i].say, [], orient[i].notation, hold);

    const tperm = "R U R' U' R' F R2 U' R' U' R U R' F'";
    const yperm = "F R U' R' U' R U R' F' R U R' U' R' F R F'";
    const permute: Option[] = [
      ...tops,
      { turns: spell(m, tperm, hold), say: 'alg', notation: tperm, hold },
      { turns: spell(m, yperm, hold), say: 'alg', notation: yperm, hold },
    ];
    const solvedAll = (occ: Int16Array) => m.cells.every((_, c) => placed(m, occ, frame, c));
    const permuted = sequences(trial, permute, solvedAll, 4) ?? [];
    permuted.forEach((i, j) => {
      const option = permute[i];
      const last = j === permuted.length - 1 && option.say === 'align';
      trial.play(option.turns, 'permute', last ? 'finish' : option.say, [], option.notation, hold);
    });

    if (!best || trial.steps.length < best.steps.length) best = trial;
  }

  return best ?? plan;
}

/* ---- The pyramid --------------------------------------------------------------------------- */

function pyramid(plan: Plan) {
  const { m } = plan;
  const { shape } = m;
  const [low, high] = shape.cuts;
  const top = shape.extent[1] + 1;

  const tipTurn = (v: number, steps: number): Turn => ({ axis: v, lo: high, hi: top, turns: steps });
  const layerTurn = (v: number, steps: number): Turn => ({ axis: v, lo: low, hi: top, turns: steps });

  const depthOf = (cell: number, v: number) => dot(shape.slots[m.cells[cell][0]].piece as Vec, shape.axes[v] as Vec);
  const tipOf = (v: number) => m.cells.findIndex((cell, c) => cell.length === 3 && depthOf(c, v) > high);
  const axialOf = (v: number) =>
    m.cells.findIndex((cell, c) => cell.length === 3 && depthOf(c, v) > low && depthOf(c, v) < high);

  const vertices = shape.axes.map((_, v) => v);
  const axials = vertices.map(axialOf);
  const tips = vertices.map(tipOf);

  /** The sticker of an axial piece on a face. */
  const axialOn = (v: number, f: number) => m.cells[axials[v]].find((s) => shape.slots[s].face === f);

  /* 1. Tips: each twisted to match the centre piece under it. */
  vertices.forEach((v) => {
    const matches = (occ: Int16Array) =>
      m.cells[tips[v]].every((s) => colour(m, occ, s) === colour(m, occ, axialOn(v, shape.slots[s].face)!));
    if (matches(plan.occ)) return;

    for (const steps of [1, -1]) {
      if (matches(apply(plan.occ, permutation(shape, tipTurn(v, steps))))) {
        const piece = m.cells[tips[v]].map((s) => colour(m, plan.occ, s));
        plan.play([tipTurn(v, steps)], 'tips', 'place', piece);
        return;
      }
    }
  });

  /* 2. Centres: the one twist of each corner that makes every face's three
        centre stickers agree. Each corner turns with its tip, so the tips
        stay matched. */
  const faceIds = [...new Set(shape.slots.map((s) => s.face))];
  const agree = (occ: Int16Array) =>
    faceIds.every((f) => {
      const seen = vertices.map((v) => axialOn(v, f)).filter((s) => s !== undefined).map((s) => colour(m, occ, s!));
      return seen.every((c) => c === seen[0]);
    });

  search: for (let combo = 0; combo < 81; combo++) {
    const twists = vertices.map((v) => Math.floor(combo / 3 ** v) % 3);
    let occ = plan.occ;
    for (const v of vertices) if (twists[v]) occ = apply(occ, permutation(shape, layerTurn(v, twists[v] === 1 ? 1 : -1)));
    if (!agree(occ)) continue;

    for (const v of vertices) {
      if (!twists[v]) continue;
      const piece = m.cells[axials[v]].map((s) => colour(m, plan.occ, s));
      plan.play([layerTurn(v, twists[v] === 1 ? 1 : -1)], 'centres', 'place', piece);
    }
    break search;
  }

  /* 3. Edges, one at a time, each by the fewest turns that keep the centres
        matched and the edges already placed where they are. */
  const frame: number[] = [];
  for (const f of faceIds) {
    const s = vertices.map((v) => axialOn(v, f)).find((x) => x !== undefined)!;
    frame[f] = colour(m, plan.occ, s);
  }

  const moves = vertices.flatMap((v) =>
    [1, -1].map((steps) => ({ turn: layerTurn(v, steps), map: permutation(shape, layerTurn(v, steps)), face: v, opposite: -2 })),
  );

  const edges = m.cells.map((_, c) => c).filter((c) => m.cells[c].length === 2).map((c) => facesOf(m, c).map((f) => frame[f]));
  const centreRefs = vertices.map((v) => m.cells[axials[v]][0]);
  const done = edges.filter((colours) => placed(m, plan.occ, frame, homeOf(m, frame, colours)));

  while (done.length < edges.length) {
    let best: { colours: number[]; path: number[] } | null = null;

    for (const colours of edges) {
      if (done.includes(colours)) continue;
      const tracked = [...done, colours];
      // The centres are tracked by the stickers on them now, which after the
      // step before are exactly the ones that belong there.
      const start = [...centreRefs, ...tracked.map((c) => slotNow(m, plan.occ, c, c[0]))];
      const home = [...centreRefs, ...tracked.map((c) => slotHome(m, frame, c, c[0]))];
      const path = fewest(start, home, moves, 12);
      if (path && (!best || path.length < best.path.length)) best = { colours, path };
    }

    if (!best) break;
    for (const i of best.path) plan.play([moves[i].turn], 'edges', 'place', best.colours);
    done.push(best.colours);
  }
}

/* ---- The entry point ----------------------------------------------------------------------- */

/**
 * The whole plan from here to solved, or null for a puzzle there is no method
 * for here. The four and five by five are for people who already know one.
 */
export function plan(shape: Shape, occ: Int16Array): Step[] | null {
  const m = model(shape);
  const { kind, size } = shape.puzzle;
  const method = kind === 'pyramid' ? 'pyramid' : size === 3 ? 'three' : size === 2 ? 'two' : null;
  if (!method) return null;

  let built = new Plan(m, occ);
  if (method === 'three') three(built);
  else if (method === 'two') built = two(built);
  else pyramid(built);

  const stages: readonly Stage[] = METHODS[method];
  return built.steps.map((step, i, all) => ({
    ...step,
    number: stages.indexOf(step.stage) + 1,
    of: stages.length,
    left: all.slice(i + 1).filter((s) => s.stage === step.stage).length,
  }));
}
