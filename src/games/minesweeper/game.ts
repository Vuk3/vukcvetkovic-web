/**
 * Minesweeper.
 *
 * The second game here, and deliberately the opposite of the first. 2048 is
 * all motion: a tile keeps its element and the browser composites the slide.
 * This one has no loop, no `requestAnimationFrame` and nothing in flight - a
 * cell changes state or it does not - so what it costs is a class on a button
 * and what it has to get right is the logic and the keyboard.
 *
 * The part worth reading is `plant`. **Mines are laid after the first click,
 * not before**, around the cell that was clicked and its eight neighbours. So
 * the opening move can never lose and it always breaks into open ground, which
 * is what turns the first ten seconds from a coin toss into a game.
 *
 * The board is a real `role="grid"` - see the note on `build`. That is the
 * reason this game is here: 2048's board had to be hidden from a screen reader
 * and narrated through a live region, because sixteen cells that rewrite
 * themselves on every keypress are unreadable. A minefield is the opposite. It
 * is a static table a reader walks at their own pace, which is exactly what a
 * grid is for.
 */

export type LevelId = 'beginner' | 'intermediate' | 'expert';

export interface Level {
  columns: number;
  rows: number;
  mines: number;
}

/**
 * The three boards, at the sizes the original shipped with.
 *
 * They are not tuned and should not be: the difficulty of this game is common
 * knowledge, and a "beginner" board that is not 9 by 9 with 10 mines is a
 * different game wearing the name. Expert is 30 wide, which no phone can show
 * at a usable cell size - the board scrolls sideways rather than shrinking,
 * and the stylesheet explains why that is the right way round.
 */
export const LEVELS: Record<LevelId, Level> = {
  beginner: { columns: 9, rows: 9, mines: 10 },
  intermediate: { columns: 16, rows: 16, mines: 40 },
  expert: { columns: 30, rows: 16, mines: 99 },
};

export type State = 'ready' | 'playing' | 'won' | 'lost';

interface Cell {
  mine: boolean;
  /** Mines among the eight neighbours, 0 to 8. Computed once, after planting. */
  near: number;
  revealed: boolean;
  flagged: boolean;
}

/**
 * How long a cell waits before it opens, per step away from the click.
 *
 * A flood fill can open three hundred cells at once, and opening them on the
 * same frame reads as the board flickering. Delaying each by its distance
 * turns it into something spreading outward from where the reader pressed,
 * which is both prettier and more honest about what happened.
 */
const WAVE_MS = 14;

/** Past this the wave stops growing, so a full-board fill still lands inside
 *  a quarter of a second instead of crawling to the far corner. */
const WAVE_MAX = 16;

/** Held this long, a touch means a flag. Long enough not to fire on a tap,
 *  short enough that nobody wonders whether it registered. */
const HOLD_MS = 420;

/** A touch that travels further than this is a scroll, not a press. The board
 *  scrolls sideways on a phone, so this is load bearing rather than polish. */
const DRIFT = 10;

export interface Options {
  /** Carries `data-state`, which is what the stylesheet keys the panels off. */
  root: HTMLElement;
  board: HTMLElement;
  onState(state: State, seconds: number): void;
  /** Mines laid, less flags planted. Goes negative, on purpose: over-flagging
   *  is a mistake the player should be able to see. */
  onMines(remaining: number): void;
  onTime(seconds: number): void;
}

export interface Controller {
  restart(): void;
  level(): LevelId;
  setLevel(id: LevelId): void;
  /** Touch flagging, for the button in the bar. Returns nothing: the page owns
   *  the button's pressed state, this owns what a tap means. */
  setFlagging(on: boolean): void;
  destroy(): void;
}

export function mount(options: Options, initial: LevelId): Controller {
  const { root, board } = options;

  /*
   * The five words a screen reader needs, read off the board rather than
   * written here.
   *
   * Position is not among them: the grid roles below give a reader the row and
   * the column for free, in their own language, which is a better answer than
   * any sentence this module could build. So a cell only has to say what is in
   * it, and a revealed number does not even need that - the digit is real text.
   */
  const labels = {
    hidden: board.dataset.labelHidden ?? 'Hidden',
    flagged: board.dataset.labelFlagged ?? 'Flagged',
    mine: board.dataset.labelMine ?? 'Mine',
    empty: board.dataset.labelEmpty ?? 'Empty',
    wrong: board.dataset.labelWrong ?? 'Wrong flag',
  };

  /* ---- Model ------------------------------------------------------------- */

  let level: LevelId = initial;
  let size = LEVELS[level];

  let cells: Cell[] = [];
  let nodes: HTMLButtonElement[] = [];

  let state: State = 'ready';
  let flags = 0;
  let opened = 0;
  let flagging = false;

  /** The cell the keyboard is standing on, and the only one with `tabindex=0`. */
  let cursor = 0;

  const index = (x: number, y: number) => y * size.columns + x;
  const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < size.columns && y < size.rows;

  /** The eight around a cell, minus whatever falls off the edge. */
  function neighbours(x: number, y: number): number[] {
    const out: number[] = [];

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        if (inside(x + dx, y + dy)) out.push(index(x + dx, y + dy));
      }
    }

    return out;
  }

  /* ---- Laying the mines ---------------------------------------------------- */

  /**
   * Mines, everywhere except the opening click and the ring around it.
   *
   * ⚠️ **This runs on the first reveal, not on restart**, and that ordering is
   * the whole design. A board laid before the first click has to either let the
   * opening move lose - which is a coin toss, not a game - or re-deal until it
   * does not, which biases the field in ways that are hard to reason about.
   * Excluding a 3 by 3 block also guarantees the first cell has no mine beside
   * it, so it opens into a region rather than into a lone number.
   *
   * A Fisher-Yates over the allowed cells rather than picking until a free one
   * turns up. The dense end of this game is 99 mines in 480 cells, where
   * rejection sampling spends most of its tries landing on an occupied cell.
   */
  function plant(safeX: number, safeY: number): void {
    const forbidden = new Set([index(safeX, safeY), ...neighbours(safeX, safeY)]);

    const allowed: number[] = [];
    for (let i = 0; i < cells.length; i++) if (!forbidden.has(i)) allowed.push(i);

    for (let i = allowed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allowed[i], allowed[j]] = [allowed[j], allowed[i]];
    }

    // `min` rather than a bare slice: a level asking for more mines than there
    // are free cells would otherwise lay fewer than it claimed and the counter
    // would never reach zero.
    for (const i of allowed.slice(0, Math.min(size.mines, allowed.length))) {
      cells[i].mine = true;
    }

    for (let y = 0; y < size.rows; y++) {
      for (let x = 0; x < size.columns; x++) {
        const cell = cells[index(x, y)];
        if (cell.mine) continue;
        cell.near = neighbours(x, y).filter((i) => cells[i].mine).length;
      }
    }
  }

  /* ---- The clock ----------------------------------------------------------- */

  let startedAt = 0;
  let elapsed = 0;
  let ticker: number | null = null;

  /*
   * Read off the wall clock, not counted up.
   *
   * A counter incremented on an interval drifts, and drifts most on exactly the
   * device where a long expert game is being played with the tab half asleep.
   * The interval here only decides how promptly the display notices, so it runs
   * faster than the thing it shows and emits nothing when the second has not
   * turned over.
   */
  function tick(): void {
    const now = Math.floor((Date.now() - startedAt) / 1000);
    if (now === elapsed) return;

    elapsed = now;
    options.onTime(elapsed);
  }

  function startClock(): void {
    startedAt = Date.now();
    elapsed = 0;
    options.onTime(0);
    ticker = window.setInterval(tick, 200);
  }

  function stopClock(): void {
    if (ticker === null) return;
    window.clearInterval(ticker);
    ticker = null;
  }

  /* ---- Painting ------------------------------------------------------------ */

  /**
   * One cell's appearance, from its state and nothing else.
   *
   * Every path through the game ends here rather than reaching for a class of
   * its own, so a cell cannot end up looking revealed while the model still has
   * it hidden. `wave` is the one thing passed in: it is not state, it is how
   * far this cell was from the press that opened it.
   */
  function paint(i: number, wave = 0): void {
    const cell = cells[i];
    const node = nodes[i];
    const lost = state === 'lost';

    node.className = 'ms-cell';
    node.textContent = '';
    node.removeAttribute('data-near');
    node.style.setProperty('--d', String(wave));

    if (cell.flagged && !cell.revealed) {
      // A flag on a clear cell is only wrong once the game is over. Until then
      // it is a guess, and marking it would be the game answering itself.
      node.classList.add(lost && !cell.mine ? 'is-wrong' : 'is-flag');
      node.setAttribute('aria-label', lost && !cell.mine ? labels.wrong : labels.flagged);
      return;
    }

    if (cell.mine && (cell.revealed || lost)) {
      node.classList.add('is-mine');
      if (cell.revealed) node.classList.add('is-hit');
      node.setAttribute('aria-label', labels.mine);
      return;
    }

    if (!cell.revealed) {
      node.classList.add('is-hidden');
      node.setAttribute('aria-label', labels.hidden);
      return;
    }

    node.classList.add('is-open');

    if (cell.near === 0) {
      node.setAttribute('aria-label', labels.empty);
      return;
    }

    // The digit is the label. A number cell announces itself as text, which is
    // shorter than any sentence and is what a sighted player reads too.
    node.removeAttribute('aria-label');
    node.dataset.near = String(cell.near);
    node.textContent = String(cell.near);
  }

  function repaint(): void {
    for (let i = 0; i < cells.length; i++) paint(i);
  }

  /* ---- The turn ------------------------------------------------------------ */

  /**
   * The end of a game, and the only place the board changes without a press.
   *
   * ⚠️ **Only the cells that are still closed are repainted.** Repainting
   * everything looks like the obvious thing and is wrong: `paint` rewrites the
   * class list, and rewriting `is-open` restarts the animation on it, so every
   * cell already on the board would flash at the moment the game ended. Closed
   * cells are exactly the ones whose appearance depends on the outcome.
   */
  function finish(next: 'won' | 'lost'): void {
    state = next;
    stopClock();

    // Winning accounts for every mine by definition, so the ones left are
    // flagged rather than left looking untouched. It is the classic ending and
    // it also settles the counter at zero.
    if (next === 'won') {
      for (const cell of cells) {
        if (!cell.mine || cell.flagged) continue;
        cell.flagged = true;
        flags++;
      }

      options.onMines(size.mines - flags);
    }

    let wave = 0;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].revealed) continue;
      paint(i, Math.min(wave++, WAVE_MAX));
    }

    options.onState(state, elapsed);
  }

  /**
   * Open a cell, and everything that follows from it.
   *
   * The fill is breadth first rather than recursive, and the queue is the
   * reason: a full-board fill on expert is 480 deep, which is a stack a phone
   * browser is entitled to refuse. Breadth first also hands the wave its
   * distance for free - the ring a cell was found on *is* how far it is from
   * the press.
   */
  function reveal(x: number, y: number): void {
    if (state === 'won' || state === 'lost') return;

    const start = index(x, y);
    const cell = cells[start];
    if (cell.revealed || cell.flagged) return;

    if (state === 'ready') {
      plant(x, y);
      state = 'playing';
      startClock();
      options.onState(state, 0);
    }

    if (cell.mine) {
      cell.revealed = true;
      // Painted here rather than left to `finish`, which skips revealed cells.
      // The one that was pressed should show at once and the rest sweep in
      // behind it, which is the wrong order if it waits its turn in the list.
      paint(start, 0);
      finish('lost');
      return;
    }

    let ring = [start];
    let wave = 0;

    while (ring.length > 0) {
      const next: number[] = [];

      for (const i of ring) {
        const here = cells[i];
        if (here.revealed || here.flagged) continue;

        here.revealed = true;
        opened++;
        paint(i, Math.min(wave, WAVE_MAX));

        // Only a blank opens its neighbours. A number is the edge of the
        // region and the reader is meant to stop there and think.
        if (here.near > 0) continue;
        next.push(...neighbours(i % size.columns, Math.floor(i / size.columns)));
      }

      ring = next;
      wave++;
    }

    if (opened === cells.length - size.mines) finish('won');
  }

  /**
   * @param only  Plant a flag, never take one back.
   *
   * ⚠️ **A long press passes this, and that is not a detail.** A hold that
   * toggles takes the flag off again whenever the finger comes down on one
   * that is already there, and on a phone that is most of the time - the
   * gesture is slow enough that it is easy to repeat by accident. Planting
   * only is also idempotent, so the two events a long press can produce
   * cannot cancel each other out however the browser orders them.
   *
   * Taking a flag back on a phone is flag mode, which is one button and a tap.
   */
  function flag(x: number, y: number, only = false): void {
    if (state === 'won' || state === 'lost') return;

    const cell = cells[index(x, y)];
    if (cell.revealed) return;
    if (only && cell.flagged) return;

    cell.flagged = !cell.flagged;
    flags += cell.flagged ? 1 : -1;

    paint(index(x, y));
    options.onMines(size.mines - flags);
  }

  /**
   * A press on a number that already has its flags: open the rest of the ring.
   *
   * Three ways in, because the classic gesture and the discoverable one are not
   * the same. The original wants both mouse buttons at once and most players
   * never find it, so the middle button does it here, and so does an ordinary
   * click on a revealed number - which has nothing else a click could mean.
   * This is where the speed in the game is: the alternative is opening eight
   * cells one at a time.
   */
  function chord(x: number, y: number): void {
    const cell = cells[index(x, y)];
    if (!cell.revealed || cell.near === 0) return;

    const around = neighbours(x, y);
    if (around.filter((i) => cells[i].flagged).length !== cell.near) return;

    for (const i of around) {
      if (cells[i].flagged || cells[i].revealed) continue;
      reveal(i % size.columns, Math.floor(i / size.columns));
      if (state === 'lost') return;
    }
  }

  /** What a press means, and the one place that decides it, so a click, a tap,
   *  the middle button and the Enter key cannot drift apart. */
  type Press = 'open' | 'flag' | 'plant' | 'chord';

  function press(i: number, kind: Press): void {
    const x = i % size.columns;
    const y = Math.floor(i / size.columns);

    disarm();

    if (kind === 'flag' || kind === 'plant') {
      flag(x, y, kind === 'plant');
      return;
    }

    if (kind === 'chord' || cells[i].revealed) chord(x, y);
    else reveal(x, y);
  }

  /* ---- Building the grid --------------------------------------------------- */

  /**
   * ⚠️ **The rows are `role="row"` wrappers with `display: contents`**, and
   * both halves of that are required. A grid without rows is not a grid, and a
   * reader gets no position out of it. A row that is also a layout box would
   * put every cell in a nested grid and break the columns.
   *
   * The cells are buttons carrying `role="gridcell"`. The role replaces the
   * button role, which sounds like a loss and is not: in a grid a reader is
   * told where they are and what is in the cell, and "button" on all 480 of
   * them is noise. What to press is said once, in the hint under the board.
   */
  function build(): void {
    board.style.setProperty('--ms-cols', String(size.columns));
    // The stylesheet multiplies this by `--d` to get a cell's delay, so the
    // step the wave moves at is written down once, here, rather than in both
    // files. The same arrangement as `--g2048-slide` in the other game.
    board.style.setProperty('--ms-wave', `${WAVE_MS}ms`);
    board.setAttribute('aria-rowcount', String(size.rows));
    board.setAttribute('aria-colcount', String(size.columns));

    const rows = document.createDocumentFragment();
    nodes = [];

    for (let y = 0; y < size.rows; y++) {
      const row = document.createElement('div');
      row.className = 'ms-row';
      row.setAttribute('role', 'row');
      row.setAttribute('aria-rowindex', String(y + 1));

      for (let x = 0; x < size.columns; x++) {
        const node = document.createElement('button');
        node.type = 'button';
        node.setAttribute('role', 'gridcell');
        node.setAttribute('aria-colindex', String(x + 1));
        // Roving: exactly one cell is in the tab order, so a reader tabs past
        // the board in one press rather than 480.
        node.tabIndex = -1;
        node.dataset.i = String(index(x, y));

        row.append(node);
        nodes.push(node);
      }

      rows.append(row);
    }

    board.replaceChildren(rows);
    nodes[cursor]?.setAttribute('tabindex', '0');
  }

  function restart(): void {
    stopClock();

    size = LEVELS[level];
    cells = Array.from({ length: size.columns * size.rows }, () => ({
      mine: false,
      near: 0,
      revealed: false,
      flagged: false,
    }));

    state = 'ready';
    flags = 0;
    opened = 0;
    elapsed = 0;
    cursor = 0;

    build();
    repaint();

    options.onState(state, 0);
    options.onMines(size.mines);
    options.onTime(0);
  }

  /* ---- Input ---------------------------------------------------------------
   *
   * Four ways to flag, because the three obvious ones each fail somewhere: the
   * right button does not exist on a phone, a long press is undiscoverable, and
   * a mode button is a detour on a desktop. All four end at `press`.
   */

  function focus(next: number): void {
    if (next < 0 || next >= nodes.length) return;

    nodes[cursor]?.setAttribute('tabindex', '-1');
    cursor = next;
    nodes[cursor].setAttribute('tabindex', '0');
    nodes[cursor].focus();
  }

  function cellAt(target: EventTarget | null): number | null {
    if (!(target instanceof Element)) return null;

    const node = target.closest<HTMLElement>('.ms-cell');
    if (!node?.dataset.i) return null;

    return Number(node.dataset.i);
  }

  /* ---- The press preview ---------------------------------------------------
   *
   * Holding the button down shows the cells a release would open, pushed in
   * but untouched. It is the one piece of the original's feel that is not a
   * rule, and it is the piece that makes chording usable: a ring of eight is
   * too much to open on faith, and this says which eight before you commit.
   *
   * ⚠️ **Nothing here touches the model.** It is classes on nodes and an array
   * of which ones, so a preview that is somehow never cleared costs a wrong
   * colour rather than a wrong board.
   */

  let armed: number[] = [];

  function disarm(): void {
    for (const i of armed) nodes[i]?.classList.remove('is-armed');
    armed = [];
  }

  function arm(i: number | null, ring: boolean): void {
    disarm();
    if (i === null || state === 'won' || state === 'lost') return;

    const targets = ring ? [i, ...neighbours(i % size.columns, Math.floor(i / size.columns))] : [i];

    for (const j of targets) {
      // A flag is a decision already made and a revealed cell has nothing to
      // show, so neither takes part. That leaves exactly what a release opens.
      if (cells[j].revealed || cells[j].flagged) continue;
      nodes[j].classList.add('is-armed');
      armed.push(j);
    }
  }

  /** Middle button, or a left button on a number: both mean the ring. */
  const ringPress = (event: MouseEvent, i: number) =>
    event.button === 1 || event.buttons === 3 || cells[i].revealed;

  const onClick = (event: MouseEvent) => {
    const i = cellAt(event.target);
    if (i === null) return;

    // A long press has already acted on this cell, and the click that follows
    // it is the browser catching up rather than a second press.
    if (Date.now() - heldAt < SWALLOW_MS) return;

    press(i, flagging || event.shiftKey ? 'flag' : 'open');
  };

  /**
   * The middle button, which `click` does not fire for.
   *
   * Chording with it is the original's gesture in the form modern mice
   * actually have. The original wants both buttons at once, which is still
   * accepted as `buttons === 3` while the preview is being drawn, but nothing
   * depends on a reader ever discovering it.
   */
  const onAuxClick = (event: MouseEvent) => {
    if (event.button !== 1) return;

    const i = cellAt(event.target);
    if (i === null) return;

    event.preventDefault();
    press(i, 'chord');
  };

  const onContext = (event: MouseEvent) => {
    const i = cellAt(event.target);
    if (i === null) return;

    event.preventDefault();

    /*
     * ⚠️ **A long press on a touch screen fires this as well as the hold timer
     * below**, and the two arrive in either order depending on the browser.
     *
     * Neither has to know which came first, because both plant rather than
     * toggle: running twice leaves the same flag in place. The timer is still
     * called off here so the second one is not even attempted.
     */
    if (from !== null) {
      cancelHold();
      heldAt = Date.now();
      press(i, 'plant');
      return;
    }

    // A right click on a desktop, which is a deliberate toggle and the only
    // way to take a flag back with a mouse.
    press(i, 'flag');
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const i = cellAt(event.target);
    if (i === null || event.metaKey || event.ctrlKey || event.altKey) return;

    const x = i % size.columns;
    const y = Math.floor(i / size.columns);

    const moves: Record<string, number> = {
      ArrowLeft: x > 0 ? i - 1 : i,
      ArrowRight: x < size.columns - 1 ? i + 1 : i,
      ArrowUp: y > 0 ? i - size.columns : i,
      ArrowDown: y < size.rows - 1 ? i + size.columns : i,
      Home: y * size.columns,
      End: y * size.columns + size.columns - 1,
    };

    if (event.code in moves) {
      event.preventDefault();
      focus(moves[event.code]);
      return;
    }

    // The one key this game adds. Enter and Space already reveal, because the
    // cells are buttons and the browser turns those into a click. A keyboard
    // toggles rather than plants: there is no second event to guard against,
    // and taking a flag back has to be possible from here too.
    if (event.code === 'KeyF') {
      event.preventDefault();
      press(i, 'flag');
    }
  };

  /*
   * Touch. A press that stays put for HOLD_MS plants a flag, and it lands while
   * the finger is still down rather than on release - the feedback is the
   * point, and waiting for the lift makes the delay feel like lag instead of
   * like a gesture.
   */
  let holding: number | null = null;
  let from: { x: number; y: number } | null = null;

  /**
   * When a long press last acted, rather than whether one did.
   *
   * ⚠️ A flag that a press is still holding cannot be a boolean. The click a
   * long press produces has to be swallowed, and browsers do not agree on
   * whether it arrives at all - one that never does would leave a flag set
   * forever and eat the reader's next real press. A timestamp cannot get stuck:
   * it stops mattering on its own.
   */
  let heldAt = 0;

  /** Long enough to cover the click a long press trails behind it, short
   *  enough that the next deliberate tap is never mistaken for one. */
  const SWALLOW_MS = 400;

  function cancelHold(): void {
    if (holding !== null) window.clearTimeout(holding);
    holding = null;
    from = null;
  }

  const onPointerDown = (event: PointerEvent) => {
    const i = cellAt(event.target);
    if (i === null) return;

    if (event.pointerType === 'mouse') {
      // The middle button scrolls in some browsers, and the page is not what
      // the reader is aiming at.
      if (event.button === 1) event.preventDefault();

      arm(i, ringPress(event, i));
      return;
    }

    from = { x: event.clientX, y: event.clientY };

    holding = window.setTimeout(() => {
      heldAt = Date.now();
      press(i, 'plant');
    }, HOLD_MS);
  };

  const onPointerMove = (event: PointerEvent) => {
    // The preview follows the pointer while the button is down, which is what
    // makes it a preview rather than a flash: a reader can run along a row and
    // watch which ring each number would open.
    if (event.pointerType === 'mouse') {
      if (event.buttons === 0) return;

      const i = cellAt(event.target);
      arm(i, i !== null && ringPress(event, i));
      return;
    }

    if (!from) return;

    const drift = Math.max(Math.abs(event.clientX - from.x), Math.abs(event.clientY - from.y));
    if (drift > DRIFT) cancelHold();
  };

  const onPointerUp = () => {
    cancelHold();
    disarm();
  };

  board.addEventListener('click', onClick);
  board.addEventListener('auxclick', onAuxClick);
  board.addEventListener('contextmenu', onContext);
  board.addEventListener('keydown', onKeyDown);
  board.addEventListener('pointerdown', onPointerDown);
  board.addEventListener('pointermove', onPointerMove);
  board.addEventListener('pointerup', onPointerUp);
  board.addEventListener('pointercancel', onPointerUp);
  // The button can be released anywhere, and a preview left behind on a board
  // the pointer has walked away from is the one way this becomes visible state.
  board.addEventListener('pointerleave', onPointerUp);
  window.addEventListener('blur', onPointerUp);

  restart();

  return {
    restart,
    level: () => level,

    setLevel(id) {
      level = id;
      root.dataset.level = id;
      restart();
    },

    setFlagging(on) {
      flagging = on;
    },

    destroy() {
      stopClock();
      cancelHold();
      board.removeEventListener('click', onClick);
      board.removeEventListener('auxclick', onAuxClick);
      board.removeEventListener('contextmenu', onContext);
      board.removeEventListener('keydown', onKeyDown);
      board.removeEventListener('pointerdown', onPointerDown);
      board.removeEventListener('pointermove', onPointerMove);
      board.removeEventListener('pointerup', onPointerUp);
      board.removeEventListener('pointercancel', onPointerUp);
      board.removeEventListener('pointerleave', onPointerUp);
      window.removeEventListener('blur', onPointerUp);
    },
  };
}
