/**
 * What the memory table sounds like: five cues, and nothing between them.
 *
 * A card turning is paper, so it is noise through a band-pass. A pair is two
 * notes a fifth apart, a miss one low note falling away, and a cleared board
 * the fanfare every game here ends on. The engine and the switch are in
 * games/sound.ts, shared.
 */
import { fanfare, type Voice } from '../sound';
import type { Cue } from './game';

export const voices: Record<Cue, Voice> = {
  flip: (synth) => synth.brush(0, 0.075, 2600, 0.5),

  deal: (synth) => synth.brush(0, 0.34, 700, 0.3, 3400),

  pair: (synth) => {
    synth.tone(0, 880, 0.22, 0.12);
    synth.tone(0.085, 1318.5, 0.34, 0.11);
  },

  miss: (synth) => synth.tone(0, 220, 0.2, 0.16, 'sine', 146.8),

  clear: fanfare,
};
