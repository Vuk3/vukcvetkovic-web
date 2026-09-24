/**
 * Four in a Row.
 *
 * Seven columns of six, two players dropping a disc in turn, and the first to
 * line up four of their own across, down or on a diagonal wins. The seventh
 * game here and the second with an opponent in it, and the first where the
 * opponent has to look ahead: a Battleship shot is a guess about what is
 * hidden, while every disc here is in plain sight and the whole game is what
 * happens next.
 *
 * ⚠️ **The part worth reading is `search` and the bookkeeping under it.** The
 * rules fit in a sentence, so nearly all of the interest is in the opponent.
 * Four of them share one position and differ in how far ahead they look and
 * how much of what they see they act on, from one that only notices a four of
 * its own to one that searches as deep as a third of a second allows.
 *
 * ⚠️ **A position keeps its own score as it changes, and that is what makes the
 * search fast enough.** Every one of the 69 lines of four on the board has a
 * count of each player's discs in it, and a disc changes only the lines that run
 * through its square - at most 13. So a win is a count reaching four rather than
 * a scan, a threat is a count of three against an empty square, and the value of
 * a whole position is a running total rather than a sum over the board at every
 * leaf.
 */

/* ---- The board ----------------------------------------------------------- */

export const COLUMNS = 7;
export const ROWS = 6;
export const CELLS = COLUMNS * ROWS;

/**
 * A square is `column * ROWS + row`, with row 0 at the bottom.
 *
 * Column by column rather than row by row, because a column is the thing a
 * disc is dropped into and the next free square in one is its height - so a
 * move is a column and an index is one multiplication away from it.
 */
export const cellOf = (column: number, row: number) => column * ROWS + row;
export const columnOf = (cell: number) => Math.floor(cell / ROWS);
export const rowOf = (cell: number) => cell % ROWS;

/** 1 is you and 2 is the opponent, so an empty square is 0 and the other
 *  player is always `3 - p`. */
export type Player = 1 | 2;

/**
 * Every line of four on the board: 24 across, 21 down, and 12 on each
 * diagonal.
 *
 * ⚠️ **69 lines and not a list of directions to walk**, because a line is what
 * the bookkeeping counts. `THROUGH[cell]` is the lines that cross a square, so
 * dropping a disc touches exactly those and nothing else. A square in the middle
 * of the board is on 13 of them and a corner on 3, which is also the whole of
 * why the middle is worth more: nothing has to say so.
 */
const LINES: number[][] = [];

for (let column = 0; column < COLUMNS; column++) {
  for (let row = 0; row < ROWS; row++) {
    for (const [dc, dr] of [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, -1],
    ]) {
      const end = [column + dc * 3, row + dr * 3];
      if (end[0] < 0 || end[0] >= COLUMNS || end[1] < 0 || end[1] >= ROWS) continue;
      LINES.push([0, 1, 2, 3].map((k) => cellOf(column + dc * k, row + dr * k)));
    }
  }
}

const LINE_COUNT = LINES.length;

const THROUGH: number[][] = Array.from({ length: CELLS }, () => []);
LINES.forEach((line, i) => {
  for (const cell of line) THROUGH[cell].push(i);
});

/**
 * The order columns are tried in: the middle first, then outwards.
 *
 * It decides nothing, it only decides what is looked at first, and in an
 * alpha-beta search that is most of the speed. The best move is usually near
 * the middle, and finding it first lets every worse one be cut off early.
 */
const CENTRE_OUT = [3, 2, 4, 1, 5, 0, 6];

/* ---- The position -------------------------------------------------------- */

/**
 * The value of a line to the player who has discs in it, by how many.
 *
 * A line with both colours in it is dead and worth nothing to either, which is
 * most of what this has to know. A live line is worth more the fuller it is,
 * steeply, since three in a line with the fourth square open is a threat and
 * two is only the beginning of one.
 */
const WORTH = [0, 1, 4, 16];

/**
 * What a threat is worth on top, when its open square is on the right row for
 * the player who made it.
 *
 * ⚠️ **This is the one piece of real Four in a Row theory in the evaluation,
 * and the strong players are built on it.** The board fills from the bottom, so
 * whoever has to move into the square under a threat hands it over. With
 * perfect play to the end, the player who went first gets the odd rows (first,
 * third, fifth from the bottom) and the one who went second gets the even ones.
 * A threat on your own parity is a threat that will come good if nothing else
 * happens, and one on the other parity usually never does.
 */
const PARITY = 12;

/** A win, less the moves it takes, so a quick win beats a slow one and a slow
 *  loss beats a quick one. Far above anything the lines can add up to. */
const WIN = 100_000;

export interface Position {
  /** 0 empty, 1 you, 2 them. */
  cells: Int8Array;
  /** The next free row in each column. */
  heights: Int8Array;
  moves: number;
  /** Who dropped the first disc, which is what decides which rows are whose -
   *  see `PARITY`. */
  first: Player;
  /** How many discs each player has in each line: `count[line * 2 + p - 1]`. */
  count: Int8Array;
  /** What each line is worth now, from player 1's side, so a change can take
   *  its old value off the total without working it out again. */
  worth: Int16Array;
  /** The sum of `worth`: the position, from player 1's side. */
  total: number;
  /** Two independent hashes of the position, for the table of positions the
   *  search has already seen. One picks the slot and the other checks it. */
  hashA: number;
  hashB: number;
}

/**
 * Random numbers for the hashes, one per square per player.
 *
 * ⚠️ **Seeded, not `Math.random`**, so a position hashes the same way on every
 * load. Nothing depends on that today, but a table that behaves differently on
 * every visit is a bug that only happens sometimes.
 */
function keys(seed: number): Int32Array {
  const out = new Int32Array(CELLS * 2);
  let state = seed;

  for (let i = 0; i < out.length; i++) {
    // Mulberry32: small, fast, and good enough that no two keys collide.
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    out[i] = t ^ (t >>> 14);
  }

  return out;
}

const KEYS_A = keys(0x5eed4);
const KEYS_B = keys(0xc0ffee);

export function newPosition(first: Player): Position {
  return {
    cells: new Int8Array(CELLS),
    heights: new Int8Array(COLUMNS),
    moves: 0,
    first,
    count: new Int8Array(LINE_COUNT * 2),
    worth: new Int16Array(LINE_COUNT),
    total: 0,
    hashA: 0,
    hashB: 0,
  };
}

/**
 * A position to search in.
 *
 * ⚠️ **The search never works on the game's own position.** Running out of
 * time is an exception thrown from wherever the search happens to be, twelve
 * moves deep, and every disc it had dropped on the way down is still on the
 * board when it lands in the `catch`. On a copy that costs nothing. On the
 * real position it was a column that filled up by itself.
 */
function copyOf(pos: Position): Position {
  return {
    ...pos,
    cells: pos.cells.slice(),
    heights: pos.heights.slice(),
    count: pos.count.slice(),
    worth: pos.worth.slice(),
  };
}

/** Which player's rows a square is on: the first player's if its row counted
 *  from 1 at the bottom is odd. */
const parityOf = (pos: Position, cell: number): Player =>
  rowOf(cell) % 2 === 0 ? pos.first : ((3 - pos.first) as Player);

/** A line's worth from player 1's side, from its counts and, for a threat,
 *  where its open square is. */
function lineWorth(pos: Position, line: number): number {
  const mine = pos.count[line * 2];
  const theirs = pos.count[line * 2 + 1];

  if (mine > 0 && theirs > 0) return 0;

  const n = mine || theirs;
  if (n === 0) return 0;

  const owner: Player = mine > 0 ? 1 : 2;
  let worth = n >= 4 ? 1000 : WORTH[n];

  // ⚠️ Which square is open depends only on the line's own squares, and its
  // parity only on its row, so a line's worth changes only when one of its
  // own squares does. That is what lets `touch` update just the lines through
  // the square that changed and the total never drift from the sum.
  if (n === 3) {
    for (const cell of LINES[line]) {
      if (pos.cells[cell] === 0) {
        if (parityOf(pos, cell) === owner) worth += PARITY;
        break;
      }
    }
  }

  return owner === 1 ? worth : -worth;
}

/** Brings the lines through `cell` up to date after it has changed. The
 *  square itself has to be written first, since a threat's worth reads which
 *  of its squares is open. */
function touch(pos: Position, cell: number, p: Player, by: 1 | -1): void {
  const slot = p - 1;

  for (const line of THROUGH[cell]) {
    pos.count[line * 2 + slot] += by;
    const worth = lineWorth(pos, line);
    pos.total += worth - pos.worth[line];
    pos.worth[line] = worth;
  }
}

/**
 * Drops a disc of `p` into `column`. Returns the square it landed on, or -1
 * for a full column.
 */
export function play(pos: Position, column: number, p: Player): number {
  const row = pos.heights[column];
  if (row >= ROWS) return -1;

  const cell = cellOf(column, row);
  pos.cells[cell] = p;
  pos.heights[column] = row + 1;
  pos.moves++;
  pos.hashA ^= KEYS_A[cell * 2 + p - 1];
  pos.hashB ^= KEYS_B[cell * 2 + p - 1];
  touch(pos, cell, p, 1);

  return cell;
}

/** Takes the top disc out of `column` again. The search's undo, and the only
 *  thing that ever calls it. */
export function unplay(pos: Position, column: number): void {
  const row = pos.heights[column] - 1;
  const cell = cellOf(column, row);
  const p = pos.cells[cell] as Player;

  pos.cells[cell] = 0;
  pos.heights[column] = row;
  pos.moves--;
  pos.hashA ^= KEYS_A[cell * 2 + p - 1];
  pos.hashB ^= KEYS_B[cell * 2 + p - 1];
  touch(pos, cell, p, -1);
}

/** Whether a disc of `p` on this empty square would make four: some line
 *  through it already holds three of theirs and nothing of the other's. */
export function wins(pos: Position, cell: number, p: Player): boolean {
  const mine = p - 1;
  const other = 2 - p;

  for (const line of THROUGH[cell]) {
    if (pos.count[line * 2 + mine] === 3 && pos.count[line * 2 + other] === 0) return true;
  }

  return false;
}

/**
 * Every line of four through `cell` that one player fills: what lights up at
 * the end of a game. A disc that finishes two lines at once lights up both,
 * and a row of five is two lines of four that overlap, which drawn one over
 * the other is simply a longer line.
 */
export function winningLines(pos: Position, cell: number): number[][] {
  const p = pos.cells[cell];
  if (!p) return [];

  return THROUGH[cell].filter((line) => pos.count[line * 2 + p - 1] === 4).map((line) => LINES[line]);
}

/** Whether the disc just dropped on `cell` finished a line. */
export function won(pos: Position, cell: number): boolean {
  const p = pos.cells[cell];
  if (!p) return false;
  for (const line of THROUGH[cell]) if (pos.count[line * 2 + p - 1] === 4) return true;
  return false;
}

export const full = (pos: Position) => pos.moves >= CELLS;

/* ---- The search ------------------------------------------------------------ */

/**
 * Positions already searched, so a position reached by two orders of the same
 * moves is only ever worked out once - and in this game almost every position
 * is reached many ways.
 *
 * ⚠️ **Typed arrays, not a `Map`, and allocated on first use.** 262,144 slots
 * of eleven bytes each is under three megabytes, taken only by the two
 * opponents that search deep enough to need it, and a slot is found by masking
 * a hash rather than by hashing a key object. An entry that is overwritten by
 * a different position is simply lost, which costs a little time and never a
 * wrong answer, because the second hash is checked before one is used.
 */
const TABLE_BITS = 18;
const TABLE_MASK = (1 << TABLE_BITS) - 1;

interface Table {
  check: Int32Array;
  score: Int32Array;
  depth: Int8Array;
  /** Whether `score` is exact, or only a bound the search cut off at. */
  bound: Uint8Array;
  move: Int8Array;
}

const EXACT = 0;
const LOWER = 1;
const UPPER = 2;

let table: Table | null = null;

function tableFor(): Table {
  table ??= {
    check: new Int32Array(1 << TABLE_BITS),
    score: new Int32Array(1 << TABLE_BITS),
    depth: new Int8Array(1 << TABLE_BITS).fill(-1),
    bound: new Uint8Array(1 << TABLE_BITS),
    move: new Int8Array(1 << TABLE_BITS).fill(-1),
  };
  return table;
}

/** Thrown out of the search when the time is up, and caught at the top. */
const OUT_OF_TIME = Symbol('out of time');

interface Budget {
  deadline: number;
  nodes: number;
}

/** A position's value to `p`, from the running total. */
const valueFor = (pos: Position, p: Player) => (p === 1 ? pos.total : -pos.total);

/**
 * Negamax with alpha-beta: the best `p` can do from here, looking `depth`
 * moves ahead, as a score from `p`'s own side.
 *
 * Three things happen before any searching, and they are most of why it is
 * quick. A four `p` can make now is taken without looking further. A four the
 * other player could make next is the only move worth considering, because
 * anything else loses - and two of them at once are a loss already. And a
 * move straight under a square the other player wins on is tried last,
 * since it hands them the game.
 */
function search(
  pos: Position,
  p: Player,
  depth: number,
  alpha: number,
  beta: number,
  ply: number,
  budget: Budget,
  memo: Table | null,
): number {
  if ((++budget.nodes & 2047) === 0 && performance.now() > budget.deadline) throw OUT_OF_TIME;

  const o = (3 - p) as Player;
  let open = 0;

  for (const column of CENTRE_OUT) {
    const row = pos.heights[column];
    if (row >= ROWS) continue;
    open++;
    if (wins(pos, cellOf(column, row), p)) return WIN - ply;
  }

  if (open === 0) return 0;

  let forced = -1;
  let threats = 0;

  for (const column of CENTRE_OUT) {
    const row = pos.heights[column];
    if (row < ROWS && wins(pos, cellOf(column, row), o)) {
      threats++;
      forced = column;
    }
  }

  // Two squares they win on and one move to cover them with.
  if (threats >= 2) return -(WIN - ply - 1);

  if (depth <= 0) return valueFor(pos, p);

  const slot = pos.hashA & TABLE_MASK;
  let hinted = -1;

  if (memo && memo.check[slot] === pos.hashB) {
    hinted = memo.move[slot];

    if (memo.depth[slot] >= depth) {
      // Wins are stored against the position rather than the root, so they
      // are put back in terms of this ply on the way out.
      let score = memo.score[slot];
      if (score > WIN - 100) score -= ply;
      else if (score < -(WIN - 100)) score += ply;

      const bound = memo.bound[slot];
      if (bound === EXACT) return score;
      if (bound === LOWER && score >= beta) return score;
      if (bound === UPPER && score <= alpha) return score;
    }
  }

  const order = forced >= 0 ? [forced] : ordered(pos, p, o, hinted, depth);

  const start = alpha;
  let best = -Infinity;
  let bestMove = order[0];

  for (const column of order) {
    play(pos, column, p);
    const score = -search(pos, o, depth - 1, -beta, -alpha, ply + 1, budget, memo);
    unplay(pos, column);

    if (score > best) {
      best = score;
      bestMove = column;
    }

    if (score > alpha) alpha = score;
    if (alpha >= beta) break;
  }

  if (memo) {
    let stored = best;
    if (stored > WIN - 100) stored += ply;
    else if (stored < -(WIN - 100)) stored -= ply;

    memo.check[slot] = pos.hashB;
    memo.score[slot] = stored;
    memo.depth[slot] = depth;
    memo.bound[slot] = best <= start ? UPPER : best >= beta ? LOWER : EXACT;
    memo.move[slot] = bestMove;
  }

  return best;
}

/**
 * The columns worth trying, best guess first.
 *
 * ⚠️ **Guessed by playing each move and reading the running total**, which is
 * one play and one undo a move - and the difference between a search that
 * reaches eight moves ahead in the time and one that reaches twelve. The move
 * the table remembers as best goes first whatever it scores, and a move that
 * drops a disc straight under a square the other player wins on goes last.
 */
function ordered(pos: Position, p: Player, o: Player, hinted: number, depth: number): number[] {
  const moves: number[] = [];
  const keys: number[] = [];

  for (const column of CENTRE_OUT) {
    const row = pos.heights[column];
    if (row >= ROWS) continue;

    let key: number;

    if (row + 1 < ROWS && wins(pos, cellOf(column, row + 1), o)) key = -1e9;
    else if (column === hinted) key = 1e9;
    else if (depth >= 3) {
      play(pos, column, p);
      key = valueFor(pos, p);
      unplay(pos, column);
    } else key = 0;

    // Insertion into a list of at most seven, which is cheaper than a sort.
    let at = moves.length;
    while (at > 0 && keys[at - 1] < key) at--;
    moves.splice(at, 0, column);
    keys.splice(at, 0, key);
  }

  return moves;
}

/**
 * Every legal column's score to `p`, searched `depth` moves ahead with a full
 * window each, so moves can be compared rather than only the best one found.
 * For the two opponents that choose among good moves rather than taking the
 * best one.
 */
function scoreAll(pos: Position, p: Player, depth: number, budget: Budget, memo: Table | null) {
  const o = (3 - p) as Player;
  const out: { column: number; score: number }[] = [];

  for (const column of CENTRE_OUT) {
    if (pos.heights[column] >= ROWS) continue;

    const cell = play(pos, column, p);
    const score = won(pos, cell) ? WIN : -search(pos, o, depth - 1, -Infinity, Infinity, 1, budget, memo);
    unplay(pos, column);

    out.push({ column, score });
  }

  return out;
}

/**
 * The best column for `p`, as deep as `ms` allows.
 *
 * Iterative deepening: one move ahead, then two, then three, each search
 * starting from the table the last one filled, until the time runs out or a
 * forced result is found. The answer is the last search that finished, so
 * running out of time mid-search costs that search and nothing else.
 */
function deepest(pos: Position, p: Player, ms: number): { column: number; depth: number } {
  const memo = tableFor();
  const budget: Budget = { deadline: performance.now() + ms, nodes: 0 };
  const o = (3 - p) as Player;

  let choice = { column: legal(pos)[0], depth: 0 };

  for (let depth = 1; depth <= CELLS - pos.moves; depth++) {
    try {
      let best = -Infinity;
      let bestColumns: number[] = [];

      for (const column of ordered(pos, p, o, choice.column, 3)) {
        const cell = play(pos, column, p);
        const score = won(pos, cell) ? WIN : -search(pos, o, depth - 1, -WIN - 1, -best + 1, 1, budget, memo);
        unplay(pos, column);

        if (score > best) {
          best = score;
          bestColumns = [column];
        } else if (score === best) bestColumns.push(column);
      }

      // Among moves that are exactly as good, any, so two games that open the
      // same way do not have to go on the same way.
      choice = { column: bestColumns[Math.floor(Math.random() * bestColumns.length)], depth };

      if (Math.abs(best) > WIN - 100) break;
    } catch (error) {
      if (error === OUT_OF_TIME) break;
      throw error;
    }
  }

  return choice;
}

export function legal(pos: Position): number[] {
  return CENTRE_OUT.filter((column) => pos.heights[column] < ROWS);
}

/** A column drawn at random, the middle ones more often: how someone plays
 *  who knows the middle is good and nothing else. */
function lean(columns: number[]): number {
  const weights = columns.map((column) => 4 - Math.abs(column - 3));
  let roll = Math.random() * weights.reduce((a, b) => a + b, 0);

  for (let i = 0; i < columns.length; i++) {
    roll -= weights[i];
    if (roll < 0) return columns[i];
  }

  return columns[columns.length - 1];
}

/* ---- The four opponents -------------------------------------------------- */

/**
 * The four opponents, weakest first, and declaration order is the order the
 * page offers them in.
 *
 * A list rather than a table of numbers, for Battleship's reason: a level here
 * is a way of choosing a column, and the difference between two of them is a
 * branch in `chooseColumn` rather than a figure. The words for them are
 * `games.items.fourInARow.levels` in the dictionaries, so a fifth added here
 * with no name behind it fails the check.
 */
export const LEVELS = ['beginner', 'amateur', 'master', 'grandmaster'] as const;
export type LevelId = (typeof LEVELS)[number];

/**
 * How long the strongest one thinks, in milliseconds.
 *
 * ⚠️ **The search runs on the main thread, so this is time the page is
 * busy.** Nothing is lost by it: the disc that just landed has landed, the only
 * thing moving is a transition the compositor is running, and a third of a
 * second is about what a person takes to look at the board anyway. Deeper
 * buys very little - from the middle of a game it already reaches twelve to
 * sixteen moves ahead, and the end of a game it searches to the last disc.
 */
export const THINK_MS = 320;

/** How far ahead the master looks, and how close to its best a move has to
 *  be for it to consider playing it. */
const MASTER_DEPTH = 7;
const MASTER_SLACK = 3;

/** The amateur looks three moves ahead, which is exactly far enough to
 *  see a four coming either way, and plays anything reasonable. */
const AMATEUR_DEPTH = 3;
const AMATEUR_SLACK = 12;

/**
 * The column `p` plays.
 *
 * ⚠️ **Every opponent gets the whole board and nothing else**, which in this
 * game is everything there is: nothing is hidden, so there is nothing to keep
 * from it. What separates them is how much they look at.
 *
 * - The beginner takes a four of its own when it sees one, most of the time,
 *   and otherwise drops a disc near the middle. It never blocks yours on
 *   purpose.
 * - The amateur takes a win, blocks one, never plays the move that hands
 *   you one, and otherwise plays anything reasonable.
 * - The master searches seven moves ahead and chooses among the moves within
 *   a few points of its best, so it is strong and still not the same every
 *   game.
 * - The grandmaster searches as deep as `THINK_MS` allows and plays its best.
 */
export function chooseColumn(game: Position, p: Player, level: LevelId): number {
  const pos = copyOf(game);
  const columns = legal(pos);
  if (columns.length <= 1) return columns[0] ?? -1;

  const winning = columns.filter((column) => wins(pos, cellOf(column, pos.heights[column]), p));

  if (level === 'beginner') {
    // Missing one now and then is what makes it a beginner rather than a
    // slower amateur: a four it can see is a four it usually takes.
    if (winning.length > 0 && Math.random() < 0.75) return winning[0];

    // And a block now and then by accident, since it plays the middle.
    return lean(columns);
  }

  if (winning.length > 0) return winning[0];

  if (level === 'grandmaster') return deepest(pos, p, THINK_MS).column;

  const depth = level === 'master' ? MASTER_DEPTH : AMATEUR_DEPTH;
  const slack = level === 'master' ? MASTER_SLACK : AMATEUR_SLACK;
  // Deep enough that the budget never bites in practice. It is there so a
  // slow machine gets a slightly shallower master rather than a frozen page.
  const budget: Budget = { deadline: performance.now() + 900, nodes: 0 };
  const memo = level === 'master' ? tableFor() : null;

  let scored: { column: number; score: number }[];

  try {
    scored = scoreAll(pos, p, depth, budget, memo);
  } catch (error) {
    if (error !== OUT_OF_TIME) throw error;
    scored = scoreAll(pos, p, 3, { deadline: Infinity, nodes: 0 }, null);
  }

  const best = Math.max(...scored.map((s) => s.score));

  /*
   * ⚠️ **Slack only among moves that do not lose by force**, and none at all
   * once a forced result is on the board. A move a few points worse than the
   * best is a matter of taste. A move that loses in four is a blunder, and a
   * master that sometimes plays one is not a master with a style, it is a
   * weaker opponent pretending.
   */
  const decided = Math.abs(best) > WIN - 100;
  const good = scored.filter((s) => (decided ? s.score === best : s.score >= best - slack && s.score > -(WIN - 100)));
  const pool = good.length > 0 ? good : scored.filter((s) => s.score === best);

  return pool[Math.floor(Math.random() * pool.length)].column;
}

/* ---- The page ------------------------------------------------------------ */

/** Whose move it is, or how it ended. The page keys the line over the board
 *  and whether the columns take a press off it. */
export type State = 'you' | 'them' | 'won' | 'lost' | 'draw';

/**
 * The moments the board makes a sound. What each sounds like is in sounds.ts,
 * and whether it is heard is the page's switch.
 *
 * `drop` and `land` carry how far the disc fell, in squares, and its sign says
 * whose it was: positive for yours and negative for theirs, which land a shade
 * higher, the way two colours of plastic would. `spill` carries how many discs
 * are falling out.
 */
export type Cue = 'aim' | 'drop' | 'land' | 'full' | 'win' | 'lose' | 'draw' | 'spill';

export interface Options {
  /** Carries `data-state`, which is what the stylesheet keys the line over the
   *  board off, and the words for the columns. */
  root: HTMLElement;
  /** The board, which a landing disc shakes by a pixel or two. */
  board: HTMLElement;
  /** The layer the discs are dropped into, behind the plastic face. */
  discs: HTMLElement;
  /** The disc in hand above the board, yours or theirs. */
  hover: HTMLElement;
  /** Where a disc dropped now would land, and the column it would go down. */
  ghost: HTMLElement;
  glow: HTMLElement;
  /** The drawing the winning lines are put in, over the face. */
  lines: SVGSVGElement;
  /** Seven buttons, one per column, over the whole height of the board. */
  columns: HTMLButtonElement[];
  onState(state: State): void;
  /** A disc has gone in, for the sentence the page reads out. */
  onMove(p: Player, column: number): void;
  onCue(cue: Cue, level?: number): void;
}

export interface Controller {
  /** Empties the board, and whoever went second last time goes first. */
  restart(): void;
  /** A new opponent, and a new game in which you go first. */
  setLevel(id: LevelId): void;
  destroy(): void;
}

/**
 * How a disc falls, in squares and seconds.
 *
 * ⚠️ **Gravity, not a duration.** A disc dropped into an empty column falls
 * six squares and one dropped onto a nearly full one falls one, and a fixed
 * duration makes the long fall slow motion or the short one a teleport. So
 * the time is worked out from the distance, the way a real one falls: square
 * root, so a fall six times as long takes two and a half times as long.
 * `GRAVITY` is set so the longest fall on the board takes about four tenths of
 * a second, which is quick enough to play at and long enough to watch.
 *
 * `LIFT` is how far above the top row the disc in hand is held, and where
 * every fall starts.
 */
const GRAVITY = 80;
export const LIFT = 1.3;

/**
 * A fall, and the two bounces after it: the heights, in squares, and how long
 * each part takes. A disc bounces off the one below it a little, and then a
 * little again, and that is most of what makes it read as plastic rather than
 * as a counter being placed.
 *
 * Exported for sounds.ts, whose clicks land on the same three moments.
 */
export function fall(distance: number) {
  const drop = Math.sqrt((2 * distance) / GRAVITY);
  const high = Math.min(0.16, 0.035 * distance);
  const low = high * 0.22;
  const first = 2 * Math.sqrt((2 * high) / GRAVITY);
  const second = 2 * Math.sqrt((2 * low) / GRAVITY);

  return { drop, high, low, first, second, total: drop + first + second };
}

/**
 * The two halves of a parabola as cubic Béziers: speeding up on the way down
 * and slowing on the way up. These are exact for `t²`, which is what free fall
 * is, so the keyframes below are the fall itself rather than an easing that
 * looks roughly like one.
 */
const FALLING = 'cubic-bezier(0.333, 0, 0.667, 0.333)';
const RISING = 'cubic-bezier(0.333, 0.667, 0.667, 1)';

/**
 * The opponent's turn, and every number in it is for reading rather than for
 * thinking.
 *
 * ⚠️ **The choice is made the moment your disc lands, before theirs moves.**
 * It is made while yours is still bouncing, which the compositor draws on its
 * own, so the grandmaster's third of a second is spent under a picture that is
 * already moving rather than added to the wait. The weaker three decide in a
 * few milliseconds, and without a pause their reply would land on the same beat
 * as your disc and read as part of your move: `REPLY_MS` from your landing is
 * the beat between them, however long the thinking took. Then their disc
 * glides to its column - `GLIDE_MS` and a little more a column, the way a hand
 * moves - and sometimes stops over another column on the way. That stop is
 * theatre, and the write-up on the page says so.
 */
const REPLY_MS = 220;
const GLIDE_MS = 130;
const HOLD_MS = 100;

/** How often each opponent stops over another column first. The beginner
 *  rarely does, since hesitating is what knowing there is a choice looks like. */
const DOUBT: Record<LevelId, number> = { beginner: 0.15, amateur: 0.35, master: 0.45, grandmaster: 0.5 };

/** How long the board takes to empty, at most, before a new game can start:
 *  the highest disc falling out of the bottom. */
const SPILL_MS = 520;

export function mount(options: Options, initial: LevelId): Controller {
  const { root, board, discs: layer, hover, ghost, glow, lines, columns } = options;

  const labels = {
    column: root.dataset.labelColumn ?? 'Column {n}',
    full: root.dataset.labelFull ?? 'Column {n}, full',
  };

  const still = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- Model ------------------------------------------------------------- */

  let level: LevelId = initial;
  /** Who opens the next game. You open the first, and after that it
   *  alternates - see `restart`. */
  let starter: Player = 1;
  let pos = newPosition(starter);
  let state: State = 'you';

  /** One element per square, or null for an empty one. */
  let placed: (HTMLElement | null)[] = new Array(CELLS).fill(null);
  /** The square of the last disc dropped, which is the one a win goes
   *  through. */
  let last = -1;

  /** A disc of yours is still falling. Your turn is over the moment you
   *  press, but theirs does not start until yours has landed. */
  let busy = false;

  /** The column the disc in hand is over. */
  let aim = 3;
  /** Where their hand rests between turns, so their next disc sets off from
   *  where the last one went in rather than from the middle every time. */
  let rest = 3;

  /** A pointer is over the board, or the keyboard is in the columns: either
   *  is a reason to show a disc in hand on your turn. */
  let over = false;
  let keyed = false;

  /** A finger that is down, and the time the last one lifted - see
   *  `onPointerUp`. */
  let pressed: number | null = null;
  // Never, rather than 0: a click in the first 600ms after the page loaded
  // would otherwise be taken for the tail of a tap that never happened.
  let lifted = -Infinity;

  /**
   * Everything a turn is waiting on.
   *
   * One set rather than a slot per thing, unlike Battleship, because nothing
   * here overlaps: a turn is one disc at a time, so a new game can simply
   * cancel all of it. Every step of a turn is one of these, and nothing waits
   * on an animation's own finish, so cancelling them is all a new game has to
   * do to leave the last one nothing to come back to.
   */
  const timers = new Set<number>();

  function later(ms: number, run: () => void): void {
    const id = window.setTimeout(() => {
      timers.delete(id);
      run();
    }, ms);
    timers.add(id);
  }

  function stopAll(): void {
    for (const id of timers) window.clearTimeout(id);
    timers.clear();
  }

  /** One square in pixels, measured when a disc is dropped rather than kept,
   *  so a board that was resized mid-game drops the next disc the right
   *  distance. The keyframes are in pixels because they are the one place the
   *  stylesheet's `--cell` cannot reach. */
  const cellPx = () => layer.getBoundingClientRect().width / COLUMNS;

  /* ---- The disc in hand -------------------------------------------------- */

  /**
   * Where you are pointing, remembered on every move and drawn only on your
   * turn.
   *
   * ⚠️ **The disc in hand is one element for both players**, so a pointer
   * moving over the board while they think must not move it: it did, and
   * their disc followed your mouse about on the spot and then dropped into a
   * column nowhere near it - which is exactly what jerky looks like. The
   * column is kept, and the disc goes there when your turn comes.
   */
  function setAim(column: number): void {
    const moved = column !== aim;
    aim = column;

    if (state !== 'you' || busy) return;

    hover.style.setProperty('--aim', String(column));
    if (moved && (over || keyed)) options.onCue('aim');
    showGhost();
  }

  /** Yours, over the column you are pointing at, whenever it is your turn and
   *  you are pointing at the board. If it was out of sight it appears there,
   *  rather than sliding over from wherever their disc last was. */
  function showHand(): void {
    if (state !== 'you' || busy || !(over || keyed)) return;

    if (!hover.classList.contains('is-up') || hover.dataset.player !== '1') {
      hover.classList.add('is-still');
      hover.style.setProperty('--glide', '140ms');
      hover.style.setProperty('--aim', String(aim));
      void hover.offsetWidth;
      hover.classList.remove('is-still');
    }

    hover.dataset.player = '1';
    hover.classList.add('is-up');
    showGhost();
  }

  function hideHand(): void {
    hover.classList.remove('is-up');
    hideGhost();
  }

  function showGhost(): void {
    const row = pos.heights[aim];

    if (state !== 'you' || busy || !(over || keyed) || row >= ROWS) {
      hideGhost();
      return;
    }

    ghost.style.setProperty('--col', String(aim));
    ghost.style.setProperty('--row', String(row));
    glow.style.setProperty('--col', String(aim));
    ghost.classList.add('is-up');
    glow.classList.add('is-up');
  }

  function hideGhost(): void {
    ghost.classList.remove('is-up');
    glow.classList.remove('is-up');
  }

  /* ---- Painting ---------------------------------------------------------- */

  /** What each column says, and whether a press on it means anything. A full
   *  column stays focusable, so the arrow keys still walk all seven. */
  function paintColumns(): void {
    columns.forEach((button, column) => {
      const full = pos.heights[column] >= ROWS;
      button.setAttribute('aria-label', (full ? labels.full : labels.column).replace('{n}', String(column + 1)));
      button.setAttribute('aria-disabled', String(state !== 'you' || full));
    });
  }

  function setState(next: State): void {
    state = next;
    paintColumns();
    options.onState(state);
  }

  /** A landing, felt in the board: a pixel or two, more for a longer fall. */
  function thud(distance: number): void {
    if (still.matches) return;
    const depth = Math.min(2.4, 0.35 + distance * 0.32);
    board.animate([{ translate: '0 0' }, { translate: `0 ${depth}px` }, { translate: '0 0' }], {
      duration: 150,
      easing: 'ease-out',
    });
  }

  /* ---- A disc ------------------------------------------------------------ */

  /**
   * A disc of `p` into `column`, from the hand to wherever it lands, and
   * `landed` when it hits, with how long its bounces still take.
   *
   * ⚠️ **The model moves first and the picture follows.** The disc is on the
   * board the moment it leaves the hand - it is in `pos`, and the column says
   * one fewer free - and what is still happening is only the fall. So nothing
   * that reads the board has to wait for an animation, and a new game in the
   * middle of one costs an element rather than a state to unwind.
   */
  function drop(column: number, p: Player, landed: (bouncing: number) => void): void {
    const row = pos.heights[column];
    const cell = play(pos, column, p);
    last = cell;

    const disc = document.createElement('span');
    disc.className = 'four-disc';
    disc.dataset.player = String(p);
    disc.style.setProperty('--col', String(column));
    disc.style.setProperty('--row', String(row));
    // Under the ghost and the hand, which are the last two in the layer.
    layer.insertBefore(disc, ghost);
    placed[cell] = disc;

    paintColumns();
    options.onMove(p, column);

    const distance = LIFT + (ROWS - 1 - row);
    const sign = p === 1 ? 1 : -1;
    options.onCue('drop', sign * distance);

    if (still.matches) {
      options.onCue('land', sign * distance);
      later(0, () => landed(0));
      return;
    }

    const f = fall(distance);
    const px = cellPx();
    const at = (t: number) => t / f.total;

    disc.animate(
      [
        { translate: `0 ${-distance * px}px`, offset: 0, easing: FALLING },
        { translate: '0 0', offset: at(f.drop), easing: RISING },
        { translate: `0 ${-f.high * px}px`, offset: at(f.drop + f.first / 2), easing: FALLING },
        { translate: '0 0', offset: at(f.drop + f.first), easing: RISING },
        { translate: `0 ${-f.low * px}px`, offset: at(f.drop + f.first + f.second / 2), easing: FALLING },
        { translate: '0 0', offset: 1 },
      ],
      { duration: f.total * 1000 },
    );

    later(f.drop * 1000, () => {
      options.onCue('land', sign * distance);
      thud(distance);
      landed((f.total - f.drop) * 1000);
    });
  }

  /**
   * After a disc has landed: the game is over, or it is the other side's turn.
   *
   * An ending waits for the bounces, so the four light up on a board that has
   * stopped moving, and so does your turn: a disc of yours dropped onto one of
   * theirs still in the air would meet it on the way up. Theirs starts at once
   * - see `REPLY_MS`.
   */
  function settle(p: Player, bouncing: number): void {
    if (won(pos, last)) {
      later(bouncing, () => finish(p === 1 ? 'won' : 'lost'));
      return;
    }

    if (full(pos)) {
      later(bouncing, () => finish('draw'));
      return;
    }

    if (p === 1) theirTurn();
    else later(bouncing, yourTurn);
  }

  /* ---- The turns --------------------------------------------------------- */

  function choose(column: number): void {
    if (state !== 'you' || busy) return;

    if (pos.heights[column] >= ROWS) {
      options.onCue('full');
      return;
    }

    busy = true;
    hideHand();

    drop(column, 1, (bouncing) => {
      busy = false;
      settle(1, bouncing);
    });

    // Their move from the moment yours leaves your hand, unless it was the
    // last one: the line over the board should not say "your move" over a
    // disc that is already falling.
    if (!won(pos, last) && !full(pos)) setState('them');
  }

  function yourTurn(): void {
    setState('you');
    showHand();
  }

  function theirTurn(): void {
    setState('them');
    hideGhost();

    const started = performance.now();
    const column = chooseColumn(pos, 2, level);
    const thought = performance.now() - started;

    later(Math.max(40, REPLY_MS - thought), () => {
      // Their hand appears where it last let go, still, and then moves.
      hover.dataset.player = '2';
      hover.classList.add('is-still');
      hover.style.setProperty('--aim', String(rest));
      void hover.offsetWidth;
      hover.classList.remove('is-still');
      hover.classList.add('is-up');

      const stops = route(column);
      let wait = still.matches ? 0 : 100;

      for (const stop of stops) {
        const from = stops.indexOf(stop) === 0 ? rest : stops[stops.indexOf(stop) - 1];
        const time = still.matches ? 0 : GLIDE_MS + Math.abs(stop - from) * 35;

        later(wait, () => {
          hover.style.setProperty('--glide', `${time}ms`);
          hover.style.setProperty('--aim', String(stop));
        });

        wait += time + (still.matches ? 0 : HOLD_MS);
      }

      later(wait, () => {
        rest = column;
        hover.classList.remove('is-up');
        drop(column, 2, (bouncing) => settle(2, bouncing));
      });
    });
  }

  /** Where their hand goes on the way to `column`: sometimes over another
   *  column first, one near it, as if weighing the two. */
  function route(column: number): number[] {
    if (still.matches || Math.random() >= DOUBT[level]) return [column];

    const near = legal(pos).filter((c) => c !== column && Math.abs(c - column) <= 2);
    if (near.length === 0) return [column];

    return [near[Math.floor(Math.random() * near.length)], column];
  }

  const SVG_NS = 'http://www.w3.org/2000/svg';

  /** The centre of a square in the drawing's units: a hundred to a square,
   *  inside a frame of eighteen - see FourFace.astro. */
  const centre = (cell: number) => [18 + columnOf(cell) * 100 + 50, 18 + (ROWS - 1 - rowOf(cell)) * 100 + 50];

  function finish(result: 'won' | 'lost' | 'draw'): void {
    hideHand();
    setState(result);

    if (result !== 'draw') {
      const found = winningLines(pos, last);
      const lit = new Set(found.flat());

      placed.forEach((disc, cell) => disc?.classList.add(lit.has(cell) ? 'is-win' : 'is-dim'));

      for (const line of found) {
        const [x1, y1] = centre(line[0]);
        const [x2, y2] = centre(line[3]);
        const node = document.createElementNS(SVG_NS, 'line');
        node.setAttribute('x1', String(x1));
        node.setAttribute('y1', String(y1));
        node.setAttribute('x2', String(x2));
        node.setAttribute('y2', String(y2));
        // One unit long whatever its real length, so the stylesheet can draw
        // any line in with the same two dash values.
        node.setAttribute('pathLength', '1');
        node.setAttribute('class', 'four-line');
        lines.append(node);
      }
    }

    options.onCue(result === 'won' ? 'win' : result === 'lost' ? 'lose' : 'draw');
  }

  /**
   * The board emptying, the way a real one does: the slider under it pulled,
   * and every disc falling out of the bottom at once, the lowest first.
   *
   * Returns how long it takes, so a game the opponent opens waits for the
   * board to be clear.
   */
  function spill(): number {
    const leaving = placed.filter((disc): disc is HTMLElement => disc !== null);
    if (leaving.length === 0) return 0;

    options.onCue('spill', leaving.length);

    if (still.matches) {
      for (const disc of leaving) disc.remove();
      return 0;
    }

    const px = cellPx();
    let longest = 0;

    for (const disc of leaving) {
      for (const running of disc.getAnimations()) running.cancel();
      disc.classList.remove('is-win', 'is-dim');
      disc.classList.add('is-leaving');

      const row = Number(disc.style.getPropertyValue('--row'));
      const distance = row + 3;
      const time = Math.sqrt((2 * distance) / GRAVITY) * 1000;
      const delay = Math.random() * 60;
      longest = Math.max(longest, time + delay);

      disc.animate(
        [
          { translate: '0 0', opacity: 1, easing: FALLING },
          { translate: `0 ${distance * px}px`, opacity: 0 },
        ],
        { duration: time, delay, fill: 'forwards' },
      );

      // Not one of the turn's timers: a second new game in quick succession
      // must not leave these behind, and a hidden tab that never runs the
      // animation's end must not either.
      window.setTimeout(() => disc.remove(), time + delay + 50);
    }

    return Math.min(SPILL_MS, longest);
  }

  function restart(first: Player = (3 - starter) as Player): void {
    stopAll();
    busy = false;

    const clearing = spill();
    lines.replaceChildren();

    starter = first;
    pos = newPosition(starter);
    placed = new Array(CELLS).fill(null);
    last = -1;
    rest = 3;
    hideHand();

    if (starter === 1) {
      yourTurn();
      return;
    }

    setState('them');
    later(clearing, theirTurn);
  }

  /* ---- Input ------------------------------------------------------------- */

  const group = columns[0]?.parentElement ?? board;

  /** Which column a point is over, from the columns' own box, or null off the
   *  side of it. From coordinates rather than the target, because a finger
   *  that is captured reports the element it started on. */
  function columnAtPoint(x: number): number | null {
    const box = group.getBoundingClientRect();
    if (x < box.left || x > box.right) return null;
    return Math.min(COLUMNS - 1, Math.max(0, Math.floor(((x - box.left) / box.width) * COLUMNS)));
  }

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' && pressed !== event.pointerId) return;

    const column = columnAtPoint(event.clientX);
    if (column === null) return;

    over = true;
    setAim(column);
    showHand();
  };

  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    over = false;
    if (!keyed) hideHand();
  };

  /**
   * A finger shows the disc where it is pressed and drops it where it lifts,
   * so it can be slid along the top of the board to the right column first -
   * a finger covers the column it is on, and a tap is a guess.
   *
   * ⚠️ **Dropped on the lift, and the click after it is ignored.** A tap is
   * followed by a click from the browser, and without `lifted` the one disc
   * would be dropped twice: once by the finger and once by the click, into
   * whichever column was then under it.
   */
  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') return;

    pressed = event.pointerId;
    try {
      group.setPointerCapture(event.pointerId);
    } catch {
      /* A pointer already released cannot be captured; its lift still comes. */
    }

    const column = columnAtPoint(event.clientX);
    if (column === null) return;

    over = true;
    setAim(column);
    showHand();
  };

  const onPointerUp = (event: PointerEvent) => {
    if (pressed !== event.pointerId) return;

    pressed = null;
    lifted = performance.now();

    const column = columnAtPoint(event.clientX);
    over = false;

    if (column === null) {
      hideHand();
      return;
    }

    setAim(column);
    choose(column);
  };

  /** A finger that turned out to be scrolling the page, which `pan-y` hands
   *  to the browser: nothing is dropped. */
  const onPointerCancel = (event: PointerEvent) => {
    if (pressed !== event.pointerId) return;
    pressed = null;
    over = false;
    hideHand();
  };

  const onClick = (event: MouseEvent) => {
    if (performance.now() - lifted < 600) return;

    const button = (event.target as Element | null)?.closest<HTMLElement>('[data-col]');
    if (!button) return;

    const column = Number(button.dataset.col);
    setAim(column);
    choose(column);
  };

  /**
   * One column of the seven is in the tab order, and the arrow keys walk
   * them, for the reason the other boards here rove: seven tab stops across a
   * board is six too many. A digit drops straight into its column.
   */
  function focusColumn(column: number): void {
    columns.forEach((button, i) => button.setAttribute('tabindex', i === column ? '0' : '-1'));
    columns[column]?.focus();
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    const current = columns.indexOf(event.target as HTMLButtonElement);
    if (current < 0) return;

    const moves: Record<string, number> = {
      ArrowLeft: Math.max(0, current - 1),
      ArrowRight: Math.min(COLUMNS - 1, current + 1),
      Home: 0,
      End: COLUMNS - 1,
    };

    if (event.code in moves) {
      event.preventDefault();
      focusColumn(moves[event.code]);
      return;
    }

    const digit = /^(?:Digit|Numpad)([1-7])$/.exec(event.code);
    if (digit) {
      event.preventDefault();
      const column = Number(digit[1]) - 1;
      focusColumn(column);
      choose(column);
    }
  };

  /** The keyboard in the columns shows the disc in hand, a mouse click that
   *  happens to focus one does not - which is exactly what `:focus-visible`
   *  tells apart. */
  const onFocusIn = (event: FocusEvent) => {
    const button = event.target as HTMLElement;
    if (!button.matches?.(':focus-visible') || !button.dataset.col) return;

    keyed = true;
    setAim(Number(button.dataset.col));
    showHand();
  };

  const onFocusOut = (event: FocusEvent) => {
    if (group.contains(event.relatedTarget as Node | null)) return;
    keyed = false;
    if (!over) hideHand();
  };

  group.addEventListener('pointermove', onPointerMove);
  group.addEventListener('pointerleave', onPointerLeave);
  group.addEventListener('pointerdown', onPointerDown);
  group.addEventListener('pointerup', onPointerUp);
  group.addEventListener('pointercancel', onPointerCancel);
  group.addEventListener('click', onClick);
  group.addEventListener('keydown', onKeyDown);
  group.addEventListener('focusin', onFocusIn);
  group.addEventListener('focusout', onFocusOut);

  hover.style.setProperty('--aim', String(aim));
  paintColumns();
  options.onState(state);

  return {
    restart: () => restart(),

    setLevel(id) {
      level = id;
      restart(1);
    },

    destroy() {
      stopAll();
      group.removeEventListener('pointermove', onPointerMove);
      group.removeEventListener('pointerleave', onPointerLeave);
      group.removeEventListener('pointerdown', onPointerDown);
      group.removeEventListener('pointerup', onPointerUp);
      group.removeEventListener('pointercancel', onPointerCancel);
      group.removeEventListener('click', onClick);
      group.removeEventListener('keydown', onKeyDown);
      group.removeEventListener('focusin', onFocusIn);
      group.removeEventListener('focusout', onFocusOut);
    },
  };
}
