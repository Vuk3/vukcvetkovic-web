/**
 * The table's sounds, made in the browser rather than downloaded.
 *
 * Five cues, each a few oscillators or a burst of filtered noise through one
 * gain, so there is no audio file anywhere: nothing to fetch, nothing to
 * decode, and nothing that could fail to arrive and leave a game that clicks
 * silently. A card turning is paper, so it is noise through a band-pass. A
 * pair is two notes a fifth apart, a miss is one low note falling away, and a
 * cleared board is a major arpeggio.
 *
 * ⚠️ **The context is only ever created inside a gesture.** Browsers refuse to
 * start audio a page did not ask for with a press, and a context made on load
 * sits suspended and logs a warning for it. So nothing here builds one until
 * `wake` is called from a pointer or key event, and every cue before that is
 * silently dropped - which is only ever the deal on first load.
 */

export type Cue = 'deal' | 'flip' | 'pair' | 'miss' | 'clear';

export interface Sound {
  /** Call from a real gesture. Creates or resumes the context. */
  wake(): void;
  play(cue: Cue): void;
  setOn(on: boolean): void;
}

/** Everything is mixed into this and it is kept well under full scale: these
 *  are the sounds of a card table, and a page should never be the loudest
 *  thing in the room. */
const MASTER = 0.45;

export function createSound(initiallyOn: boolean): Sound {
  let on = initiallyOn;
  let context: AudioContext | null = null;
  let master: GainNode | null = null;

  /** Half a second of white noise, made once and read from a random offset
   *  each time, so no two card turns are the same sample. */
  let noise: AudioBuffer | null = null;

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

  /**
   * One enveloped note. `exponentialRamp` cannot reach zero, which is why the
   * floor is a ten-thousandth rather than nothing - and why the attack starts
   * there too, since a note that starts at full level clicks.
   */
  function tone(
    at: number,
    frequency: number,
    duration: number,
    peak: number,
    type: OscillatorType = 'triangle',
    glideTo?: number,
  ): void {
    if (!context || !master) return;

    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, at);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, at + duration);

    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(peak, at + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);

    osc.connect(gain).connect(master);
    osc.start(at);
    osc.stop(at + duration + 0.03);
  }

  /** A burst of noise through a band-pass, optionally swept, for the sounds
   *  that are paper rather than pitch. */
  function brush(at: number, duration: number, frequency: number, peak: number, sweepTo?: number): void {
    if (!context || !master || !noise) return;

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    source.buffer = noise;

    filter.type = 'bandpass';
    filter.Q.value = 0.8;
    filter.frequency.setValueAtTime(frequency, at);
    if (sweepTo) filter.frequency.exponentialRampToValueAtTime(sweepTo, at + duration);

    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(peak, at + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);

    source.connect(filter).connect(gain).connect(master);
    source.start(at, Math.random() * 0.4, duration + 0.05);
  }

  function play(cue: Cue): void {
    // Only a context that a gesture already made. Building one here would be
    // building it outside a gesture, which is the one thing that must not
    // happen - see the note at the top.
    if (!on || !context || context.state !== 'running') return;

    const t = context.currentTime;

    switch (cue) {
      case 'flip':
        brush(t, 0.075, 2600, 0.5);
        break;

      case 'deal':
        brush(t, 0.34, 700, 0.3, 3400);
        break;

      case 'pair':
        tone(t, 880, 0.22, 0.12);
        tone(t + 0.085, 1318.5, 0.34, 0.11);
        break;

      case 'miss':
        tone(t, 220, 0.2, 0.16, 'sine', 146.8);
        break;

      case 'clear':
        [523.25, 659.25, 783.99, 1046.5].forEach((frequency, i) => {
          tone(t + i * 0.1, frequency, i === 3 ? 0.6 : 0.24, 0.1);
        });
        break;
    }
  }

  return {
    wake,
    play,

    setOn(next) {
      on = next;
      if (on) wake();
      else if (context?.state === 'running') void context.suspend();
    },
  };
}
