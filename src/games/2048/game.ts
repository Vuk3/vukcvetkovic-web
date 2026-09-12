/**
 * 2048.
 *
 * No renderer and no dependency: the board is sixteen elements and the tiles
 * are absolutely positioned divs that move by changing two custom properties.
 * The browser's compositor does the sliding, the numbers are real text at the
 * reader's own size, and the whole thing is a few kilobytes - which is the only
 * version of this that belongs on a site whose other pages ship no script file
 * at all.
 *
 * The part worth reading is `apply`. Everything smooth about this game comes
 * from one decision: **a tile keeps its DOM node for its whole life.** A move
 * changes `--x` and `--y` on nodes that already exist, so the transition on
 * them is a slide rather than a repaint, and nothing has to be reconciled. The
 * board is never re-rendered from the model.
 */

/** Four by four. The engine does not assume it anywhere else. */
const SIZE = 4;

/**
 * How long a slide takes, and the one place the number lives.
 *
 * The stylesheet reads it as `--g2048-slide`, which is set from here at mount,
 * so the transition, the delay on a spawning tile and the timer that cleans up
 * after a merge cannot drift apart. 140ms is short enough to chain moves
 * against and long enough to see where a tile came from.
 */
const SLIDE_MS = 125;

/** The value a new tile arrives with, and how often it is the bigger one. */
const SPAWN_HIGH = 4;
const SPAWN_HIGH_CHANCE = 0.1;

/** Reaching this is the win, once, after which the board keeps going. */
const WIN_VALUE = 2048;

/** Colour steps in the stylesheet, so the ramp tops out rather than running
 *  off the end on a very long game. */
const MAX_TIER = 12;

type Direction = 'up' | 'down' | 'left' | 'right';

interface Tile {
  /** Stable for the tile's whole life, which is what the node map keys on. */
  id: number;
  value: number;
  /** Column and row, 0 to SIZE - 1. */
  x: number;
  y: number;
}

/** A board that can be put back, for undo. */
interface Snapshot {
  tiles: Tile[];
  score: number;
}

/** What one move did, in the terms the renderer needs. */
interface Move {
  moved: boolean;
  gained: number;
  /** Ran into another tile and stopped existing. Slides, then is removed. */
  absorbed: Tile[];
  /** Doubled. Its node keeps its old number until the slide ends, then pops. */
  merged: Tile[];
  spawned: Tile | null;
  /** First time a 2048 appeared, which is the win. */
  won: boolean;
}

export interface Options {
  root: HTMLElement;
  board: HTMLElement;
  layer: HTMLElement;
  onScore(score: number, gained: number): void;
  onState(state: 'playing' | 'won' | 'over'): void;
  /** A sentence for the live region, built from the page's own labels. */
  onAnnounce(score: number, highest: number): void;
  /** Whether undo is available, so the page can disable the button. */
  onUndo(available: boolean): void;
}

export interface Controller {
  restart(): void;
  undo(): void;
  keepGoing(): void;
  destroy(): void;
}

export function mount(options: Options): Controller {
  const { root, board, layer } = options;

  /*
   * Reduced motion turns the slide off here rather than in the stylesheet.
   *
   * The blanket rule at the end of global.css collapses every animation, but
   * it cannot reach the timer below - and a board whose tiles arrive instantly
   * while merges resolve a slide later shows the wrong number on every merge.
   * One value, so the transition, the delay a spawning tile waits out and the
   * timer are always the same number.
   */
  const slideMs = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : SLIDE_MS;

  board.style.setProperty('--g2048-slide', `${slideMs}ms`);

  /* ---- Model ------------------------------------------------------------- */

  /** `grid[y][x]`, which is row then column, the way the board reads. */
  let grid: (Tile | null)[][] = [];
  let score = 0;
  let nextId = 1;

  /** One level, because two is a different game. Null when there is none. */
  let history: Snapshot | null = null;

  /** Set once a 2048 has been seen, so the win panel does not come back. */
  let claimed = false;

  const nodes = new Map<number, HTMLElement>();

  function tiles(): Tile[] {
    return grid.flat().filter((cell): cell is Tile => cell !== null);
  }

  function empties(): { x: number; y: number }[] {
    const free: { x: number; y: number }[] = [];

    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        if (!grid[y][x]) free.push({ x, y });
      }
    }

    return free;
  }

  function spawn(): Tile | null {
    const free = empties();
    if (free.length === 0) return null;

    const spot = free[Math.floor(Math.random() * free.length)];
    const tile: Tile = {
      id: nextId++,
      value: Math.random() < SPAWN_HIGH_CHANCE ? SPAWN_HIGH : 2,
      x: spot.x,
      y: spot.y,
    };

    grid[spot.y][spot.x] = tile;

    return tile;
  }

  /**
   * The cells of every line, in the order a move visits them.
   *
   * Building the traversal instead of writing four near-identical loops is
   * what keeps the merge rule below in one place: whichever way the board is
   * pushed, a line is a list of cells with the destination end first, and
   * `slide` never learns which direction it is working on.
   */
  function lines(direction: Direction): { x: number; y: number }[][] {
    const out: { x: number; y: number }[][] = [];

    for (let i = 0; i < SIZE; i++) {
      const line: { x: number; y: number }[] = [];

      for (let j = 0; j < SIZE; j++) {
        // j counts from the edge the tiles are pushed against.
        const near = direction === 'right' || direction === 'down' ? SIZE - 1 - j : j;

        if (direction === 'left' || direction === 'right') line.push({ x: near, y: i });
        else line.push({ x: i, y: near });
      }

      out.push(line);
    }

    return out;
  }

  function slide(direction: Direction): Move {
    const before = new Map(tiles().map((tile) => [tile.id, { x: tile.x, y: tile.y }]));

    const absorbed: Tile[] = [];
    const merged: Tile[] = [];
    /** Where an absorbed tile has to travel to, resolved after the write-back. */
    const destination = new Map<Tile, Tile>();

    let gained = 0;
    let won = false;

    for (const line of lines(direction)) {
      const present: Tile[] = [];
      for (const cell of line) {
        const tile = grid[cell.y][cell.x];
        if (tile) present.push(tile);
      }

      const placed: Tile[] = [];
      /** Merged during *this* move, and therefore closed to another merge. */
      const closed = new Set<Tile>();

      for (const tile of present) {
        const front = placed[placed.length - 1];

        if (front && front.value === tile.value && !closed.has(front)) {
          front.value *= 2;
          gained += front.value;

          closed.add(front);
          merged.push(front);
          absorbed.push(tile);
          destination.set(tile, front);

          if (front.value === WIN_VALUE && !claimed) won = true;
          continue;
        }

        placed.push(tile);
      }

      // Write the line back, packed against the destination edge.
      for (let i = 0; i < SIZE; i++) {
        const cell = line[i];
        const tile = placed[i] ?? null;

        grid[cell.y][cell.x] = tile;

        if (tile) {
          tile.x = cell.x;
          tile.y = cell.y;
        }
      }
    }

    /*
     * An absorbed tile is off the grid but still on screen: it has to finish
     * travelling to where it was going, or it would vanish mid-board. Resolved
     * here rather than at merge time because the survivor's final cell is only
     * known once its line has been written back.
     */
    for (const [tile, into] of destination) {
      tile.x = into.x;
      tile.y = into.y;
    }

    const moved =
      absorbed.length > 0 ||
      tiles().some((tile) => {
        const was = before.get(tile.id);
        return was !== undefined && (was.x !== tile.x || was.y !== tile.y);
      });

    return { moved, gained, absorbed, merged, spawned: moved ? spawn() : null, won };
  }

  /** No empty cell and no two neighbours alike, which is the end of the game. */
  function stuck(): boolean {
    if (empties().length > 0) return false;

    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const value = grid[y][x]?.value;
        if (value === undefined) continue;

        // Right and down only: every pair is then tested exactly once.
        if (grid[y][x + 1]?.value === value) return false;
        if (grid[y + 1]?.[x]?.value === value) return false;
      }
    }

    return true;
  }

  /* ---- Rendering ---------------------------------------------------------- */

  /** Position only. Changing these two is what makes a tile slide. */
  function place(node: HTMLElement, tile: Tile): void {
    node.style.setProperty('--x', String(tile.x));
    node.style.setProperty('--y', String(tile.y));
  }

  /**
   * Number, colour step and digit count.
   *
   * Split from `place` because a merged tile has to move as its old number and
   * only become the new one when it arrives - otherwise the board does its
   * arithmetic in mid-air and the merge reads as a glitch rather than as two
   * tiles meeting.
   */
  function label(node: HTMLElement, tile: Tile): void {
    const text = String(tile.value);

    node.dataset.tier = String(Math.min(MAX_TIER, Math.log2(tile.value)));
    node.dataset.digits = String(text.length);
    node.firstElementChild!.textContent = text;
  }

  function create(tile: Tile, fresh: boolean): HTMLElement {
    const node = document.createElement('div');
    // `g2048-tier` is what carries the colour ramp, and the thumbnail on the
    // games index wears it too.
    node.className = fresh ? 'g2048-tile g2048-tier is-new' : 'g2048-tile g2048-tier';
    node.append(document.createElement('span'));

    place(node, tile);
    label(node, tile);

    layer.append(node);
    nodes.set(tile.id, node);

    return node;
  }

  /*
   * The tail of a move - removing what was absorbed and turning the survivors
   * over to their new number - happens one slide later, so it is a timer.
   *
   * `flush` runs it early. A player who pushes the next direction 60ms into a
   * slide would otherwise be moving a board whose merges have not resolved,
   * and the fix is to finish the previous move rather than to lock the input
   * and drop theirs.
   */
  let settle: (() => void) | null = null;
  let timer = 0;

  /**
   * One move waiting for the board to land, and no more.
   *
   * A player pushing two directions inside 140ms used to get the first one cut
   * short: the second move called `flush`, the slide was abandoned wherever it
   * had got to, and the tiles jumped. Holding the second move until the first
   * settles means every move is seen, which is what a fast player is actually
   * asking for. One deep, because a queue any longer stops answering the
   * keyboard and starts replaying it.
   */
  let queued: Direction | null = null;

  function flush(): void {
    if (!settle) return;

    clearTimeout(timer);
    const run = settle;
    settle = null;
    run();

    const next = queued;
    queued = null;
    if (next) move(next);
  }

  /* `settle` is null here by construction: `move` returns early while a move is
     still travelling, and nothing else schedules. */
  function schedule(run: () => void): void {
    settle = run;
    timer = window.setTimeout(flush, slideMs);
  }

  function apply(move: Move): void {
    // 1. Everything still on the board moves, including the tiles that are
    //    about to be absorbed - they have to arrive before they disappear.
    for (const tile of tiles()) {
      const node = nodes.get(tile.id);
      if (node) place(node, tile);
    }

    for (const tile of move.absorbed) {
      const node = nodes.get(tile.id);
      if (!node) continue;

      // Under the survivor, so the tile that is about to pop is the one on
      // top when the two of them land on the same cell.
      node.classList.add('is-gone');
      place(node, tile);
    }

    // 2. The new tile exists immediately and holds at scale zero for exactly
    //    one slide, which the stylesheet does with a delay and a backwards
    //    fill. No second timer, and it cannot land early on a slow frame.
    if (move.spawned) create(move.spawned, true);

    // 3. And a slide later, the merge resolves.
    schedule(() => {
      for (const tile of move.absorbed) {
        nodes.get(tile.id)?.remove();
        nodes.delete(tile.id);
      }

      for (const tile of move.merged) {
        const node = nodes.get(tile.id);
        if (!node) continue;

        label(node, tile);

        // Restart the animation rather than relying on the class being absent:
        // the same tile can merge on two consecutive moves.
        node.classList.remove('is-merged');
        void node.offsetWidth;
        node.classList.add('is-merged');
      }
    });
  }

  /**
   * Rebuild every node from the model.
   *
   * `fresh` is the difference between the two callers: a new game should see
   * its two opening tiles arrive, and an undo should find the board exactly as
   * it left it rather than replaying it.
   */
  function repaint(fresh: boolean): void {
    // Before the flush, or a move buffered against the board being replaced
    // would play out on the new one.
    queued = null;
    flush();
    layer.replaceChildren();
    nodes.clear();

    for (const tile of tiles()) create(tile, fresh);
  }

  function highest(): number {
    return tiles().reduce((top, tile) => Math.max(top, tile.value), 0);
  }

  function report(): void {
    options.onScore(score, 0);
    options.onAnnounce(score, highest());
    options.onUndo(history !== null);
  }

  /* ---- The turn ------------------------------------------------------------ */

  function move(direction: Direction): void {
    // Both panels sit over the board and both want an answer before play
    // carries on, so neither is a state a direction should be accepted in.
    if (root.dataset.state === 'over' || root.dataset.state === 'won') return;

    // Still travelling. Hold this one rather than cutting the slide short.
    if (settle) {
      queued = direction;
      return;
    }

    const snapshot: Snapshot = {
      tiles: tiles().map((tile) => ({ ...tile })),
      score,
    };

    const result = slide(direction);
    if (!result.moved) return;

    history = snapshot;
    score += result.gained;

    apply(result);

    options.onScore(score, result.gained);
    options.onUndo(true);
    options.onAnnounce(score, highest());

    if (result.won) {
      claimed = true;
      options.onState('won');
      return;
    }

    if (stuck()) options.onState('over');
  }

  function restart(): void {
    grid = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => null));
    score = 0;
    history = null;
    claimed = false;

    spawn();
    spawn();

    repaint(true);
    options.onState('playing');
    report();
  }

  function undo(): void {
    if (!history) return;

    grid = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => null));
    for (const tile of history.tiles) grid[tile.y][tile.x] = { ...tile };

    score = history.score;
    history = null;

    repaint(false);
    options.onState('playing');
    report();
  }

  function keepGoing(): void {
    options.onState(stuck() ? 'over' : 'playing');
  }

  /* ---- Input ---------------------------------------------------------------
   *
   * One `move` call from three places, so the keyboard, a swipe and a drag
   * cannot end up meaning slightly different things.
   */

  const KEYS: Record<string, Direction> = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    KeyW: 'up',
    KeyS: 'down',
    KeyA: 'left',
    KeyD: 'right',
  };

  /**
   * Only while the board is on screen.
   *
   * The arrow keys are also how a reader scrolls, so taking them for the whole
   * document would break the page the moment the board is out of sight. An
   * observer is the honest test: the keys belong to the game exactly while the
   * game is the thing being looked at.
   */
  let onScreen = false;

  const watcher = new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting;
    },
    /*
     * A band across the middle of the viewport rather than a ratio of the
     * board. A ratio cannot be relied on: a board taller than the window never
     * reaches it, the callback settles on false, and the arrow keys go quiet
     * on exactly the screens where the board fills everything.
     */
    { rootMargin: '-15% 0px -15% 0px' },
  );
  watcher.observe(board);

  const onKeyDown = (event: KeyboardEvent) => {
    const direction = KEYS[event.code];
    if (!direction || !onScreen) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    // A focused button still answers to the arrow keys in some browsers, and
    // the reader is more likely to mean the control they are standing on.
    if (document.activeElement instanceof HTMLButtonElement) return;

    event.preventDefault();
    move(direction);
  };

  /** Below this a swipe is a tap, or a scroll the reader has changed their
   *  mind about. About a finger's width. */
  const SWIPE = 24;

  let from: { x: number; y: number } | null = null;

  const onPointerDown = (event: PointerEvent) => {
    if (event.target instanceof Element && event.target.closest('button')) return;
    from = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!from) return;

    const dx = event.clientX - from.x;
    const dy = event.clientY - from.y;
    from = null;

    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE) return;

    // The dominant axis, so a diagonal drag still means something definite.
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left');
    else move(dy > 0 ? 'down' : 'up');
  };

  window.addEventListener('keydown', onKeyDown);
  board.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', () => {
    from = null;
  });

  restart();

  return {
    restart,
    undo,
    keepGoing,

    destroy() {
      flush();
      watcher.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      board.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
    },
  };
}
