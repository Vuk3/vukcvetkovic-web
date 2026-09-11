/**
 * A best score that survives a reload and refuses one it did not write.
 *
 * Shared by every game here, because keeping a record is the one thing they
 * all do and none of them is the right place to own it. What differs between
 * games is a single predicate - what counts as a number their scoring could
 * have produced - and that is the argument.
 *
 * ⚠️ **The stored value is signed, not encrypted, and it is not a security
 * measure.** The key ships inside the game's bundle whatever it is set from,
 * so anyone willing to open the file can mint a record that verifies, and no
 * client-side scheme can change that: the page and the person editing the page
 * run the same code on the same machine. Encrypting the number would hide it
 * from nobody for exactly the same reason.
 *
 * What it does buy is that typing a figure into the storage inspector fails
 * silently instead of sticking, and that a half-written or corrupted value
 * never reaches a game as a number. That is proportionate, because a record
 * here is private to one browser and claims nothing to anybody. A figure that
 * meant something to other people would have to be derived by a server from a
 * seed it issued and the moves that followed, with the player's own claim
 * about their score ignored.
 */

/*
 * `PUBLIC_` because this is client code: Vite substitutes the value in at
 * build time and a variable without that prefix is not there to read. So env
 * keeps the key out of the repository and out of nothing else, which is the
 * honest description of what it is worth.
 *
 * The literal is a fallback rather than a placeholder, so a build without the
 * variable set produces working games instead of records signed with
 * `undefined`. Changing the key invalidates every record signed with the old
 * one and they restart at zero, which is what a new browser does anyway and is
 * not worth a migration.
 */
const SIGN_KEY: string = import.meta.env.PUBLIC_GAME_SIGN_KEY || 'vc-games-9f3';

/**
 * FNV-1a over the key, the storage name and the value, in base 36.
 *
 * The storage name is in there so a record is bound to the game it was set
 * for. Without it one verified figure could be pasted under another game's
 * key, and every game on the site would share one forgery.
 */
function sign(name: string, value: number): string {
  const input = `${SIGN_KEY}:${name}:${value}`;
  let hash = 0x811c9dc5;

  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    // `Math.imul` rather than `*`: the FNV prime overflows into a double
    // within a few rounds, and the low bits the hash is made of are the first
    // thing a double drops.
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(36);
}

export interface ScoreRecord {
  /** The stored figure, or 0 if there is none or it does not verify. */
  read(): number;
  /** Stores the figure with its signature. A failure is swallowed. */
  write(value: number): void;
}

/**
 * @param name  The `localStorage` key, and part of what is signed.
 * @param plausible  What the game's own scoring could have produced. 2048
 *   passes `value % 4 === 0`, because a merge scores the tile it made and that
 *   is a power of two of at least four. It costs nothing, it runs before the
 *   signature, and it bounds what a forged record can be even if the key is
 *   worked out.
 */
export function scoreRecord(name: string, plausible?: (value: number) => boolean): ScoreRecord {
  return {
    read() {
      try {
        const raw = localStorage.getItem(name);
        if (raw === null) return 0;

        const cut = raw.lastIndexOf('.');
        const value = Number(raw.slice(0, cut));

        const valid =
          cut > 0 &&
          Number.isSafeInteger(value) &&
          value >= 0 &&
          (plausible?.(value) ?? true) &&
          raw.slice(cut + 1) === sign(name, value);

        if (valid) return value;

        // Cleared rather than left alone, so a bad record cannot survive the
        // session and the next write is not merged into whatever was there.
        localStorage.removeItem(name);
        return 0;
      } catch {
        /* Storage unavailable (private mode); the record holds for this view. */
        return 0;
      }
    },

    write(value) {
      try {
        localStorage.setItem(name, `${value}.${sign(name, value)}`);
      } catch {
        /* Nothing to do; the record simply will not outlive the page. */
      }
    },
  };
}
