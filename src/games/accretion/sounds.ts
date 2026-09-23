/**
 * What the well sounds like.
 *
 * A drop is a soft rush of air. A merge is a rounded note that rises into
 * place as the two bodies become one, and it gets deeper as the bodies get
 * bigger - the Moon's merges are high and quick, Jupiter's are low - on a
 * pentatonic scale, so the chains that are the whole point of this game come
 * out as a phrase rather than a clash. Two Suns going off are the one big
 * sound: a shimmer over a boom. The engine and the switch are in
 * games/sound.ts, shared.
 */
import { delayed, fall, fanfare, type Voice } from '../sound';
import type { Cue } from './game';

/** C major pentatonic, falling: what a merge into each tier sounds like,
 *  from Mercury (tier 1) down to the Sun (tier 9). */
const DEPTHS = [1046.5, 880, 783.99, 659.25, 523.25, 440, 392, 329.63, 261.63];

export const voices: Record<Cue, Voice> = {
  drop: (synth) => synth.brush(0, 0.18, 500, 0.22, 1500),

  merge: (synth, tier) => {
    const frequency = DEPTHS[Math.min(DEPTHS.length - 1, Math.max(0, tier - 1))];
    // Rising a little into the note is what makes it two things becoming one
    // rather than a beep.
    synth.tone(0, frequency * 0.82, 0.24, 0.13, 'sine', frequency);
    synth.tone(0.01, frequency * 2, 0.08, 0.03);
  },

  nova: (synth) => {
    synth.brush(0, 1.1, 300, 0.7, 6000);
    synth.tone(0, 80, 0.9, 0.2, 'sine', 30);
  },

  // After the merge that made it, which is heard on the same frame.
  star: delayed(fanfare, 0.25),

  over: fall,
};
