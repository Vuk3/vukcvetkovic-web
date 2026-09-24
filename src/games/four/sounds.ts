/**
 * What the board sounds like: hard plastic on hard plastic.
 *
 * A disc landing is the sound the whole game is made of, so it is three
 * clicks rather than one - the landing and the two bounces after it, on the
 * same three moments the disc is drawn at, each quieter than the last - over a
 * short knock through the board. A longer fall lands harder. Yours and theirs
 * are the same sound a few semitones apart, the way two colours of the same
 * plastic are not quite the same. Letting go of a disc is a short slide, and
 * emptying the board is a rattle of every disc in it falling out. The engine
 * and the switch are in games/sound.ts, shared.
 */
import { delayed, fall, fanfare, type Voice } from '../sound';
import { fall as falling, type Cue } from './game';

/** How hard a disc lands, from how far it fell: a fall of one square is a tap
 *  and a fall down an empty column is a clack. */
const weight = (distance: number) => Math.min(1, 0.45 + distance * 0.1);

/** One click of plastic, pitched by whose disc it is. */
function click(synth: Parameters<Voice>[0], at: number, peak: number, pitch: number): void {
  synth.brush(at, 0.03, 2600 * pitch, 0.5 * peak, 1700 * pitch);
  synth.brush(at + 0.004, 0.022, 4300 * pitch, 0.18 * peak);
  synth.tone(at, 190 * pitch, 0.06, 0.07 * peak, 'sine', 120 * pitch);
}

export const voices: Record<Cue, Voice> = {
  /** Barely there: which column the disc in hand is over, heard more than
   *  listened to. */
  aim: (synth) => synth.brush(0, 0.014, 3600, 0.05),

  drop: (synth, level) => synth.brush(0, 0.07, 1300, 0.08 + Math.abs(level) * 0.01, 3200),

  land: (synth, level) => {
    const distance = Math.abs(level);
    const pitch = level > 0 ? 1 : 1.19;
    const hard = weight(distance);
    const f = falling(distance);

    click(synth, 0, hard, pitch);
    // The board taking it, under the click.
    synth.tone(0, 105, 0.12, 0.09 * hard, 'sine', 70);

    click(synth, f.first, hard * 0.34, pitch * 1.04);
    click(synth, f.first + f.second, hard * 0.12, pitch * 1.07);
  },

  /** A column with no room in it: a dull knock on the top of the board. */
  full: (synth) => {
    synth.tone(0, 150, 0.09, 0.1, 'sine', 110);
    synth.brush(0, 0.04, 900, 0.18, undefined, 'lowpass');
  },

  /** Every disc on the board falling out of the bottom, the lowest first: a
   *  click for each, spread over the time the highest takes to leave. */
  spill: (synth, count) => {
    synth.brush(0, 0.16, 700, 0.2, 2400);

    for (let k = 0; k < count; k++) {
      const at = 0.06 + Math.sqrt(Math.random()) * 0.4;
      synth.brush(at, 0.02, 1800 + Math.random() * 2600, 0.12 + Math.random() * 0.1);
    }
  },

  // The last disc lands and bounces, and the ending waits for it.
  win: delayed(fanfare, 0.28),

  lose: delayed(fall, 0.28),

  /** Neither: two notes that settle rather than rise or fall. */
  draw: (synth) => {
    synth.tone(0.2, 392, 0.3, 0.08, 'sine');
    synth.tone(0.42, 392, 0.55, 0.07, 'sine');
  },
};
