/**
 * Accretion.
 *
 * Bodies fall into a well, and two of the same merge into the next one up:
 * Moon, Mercury, Mars, Venus, Earth, Neptune, Uranus, Saturn, Jupiter, Sun.
 * Accretion is the process that actually builds a planet out of smaller bodies,
 * so the name and the rule are the same statement.
 *
 * ⚠️ **This is the only game here with a solver in it**, and it is written from
 * scratch rather than pulled in. A physics library would be six times the whole
 * page. What the game needs is circles, gravity, a floor and spin, with no
 * polygons, no joints and no continuous collision, and that is a hundred lines
 * of position-based dynamics.
 *
 * The method is **Verlet integration with small substeps**. Position is the
 * state and velocity is implied by the last position, which is why a pile of
 * these settles instead of humming: a contact that pushes a body out also
 * removes exactly the velocity that drove it in, for free, without an impulse
 * ever being calculated. Forty substeps a frame with one relaxation pass each
 * is far more stable than one step with forty passes, because every contact is
 * re-evaluated against positions that have already moved.
 *
 * ⚠️ **Bodies rotate, and adding that fixed two things at once.** Angle is
 * integrated exactly like position, friction is measured between the two
 * *surfaces* rather than the two centres, and the impulse that slows a skid
 * also spins it up. Without it the solver could not tell rolling from sliding,
 * so it braked both: a body took nearly a second to roll off another instead
 * of a third of one, and a glancing hit had nowhere to put its energy except
 * sideways flight, which sent the body it struck 521 units across a field 1200
 * wide. With it, six.
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
 * The ten bodies, by radius, in a well a thousand units wide.
 *
 * ⚠️ **The order is the solar system, the sizes are the genre's.** Real
 * diameters put Venus and Earth within 5% of each other and Neptune and Uranus
 * within 3%, which in a merge game is unreadable - the whole thing depends on
 * telling one step from the next at a glance and at speed.
 *
 * The proportions are taken from the game that defined this shape rather than
 * invented. Two things matter and the first version got both wrong. The range
 * is nine and a half to one, not five: the largest body is 57% of the width of
 * the well, so two of them cannot sit side by side and the endgame is a real
 * squeeze. And the early steps are the big ones - 1.47 and 1.36 - tapering to
 * about 1.24, because the first merges have to be visibly worth making while
 * the last ones are already enormous.
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
 * One frame of simulation, fixed, regardless of what the display is doing.
 *
 * A solver fed the real frame time is a solver whose behaviour changes on a
 * slow phone, and a long frame - a tab coming back to the front - would step
 * bodies straight through each other. The accumulator below runs whole steps
 * and drops the rest on the floor.
 */
const STEP = 1 / 60;

/** Never more than this many steps for one frame. Coming back from a
 *  backgrounded tab is a skipped second, not a second to catch up on. */
const MAX_STEPS = 4;

/**
 * Substeps per step, and the cheapest quality in the file.
 *
 * Contacts are re-solved against positions that have already moved, so a stack
 * settles instead of trembling, and it is what lets the solver keep up when
 * bodies are dropped as fast as the game allows. Measured: at 28 substeps fast
 * play leaves bodies 7% inside each other, at 40 it is 2%. A full board costs
 * well under a tenth of a millisecond a frame against a budget of 16.7, so
 * there is no reason to be shy about it.
 */
const SUBSTEPS = 40;

/**
 * World units per second squared.
 *
 * ⚠️ **Raising this needs `MAX_PUSH` and `SUBSTEPS` raised with it.** Faster
 * bodies arrive deeper into each other, and a solver left at the old settings
 * cannot dig them out again: measured under fast play, going from 3000 to 4500
 * alone took the worst overlap from 16% to 63%, and giving the solver the room
 * to keep up brought it down to 2%. Past 4500 the well stops settling however
 * much room it is given.
 */
const GRAVITY = 4500;

/**
 * How much of its speed a body keeps over one second of flight.
 *
 * ⚠️ **Expressed per second and converted, never written as a per-substep
 * figure.** It was a per-substep constant, and when the substeps went from 8 to
 * 28 for stability the damping silently went with them: 0.9985 applied 1680
 * times a second leaves 8% of the speed, so a body dropped from the top of the
 * well was still only halfway down a full second later. The whole board moved
 * like it was under water, and it looked like the physics was broken because
 * it was.
 *
 * Almost none, because there is no air in here and nothing about a falling
 * planet should slow it. Settling is the separation's job, not drag's.
 */
const KEPT_PER_SECOND = 0.92;

const DAMPING = Math.pow(KEPT_PER_SECOND, 1 / (60 * SUBSTEPS));

/**
 * How much of its spin a body keeps over a second.
 *
 * ⚠️ **Rolling resistance, and read the note on `GROUND_KEPT_PER_SECOND`
 * first: these two only do anything together.** The floor turns a skid into a
 * roll and this is the only thing that slows a roll, so weakening one while
 * the other stays strong changes almost nothing. It is the counterpart to the
 * linear damping above and, like it, can only ever take energy out.
 */
const SPIN_KEPT_PER_SECOND = 0.0005;

const SPIN_DAMPING = Math.pow(SPIN_KEPT_PER_SECOND, 1 / (60 * SUBSTEPS));

/**
 * How much of an overlap a contact removes in one pass.
 *
 * ⚠️ Under one on purpose. Solving a contact completely makes every other
 * contact on the same body wrong by exactly as much, and a body wedged between
 * three others then oscillates between three perfect answers. Leaving a fifth
 * of the error for the next substep is what converges instead.
 */
const RESPONSE = 0.8;

/**
 * How fast a merged body reaches its full size, per frame.
 *
 * ⚠️ **This is what stopped merges from throwing the pile across the well.** A
 * body that appears at full size appears inside its neighbours, sometimes by
 * half a radius, and a solver asked to fix that in one frame does it by firing
 * them apart. Growing over about a fifth of a second lets the same correction
 * happen a little at a time, which is also what makes a merge read as two
 * things becoming one rather than as a swap.
 */
const GROW = 0.22;

/**
 * How far off the aimed spot a body actually enters the well.
 *
 * Two dropped on exactly the same place land exactly on top of each other, and
 * a sphere on the pole of another has no sideways force anywhere in the
 * arrangement: it stands there like a snowman. Real balls never meet that case
 * because nothing is ever exactly aligned.
 *
 * How big it is decides how fast the upper one leaves, because a body a hair
 * off the pole is pulled sideways by almost nothing. Measured, the time to roll
 * clear: 1.15s at 3 units, 0.92s at 15, 0.82s at 40. Fifteen is about six
 * pixels on a real board, well inside how accurately a well this wide can be
 * aimed at, and past it the gain is small while the aim starts to drift.
 */
const JITTER = 30;

/**
 * The coefficient of friction between two bodies.
 *
 * ⚠️ **Read the note on `LEAN` above before touching this.** On its own,
 * friction is the thing that lets a pile build and the thing that leaves a
 * body of radius 76 balanced on one of radius 30 for ever - the same effect
 * from two sides. Measured over 44 trials of one body dropped onto another,
 * 40 of them ended balanced at 0.15 and none at 0, but with none a pile never
 * builds either and dumping everything down one column survives 148 drops
 * instead of 22.
 *
 * Fading it out near the pole is what separated the two, so this can now be
 * high enough to hold a pile: none of the 44 end balanced, and dumping is
 * still worse than aiming.
 */
const FRICTION = 0.12;

/** How much of an approach comes back out of a collision. Rock on rock, so
 *  almost none: two planets meeting should stop, not clack. */
const RESTITUTION = 0.06;

/**
 * The most one contact may move a body in one substep.
 *
 * ⚠️ **A ceiling on the solver's strength, so it has to be above what the
 * game actually asks of it.** At 2.5 it was the limit rather than the
 * insurance it was meant to be: under fast play the well could not dig itself
 * out and bodies sat 63% inside each other. At 8 the same play leaves 2%.
 */
const MAX_PUSH = 8;

/**
 * How much of its rolling a body keeps over a second of lying on the floor.
 *
 * Unlike everything else here this acts on a body that is not slipping at all,
 * which is the only thing that can slow a roll.
 *
 * ⚠️ **Judge it by the gap between two settled bodies, never by how far from
 * the middle they end up.** Two bodies touching are already 126 apart by their
 * own size, so a distance-from-centre reading is mostly that constant and
 * barely moves however this is set - which is exactly how eight different
 * mechanisms came to be measured and wrongly cleared. Against the gap the
 * signal is plain: 294 at no resistance, 116 at 0.05, 86 here, 75 at 0.0005,
 * where the well stops settling.
 */
const ROLLING_KEPT_PER_SECOND = 0.005;

const ROLL_DRAG = 1 - Math.pow(ROLLING_KEPT_PER_SECOND, 1 / (60 * SUBSTEPS));

/**
 * Speed along a wall or the floor that a body keeps over one second of
 * touching it. Per second and converted, like every other rate here.
 *
 * ⚠️ **It only works in concert with `SPIN_KEPT_PER_SECOND`, and that is not
 * obvious.** Once bodies could rotate, a body that reaches the bottom stops
 * sliding and starts rolling, and rolling has no slip against the floor at all
 * - so this stopped touching it. Turning either one alone barely moves
 * anything. Turning both does: two bodies dropped in the middle of the field
 * end up 499 units from it at the old settings and 324 at these, on a field
 * whose wall is 600 away.
 */
const GROUND_KEPT_PER_SECOND = 0.0004;

const GROUND = 1 - Math.pow(GROUND_KEPT_PER_SECOND, 1 / (60 * SUBSTEPS));

/** How much of the speed into a wall comes back out. Rock does not bounce, and
 *  a body that lands dead reads as heavy, which is what these are. */
const BOUNCE = 0.12;

/**
 * How close two equal bodies have to be to become one, as a multiple of the
 * distance at which they touch.
 *
 * ⚠️ **Just over touching, and the margin is the whole point.** The first
 * version asked for 14% of penetration, on the reasoning that a graze should
 * not count - and the solver holds resting contacts at about 0.2% of overlap,
 * so nothing ever merged and the game had no rule left in it. A shade over
 * contact means two that have come to rest against each other merge, which is
 * what a player is doing when they line them up.
 */
const MERGE_REACH = 1.02;

/** A body must be this slow, and this old, before it can lose the game. A
 *  freshly dropped one is above the line by definition. */
const CALM = 70;
const GRACE = 0.45;

/** How long something may sit above the line before the well is full. */
const PATIENCE = 1;

interface Body {
  id: number;
  tier: number;
  /** Current radius, which is not the tier's radius while a merge is growing. */
  r: number;
  /** What it is growing to. Equal to `r` for everything that was dropped. */
  full: number;
  x: number;
  y: number;
  /** Last position. The velocity is `x - px`, which is the whole of Verlet. */
  px: number;
  py: number;
  /** Angle in radians, and the last one. The spin is `ang - pang`, exactly the
   *  way the linear velocity works, so rotation needs no separate integrator. */
  ang: number;
  pang: number;
  /** Seconds lived, for the grace period before it can end the game. */
  age: number;
}

export interface Options {
  root: HTMLElement;
  /** The clipped box. Measured, so the world can be scaled onto it. */
  field: HTMLElement;
  /** The layer inside it that carries the world transform. */
  world: HTMLElement;
  onScore(score: number, gained: number): void;
  onNext(tier: number): void;
  onState(state: 'playing' | 'won' | 'over'): void;
  /** Biggest body reached, for the live region and the legend. */
  onReach(tier: number): void;
}

export interface Controller {
  restart(): void;
  keepGoing(): void;
  destroy(): void;
}

export function mount(options: Options): Controller {
  const { root, field, world } = options;

  /* ---- State ------------------------------------------------------------- */

  let bodies: Body[] = [];
  const nodes = new Map<number, HTMLElement>();

  let nextId = 1;
  let score = 0;
  let best = 0;
  let claimed = false;
  let overFor = 0;
  let running = true;

  /** The one being aimed, which is not in the simulation until it is let go. */
  let heldTier = pick();
  let heldX = WORLD_W / 2;
  let ready = true;

  const held = document.createElement('div');
  const ghost = document.createElement('div');

  function pick(): number {
    return Math.floor(Math.random() * DROPPABLE);
  }

  function state(): string {
    return root.dataset.state ?? 'playing';
  }

  /* ---- Bodies and their nodes -------------------------------------------- */

  function spawn(tier: number, x: number, y: number, vx = 0, vy = 0, from?: number): Body {
    const body: Body = {
      id: nextId++,
      tier,
      // A merge starts at the size of the bodies that made it and grows. A
      // body that appeared at its full size would be born overlapping
      // everything around it, and the solver would answer that by firing the
      // neighbours across the well - which is exactly what it used to do.
      r: from ?? RADII[tier],
      full: RADII[tier],
      x,
      y,
      // Verlet takes a velocity as the gap to the previous position, and that
      // gap is per substep, which is why it is divided down here.
      px: x - vx / SUBSTEPS,
      py: y - vy / SUBSTEPS,
      /*
       * ⚠️ **A random orientation, and no spin whatsoever.** These were two
       * independent random angles, and since the spin is the gap between them
       * that gave every body a random rotation of up to a full turn *per
       * substep* - hundreds of revolutions a second. They came out of the sky
       * already spinning like a drill, and the contact friction then drove
       * them sideways into the walls.
       */
      ang: Math.random() * Math.PI * 2,
      pang: 0,
      age: 0,
    };

    // No spin at the start: the previous angle is the current one.
    body.pang = body.ang;

    bodies.push(body);

    const node = document.createElement('div');
    // A dropped body pops in. A merged one grows instead, and giving it both
    // would multiply the two scales together.
    node.className = from === undefined ? 'acc-body is-born' : 'acc-body';
    node.dataset.tier = String(tier);
    // Laid out at the size it is growing to, and scaled down to the size it
    // has - so growth is part of the transform the frame already writes and
    // costs no second style write.
    node.style.width = `${body.full * 2}px`;
    node.style.height = `${body.full * 2}px`;
    place(node, body);

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
   */
  function place(node: HTMLElement, body: Body): void {
    // Rounded, because a position of 5.218225851422176e-11 is a string the
    // browser has to parse sixty times a second to arrive at zero.
    const x = Math.round((body.x - body.full) * 100) / 100;
    const y = Math.round((body.y - body.full) * 100) / 100;

    /*
     * ⚠️ **The angle is simulated but not drawn, and that is deliberate.**
     *
     * Rotation earns its place in the solver: friction measured between two
     * surfaces is what tells a roll from a skid, and without it bodies crept
     * down each other's sides and glancing hits had nowhere to put their
     * energy but sideways flight. None of that needs the drawing to turn.
     *
     * Drawing it looked wrong, because these are not featureless balls. A
     * ring and a set of cloud bands are set by a planet's axis, not by which
     * way it happens to have rolled, so a Saturn that came to rest at ninety
     * degrees read as broken rather than as turned. The physics keeps the
     * angle, the picture keeps the axis.
     */
    node.style.transform =
      `translate3d(${x}px, ${y}px, 0)` +
      (body.r === body.full ? '' : ` scale(${Math.round((body.r / body.full) * 1000) / 1000})`);
  }

  function remove(body: Body): void {
    const node = nodes.get(body.id);
    nodes.delete(body.id);
    if (!node) return;

    // Off to the merge animation, then gone. It is out of the simulation the
    // instant it merges, so nothing collides with something that is fading.
    node.className = 'acc-body is-gone';
    node.addEventListener('animationend', () => node.remove());
    window.setTimeout(() => node.remove(), 600);
  }

  /* ---- One substep -------------------------------------------------------- */

  function integrate(h: number): void {
    const fall = GRAVITY * h * h;

    for (const body of bodies) {
      const vx = (body.x - body.px) * DAMPING;
      const vy = (body.y - body.py) * DAMPING;
      const va = (body.ang - body.pang) * SPIN_DAMPING;

      body.px = body.x;
      body.py = body.y;
      body.pang = body.ang;
      body.x += vx;
      body.y += vy + fall;
      body.ang += va;
    }
  }

  /**
   * Every pair, which is cheaper than it sounds.
   *
   * A well this size holds about forty bodies, so a pass is eight hundred
   * squared-distance tests with no square root on the miss - call it a hundred
   * thousand a second across the substeps, which is nothing. A grid would be
   * the right answer at ten times the count and the wrong one here: it costs
   * more to maintain than it saves, and it is a second place for a bug to live.
   */
  function collide(): void {
    for (let i = 0; i < bodies.length; i++) {
      const a = bodies[i];

      for (let j = i + 1; j < bodies.length; j++) {
        const b = bodies[j];

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const span = a.r + b.r;
        const d2 = dx * dx + dy * dy;

        if (d2 >= span * span || d2 === 0) continue;

        const d = Math.sqrt(d2);
        const nx = dx / d;
        const ny = dy / d;
        const push = (span - d) * RESPONSE;
        const overlap = push > MAX_PUSH ? MAX_PUSH : push;

        // Share of the correction, by area, so a Moon bounces off Jupiter
        // rather than shoving it aside.
        const ma = a.r * a.r;
        const mb = b.r * b.r;
        const total = ma + mb;
        const sa = mb / total;
        const sb = ma / total;

        /*
         * ⚠️ **Two separate things happen at a contact, and keeping them apart
         * is what made the board both calm and alive.**
         *
         * The first is that the bodies are overlapping and must not be. That is
         * a correction to where they are, and it moves the previous position
         * with the current one so it creates no speed at all. A pile settling
         * under gravity is nothing but this, which is why a settled pile is
         * perfectly still.
         *
         * The second is that they may have been moving towards each other. That
         * is a collision, and it is resolved only when there is an approach to
         * resolve - which a resting contact does not have. So a body dropped
         * from the top drives the pile down and a body already sitting there
         * does nothing, and neither behaviour has to be traded for the other.
         *
         * The version before this one had a single knob between the two. Set
         * low, the pile was dead and a drop from the top moved it by a
         * hundredth of a unit. Set high, every merge threw the well apart.
         */
        const vn =
          (b.x - b.px - (a.x - a.px)) * nx + (b.y - b.py - (a.y - a.py)) * ny;

        const ax = nx * overlap * sa;
        const ay = ny * overlap * sa;
        const bx = nx * overlap * sb;
        const by = ny * overlap * sb;

        a.x -= ax;
        a.y -= ay;
        a.px -= ax;
        a.py -= ay;
        b.x += bx;
        b.y += by;
        b.px += bx;
        b.py += by;

        const tx = -ny;
        const ty = nx;

        const ima = 1 / (a.r * a.r);
        const imb = 1 / (b.r * b.r);


        // Closing, so there is an impact. It settles itself: once the approach
        // is gone the next substep finds nothing to do.
        if (vn < 0) {
          const k = (1 + RESTITUTION) * vn;
          a.px -= nx * k * sa;
          a.py -= ny * k * sa;
          b.px += nx * k * sb;
          b.py += ny * k * sb;

        }

        /*
         * Friction, measured at the contact point rather than at the centres.
         *
         * ⚠️ **This is what rotation is for, and it fixes two complaints with
         * one change.** Without it a ball rolling off another and a ball
         * sliding along it look identical to the solver, so friction brakes
         * both: bodies crept down each other's sides instead of falling, and a
         * glancing hit had nowhere to put its energy except sideways flight.
         *
         * The slip below is the speed of the two *surfaces* past each other,
         * which includes each body's spin at the rim. A body that is rolling
         * has no slip at all, so friction does nothing to it and the roll is
         * free. A body that is skidding has plenty, so friction bites - and
         * the impulse that bites also spins it up, which is how a skid turns
         * into a roll on its own.
         *
         * The 3 is the disc: an impulse at the rim moves the centre and spins
         * the body, and for a uniform disc the rotational part responds twice
         * as hard as the linear one.
         */
        const wa = a.ang - a.pang;
        const wb = b.ang - b.pang;

        const slip =
          (b.x - b.px) * tx + (b.y - b.py) * ty - wb * b.r -
          ((a.x - a.px) * tx + (a.y - a.py) * ty + wa * a.r);

        let jt = -slip / (3 * (ima + imb));

        // Coulomb, against the correction this contact just applied: a pair
        // barely touching grips barely at all.
        const cap = (overlap / (ima + imb)) * FRICTION;
        if (jt > cap) jt = cap;
        else if (jt < -cap) jt = -cap;

        a.px += tx * jt * ima;
        a.py += ty * jt * ima;
        b.px -= tx * jt * imb;
        b.py -= ty * jt * imb;

        // The same impulse, as a torque. `2 / r^3` is `r / I` for a disc whose
        // mass is taken as `r^2`, which is the convention the shares above use.
        a.pang += (jt * 2) / (a.r * a.r * a.r);
        b.pang += (jt * 2) / (b.r * b.r * b.r);

        /*
         * ⚠️ **There is no rolling resistance between bodies, and it was tried.**
         * Damping the speed along a contact looks like it can only remove
         * energy and therefore cannot hurt, and measured it does: at anything
         * strong enough to matter the well stopped settling entirely, leaving
         * over 1300 units a second of motion where the same board otherwise
         * has 12. What "they slide like it is ice" actually wanted was the
         * floor, not this.
         */

        /*
         * ⚠️ **There is no friction here, and that is the finding rather than
         * an omission.**
         *
         * It was written three times - as a fraction of the tangential speed,
         * as the same thing under a Coulomb clamp, and finally as a correction
         * to the position, which is the textbook form. Measured against the
         * version with none at all, every one of them made the game worse:
         * a filled well took 32 seconds to come to rest instead of 2.3, and a
         * played-out game ran 72 drops and stalled at Jupiter instead of
         * running 110 and reaching the Sun.
         *
         * The reason is the line above. Once a separation stops being handed
         * to the body as speed, contacts no longer need a second mechanism to
         * take that speed back out - and a friction term computed from
         * velocities that the same pass is changing has nothing left to fix
         * and plenty left to destabilise.
         *
         * If a pile ever looks too slippery, `REBOUND` is the number to reach
         * for. Not this.
         */
      }
    }
  }

  /**
   * The well: two walls and a floor, and deliberately no lid.
   *
   * ⚠️ **A wall has to move the previous position too, and this is the single
   * worst bug this file had.** In Verlet the velocity *is* the gap to the last
   * position, so clamping only the current one turns however deep a body had
   * sunk into the floor into exactly that much upward speed - a perfectly
   * elastic bounce that gets stronger the harder the landing. Measured, a pile
   * that had gone quiet by three seconds was flinging bodies at 500 units a
   * second again at seven, and creeping along the floor into the walls.
   *
   * Bringing the previous position to the wall as well removes the normal
   * velocity completely, and `BOUNCE` then gives back the small amount that
   * makes a landing look like a landing rather than a magnet.
   */
  function bound(): void {
    for (const body of bodies) {
      if (body.x < body.r) {
        const v = body.x - body.px;
        body.x = body.r;
        body.px = body.x + v * BOUNCE;
        body.py += (body.y - body.py) * GROUND;
      } else if (body.x > WORLD_W - body.r) {
        const v = body.x - body.px;
        body.x = WORLD_W - body.r;
        body.px = body.x + v * BOUNCE;
        body.py += (body.y - body.py) * GROUND;
      }

      if (body.y > WORLD_H - body.r) {
        const v = body.y - body.py;
        body.y = WORLD_H - body.r;
        body.py = body.y + v * BOUNCE;

        /*
         * ⚠️ **The floor drags, and for a long time it did not.** Every
         * contact between two bodies had friction while the boundary had
         * none, so anything that reached the bottom slid along it until it
         * met something - which is most of what "they slide like it is ice"
         * was. It is the safest friction in the file: it only ever takes
         * sideways speed out of one body, so it cannot add energy anywhere.
         */
        /*
         * The floor grips, and it grips the *surface*: a body skidding along
         * the bottom is slowed and spun up at the same time, so it rolls
         * instead of sliding to a stop. Without the second half a planet
         * arrives at the bottom and freezes there like a dropped stone.
         */
        const slip = body.x - body.px + (body.ang - body.pang) * body.r;
        const take = slip * GROUND;

        body.px += take / 3;
        body.pang += (take * 2) / (3 * body.r);

        /*
         * ⚠️ **Rolling resistance, and it is the piece that was missing.**
         *
         * Everything above only acts on *slip*, and a body that is rolling has
         * none - that is what rolling means. So once a planet reached the
         * bottom and started to roll, nothing on the board could slow it, and
         * it carried on to the wall. Neither the floor grip nor the blanket
         * spin damping could touch it, which is why turning either of them up
         * barely moved anything.
         *
         * This takes a little from the linear and the angular speed together,
         * in the proportion that keeps them rolling rather than skidding, so
         * the body slows down instead of starting to slide. It only ever
         * removes energy, and only from bodies that are on the floor.
         */
        body.px += (body.x - body.px) * ROLL_DRAG;
        body.pang += (body.ang - body.pang) * ROLL_DRAG;
      }
    }
  }

  /* ---- Merging ------------------------------------------------------------ */

  /**
   * Equal bodies that have bitten into each other far enough.
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

    for (const [a, b] of pairs) {
      remove(a);
      remove(b);

      const x = (a.x + b.x) / 2;
      const y = (a.y + b.y) / 2;

      // Two Suns have nowhere to go, so they go off. The blank left behind is
      // the only way a full well ever empties, and it is why reaching the end
      // of the sequence is a move rather than a trophy.
      if (a.tier === TIERS - 1) {
        gained += NOVA_POINTS;
        nova(x, y);
        continue;
      }

      const vx = (a.x - a.px + (b.x - b.px)) / 2;
      const vy = (a.y - a.py + (b.y - b.py)) / 2;

      const born = spawn(a.tier + 1, x, y, vx * SUBSTEPS, vy * SUBSTEPS, a.r);

      // Angular momentum does not vanish because two things became one. The
      // new body keeps the average of the spins that made it, so a merge in
      // the middle of a roll carries on rolling.
      born.ang = (a.ang + b.ang) / 2;
      born.pang = born.ang - ((a.ang - a.pang) + (b.ang - b.pang)) / 2;
      gained += points(born.tier);

      if (born.tier === TIERS - 1 && !claimed) {
        claimed = true;
        options.onState('won');
      }
    }

    score += gained;
    options.onScore(score, gained);
  }

  /** The flash two Suns leave behind. Purely a node, removed by its own
   *  animation - nothing in the simulation knows it happened. */
  function nova(x: number, y: number): void {
    const burst = document.createElement('div');
    burst.className = 'acc-nova';
    burst.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    burst.addEventListener('animationend', () => burst.remove());

    world.append(burst);
    window.setTimeout(() => burst.remove(), 1200);
  }

  /* ---- Losing ------------------------------------------------------------- */

  /**
   * The well is full when something has been sitting above the line.
   *
   * ⚠️ Both halves of that matter. A body dropped this instant is above the
   * line by definition, so speed and age are what separate "still arriving"
   * from "there is no room left", and a second of patience is what stops a
   * splash on a tall pile from ending a game the player was winning.
   */
  function check(h: number): void {
    let over = false;

    for (const body of bodies) {
      body.age += h;
      if (body.age < GRACE) continue;
      if (body.y - body.r > LOSS_Y) continue;

      const vx = (body.x - body.px) / h;
      const vy = (body.y - body.py) / h;
      if (vx * vx + vy * vy > CALM * CALM) continue;

      over = true;
      break;
    }

    overFor = over ? overFor + h : 0;

    // A warning before the verdict: the line goes red a third of the way into
    // the count, which is the difference between losing and being told you are
    // about to.
    if (overFor > PATIENCE / 3) root.dataset.full = '';
    else delete root.dataset.full;

    if (overFor > PATIENCE) options.onState('over');
  }

  function step(): void {
    const h = STEP / SUBSTEPS;

    // Growth runs on the step rather than the substep, because it is the one
    // thing here that is animation rather than physics.
    for (const body of bodies) {
      if (body.r < body.full) body.r = Math.min(body.full, body.r + (body.full - body.r) * GROW + 0.4);
    }

    for (let i = 0; i < SUBSTEPS; i++) {
      /*
       * ⚠️ **Merging runs inside the substep loop, before anything separates
       * them.** It used to run once at the end of the frame, which meant two
       * equal bodies met, got pushed apart twenty-eight times, and only then
       * became one - so every merge was visibly a collision followed by a
       * merge. Checking first means they never touch: the instant they reach
       * each other they are one body.
       */
      merge();
      integrate(h);
      collide();
      bound();
    }

    check(STEP);
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

    for (const body of bodies) {
      const node = nodes.get(body.id);
      if (node) place(node, body);
    }

    paintHeld();
  }

  /* ---- Aiming and dropping ------------------------------------------------ */

  function paintHeld(): void {
    const r = RADII[heldTier];
    const x = Math.min(Math.max(heldX, r), WORLD_W - r);

    held.dataset.tier = String(heldTier);
    held.style.width = `${r * 2}px`;
    held.style.height = `${r * 2}px`;
    held.style.transform = `translate3d(${x - r}px, ${DROP_Y - r}px, 0)`;

    ghost.style.transform = `translate3d(${x}px, ${DROP_Y}px, 0)`;
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

    /*
     * ⚠️ **A few units of jitter, and it is not laziness about aiming.**
     *
     * Two bodies dropped at exactly the same place land exactly on top of each
     * other, and a sphere balanced on the pole of another sphere is in perfect
     * equilibrium: there is no sideways force anywhere in the arrangement, so
     * it stands there like a snowman and never falls. Real balls never meet
     * that case because nothing is ever exactly aligned. Three units out of
     * twelve hundred is under a pixel on screen and cannot be aimed around,
     * and it is enough for gravity to take over and roll one off the other.
     */
    spawn(heldTier, x + (Math.random() - 0.5) * JITTER, DROP_Y);

    ready = false;
    delete root.dataset.ready;

    // A pause between drops, not a cooldown on the animation: without it a
    // held button stacks four bodies in the same place and the pile explodes
    // outward as the solver untangles them.
    window.setTimeout(() => {
      if (!running) return;
      heldTier = pick();
      ready = true;
      root.dataset.ready = '';
      options.onNext(heldTier);
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

    // A tenth of the well per press, so crossing it is ten presses rather than
    // a hundred, and a held key still lands where the eye expects.
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

    bodies = [];
    score = 0;
    best = 0;
    claimed = false;
    overFor = 0;
    carry = 0;

    heldTier = pick();
    heldX = WORLD_W / 2;
    ready = true;

    root.dataset.ready = '';
    delete root.dataset.full;

    options.onState('playing');
    options.onScore(0, 0);
    options.onNext(heldTier);
    options.onReach(0);
  }

  held.className = 'acc-body acc-held';
  ghost.className = 'acc-guide';
  world.append(ghost, held);

  field.addEventListener('pointermove', onPointerMove);
  field.addEventListener('pointerdown', onPointerDown);
  field.addEventListener('pointerup', onPointerUp);
  window.addEventListener('keydown', onKeyDown);

  fit();
  restart();
  frame = requestAnimationFrame(tick);

  return {
    restart,

    keepGoing() {
      options.onState('playing');
    },

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
