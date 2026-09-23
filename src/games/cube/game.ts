/**
 * Cube.
 *
 * Five twisty puzzles on one engine: the cube at two, three, four and five
 * layers, and the pyramid. The sixth game here, and the first whose board is a
 * solid object rather than a surface.
 *
 * ⚠️ **The part worth reading is `build` and `permutation`, because there is
 * no notation in them.** A puzzle is a list of sticker slots - a centre, an
 * outward normal and a frame - and a turn is an axis, a slab of depth along it
 * and an angle. The stickers a turn takes are the ones whose piece lies inside
 * the slab, and where each one lands is found by rotating its centre and
 * looking up the slot that is there. So the cube and the pyramid, which share
 * nothing mechanically, run on the same code, and no turn can be written down
 * wrong because none of them is written down at all.
 *
 * The other decision is in `commit`: **a sticker's element is placed by the
 * slot it is in, never by the rotations it has been through.** While a layer
 * turns, the element carries the turn's rotation in front of its slot's
 * placement. When the turn lands, the rotation is dropped and the element takes
 * the placement of the slot it arrived in. That placement can differ from the
 * rotated one by a quarter turn in the sticker's own plane, which is invisible
 * because every sticker is symmetric about its centre - so a thousand turns
 * leave no floating point drift anywhere, and the page never has to multiply a
 * matrix it could look up.
 *
 * There is no canvas. The puzzle is a `preserve-3d` scene of one element per
 * sticker, the browser does the projection and the depth sorting, and the
 * module writes a transform onto the elements that move and a brightness onto
 * the ones whose angle to the light changed.
 */

/* ---- The puzzles ---------------------------------------------------------- */

export type PuzzleId = 'two' | 'three' | 'four' | 'five' | 'pyramid';

export interface Puzzle {
  id: PuzzleId;
  kind: 'cube' | 'pyramid';
  /** Layers along an edge. The pyramid has three, and nothing reads it. */
  size: number;
  /**
   * Random turns in a scramble.
   *
   * Enough that no face is left with a patch of its own colour big enough to
   * start from, and chosen by watching rather than by a random-state solver,
   * which is several times this whole game. The pyramid's is the length WCA
   * scrambles run to, plus a random twist of each tip.
   */
  scramble: number;
}

/** In the order the strip shows them. The id joins the stored record and, for
 *  the pyramid, its name in the dictionaries. */
export const PUZZLES: readonly Puzzle[] = [
  { id: 'two', kind: 'cube', size: 2, scramble: 14 },
  { id: 'three', kind: 'cube', size: 3, scramble: 25 },
  { id: 'four', kind: 'cube', size: 4, scramble: 44 },
  { id: 'five', kind: 'cube', size: 5, scramble: 60 },
  { id: 'pyramid', kind: 'pyramid', size: 3, scramble: 11 },
];

/* ---- Three dimensions, by hand -------------------------------------------
 *
 * The scene uses CSS's own axes, so a vector here means what it means in a
 * transform: x to the right, y down the screen and z towards the reader. A
 * positive rotation about an axis is clockwise seen from the axis's tip, which
 * is exactly how a turn is named on a real puzzle - "U" is the top face turned
 * clockwise as you look down at it - so the sign never has to be translated.
 */

type Vec = [number, number, number];
/** Row major: `m[3 * row + column]`. */
type Mat = number[];
/** `[w, x, y, z]`, unit length. */
type Quat = [number, number, number, number];

const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const scale = (a: Vec, k: number): Vec => [a[0] * k, a[1] * k, a[2] * k];
const cross = (a: Vec, b: Vec): Vec => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const length = (a: Vec) => Math.hypot(a[0], a[1], a[2]);
const unit = (a: Vec): Vec => scale(a, 1 / length(a));

function apply(m: Mat, v: Vec): Vec {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ];
}

/** Rodrigues' formula: `angle` radians about the unit vector `axis`. */
function rotation(axis: Vec, angle: number): Mat {
  const [x, y, z] = axis;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const t = 1 - c;

  return [
    t * x * x + c, t * x * y - s * z, t * x * z + s * y,
    t * x * y + s * z, t * y * y + c, t * y * z - s * x,
    t * x * z - s * y, t * y * z + s * x, t * z * z + c,
  ];
}

const trim = (n: number) => String(Math.round(n * 1e5) / 1e5);

/** CSS lists a matrix column by column, which is the one place the order
 *  flips. */
function matrix3d(m: Mat): string {
  return `matrix3d(${[m[0], m[3], m[6], 0, m[1], m[4], m[7], 0, m[2], m[5], m[8], 0, 0, 0, 0, 1].map(trim).join(',')})`;
}

const quat = (axis: Vec, angle: number): Quat => {
  const s = Math.sin(angle / 2);
  return [Math.cos(angle / 2), axis[0] * s, axis[1] * s, axis[2] * s];
};

/** `a` after `b`: the product applies `b` first. */
function qmul(a: Quat, b: Quat): Quat {
  return [
    a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
    a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
    a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1],
    a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0],
  ];
}

function qnorm(q: Quat): Quat {
  const n = Math.hypot(q[0], q[1], q[2], q[3]);
  return [q[0] / n, q[1] / n, q[2] / n, q[3] / n];
}

function qmatrix(q: Quat): Mat {
  const [w, x, y, z] = q;
  return [
    1 - 2 * (y * y + z * z), 2 * (x * y - w * z), 2 * (x * z + w * y),
    2 * (x * y + w * z), 1 - 2 * (x * x + z * z), 2 * (y * z - w * x),
    2 * (x * z - w * y), 2 * (y * z + w * x), 1 - 2 * (x * x + y * y),
  ];
}

/** The rotation that takes `from` to `to`, as a vector along its axis as long
 *  as its angle - the shortest way round, which is what a spring pulls along. */
function between(from: Quat, to: Quat): Vec {
  let e = qmul(to, [from[0], -from[1], -from[2], -from[3]]);
  if (e[0] < 0) e = [-e[0], -e[1], -e[2], -e[3]];

  const s = Math.hypot(e[1], e[2], e[3]);
  if (s < 1e-9) return [0, 0, 0];

  const angle = 2 * Math.atan2(s, e[0]);
  return [(e[1] / s) * angle, (e[2] / s) * angle, (e[3] / s) * angle];
}

/** Turned by a rotation vector, the inverse of `between`. */
function spin(q: Quat, r: Vec): Quat {
  const angle = length(r);
  if (angle < 1e-12) return q;
  return qnorm(qmul(quat(scale(r, 1 / angle), angle), q));
}

/* ---- The shapes ----------------------------------------------------------- */

export interface Slot {
  /** The sticker's centre. A unit is one cubie, or one small triangle's side. */
  centre: Vec;
  normal: Vec;
  /**
   * The point whose depth along an axis decides whether a turn takes this
   * sticker. For the cube it is the centre of the cubie under it, which is
   * always half a unit inside a slab and never on a cut. For the pyramid the
   * centre itself lies well inside its layer already, so it barely moves in.
   */
  piece: Vec;
  /** The face it is on when solved: the colour it carries, and the group the
   *  solved check reads. */
  face: number;
  /** Its placement, as the transform that puts an element here. */
  css: string;
}

export interface Shape {
  puzzle: Puzzle;
  slots: Slot[];
  /** Turn axes, all through the centre: the cube's three, the pyramid's
   *  four corners. */
  axes: Vec[];
  /** Depths along an axis where the puzzle is cut, lowest first. Every axis
   *  is cut in the same places, by symmetry. */
  cuts: number[];
  /** The deepest and shallowest a piece can be along an axis. */
  extent: [number, number];
  /** One step of a turn: a quarter, or a third on the pyramid. */
  step: number;
  /** The diameter of the sphere that holds the puzzle in any orientation, so
   *  it can be scaled to fit the stage however it is turned. */
  span: number;
  /** The view it is first shown in, and the one the thumbnail uses. */
  view: Quat;
}

/** One turn: every piece between `lo` and `hi` along an axis, by `turns`
 *  steps. */
export interface Turn {
  axis: number;
  lo: number;
  hi: number;
  turns: number;
}

/**
 * The cube's six faces, in the order of their colours.
 *
 * `x` and `y` are the directions a sticker's own right and down point on that
 * face seen from outside, so `x × y` is the outward normal and nothing is drawn
 * mirrored. Down on the top face runs towards the reader, the way a top face
 * is always drawn.
 */
const CUBE_FACES: { n: Vec; x: Vec; y: Vec }[] = [
  { n: [0, -1, 0], x: [1, 0, 0], y: [0, 0, 1] },
  { n: [1, 0, 0], x: [0, 0, -1], y: [0, 1, 0] },
  { n: [0, 0, 1], x: [1, 0, 0], y: [0, 1, 0] },
  { n: [0, 1, 0], x: [1, 0, 0], y: [0, 0, -1] },
  { n: [-1, 0, 0], x: [0, 0, 1], y: [0, 1, 0] },
  { n: [0, 0, -1], x: [-1, 0, 0], y: [0, 1, 0] },
];

/**
 * Where a slot's element goes: out to its centre, then turned into its face.
 *
 * The distance is in `--u`, a custom property sized off the stage, so the
 * puzzle is resolution independent without a line of script - a resize is the
 * stage changing size and nothing else.
 */
function place(centre: Vec, frame: Mat): string {
  const [x, y, z] = centre.map(trim);
  return `translate3d(calc(${x} * var(--u)),calc(${y} * var(--u)),calc(${z} * var(--u))) ${matrix3d(frame)}`;
}

/** A frame from the three directions an element's own x, y and z should
 *  point in. */
const frame = (x: Vec, y: Vec, z: Vec): Mat => [x[0], y[0], z[0], x[1], y[1], z[1], x[2], y[2], z[2]];

/** The resting view: looking down on the top face and in at the front, turned
 *  a little so the right-hand face is in view as well. Two angles per shape,
 *  and the only numbers here chosen by eye. */
const VIEW = {
  cube: { pitch: -26, yaw: -34 },
  pyramid: { pitch: -24, yaw: -44 },
};

const rad = (degrees: number) => (degrees * Math.PI) / 180;

function restingView(kind: Puzzle['kind']): Quat {
  const { pitch, yaw } = VIEW[kind];
  return qmul(quat([1, 0, 0], rad(pitch)), quat([0, 1, 0], rad(yaw)));
}

function cube(puzzle: Puzzle): Shape {
  const n = puzzle.size;
  const half = n / 2;
  const slots: Slot[] = [];

  CUBE_FACES.forEach((f, face) => {
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const centre = add(scale(f.n, half), add(scale(f.x, i - (n - 1) / 2), scale(f.y, j - (n - 1) / 2)));

        slots.push({
          centre,
          normal: f.n,
          piece: sub(centre, scale(f.n, 0.5)),
          face,
          css: place(centre, frame(f.x, f.y, f.n)),
        });
      }
    }
  });

  return {
    puzzle,
    slots,
    axes: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    cuts: Array.from({ length: n - 1 }, (_, k) => k + 1 - half),
    extent: [-half, half],
    step: Math.PI / 2,
    span: n * Math.sqrt(3),
    view: restingView('cube'),
  };
}

/**
 * The pyramid: a regular tetrahedron with an edge of three units, so each of
 * its small triangles has a side of one and sits beside a cubie at the same
 * size.
 *
 * It is stood on its base with a corner up. Its four corners are its four
 * axes, and each axis is cut twice, a third and two thirds of the way down, so
 * there is a tip, a middle and a base along every one of them.
 */
const EDGE = 3;
const RADIUS = (EDGE * 3) / (2 * Math.sqrt(6));

/** The corners: top, then front left, front right and back. */
const CORNERS: Vec[] = (() => {
  const low = RADIUS / 3;
  const ring = ((2 * Math.SQRT2) / 3) * RADIUS;
  return [
    [0, -RADIUS, 0],
    [(-ring * Math.sqrt(3)) / 2, low, ring / 2],
    [(ring * Math.sqrt(3)) / 2, low, ring / 2],
    [0, low, -ring],
  ];
})();

/** Faces by their corners: front, left, right and bottom, in the order of the
 *  colours. Each is the face opposite the corner not in it. */
const PYRAMID_FACES = [
  [0, 1, 2],
  [0, 3, 1],
  [0, 2, 3],
  [1, 3, 2],
];

/**
 * A triangle as a frame and a centroid: apex at the top of the element, the
 * other two corners along its bottom edge, and its face turned outwards.
 * `size` scales the element's one unit side up to the triangle's own.
 */
function triangle(a: Vec, b: Vec, c: Vec, outward: Vec, size = 1): { centroid: Vec; frame: Mat } {
  let left = b;
  let right = c;

  let x = unit(sub(right, left));
  const y = unit(sub(scale(add(left, right), 0.5), a));
  let z = cross(x, y);

  // The two base corners are taken in whichever order leaves the face
  // pointing out. The other order draws the sticker from behind, which
  // `backface-visibility` then hides.
  if (dot(z, outward) < 0) {
    [left, right] = [right, left];
    x = scale(x, -1);
    z = scale(z, -1);
  }

  return {
    centroid: scale(add(add(a, left), right), 1 / 3),
    frame: frame(scale(x, size), scale(y, size), z),
  };
}

function pyramid(puzzle: Puzzle): Shape {
  const slots: Slot[] = [];

  PYRAMID_FACES.forEach((corners, face) => {
    const [a, b, c] = corners.map((k) => CORNERS[k]);
    const normal = unit(cross(sub(b, a), sub(c, a)));
    const outward = dot(normal, a) > 0 ? normal : scale(normal, -1);

    /* Nine small triangles: six pointing the way the face does, three the
       other way, off a lattice with three steps along each edge. */
    const at = (i: number, j: number): Vec => add(a, add(scale(sub(b, a), i / 3), scale(sub(c, a), j / 3)));
    const pieces: [Vec, Vec, Vec][] = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; i + j < 3; j++) {
        pieces.push([at(i, j), at(i + 1, j), at(i, j + 1)]);
        if (i + j < 2) pieces.push([at(i + 1, j + 1), at(i, j + 1), at(i + 1, j)]);
      }
    }

    for (const [p, q, r] of pieces) {
      const { centroid, frame } = triangle(p, q, r, outward);

      slots.push({
        centre: centroid,
        normal: outward,
        piece: sub(centroid, scale(outward, 0.02)),
        face,
        css: place(centroid, frame),
      });
    }
  });

  return {
    puzzle,
    slots,
    axes: CORNERS.map(unit),
    cuts: [RADIUS / 9, (RADIUS * 5) / 9],
    extent: [-RADIUS / 3, RADIUS],
    step: (Math.PI * 2) / 3,
    span: RADIUS * 2,
    view: restingView('pyramid'),
  };
}

export const build = (puzzle: Puzzle): Shape => (puzzle.kind === 'cube' ? cube(puzzle) : pyramid(puzzle));

/** Steps in a whole turn: four, or three. */
const cycle = (shape: Shape) => Math.round((Math.PI * 2) / shape.step);

const inside = (shape: Shape, slot: Slot, turn: Turn) => {
  const depth = dot(slot.piece, shape.axes[turn.axis]);
  return depth > turn.lo && depth < turn.hi;
};

/**
 * Where every slot goes under a turn, as a map from each slot to the one its
 * sticker lands in. Slots the turn does not take map to themselves.
 *
 * Found rather than written: each slot inside the slab is rotated, and the slot
 * whose centre and normal are then in the same place is where it went. A table
 * written out by hand for five puzzles would be a few hundred lines, each one a
 * chance to send a sticker to the wrong face. Cached per turn, since a solve
 * uses the same few dozen over and over.
 */
const permutations = new WeakMap<Shape, Map<string, Int16Array>>();

export function permutation(shape: Shape, turn: Turn): Int16Array {
  const steps = ((turn.turns % cycle(shape)) + cycle(shape)) % cycle(shape);
  const key = `${turn.axis} ${trim(turn.lo)} ${trim(turn.hi)} ${steps}`;

  let cache = permutations.get(shape);
  if (!cache) {
    cache = new Map();
    permutations.set(shape, cache);
  }

  const known = cache.get(key);
  if (known) return known;

  const { slots } = shape;
  const map = new Int16Array(slots.length).map((_, i) => i);
  const r = rotation(shape.axes[turn.axis], steps * shape.step);

  slots.forEach((slot, i) => {
    if (steps === 0 || !inside(shape, slot, turn)) return;

    const centre = apply(r, slot.centre);
    const normal = apply(r, slot.normal);
    const to = slots.findIndex((s) => length(sub(s.centre, centre)) < 1e-4 && dot(s.normal, normal) > 0.999);

    // Unreachable for a turn between two cuts, and a loud failure rather than
    // a sticker quietly left where it was.
    if (to === -1) throw new Error(`No slot for sticker ${i}`);
    map[i] = to;
  });

  cache.set(key, map);
  return map;
}

/** True when every face shows one colour. Orientation does not matter, so a
 *  cube solved with the white face at the bottom is solved. */
export function solved(shape: Shape, occupant: Int16Array): boolean {
  const colour: number[] = [];

  for (let s = 0; s < shape.slots.length; s++) {
    const face = shape.slots[s].face;
    const carried = shape.slots[occupant[s]].face;

    if (colour[face] === undefined) colour[face] = carried;
    else if (colour[face] !== carried) return false;
  }

  return true;
}

/**
 * A scramble: random turns, never two in a row about the same axis, since two
 * such turns commute and could cancel.
 *
 * Every single layer of the cube is fair game, inner slices included, so a
 * five by five scramble reaches its middle as well as its faces. The pyramid
 * turns its corners with their middles, the way it is scrambled for
 * competition, and then twists each tip at random.
 */
export function scramble(shape: Shape): Turn[] {
  const turns: Turn[] = [];
  const pick = (n: number) => Math.floor(Math.random() * n);
  const count = shape.puzzle.scramble;
  let last = -1;

  if (shape.puzzle.kind === 'cube') {
    const n = shape.puzzle.size;
    const half = n / 2;

    while (turns.length < count) {
      const axis = pick(3);
      if (axis === last) continue;
      last = axis;

      const lo = pick(n) - half;
      turns.push({ axis, lo, hi: lo + 1, turns: [1, 2, -1][pick(3)] });
    }

    return turns;
  }

  const [low, high] = shape.cuts;
  const top = shape.extent[1] + 1;

  while (turns.length < count) {
    const axis = pick(4);
    if (axis === last) continue;
    last = axis;
    turns.push({ axis, lo: low, hi: top, turns: pick(2) ? 1 : -1 });
  }

  for (let axis = 0; axis < 4; axis++) {
    const twist = pick(3);
    if (twist) turns.push({ axis, lo: high, hi: top, turns: twist === 1 ? 1 : -1 });
  }

  return turns;
}

/* ---- Light ----------------------------------------------------------------
 *
 * Every sticker is lit from one direction fixed to the reader, above and to
 * the left, so the face on top is the bright one and the face on the right the
 * dim one wherever the puzzle is turned. It is what makes a scene of flat
 * squares read as a solid, and it costs one number per sticker, written only
 * when it changes by a visible amount.
 */
const LIGHT = unit([-0.42, -0.78, 0.46]);
/* Most of the light is everywhere and only a third of it has a direction:
   enough that the three faces in view are three brightnesses, not so much
   that the one turned away goes dull. The side in shadow is at 0.84 of the
   face on top. */
const AMBIENT = 0.84;
const DIFFUSE = 0.3;

/** The brightness of a surface whose normal, as the reader sees it, is `n`. */
export function lightness(n: Vec): number {
  return Math.round((AMBIENT + DIFFUSE * Math.max(0, dot(n, LIGHT))) * 100) / 100;
}

/* ---- Stills ---------------------------------------------------------------
 *
 * The games index shows the puzzles in markup rather than a picture, built at
 * build time from the same slots the game uses, so the card cannot drift away
 * from the page. These are what that component needs.
 */

/** The resting view as a transform, and the rotation behind it for lighting. */
export function resting(shape: Shape): { view: string; lit: (normal: Vec) => number } {
  const m = qmatrix(shape.view);
  return { view: matrix3d(m), lit: (normal) => lightness(apply(m, normal)) };
}

/** A slot's placement with a turn in progress in front of it. */
export function turned(shape: Shape, slot: Slot, turn: Turn, angle: number): { css: string; normal: Vec } {
  if (!inside(shape, slot, turn)) return { css: slot.css, normal: slot.normal };
  const r = rotation(shape.axes[turn.axis], angle);
  return { css: `${matrix3d(r)} ${slot.css}`, normal: apply(r, slot.normal) };
}

/**
 * The two faces a cut opens while a turn is under way: the plane between the
 * slab that moves and the part that holds still, one plate for each side of it.
 *
 * Without them a turning layer shows the inside of the puzzle, which is
 * nothing, so the far stickers show through the gap. For the cube the plate
 * is the whole cross section, the size of a face. For the pyramid it is the
 * triangle the cut makes, which gets larger the further down it is.
 */
export function plate(shape: Shape, axis: number, depth: number): string {
  const a = shape.axes[axis];

  if (shape.puzzle.kind === 'cube') {
    const n = shape.puzzle.size;
    const x: Vec = [a[1], a[2], a[0]];
    const y = cross(a, x);
    return place(scale(a, depth), frame(scale(x, n), scale(y, n), a));
  }

  const apex = CORNERS[axis];
  const top = dot(apex, a);
  const others = CORNERS.filter((_, k) => k !== axis);
  const [p, q, r] = others.map((c) => add(apex, scale(sub(c, apex), (top - depth) / (top - dot(c, a)))));

  const { centroid, frame: f } = triangle(p, q, r, a, length(sub(q, p)));
  return place(centroid, f);
}

/**
 * The triangle every pyramid sticker is drawn in, on a 100 unit side.
 *
 * The body is the plastic and is stroked in its own colour, a unit past its
 * edge, so neighbouring triangles overlap by a hair and no seam of background
 * shows between them at any angle. The sticker is a smaller triangle at the
 * same centroid, stroked with a round join, which is how a triangle gets
 * rounded corners that stay round at any size.
 */
export const TRI_BODY = 'M0 86.603 50 0 100 86.603Z';
export const TRI_STICKER = 'M20.78 74.61 50 23.99 79.22 74.61Z';

/* ---- The game ------------------------------------------------------------- */

export type State = 'idle' | 'scrambling' | 'ready' | 'solving' | 'solved';

/** The moments that make a sound. What each one sounds like is in
 *  sounds.ts, and whether it is heard is the page's switch. */
export type Cue = 'turn' | 'settle' | 'detent' | 'rattle' | 'scramble' | 'undo' | 'solved' | 'arrive';

export interface Options {
  /** The size container, the thing pointer events land on, and the element
   *  `--u` and `--cube-span` are written to. */
  stage: HTMLElement;
  /** Holds the perspective, and is what a new puzzle arrives on. */
  camera: HTMLElement;
  /** The `preserve-3d` root: every sticker is its child. */
  view: HTMLElement;
  onState(state: State): void;
  onMoves(moves: number): void;
  /** The clock, in hundredths of a second, on every frame it runs. */
  onTime(hundredths: number): void;
  onSolved(hundredths: number, moves: number): void;
  onUndo(available: boolean): void;
  onCue(cue: Cue, level?: number): void;
}

export interface Controller {
  /** Build a puzzle, solved, and bring it in. */
  load(puzzle: Puzzle): void;
  scramble(): void;
  undo(): void;
}

/* The feel, in numbers. */

/**
 * The springs.
 *
 * A layer let go of is pulled to its step by a spring just under critical
 * damping, so it lands with a degree of overshoot and no more - a click into
 * place rather than a wobble. The view's spring is critically damped and only
 * ever used for the arrival and the arrow keys: the whole puzzle turning has
 * weight, and weight does not bounce.
 */
const LAYER = { stiffness: (Math.PI * 2 * 3.4) ** 2, damping: 2 * 0.78 * Math.PI * 2 * 3.4 };
const REST = { stiffness: (Math.PI * 2 * 1.5) ** 2, damping: 2 * Math.PI * 2 * 1.5 };

/**
 * How long a flick of the whole puzzle keeps spinning, as the time its speed
 * takes to fall to a third. Long enough to feel like a heavy thing coasting,
 * short enough that it is at rest before the reader reaches for a layer.
 */
const COAST = 0.36;

/** The fastest the puzzle may spin, in radians a second. A flick off the edge
 *  of a trackpad reports speeds nobody meant. */
const SPIN_MAX = 14;

/**
 * One drag is one turn. The layer follows the finger up to a full step, and
 * past it gives only this much more, easing out, before it stops - so pushing
 * further reads as the layer reaching its end rather than as nothing
 * happening. In radians, about eight degrees.
 */
const GIVE = 0.14;

/**
 * The least a layer's sticker moves on screen per radian of turn, as a share
 * of how far it is from the axis, when working out how far a finger has turned
 * it. Without a floor, a sticker whose path runs straight at the reader moves
 * almost nowhere on screen, and a tiny movement of the finger spins the layer.
 */
const FLOOR = 0.45;

/** A drag shorter than this, in pixels, is a press. About half a fingertip. */
const SLOP = { mouse: 5, touch: 9 };

/** How far a flick carries past where the finger let go, in seconds of its
 *  speed. Enough that a quick flick of a third of a step completes it. */
const CARRY = 0.12;

/** A turn from a key or an undo, and each turn of a scramble. The scramble
 *  takes about a second and a half whatever the puzzle, within these. */
const KEY_MS = 180;
const SCRAMBLE_MS = 1500;
const SCRAMBLE_STEP = { min: 26, max: 90 };

/** The lap of honour on a solve. */
const LAP_MS = 1400;

type Easing = (t: number) => number;

/** A little past the end and back: a key turn has the same click in it as a
 *  released one, without a spring's variable length. */
const easeOutBack: Easing = (t) => 1 + 1.8 * (t - 1) ** 3 + 0.8 * (t - 1) ** 2;
const easeInOut: Easing = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

interface Active extends Turn {
  /** Element indices, not slots: the elements are what move. */
  elements: number[];
  angle: number;
  velocity: number;
  /** The angle it is heading for, once there is one. */
  goal: number;
  mode: 'drag' | 'spring' | 'timed';
  from: number;
  started: number;
  duration: number;
  ease: Easing;
  source: 'hand' | 'key' | 'scramble' | 'undo';
  /** Which step a drag is nearest, for the detent tick. */
  detent: number;
  /** The click is heard as the layer first reaches its step, not when the
   *  spring finally stops ringing. */
  clicked: boolean;
  /** The cuts this turn opens, and a plate for each side of each. */
  plates: { node: HTMLElement; css: string; moving: boolean }[];
}

interface Press {
  id: number;
  touch: boolean;
  x: number;
  y: number;
  /** The element a turn would be about, if the press landed on a sticker. */
  tile: number | null;
  mode: 'pending' | 'turn' | 'view';
  /** The camera's centre on screen, the unit and the perspective, measured
   *  once per press rather than on every move. */
  cx: number;
  cy: number;
  unitPx: number;
  depth: number;
  /** The angle the finger has turned the layer through, before the limit of
   *  one step is applied. Kept so a finger that went past the end and comes
   *  back picks the layer up where it left it. */
  raw: number;
  lastX: number;
  lastY: number;
  lastT: number;
}

export function mount(options: Options): Controller {
  const { stage, camera, view } = options;

  /*
   * Reduced motion takes every turn and every settle to zero here, for the
   * reason 2048 does it: the blanket rule at the end of global.css shortens a
   * CSS animation, and nothing in this scene is one. A turn is still a turn,
   * it simply lands.
   */
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let shape = build(PUZZLES[1]);
  let tiles: HTMLElement[] = [];
  let plates: HTMLElement[] = [];
  let lit: number[] = [];

  /** Which element is in each slot, and which slot each element is in. */
  let occupant = new Int16Array(0);
  let slotOf = new Int16Array(0);

  let state: State = 'idle';
  let moves = 0;
  let history: Turn[] = [];

  /* The view: where it is, where a spring is taking it, and how fast it is
     turning. Coasting is a flick of the whole puzzle running down. */
  let orientation: Quat = [1, 0, 0, 0];
  let rest: Quat = orientation;
  let omega: Vec = [0, 0, 0];
  let settling = false;
  let coasting = false;
  let lap: { from: Quat; started: number } | null = null;
  let viewDirty = true;

  let active: Active | null = null;
  const queue: (Turn & { source: Active['source']; duration: number })[] = [];

  let press: Press | null = null;

  /* The clock. `hidden` is when the tab went away, so the time away can be
     taken back off when it returns. */
  let clockStart = 0;
  let hidden = 0;

  /* ---- Frames ---------------------------------------------------------- */

  let frame = 0;
  let lastFrame = 0;

  const wake = () => {
    if (frame) return;
    lastFrame = performance.now();
    frame = requestAnimationFrame(tick);
  };

  function tick(now: number) {
    frame = 0;
    const dt = Math.min(0.05, Math.max(0, (now - lastFrame) / 1000));
    lastFrame = now;

    let busy = false;

    if (lap) busy = stepLap(now) || busy;
    else if (settling) busy = stepRest(dt) || busy;
    else if (coasting) busy = stepCoast(dt) || busy;
    if (active) busy = stepTurn(dt, now) || busy;

    render();

    if (state === 'solving') {
      options.onTime(elapsed(now));
      busy = true;
    }

    if (busy || press) wake();
  }

  const elapsed = (now = performance.now()) => Math.max(0, Math.floor((now - clockStart) / 10));

  /* ---- Drawing --------------------------------------------------------- */

  function relight(e: number, normal: Vec, m: Mat) {
    const value = lightness(apply(m, normal));
    if (Math.abs(value - lit[e]) < 0.015) return;
    lit[e] = value;
    tiles[e].style.setProperty('--lit', String(value));
  }

  function render() {
    const m = qmatrix(orientation);

    if (viewDirty) {
      view.style.transform = matrix3d(m);
    }

    const moving = new Set(active?.elements);

    if (active) {
      const r = rotation(shape.axes[active.axis], active.angle);
      const prefix = matrix3d(r);

      for (const e of active.elements) {
        const slot = shape.slots[slotOf[e]];
        tiles[e].style.transform = `${prefix} ${slot.css}`;
        relight(e, apply(r, slot.normal), m);
      }

      for (const p of active.plates) {
        p.node.style.transform = p.moving ? `${prefix} ${p.css}` : p.css;
      }
    }

    if (viewDirty) {
      for (let e = 0; e < tiles.length; e++) {
        if (!moving.has(e)) relight(e, shape.slots[slotOf[e]].normal, m);
      }
      viewDirty = false;
    }
  }

  /* ---- The view -------------------------------------------------------- */

  function settle(to: Quat) {
    rest = to;
    lap = null;
    coasting = false;

    if (still) {
      orientation = to;
      omega = [0, 0, 0];
      settling = false;
      viewDirty = true;
      render();
      return;
    }

    settling = true;
    wake();
  }

  function stepRest(dt: number): boolean {
    // Substeps, so the spring is stable on a slow frame.
    const n = Math.ceil(dt / (1 / 240));
    const h = dt / n;

    for (let i = 0; i < n; i++) {
      const e = between(orientation, rest);
      omega = add(omega, scale(sub(scale(e, REST.stiffness), scale(omega, REST.damping)), h));
      orientation = spin(orientation, scale(omega, h));
    }

    viewDirty = true;

    if (length(between(orientation, rest)) < 1e-4 && length(omega) < 1e-3) {
      orientation = rest;
      omega = [0, 0, 0];
      settling = false;
      return false;
    }

    return true;
  }

  /** A flick running down. The puzzle stays wherever it comes to rest: it is
   *  the reader's to turn, and one that pulled itself back square after every
   *  drag would be fighting the hand turning it. */
  function stepCoast(dt: number): boolean {
    orientation = spin(orientation, scale(omega, dt));
    omega = scale(omega, Math.exp(-dt / COAST));
    viewDirty = true;

    // Below this it is turning a degree in a sixth of a second, which reads as
    // stopped, and a tail spent creeping there is frames drawn for nothing.
    if (length(omega) > 0.3) return true;
    omega = [0, 0, 0];
    coasting = false;
    return false;
  }

  /** A full turn about the reader's vertical, eased, back to where it began. */
  function stepLap(now: number): boolean {
    if (!lap) return false;
    const t = Math.min(1, Math.max(0, (now - lap.started) / LAP_MS));
    orientation = qmul(quat([0, 1, 0], easeInOut(t) * Math.PI * 2), lap.from);
    viewDirty = true;

    if (t < 1) return true;
    orientation = lap.from;
    lap = null;
    return false;
  }

  /** The whole puzzle turned a quarter about one of the reader's axes, from
   *  the keyboard. From where the last one is heading, so four presses in a
   *  row are a whole turn however fast they come. */
  function reorient(axis: Vec, sign: number) {
    settle(qnorm(qmul(quat(axis, (Math.PI / 2) * sign), settling ? rest : orientation)));
  }

  /* ---- Turns ----------------------------------------------------------- */

  function begin(turn: Turn, mode: Active['mode'], source: Active['source'], duration = KEY_MS) {
    const elements: number[] = [];

    for (let e = 0; e < tiles.length; e++) {
      if (inside(shape, shape.slots[slotOf[e]], turn)) elements.push(e);
    }

    /* The plates: one pair at every cut the slab's two ends make, unless the
       end is the outside of the puzzle. */
    const used: Active['plates'] = [];
    const [bottom, top] = shape.extent;

    for (const depth of [turn.lo, turn.hi]) {
      if (depth <= bottom + 1e-6 || depth >= top - 1e-6) continue;
      const css = plate(shape, turn.axis, depth);

      for (const moving of [false, true]) {
        const node = plates[used.length];
        if (!node) continue;
        node.classList.add('is-on');
        node.style.transform = css;
        used.push({ node, css, moving });
      }
    }

    active = {
      ...turn,
      elements,
      angle: 0,
      velocity: 0,
      goal: turn.turns * shape.step,
      mode,
      from: 0,
      started: performance.now(),
      duration: still ? 0 : duration,
      ease: source === 'scramble' ? easeInOut : easeOutBack,
      source,
      detent: 0,
      clicked: false,
      plates: used,
    };

    // The clock starts with the first turn, the way a competition timer does.
    if (state === 'ready' && (source === 'hand' || source === 'key')) {
      clockStart = performance.now();
      setState('solving');
    }

    wake();
  }

  function stepTurn(dt: number, now: number): boolean {
    if (!active) return false;
    const turn = active;
    const before = turn.angle - turn.goal;

    if (turn.mode === 'timed') {
      const t = turn.duration <= 0 ? 1 : Math.min(1, (now - turn.started) / turn.duration);
      turn.angle = turn.from + (turn.goal - turn.from) * turn.ease(t);
      if (t >= 1) {
        turn.angle = turn.goal;
        click(turn);
        commit();
        return next();
      }
    } else if (turn.mode === 'spring') {
      const n = Math.ceil(dt / (1 / 240));
      const h = dt / n;

      for (let i = 0; i < n; i++) {
        const accel = -LAYER.stiffness * (turn.angle - turn.goal) - LAYER.damping * turn.velocity;
        turn.velocity += accel * h;
        turn.angle += turn.velocity * h;
      }

      if (Math.abs(turn.angle - turn.goal) < 0.002 && Math.abs(turn.velocity) < 0.05) {
        turn.angle = turn.goal;
        click(turn);
        commit();
        return next();
      }
    }

    if (turn.mode !== 'drag' && Math.sign(before) !== Math.sign(turn.angle - turn.goal)) click(turn);

    return true;
  }

  function click(turn: Active) {
    if (turn.clicked) return;
    turn.clicked = true;

    const steps = Math.round(turn.goal / shape.step);

    if (turn.source === 'scramble') options.onCue('rattle');
    else if (steps % cycle(shape) === 0) options.onCue('settle');
    else options.onCue(turn.source === 'undo' ? 'undo' : 'turn', Math.abs(steps));
  }

  /** Lands the turn under way: the stickers move to their new slots, and the
   *  model finds out what happened. */
  function commit() {
    const turn = active;
    if (!turn) return;
    active = null;

    const k = cycle(shape);
    const steps = Math.round(turn.goal / shape.step);
    const net = ((steps % k) + k) % k;

    if (net !== 0) {
      const map = permutation(shape, { ...turn, turns: net });
      for (const e of turn.elements) {
        const to = map[slotOf[e]];
        slotOf[e] = to;
        occupant[to] = e;
      }
    }

    const m = qmatrix(orientation);
    for (const e of turn.elements) {
      const slot = shape.slots[slotOf[e]];
      tiles[e].style.transform = slot.css;
      relight(e, slot.normal, m);
    }

    for (const p of turn.plates) p.node.classList.remove('is-on');

    if (net === 0 || turn.source === 'scramble') return;

    if (turn.source === 'undo') {
      moves = Math.max(0, moves - 1);
    } else {
      // Kept as the shortest way round, so undoing three quarters is one
      // quarter back rather than three.
      history.push({ axis: turn.axis, lo: turn.lo, hi: turn.hi, turns: net > k / 2 ? net - k : net });
      moves++;
    }

    options.onMoves(moves);
    options.onUndo(history.length > 0 && state !== 'solved');

    if (state === 'solving' && solved(shape, occupant)) finish();
  }

  /** Starts whatever is waiting, and says whether anything is still moving. */
  function next(): boolean {
    const turn = queue.shift();

    if (turn) {
      begin(turn, 'timed', turn.source, turn.duration);
      return true;
    }

    if (state === 'scrambling') {
      setState('ready');
      options.onUndo(false);
    }

    return false;
  }

  /** Everything under way and waiting, landed at once, so a press always
   *  starts on a still puzzle. */
  function flush() {
    while (active || queue.length) {
      if (active) {
        active.angle = active.goal;
        commit();
      }
      next();
    }
    render();
  }

  function play(turn: Turn, source: Active['source']) {
    const duration = queue.length || active ? KEY_MS * 0.6 : KEY_MS;
    if (active || queue.length) queue.push({ ...turn, source, duration });
    else begin(turn, 'timed', source, duration);
  }

  function finish() {
    const time = elapsed();
    setState('solved');
    options.onTime(time);
    options.onUndo(false);
    options.onCue('solved');
    options.onSolved(time, moves);

    if (!still) {
      lap = { from: orientation, started: performance.now() + 120 };
      settling = false;
      coasting = false;
      wake();
    }
  }

  function setState(next: State) {
    state = next;
    options.onState(next);
  }

  /* ---- Building a puzzle ----------------------------------------------- */

  function load(puzzle: Puzzle) {
    press = null;
    active = null;
    queue.length = 0;
    history = [];
    moves = 0;

    shape = build(puzzle);
    const count = shape.slots.length;

    occupant = new Int16Array(count).map((_, i) => i);
    slotOf = new Int16Array(count).map((_, i) => i);
    lit = new Array(count).fill(-1);

    const kind = puzzle.kind;
    const nodes = document.createDocumentFragment();

    tiles = shape.slots.map((slot, i) => {
      const node = document.createElement('span');
      node.className = kind === 'pyramid' ? 'cube-tile is-tri' : 'cube-tile';
      node.dataset.face = String(slot.face);
      node.dataset.i = String(i);
      node.style.transform = slot.css;
      if (kind === 'pyramid') {
        node.innerHTML = '<svg viewBox="0 0 100 86.603" focusable="false"><use href="#cube-tri"/></svg>';
      }
      nodes.append(node);
      return node;
    });

    plates = Array.from({ length: 4 }, () => {
      const node = document.createElement('span');
      node.className = kind === 'pyramid' ? 'cube-plate is-tri' : 'cube-plate';
      nodes.append(node);
      return node;
    });

    view.replaceChildren(nodes);
    view.dataset.kind = kind;
    stage.style.setProperty('--cube-span', trim(shape.span));

    setState('idle');
    options.onMoves(0);
    options.onTime(0);
    options.onUndo(false);

    /* It arrives turning, from a little behind and below the view it opens
       on, and the view's spring brings it round, so the first thing the
       reader sees is a solid being turned rather than a picture of one. */
    rest = shape.view;
    orientation = still ? rest : qmul(quat([0, 1, 0], -1.9), qmul(quat([1, 0, 0], 0.5), rest));
    omega = [0, 0, 0];
    viewDirty = true;
    render();

    if (!still) {
      camera.classList.remove('is-arriving');
      void camera.offsetWidth;
      camera.classList.add('is-arriving');
      options.onCue('arrive');
    }

    settle(rest);
  }

  function scrambleNow() {
    if (state === 'scrambling') return;
    flush();
    press = null;

    history = [];
    moves = 0;
    options.onMoves(0);
    options.onTime(0);
    options.onUndo(false);

    /* A scramble that happens to leave the puzzle solved is dealt again. It
       can only happen on the pyramid's short one, and only barely. */
    let turns: Turn[];
    do {
      turns = scramble(shape);
      const probe = new Int16Array(shape.slots.length).map((_, i) => i);
      const at = new Int16Array(occupant);
      for (const turn of turns) {
        const map = permutation(shape, turn);
        probe.fill(-1);
        at.forEach((e, s) => (probe[map[s]] = e));
        at.set(probe);
      }
      if (!solved(shape, at)) break;
    } while (true);

    setState('scrambling');
    options.onCue('scramble');

    const step = Math.min(SCRAMBLE_STEP.max, Math.max(SCRAMBLE_STEP.min, SCRAMBLE_MS / turns.length));
    for (const turn of turns) queue.push({ ...turn, source: 'scramble', duration: step });

    next();
  }

  function undo() {
    if (state === 'scrambling' || state === 'solved') return;

    // A turn still landing is not in the history yet, so undoing now would
    // take back the one before it.
    if (active || queue.length) flush();

    const last = history.pop();
    if (!last) return;
    options.onUndo(history.length > 0);
    play({ ...last, turns: -last.turns }, 'undo');
  }

  /* ---- Pointer --------------------------------------------------------- */

  function measure(p: Press) {
    const box = camera.getBoundingClientRect();
    p.cx = box.left + box.width / 2;
    p.cy = box.top + box.height / 2;
    // The computed width rather than `offsetWidth`, which rounds to a whole
    // pixel - two per cent of a sticker on a five by five on a phone.
    p.unitPx = tiles[0] ? parseFloat(getComputedStyle(tiles[0]).width) : 1;
    p.depth = parseFloat(getComputedStyle(camera).perspective) || 2000;
  }

  /** Where a point of the puzzle is on screen, relative to the camera's
   *  centre: the view's rotation, then the perspective the browser applies. */
  function project(p: Press, point: Vec, m: Mat): [number, number] {
    const v = scale(apply(m, point), p.unitPx);
    const f = p.depth / (p.depth - v[2]);
    return [v[0] * f, v[1] * f];
  }

  /** How a point of the puzzle moves on screen as a turn about `axis`
   *  carries it, in pixels per radian. */
  function along(p: Press, point: Vec, axis: Vec, m: Mat): [number, number] {
    const here = project(p, point, m);
    const there = project(p, add(point, scale(cross(axis, point), 0.01)), m);
    return [(there[0] - here[0]) / 0.01, (there[1] - here[1]) / 0.01];
  }

  /**
   * A press on a sticker has moved far enough to mean something: pick the turn.
   *
   * Every axis the sticker could turn about is tried, and the one whose motion
   * on screen best matches the finger's wins. That motion is measured through
   * the real projection, so the choice is right at any angle the puzzle has
   * been turned to.
   */
  function grip(p: Press, dx: number, dy: number): boolean {
    if (p.tile === null) return false;

    const slot = shape.slots[slotOf[p.tile]];
    const m = qmatrix(orientation);
    const drag = Math.hypot(dx, dy);

    let best: { axis: number; score: number } | null = null;

    shape.axes.forEach((axis, i) => {
      if (Math.abs(dot(axis, slot.normal)) > 0.5) return;

      const [ax, ay] = along(p, slot.centre, axis, m);
      const speed = Math.hypot(ax, ay);
      if (speed < 1e-6) return;

      const score = Math.abs((ax * dx + ay * dy) / (speed * drag));
      if (!best || score > best.score) best = { axis: i, score };
    });

    if (!best) return false;
    const { axis } = best;

    // A layer still landing from the last drag lands now. By the time a finger
    // has moved far enough to start another, it is nearly there anyway.
    if (active || queue.length) flush();

    /* The slab the sticker's piece is in. On the cube that is its own layer.
       On the pyramid a press on the middle row takes the tip with it, since a
       tip left behind is a quirk of the mechanism rather than a move anyone
       means to make, and a press on the tip takes the tip alone. */
    const depth = dot(slot.piece, shape.axes[axis]);
    let lo: number;
    let hi: number;

    if (shape.puzzle.kind === 'cube') {
      lo = Math.floor(depth + shape.extent[1]) - shape.extent[1];
      hi = lo + 1;
    } else {
      const [low, high] = shape.cuts;
      hi = shape.extent[1] + 1;
      lo = depth > high ? high : depth > low ? low : shape.extent[0] - 1;
      if (lo < low) hi = low;
    }

    begin({ axis, lo, hi, turns: 0 }, 'drag', 'hand');
    return true;
  }

  /**
   * The finger has moved by `mx`, `my` with a layer in hand: turn it by as
   * much.
   *
   * ⚠️ **The rate is worked out again on every move, from where the sticker is
   * now**, not once from where it started. A sticker goes round a circle, and
   * on screen its motion slows and bends as it turns towards a side face, so a
   * rate fixed at the start left it trailing the finger by a quarter of the way
   * by the end of the turn. Measured this way it stays under the finger for
   * the whole of it.
   */
  function follow(p: Press, turn: Active, mx: number, my: number, dt: number) {
    if (p.tile === null) return;

    const axis = shape.axes[turn.axis];
    const centre = shape.slots[slotOf[p.tile]].centre;
    const [ax, ay] = along(p, apply(rotation(axis, turn.angle), centre), axis, qmatrix(orientation));

    const floor = FLOOR * p.unitPx * length(cross(axis, centre));
    const speed = Math.max(ax * ax + ay * ay, floor * floor);

    p.raw += (mx * ax + my * ay) / speed;

    // One step either way, and past it only the give, easing out.
    const step = shape.step;
    const over = Math.abs(p.raw) - step;
    const angle = over <= 0 ? p.raw : Math.sign(p.raw) * (step + GIVE * (1 - Math.exp(-over / GIVE)));

    turn.velocity = turn.velocity * 0.55 + ((angle - turn.angle) / dt) * 0.45;
    turn.angle = angle;

    const detent = Math.round(angle / step);
    if (detent !== turn.detent) {
      turn.detent = detent;
      options.onCue('detent');
    }
  }

  const onPointerDown = (event: PointerEvent) => {
    if (press || state === 'scrambling' || state === 'solved') return;
    if (event.pointerType === 'mouse' && event.button !== 0 && event.button !== 2) return;

    const target = (event.target as Element | null)?.closest<HTMLElement>('.cube-tile');
    const tile = target && event.button === 0 && !event.shiftKey ? Number(target.dataset.i) : null;

    press = {
      id: event.pointerId,
      touch: event.pointerType !== 'mouse',
      x: event.clientX,
      y: event.clientY,
      tile,
      mode: tile === null ? 'view' : 'pending',
      cx: 0,
      cy: 0,
      unitPx: 1,
      depth: 2000,
      raw: 0,
      lastX: event.clientX,
      lastY: event.clientY,
      lastT: event.timeStamp,
    };

    measure(press);
    stage.classList.add('is-held');

    // Captured, so a drag that leaves the stage keeps turning the layer. A
    // pointer the browser has already released cannot be, and the press
    // simply ends at the stage's edge instead.
    try {
      stage.setPointerCapture(event.pointerId);
    } catch {
      /* See above. */
    }

    // A hand on the puzzle stops it spinning, the way a hand on a real one
    // does. A layer still landing is left to land.
    settling = false;
    coasting = false;
    lap = null;
    omega = [0, 0, 0];
    wake();
  };

  const onPointerMove = (event: PointerEvent) => {
    const p = press;
    if (!p || event.pointerId !== p.id) return;

    const dx = event.clientX - p.x;
    const dy = event.clientY - p.y;
    const dt = Math.max(1, event.timeStamp - p.lastT) / 1000;

    if (p.mode === 'pending') {
      if (Math.hypot(dx, dy) < (p.touch ? SLOP.touch : SLOP.mouse)) return;

      // The whole of the way from the press counts, so the layer catches up
      // with the finger on the first frame rather than starting behind it.
      if (grip(p, dx, dy)) {
        p.mode = 'turn';
        p.lastX = p.x;
        p.lastY = p.y;
      } else {
        p.mode = 'view';
      }
    }

    const mx = event.clientX - p.lastX;
    const my = event.clientY - p.lastY;

    if (p.mode === 'turn' && active?.mode === 'drag') follow(p, active, mx, my, dt);

    if (p.mode === 'view') {
      const moved = Math.hypot(mx, my);

      if (moved > 0) {
        const radius = (shape.span * p.unitPx) / 2;
        const axis: Vec = [-my / moved, mx / moved, 0];
        const angle = moved / radius;

        orientation = qnorm(qmul(quat(axis, angle), orientation));
        omega = add(scale(omega, 0.5), scale(axis, (angle / dt) * 0.5));
        viewDirty = true;
      }
    }

    p.lastX = event.clientX;
    p.lastY = event.clientY;
    p.lastT = event.timeStamp;
    wake();
  };

  const onPointerUp = (event: PointerEvent) => {
    const p = press;
    if (!p || event.pointerId !== p.id) return;
    press = null;
    stage.classList.remove('is-held');

    // A finger that stopped before it lifted has no speed left to carry.
    const idle = event.timeStamp - p.lastT > 90;

    if (p.mode === 'turn' && active?.mode === 'drag') {
      const step = shape.step;
      const velocity = idle ? 0 : Math.max(-12, Math.min(12, active.velocity));
      const aim = Math.round((active.angle + velocity * CARRY) / step);

      active.mode = 'spring';
      active.velocity = velocity;
      active.goal = Math.max(-1, Math.min(1, aim)) * step;
      if (still) active.angle = active.goal;
    }

    // A flick of the whole puzzle carries on and runs down.
    if (p.mode === 'view' && !idle && !still) {
      const speed = length(omega);
      if (speed > SPIN_MAX) omega = scale(omega, SPIN_MAX / speed);
      coasting = speed > 0.3;
    }

    wake();
  };

  stage.addEventListener('pointerdown', onPointerDown);
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerup', onPointerUp);
  stage.addEventListener('pointercancel', onPointerUp);
  stage.addEventListener('contextmenu', (event) => event.preventDefault());

  /* ---- Keys -----------------------------------------------------------

     Letters turn the faces as the reader sees them now, not the faces the
     puzzle started with: after the cube has been turned over, U is whatever is
     on top. That is how the notation is meant, and it is the only way the keys
     keep meaning what the reader is looking at. */

  let onScreen = false;
  const watcher = new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting;
    },
    { rootMargin: '-15% 0px -15% 0px' },
  );
  watcher.observe(stage);

  /** A number pressed first reaches a deeper layer, for a second or so. */
  let depthKey = 0;
  let depthAt = 0;

  const SCREEN: Record<string, Vec> = {
    KeyU: [0, -1, 0],
    KeyD: [0, 1, 0],
    KeyR: [1, 0, 0],
    KeyL: [-1, 0, 0],
    KeyF: [0, 0, 1],
    KeyB: [0, 0, -1],
  };

  const ARROWS: Record<string, [Vec, number]> = {
    ArrowLeft: [[0, 1, 0], -1],
    ArrowRight: [[0, 1, 0], 1],
    ArrowUp: [[1, 0, 0], 1],
    ArrowDown: [[1, 0, 0], -1],
  };

  function keyTurn(code: string, prime: boolean): Turn | null {
    const m = qmatrix(settling ? rest : orientation);
    const deep = performance.now() - depthAt < 1600 ? depthKey : 0;
    depthKey = 0;

    if (shape.puzzle.kind === 'cube') {
      const want = SCREEN[code];
      if (!want) return null;

      // The world axis, and its sign, that points most nearly where the key
      // does on screen right now.
      let axis = 0;
      let sign = 1;
      let score = -Infinity;

      shape.axes.forEach((a, i) => {
        const d = dot(apply(m, a), want);
        if (Math.abs(d) > score) {
          score = Math.abs(d);
          axis = i;
          sign = Math.sign(d);
        }
      });

      const half = shape.extent[1];
      const layer = Math.min(deep, shape.puzzle.size - 1);
      const outer = half - layer;
      const [lo, hi] = sign > 0 ? [outer - 1, outer] : [-outer, -outer + 1];

      return { axis, lo, hi, turns: (prime ? -1 : 1) * sign };
    }

    // The pyramid's corners: the highest on screen is U, and the other three
    // are named by where they sit across it, left to right.
    const corners = shape.axes.map((a, i) => ({ i, at: apply(m, a) }));
    const top = corners.reduce((a, b) => (b.at[1] < a.at[1] ? b : a));
    const rest3 = corners.filter((c) => c !== top).sort((a, b) => a.at[0] - b.at[0]);
    const named: Record<string, number> = { KeyU: top.i, KeyL: rest3[0].i, KeyB: rest3[1].i, KeyR: rest3[2].i };

    const axis = named[code];
    if (axis === undefined) return null;

    const [low, high] = shape.cuts;
    return { axis, lo: deep === 1 ? high : low, hi: shape.extent[1] + 1, turns: prime ? -1 : 1 };
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (!onScreen || event.metaKey || event.ctrlKey || event.altKey) return;
    if (state === 'scrambling' || state === 'solved') return;

    const focused = document.activeElement;

    const arrow = ARROWS[event.code];
    if (arrow) {
      // A radio in the strip or a focused button keeps its own arrow keys.
      if (focused instanceof HTMLInputElement || focused instanceof HTMLButtonElement) return;
      event.preventDefault();
      reorient(arrow[0], arrow[1]);
      return;
    }

    const digit = /^Digit([1-5])$/.exec(event.code);
    if (digit) {
      depthKey = Number(digit[1]) - 1;
      depthAt = performance.now();
      return;
    }

    const turn = keyTurn(event.code, event.shiftKey);
    if (!turn) return;

    event.preventDefault();
    play(turn, 'key');
  };

  window.addEventListener('keydown', onKeyDown);

  /* The clock does not run while the tab is away. */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hidden = performance.now();
    else if (hidden && state === 'solving') {
      clockStart += performance.now() - hidden;
      hidden = 0;
    }
  });

  return {
    load,
    scramble: scrambleNow,
    undo,
  };
}
