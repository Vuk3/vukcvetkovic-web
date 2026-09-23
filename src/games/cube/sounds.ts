/**
 * What the puzzle sounds like: plastic, mostly.
 *
 * A layer landing on its step is the sound the whole game is made of, so it
 * is two clicks a few milliseconds apart through a band-pass - the corner
 * cubie seating, then the edge beside it - over a short low knock that gives
 * it a body. A half turn clicks a third time. Everything else is quieter than
 * that: a tick at each step a dragged layer passes, a rattle for each turn of
 * a scramble, and a rush of air as it starts. The engine and the switch are in
 * games/sound.ts, shared.
 */
import { delayed, fanfare, type Voice } from '../sound';
import type { Cue } from './game';

export const voices: Record<Cue, Voice> = {
  turn: (synth, steps) => {
    synth.brush(0, 0.034, 2300, 0.42, 1500);
    synth.brush(0.017, 0.03, 4100, 0.2);
    synth.tone(0, 165, 0.055, 0.06, 'sine', 120);
    if (steps >= 2) synth.brush(0.036, 0.03, 3100, 0.16);
  },

  /** Let go short of a step, and back into place. */
  settle: (synth) => synth.brush(0, 0.028, 1900, 0.22),

  detent: (synth) => synth.brush(0, 0.016, 3400, 0.09),

  /** Pitched at random so sixty of them in a row are a rattle and not a buzz. */
  rattle: (synth) => synth.brush(0, 0.026, 1800 + Math.random() * 2200, 0.2),

  scramble: (synth) => synth.brush(0, 0.5, 420, 0.16, 2600),

  undo: (synth) => {
    synth.brush(0, 0.1, 3000, 0.16, 1300);
    synth.brush(0.05, 0.032, 2100, 0.3);
  },

  /** A beat after the last click, so the two are heard as a sequence. */
  solved: delayed(fanfare, 0.12),

  arrive: (synth) => synth.brush(0, 0.34, 2000, 0.1, 380, 'lowpass'),
};
