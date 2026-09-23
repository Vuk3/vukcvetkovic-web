/**
 * Memory.
 *
 * The fifth game here, and the one whose whole appeal is a single motion: a
 * card turning over. So the part worth reading is not a rule - the rules fit
 * in a sentence - but the division of labour around that turn. **The module
 * owns what a card is and the stylesheet owns how it turns.** A turn writes one
 * attribute, `data-face`, and a transition on `rotate` does the rest in the
 * compositor, the way a 2048 tile slides on two custom properties.
 *
 * The other decision worth knowing is in `reveal`: **a card does not know what
 * it is until it is turned.** The picture's `<use>` is empty on a face-down
 * card and only gets its `href` when the card goes up, so the board in the page
 * holds no answers. The deck lives in this closure and nowhere else.
 */

import { scatter } from '../burst';

/** The three parts of the deck. The first campaign boards deal from one each,
 *  which gives a small board a subject instead of a handful of strangers. */
export type Group = 'fruit' | 'nature' | 'things';

/**
 * The thirty pictures, in the order the sprite sheet draws them.
 *
 * The id is the join key twice over: `#mem-<id>` in MemorySprites.astro and
 * `pictures.<id>` in the dictionaries. So a picture added here with no drawing
 * behind it is an empty card, and one with no name is a type error in the page.
 *
 * ⚠️ **Thirty is the size of the largest board, not a round number.** Ten by
 * six is sixty cards and every pair on it has to be different, so a level
 * bigger than that needs a drawing added first - `play` deals as many pairs as
 * the pool has and no more, which on a board too big for it leaves the last
 * cells of the grid empty rather than dealing a picture three times.
 */
export const PICTURES = [
  { id: 'apple', group: 'fruit' },
  { id: 'cherries', group: 'fruit' },
  { id: 'lemon', group: 'fruit' },
  { id: 'strawberry', group: 'fruit' },
  { id: 'watermelon', group: 'fruit' },
  { id: 'pear', group: 'fruit' },
  { id: 'grapes', group: 'fruit' },
  { id: 'orange', group: 'fruit' },
  { id: 'banana', group: 'fruit' },
  { id: 'pineapple', group: 'fruit' },
  { id: 'sun', group: 'nature' },
  { id: 'moon', group: 'nature' },
  { id: 'cloud', group: 'nature' },
  { id: 'rainbow', group: 'nature' },
  { id: 'snowflake', group: 'nature' },
  { id: 'leaf', group: 'nature' },
  { id: 'tulip', group: 'nature' },
  { id: 'mushroom', group: 'nature' },
  { id: 'cactus', group: 'nature' },
  { id: 'tree', group: 'nature' },
  { id: 'rocket', group: 'things' },
  { id: 'balloon', group: 'things' },
  { id: 'anchor', group: 'things' },
  { id: 'key', group: 'things' },
  { id: 'crown', group: 'things' },
  { id: 'heart', group: 'things' },
  { id: 'star', group: 'things' },
  { id: 'gem', group: 'things' },
  { id: 'bell', group: 'things' },
  { id: 'umbrella', group: 'things' },
] as const satisfies readonly { id: string; group: Group }[];

export type PictureId = (typeof PICTURES)[number]['id'];

export interface Level {
  /** Across and down on a screen wider than it is tall. A phone held upright
   *  gets the same board turned a quarter - see `.mem-board` in
   *  styles/games/memory.css. */
  columns: number;
  rows: number;
  /** The most moves that still earn three stars, and two. See `LEVELS`. */
  three: number;
  two: number;
  /** Which part of the deck the pairs are drawn from. */
  deck: Group | 'all';
}

/**
 * The twelve boards, smallest first. Two pairs more each time up to twelve,
 * then three more, which keeps every step a board that looks bigger rather
 * than one that is merely a row longer.
 *
 * ⚠️ **The star thresholds are measured, not chosen.** A player with perfect
 * memory - who never turns a card they have already seen unless it completes a
 * pair - played 200,000 games on every board, and `three` is the number of
 * moves it needs nine games in ten. Its mean lands on the known result for
 * this game, about 1.61 moves a pair, which is how the simulation was checked.
 * `two` is half as many again, rounded up. So three stars says you played as
 * well as a flawless memory usually does, which is easy on four cards and
 * genuinely hard on sixty. Re-run the measurement before moving either number.
 */
export const LEVELS: readonly Level[] = [
  { columns: 2, rows: 2, three: 3, two: 5, deck: 'fruit' },
  { columns: 4, rows: 2, three: 7, two: 11, deck: 'nature' },
  { columns: 4, rows: 3, three: 10, two: 15, deck: 'things' },
  { columns: 4, rows: 4, three: 13, two: 20, deck: 'fruit' },
  { columns: 5, rows: 4, three: 17, two: 26, deck: 'nature' },
  { columns: 6, rows: 4, three: 20, two: 30, deck: 'all' },
  { columns: 6, rows: 5, three: 25, two: 38, deck: 'all' },
  { columns: 6, rows: 6, three: 30, two: 45, deck: 'all' },
  { columns: 7, rows: 6, three: 35, two: 53, deck: 'all' },
  { columns: 8, rows: 6, three: 39, two: 59, deck: 'all' },
  { columns: 9, rows: 6, three: 44, two: 66, deck: 'all' },
  { columns: 10, rows: 6, three: 49, two: 74, deck: 'all' },
];

export const pairsOf = (level: Level) => (level.columns * level.rows) / 2;

/** One, two or three. Clearing a board at all is worth one. */
export function starsFor(level: Level, moves: number): 1 | 2 | 3 {
  if (moves <= level.three) return 3;
  if (moves <= level.two) return 2;
  return 1;
}

/**
 * How long a card takes to turn, and the one place the number lives.
 *
 * The stylesheet reads it as `--mem-flip`, written from here at mount, so the
 * transition, the lift that rides on it and the timer that waits for a card to
 * land before judging it cannot drift apart. Long enough to read as a card with
 * weight turning over, short enough that two in a row never feel like waiting.
 */
const FLIP_MS = 460;

/**
 * How long a pair that does not match stays up after it lands.
 *
 * This is the one delay that is a rule rather than an animation - it is how
 * long you get to look - so it is *not* zeroed under reduced motion. It is also
 * never a wait: pressing the next card turns the pair back at once, which is
 * what a fast player does and what the original's table does too.
 */
const HOLD_MS = 820;

/** The deal: each card leaves the pile this much after the one before it,
 *  and a whole board is dealt inside `DEAL_MAX` however many cards it has. */
const DEAL_STEP = 30;
const DEAL_MAX = 680;

/** The cheer that runs through a cleared board, per step away from the last
 *  card turned, and how long one card's jump takes. */
const WAVE_MS = 42;
const CHEER_MS = 560;

export type State = 'ready' | 'playing' | 'won';

/** The moments the table makes a sound. What each sounds like is in sounds.ts. */
export type Cue = 'deal' | 'flip' | 'pair' | 'miss' | 'clear';

interface Card {
  picture: PictureId;
  up: boolean;
  matched: boolean;
}

export interface Options {
  /** Carries `data-state`, which the stylesheet keys the panel off, and the
   *  two custom properties the board is sized from. */
  root: HTMLElement;
  board: HTMLElement;
  /** The layer the burst is thrown into, over the whole table. */
  burst: HTMLElement;
  /** A name for every picture, in the reader's language. */
  names: Record<PictureId, string>;
  onMoves(moves: number): void;
  onTime(seconds: number): void;
  onState(state: State, moves: number, seconds: number): void;
  onAnnounce(text: string): void;
  /** The moments a sound belongs to, timed to what is on screen rather than
   *  to the press - a pair chimes when it lands, not when it is picked. The
   *  module plays nothing itself: whether there is sound is the page's call. */
  onCue(cue: Cue): void;
}

export interface Controller {
  /** Deal a fresh board of this size. Also how a board is restarted. */
  play(level: Level): void;
  destroy(): void;
}

function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

export function mount(options: Options): Controller {
  const { root, board, burst, names } = options;

  /*
   * Reduced motion takes the turn to zero here rather than in the stylesheet,
   * for the reason 2048 does it: the blanket rule at the end of global.css can
   * collapse a transition but cannot reach the timer that waits for one. A card
   * that lands instantly while the judgement waits half a second shows a pair
   * with nothing happening to it.
   */
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const flipMs = still ? 0 : FLIP_MS;

  root.style.setProperty('--mem-flip', `${flipMs}ms`);
  root.style.setProperty('--mem-wave', `${still ? 0 : WAVE_MS}ms`);

  /*
   * The words a screen reader needs, read off the board rather than written
   * here, the way the minefield does it. `{name}` is the picture.
   */
  const labels = {
    hidden: board.dataset.labelHidden ?? 'Face down',
    matched: board.dataset.labelMatched ?? '{name}, pair found',
    pair: board.dataset.msgPair ?? '{name}. A pair.',
    miss: board.dataset.msgMiss ?? '{name}. Not a pair.',
  };

  const fill = (template: string, name: string) => template.replace('{name}', name);

  /**
   * Held up rather than across, and read here only for the arrow keys.
   *
   * The stylesheet turns the board a quarter on a portrait screen with the same
   * query, and it does it with `grid-auto-flow: column` rather than by moving a
   * single node - so the grid a screen reader walks never changes shape, and
   * only which arrow means which way does.
   */
  const portrait = window.matchMedia('(orientation: portrait)');

  /* ---- Model ------------------------------------------------------------- */

  let level: Level = LEVELS[0];
  let cards: Card[] = [];
  let nodes: HTMLButtonElement[] = [];

  let state: State = 'ready';
  let moves = 0;
  let left = 0;

  /** Face up and not yet matched: none, one, or a pair that did not match and
   *  is waiting to go back. Never more than two. */
  let turned: number[] = [];

  /** The cell the keyboard is standing on, and the only one with `tabindex=0`. */
  let cursor = 0;

  /* ---- Timers ---------------------------------------------------------------
   *
   * Everything that waits goes through `later`, so dealing a new board cancels
   * every landing, shake and cheer still owed to the old one in one call. A
   * stray timer from the last board firing on a node of the next is the classic
   * way a game like this ends up with a card that turned itself over.
   */

  const timers = new Set<number>();

  function later(ms: number, run: () => void): number {
    const id = window.setTimeout(() => {
      timers.delete(id);
      run();
    }, ms);

    timers.add(id);
    return id;
  }

  function cancelAll(): void {
    for (const id of timers) window.clearTimeout(id);
    timers.clear();
  }

  /** The pair waiting to go back, so pressing a third card can call it in. */
  let hold: number | null = null;

  /* ---- The clock ----------------------------------------------------------- */

  let startedAt = 0;
  let elapsed = 0;
  let ticker: number | null = null;

  /* Read off the wall clock rather than counted up, for the reason given in
     the minefield: an interval drifts, and drifts most in a sleepy tab. */
  function tick(): void {
    const now = Math.floor((Date.now() - startedAt) / 1000);
    if (now === elapsed) return;

    elapsed = now;
    options.onTime(elapsed);
  }

  function startClock(): void {
    startedAt = Date.now();
    elapsed = 0;
    ticker = window.setInterval(tick, 200);
  }

  function stopClock(): void {
    if (ticker !== null) window.clearInterval(ticker);
    ticker = null;
  }

  /*
   * The clock stops while the tab is in the background and picks up where it
   * was. Memory is the one game here you might walk away from mid-board to
   * check something, and the minutes spent in another tab are not the
   * player's. Moving the start forward by the time away is the whole of it:
   * the reading stays a subtraction from the wall clock.
   */
  let hiddenAt = 0;

  const onVisibility = () => {
    if (ticker === null) return;

    if (document.hidden) {
      hiddenAt = Date.now();
      return;
    }

    if (hiddenAt > 0) startedAt += Date.now() - hiddenAt;
    hiddenAt = 0;
  };

  /* ---- Painting ------------------------------------------------------------ */

  /**
   * Up, and what is on it.
   *
   * The `href` is written here and only here, which is what keeps the answers
   * out of the page. It is written once per card and never cleared: a card you
   * have seen is a card you know, and rewriting a `<use>` tears down and
   * rebuilds its shadow tree for nothing - the lesson the battleship preview
   * learnt at eight rebuilds a frame.
   */
  function reveal(i: number): void {
    const node = nodes[i];
    const picture = node.querySelector('.mem-front use');

    if (picture && !picture.hasAttribute('href')) {
      picture.setAttribute('href', `#mem-${cards[i].picture}`);
    }

    node.classList.remove('is-miss');
    node.dataset.face = 'up';
    node.setAttribute('aria-label', names[cards[i].picture]);
  }

  function conceal(i: number): void {
    const node = nodes[i];

    node.classList.remove('is-miss');
    node.dataset.face = 'down';
    node.setAttribute('aria-label', labels.hidden);
  }

  function seal(i: number): void {
    const node = nodes[i];

    node.classList.remove('is-miss');
    node.dataset.face = 'matched';
    node.setAttribute('aria-label', fill(labels.matched, names[cards[i].picture]));
  }

  /** How much of the board is found, for the gold line along the top of the
   *  table. A fraction rather than a count, so the stylesheet can scale by it
   *  without knowing how many pairs a board has. */
  function progress(): void {
    const total = cards.length / 2;
    root.style.setProperty('--mem-done', total === 0 ? '0' : ((total - left) / total).toFixed(4));
  }

  /* ---- The turn ------------------------------------------------------------ */

  /** A pair that did not match goes back over, now. */
  function settle(): void {
    if (hold !== null) {
      window.clearTimeout(hold);
      timers.delete(hold);
      hold = null;
    }

    if (turned.length > 0) options.onCue('flip');

    for (const i of turned) {
      cards[i].up = false;
      conceal(i);
    }

    turned = [];
  }

  /**
   * One card, and everything that follows from it.
   *
   * ⚠️ **The model is settled the instant the second card is pressed; only the
   * paint waits for it to land.** A match is known, counted and taken off the
   * board at once, and `seal` - the pop, the ring - is what waits `flipMs`. So
   * a third press that arrives while the pair is still in the air has nothing
   * half-decided to trip over: it calls in a miss through `settle`, and a match
   * has already been banked.
   */
  function turn(i: number): void {
    if (state === 'won') return;

    const card = cards[i];
    if (!card || card.up || card.matched) return;

    if (turned.length === 2) settle();

    if (state === 'ready') {
      state = 'playing';
      startClock();
      options.onState(state, 0, 0);
    }

    card.up = true;
    turned.push(i);
    reveal(i);
    options.onCue('flip');

    const name = names[card.picture];

    if (turned.length === 1) {
      options.onAnnounce(name);
      return;
    }

    moves++;
    options.onMoves(moves);

    const [a, b] = turned;

    if (cards[a].picture === cards[b].picture) {
      cards[a].matched = true;
      cards[b].matched = true;
      turned = [];
      left--;

      later(flipMs, () => {
        seal(a);
        seal(b);
        progress();
        options.onCue('pair');
      });

      options.onAnnounce(fill(labels.pair, name));

      if (left === 0) finish(b);
      return;
    }

    options.onAnnounce(fill(labels.miss, name));

    /*
     * The shake lands with the card, and only if this is still the turn on the
     * table when it does.
     *
     * ⚠️ **Checked against the turn itself, not against the cards being up.**
     * A fast player calls a miss back with the next press before it lands, and
     * can have one of the same two cards up again in a new turn by the time
     * this fires - so "is the card up" said yes, the wrong card shook, and a
     * pair found a moment later wore the red ring instead of the gold one.
     * `settle` replaces the array, so the reference is the turn's identity.
     */
    const pair = turned;

    later(flipMs, () => {
      if (turned !== pair) return;

      for (const j of pair) nodes[j].classList.add('is-miss');
      options.onCue('miss');
    });

    hold = later(flipMs + HOLD_MS, settle);
  }

  /**
   * The last pair, and the only moment the board moves on its own.
   *
   * The clock stops at the press rather than when the cheer ends, because the
   * time is yours and the cheer is not. The panel waits for the wave to have
   * run through the board, which is the whole reason the wave exists - a panel
   * that lands on the same frame as the last pair covers the one moment worth
   * seeing.
   */
  function finish(last: number): void {
    state = 'won';
    stopClock();

    const { columns } = level;
    const lx = last % columns;
    const ly = Math.floor(last / columns);

    // Distance from the last card, in cards. Euclidean rather than rings, so
    // the wave reads as round on an oblong board, and the same on a turned one.
    let furthest = 0;
    nodes.forEach((node, i) => {
      const d = Math.round(Math.hypot((i % columns) - lx, Math.floor(i / columns) - ly));
      furthest = Math.max(furthest, d);
      node.style.setProperty('--d', String(d));
    });

    const cheerAt = flipMs + (still ? 0 : 160);

    later(cheerAt, () => {
      for (const node of nodes) node.classList.add('is-cheer');
      options.onCue('clear');
    });

    const doneAt = still ? cheerAt + 200 : cheerAt + furthest * WAVE_MS + CHEER_MS * 0.7;

    later(doneAt, () => {
      scatter(burst, COLOURS);
      options.onState('won', moves, elapsed);
    });
  }

  /** The deck's own colours for the burst over a cleared table. */
  const COLOURS = ['red', 'orange', 'yellow', 'lime', 'teal', 'sky', 'violet', 'pink'].map(
    (name) => `var(--mem-${name})`,
  );

  /* ---- Dealing ------------------------------------------------------------- */

  /*
   * One card, built once and cloned for the rest of the deck.
   *
   * Two faces inside a turning layer, inside a body that jumps and shakes,
   * inside the button that is dealt and lifts. Three layers because three
   * things animate a card and an element can only run one of them at a time -
   * the stylesheet has the story of what happened when two shared one. The
   * front's `<use>` has no `href` yet, deliberately.
   */
  const prototype = document.createElement('button');
  prototype.type = 'button';
  prototype.className = 'mem-card';
  prototype.setAttribute('role', 'gridcell');
  prototype.tabIndex = -1;
  prototype.innerHTML =
    '<span class="mem-card-body"><span class="mem-card-inner">' +
    '<span class="mem-face mem-back"><svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><use href="#mem-back"></use></svg></span>' +
    '<span class="mem-face mem-front"><svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><use></use></svg></span>' +
    '</span></span>';

  /**
   * ⚠️ **The rows are `role="row"` wrappers with `display: contents`**, the
   * arrangement the minefield explains: a grid needs rows to give a reader a
   * position, and a row that was also a layout box would break the columns.
   *
   * Each card knows how far it sits from the middle of the table, in cards,
   * which is all the deal needs: it starts every card stacked on that point
   * and lets the translate resolve against the card's own size.
   */
  function build(): void {
    const { columns, rows } = level;

    root.style.setProperty('--mem-cols', String(columns));
    root.style.setProperty('--mem-rows', String(rows));
    board.setAttribute('aria-rowcount', String(rows));
    board.setAttribute('aria-colcount', String(columns));
    // Zero under reduced motion, and it has to be done here: the blanket rule
    // in global.css shortens a duration but leaves a delay alone, so a still
    // deal would otherwise be sixty cards blinking into place one by one.
    const step = still ? 0 : Math.min(DEAL_STEP, DEAL_MAX / cards.length);
    board.style.setProperty('--mem-deal-step', `${step}ms`);

    const fragment = document.createDocumentFragment();
    nodes = [];

    for (let y = 0; y < rows; y++) {
      const row = document.createElement('div');
      row.className = 'mem-row';
      row.setAttribute('role', 'row');
      row.setAttribute('aria-rowindex', String(y + 1));

      for (let x = 0; x < columns; x++) {
        const i = y * columns + x;
        const node = prototype.cloneNode(true) as HTMLButtonElement;

        node.dataset.i = String(i);
        node.setAttribute('aria-colindex', String(x + 1));
        node.setAttribute('aria-label', labels.hidden);
        node.style.setProperty('--i', String(i));
        node.style.setProperty('--gx', ((columns - 1) / 2 - x).toFixed(2));
        node.style.setProperty('--gy', ((rows - 1) / 2 - y).toFixed(2));
        node.style.setProperty('--gr', `${Math.round((Math.random() - 0.5) * 24)}deg`);

        // A board the deck is too small for keeps its shape and loses its
        // last cells, rather than dealing a picture a third time.
        if (!cards[i]) node.hidden = true;

        row.append(node);
        nodes.push(node);
      }

      fragment.append(row);
    }

    board.replaceChildren(fragment);
    nodes[cursor]?.setAttribute('tabindex', '0');
  }

  function play(next: Level): void {
    cancelAll();
    stopClock();
    hold = null;
    burst.replaceChildren();

    level = next;

    const pool = PICTURES.filter((p) => next.deck === 'all' || p.group === next.deck).map((p) => p.id);
    const chosen = shuffle(pool).slice(0, pairsOf(next));

    cards = shuffle([...chosen, ...chosen]).map((picture) => ({ picture, up: false, matched: false }));

    state = 'ready';
    moves = 0;
    left = chosen.length;
    turned = [];
    elapsed = 0;
    cursor = 0;

    build();
    progress();

    options.onState(state, 0, 0);
    options.onMoves(0);
    options.onTime(0);
    options.onCue('deal');
  }

  /* ---- Input --------------------------------------------------------------- */

  function cardAt(target: EventTarget | null): number | null {
    if (!(target instanceof Element)) return null;

    const node = target.closest<HTMLElement>('.mem-card');
    if (!node?.dataset.i) return null;

    return Number(node.dataset.i);
  }

  function focus(next: number): void {
    if (next < 0 || next >= nodes.length || nodes[next].hidden) return;

    nodes[cursor]?.setAttribute('tabindex', '-1');
    cursor = next;
    nodes[cursor].setAttribute('tabindex', '0');
    nodes[cursor].focus();
  }

  const onClick = (event: MouseEvent) => {
    const i = cardAt(event.target);
    if (i === null) return;

    // A click moves the keyboard's place too, so Tab back into the board
    // lands where the reader last was rather than in the top-left corner.
    if (i !== cursor) {
      nodes[cursor]?.setAttribute('tabindex', '-1');
      cursor = i;
      nodes[cursor].setAttribute('tabindex', '0');
    }

    turn(i);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const i = cardAt(event.target);
    if (i === null || event.metaKey || event.ctrlKey || event.altKey) return;

    const { columns, rows } = level;
    const x = i % columns;
    const y = Math.floor(i / columns);

    const back = x > 0 ? i - 1 : i;
    const on = x < columns - 1 ? i + 1 : i;
    const above = y > 0 ? i - columns : i;
    const below = y < rows - 1 ? i + columns : i;

    // Turned a quarter, a row of the markup is a column on screen, so the
    // arrows swap axes to keep meaning the way they point.
    const tall = portrait.matches;

    const steps: Record<string, number> = {
      ArrowLeft: tall ? above : back,
      ArrowRight: tall ? below : on,
      ArrowUp: tall ? back : above,
      ArrowDown: tall ? on : below,
      Home: tall ? x : y * columns,
      End: tall ? (rows - 1) * columns + x : y * columns + columns - 1,
    };

    if (event.code in steps) {
      event.preventDefault();
      focus(steps[event.code]);
    }
  };

  board.addEventListener('click', onClick);
  board.addEventListener('keydown', onKeyDown);
  document.addEventListener('visibilitychange', onVisibility);

  return {
    play,

    destroy() {
      cancelAll();
      stopClock();
      board.removeEventListener('click', onClick);
      board.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
