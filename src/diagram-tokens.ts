/**
 * Every number the architecture diagram is drawn from, in one file.
 *
 * The diagram is inline SVG with a viewBox, so a unit here scales with the
 * drawing rather than being a CSS pixel. That is why the geometry cannot live
 * in the stylesheet: the layout has to measure text and place anchors in the
 * same coordinate space it later renders into, and CSS cannot do arithmetic on
 * a wrapped line count.
 *
 * ⚠️ Colour is the deliberate exception and stays in CSS. The palette is a set
 * of `--site-*` custom properties that the theme toggle re-declares at runtime,
 * so a colour resolved here and baked into an SVG attribute would freeze the
 * diagram in whichever theme the page was built in. `colors` below holds
 * *expressions* over those tokens instead, handed to the component's scoped
 * style block through `define:vars` - so this is still the only file a diagram
 * value is written in, and dark mode still works.
 *
 * ⚠️ One diagram, two arrangements, and never both on screen. An SVG with a
 * fixed viewBox scales its text with its container, so the landscape
 * composition that reads at 1150 would set its 18px titles at 5px on a phone -
 * a portrait arrangement below 56rem is the floor, not a preference. There is
 * no third: the wide composition holds its type down to about an 896 viewport,
 * which is where the switch is. The breakpoint in ArchitectureDiagram.astro is
 * the other half of these two entries and has to move with them.
 */

export type DiagramMode = 'wide' | 'narrow';

/** 1 is a terminal, 2 the core the run passes through, 3 a parallel service. */
export type Tier = 1 | 2 | 3;

/**
 * A type style, as the layout needs it.
 *
 * `stretch` is the font-stretch the CSS sets, repeated here because the width
 * estimator has to know it: Archivo at 107% is 7% wider per glyph, and text
 * wrapped without that lands a line short.
 */
export interface TypeStyle {
  size: number;
  /** Line advance. */
  lh: number;
  /** font-stretch as a multiplier. */
  stretch: number;
}

/** Uppercase micro-type: badges, stage captions, payload annotations. */
export interface MonoStyle {
  size: number;
  lh: number;
  /** letter-spacing in ems, emitted as a user-unit attribute at render time. */
  track: number;
}

interface BaseTokens {
  /**
   * The viewBox width the composition is built to, and the width the SVG is
   * capped at in CSS so it never scales *up* past its design size.
   */
  width: number;
  framePad: { x: number; y: number };
  /**
   * A floor on the drawing's height. Two parallel services make a row
   * composition about 380 units tall over 1150 wide, which is a strip rather
   * than a figure; the difference is spent as padding around a centred
   * composition. Column modes take their height from their content and set 0.
   */
  minHeight: number;

  title: TypeStyle;
  /** Service titles sit a step under the terminals and the core. */
  serviceTitle: TypeStyle;
  mono: MonoStyle;
  /** The payload annotation riding on an edge. */
  label: MonoStyle;

  nodePad: { x: number; y: number };
  nodeMinHeight: Record<Tier, number>;

  lane: { pad: number; padTop: number; gap: number };
  /** Space between stages. A gap carrying a payload annotation gets more. */
  gap: { plain: number; labelled: number };

  /** Between the lane's caption baseline and the first service under it. */
  captionGap: number;
  /** Between a node's floor and the annotation printed under it. */
  noteGap: number;
  /** Between a node's caption and its title, and its title and its badge. */
  badgeGap: number;
  /**
   * The badge's chip. A badge set as loose text under a title made a node read
   * as two stray lines in a box; on its own inset ground it reads as a card
   * with something *on* it.
   */
  chip: { padX: number; padY: number; radius: number };
  /** The furthest apart two anchors of one fan are allowed to sit. */
  fanStep: number;
}

export interface RowTokens extends BaseTokens {
  axis: 'row';
  laneAxis: 'column';
  /** Preferred node width per tier. A lane is its service width plus padding. */
  nodeWidth: Record<Tier, number>;
  /**
   * How far the composition may squeeze its nodes to fit `width` before it
   * gives up and lets the SVG scale down instead. Past about 0.84 the titles
   * start taking a third line and the drawing grows taller than it saves.
   */
  minShrink: number;
}

export interface ColumnTokens extends BaseTokens {
  axis: 'column';
  laneAxis: 'row' | 'column';
  /** A terminal or the core is centred at this width. A lane spans. */
  stackNodeWidth?: number;
  /**
   * Extra height before a lane whose services sit side by side. A fan that
   * spreads 160 units sideways over a 54 unit drop is a set of diagonals with
   * rounded ends; it needs the room to leave downwards first.
   */
  fanRoom: number;
}

export type ModeTokens = RowTokens | ColumnTokens;

export const modes: Record<DiagramMode, ModeTokens> = {
  /*
   * Desktop. Stages run left to right, the parallel services stack inside a
   * lane on the right, and the composition is built to the 72rem measure the
   * project page's sections already use.
   */
  wide: {
    axis: 'row',
    laneAxis: 'column',
    width: 1152,
    framePad: { x: 34, y: 26 },
    /*
     * ⚠️ No floor, and that is deliberate. A minimum height was tried at 540
     * and again at 560, to make the four diagrams one object: it padded the two
     * with only two services by 150 units, and since the drawing sat on a
     * visible plate that padding showed up as an empty grey band inside a box.
     * Every diagram is now exactly as tall as what is in it.
     */
    minHeight: 0,
    title: { size: 18, lh: 24, stretch: 1.07 },
    serviceTitle: { size: 17, lh: 23, stretch: 1.06 },
    mono: { size: 10.5, lh: 15, track: 0.08 },
    label: { size: 11, lh: 16, track: 0.08 },
    nodePad: { x: 20, y: 22 },
    nodeWidth: { 1: 236, 2: 280, 3: 252 },
    nodeMinHeight: { 1: 88, 2: 108, 3: 92 },
    lane: { pad: 20, padTop: 46, gap: 20 },
    /* 176 rather than 156 because `multipart/form-data` is one unbreakable
       19-character word and it has to fit the gap it is annotating. */
    gap: { plain: 96, labelled: 176 },
    captionGap: 12,
    noteGap: 14,
    badgeGap: 9,
    chip: { padX: 9, padY: 4.5, radius: 6 },
    fanStep: 26,
    minShrink: 0.84,
  },

  /*
   * Everything below 56rem. Stages stack, the services stack inside their lane,
   * and the lane is wired as a single block rather than fanned into: three
   * curves into three stacked boxes at this width is a knot, and the lane's own
   * border already says the three run together.
   *
   * The viewBox is 330 so a 375pt phone renders it at about 1:1 and nothing in
   * it lands under 12px. It is capped at 30rem in CSS, so on the wide end of
   * its range it grows to about 1.45x rather than stretching to fill a tablet.
   */
  narrow: {
    axis: 'column',
    laneAxis: 'column',
    width: 330,
    framePad: { x: 18, y: 22 },
    minHeight: 0,
    title: { size: 15, lh: 20, stretch: 1.06 },
    serviceTitle: { size: 14.5, lh: 19, stretch: 1.05 },
    mono: { size: 11, lh: 14.5, track: 0.07 },
    label: { size: 11, lh: 15, track: 0.07 },
    nodePad: { x: 16, y: 15 },
    nodeMinHeight: { 1: 56, 2: 60, 3: 66 },
    lane: { pad: 14, padTop: 36, gap: 12 },
    gap: { plain: 44, labelled: 44 },
    captionGap: 10,
    noteGap: 11,
    badgeGap: 7,
    chip: { padX: 7, padY: 3.5, radius: 5 },
    fanStep: 24,
    fanRoom: 0,
  },
};

/**
 * The annotation voice.
 *
 * ⚠️ The one place this site sets type in something other than Archivo, and it
 * loads nothing to do it: the stack is the platform's own monospace, so the
 * register change between what a thing *is* (the sans) and what is *known about
 * it* (the mono) costs no bytes and no request. Adding a web font here would
 * break the site's one-family rule for real - see docs/design-system.md §4.
 */
export const fonts = {
  mono: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
};

/** Corner radii and stroke weights, rendered straight into SVG attributes. */
export const shape = {
  radiusNode: 14,
  radiusLane: 14,
  strokeNode: 1,
  strokeEdge: 1.25,
  strokeHead: 1.35,
  strokeLane: 1,
  /** The lane's dashes, in user units. */
  laneDash: '5 5',
  /** Arrowhead reach, back from the point. */
  head: 6.5,
};

/**
 * Motion, and it is measured in scroll rather than in time.
 *
 * ⚠️ Nothing here is a duration. Every element's animation is a slice of a
 * `view()` timeline on the diagram's own track: the layout hands each one a
 * **step index**, CSS turns that into `animation-range: cover from … cover to`,
 * and the reader's scroll is the clock. Scroll back up and it unbuilds, which
 * is what a scrubbed animation is rather than a bug.
 *
 * `from` and `span` are percentages of that cover range, and the track is
 * exactly as tall as the drawing. A drawing of 400 units in a 900 unit
 * viewport is fully on screen between about 31% and 69% of cover, so the story
 * runs 22% to 56%: it starts as the diagram is arriving and is finished well
 * before it begins to leave.
 */
export const motion = {
  /*
   * Gentler than the site's own curve at both ends. A scrubbed animation is
   * read at whatever speed the reader scrolls, so a curve that front-loads its
   * travel makes an element look like it snapped into place and then waited.
   */
  nodeEase: 'cubic-bezier(.25, 0, .2, 1)',
  edgeEase: 'cubic-bezier(.3, 0, .25, 1)',
  /** Where the story sits in the track's cover range. */
  story: { from: 22, span: 34 },
  /** And unpinned, below 56rem, where the diagram simply passes the screen. */
  storyNarrow: { from: 12, span: 46 },
  /** How far into its own slot an arrowhead lands, as a fraction of a step. */
  headAt: 0.55,
};

/**
 * Colour, as expressions over the site's tokens rather than as values.
 *
 * ⚠️ **The diagram has no plate.** It is drawn straight onto the section's
 * band, which is the one change that makes an empty box impossible: before an
 * element arrives there is nothing where it will be, rather than a grey
 * rectangle waiting for it. A framed plate was tried twice and both times the
 * frame was the problem, not its size.
 *
 * The ladder is three steps over that band and it has to hold in both themes,
 * which is why every step is a mix rather than a named surface: `--site-card`
 * is lighter than the band on a light page *and* on a dark one, so mixing
 * towards it moves the same direction either way.
 *
 *   tier 3   a service, one step up from the band
 *   tier 2   the core, the brightest plain surface and the widest node
 *   tier 1   a terminal: the core's surface carrying the one accent
 */
export const colors = {
  'dg-t1-fill': 'color-mix(in oklab, var(--site-accent) 10%, var(--site-card))',
  'dg-t1-line': 'color-mix(in oklab, var(--site-accent) 42%, transparent)',
  'dg-t2-fill': 'var(--site-card)',
  'dg-t2-line': 'color-mix(in oklab, var(--site-fg) 26%, transparent)',
  'dg-t3-fill': 'color-mix(in oklab, var(--site-card) 70%, var(--site-band))',
  'dg-t3-line': 'var(--site-hairline)',

  'dg-lane-line': 'color-mix(in oklab, var(--site-fg) 16%, transparent)',

  /* The badge's chip: one step back from whatever card it is sitting on. */
  'dg-chip-fill': 'color-mix(in oklab, var(--site-fg) 5%, var(--site-card))',
  'dg-chip-line': 'color-mix(in oklab, var(--site-fg) 9%, transparent)',

  /* One hue at two strengths: the run of the line, and the head that lands. */
  'dg-line': 'color-mix(in oklab, var(--site-accent) 30%, transparent)',
  'dg-head': 'color-mix(in oklab, var(--site-accent) 48%, transparent)',

  'dg-ink': 'var(--site-fg)',
  'dg-muted': 'var(--site-muted)',
  'dg-caption': 'color-mix(in oklab, var(--site-muted) 78%, transparent)',
  /* The halo that lets an annotation sit on its own line. The diagram has no
     plate of its own, so this is the ground it is actually drawn on. */
  'dg-halo': 'var(--site-band)',
};
