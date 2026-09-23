/**
 * Battleship.
 *
 * Two fleets of five ships on two ten by ten grids, shots alternating one at a
 * time. The fourth game here and the first with an opponent in it, which is the
 * reason it exists: 2048, Minesweeper and Accretion are all a player against a
 * board, and none of them had anywhere to put an algorithm that has to decide
 * something rather than resolve something.
 *
 * ⚠️ **The part worth reading is `chooseShot` and the four functions under it.**
 * The rules of this game are half a page and have no exceptions in them, so
 * nearly all of the interest is on the other side of the board. Four opponents
 * share one board state and differ only in how they pick a square, from
 * uniformly at random to counting every placement the evidence still allows.
 *
 * ⚠️ **The opponent cannot see the fleet it is shooting at**, and that is
 * structural rather than a promise. `chooseShot` takes the record of its own
 * shots and the lengths of the ships it has not yet sunk, and there is no third
 * argument - the layout is not in scope where the decision is made. Which ship
 * sank is public in this game: the defender announces it, exactly as a player
 * does out loud, and it is what lets the counting narrow.
 *
 * There is no loop and nothing in flight, like Minesweeper and unlike the other
 * two. A cell changes state or it does not, so what this file has to get right
 * is the reasoning and the keyboard.
 */

/* ---- The board ----------------------------------------------------------- */

export const SIZE = 10;

/**
 * The fleet, largest first.
 *
 * The classic five, and they should stay the five: the difficulty of this game
 * is common knowledge, seventeen cells in a hundred is the density every
 * published figure about Battleship is measured against, and a fleet with a
 * one-cell ship in it is a different game. Largest first is load bearing in
 * `arrange` - a five placed last into a board that already holds four ships has
 * far fewer squares left to sit in, which skews where the big ships end up.
 */
export const FLEET = [5, 4, 3, 3, 2] as const;

export const SHIPS = FLEET.length;
export const CELLS = SIZE * SIZE;

/** Hull cells in a fleet, and therefore the fewest shots a game can be won in. */
export const HULL = FLEET.reduce((total, length) => total + length, 0);

/**
 * What is known about one square of a board, from the shooting side.
 *
 * ⚠️ **`DEAD` is a hit that a sunk ship accounts for, and separating it from
 * `HIT` is what makes the opponent work.** A hit nobody has explained is a
 * thread to pull and the whole of target mode is about it. A hit belonging to a
 * ship that has already gone down is finished, and an opponent that cannot tell
 * the two apart spends the rest of the game shooting around a wreck.
 */
const UNKNOWN = 0;
const MISS = 1;
const HIT = 2;
const DEAD = 3;

export type State = 'placing' | 'playing' | 'won' | 'lost';

/** Which of the two boards. `enemy` is the one you shoot at. */
export type Side = 'enemy' | 'own';

/**
 * The four opponents, weakest first, and declaration order is the order the
 * page offers them in.
 *
 * A list rather than the `Record` the minefield's levels are, because a level
 * here carries nothing: it is a name for a way of choosing a square, and the
 * behaviour behind each one is a branch in `chooseShot` rather than a table of
 * numbers. The words for them are `games.items.battleship.levels` in the
 * dictionaries, so a fifth added here with no name behind it fails the check.
 */
export const LEVELS = ['sailor', 'gunner', 'captain', 'admiral'] as const;
export type LevelId = (typeof LEVELS)[number];

/**
 * The habits one opponent is drawn with for one game.
 *
 * ⚠️ **This exists because a fixed search is a solved search.** Three of the
 * four opponents sweep the board on a rule, and a rule with no dial on it runs
 * the same way every game: the captain always walked the same diagonals, and
 * the admiral always opened in the middle because that is where the count is
 * highest. Both are worth knowing exactly once. After that you put your fleet
 * where it looks last and the opponent never recovers, which is not the game
 * being easy, it is the game being over before the first shot.
 *
 * ⚠️ **Nothing in here costs a single shot, and that is the whole point of
 * taking it from the square's own symmetry.** A ship of length n crosses every
 * residue of `x + y` and of `x - y` exactly once, so *any* family and *any*
 * phase covers the board exactly as well as the one that used to be written
 * into the file. There are eight such sweeps, they are the eight images of one
 * sweep under the symmetries of a square, and they are all equally good - so
 * drawing one at random is variety with no price attached rather than a
 * difficulty dial.
 */
export interface Plan {
  /** Which diagonal family the lattice runs along, `x + y` or `x - y`. */
  readonly rising: boolean;
  /** Where the lattice starts, taken modulo whatever spacing is in force. */
  readonly offset: number;
}

/** One game's worth of habits. Called once per game, never mid-game. */
export function planFor(): Plan {
  return {
    rising: Math.random() < 0.5,
    // The widest spacing any lattice here uses is the length of the longest
    // ship, so a phase drawn under that can be taken modulo anything narrower.
    offset: Math.floor(Math.random() * Math.max(...FLEET)),
  };
}

interface Ship {
  length: number;
  /** The bow: the leftmost cell of a horizontal ship, the topmost of a vertical one. */
  x: number;
  y: number;
  horizontal: boolean;
  hits: number;
}

interface Board {
  /** Indexed by ship number, `null` while that ship is not on the board. */
  ships: (Ship | null)[];
  /** Ship number per square, or -1. The inverse of `ships`, kept for lookup. */
  owner: Int8Array;
  /** What the side shooting *at* this board knows, one of the four above. */
  shots: Uint8Array;
  /** Hull cells hit. The game is over for this board at `HULL`. */
  hits: number;
}

const xOf = (i: number) => i % SIZE;
const yOf = (i: number) => Math.floor(i / SIZE);

/** The four directions a ship can run in. Diagonals are not among them, here
 *  or anywhere else in the file. */
const STEPS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

function emptyBoard(): Board {
  return {
    ships: Array.from({ length: SHIPS }, () => null),
    owner: new Int8Array(CELLS).fill(-1),
    shots: new Uint8Array(CELLS),
    hits: 0,
  };
}

/** The squares a ship of this length and orientation would stand on. */
function span(length: number, x: number, y: number, horizontal: boolean): number[] {
  const out: number[] = [];
  for (let k = 0; k < length; k++) out.push(horizontal ? y * SIZE + x + k : (y + k) * SIZE + x);
  return out;
}

/**
 * Whether a ship fits there.
 *
 * ⚠️ **Ships are allowed to touch**, which is the Hasbro rule and is the one
 * that makes the game harder for both sides. A fleet with a gap required around
 * every hull hands the opponent a ring of free squares every time something
 * sinks, and hands the counting in `density` a constraint worth more than
 * anything else on the board. So the only thing checked here is the edge of the
 * board and another hull in the way.
 *
 * @param ignore  A ship number to treat as absent, so a ship being moved does
 *   not collide with where it currently is.
 */
function fits(
  board: Board,
  length: number,
  x: number,
  y: number,
  horizontal: boolean,
  ignore = -1,
): boolean {
  if (x < 0 || y < 0) return false;
  if (horizontal ? x + length > SIZE : y + length > SIZE) return false;

  for (const i of span(length, x, y, horizontal)) {
    const owner = board.owner[i];
    if (owner >= 0 && owner !== ignore) return false;
  }

  return true;
}

function lift(board: Board, index: number): void {
  const ship = board.ships[index];
  if (!ship) return;

  for (const i of span(ship.length, ship.x, ship.y, ship.horizontal)) board.owner[i] = -1;
  board.ships[index] = null;
}

function place(board: Board, index: number, x: number, y: number, horizontal: boolean): void {
  lift(board, index);

  const length = FLEET[index];
  board.ships[index] = { length, x, y, horizontal, hits: 0 };
  for (const i of span(length, x, y, horizontal)) board.owner[i] = index;
}

/**
 * A whole fleet, at random.
 *
 * Every valid position for the ship is listed and one is drawn from the list,
 * rather than guessing a position and trying again until one is legal. Both
 * give a fleet, but only one of them is guaranteed to finish: rejection
 * sampling has no bound on how many draws it takes, and the code that runs
 * before every single game is the wrong place for a loop that is merely very
 * unlikely to spin. Two hundred candidates per ship is nothing to enumerate.
 *
 * The outer attempt loop is belt and braces. Five ships descending into a
 * hundred squares cannot strand the last one - fifteen squares are taken when
 * the two is placed and a free pair is certain - but "cannot" is how a function
 * ends up with no exit.
 */
function arrange(board: Board): void {
  for (let attempt = 0; attempt < 20; attempt++) {
    for (let index = 0; index < SHIPS; index++) lift(board, index);

    let complete = true;

    for (let index = 0; index < SHIPS; index++) {
      const length = FLEET[index];
      const spots: { x: number; y: number; horizontal: boolean }[] = [];

      for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
          if (fits(board, length, x, y, true)) spots.push({ x, y, horizontal: true });
          if (fits(board, length, x, y, false)) spots.push({ x, y, horizontal: false });
        }
      }

      if (spots.length === 0) {
        complete = false;
        break;
      }

      const spot = spots[Math.floor(Math.random() * spots.length)];
      place(board, index, spot.x, spot.y, spot.horizontal);
    }

    if (complete) return;
  }
}

interface Shot {
  hit: boolean;
  /** The ship number this shot finished, or `null`. */
  sunk: number | null;
  /** Every square of that ship, so the caller can repaint the wreck. */
  wreck: number[];
}

/**
 * One shot, and the only function that changes what a board has taken.
 *
 * Returns `null` for a square that has already been fired at, which is how both
 * a stray click and a bug in an opponent come out as nothing happening rather
 * than as a free turn.
 */
function fire(board: Board, i: number): Shot | null {
  if (i < 0 || i >= CELLS || board.shots[i] !== UNKNOWN) return null;

  const index = board.owner[i];

  if (index < 0) {
    board.shots[i] = MISS;
    return { hit: false, sunk: null, wreck: [] };
  }

  board.shots[i] = HIT;
  board.hits++;

  const ship = board.ships[index]!;
  ship.hits++;

  if (ship.hits < ship.length) return { hit: true, sunk: null, wreck: [] };

  // The wreck is settled in one place rather than left as three hits and a
  // rule: from here those squares are `DEAD`, and everything downstream - the
  // opponent's counting, the paint, the fleet list - reads that one value.
  const wreck = span(ship.length, ship.x, ship.y, ship.horizontal);
  for (const cell of wreck) board.shots[cell] = DEAD;

  return { hit: true, sunk: index, wreck };
}

/* ---- The opponent ---------------------------------------------------------
 *
 * Four of them, sharing one view of the board and differing only in how they
 * pick from it. Every one of them is a pure function of `shots` and the lengths
 * still afloat, so none of them can cheat even by accident, and any of them can
 * be run against a position by hand.
 *
 * Measured over twenty thousand games each against an independently written
 * defender, in shots to sink all seventeen cells. Seventeen is the floor and a
 * hundred is the ceiling. Mean, then the ninetieth percentile and the worst
 * game seen, because an opponent is felt through its bad games as much as
 * through its average one:
 *
 *   sailor    95.4   100  100   picks a square it has not tried
 *   gunner    55.1    71   86   follows up a hit, and never fires into a pocket
 *                             that could not hold a ship
 *   captain   49.6    60   68   and sweeps on a lattice the shortest ship
 *                             cannot slip through
 *   admiral   44.7    56   66   counts every placement the evidence still
 *                             allows
 *
 * The last of those is where published probability-density players land as
 * well, and the gap from there down to the low forties is the price of counting
 * positions of one ship rather than arrangements of five - see `density`.
 *
 * ⚠️ **The admiral's mean is at the floor of this family of algorithms, and
 * trying to move it was how the rest of this got written.** Weighting a
 * placement by ship length, by its square, by its reciprocal, and leaning the
 * count towards a corner all land inside the noise of a twenty-thousand game
 * measurement. What did move was the shape of its bad games - the lattice below
 * took the ninetieth percentile from 58 to 56 and the worst game from 73 to 66
 * for nothing.
 */

/** Squares nothing is known about. */
function openCells(shots: Uint8Array): number[] {
  const out: number[] = [];
  for (let i = 0; i < CELLS; i++) if (shots[i] === UNKNOWN) out.push(i);
  return out;
}

/** Hits that no sunk ship accounts for: something is there and it is still afloat. */
function liveHits(shots: Uint8Array): number[] {
  const out: number[] = [];
  for (let i = 0; i < CELLS; i++) if (shots[i] === HIT) out.push(i);
  return out;
}

const pick = (list: number[]) => list[Math.floor(Math.random() * list.length)];

/**
 * The unknown squares a ship still afloat could actually be standing on.
 *
 * ⚠️ **A square nothing fits through is a wasted turn, and there are more of
 * them than there look to be.** Late in a game the misses cut the board into
 * pockets, and a pocket three wide with only a four and a five left cannot hold
 * either of them - so every shot into it is spent proving something the board
 * already said. The admiral gets this for free out of `density`, because a
 * position that crosses a miss is never counted. The two below it used to fire
 * into the pockets anyway.
 *
 * Ships may touch here, so a square is ruled out by a miss or a wreck and by
 * nothing else. A live hit does not rule anything out - it is the opposite.
 */
function viable(shots: Uint8Array, remaining: readonly number[]): number[] {
  const room = new Uint8Array(CELLS);

  for (const length of remaining) {
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        for (const horizontal of [true, false]) {
          if (horizontal ? x + length > SIZE : y + length > SIZE) continue;

          const cells = span(length, x, y, horizontal);

          let allowed = true;
          for (const i of cells) {
            const known = shots[i];
            if (known === MISS || known === DEAD) {
              allowed = false;
              break;
            }
          }

          if (!allowed) continue;
          for (const i of cells) if (shots[i] === UNKNOWN) room[i] = 1;
        }
      }
    }
  }

  const out: number[] = [];
  for (let i = 0; i < CELLS; i++) if (room[i] === 1) out.push(i);
  return out;
}

/**
 * Whether a square is on this game's lattice at this spacing.
 *
 * A ship of length n laid anywhere covers n consecutive values of `x + y` and n
 * consecutive values of `x - y`, so it must cross every residue of either one
 * exactly once. That is what makes the spacing free: nothing can hide between
 * the lines whichever family they run along and wherever they start, so the
 * family and the phase are pure variety - see `Plan`.
 */
function onLattice(i: number, step: number, plan: Plan): boolean {
  if (step <= 1) return true;

  const diagonal = plan.rising ? xOf(i) + yOf(i) : xOf(i) - yOf(i);
  return ((diagonal % step) + step) % step === plan.offset % step;
}

/**
 * The squares worth shooting because of a hit that is not finished.
 *
 * ⚠️ **Derived from the board every turn rather than kept in a queue**, and
 * that is the single decision in this file that removes the most bugs. The
 * usual shape of this algorithm pushes neighbours onto a list when a shot
 * lands, and then that list has to be weeded every time a ship sinks, every
 * time another shot happens to resolve one of its entries, and every time two
 * ships lie alongside each other. Every one of those is a way for an opponent
 * to spend its turns firing at squares it already knows about. A set computed
 * from the board cannot be stale, because there is nothing to go stale.
 *
 * Two live hits in a line settle the axis, so only the two ends of that run are
 * worth anything and the sides are dropped. With a single hit and no direction
 * yet, all four neighbours are equal. Ships may touch here, so a run can be two
 * ships mistaken for one and both its ends can be closed off - which is why an
 * empty result falls back to the neighbours rather than being trusted.
 */
function targets(shots: Uint8Array): number[] {
  const hits = liveHits(shots);
  if (hits.length === 0) return [];

  const live = new Uint8Array(CELLS);
  for (const i of hits) live[i] = 1;

  const ends = new Set<number>();
  const around = new Set<number>();

  for (const i of hits) {
    for (const [dx, dy] of STEPS) {
      let x = xOf(i) + dx;
      let y = yOf(i) + dy;
      if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) continue;

      // A live hit straight away means the axis is settled this way, and the
      // square that matters is past the far end of the run rather than here.
      const run = live[y * SIZE + x] === 1;

      while (true) {
        if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) {
          x = -1;
          break;
        }

        if (live[y * SIZE + x] !== 1) break;

        x += dx;
        y += dy;
      }

      // The run walked off the board, so there is nothing past it.
      if (x < 0) continue;

      const next = y * SIZE + x;
      if (shots[next] !== UNKNOWN) continue;

      if (run) ends.add(next);
      else around.add(next);
    }
  }

  return ends.size > 0 ? [...ends] : [...around];
}

/**
 * How much more a placement is worth for each hit it explains.
 *
 * A placement accounting for two hits at once is not merely a bit likelier than
 * one accounting for one, so the dozens of single-hit placements around it must
 * not out-vote it by weight of numbers. This to the power of the hits covered
 * is what stops them.
 *
 * ⚠️ **The number barely matters and it is worth knowing that it does not.**
 * Swept over three thousand games each, 2 costs about half a shot and
 * everything from 3 to 1000 lands between 44.5 and 45.0, which is inside the
 * noise of the measurement. What matters is that the exponent is there at all -
 * so 12 is a round number well clear of the one value that is wrong, not a
 * figure anything was tuned to.
 */
const HIT_WEIGHT = 12;

/**
 * How sharply the admiral prefers a heavier square while it is hunting.
 *
 * The exponent on a square's share of the best count, which decides how far a
 * draw may wander from the top of it. Both ends of it are bad: at infinity the
 * opponent opens the same eight squares in every game it will ever play, and at
 * 1 it is barely counting at all.
 *
 * Swept at twenty thousand games a step against the greedy version's 44.6: 3
 * costs 1.2 shots, 5 costs 0.6, 8 costs 0.3, 10 costs 0.3, and past that it
 * only gets more predictable for a mean that is already at the floor.
 */
const SPREAD = 10;

/**
 * How far below the best count a square may be and still be drawn at all.
 *
 * ⚠️ **This is what makes the spread cost nothing, and without it the draw
 * costs about a third of a shot.** The exponent alone still reaches squares
 * worth half the best one now and then, and those are simply bad shots. A floor
 * under the draw bounds how bad the worst one can be: at 0.88 the opponent will
 * never fire at a square more than an eighth off the best it can see, so the
 * shots it takes are shots the greedy version would have been happy with.
 *
 * ⚠️ **The exchange rate is steep and it is worth knowing before moving this.**
 * Measured at twenty thousand games a step: 0.88 opens 32 squares for a mean of
 * 44.6, 0.80 opens 52 for 44.8, 0.70 opens 60 for 44.9, and no floor at all
 * opens 91 for 44.9. Four times the opening variety is free. Eleven times it is
 * not.
 */
const FLOOR = 0.88;

/**
 * Every placement the evidence still allows, counted.
 *
 * For each ship still afloat, every position it could occupy is tested against
 * what is known: a square that missed and a square belonging to a wreck both
 * rule the position out, and nothing else does, because ships may touch. Each
 * surviving position adds its weight to the unknown squares it covers, and the
 * heaviest square is the shot.
 *
 * ⚠️ **Hunting and following up a hit are the same calculation here**, which is
 * why this opponent has no modes in it. With nothing unexplained on the board
 * every position counts once, and the result is the familiar bell over the
 * middle of the board - which is not a rule anybody wrote down, it is what
 * falls out of a five having more room in the centre than in a corner. With a
 * live hit somewhere, positions that fail to cover one are dropped outright and
 * the weight collapses onto the squares around it. The bookkeeping that hunt
 * and target usually need is the difference between two lines.
 *
 * This is a count over single ships and not over whole fleets, so it does not
 * insist that some arrangement exists explaining every live hit at once. That
 * would mean enumerating assignments of five ships rather than positions of
 * one, for a shot that is already the right one in almost every position a real
 * game reaches.
 */
function density(shots: Uint8Array, remaining: readonly number[], plan: Plan): number {
  const score = new Float64Array(CELLS);
  const hunting = liveHits(shots).length === 0;

  for (const length of remaining) {
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        // Both orientations of every origin. No ship here is one square long,
        // which is the only length that would count itself twice.
        for (const horizontal of [true, false]) {
          if (horizontal ? x + length > SIZE : y + length > SIZE) continue;

          const cells = span(length, x, y, horizontal);

          let allowed = true;
          let covered = 0;

          for (const i of cells) {
            const known = shots[i];
            if (known === MISS || known === DEAD) {
              allowed = false;
              break;
            }
            if (known === HIT) covered++;
          }

          if (!allowed) continue;
          if (!hunting && covered === 0) continue;

          const weight = covered === 0 ? 1 : HIT_WEIGHT ** covered;
          for (const i of cells) if (shots[i] === UNKNOWN) score[i] += weight;
        }
      }
    }
  }

  /*
   * ⚠️ **While hunting, the count is taken on this game's lattice and leaned
   * one way.** Both only apply with nothing unexplained on the board: once
   * there is a live hit the count is the whole answer and must not be touched.
   *
   * The lattice is free and is worth about a shot and a half - a square off it
   * cannot be the only one a ship of the shortest length crosses, so a shot
   * there learns strictly less than a shot on it. The lean is not free and is
   * why `DRIFT` is small: the count alone opens in the middle of the board
   * every single game, because that is where the count is highest, and a
   * six-percent tilt is enough to decide between squares the count cannot tell
   * apart without ever overriding a square it can.
   */
  if (hunting) {
    const step = Math.min(...remaining);

    let survives = false;
    for (let i = 0; i < CELLS; i++) {
      if (score[i] > 0 && onLattice(i, step, plan)) survives = true;
    }

    // The guard is not decoration: a board can reach a state where every
    // placement that is still allowed misses the lattice entirely, and a mask
    // applied there would leave the opponent with nowhere to shoot.
    if (survives) {
      for (let i = 0; i < CELLS; i++) {
        if (score[i] > 0 && !onLattice(i, step, plan)) score[i] = 0;
      }
    }
  }

  let best = 0;
  for (let i = 0; i < CELLS; i++) if (score[i] > best) best = score[i];
  if (best <= 0) return -1;

  /*
   * ⚠️ **While hunting it draws in proportion to the count rather than taking
   * the top of it**, and this is the fix for the one thing that made the
   * strongest opponent the easiest to beat.
   *
   * Taking the maximum is the right shot and the wrong habit. The count on an
   * empty board peaks in the middle, so the admiral opened in the middle every
   * single game: measured over four thousand games it used **eight squares** in
   * its first four shots and never touched the other ninety-two, with one
   * square taking an eighth of every opening shot it ever fired. One game
   * teaches you that, and from then on you put the fleet down the edges and it
   * spends twenty shots walking out to find you.
   *
   * A draw weighted by `(score / best) ** SPREAD`, over squares no worse than
   * `FLOOR` of the best, makes the opening a different shape every game and
   * costs nothing: the floor means every square it can reach is one the greedy
   * version would have been happy to take. It is only ever done with nothing
   * unexplained on the board. Once there is a live hit the count is the whole
   * answer and the heaviest square is taken outright.
   */
  if (hunting) {
    let total = 0;
    const weight = new Float64Array(CELLS);

    for (let i = 0; i < CELLS; i++) {
      if (score[i] < best * FLOOR) continue;
      weight[i] = (score[i] / best) ** SPREAD;
      total += weight[i];
    }

    let draw = Math.random() * total;
    for (let i = 0; i < CELLS; i++) {
      if (weight[i] <= 0) continue;
      draw -= weight[i];
      if (draw <= 0) return i;
    }
  }

  /*
   * The heaviest square, with ties drawn at random rather than resolved by
   * index. It is also where a hunting draw lands if the running total falls
   * through on a rounding error.
   */
  let chosen = -1;
  let seen = 0;

  for (let i = 0; i < CELLS; i++) {
    if (score[i] < best) continue;
    if (Math.random() < 1 / ++seen) chosen = i;
  }

  return chosen;
}

/**
 * Where the opponent shoots, or -1 if there is nowhere left.
 *
 * @param shots  What it has learned from its own shots, and all it has.
 * @param remaining  The lengths it has not sunk. Public: the defender says
 *   which ship went down, the same way a player says it out loud.
 */
export function chooseShot(
  shots: Uint8Array,
  remaining: readonly number[],
  level: LevelId,
  plan: Plan,
): number {
  const open = openCells(shots);
  if (open.length === 0) return -1;

  // The sailor is the one opponent with nothing in it, and it stays that way.
  // Somebody has to be the floor, and an opponent that fires at random is a
  // thing a player recognises rather than a difficulty setting.
  if (level === 'sailor') return pick(open);

  if (level === 'admiral') {
    const shot = density(shots, remaining, plan);
    // Only reachable from a position no placement fits, which a consistent
    // board cannot produce. A fallback costs one line and turns a mistake
    // somewhere else into a poor shot instead of a turn that never happens.
    return shot >= 0 ? shot : pick(open);
  }

  const follow = targets(shots);
  if (follow.length > 0) return pick(follow);

  // Neither of the two below counts anything, but neither of them has any
  // business firing into a pocket that cannot hold a ship - see `viable`.
  const room = viable(shots, remaining);
  const hunt = room.length > 0 ? room : open;

  if (level === 'gunner') return pick(hunt);

  /*
   * The captain hunts on a lattice instead of on the whole board, so nothing
   * can hide between the lines and roughly half the board never has to be tried
   * at all. The spacing follows the shortest ship still afloat, which widens as
   * the game goes on and the twos are the last thing left, and the family and
   * the phase come from this game's `Plan` rather than from the file.
   */
  const step = Math.min(...remaining);
  const lines = hunt.filter((i) => onLattice(i, step, plan));

  return pick(lines.length > 0 ? lines : hunt);
}

/* ---- The page ------------------------------------------------------------ */

/** The moments the table makes a sound. What each sounds like is in
 *  sounds.ts, and whether it is heard is the page's switch. */
export type Cue = 'fire' | 'splash' | 'hit' | 'sunk' | 'lift' | 'place' | 'rotate' | 'shuffle' | 'win' | 'lose';

export interface Options {
  /** Carries `data-state`, which is what the stylesheet keys the panels off. */
  root: HTMLElement;
  /** The grid you shoot at. */
  enemy: HTMLElement;
  /** Your own fleet. */
  own: HTMLElement;
  /** The box holding both boards. A round crosses from one to the other, so it
   *  cannot live inside either of them. */
  frame: HTMLElement;
  /** The five ship entries beside each board, `[data-ship]` inside. */
  enemyFleet: HTMLElement;
  ownFleet: HTMLElement;
  onState(state: State, shots: number): void;
  onShots(shots: number): void;
  /** Ships still in your hand while placing, and zero is what lets a game start. */
  onReady(left: number): void;
  /** The line under one board, saying what the last shot at it did. */
  onLog(side: Side, text: string): void;
  /** One sentence for the live region, covering both halves of a turn. */
  onLive(text: string): void;
  /** `level` is 1 for your own shot and 0 for theirs, which is heard from
   *  further away. */
  onCue(cue: Cue, level?: number): void;
}

export interface Controller {
  restart(): void;
  setLevel(id: LevelId): void;
  /** Deal your own fleet again. Only meaningful while placing. */
  shuffle(): void;
  /** Turn the ship waiting to be placed. */
  rotate(): void;
  /** Leave placing and start shooting. Refused until all five are down. */
  start(): void;
  destroy(): void;
}

/**
 * How long a missile is in the air, and how long the opponent takes to aim.
 *
 * ⚠️ **The flight is the stylesheet's number as much as this file's.** It is
 * what `bs-fly` runs for and what the paint waits on, so the two have to agree
 * or a mark lands before its round does. It is written here because the game is
 * what waits, and `--bs-flight` is set on the frame from this constant when the
 * game is mounted.
 *
 * The opponent does not need the aiming time - the heaviest of the four decides
 * in well under a millisecond - and that is the problem. A reply on the same
 * frame reads as part of your own click rather than as somebody else's turn.
 *
 * ⚠️ **Together they are what a player waits through, so they are as short as
 * they can be and still be read.** An exchange is two flights and a pause,
 * about seven hundred milliseconds, and a press that arrives inside one is held
 * rather than dropped - see `queued` - so playing quickly never costs a turn
 * and never feels like queueing at a window.
 */
const FLIGHT_MS = 260;
const REPLY_MS = 190;

export function mount(options: Options, initial: LevelId): Controller {
  const { root, enemy: enemyEl, own: ownEl } = options;

  /*
   * The words read off the markup, in the page's language, rather than written
   * here. Position is not among them: the grid roles below give a reader the
   * row and the column for free and in their own language.
   */
  const labels = {
    water: root.dataset.labelWater ?? 'Water',
    ship: root.dataset.labelShip ?? 'Ship',
    miss: root.dataset.labelMiss ?? 'Miss',
    hit: root.dataset.labelHit ?? 'Hit',
    sunk: root.dataset.labelSunk ?? 'Sunk',
  };

  const messages = {
    hit: root.dataset.msgHit ?? 'Hit.',
    miss: root.dataset.msgMiss ?? 'Miss.',
    sunk: root.dataset.msgSunk ?? 'Sunk: {ship}.',
    waiting: root.dataset.msgWaiting ?? 'Their turn.',
    ready: root.dataset.msgReady ?? 'Your shot.',
  };

  const shipNodes = {
    enemy: [...options.enemyFleet.querySelectorAll<HTMLElement>('[data-ship]')],
    own: [...options.ownFleet.querySelectorAll<HTMLElement>('[data-ship]')],
  };

  // The flight time, so the keyframe and the timer that waits for it are one
  // number in one file.
  options.frame.style.setProperty('--bs-flight', `${FLIGHT_MS}ms`);

  /** The ship's name, for the sentence about sinking it. */
  const shipName = (side: Side, index: number) =>
    shipNodes[side][index]?.dataset.name ?? String(FLEET[index]);

  /* ---- Model ------------------------------------------------------------- */

  let level: LevelId = initial;
  /* Redrawn by `restart`, so two games in a row are never swept the same way -
     see `Plan`. It is not redrawn when the opponent is changed mid-placement:
     the plan belongs to the game rather than to whoever is playing it. */
  let plan: Plan = planFor();
  let state: State = 'placing';

  let enemy = emptyBoard();
  let own = emptyBoard();

  /** Your shots, which is what the record is kept in. Theirs are not counted:
   *  a game is only ever won on your own turn. */
  let shots = 0;

  /**
   * Your turn is not yours yet: your round is in the air, or they have not
   * fired back.
   *
   * ⚠️ **It goes false the moment they fire, not when their round lands.** A
   * shot of theirs still crossing the table is their turn already taken, so
   * holding the board shut until it arrives is a third of a second of nothing
   * to do at the end of every single exchange - which is the one thing that
   * made this game feel slow.
   */
  let busy = false;

  /**
   * A square pressed while an exchange was still running.
   *
   * ⚠️ **Held rather than dropped**, which is the same answer 2048 gives to a
   * move pushed before the last one has landed, and for the same reason: the
   * alternative is a game that silently ignores you for two thirds of a second
   * at a time. One is kept and not a list, because a player firing ahead means
   * the next square rather than the next five.
   */
  let queued: number | null = null;

  /** The ship waiting to be put down, and the way round it will go. */
  let picked: number | null = null;
  let horizontal = true;

  const nodes: Record<Side, HTMLButtonElement[]> = { enemy: [], own: [] };
  /** The element the fleet is drawn into, one per board, above the water and
   *  below the shot marks. Built with the grid and never replaced. */
  const layers: Record<Side, HTMLElement> = {
    enemy: document.createElement('div'),
    own: document.createElement('div'),
  };
  /** The preview's own layer, over your board only, so rebuilding the fleet
   *  below it cannot take the ghost with it. */
  const ghostLayer = document.createElement('div');

  const cursor: Record<Side, number> = { enemy: 0, own: 0 };
  const boardOf = (side: Side) => (side === 'enemy' ? enemy : own);
  const elementOf = (side: Side) => (side === 'enemy' ? enemyEl : ownEl);

  /* ---- Painting ----------------------------------------------------------- */

  /**
   * One square of water, and what has landed on it.
   *
   * ⚠️ **A square never draws a ship.** The sea is a continuous grid and the
   * fleet is a layer of its own on top of it - see `hulls` - because a hull cut
   * into five squares with a line between each pair is a row of counters, not a
   * ship. So this is only ever water, a peg where a shot found nothing, and a
   * mark where one did. All three read the same over open water and over a
   * hull, which is what lets the two layers stay independent.
   *
   * ⚠️ **Only the squares that changed are repainted, never the whole board.**
   * This rewrites the class list, and the splash a shot lands with is a
   * keyframe on the class it arrives with, so repainting a board that is
   * already correct would set every shot on it off again at once.
   */
  function paint(side: Side, i: number): void {
    const board = boardOf(side);
    const node = nodes[side][i];
    if (!node) return;

    const known = board.shots[i];

    node.className = 'bs-cell';

    if (known === DEAD || known === HIT) {
      node.classList.add(known === DEAD ? 'is-sunk' : 'is-hit');
      node.setAttribute('aria-label', known === DEAD ? labels.sunk : labels.hit);
      return;
    }

    if (known === MISS) {
      node.classList.add('is-miss');
      node.setAttribute('aria-label', labels.miss);
      return;
    }

    node.classList.add('is-sea');

    // The hull over it is a picture, so a square that has a ship on it has to
    // say so itself - and only where a ship is something you are allowed to
    // know about.
    const afloat = board.owner[i] >= 0 && (side === 'own' || state === 'lost');
    node.setAttribute('aria-label', afloat ? labels.ship : labels.water);
  }

  function repaint(side: Side): void {
    for (let i = 0; i < CELLS; i++) paint(side, i);
  }

  /**
   * The fleet, as one element per ship laid over the water.
   *
   * ⚠️ **This is the whole reason a ship looks like a ship.** A hull is a
   * silhouette with a bow, a deck and a bridge on it, and none of that survives
   * being cut into squares - so the element spans its squares instead of living
   * in them, and the stylesheet draws one shape across the lot. A vertical ship
   * is the same box turned a quarter, which is why there is one silhouette in
   * the stylesheet and not two.
   *
   * Rebuilt from the board rather than moved about, for the same reason the
   * opponent's follow-up squares are: five elements is nothing to write out,
   * and a layer derived from the model cannot disagree with it.
   */
  function hulls(side: Side): void {
    const board = boardOf(side);
    const out = document.createDocumentFragment();

    board.ships.forEach((ship, index) => {
      if (!ship) return;

      const sunk = ship.hits === ship.length;
      // Their water gives nothing away: a hull appears there when it goes down,
      // and the rest of the fleet only once they have won.
      if (side === 'enemy' && !sunk && state !== 'lost') return;

      const node = berth(ship.length, ship.x, ship.y, ship.horizontal, index);
      if (sunk) node.classList.add('is-sunk');
      else if (side === 'enemy') node.classList.add('is-spared');

      out.append(node);
    });

    layers[side].replaceChildren(out);
  }

  const SVG_NS = 'http://www.w3.org/2000/svg';

  /**
   * One hull element: where it sits, which way it lies, and the drawing in it.
   *
   * ⚠️ **The ship is a `<use>` of a symbol in the page, not a shape built
   * here.** Five vessels with turrets, funnels and a flight deck are markup,
   * and markup belongs in the component - see the sprite sheet in
   * Battleship.astro. What this writes is the four numbers the stylesheet turns
   * into a position, which is the only geometry the two files share.
   *
   * @param index  Which of the five, so the right drawing is fetched. The
   *   preview passes it too: you are shown the ship you are about to put down,
   *   not a generic block the length of one.
   */
  function berth(length: number, x: number, y: number, along: boolean, index: number): HTMLElement {
    const node = document.createElement('div');
    node.className = 'bs-hull';

    let deep = 0;

    /*
     * The same drawing several times over, at rising depths.
     *
     * ⚠️ **This is the thickness, and it is built rather than drawn.** The
     * board is tilted, so copies of one silhouette stacked up the Z axis read
     * as one solid object with a side to it - the oldest trick there is, and
     * the only one that gives a ship a real side that turns with it when the
     * ship does. The bottom copy is the shadow on the water, the middle ones
     * are the flank, and the top one is the deck you actually look at.
     *
     * ⚠️ **Only the top copy is the ship.** The seven under it use a second
     * symbol that is the outline and nothing else - see `bs-hull-N` in the
     * sprite sheet - because a flank made of seven clones of a carrier's
     * flight deck, island and aircraft is seven times the geometry for a shape
     * nobody can see the inside of. The detail is resolved once per ship.
     */
    for (const role of [
      'bs-hull-shade',
      'bs-hull-body',
      'bs-hull-body',
      'bs-hull-body',
      'bs-hull-body',
      'bs-hull-body',
      'bs-hull-body',
      'bs-hull-art',
    ]) {
      const art = document.createElementNS(SVG_NS, 'svg');
      art.setAttribute('class', role);
      // Which of the four flank copies this is, so the stylesheet can space
      // them evenly up to the deck without four rules that differ by a number.
      if (role === 'bs-hull-body') art.setAttribute('style', `--deep:${deep++}`);
      art.setAttribute('aria-hidden', 'true');
      art.setAttribute('focusable', 'false');
      art.append(document.createElementNS(SVG_NS, 'use'));

      node.append(art);
    }

    dress(node, length, x, y, along, index);
    return node;
  }

  /**
   * Which ship a hull is and where it stands, written onto one that already
   * exists.
   *
   * ⚠️ **Separate from building one so the preview can move instead of being
   * rebuilt.** A ghost that is thrown away and made again on every pointer
   * event is six elements and six `<use>` resolutions per frame, and it reads
   * as the ship blinking rather than following - which is exactly what it was
   * doing. Everything that distinguishes one hull from another is an attribute,
   * so moving one costs five writes.
   */
  function dress(
    node: HTMLElement,
    length: number,
    x: number,
    y: number,
    along: boolean,
    index: number,
  ): void {
    node.dataset.axis = along ? 'h' : 'v';
    node.style.setProperty('--x', String(x));
    node.style.setProperty('--y', String(y));

    /*
     * ⚠️ **Everything below this line runs only when the vessel itself
     * changes, and that is not a micro-optimisation.** Writing `href` on a
     * `<use>` makes the browser tear down its shadow tree and build it again,
     * even when the value it is given is the one already there - and the
     * preview calls this on every pointer event. Eight torn-down shadow trees
     * a frame is what a ship flickering in your hand actually is.
     *
     * Carrying a ship changes two numbers. It never changes which ship it is.
     */
    if (node.dataset.ship === String(index)) return;

    // Which of the five, so the stylesheet can give each class its own paint.
    node.dataset.ship = String(index);
    node.style.setProperty('--len', String(length));

    // A hundred units per square and a hundred tall, which is the box every
    // symbol is drawn in, so the drawing lands on its squares exactly.
    const box = `0 0 ${length * 100} 100`;

    for (const art of Array.from(node.children)) {
      art.setAttribute('viewBox', box);

      // The deck is the drawing, everything under it is the outline.
      const symbol = art.classList.contains('bs-hull-art') ? 'bs-ship' : 'bs-hull';
      art.firstElementChild?.setAttribute('href', `#${symbol}-${index}`);
    }
  }

  /** The five entries beside a board: placed, selected, sunk. */
  function paintFleet(side: Side): void {
    const board = boardOf(side);

    shipNodes[side].forEach((node, index) => {
      const ship = board.ships[index];
      const sunk = ship !== null && ship.hits === ship.length;

      node.classList.toggle('is-sunk', sunk);
      node.classList.toggle('is-picked', side === 'own' && picked === index);
      node.classList.toggle('is-waiting', side === 'own' && ship === null);

      if (side === 'own') node.setAttribute('aria-pressed', String(picked === index));
    });
  }

  /* ---- Placing ------------------------------------------------------------ */

  /**
   * The ship under the pointer, drawn where it would land.
   *
   * ⚠️ **One element, built with the board and never removed from it.** It is
   * hidden by a class and moved by two numbers, and that is the whole of its
   * life. Creating it on the way in and removing it on the way out is the
   * obvious shape and it is what made a carried ship blink: every path that
   * cleared it - crossing into a gap, picking the next ship up, placing one -
   * dropped the element for a frame before the next event put it back, and a
   * frame is exactly long enough to see.
   *
   * It lives in a layer of its own, above the one `hulls` rebuilds, so the two
   * can never wipe each other out. It is the same drawing the fleet is made of,
   * so you are shown the ship rather than the squares it would take.
   */
  let ghost: HTMLElement | null = null;

  /**
   * Where the preview already is, so a pointer event that does not change it
   * costs nothing at all.
   *
   * ⚠️ **Most pointer events do not change it.** A square is forty pixels
   * across and a pointer reports every few, so crossing one is one event in
   * twenty - and the other nineteen were writing the same three custom
   * properties onto an element whose `<use>` shadow trees then had their style
   * recalculated for it. Comparing four numbers first is the difference
   * between touching the DOM when the ship moves and touching it whenever the
   * hand does.
   */
  let shown = '';

  /** The square the pointer is over, so anything that changes what the preview
   *  should look like can redraw it without waiting for a hand to move. */
  let over: number | null = null;

  /** Out of sight, still in the document. */
  function unghost(): void {
    ghost?.classList.add('is-idle');
    shown = '';
  }

  /**
   * Where a ship dropped on this square actually goes.
   *
   * ⚠️ **The bow is pulled back rather than the drop refused.** Aiming at the
   * right-hand edge with a five selected is the obvious thing to try and there
   * is exactly one thing it can sensibly mean, so the ship slides back to fit
   * instead of nothing happening. It also means this never returns a position
   * that runs off the board, which is one fewer thing for `fits` to catch.
   */
  function anchor(index: number, i: number): { x: number; y: number } {
    const length = FLEET[index];
    const x = horizontal ? Math.min(xOf(i), SIZE - length) : xOf(i);
    const y = horizontal ? yOf(i) : Math.min(yOf(i), SIZE - length);
    return { x, y };
  }

  function preview(i: number | null): void {
    if (state !== 'placing' || picked === null || i === null) {
      unghost();
      return;
    }

    if (!ghost) return;

    const { x, y } = anchor(picked, i);

    const at = `${picked}:${x}:${y}:${horizontal}`;
    if (at === shown) return;
    shown = at;

    const length = FLEET[picked];

    dress(ghost, length, x, y, horizontal, picked);
    ghost.classList.toggle('is-blocked', !fits(own, length, x, y, horizontal, picked));
    ghost.classList.remove('is-idle');
  }

  /** The next ship with nowhere to be, so putting a fleet down is five clicks
   *  rather than five pairs of them. */
  function nextUnplaced(): number | null {
    for (let index = 0; index < SHIPS; index++) if (own.ships[index] === null) return index;
    return null;
  }

  function select(index: number | null): void {
    picked = index;

    // What is in hand, for the stylesheet: a square does not light up under a
    // ship you are carrying, because the preview is already saying where it
    // will land.
    if (index === null) delete root.dataset.holding;
    else root.dataset.holding = '';

    unghost();
    paintFleet('own');
    announceReady();
  }

  function placeAt(i: number): void {
    if (state !== 'placing') return;

    // Nothing in hand and a ship under the pointer: pick that one back up.
    if (picked === null) {
      const index = own.owner[i];
      if (index < 0) return;

      setAxis(own.ships[index]?.horizontal ?? true);
      lift(own, index);
      repaint('own');
      hulls('own');
      select(index);
      options.onCue('lift');

      // ⚠️ **In hand is still on the board.** Lifting takes the hull away and
      // the preview is what replaces it, so without this the ship you just
      // pressed simply vanishes until the pointer happens to move - which is
      // the one moment you are least likely to move it.
      preview(i);
      return;
    }

    const { x, y } = anchor(picked, i);
    if (!fits(own, FLEET[picked], x, y, horizontal, picked)) return;

    place(own, picked, x, y, horizontal);
    repaint('own');
    hulls('own');
    select(nextUnplaced());
    options.onCue('place');

    // The next ship is already in hand, so its shape appears under the pointer
    // without waiting for it to move.
    preview(i);
  }

  /** How many of your ships are still in your hand. Zero is what enables the
   *  button that starts the game, which is why it is a count and not a flag:
   *  the same number is the readout beside it. */
  function announceReady(): void {
    options.onReady(own.ships.filter((ship) => ship === null).length);
  }

  /* ---- The turn ------------------------------------------------------------ */

  function finish(next: 'won' | 'lost'): void {
    // A round landing during the settle below can reach this again. The state
    // is already decided by then, and the first one to get here is the one
    // that decided it.
    if (state === 'won' || state === 'lost') return;

    state = next;
    busy = false;
    queued = null;
    settle();

    /*
     * On a loss the fleet that beat you is shown where it stood, which is the
     * one thing the board has been withholding.
     *
     * ⚠️ **Only the squares never fired at are repainted**, not the board. The
     * splash a shot lands with is a keyframe on the class it arrives with, so
     * repainting squares that are already correct would set every shot of the
     * whole game off again at once. Squares with nothing on them are exactly
     * the ones whose appearance depends on the outcome.
     */
    if (next === 'lost') {
      for (let i = 0; i < CELLS; i++) if (enemy.shots[i] === UNKNOWN) paint('enemy', i);
      hulls('enemy');
    }

    options.onCue(next === 'won' ? 'win' : 'lose');
    options.onState(state, shots);
  }

  /**
   * What a turn is still waiting on: your round landing, theirs landing, and
   * the pause between the two.
   *
   * ⚠️ **Three slots rather than one handle, and that is what lets the board
   * open early.** Once you can fire while their round is still crossing, two
   * flights are genuinely in the air at once, and a single handle would mean
   * your new shot cancelling the arrival of their old one - a hit that the
   * board has already taken but never shows. One slot per thing that can be
   * waiting, and nothing can cancel anything but its own successor.
   *
   * The thunk is kept beside the handle so a game ending can run what is still
   * pending instead of dropping it: a round in the air has already happened,
   * and its mark has to appear.
   */
  type Slot = 'enemy' | 'own' | 'reply';
  const timers: Record<Slot, { id: number; run: () => void } | null> = {
    enemy: null,
    own: null,
    reply: null,
  };

  function schedule(slot: Slot, ms: number, run: () => void): void {
    cancel(slot);
    timers[slot] = {
      id: window.setTimeout(() => {
        timers[slot] = null;
        run();
      }, ms),
      run,
    };
  }

  function cancel(slot: Slot): void {
    const timer = timers[slot];
    if (!timer) return;

    window.clearTimeout(timer.id);
    timers[slot] = null;
  }

  /** Everything at once and nothing run: a new game owes the old one nothing. */
  function stopReply(): void {
    cancel('enemy');
    cancel('own');
    cancel('reply');
  }

  /** The rounds still in the air land now, and the pause between them is
   *  dropped. For the end of a game, where one side has already won and the
   *  board still has a mark or two owing. */
  function settle(): void {
    cancel('reply');

    for (const slot of ['enemy', 'own'] as const) {
      const timer = timers[slot];
      if (!timer) continue;

      cancel(slot);
      timer.run();
    }
  }

  /**
   * A round, from the ship that fired it to the square it lands on.
   *
   * ⚠️ **It crosses the table rather than arriving from off the edge of one
   * board.** That is the whole point of drawing it: a shot is one fleet firing
   * at the other, so it leaves your water, flies over the gap and lands in
   * theirs. Which means it cannot live inside a board - it is positioned
   * against the frame that holds both, and the two ends are measured off the
   * squares themselves rather than computed from the grid, so the tilt is
   * already in the numbers.
   *
   * ⚠️ **It is decoration over a result that has already happened.** `fire` has
   * run and the board is settled before this is called: what waits for the
   * flight is the *paint*, not the game. A flight interrupted by a restart
   * costs an element that removes itself, and no state is ever left in the air.
   */
  function launch(side: Side, i: number): void {
    const target = nodes[side][i];
    if (!target) return;

    const box = options.frame.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const from = (side === 'enemy' ? battery() : enemyEl).getBoundingClientRect();

    const tx = to.left + to.width / 2 - box.left;
    const ty = to.top + to.height / 2 - box.top;
    const dx = from.left + from.width / 2 - box.left - tx;
    const dy = from.top + from.height / 2 - box.top - ty;

    const node = document.createElement('i');
    node.className = 'bs-missile';
    // The element sits on its target and the keyframe brings it in from the
    // offset, so the thing that has to be right - where it lands - is a
    // position rather than the end of a sum.
    node.style.left = `${tx}px`;
    node.style.top = `${ty}px`;
    node.style.setProperty('--dx', `${dx}px`);
    node.style.setProperty('--dy', `${dy}px`);
    node.style.setProperty('--range', `${Math.round(Math.hypot(dx, dy))}px`);
    node.style.setProperty('--aim', `${Math.atan2(-dy, -dx)}rad`);

    // Removed by the animation it was created for, so nothing has to remember
    // it and a browser that never fires the event drops one element.
    node.addEventListener('animationend', () => node.remove(), { once: true });

    options.frame.append(node);
    options.onCue('fire', side === 'enemy' ? 1 : 0);
  }

  /**
   * Which of your ships fires.
   *
   * ⚠️ **Yours leave one of your own hulls and theirs leave their water at
   * large.** Where your ships are is something you can see anyway, so a round
   * coming off one costs nothing and is the thing that makes a turn read as two
   * fleets rather than two grids. Where *their* ships are is the entire game,
   * so a muzzle flash on their board would hand it over - theirs come from the
   * middle of their water and name nobody.
   */
  function battery(): HTMLElement {
    const afloat: Ship[] = [];
    for (const ship of own.ships) if (ship && ship.hits < ship.length) afloat.push(ship);
    if (afloat.length === 0) return ownEl;

    const ship = afloat[Math.floor(Math.random() * afloat.length)];
    const middle = Math.floor(ship.length / 2);
    const cell = ship.horizontal
      ? ship.y * SIZE + ship.x + middle
      : (ship.y + middle) * SIZE + ship.x;

    return nodes.own[cell] ?? ownEl;
  }

  /** The sentence for one shot, on either board. */
  function describe(side: Side, shot: Shot, index: number | null): string {
    if (index !== null) return messages.sunk.replace('{ship}', shipName(side, index));
    return shot.hit ? messages.hit : messages.miss;
  }

  /**
   * What a shot did, once its missile has got there.
   *
   * Split out of the two functions below because both halves of a turn land the
   * same way and only the sentence differs. Everything here is derived from the
   * board, so arriving late - after a restart, say - paints what is there now
   * rather than what was there when the missile left.
   */
  function land(side: Side, i: number, shot: Shot): string {
    paint(side, i);
    for (const cell of shot.wreck) paint(side, cell);

    if (shot.sunk !== null) {
      // The hull surfaces the moment it is finished, which on their side is the
      // one time the water gives anything away.
      hulls(side);
      paintFleet(side);
    }

    const said = describe(side, shot, shot.sunk);
    options.onLog(side, said);
    options.onCue(shot.sunk !== null ? 'sunk' : shot.hit ? 'hit' : 'splash', side === 'enemy' ? 1 : 0);

    return said;
  }

  function shoot(i: number): void {
    if (state !== 'playing') return;

    // Fired into an exchange: kept for the moment it ends, unless that square
    // is already answered, in which case there is nothing to keep.
    if (busy) {
      if (enemy.shots[i] === UNKNOWN) queued = i;
      return;
    }

    const shot = fire(enemy, i);
    if (!shot) return;

    // Closed for the whole exchange, not just for your own shot: there are two
    // missiles and a decision between this and the next press.
    busy = true;
    shots++;
    options.onShots(shots);
    launch('enemy', i);

    schedule('enemy', FLIGHT_MS, () => {
      const said = land('enemy', i, shot);

      if (enemy.hits === HULL) {
        options.onLive(said);
        finish('won');
        return;
      }

      options.onLog('own', messages.waiting);
      schedule('reply', REPLY_MS, () => answer(said));
    });
  }

  /**
   * The opponent's turn.
   *
   * A hit does not buy a second shot, on either side. It is the classic rule
   * and it is also what keeps the strongest of the four honest: one good guess
   * would otherwise take a whole fleet down in a single turn, and a game you
   * watch is not a game.
   */
  function answer(after: string): void {
    const remaining: number[] = [];
    for (const ship of own.ships) if (ship && ship.hits < ship.length) remaining.push(ship.length);

    const i = chooseShot(own.shots, remaining, level, plan);
    const shot = i < 0 ? null : fire(own, i);

    if (!shot) {
      busy = false;
      return;
    }

    launch('own', i);

    /*
     * Their turn is taken the moment the round leaves, so the board opens here
     * rather than when it arrives. You can fire back over the top of it, which
     * is what two fleets shooting at each other actually looks like.
     */
    busy = false;

    const held = queued;
    queued = null;
    if (held !== null) shoot(held);

    schedule('own', FLIGHT_MS, () => {
      const said = land('own', i, shot);
      options.onLive(`${after} ${said}`);

      if (own.hits === HULL) finish('lost');
    });
  }

  /* ---- Building the grids --------------------------------------------------
   *
   * ⚠️ **Rows are `role="row"` wrappers with `display: contents`**, and both
   * halves are required: a grid without rows gives a reader no position, and a
   * row that is also a layout box would nest the cells in a second grid and
   * break the columns. The same arrangement as the minefield, and the note
   * there explains why the cells carry `role="gridcell"` over the button role.
   *
   * Two boards rather than one, built by the same function. They are the same
   * ten by ten of buttons and differ only in what a press means, so writing it
   * out twice would be two places for the roving focus to be got wrong.
   */
  function build(side: Side): void {
    const el = elementOf(side);
    const rows = document.createDocumentFragment();

    nodes[side] = [];
    cursor[side] = 0;

    el.setAttribute('aria-rowcount', String(SIZE));
    el.setAttribute('aria-colcount', String(SIZE));

    for (let y = 0; y < SIZE; y++) {
      const row = document.createElement('div');
      row.className = 'bs-row';
      row.setAttribute('role', 'row');
      row.setAttribute('aria-rowindex', String(y + 1));

      for (let x = 0; x < SIZE; x++) {
        const node = document.createElement('button');
        node.type = 'button';
        node.setAttribute('role', 'gridcell');
        node.setAttribute('aria-colindex', String(x + 1));
        // Roving: one square of each board is in the tab order, so a reader
        // tabs past a hundred of them in one press.
        node.tabIndex = -1;
        node.dataset.i = String(y * SIZE + x);

        row.append(node);
        nodes[side].push(node);
      }

      rows.append(row);
    }

    /*
     * The fleet's layer goes in with the squares, after them, so it paints
     * over the water and under the marks a shot leaves - which is a z-index on
     * three rules in the stylesheet rather than three elements here.
     */
    layers[side].className = 'bs-hulls';
    el.replaceChildren(rows, layers[side]);

    if (side === 'own') {
      // Its own class as well, because the preview's layer is deliberately flat
      // where the fleet's is not - see `.bs-hulls.bs-ghosts`.
      ghostLayer.className = 'bs-hulls bs-ghosts';
      el.append(ghostLayer);

      // The preview, once, for the life of the board. Which ship it is showing
      // is rewritten when one is picked up; it is never made again.
      if (!ghost) {
        ghost = berth(FLEET[0], 0, 0, true, 0);
        ghost.classList.add('is-ghost', 'is-idle');
      }

      ghostLayer.append(ghost);
    }

    nodes[side][cursor[side]]?.setAttribute('tabindex', '0');
  }

  function restart(): void {
    stopReply();

    enemy = emptyBoard();
    own = emptyBoard();
    arrange(enemy);
    arrange(own);
    plan = planFor();

    state = 'placing';
    shots = 0;
    busy = false;
    queued = null;
    picked = null;
    // Nothing is in hand at the start of a game, so nothing is under the
    // pointer. The preview outlives a restart now that it is never removed,
    // which means it also has to be told to stand down.
    unghost();
    setAxis(true);

    build('enemy');
    build('own');
    repaint('enemy');
    repaint('own');
    hulls('enemy');
    hulls('own');
    paintFleet('enemy');
    paintFleet('own');
    announceReady();

    options.onShots(0);
    options.onLog('enemy', '');
    options.onLog('own', '');
    options.onLive('');
    options.onState(state, 0);
  }

  /* ---- Input ---------------------------------------------------------------- */

  function cellAt(target: EventTarget | null): number | null {
    if (!(target instanceof Element)) return null;

    const node = target.closest<HTMLElement>('.bs-cell');
    if (!node?.dataset.i) return null;

    return Number(node.dataset.i);
  }

  function focus(side: Side, next: number): void {
    if (next < 0 || next >= CELLS) return;

    nodes[side][cursor[side]]?.setAttribute('tabindex', '-1');
    cursor[side] = next;
    nodes[side][next].setAttribute('tabindex', '0');
    nodes[side][next].focus();
  }

  function onKeyDown(side: Side, event: KeyboardEvent): void {
    const i = cellAt(event.target);
    if (i === null || event.metaKey || event.ctrlKey || event.altKey) return;

    const x = xOf(i);
    const y = yOf(i);

    const moves: Record<string, number> = {
      ArrowLeft: x > 0 ? i - 1 : i,
      ArrowRight: x < SIZE - 1 ? i + 1 : i,
      ArrowUp: y > 0 ? i - SIZE : i,
      ArrowDown: y < SIZE - 1 ? i + SIZE : i,
      Home: y * SIZE,
      End: y * SIZE + SIZE - 1,
    };

    if (event.code in moves) {
      event.preventDefault();
      focus(side, moves[event.code]);
      if (side === 'own') preview(moves[event.code]);
      return;
    }

    // Turning the ship from the keyboard, which is the mouse's Rotate button
    // and the one control that has no square of its own to press.
    if (side === 'own' && state === 'placing' && event.code === 'KeyR') {
      event.preventDefault();
      over = i;
      rotate();
    }
  }

  const onEnemyClick = (event: MouseEvent) => {
    const i = cellAt(event.target);
    if (i !== null) shoot(i);
  };

  const onOwnClick = (event: MouseEvent) => {
    const i = cellAt(event.target);
    if (i !== null) placeAt(i);
  };

  const onEnemyKey = (event: KeyboardEvent) => onKeyDown('enemy', event);
  const onOwnKey = (event: KeyboardEvent) => onKeyDown('own', event);

  /*
   * ⚠️ **A pointer that is over the board but not over a square leaves the
   * ghost where it was.** There is a border and a tray around the squares, and
   * clearing the preview every time the pointer crossed one of them is what
   * made a ship vanish whenever it got near the edge - which is where you aim
   * most often. Leaving the board is what takes it away, and that is
   * `pointerleave`.
   */
  const onOwnMove = (event: PointerEvent) => {
    const i = cellAt(event.target);
    if (i === null) return;

    over = i;
    preview(i);
  };
  const onOwnLeave = () => {
    over = null;
    unghost();
  };

  /**
   * What counts as leaving, and it is the chart rather than the grid.
   *
   * ⚠️ **Bound to the tray, not to the board.** The grid has a one pixel border
   * and sits in a tray with padding around it, so a pointer moving anywhere
   * near the edge of the board leaves it into the tray and comes straight back
   * - several times a second. With the listener on the board, every one of
   * those put the ship in your hand away and the next move brought it back,
   * which is a ship blinking at frame rate. Caught by logging the stack behind
   * every hide: 58 of 60 came from here.
   *
   * Inside the chart there is never a reason to put it away. You are holding a
   * ship, and where it would land is the thing you are looking at.
   */
  const ownLeaveTarget = ownEl.closest('.bs-plot') ?? ownEl;

  enemyEl.addEventListener('click', onEnemyClick);
  enemyEl.addEventListener('keydown', onEnemyKey);
  ownEl.addEventListener('click', onOwnClick);
  ownEl.addEventListener('keydown', onOwnKey);
  ownEl.addEventListener('pointermove', onOwnMove);
  ownLeaveTarget.addEventListener('pointerleave', onOwnLeave);

  /** The five entries beside your own fleet are buttons, so a ship can be
   *  taken back off the board without hunting for it on the grid. */
  const onFleetClick = (event: MouseEvent) => {
    if (state !== 'placing') return;

    const node = (event.target as Element | null)?.closest<HTMLElement>('[data-ship]');
    if (!node?.dataset.ship) return;

    const index = Number(node.dataset.ship);

    /*
     * ⚠️ **Pressing the ship you are already holding does nothing.** It used to
     * deselect, which left the ship lifted off the board and in nobody's hand:
     * the count said one still to place, the water showed nothing, and moving
     * the pointer showed nothing either, because there was nothing to preview.
     * A ship in hand has to go somewhere, so there is nothing for cancelling to
     * mean.
     */
    if (picked === index) return;

    if (own.ships[index]) {
      setAxis(own.ships[index]!.horizontal);
      lift(own, index);
      repaint('own');
      // ⚠️ The fleet layer has to be rebuilt as well as the squares. Without
      // it the model has the ship in hand while the board still shows it where
      // it was, and putting it down leaves two of the same ship on the water.
      hulls('own');
    }

    select(index);
    options.onCue('lift');
  };

  options.ownFleet.addEventListener('click', onFleetClick);

  /** The way round the next ship goes. On the root because the button that
   *  turns it shows which way that is, and a class is cheaper than a callback
   *  for something with exactly two values. */
  function setAxis(next: boolean): void {
    horizontal = next;
    root.dataset.axis = next ? 'h' : 'v';
  }

  function rotate(): void {
    if (state !== 'placing') return;

    setAxis(!horizontal);
    options.onCue('rotate');

    // ⚠️ The ship in your hand turns now, not when the hand next moves. The
    // button changed what the preview should be, so the preview is redrawn
    // from the square it is already standing on - the keyboard's R has always
    // done this, and the button reading as unresponsive was the difference.
    preview(over);
  }

  restart();

  return {
    restart,

    setLevel(id) {
      level = id;
      restart();
    },

    shuffle() {
      if (state !== 'placing') return;
      arrange(own);
      unghost();
      repaint('own');
      hulls('own');
      select(null);
      options.onCue('shuffle');
    },

    rotate,

    start() {
      if (state !== 'placing' || nextUnplaced() !== null) return;

      state = 'playing';
      picked = null;
      unghost();
      paintFleet('own');

      options.onLog('enemy', messages.ready);
      options.onState(state, shots);
    },

    destroy() {
      stopReply();
      enemyEl.removeEventListener('click', onEnemyClick);
      enemyEl.removeEventListener('keydown', onEnemyKey);
      ownEl.removeEventListener('click', onOwnClick);
      ownEl.removeEventListener('keydown', onOwnKey);
      ownEl.removeEventListener('pointermove', onOwnMove);
      ownLeaveTarget.removeEventListener('pointerleave', onOwnLeave);
      options.ownFleet.removeEventListener('click', onFleetClick);
    },
  };
}
