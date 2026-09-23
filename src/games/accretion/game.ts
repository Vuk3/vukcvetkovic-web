/**
 * Accretion.
 *
 * Bodies fall into a well, and two of the same merge into the next one up:
 * Moon, Mercury, Mars, Venus, Earth, Neptune, Uranus, Saturn, Jupiter, Sun.
 * Accretion is the process that actually builds a planet out of smaller bodies,
 * so the name and the rule are the same statement.
 *
 * ⚠️ **This is the only game here with a solver in it**, and it is written from
 * scratch rather than pulled in. matter.js is 25.9 KB gz, seven times this
 * whole game, and planck.js is 55 KB. What the game needs is circles, gravity,
 * two walls, a floor and spin, with no polygons and no joints - and matter.js
 * is weakest at exactly the one thing it would be asked to do here, which is to
 * hold a heavy pile of circles still without it sinking or trembling.
 *
 * The method is the **soft step** Box2D v3 settled on. Each substep integrates
 * velocity, solves every contact as a stiff, heavily damped spring, moves the
 * bodies, and then solves the contacts again rigidly with no push at all - the
 * relax. The first solve is what gets two bodies out of each other, and the
 * relax is what takes back the speed that took them out, so an overlap is
 * corrected without ever turning into a bounce. Bouncing is a separate, last
 * pass, and it only answers an impact that was hard enough to deserve one.
 *
 * Circles make most of it arithmetic. Every contact is one point on the line
 * between two centres, the normal carries no torque, and the masses a contact
 * responds with are fixed by the two radii.
 *
 * There is no canvas. A body is a div with a border radius, and the frame
 * writes one transform onto each - so the planets are drawn by the stylesheet,
 * they answer the theme, and they stay sharp at any zoom.
 */

/* ---- The world ----------------------------------------------------------- */

/**
 * Physics runs in its own units and the view is scaled onto it, rather than
 * running in pixels.
 *
 * The shape was measured rather than chosen. Played out with a simple aiming
 * strategy, a well 1000 by 1400 gives games of 31 drops that stall at Saturn,
 * and this one gives 59 and gets there comfortably - because the largest body
 * is 47% of the width here rather than 57%, which is the difference between a
 * well that can hold two of them side by side and one that cannot. Taller
 * again is better still for the simulation and worse for the page, which has
 * to show the whole well without scrolling.
 *
 * A board that is 380px on a phone and 520px on a desktop would otherwise be
 * two different games: the same gravity would feel twice as heavy on one of
 * them, and a resize mid-game would jolt the pile. Here the simulation never
 * learns how big it is being shown.
 */
export const WORLD_W = 1200;
export const WORLD_H = 1650;

/** Where a body is held before it is dropped, and the line it must stay under. */
const DROP_Y = 170;
export const LOSS_Y = 340;

/**
 * The ten bodies, by radius.
 *
 * ⚠️ **The order is the solar system, the sizes are the genre's.** Real
 * diameters put Venus and Earth within 5% of each other and Neptune and Uranus
 * within 3%, which in a merge game is unreadable - the whole thing depends on
 * telling one step from the next at a glance and at speed.
 *
 * The proportions are taken from the game that defined this shape rather than
 * invented: a range of nine and a half to one, and early steps that are the
 * big ones - 1.47 and 1.36 - tapering to about 1.24, because the first merges
 * have to be visibly worth making while the last ones are already enormous.
 */
export const RADII = [30, 44, 60, 76, 96, 120, 148, 182, 228, 285];

export const TIERS = RADII.length;

/** Only the five smallest ever drop, so the pile is built rather than handed
 *  over. Past Earth a body has to be earned. */
const DROPPABLE = 5;

/**
 * What a merge is worth: the triangular number of the tier it produced.
 *
 * Each step up is worth more than the sum of getting there, which is what
 * makes the back half of a game the part worth playing rather than tidying up.
 */
const points = (tier: number) => (tier * (tier + 1)) / 2;

/** Two Suns cannot merge into anything, so they annihilate - and that has to be
 *  worth more than the Sun that made them, or nobody would ever do it. */
const NOVA_POINTS = 120;

/* ---- The solver ---------------------------------------------------------- */

/**
 * One step of simulation, fixed, regardless of what the display is doing.
 *
 * A solver fed the real frame time is a solver whose behaviour changes on a
 * slow phone, and a long frame - a tab coming back to the front - would step
 * bodies straight through each other. The accumulator below runs whole steps,
 * and the frame draws each body part of the way between the last two of them,
 * so a 120Hz screen shows 120 positions a second rather than 60 twice each.
 */
const STEP = 1 / 60;

/** Never more than this many steps for one frame. Coming back from a
 *  backgrounded tab is a skipped second, not a second to catch up on. */
const MAX_STEPS = 4;

/**
 * Substeps per step.
 *
 * Box2D ships four. This is eight because the weights here are further apart
 * than a physics demo's - a Sun weighs nine and a half Moons - and a heavy
 * body on a light one is the case a solver converges on slowest. A well of
 * thirty bodies costs 0.06ms a step at eight, against a frame of 16.7.
 */
const SUBSTEPS = 8;

/** The length of one substep, in seconds. */
const H = STEP / SUBSTEPS;

/**
 * World units per second squared.
 *
 * About 0.8s from the drop line to an empty floor, which is what makes a drop
 * read as a weight falling rather than a leaf. The solver is not what limits
 * it: speculative contacts stop a falling body at the surface it is about to
 * reach, however fast it arrives.
 */
const GRAVITY = 4500;

/**
 * How fast a body loses speed and spin for no reason but moving, per second.
 *
 * Almost nothing, because there is no air in here and nothing about a falling
 * planet should slow it. Settling is the contacts' job. A few percent a second
 * is enough to stop a body that has somehow ended up spinning alone from
 * spinning for ever.
 */
const LINEAR_DAMPING = 0.1;
const ANGULAR_DAMPING = 0.6;

/** A ceiling on speed, as insurance: nothing the game does comes near it. */
const MAX_SPEED = 6000;

/**
 * How stiff a contact is, as the frequency of the spring behind it.
 *
 * ⚠️ **This is what decides how far a heavy body sinks into a light one.** A
 * soft contact holds a load by being compressed, and the compression is the
 * load divided by the contact's mass and the square of this frequency - so it
 * is a Sun resting on Moons that sets the number, not a Moon on a Moon. Box2D
 * uses 30. Measured under a Sun and a Jupiter on a bed of small bodies, 30
 * left them up to 21% inside each other and 120 leaves half of one per cent.
 *
 * A contact with the well itself gets twice this, because a wall cannot give
 * way and so there is nothing to share the correction with.
 */
const CONTACT_HERTZ = 120;

/**
 * How damped the contact spring is. Far past critical on purpose: a contact
 * that rings is a contact that bounces, and the only bounce this well should
 * have is the one `RESTITUTION` asks for.
 */
const CONTACT_DAMPING = 10;

/**
 * The fastest a contact may push two overlapping bodies apart, in units a
 * second.
 *
 * Insurance rather than tuning. In play nothing overlaps far enough to reach
 * it, because a merged body only grows as fast as its neighbours make room
 * (`ROOM`). It is for the one overlap the game cannot avoid: a body dropped
 * into a well so full that it arrives inside another, which without a ceiling
 * would be fired back out at the speed of the overlap.
 */
const PUSH = 420;

/**
 * How far apart two bodies may be and still have a contact between them.
 *
 * ⚠️ **Speculative contacts are what make a landing a landing.** A contact
 * that only exists once two bodies overlap is always found one substep late,
 * with the faller already inside what it hit, and getting it back out is a
 * push - which reads as a bounce. A contact found while there is still a gap
 * lets the faller close exactly that gap and no more. It has to be wider than
 * one substep of the fastest fall, which is about seven units.
 */
const SPECULATIVE = 12;

/**
 * Friction between two bodies, and against the walls and the floor.
 *
 * Coulomb, against the real contact force, so a pile resting under its own
 * weight grips hard and two bodies grazing past each other barely at all. It
 * is measured between the two *surfaces*, spin included, so a body that is
 * rolling has no slip and nothing to brake, while one that is skidding is both
 * slowed and spun up until it rolls.
 */
const FRICTION = 0.5;
const WALL_FRICTION = 0.3;
const FLOOR_FRICTION = 0.6;

/**
 * Rolling resistance, as a share of the contact force times the radius.
 *
 * ⚠️ **Two kinds, and neither of them between two bodies at rest.** Friction
 * can only turn a skid into a roll - a rolling body has no slip left for it to
 * act on - so without rolling resistance a body that landed on the shoulder of
 * another rolled off it and on until it met a wall, 600 to 700 units away.
 *
 * `FLOOR_ROLLING` is the everyday kind, and only the floor has it: a body
 * rolling along the bottom slows and stops. `IMPACT_ROLLING` acts only on the
 * part of a contact's force that is an impact - whatever it presses with
 * beyond its running average, see `remember` - so a hard landing soaks up the
 * spin it arrived with, and a moment later the same contact holds nothing
 * back. Together they bring that same body to rest 73 to 228 units from the
 * one it hit.
 *
 * ⚠️ Between two bodies at rest there is none at all, because any is enough to
 * hold one body balanced on the crown of another - which is exactly what a
 * pile of planets must never do. See `settle`.
 */
const FLOOR_ROLLING = 0.2;
const IMPACT_ROLLING = 1;

/**
 * Tipping a body off the crown of another: how much of gravity pushes it
 * sideways, and how near the vertical its one support has to be for it to
 * count as a crown, as the cosine of the angle - twenty degrees.
 *
 * Measured over 88 drops of one body onto another near its top: without the
 * push, the 11 that landed dead centre stayed there for good and the rest took
 * up to 1.4s to roll off. With it, none stays, and the longest any sits on top
 * is half a second, landing included.
 */
const TIP = 0.4;
const CROWN = 0.94;

/**
 * How much of an approach comes back out of an impact. Rock on rock, so very
 * little: two planets meeting should stop, not clack. A body dropped from the
 * top onto the empty floor comes back up eight units, which is a give rather
 * than a bounce, and it is the only source of bounce in the solver.
 */
const RESTITUTION = 0.08;

/**
 * The slowest approach that bounces at all, in units a second.
 *
 * ⚠️ Without a threshold every resting contact bounces by a share of whatever
 * gravity gave it this substep, and a pile never quite stops moving. Below it
 * an arrival is simply an arrival.
 */
const BOUNCE_THRESHOLD = 150;

/**
 * The two limits on a warm start, which are what keep a heavy body from
 * bouncing off a light one. See `warm` for why.
 *
 * `REST_RATE` is how fast a contact's running average follows the force it
 * actually needs, per substep: slow enough that the spike of an impact never
 * reaches it, and fast enough that a new load is carried in a few steps.
 * `WARM_LIMIT` is how fast a warm start may leave a contact separating, in
 * units a second. Measured with an Earth dropped onto a Moon lying on the
 * floor: 258 to 543 units a second back up with neither, 167 to 410 with the
 * limit alone, 34 to 124 with both.
 */
const REST_RATE = 0.05;
const WARM_LIMIT = 30;

/* ---- Merging ------------------------------------------------------------- */

/**
 * How close two equal bodies have to be to become one, as a multiple of the
 * distance at which they touch.
 *
 * ⚠️ **Just over touching, and the margin is the whole point.** A contact
 * stops a body at the surface it hits, and a pile compresses its contacts by a
 * fraction of a unit - so a rule that asked for overlap would never fire. A
 * shade over contact means two that have come to rest against each other merge,
 * which is what a player is doing when they line them up.
 */
const MERGE_REACH = 1.02;

/**
 * How a merged body grows into its size in the solver.
 *
 * ⚠️ **It is born clear of everything and grows only as fast as there is room.**
 * A merged body sits where the two that made it met, which is exactly where a
 * third is most likely to be resting - in the notch between them - so born at
 * the size of the two it would start inside that third one, and growing on a
 * clock it would swallow it. Measured in play, that put bodies up to twice
 * their own radius inside a new one. So it starts at the largest size that
 * touches nothing (never less than `BORN_LEAST` of the two that made it), and
 * its growth pauses while any contact on it is deeper than `ROOM` of the
 * smaller body. The same play now peaks at a third.
 *
 * `GROW` is roughly how long the growth takes when nothing is in the way,
 * easing out, and `GROW_LEAST` the slowest it ever goes in units a second, so
 * it always finishes. Measured: half of all merges are at full size in 0.18s,
 * nine in ten in a third of a second.
 *
 * None of this is what is seen. The drawing has its own curve - see `SWELL`.
 */
const GROW = 0.24;
const GROW_LEAST = 60;
const BORN_LEAST = 0.35;
const ROOM = 0.2;

/**
 * How a merged body is drawn, which is not the size the solver has it at.
 *
 * It appears at `BORN_SCALE` of its size - already larger than either of the
 * two that made it - and swells a few per cent past full before settling, over
 * `SWELL_TIME`. Drawn from the solver's radius instead, a merge in a crowded
 * spot started at a third of the size and visibly inflated, which read as the
 * two bodies shrinking into something small rather than becoming something
 * bigger. The solver never sees any of this, so the swell cannot push anything.
 */
const BORN_SCALE = 0.86;
const SWELL = 0.07;
const SWELL_TIME = 0.34;

/** How long the two bodies of a merge take to slide into the one they become.
 *  Out of the simulation the instant they merge, so this is animation only. */
const FUSE = 0.13;

/**
 * The line: faster than `CALM`, a body above it is passing through rather than
 * resting there, and `PATIENCE` is how long a body that has landed may rest
 * above it before the well is full.
 *
 * Measured by piling bodies up in the middle as fast as the game allows: it
 * ends within half a second of the first body coming to rest above the line,
 * with at most one more drop in between - unless the pile slumps back under
 * it first, which is a reprieve rather than a miss. A body still falling into
 * the well has not landed, so it never counts, however far above the line.
 */
const CALM = 400;
const PATIENCE = 0.5;

/** How long the next body takes to appear in the aim once the last has gone. */
const ARRIVE = 0.24;

/**
 * The sky's parallax, in pixels at the nearest layer: how far it slides as the
 * aim crosses the whole well, how far it drifts on its own, and how quickly it
 * follows the aim, per second. Each layer is a twentieth of the well larger on
 * every side, and this stays inside that.
 */
const SKY_REACH = 26;
const SKY_DRIFT = 5;
const SKY_EASE = 3;

interface Body {
  id: number;
  tier: number;
  /** Current radius, which is not the tier's radius while a merge is growing. */
  r: number;
  /** What it is growing to. Equal to `r` for everything that was dropped. */
  full: number;
  /** The radius a merge started it at, or 0 for a body that was dropped. */
  from: number;
  x: number;
  y: number;
  /** Velocity in units a second, and spin in radians a second. The angle
   *  itself is never needed: a circle looks the same at every one of them. */
  vx: number;
  vy: number;
  w: number;
  /** Inverse mass and inverse moment of inertia, kept in step with `r`. */
  im: number;
  ii: number;
  /** Where the body was when this step began, so a frame can draw it part of
   *  the way to where it is now. */
  ox: number;
  oy: number;
  /** Where it was last drawn and at what scale, so a merge can start from
   *  exactly what was on the screen. */
  dx: number;
  dy: number;
  dk: number;
  /** Seconds lived, which a merged body's swell is drawn from. */
  age: number;
  /** How far the deepest contact on it overlaps, as a share of the smaller of
   *  the two bodies. */
  pressed: number;
  /** How many contacts are pressing on it, and the last of them. */
  held: number;
  on: Contact | null;
  /** Sideways push towards falling off a single support, as a sign. */
  lean: number;
  /** Whether it has touched anything since it was dropped, and how long it
   *  has spent resting above the line since it last went below it. */
  landed: boolean;
  above: number;
}

/** A body's side of the well, when the other half of a contact is the well. */
const LEFT = 0;
const RIGHT = 1;
const FLOOR = 2;

interface Contact {
  /** `null` when the other half of the contact is the well itself. */
  a: Body | null;
  b: Body;
  /** Which wall, when `a` is null. */
  side: number;
  /** From `a` towards `b`, unit length. */
  nx: number;
  ny: number;
  /** The gap between the two surfaces, negative when they overlap. */
  s: number;
  mu: number;
  /** The rolling resistance coefficient, and the lever it acts on, which
   *  follows a radius that may still be growing. */
  crr: number;
  lever: number;
  /** The impulses applied this substep, normal, friction and rolling, which
   *  are also what the next substep starts from. See `warm`. */
  ln: number;
  lt: number;
  lr: number;
  /** A slow running average of the normal impulse, which is what a warm start
   *  is allowed to reach. See `warm`. */
  rest: number;
  /** The largest normal impulse this step, and the approach speed when the
   *  step began - the two things a bounce is decided on. */
  top: number;
  vn0: number;
  /** The last pass and step this contact was found in. */
  pass: number;
  step: number;
}

interface Soft {
  rate: number;
  mass: number;
  impulse: number;
}

/**
 * The soft constraint coefficients for a spring of `hertz` and the damping
 * above, solved implicitly over one substep - which is why it is stable at any
 * stiffness the substep can resolve. The derivation is Box2D's.
 */
function soften(hertz: number): Soft {
  const omega = 2 * Math.PI * hertz;
  const a1 = 2 * CONTACT_DAMPING + H * omega;
  const a2 = H * omega * a1;
  const a3 = 1 / (1 + a2);
  return { rate: omega / a1, mass: a2 * a3, impulse: a3 };
}

const PAIR_SOFT = soften(CONTACT_HERTZ);
const WELL_SOFT = soften(CONTACT_HERTZ * 2);

/** The moments the well makes a sound. What each sounds like is in
 *  sounds.ts, and whether it is heard is the page's switch. */
export type Cue = 'drop' | 'merge' | 'nova' | 'star' | 'over';

export interface Options {
  root: HTMLElement;
  /** The clipped box. Measured, so the world can be scaled onto it. */
  field: HTMLElement;
  /** The layer inside it that carries the world transform. */
  world: HTMLElement;
  onScore(score: number, gained: number): void;
  onNext(tier: number): void;
  onState(state: 'playing' | 'over'): void;
  /** Biggest body reached, for the live region and the legend. */
  onReach(tier: number): void;
  /** `level` is the tier a merge made, so a bigger body sounds deeper. */
  onCue(cue: Cue, level?: number): void;
}

export interface Controller {
  restart(): void;
  destroy(): void;
}

export function mount(options: Options): Controller {
  const { root, field, world } = options;

  /* ---- State ------------------------------------------------------------- */

  let bodies: Body[] = [];
  const nodes = new Map<number, HTMLElement>();

  /** Every contact alive this substep, and all of them by pair, so the
   *  impulses a pair needed last substep are there to start from. */
  const contacts = new Map<number, Contact>();
  let live: Contact[] = [];
  let pass = 0;
  let steps = 0;

  /** The two halves of each merge, sliding into what they became. */
  interface Fusing {
    node: HTMLElement;
    x: number;
    y: number;
    /** What it slides into: the body it merged into, or a fixed point for a
     *  pair of Suns, which merge into nothing. */
    into: Body | null;
    tx: number;
    ty: number;
    full: number;
    k: number;
    t: number;
  }
  let fusing: Fusing[] = [];

  let nextId = 1;
  let score = 0;
  let best = 0;
  let claimed = false;
  let running = true;

  /** The one being aimed, which is not in the simulation until it is let go,
   *  and the one after it - which is what the Next readout shows, because the
   *  held one is already in plain sight at the top of the well. */
  let heldTier = pick();
  let nextTier = pick();
  let heldX = WORLD_W / 2;
  let ready = true;
  /** Frame time the held body arrived at, for the moment it takes to appear. */
  let heldSince = 0;

  const held = document.createElement('div');

  /*
   * Reduced motion drops what is only drawn - the two halves of a merge
   * sliding together, the swell, the next body arriving - and keeps what is
   * simulated, since a body that did not grow would not be a merge. It is read
   * here rather than left to the stylesheet for the reason 2048 gives: the
   * blanket rule at the end of global.css reaches CSS animations and nothing
   * this file writes.
   */
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function pick(): number {
    return Math.floor(Math.random() * DROPPABLE);
  }

  function state(): string {
    return root.dataset.state ?? 'playing';
  }

  /* ---- Bodies and their nodes -------------------------------------------- */

  /**
   * ⚠️ **Mass is the radius, not the area.** Area is the obvious choice and it
   * puts ninety Moons in a Sun and ten in an Earth, and a solver of this kind
   * converges on a heavy body resting on a light one about as slowly as the
   * ratio is large: an Earth dropped onto a Moon came back up at over a
   * thousand units a second. By radius the widest ratio in the game is a Sun
   * to a Moon at nine and a half, a big body still shoves a small one aside,
   * and the same drop comes back at a hundred. The moment of inertia is a
   * uniform disc's, half of mass times r squared.
   */
  function weigh(body: Body): void {
    const m = body.r;
    body.im = 1 / m;
    body.ii = 2 / (m * body.r * body.r);
  }

  function spawn(tier: number, x: number, y: number, vx = 0, vy = 0, from?: number): Body {
    const body: Body = {
      id: nextId++,
      tier,
      // A merge starts at the size `merge` found room for, and grows.
      r: from ?? RADII[tier],
      full: RADII[tier],
      from: from ?? 0,
      x,
      y,
      vx,
      vy,
      w: 0,
      im: 0,
      ii: 0,
      ox: x,
      oy: y,
      dx: x,
      dy: y,
      dk: 1,
      age: 0,
      pressed: 0,
      held: 0,
      on: null,
      lean: 0,
      landed: false,
      above: 0,
    };

    weigh(body);
    bodies.push(body);

    const node = document.createElement('div');
    node.className = 'acc-body';
    node.dataset.tier = String(tier);
    // Laid out at its full size and scaled from there, so the swell of a
    // merge is part of the transform the frame already writes and costs no
    // second style write.
    node.style.width = `${body.full * 2}px`;
    node.style.height = `${body.full * 2}px`;

    world.append(node);
    nodes.set(body.id, node);

    if (tier > best) {
      best = tier;
      options.onReach(best);
    }

    return body;
  }

  /**
   * ⚠️ **Written straight onto `transform`, not through a custom property.**
   *
   * The 2048 board does the opposite, and both are right: a tile moves a few
   * times a second and a custom property keeps the geometry declarative, while
   * these move sixty times a second and every property indirection is a style
   * recalculation on up to sixty elements. `translate3d` rather than
   * `translate` because it is the form that reliably lands on the compositor.
   *
   * ⚠️ **And never animated with the `scale` property on top.** The individual
   * transform properties apply before `transform`, so a `scale` keyframe on a
   * body scales its translation with it and slides the body towards the
   * corner of the well. Every change of size a body has is written here.
   *
   * `alpha` is how far the display is between the last step and the next, so
   * a 120Hz screen draws two positions per step rather than the same one twice.
   *
   * The size drawn is never the solver's. A dropped body is at its size from
   * the start, and a merged one follows the curve at `BORN_SCALE`.
   */
  function place(node: HTMLElement, body: Body, alpha: number): void {
    const x = body.ox + (body.x - body.ox) * alpha;
    const y = body.oy + (body.y - body.oy) * alpha;

    let k = 1;

    if (body.from > 0) {
      const t = still ? 1 : (body.age + alpha * STEP) / SWELL_TIME;
      const q = 1 - t;
      if (t < 1) k = 1 - (1 - BORN_SCALE) * q * q + SWELL * Math.sin(Math.PI * t);
    }

    body.dx = x;
    body.dy = y;
    body.dk = k;

    // Rounded, because a position of 5.218225851422176e-11 is a string the
    // browser has to parse sixty times a second to arrive at zero.
    const left = Math.round((x - body.full) * 100) / 100;
    const top = Math.round((y - body.full) * 100) / 100;

    /*
     * ⚠️ **The spin is simulated but not drawn, and that is deliberate.**
     *
     * Spin earns its place in the solver: friction measured between two
     * surfaces is what tells a roll from a skid. None of that needs the drawing
     * to turn, and drawing it looked wrong, because these are not featureless
     * balls. A ring and a set of cloud bands are set by a planet's axis, not by
     * which way it happens to have rolled, so a Saturn that came to rest at
     * ninety degrees read as broken rather than as turned.
     */
    node.style.transform =
      `translate3d(${left}px, ${top}px, 0)` + (k === 1 ? '' : ` scale(${Math.round(k * 1000) / 1000})`);
  }

  /**
   * Out of the simulation and into the one it became. It leaves the solver the
   * instant it merges, so nothing collides with something that is fading, and
   * its node slides from where it was last drawn into the new body's centre.
   */
  function fuse(body: Body, into: Body | null, tx: number, ty: number): void {
    const node = nodes.get(body.id);
    nodes.delete(body.id);
    if (!node) return;

    if (still) {
      node.remove();
      return;
    }

    fusing.push({ node, x: body.dx, y: body.dy, into, tx, ty, full: body.full, k: body.dk, t: 0 });
  }

  /* ---- One substep -------------------------------------------------------- */

  /** Growth runs on the substep, so the push it causes is spread as finely as
   *  the solver can spread it, and it waits while the body is pressed deeper
   *  than `ROOM` into anything. */
  function grow(): void {
    for (const body of bodies) {
      body.age += H;

      if (body.r < body.full && body.pressed < ROOM) {
        body.r = Math.min(body.full, body.r + Math.max(((body.full - body.r) * H * 3) / GROW, GROW_LEAST * H));
        weigh(body);
      }
    }
  }

  function accelerate(): void {
    const linear = 1 / (1 + H * LINEAR_DAMPING);
    const angular = 1 / (1 + H * ANGULAR_DAMPING);

    for (const body of bodies) {
      body.vy += GRAVITY * H;
      body.vx += body.lean * TIP * GRAVITY * H;
      body.vx *= linear;
      body.vy *= linear;
      body.w *= angular;

      const v2 = body.vx * body.vx + body.vy * body.vy;
      if (v2 > MAX_SPEED * MAX_SPEED) {
        const k = MAX_SPEED / Math.sqrt(v2);
        body.vx *= k;
        body.vy *= k;
      }
    }
  }

  function move(): void {
    for (const body of bodies) {
      body.x += body.vx * H;
      body.y += body.vy * H;
    }
  }

  /** The contact for a key, made if this is the first substep it exists in. */
  function contact(key: number, a: Body | null, b: Body, side: number, mu: number, crr: number): Contact {
    let c = contacts.get(key);

    if (!c) {
      c = {
        a,
        b,
        side,
        nx: 0,
        ny: 0,
        s: 0,
        mu,
        crr,
        lever: 0,
        ln: 0,
        lt: 0,
        lr: 0,
        rest: 0,
        top: 0,
        vn0: 0,
        pass: 0,
        step: -1,
      };
      contacts.set(key, c);
    }

    c.pass = pass;
    live.push(c);
    return c;
  }

  /** The lever rolling resistance acts on, which follows a growing radius, and
   *  the first time a contact is seen in a step, how fast the two were closing
   *  - which is what the bounce at the end of the step answers. */
  function begin(c: Contact): void {
    const a = c.a;
    c.lever = a ? (2 * a.r * c.b.r) / (a.r + c.b.r) : c.b.r;

    if (c.step === steps) return;
    c.step = steps;
    c.top = 0;
    c.vn0 = approach(c);
  }

  /** How fast the two halves of a contact are closing along its normal, which
   *  is negative when they are. */
  function approach(c: Contact): number {
    const a = c.a;
    return (c.b.vx - (a ? a.vx : 0)) * c.nx + (c.b.vy - (a ? a.vy : 0)) * c.ny;
  }

  /** An impulse along the normal, the tangent and the spin, applied to both
   *  halves of a contact in the proportions their masses answer it with. */
  function impulse(c: Contact, n: number, t: number, r: number): void {
    const a = c.a;
    const b = c.b;
    const px = n * c.nx + t * c.ny;
    const py = n * c.ny - t * c.nx;

    if (a) {
      a.vx -= a.im * px;
      a.vy -= a.im * py;
      a.w += a.ii * (a.r * t - r);
    }

    b.vx += b.im * px;
    b.vy += b.im * py;
    b.w += b.ii * (b.r * t + r);
  }

  /**
   * Every pair within reach, and every body within reach of the well.
   *
   * All pairs, which is cheaper than it sounds. A well this size holds about
   * forty bodies, so a pass is eight hundred squared-distance tests with no
   * square root on the miss. A grid would be the right answer at ten times the
   * count and the wrong one here: it costs more to maintain than it saves.
   *
   * Found afresh every substep rather than once a step. Circles make it cheap,
   * and it means a contact's normal is always the true line between two
   * centres rather than one that was true a substep ago.
   */
  function gather(): void {
    pass++;
    live = [];

    for (let i = 0; i < bodies.length; i++) {
      const a = bodies[i];

      for (let j = i + 1; j < bodies.length; j++) {
        const b = bodies[j];

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const reach = a.r + b.r + SPECULATIVE;
        const d2 = dx * dx + dy * dy;

        if (d2 >= reach * reach || d2 === 0) continue;

        const d = Math.sqrt(d2);
        // Ids only ever rise and the array keeps its order, so `a` always has
        // the lower one and a pair has one key.
        const c = contact(a.id * 1048576 + b.id, a, b, 0, FRICTION, 0);
        c.nx = dx / d;
        c.ny = dy / d;
        c.s = d - a.r - b.r;
        begin(c);
      }

      if (a.x - a.r < SPECULATIVE) {
        const c = contact(-4 * a.id - LEFT, null, a, LEFT, WALL_FRICTION, 0);
        c.nx = 1;
        c.ny = 0;
        c.s = a.x - a.r;
        begin(c);
      }

      if (WORLD_W - a.x - a.r < SPECULATIVE) {
        const c = contact(-4 * a.id - RIGHT, null, a, RIGHT, WALL_FRICTION, 0);
        c.nx = -1;
        c.ny = 0;
        c.s = WORLD_W - a.x - a.r;
        begin(c);
      }

      if (WORLD_H - a.y - a.r < SPECULATIVE) {
        const c = contact(-4 * a.id - FLOOR, null, a, FLOOR, FLOOR_FRICTION, FLOOR_ROLLING);
        c.nx = 0;
        c.ny = -1;
        c.s = WORLD_H - a.y - a.r;
        begin(c);
      }
    }

    // A pair that has drifted out of reach takes its impulses with it.
    for (const [key, c] of contacts) if (c.pass !== pass) contacts.delete(key);
  }

  /** The gaps again, after the bodies have moved, for the relax - and how
   *  deep each body is pressed into anything, for the growth. */
  function refresh(): void {
    for (const body of bodies) body.pressed = 0;

    for (const c of live) {
      const a = c.a;
      const b = c.b;

      if (a) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > 0) {
          c.nx = dx / d;
          c.ny = dy / d;
        }
        c.s = d - a.r - b.r;
      } else if (c.side === LEFT) c.s = b.x - b.r;
      else if (c.side === RIGHT) c.s = WORLD_W - b.x - b.r;
      else c.s = WORLD_H - b.y - b.r;

      if (c.s < 0) {
        const depth = -c.s / (a ? Math.min(a.r, b.r) : b.r);
        if (depth > b.pressed) b.pressed = depth;
        if (a && depth > a.pressed) a.pressed = depth;
      }
    }
  }

  /**
   * Last substep's impulses, applied again before anything is solved.
   *
   * This is most of the solver's convergence for free: a pile at rest needs
   * almost exactly what it needed a moment ago, and without it a Sun on a bed
   * of Moons sinks a Moon deep and trembles at fifty units a second.
   *
   * ⚠️ **But not an impact, and keeping it out is what stopped heavy bodies
   * bouncing.** An impact is one enormous impulse that is needed once. Applied
   * again to two bodies that are no longer closing, it throws them apart, and
   * the solver can only take it back as fast as the lighter of the two allows
   * - a small share per pass for an Earth on a Moon - so for several substeps
   * the Earth is shoved upwards and leaves at a fair part of the speed it
   * arrived at. Nor does the spike stay with the pair that collided: the Moon
   * is stopped against the floor at the end of every substep, so the floor
   * contact carries the Earth's whole arrival while looking like a contact at
   * rest.
   *
   * So two limits. A warm start can be no larger than the contact's running
   * average (see `remember`), which a steady load reaches and a spike never
   * does. And any contact the warm start still leaves separating faster than
   * `WARM_LIMIT` gets the excess back, friction and rolling with it in
   * proportion. The measurements are at `REST_RATE`.
   */
  function warm(): void {
    for (const c of live) {
      const f = c.ln > c.rest ? c.rest / c.ln : 1;
      c.ln *= f;
      c.lt *= f;
      c.lr *= f;
      impulse(c, c.ln, c.lt, c.lr);
    }

    for (const c of live) {
      if (c.ln === 0) continue;

      const excess = approach(c) - WARM_LIMIT;
      if (excess <= 0) continue;

      const take = Math.min(1, excess / (c.ln * ((c.a ? c.a.im : 0) + c.b.im)));
      impulse(c, -c.ln * take, -c.lt * take, -c.lr * take);
      c.ln -= c.ln * take;
      c.lt -= c.lt * take;
      c.lr -= c.lr * take;
    }
  }

  /** Each contact's running average of the force it needs, for `warm` to be
   *  held to and for `IMPACT_ROLLING` to measure an impact against. */
  function remember(): void {
    for (const c of live) c.rest += (c.ln - c.rest) * REST_RATE;
  }

  /**
   * What each body is resting on, now that the substep is solved: whether it
   * has landed, and whether it is balanced on the crown of a single other body.
   *
   * ⚠️ **A body on the crown of another is tipped off it.** The balance is real
   * - a sphere on the very top of another has no sideways force on it anywhere
   * - but it is unstable, and the time it takes to fall grows with how exactly
   * it was aligned: well over a second from a hair off, and for ever from dead
   * centre. In a game that reads as a body stuck in the air. So a body pressed
   * by one contact only, whose other half is within twenty degrees of straight
   * below it, is pushed sideways, towards the side it already leans to. A body
   * held by two contacts, or by one and a wall, is resting in a notch and is
   * left alone. The measurements are at `TIP`.
   */
  function settle(): void {
    for (const body of bodies) {
      body.held = 0;
      body.on = null;
    }

    for (const c of live) {
      if (c.ln <= 0) continue;
      c.b.held++;
      c.b.on = c;
      c.b.landed = true;
      if (c.a) {
        c.a.held++;
        c.a.on = c;
        c.a.landed = true;
      }
    }

    for (const body of bodies) {
      body.lean = 0;
      const c = body.on;
      if (body.held !== 1 || !c || !c.a) continue;

      // The direction from the support to this body.
      const up = c.b === body ? 1 : -1;
      const ux = c.nx * up;
      const uy = c.ny * up;
      if (uy > -CROWN) continue;

      body.lean = ux > 0 ? 1 : ux < 0 ? -1 : body.id % 2 ? 1 : -1;
    }
  }

  /**
   * One pass over every contact: the normal, then friction, then rolling
   * resistance, each as an impulse clamped against what it has already applied
   * this substep.
   *
   * With `push` the normal is the soft spring, which may push an overlap apart
   * at up to `PUSH`. Without it - the relax - it is rigid and only stops the two
   * closing, which is what takes back the speed the push gave them.
   *
   * The tangent is the normal turned a quarter, and the surface speed along it
   * includes each body's spin at its rim, which is what makes friction act on
   * slip rather than on motion.
   */
  function solve(push: boolean): void {
    for (const c of live) {
      const a = c.a;
      const b = c.b;

      const am = a ? a.im : 0;
      const ai = a ? a.ii : 0;
      const ar = a ? a.r : 0;
      let avx = a ? a.vx : 0;
      let avy = a ? a.vy : 0;
      let aw = a ? a.w : 0;
      let bvx = b.vx;
      let bvy = b.vy;
      let bw = b.w;

      const nx = c.nx;
      const ny = c.ny;
      const tx = ny;
      const ty = -nx;

      // Not touching yet: allowed to close exactly the gap in one substep and
      // no further, which is a speculative contact. Touching: pushed apart,
      // softly and no faster than `PUSH`, but only on the first pass.
      let bias = 0;
      let scale = 1;
      let keep = 0;

      if (c.s > 0) bias = c.s / H;
      else if (push) {
        const soft = a ? PAIR_SOFT : WELL_SOFT;
        bias = Math.max(soft.rate * c.s, -PUSH);
        scale = soft.mass;
        keep = soft.impulse;
      }

      const vn = (bvx - avx) * nx + (bvy - avy) * ny;
      let dn = (-scale * (vn + bias)) / (am + b.im) - keep * c.ln;
      const ln = Math.max(c.ln + dn, 0);
      dn = ln - c.ln;
      c.ln = ln;
      if (dn > c.top) c.top = dn;

      avx -= am * dn * nx;
      avy -= am * dn * ny;
      bvx += b.im * dn * nx;
      bvy += b.im * dn * ny;

      // Friction, capped by the normal impulse just solved.
      const vt = (bvx - avx) * tx + (bvy - avy) * ty + bw * b.r + aw * ar;
      let dt = -vt / (am + b.im + ai * ar * ar + b.ii * b.r * b.r);
      const cap = c.mu * c.ln;
      const lt = Math.min(Math.max(c.lt + dt, -cap), cap);
      dt = lt - c.lt;
      c.lt = lt;

      avx -= am * dt * tx;
      avy -= am * dt * ty;
      aw += ai * ar * dt;
      bvx += b.im * dt * tx;
      bvy += b.im * dt * ty;
      bw += b.ii * b.r * dt;

      // Rolling resistance: against the two spinning relative to each other,
      // up to `crr` of the whole force, which only the floor has, and
      // `IMPACT_ROLLING` of whatever part of it is an impact.
      let dr = -(bw - aw) / (ai + b.ii);
      const reach = c.lever * (c.crr * c.ln + IMPACT_ROLLING * Math.max(0, c.ln - c.rest));
      const lr = Math.min(Math.max(c.lr + dr, -reach), reach);
      dr = lr - c.lr;
      c.lr = lr;

      aw -= ai * dr;
      bw += b.ii * dr;

      if (a) {
        a.vx = avx;
        a.vy = avy;
        a.w = aw;
      }

      b.vx = bvx;
      b.vy = bvy;
      b.w = bw;
    }
  }

  /**
   * The bounce, once per step, after everything else.
   *
   * Only for a contact that was closing faster than `BOUNCE_THRESHOLD` when the
   * step began and actually pushed back during it. What it sets is the speed
   * the two leave at - `RESTITUTION` of the one they arrived at - so it cannot
   * add anything to a contact that is merely resting.
   */
  function bounce(): void {
    for (const c of live) {
      if (c.vn0 > -BOUNCE_THRESHOLD || c.top === 0) continue;

      const a = c.a;
      const b = c.b;
      const am = a ? a.im : 0;

      const vn = (b.vx - (a ? a.vx : 0)) * c.nx + (b.vy - (a ? a.vy : 0)) * c.ny;
      let dn = -(vn + RESTITUTION * c.vn0) / (am + b.im);
      const ln = Math.max(c.ln + dn, 0);
      dn = ln - c.ln;
      c.ln = ln;

      if (a) {
        a.vx -= am * dn * c.nx;
        a.vy -= am * dn * c.ny;
      }

      b.vx += b.im * dn * c.nx;
      b.vy += b.im * dn * c.ny;
    }
  }

  /* ---- Merging ------------------------------------------------------------ */

  /**
   * Equal bodies that have reached each other.
   *
   * Collected first and applied after, because a merge changes the array while
   * the search is walking it - and because a three-way pile-up has to resolve
   * as one merge and a leftover, not as two merges sharing a body.
   */
  function merge(): void {
    const spent = new Set<number>();
    const pairs: [Body, Body][] = [];

    for (let i = 0; i < bodies.length; i++) {
      const a = bodies[i];
      if (spent.has(a.id)) continue;

      for (let j = i + 1; j < bodies.length; j++) {
        const b = bodies[j];
        if (b.tier !== a.tier || spent.has(b.id)) continue;

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const reach = (a.r + b.r) * MERGE_REACH;

        if (dx * dx + dy * dy > reach * reach) continue;

        spent.add(a.id);
        spent.add(b.id);
        pairs.push([a, b]);
        break;
      }
    }

    if (pairs.length === 0) return;

    bodies = bodies.filter((body) => !spent.has(body.id));

    let gained = 0;
    /** The biggest body this pass made, which is the one that is heard - two
     *  merges on one frame are one sound, and the larger is the event. */
    let loudest = -1;

    for (const [a, b] of pairs) {
      const x = (a.x + b.x) / 2;
      const y = (a.y + b.y) / 2;

      // Two Suns have nowhere to go, so they go off. The blank left behind is
      // the only way a full well ever empties, and it is why reaching the end
      // of the sequence is a move rather than a trophy.
      if (a.tier === TIERS - 1) {
        const dx = (a.dx + b.dx) / 2;
        const dy = (a.dy + b.dy) / 2;
        fuse(a, null, dx, dy);
        fuse(b, null, dx, dy);
        gained += NOVA_POINTS;
        nova(dx, dy);
        options.onCue('nova');
        continue;
      }

      // Born at the largest size that touches nothing around it, for the
      // reason at `GROW`, and never smaller than `BORN_LEAST` of the two.
      let from = Math.min(a.r, x, WORLD_W - x, WORLD_H - y);
      for (const n of bodies) {
        const gap = Math.sqrt((n.x - x) * (n.x - x) + (n.y - y) * (n.y - y)) - n.r;
        if (gap < from) from = gap;
      }

      const born = spawn(
        a.tier + 1,
        x,
        y,
        (a.vx + b.vx) / 2,
        (a.vy + b.vy) / 2,
        Math.max(from, a.r * BORN_LEAST),
      );
      born.w = (a.w + b.w) / 2;
      // Where the pair was when the step began, so the new body is drawn on
      // from exactly where the two of them were rather than jumping to the
      // end of the step.
      born.ox = (a.ox + b.ox) / 2;
      born.oy = (a.oy + b.oy) / 2;
      born.dx = (a.dx + b.dx) / 2;
      born.dy = (a.dy + b.dy) / 2;

      fuse(a, born, 0, 0);
      fuse(b, born, 0, 0);
      ring(born);

      gained += points(born.tier);
      loudest = Math.max(loudest, born.tier);

      // The first Sun is heard and celebrated, and nothing else: no panel
      // and no pause, so the game carries straight on around it.
      if (born.tier === TIERS - 1 && !claimed) {
        claimed = true;
        options.onCue('star');
      }
    }

    if (loudest >= 0) options.onCue('merge', loudest);

    score += gained;
    options.onScore(score, gained);
  }

  /**
   * The ring a merge sends out from the rim of what it made, in that body's own
   * colour. Purely a node, removed by its own animation.
   *
   * ⚠️ **Placed with `translate`, not `transform`**, because its keyframes use
   * `scale`, and `scale` applies after `translate` but before `transform` - so
   * placed this way it grows about its own centre, and placed by `transform` it
   * would drift away from the corner of the well as it grew.
   */
  function ring(body: Body): void {
    const node = document.createElement('div');
    node.className = 'acc-ring';
    node.style.setProperty('--acc-tint', `var(--acc-p${body.tier})`);
    node.style.width = `${body.full * 2}px`;
    node.style.height = `${body.full * 2}px`;
    node.style.translate = `${Math.round(body.dx - body.full)}px ${Math.round(body.dy - body.full)}px`;
    node.addEventListener('animationend', () => node.remove());

    world.append(node);
    window.setTimeout(() => node.remove(), 800);
  }

  /** The flash two Suns leave behind, placed the way `ring` is and for the
   *  same reason. Nothing in the simulation knows it happened. */
  function nova(x: number, y: number): void {
    const burst = document.createElement('div');
    burst.className = 'acc-nova';
    burst.style.translate = `${Math.round(x)}px ${Math.round(y)}px`;
    burst.addEventListener('animationend', () => burst.remove());

    world.append(burst);
    window.setTimeout(() => burst.remove(), 1200);
  }

  /* ---- Losing ------------------------------------------------------------- */

  /**
   * The well is full when something has been sitting above the line.
   *
   * ⚠️ Both halves of that matter. A body falling into the well passes above
   * the line by definition, so it only counts once it has landed on something,
   * and a fast one is being thrown rather than resting. Half a second of
   * patience is what stops a splash on a tall pile from ending a game the
   * player was winning, and it is short enough that at most one more body
   * gets dropped onto the pile that ended it.
   */
  function check(): void {
    let longest = 0;

    for (const body of bodies) {
      if (!body.landed || body.y - body.r > LOSS_Y) {
        body.above = 0;
        continue;
      }

      // ⚠️ A jolt pauses the count and never restarts it. Reset on speed,
      // every body dropped onto a pile that had already crossed the line
      // knocked the ones above it back to zero, and a player dropping fast
      // could keep a lost game going for five seconds and seventeen drops.
      if (body.vx * body.vx + body.vy * body.vy < CALM * CALM) body.above += STEP;
      if (body.above > longest) longest = body.above;
    }

    // A warning before the verdict: the line goes red the moment something
    // rests above it, which is the difference between losing and being told
    // you are about to.
    if (longest > 0) root.dataset.full = '';
    else delete root.dataset.full;

    if (longest > PATIENCE) {
      options.onCue('over');
      options.onState('over');
    }
  }

  function step(): void {
    steps++;

    for (const body of bodies) {
      body.ox = body.x;
      body.oy = body.y;
    }

    for (let i = 0; i < SUBSTEPS; i++) {
      /*
       * ⚠️ **Merging runs inside the substep loop, before anything separates
       * them.** Checked once a frame, two equal bodies would meet, be held
       * apart by every substep in between, and only then become one - so a
       * merge would visibly be a collision followed by a merge. Checked first,
       * they never touch: the instant they reach each other they are one body.
       */
      merge();
      grow();
      accelerate();
      gather();
      warm();
      solve(true);
      move();
      refresh();
      solve(false);
      remember();
      settle();
    }

    bounce();
    check();
  }

  /* ---- The frame ---------------------------------------------------------- */

  let frame = 0;
  let last = 0;
  let carry = 0;

  function tick(now: number): void {
    frame = requestAnimationFrame(tick);

    const elapsed = last === 0 ? 0 : (now - last) / 1000;
    last = now;

    if (state() === 'playing') {
      carry = Math.min(carry + elapsed, STEP * MAX_STEPS);

      while (carry >= STEP) {
        step();
        carry -= STEP;
      }
    }

    const alpha = carry / STEP;

    for (const body of bodies) {
      const node = nodes.get(body.id);
      if (node) place(node, body, alpha);
    }

    paintFusing(elapsed);
    paintHeld(now);
    paintSky(now, elapsed);
  }

  /**
   * The two halves of each merge, sliding together into the body they made
   * and fading as they go. They are behind it in the DOM, so what is seen is
   * the new body swelling over two that are closing into its centre.
   */
  function paintFusing(elapsed: number): void {
    if (fusing.length === 0) return;

    fusing = fusing.filter((f) => {
      f.t += elapsed;
      const p = f.t / FUSE;

      if (p >= 1) {
        f.node.remove();
        return false;
      }

      // Fast to start and soft to land, so the two close on each other at once
      // rather than drifting together.
      const e = 1 - (1 - p) * (1 - p);
      const tx = f.into ? f.into.dx : f.tx;
      const ty = f.into ? f.into.dy : f.ty;
      const x = f.x + (tx - f.x) * e;
      const y = f.y + (ty - f.y) * e;
      const k = f.k * (1 - 0.4 * e);

      f.node.style.transform =
        `translate3d(${Math.round((x - f.full) * 100) / 100}px, ${Math.round((y - f.full) * 100) / 100}px, 0) ` +
        `scale(${Math.round(k * 1000) / 1000})`;
      f.node.style.opacity = String(Math.round((1 - p * p) * 100) / 100);
      return true;
    });
  }

  /* ---- The sky ------------------------------------------------------------ */

  /**
   * The layers behind the well, each moved by how near it is.
   *
   * The aim is the camera: as it crosses the well the near stars slide the
   * other way further than the far ones, which is parallax and is the whole of
   * the depth. A slow drift on top keeps it from ever being quite still. The
   * layers are the page's, found by `data-depth`, and a page without them has
   * a flat sky and nothing else changes.
   */
  const sky = [...field.querySelectorAll<HTMLElement | SVGElement>('[data-depth]')].map((node) => ({
    node,
    depth: Number(node.dataset.depth) || 0,
  }));

  /** Where the camera is, eased towards the aim so a jump reads as a pan. */
  let look = 0;

  function paintSky(now: number, elapsed: number): void {
    if (still || sky.length === 0) return;

    look += (heldX / WORLD_W - 0.5 - look) * Math.min(1, elapsed * SKY_EASE);

    const t = now / 1000;
    const x = -look * SKY_REACH + Math.sin(t * 0.13) * SKY_DRIFT;
    const y = Math.cos(t * 0.09) * SKY_DRIFT;

    for (const layer of sky) {
      layer.node.style.transform = `translate3d(${(x * layer.depth).toFixed(2)}px, ${(y * layer.depth).toFixed(2)}px, 0)`;
    }
  }

  /* ---- Aiming and dropping ------------------------------------------------ */

  function paintHeld(now: number): void {
    const r = RADII[heldTier];
    const x = Math.min(Math.max(heldX, r), WORLD_W - r);

    // The next body arrives rather than appearing: a quick overshoot from
    // nearly nothing, drawn into the transform like every other size here.
    const p = still ? 1 : Math.min(1, Math.max(0, (now - heldSince) / 1000 / ARRIVE));
    const q = p - 1;
    const k = p >= 1 ? 1 : 0.35 + 0.65 * (1 + 2.7 * q * q * q + 1.7 * q * q);

    held.dataset.tier = String(heldTier);
    held.style.width = `${r * 2}px`;
    held.style.height = `${r * 2}px`;
    held.style.transform =
      `translate3d(${x - r}px, ${DROP_Y - r}px, 0)` + (k === 1 ? '' : ` scale(${Math.round(k * 1000) / 1000})`);
  }

  function aim(clientX: number): void {
    const box = field.getBoundingClientRect();
    if (box.width === 0) return;

    heldX = ((clientX - box.left) / box.width) * WORLD_W;
  }

  function drop(): void {
    if (!ready || state() !== 'playing') return;

    const r = RADII[heldTier];
    const x = Math.min(Math.max(heldX, r), WORLD_W - r);

    spawn(heldTier, x, DROP_Y);
    options.onCue('drop');

    ready = false;
    delete root.dataset.ready;

    // A pause between drops, not a cooldown on the animation: without it a
    // held button stacks four bodies in the same place and the pile explodes
    // outward as the solver untangles them.
    window.setTimeout(() => {
      if (!running) return;
      heldTier = nextTier;
      nextTier = pick();
      heldSince = last;
      ready = true;
      root.dataset.ready = '';
      options.onNext(nextTier);
    }, 300);
  }

  /* ---- Fitting the world to the box --------------------------------------- */

  /**
   * One transform on one element carries the whole board onto whatever width
   * it has been given, so nothing inside it ever recomputes on a resize - not
   * the bodies, not the solver, not a single radius.
   */
  const fit = () => {
    const width = field.clientWidth;
    if (width > 0) world.style.setProperty('--acc-scale', String(width / WORLD_W));
  };

  const watcher = new ResizeObserver(fit);
  watcher.observe(field);

  /* ---- Input --------------------------------------------------------------- */

  const onPointerMove = (event: PointerEvent) => aim(event.clientX);

  const onPointerDown = (event: PointerEvent) => {
    // Not on the panel over the board, and not on a button inside it.
    if (event.target instanceof Element && event.target.closest('button')) return;
    aim(event.clientX);
  };

  const onPointerUp = (event: PointerEvent) => {
    if (event.target instanceof Element && event.target.closest('button')) return;
    drop();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (document.activeElement instanceof HTMLButtonElement) return;

    // An eighteenth of the well per press, so crossing it is a handful of
    // presses rather than a hundred, and a held key still lands where the eye
    // expects.
    const stride = WORLD_W / 18;

    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      event.preventDefault();
      heldX -= stride;
      return;
    }

    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      event.preventDefault();
      heldX += stride;
      return;
    }

    if (event.code === 'Space' || event.code === 'Enter' || event.code === 'ArrowDown') {
      event.preventDefault();
      drop();
    }
  };

  /* ---- Starting over -------------------------------------------------------- */

  function restart(): void {
    for (const node of nodes.values()) node.remove();
    nodes.clear();
    for (const f of fusing) f.node.remove();
    fusing = [];
    contacts.clear();
    live = [];

    bodies = [];
    score = 0;
    best = 0;
    claimed = false;
    carry = 0;

    heldTier = pick();
    nextTier = pick();
    heldX = WORLD_W / 2;
    heldSince = last;
    ready = true;

    root.dataset.ready = '';
    delete root.dataset.full;

    options.onState('playing');
    options.onScore(0, 0);
    options.onNext(nextTier);
    options.onReach(0);
  }

  held.className = 'acc-body acc-held';
  world.append(held);

  field.addEventListener('pointermove', onPointerMove);
  field.addEventListener('pointerdown', onPointerDown);
  field.addEventListener('pointerup', onPointerUp);
  window.addEventListener('keydown', onKeyDown);

  fit();
  restart();
  frame = requestAnimationFrame(tick);

  return {
    restart,

    destroy() {
      running = false;
      cancelAnimationFrame(frame);
      watcher.disconnect();
      field.removeEventListener('pointermove', onPointerMove);
      field.removeEventListener('pointerdown', onPointerDown);
      field.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
    },
  };
}
