/**
 * The games' sounds, made in the browser rather than downloaded.
 *
 * Shared for the reason record.ts is: every game does this and none of them is
 * the right place to own it. What differs between games is which moments make
 * a sound and what that sound is, so a game hands this its own voices - one
 * small function per cue, in its own folder - and this owns everything else:
 * the audio context, the one switch, the gesture rule and the rate limit.
 *
 * A voice is a few oscillators or a burst of filtered noise through one gain.
 * There is no audio file anywhere: nothing to fetch, nothing to decode, and
 * nothing that could fail to arrive and leave a game clicking silently.
 *
 * ⚠️ **The context is only ever created inside a gesture.** Browsers refuse to
 * start audio a page did not ask for with a press, and a context made on load
 * sits suspended and logs a warning for it. So nothing here builds one until a
 * `pointerdown` or `keydown` arrives, and a cue before that is dropped - which
 * in practice is only ever what a game does on load.
 *
 * ⚠️ **One switch for every game, not one each.** Turning the sound off in one
 * game and walking into the next to find it on again is the thing a reader
 * notices, so the preference is stored once, under a name no game owns.
 */

export interface Synth {
  /**
   * One enveloped note, `at` seconds from now. `exponentialRamp` cannot reach
   * zero, which is why the floor is a ten-thousandth rather than nothing - and
   * why the attack starts there too, since a note that starts at full level
   * clicks.
   */
  tone(at: number, frequency: number, duration: number, peak: number, type?: OscillatorType, glideTo?: number): void;
  /** A burst of noise through a filter, optionally swept, for the sounds that
   *  are paper, water or air rather than pitch. */
  brush(at: number, duration: number, frequency: number, peak: number, sweepTo?: number, filter?: BiquadFilterType): void;
}

/** One cue's sound. `level` is whatever the game says the moment is worth - a
 *  tile's tier, a count of cells - and a voice is free to ignore it. */
export type Voice = (synth: Synth, level: number) => void;

export interface Sound<C extends string> {
  play(cue: C, level?: number): void;
  /** Wires the page's `[data-sound-toggle]` inside `root` and the gesture that
   *  wakes the context. Called once, by the page. */
  bind(root: HTMLElement): void;
}

const KEY = 'game-sound';

/** Everything is mixed into this and it stays well under full scale: these are
 *  the sounds of a table game, and a page should never be the loudest thing in
 *  the room. */
const MASTER = 0.45;

/**
 * The same cue this soon after itself is dropped.
 *
 * A flood in the minefield, a chain in the well and a two-tile merge in 2048
 * can each ask for one sound several times inside a frame, and forty of the
 * same note on top of each other is a buzz rather than a chime.
 */
const GAP_MS = 40;

function stored(): boolean {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}

export function createSound<C extends string>(voices: Record<C, Voice>): Sound<C> {
  let on = stored();
  let context: AudioContext | null = null;
  let master: GainNode | null = null;

  /** Half a second of white noise, made once and read from a random offset
   *  each time, so no two brushes are the same sample. */
  let noise: AudioBuffer | null = null;

  const last = new Map<C, number>();

  function wake(): void {
    if (!on) return;

    if (!context) {
      if (typeof AudioContext === 'undefined') return;

      context = new AudioContext();
      master = context.createGain();
      master.gain.value = MASTER;
      master.connect(context.destination);

      noise = context.createBuffer(1, Math.floor(context.sampleRate * 0.5), context.sampleRate);
      const samples = noise.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    }

    if (context.state === 'suspended') void context.resume();
  }

  const synth: Synth = {
    tone(at, frequency, duration, peak, type = 'triangle', glideTo) {
      if (!context || !master) return;

      const t = context.currentTime + at;
      const osc = context.createOscillator();
      const gain = context.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, t);
      if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t + duration);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(peak, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(gain).connect(master);
      osc.start(t);
      osc.stop(t + duration + 0.03);
    },

    brush(at, duration, frequency, peak, sweepTo, filter = 'bandpass') {
      if (!context || !master || !noise) return;

      const t = context.currentTime + at;
      const source = context.createBufferSource();
      const shape = context.createBiquadFilter();
      const gain = context.createGain();

      source.buffer = noise;

      shape.type = filter;
      shape.Q.value = 0.8;
      shape.frequency.setValueAtTime(frequency, t);
      if (sweepTo) shape.frequency.exponentialRampToValueAtTime(sweepTo, t + duration);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(peak, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      source.connect(shape).connect(gain).connect(master);
      source.start(t, Math.random() * 0.4, duration + 0.05);
    },
  };

  return {
    play(cue, level = 0) {
      // Only a context that a gesture already made. Building one here would be
      // building it outside a gesture - see the note at the top.
      if (!on || !context || context.state !== 'running') return;

      const now = performance.now();
      if (now - (last.get(cue) ?? -Infinity) < GAP_MS) return;
      last.set(cue, now);

      voices[cue](synth, level);
    },

    bind(root) {
      const button = root.querySelector<HTMLButtonElement>('[data-sound-toggle]');
      button?.setAttribute('aria-pressed', String(on));

      // On the window, not the game: 2048 and the well take their keys from
      // the whole page, and the first arrow press has to be able to wake the
      // sound it is about to make.
      window.addEventListener('pointerdown', wake, { capture: true });
      window.addEventListener('keydown', wake, { capture: true });

      button?.addEventListener('click', () => {
        on = !on;
        button.setAttribute('aria-pressed', String(on));

        try {
          localStorage.setItem(KEY, on ? 'on' : 'off');
        } catch {
          /* Nothing to do; the choice simply will not outlive the page. */
        }

        if (on) wake();
        else if (context?.state === 'running') void context.suspend();
      });
    },
  };
}

/**
 * A voice played a moment late. For an ending that lands on the same frame as
 * the blow that caused it - the last ship sinking, the Sun being made - where
 * a fanfare on top of an explosion is two sounds cancelling each other out.
 */
export function delayed(voice: Voice, seconds: number): Voice {
  return (synth, level) =>
    voice(
      {
        tone: (at, ...rest) => synth.tone(at + seconds, ...rest),
        brush: (at, ...rest) => synth.brush(at + seconds, ...rest),
      },
      level,
    );
}

/* ---- Two voices every game ends with ------------------------------------- */

/** A win: a major arpeggio up to the octave, the last note held. */
export const fanfare: Voice = (synth) => {
  [523.25, 659.25, 783.99, 1046.5].forEach((frequency, i) => {
    synth.tone(i * 0.1, frequency, i === 3 ? 0.6 : 0.24, 0.1);
  });
};

/** A loss: the same shape falling, softer and on a rounder wave, because the
 *  end of a game should not sound like a reprimand. */
export const fall: Voice = (synth) => {
  [392, 329.63, 261.63, 196].forEach((frequency, i) => {
    synth.tone(i * 0.14, frequency, i === 3 ? 0.7 : 0.26, 0.085, 'sine');
  });
};
