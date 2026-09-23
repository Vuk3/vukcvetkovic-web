/**
 * What the minefield sounds like.
 *
 * Opening one cell is a tick, and a flood is a sweep whose length follows how
 * many cells it opened, so a press that clears half the board sounds like it
 * did. A flag is a short high note going down and a lower one coming back
 * off. A mine is the one loud sound on the page - filtered noise falling to
 * nothing under a sine dropping out of hearing - and it is still well under
 * full scale. The engine and the switch are in games/sound.ts, shared.
 */
import { fanfare, type Voice } from '../sound';
import type { Cue } from './game';

export const voices: Record<Cue, Voice> = {
  open: (synth, count) => {
    if (count <= 1) {
      synth.brush(0, 0.045, 3200, 0.3);
      return;
    }

    // A flood: longer the more it opened, capped so the expert board's
    // three-hundred-cell fill is a sweep and not a drone.
    synth.brush(0, Math.min(0.45, 0.12 + count * 0.004), 900, 0.32, 4200);
  },

  flag: (synth) => {
    synth.tone(0, 1174.7, 0.09, 0.09);
    synth.brush(0, 0.04, 3000, 0.2);
  },

  unflag: (synth) => synth.tone(0, 740, 0.08, 0.07),

  boom: (synth) => {
    synth.brush(0, 0.7, 900, 0.9, 90, 'lowpass');
    synth.tone(0, 110, 0.6, 0.22, 'sine', 38);
  },

  win: fanfare,
};
