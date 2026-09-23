/**
 * What the 2048 board sounds like, which is mostly the merges.
 *
 * A slide is a soft brush, quiet on purpose: it is the sound of every single
 * move, and anything louder is a game you turn off in a minute. A merge is a
 * pop pitched by the tile it made, climbing a pentatonic scale from the 4 to
 * the tiles past 2048 - pentatonic because any two of its notes sound fine
 * together, and a long game is a great many of them in a row. So a board
 * getting bigger is a board getting higher, and a 1024 is heard before it is
 * read. The engine and the switch are in games/sound.ts, shared.
 */
import { fall, fanfare, type Voice } from '../sound';
import type { Cue } from './game';

/** C major pentatonic from middle C, one note per tier from 4 (tier 2) to
 *  everything past 2048 (tier 12). */
const LADDER = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25, 783.99, 880, 1046.5];

export const voices: Record<Cue, Voice> = {
  slide: (synth) => synth.brush(0, 0.07, 1400, 0.14, 2600),

  merge: (synth, tier) => {
    const frequency = LADDER[Math.min(LADDER.length - 1, Math.max(0, tier - 2))];
    synth.tone(0, frequency, 0.16, 0.12);
    // An octave above, short and faint, which is what makes it a pop rather
    // than a beep.
    synth.tone(0, frequency * 2, 0.07, 0.035, 'sine');
  },

  win: fanfare,

  over: fall,

  // The slide played backwards: a sweep down instead of up.
  undo: (synth) => synth.brush(0, 0.12, 2400, 0.12, 900),
};
