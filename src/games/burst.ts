/**
 * The burst thrown over a board that has just been won.
 *
 * Shared, like record.ts and sound.ts, because every game ends in a win it
 * wants to mark and none of them is the right place to own the confetti. What
 * differs is the colour, so a game hands over its own palette and a burst in
 * 2048 is its ramp, a burst in the minefield its eight numbers.
 *
 * Each piece is an element with four custom properties and one animation, the
 * `.game-bit` rules in styles/games/shared.css, thrown from the middle of the
 * layer - which
 * is a size container, so the distances are fractions of the board rather than
 * a fixed reach that is a flick on a desktop and off the edge on a phone.
 */

/** Enough to read as a burst over a sixty card table, few enough that none of
 *  them is ever a frame cost. */
const PIECES = 56;

/** Longer than the longest piece's delay plus its flight, measured off the
 *  `game-bit` keyframes, so nothing is taken away mid-air. */
const LIFE_MS = 2200;

export function scatter(layer: HTMLElement, colours: readonly string[]): void {
  // Confetti is motion and nothing else, so under reduced motion there is none.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const pieces = document.createDocumentFragment();

  for (let k = 0; k < PIECES; k++) {
    const piece = document.createElement('span');
    const angle = Math.random() * Math.PI * 2;
    const reach = 0.35 + Math.random() * 0.65;

    piece.className = k % 3 === 0 ? 'game-bit is-round' : 'game-bit';
    piece.style.setProperty('--bx', (Math.cos(angle) * reach).toFixed(3));
    piece.style.setProperty('--by', (Math.sin(angle) * reach - 0.35).toFixed(3));
    piece.style.setProperty('--br', `${Math.round((Math.random() - 0.5) * 900)}deg`);
    piece.style.setProperty('--bd', `${Math.round(Math.random() * 180)}ms`);
    piece.style.setProperty('--bc', colours[k % colours.length]);

    pieces.append(piece);
  }

  const first = pieces.firstChild;
  layer.replaceChildren(pieces);

  // Only this burst's pieces. A second win inside the window would otherwise
  // have its confetti swept away by the first one's timer.
  window.setTimeout(() => {
    if (layer.firstChild === first) layer.replaceChildren();
  }, LIFE_MS);
}
