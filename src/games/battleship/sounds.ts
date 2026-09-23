/**
 * What the table sounds like, and every shot is heard from both ends.
 *
 * A round leaves with a thump and arrives as one of three: a splash where it
 * found water, a blast where it found a hull, and a longer, lower one where
 * that hull goes down. Their shots are the same sounds heard from further
 * away - quieter, which is all "further away" has to mean - so a turn reads by
 * ear as yours or theirs before the log under the board says which. Handling
 * the fleet while placing it is the quiet end: a lift, a clunk, a tick for a
 * turn. The engine and the switch are in games/sound.ts, shared.
 */
import { delayed, fall, fanfare, type Voice } from '../sound';
import type { Cue } from './game';

/** Your shot at full weight, theirs at a distance. */
const near = (level: number) => (level === 1 ? 1 : 0.62);

export const voices: Record<Cue, Voice> = {
  fire: (synth, level) => {
    synth.tone(0, 150, 0.16, 0.2 * near(level), 'sine', 55);
    synth.brush(0, 0.12, 900, 0.35 * near(level), 300, 'lowpass');
  },

  splash: (synth, level) => {
    synth.brush(0, 0.4, 1600, 0.42 * near(level), 300, 'lowpass');
    // The spray over it, short and high.
    synth.brush(0.03, 0.25, 3000, 0.12 * near(level));
  },

  hit: (synth, level) => {
    synth.brush(0, 0.45, 1800, 0.6 * near(level), 150, 'lowpass');
    synth.tone(0, 120, 0.35, 0.18 * near(level), 'sine', 45);
  },

  sunk: (synth, level) => {
    synth.brush(0, 0.9, 1200, 0.8 * near(level), 80, 'lowpass');
    synth.tone(0, 90, 0.8, 0.22 * near(level), 'sine', 30);
    synth.tone(0.15, 60, 0.7, 0.12 * near(level), 'sine', 28);
  },

  lift: (synth) => synth.brush(0, 0.08, 1800, 0.2, 3000),

  place: (synth) => {
    synth.tone(0, 196, 0.1, 0.14, 'sine');
    synth.brush(0, 0.05, 700, 0.25, undefined, 'lowpass');
  },

  rotate: (synth) => synth.tone(0, 660, 0.05, 0.06),

  shuffle: (synth) => synth.brush(0, 0.3, 600, 0.25, 2800),

  // Both endings land on the same frame as the sinking that caused them, so
  // they wait for it to break first.
  win: delayed(fanfare, 0.45),

  lose: delayed(fall, 0.45),
};
