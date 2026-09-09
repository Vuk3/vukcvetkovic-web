import {
  modes,
  type ColumnTokens,
  type DiagramMode,
  type ModeTokens,
  type MonoStyle,
  type RowTokens,
  type Tier,
  type TypeStyle,
} from './diagram-tokens';

/**
 * The architecture diagram, as geometry.
 *
 * A diagram is data - a list of stages and a list of edges - and this file is
 * the only place that turns it into coordinates. Nothing downstream carries a
 * number of its own: ArchitectureDiagram.astro maps over what comes back and
 * writes the attributes out, which is what lets one component serve every
 * project, in four locales, in both of its arrangements.
 *
 * ⚠️ Two rules hold the whole composition up:
 *
 *   1. **Every connector is one cubic bezier with its control points on the
 *      flow axis** - horizontal offsets in a row composition, vertical in a
 *      column one, each 40% of the distance between the anchors. That is what
 *      makes a line leave and arrive along the axis with nothing to elbow
 *      around, and why there is not a right angle anywhere in the drawing.
 *   2. **A fan leaves along an edge, never from a point.** The anchors are
 *      distributed down the core's right edge, or across its floor, so each
 *      curve has a tangent of its own - and because they come out in the same
 *      order as the services they feed, the mapping is monotone and a crossing
 *      is impossible rather than merely avoided.
 *
 * The shape it knows is the one all four projects are: a terminal, a core the
 * run passes through, one lane of services that run in parallel, then either an
 * exit terminal (a pipeline) or a return to the core and back out to where it
 * started (a round trip). It is not a general graph engine and should not
 * become one - a fifth project with a different shape is a reason to read this
 * and extend it deliberately, not a gap to fill in advance.
 */

/* ---- The spec, which is what a project page hands over ------------------- */

export interface DiagramNode {
  id: string;
  tier: Tier;
  title: string;
  /** Uppercase micro-type under the title: a model, a mode, a protocol list. */
  badges?: string[];
  /** An annotation printed *under* the node, never inside it. */
  note?: string;
}

export interface DiagramStage {
  id: string;
  /** Uppercase caption over the stage. A terminal does not need one. */
  caption?: string;
  /** True for the one stage whose nodes run at the same time. */
  lane?: boolean;
  nodes: DiagramNode[];
}

export interface DiagramEdge {
  from: string;
  to: string;
  /** The payload in flight, annotated on the line itself. */
  label?: string;
  /** A leg of the run heading back the way it came. */
  return?: boolean;
}

export interface DiagramSpec {
  id: string;
  stages: DiagramStage[];
  edges: DiagramEdge[];
}

/* ---- What comes back ----------------------------------------------------- */

export type TextRole = 'title' | 'service' | 'badge' | 'caption' | 'note' | 'label';

export interface TextRun {
  x: number;
  /** Baseline of the first line. */
  y: number;
  lines: string[];
  size: number;
  lh: number;
  /** letter-spacing in user units. 0 on everything but the mono runs. */
  track: number;
  anchor: 'start' | 'middle';
  role: TextRole;
  step: number;
}

export interface NodeBox {
  id: string;
  tier: Tier;
  x: number;
  y: number;
  w: number;
  h: number;
  step: number;
}

export interface LaneBox {
  x: number;
  y: number;
  w: number;
  h: number;
  step: number;
}

/** The ground under a badge. Sized to the text it holds, not to its node. */
export interface ChipBox {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Its own radius, which is a step tighter than the card it sits on. */
  r: number;
  step: number;
}

export interface EdgeShape {
  d: string;
  head: { x: number; y: number; angle: number };
  step: number;
}

export interface DiagramLayout {
  mode: DiagramMode;
  width: number;
  height: number;
  lanes: LaneBox[];
  nodes: NodeBox[];
  chips: ChipBox[];
  edges: EdgeShape[];
  /** In paint order. Labels last, so their halo cuts the line behind them. */
  texts: TextRun[];
  /** How many steps the story runs to. CSS divides the scroll by it. */
  steps: number;
}

/* ---- Measuring text without a browser ------------------------------------ */

/*
 * The layout has to know how wide a string sets before anything is rendered, so
 * it estimates from a per-character advance table rather than measuring.
 *
 * The numbers are Archivo's proportions at the weights used here, in ems. They
 * are close rather than exact, which is why `wrap` keeps 3% of the measure in
 * hand: a line one glyph too long overflows its box, while a line that wrapped
 * a word early costs nothing.
 *
 * It earns its place on a four-language site. The same node holds "WCF service"
 * in English and "Ein Ordner, rekursiv in Bytes gelesen" in German, and the box
 * has to be as tall as whichever locale is being built.
 */
function advance(ch: string): number {
  if (ch === ' ') return 0.27;
  if ("ijl.,:;'`!|".includes(ch)) return 0.28;
  if ('ftrI()[]{}-/\\'.includes(ch)) return 0.36;
  if (ch === 'm' || ch === 'w') return 0.86;
  if (ch === 'M' || ch === 'W') return 0.92;
  if (ch >= '0' && ch <= '9') return 0.58;
  /* A letter with a distinct lower case is an upper case one. */
  if (ch !== ch.toLowerCase() && ch === ch.toUpperCase()) return 0.68;
  return 0.55;
}

interface Metric {
  size: number;
  stretch: number;
  /** Tracking in ems. */
  track: number;
  mono: boolean;
}

const sansMetric = (style: TypeStyle): Metric => ({
  size: style.size,
  stretch: style.stretch,
  track: 0,
  mono: false,
});

const monoMetric = (style: MonoStyle): Metric => ({
  size: style.size,
  stretch: 1,
  track: style.track,
  mono: true,
});

function measure(text: string, m: Metric): number {
  let units = 0;
  let count = 0;

  for (const ch of text) {
    units += m.mono ? 0.6 : advance(ch);
    count += 1;
  }

  return units * m.size * m.stretch + count * m.track * m.size;
}

/**
 * The annotation voice is set in caps, and it is done here rather than with
 * `text-transform` for two reasons: the wrap has to measure what will actually
 * be drawn, and caps are about a quarter wider than lower case - and SVG text
 * transforms are not reliable in every engine. Plain `toUpperCase` is correct
 * for all four locales the site ships.
 */
const caps = (text: string) => text.toUpperCase();

/** Greedy wrap. A single word wider than the measure keeps a line of its own. */
function wrap(text: string, maxWidth: number, m: Metric): string[] {
  if (!text) return [];

  const limit = maxWidth * 0.97;
  const lines: string[] = [];
  let line = '';

  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;

    if (line && measure(next, m) > limit) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);

  return lines;
}

/* ---- Small geometry helpers ---------------------------------------------- */

const round = (n: number) => Math.round(n * 100) / 100;
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

/**
 * The baseline of a line box: half the leading, then the ascent. 0.78em is
 * Archivo's cap-and-ascender height closely enough at these sizes.
 */
const baseline = (top: number, size: number, lh: number) => top + (lh - size) / 2 + size * 0.78;

interface Point {
  x: number;
  y: number;
}

interface Curve {
  d: string;
  head: { x: number; y: number; angle: number };
  mid: Point;
}

/**
 * One connector: a single cubic, with both control points offset along the axis
 * the flow runs on. That is the entire connector spec, and it is what
 * guarantees the line leaves and lands parallel to the axis - so the arrowhead
 * is always square to the node it enters and there is never a corner to draw.
 */
function connector(from: Point, to: Point, axis: 'x' | 'y'): Curve {
  let c1: Point;
  let c2: Point;
  let angle: number;

  if (axis === 'x') {
    const offset = Math.abs(to.x - from.x) * 0.4;
    const forward = to.x >= from.x;

    c1 = { x: from.x + (forward ? offset : -offset), y: from.y };
    c2 = { x: to.x + (forward ? -offset : offset), y: to.y };
    angle = forward ? 0 : 180;
  } else {
    const offset = Math.abs(to.y - from.y) * 0.4;
    const forward = to.y >= from.y;

    c1 = { x: from.x, y: from.y + (forward ? offset : -offset) };
    c2 = { x: to.x, y: to.y + (forward ? -offset : offset) };
    angle = forward ? 90 : 270;
  }

  return {
    d:
      `M ${round(from.x)} ${round(from.y)} ` +
      `C ${round(c1.x)} ${round(c1.y)}, ${round(c2.x)} ${round(c2.y)}, ${round(to.x)} ${round(to.y)}`,
    head: { x: round(to.x), y: round(to.y), angle },
    /* B(0.5) of a cubic, which is where the payload annotation sits. */
    mid: {
      x: round((from.x + 3 * c1.x + 3 * c2.x + to.x) / 8),
      y: round((from.y + 3 * c1.y + 3 * c2.y + to.y) / 8),
    },
  };
}

/** `count` anchors spread along a node's edge, centred on `centre`. */
function anchors(count: number, centre: number, span: number, step: number): number[] {
  if (count <= 1) return [centre];

  const pitch = Math.min(step, span / count);

  return Array.from({ length: count }, (_, i) => centre + (i - (count - 1) / 2) * pitch);
}

/* ---- Reading the spec ---------------------------------------------------- */

interface Resolved {
  entry: DiagramNode;
  entryCaption?: string;
  core: DiagramNode;
  coreCaption?: string;
  services: DiagramNode[];
  laneCaption?: string;
  exit?: DiagramNode;
  exitCaption?: string;
  /** The payload on the way in, and the one on the way back out. */
  entryLabel?: string;
  exitLabel?: string;
  /** True where the run comes back to the terminal it started from. */
  roundTrip: boolean;
}

function resolve(spec: DiagramSpec): Resolved {
  const laneIndex = spec.stages.findIndex((stage) => stage.lane);

  if (laneIndex < 1) {
    throw new Error(`Diagram "${spec.id}": expected a lane stage with a stage before it.`);
  }

  const coreStage = spec.stages[laneIndex - 1];
  const laneStage = spec.stages[laneIndex];
  const exitStage = spec.stages[laneIndex + 1];

  const entry = spec.stages[0].nodes[0];
  const core = coreStage.nodes[0];

  if (!entry || !core || laneStage.nodes.length === 0) {
    throw new Error(
      `Diagram "${spec.id}": a terminal, a core and at least one service are required.`,
    );
  }

  const labelOn = (from: string, to: string) =>
    spec.edges.find((edge) => edge.from === from && edge.to === to)?.label;

  return {
    entry,
    entryCaption: spec.stages[0].caption,
    core,
    coreCaption: coreStage.caption,
    services: laneStage.nodes,
    laneCaption: laneStage.caption,
    exit: exitStage?.nodes[0],
    exitCaption: exitStage?.caption,
    entryLabel: labelOn(entry.id, core.id),
    exitLabel: labelOn(core.id, entry.id),
    roundTrip: !exitStage && spec.edges.some((edge) => edge.to === entry.id),
  };
}

/* ---- Reveal timing ------------------------------------------------------- */

/*
 * A step of the sequence, in the order the data actually moves. Everything in
 * the drawing carries the index of the step it belongs to, so a node can never
 * arrive before the edge that feeds it - and the services share one step,
 * because arriving together is the fact being stated.
 *
 * These are indices, not milliseconds. CSS turns each one into a slice of the
 * track's scroll range, so the reader's scroll is what advances the story.
 *
 * The two compositions count differently: a row draws a round trip in place,
 * while a column has to name the core and the terminal a second time at the
 * foot, which is two more steps.
 */
const ROW_STEP = { entry: 0, in: 1, core: 2, lane: 3, services: 4, back: 5, out: 6, note: 7 };
const COL_STEP = {
  entry: 0,
  in: 1,
  core: 2,
  lane: 3,
  services: 4,
  merge: 5,
  landing: 6,
  /** A pipeline's annotation and a round trip's last line share this step. */
  out: 7,
  tail: 8,
};

/* ---- Filling a node ------------------------------------------------------ */

interface Filled {
  caption: string;
  titleLines: string[];
  badgeLines: string[][];
  contentHeight: number;
  height: number;
}

/**
 * A node's card: a caption, a title, and a badge on a chip.
 *
 * ⚠️ The caption is set *inside* the card rather than floating over it. Over
 * the box it was a label pointing at a plain rectangle; inside it, the card has
 * a header and a body and reads as an object rather than as a box with a word
 * next to it. A service takes none - it is inside a captioned lane already.
 */
function fill(
  node: DiagramNode,
  width: number,
  style: TypeStyle,
  t: ModeTokens,
  caption = '',
): Filled {
  const inner = width - 2 * t.nodePad.x;
  const titleLines = wrap(node.title, inner, sansMetric(style));
  const badgeLines = (node.badges ?? []).map((badge) =>
    wrap(caps(badge), inner - 2 * t.chip.padX, monoMetric(t.mono)),
  );

  let contentHeight = titleLines.length * style.lh;

  if (caption) contentHeight += t.mono.lh + t.badgeGap;

  for (const lines of badgeLines) {
    contentHeight += t.badgeGap + lines.length * t.mono.lh + 2 * t.chip.padY;
  }

  return {
    caption: caption ? caps(caption) : '',
    titleLines,
    badgeLines,
    contentHeight,
    height: Math.max(contentHeight + 2 * t.nodePad.y, t.nodeMinHeight[node.tier]),
  };
}

/** Everything being assembled, so the writers below have one thing to push to. */
interface Draft {
  nodes: NodeBox[];
  lanes: LaneBox[];
  chips: ChipBox[];
  edges: EdgeShape[];
  texts: TextRun[];
  /** Kept apart and appended last, so a halo cuts the line it sits on. */
  labels: TextRun[];
}

interface Placement {
  node: DiagramNode;
  filled: Filled;
  x: number;
  y: number;
  w: number;
  h: number;
  style: TypeStyle;
  role: TextRole;
  step: number;
  /** Set where a node is drawn twice, so the ids stay unique. */
  id?: string;
}

/** Writes one node's box and its text into the draft. */
function place(draft: Draft, t: ModeTokens, p: Placement): void {
  draft.nodes.push({
    id: p.id ?? p.node.id,
    tier: p.node.tier,
    x: round(p.x),
    y: round(p.y),
    w: round(p.w),
    h: round(p.h),
    step: p.step,
  });

  /* Content is centred in the box, which matters only where a minimum height
     is doing the work rather than the text. */
  let top = p.y + (p.h - p.filled.contentHeight) / 2;
  const left = p.x + t.nodePad.x;

  if (p.filled.caption) {
    draft.texts.push({
      x: round(left),
      y: round(baseline(top, t.mono.size, t.mono.lh)),
      lines: [p.filled.caption],
      size: t.mono.size,
      lh: t.mono.lh,
      track: round(t.mono.track * t.mono.size),
      anchor: 'start',
      role: 'caption',
      step: p.step,
    });

    top += t.mono.lh + t.badgeGap;
  }

  draft.texts.push({
    x: round(left),
    y: round(baseline(top, p.style.size, p.style.lh)),
    lines: p.filled.titleLines,
    size: p.style.size,
    lh: p.style.lh,
    track: 0,
    anchor: 'start',
    role: p.role,
    step: p.step,
  });

  top += p.filled.titleLines.length * p.style.lh;

  for (const lines of p.filled.badgeLines) {
    top += t.badgeGap;

    /* The chip is sized to its text, never to its node: a two-word badge in a
       full-width bar would read as a second title. */
    const widest = Math.max(...lines.map((line) => measure(line, monoMetric(t.mono))));

    draft.chips.push({
      x: round(left),
      y: round(top),
      w: round(widest + 2 * t.chip.padX),
      h: round(lines.length * t.mono.lh + 2 * t.chip.padY),
      r: t.chip.radius,
      step: p.step,
    });

    draft.texts.push({
      x: round(left + t.chip.padX),
      y: round(baseline(top + t.chip.padY, t.mono.size, t.mono.lh)),
      lines,
      size: t.mono.size,
      lh: t.mono.lh,
      track: round(t.mono.track * t.mono.size),
      anchor: 'start',
      role: 'badge',
      step: p.step,
    });

    top += lines.length * t.mono.lh + 2 * t.chip.padY;
  }
}

function pushCaption(draft: Draft, t: ModeTokens, text: string, x: number, boxTop: number, step: number) {
  draft.texts.push({
    x: round(x),
    y: round(boxTop - t.captionGap),
    lines: [caps(text)],
    size: t.mono.size,
    lh: t.mono.lh,
    track: round(t.mono.track * t.mono.size),
    anchor: 'start',
    role: 'caption',
    step,
  });
}

function pushNote(draft: Draft, t: ModeTokens, lines: string[], x: number, top: number, step: number) {
  if (!lines.length) return;

  draft.texts.push({
    x: round(x),
    y: round(baseline(top, t.mono.size, t.mono.lh)),
    lines,
    size: t.mono.size,
    lh: t.mono.lh,
    track: round(t.mono.track * t.mono.size),
    anchor: 'start',
    role: 'note',
    step,
  });
}

/** The payload annotation, centred on the midpoint of the line it belongs to. */
function pushLabel(draft: Draft, t: ModeTokens, lines: string[], mid: Point, step: number) {
  if (!lines.length) return;

  draft.labels.push({
    x: mid.x,
    y: round(mid.y - ((lines.length - 1) * t.label.lh) / 2 + t.label.size * 0.34),
    lines,
    size: t.label.size,
    lh: t.label.lh,
    track: round(t.label.track * t.label.size),
    anchor: 'middle',
    role: 'label',
    step: step + 1,
  });
}

const emptyDraft = (): Draft => ({
  nodes: [],
  lanes: [],
  chips: [],
  edges: [],
  texts: [],
  labels: [],
});

function finish(draft: Draft, mode: DiagramMode, width: number, height: number): DiagramLayout {
  const texts = [...draft.texts, ...draft.labels];

  /*
   * The story is as long as its last step, counted rather than declared - a
   * pipeline runs to one fewer than a round trip in a column, and an arrowhead
   * lands part of a step after the line it belongs to. CSS divides the scroll
   * range by this, so it has to be what the drawing actually uses.
   */
  const last = Math.max(
    ...draft.nodes.map((n) => n.step),
    ...draft.lanes.map((l) => l.step),
    ...draft.edges.map((e) => e.step),
    ...texts.map((t) => t.step),
  );

  return {
    mode,
    width: round(width),
    height: round(height),
    lanes: draft.lanes,
    nodes: draft.nodes,
    chips: draft.chips,
    edges: draft.edges,
    texts,
    steps: last + 1,
  };
}

/* ---- The row composition, which is the desktop one ----------------------- */

function layoutRow(r: Resolved, t: RowTokens, mode: DiagramMode): DiagramLayout {
  const n = r.services.length;
  const hasExit = Boolean(r.exit);

  /*
   * 1. Widths. The columns take their preferred size and the gaps take what is
   *    left over; where there is not enough to go round, every node gives up
   *    the same fraction until they reach `minShrink`, past which the drawing
   *    is allowed to run wider than the target and the SVG scales down whole.
   */
  let wEntry = t.nodeWidth[1];
  let wCore = t.nodeWidth[2];
  let wService = t.nodeWidth[3];
  let wExit = hasExit ? t.nodeWidth[1] : 0;

  const gaps = [r.entryLabel || r.exitLabel ? t.gap.labelled : t.gap.plain, t.gap.plain];
  if (hasExit) gaps.push(t.gap.plain);

  const laneExtra = 2 * t.lane.pad;
  const gapSum = sum(gaps);
  const nodeSum = () => wEntry + wCore + wService + wExit;
  const total = () => nodeSum() + laneExtra + gapSum + 2 * t.framePad.x;

  let width = t.width;

  if (total() <= t.width) {
    const spread = (t.width - total()) / gaps.length;
    for (let i = 0; i < gaps.length; i += 1) gaps[i] += spread;
  } else {
    const room = t.width - 2 * t.framePad.x - gapSum - laneExtra;
    const factor = Math.max(t.minShrink, room / nodeSum());

    wEntry *= factor;
    wCore *= factor;
    wService *= factor;
    wExit *= factor;
    width = Math.max(t.width, total());
  }

  const wLane = wService + laneExtra;

  /* 2. Text, and the heights that follow from it. */
  const entryFill = fill(r.entry, wEntry, t.title, t, r.entryCaption);
  const coreFill = fill(r.core, wCore, t.title, t, r.coreCaption);
  const serviceFills = r.services.map((service) => fill(service, wService, t.serviceTitle, t));
  const exitFill = r.exit ? fill(r.exit, wExit, t.title, t, r.exitCaption) : undefined;

  const labelWidth = gaps[0] - 24;
  const inLines = wrap(caps(r.entryLabel ?? ''), labelWidth, monoMetric(t.label));
  const outLines = wrap(caps(r.exitLabel ?? ''), labelWidth, monoMetric(t.label));
  const noteLines = wrap(caps(r.exit?.note ?? ''), wExit, monoMetric(t.mono));

  /*
   * On a round trip two lines run between the same pair of nodes and each
   * carries an annotation sitting on it, so the separation is whatever keeps
   * those two annotations clear of each other. The two nodes then grow until
   * they have an edge long enough to anchor both.
   */
  const separation = r.roundTrip
    ? Math.max(44, ((inLines.length + outLines.length) * t.label.lh) / 2 + 20)
    : 0;

  const hEntry = Math.max(entryFill.height, separation + 52);
  const hCore = Math.max(coreFill.height, separation + 52);
  const hExit = exitFill?.height ?? 0;
  const hLane =
    t.lane.padTop + sum(serviceFills.map((f) => f.height)) + t.lane.gap * (n - 1) + t.lane.pad;

  /*
   * 3. One axis for every box. Every caption in this composition is set inside
   *    the box it belongs to - a node's in its own card, the lane's in its
   *    top-left - so nothing reserves height above anything. Only the exit's
   *    annotation hangs outside, under it.
   */
  const noteHeight = noteLines.length ? t.noteGap + noteLines.length * t.mono.lh : 0;

  const above = Math.max(hEntry / 2, hCore / 2, hLane / 2, hExit / 2);
  const below = Math.max(hEntry / 2, hCore / 2, hLane / 2, hExit / 2 + noteHeight);

  let height = above + below + 2 * t.framePad.y;
  let cy = t.framePad.y + above;

  if (height < t.minHeight) {
    cy += (t.minHeight - height) / 2;
    height = t.minHeight;
  }

  /* 4. Place. */
  const xEntry = t.framePad.x;
  const xCore = xEntry + wEntry + gaps[0];
  const xLane = xCore + wCore + gaps[1];
  const xExit = xLane + wLane + (gaps[2] ?? 0);

  const yEntry = cy - hEntry / 2;
  const yCore = cy - hCore / 2;
  const yLane = cy - hLane / 2;
  const yExit = cy - hExit / 2;

  const draft = emptyDraft();

  place(draft, t, {
    node: r.entry,
    filled: entryFill,
    x: xEntry,
    y: yEntry,
    w: wEntry,
    h: hEntry,
    style: t.title,
    role: 'title',
    step: ROW_STEP.entry,
  });

  place(draft, t, {
    node: r.core,
    filled: coreFill,
    x: xCore,
    y: yCore,
    w: wCore,
    h: hCore,
    style: t.title,
    role: 'title',
    step: ROW_STEP.core,
  });

  draft.lanes.push({
    x: round(xLane),
    y: round(yLane),
    w: round(wLane),
    h: round(hLane),
    step: ROW_STEP.lane,
  });

  if (r.laneCaption) {
    /* Inside the lane's own top-left, not over it: the lane is a container and
       its caption belongs to the space it encloses. */
    pushCaption(draft, t, r.laneCaption, xLane + t.lane.pad, yLane + t.lane.padTop - 4, ROW_STEP.lane);
  }

  const serviceY: number[] = [];
  let cursor = yLane + t.lane.padTop;

  r.services.forEach((service, i) => {
    const f = serviceFills[i];

    place(draft, t, {
      node: service,
      filled: f,
      x: xLane + t.lane.pad,
      y: cursor,
      w: wService,
      h: f.height,
      style: t.serviceTitle,
      role: 'service',
      step: ROW_STEP.services,
    });

    serviceY.push(cursor + f.height / 2);
    cursor += f.height + t.lane.gap;
  });

  if (r.exit && exitFill) {
    place(draft, t, {
      node: r.exit,
      filled: exitFill,
      x: xExit,
      y: yExit,
      w: wExit,
      h: hExit,
      style: t.title,
      role: 'title',
      step: ROW_STEP.out,
    });

    pushNote(draft, t, noteLines, xExit, yExit + hExit + t.noteGap, ROW_STEP.note);
  }

  /* 5. Connectors, in the order the run takes them. */
  const inY = r.roundTrip ? cy - separation / 2 : cy;
  const inEdge = connector({ x: xEntry + wEntry, y: inY }, { x: xCore, y: inY }, 'x');
  draft.edges.push({ ...inEdge, step: ROW_STEP.in });
  pushLabel(draft, t, inLines, inEdge.mid, ROW_STEP.in);

  /*
   * The fan sits a little high on a round trip, because the leg coming back
   * lands on the same edge and has to arrive under every line that left it.
   */
  const fanCentre = r.roundTrip ? cy - 10 : cy;

  anchors(n, fanCentre, hCore - 52, t.fanStep).forEach((y, i) => {
    draft.edges.push({
      ...connector({ x: xCore + wCore, y }, { x: xLane + t.lane.pad, y: serviceY[i] }, 'x'),
      step: ROW_STEP.lane,
    });
  });

  if (r.roundTrip) {
    /*
     * ⚠️ One return, hugging the underside of the lane, rather than one per
     * service. Three lines coming back would have to cross the three going out
     * or travel over the boxes they left, and neither is allowed. It is also
     * the truer statement: the services do not know about each other, so what
     * returns to the core is the lane.
     */
    draft.edges.push({
      ...connector(
        { x: xLane, y: yLane + hLane - 26 },
        { x: xCore + wCore, y: yCore + hCore - 16 },
        'x',
      ),
      step: ROW_STEP.back,
    });

    const outY = cy + separation / 2;
    const outEdge = connector({ x: xCore, y: outY }, { x: xEntry + wEntry, y: outY }, 'x');
    draft.edges.push({ ...outEdge, step: ROW_STEP.out });
    pushLabel(draft, t, outLines, outEdge.mid, ROW_STEP.out);
  } else if (r.exit) {
    anchors(n, cy, hExit - 52, t.fanStep).forEach((y, i) => {
      draft.edges.push({
        ...connector({ x: xLane + t.lane.pad + wService, y: serviceY[i] }, { x: xExit, y }, 'x'),
        step: ROW_STEP.back,
      });
    });
  }

  return finish(draft, mode, width, height);
}

/* ---- The column composition, for tablet and phone ------------------------ */

/**
 * Stacked stages, top to bottom.
 *
 * ⚠️ A round trip is drawn here as a straight chain with its core and its
 * terminal named a second time at the foot, rather than as two rails running
 * back up the outside of the column. At this width a rail has nowhere to put
 * the payload it carries: the channel beside the boxes is 40 units wide and the
 * annotation is a sentence. Saying the same thing twice and keeping every
 * annotation on a real line is the honest trade.
 */
function layoutColumn(r: Resolved, t: ColumnTokens, mode: DiagramMode): DiagramLayout {
  const n = r.services.length;
  const contentW = t.width - 2 * t.framePad.x;
  const nodeW = t.stackNodeWidth ?? contentW;
  const cx = t.width / 2;
  const nodeX = cx - nodeW / 2;

  const laneRow = t.laneAxis === 'row';
  const wService = laneRow
    ? (contentW - 2 * t.lane.pad - t.lane.gap * (n - 1)) / n
    : contentW - 2 * t.lane.pad;

  const entryFill = fill(r.entry, nodeW, t.title, t);
  const coreFill = fill(r.core, nodeW, t.title, t);
  const serviceFills = r.services.map((service) => fill(service, wService, t.serviceTitle, t));
  const exitFill = r.exit ? fill(r.exit, nodeW, t.title, t) : undefined;

  const hLane = laneRow
    ? t.lane.padTop + Math.max(...serviceFills.map((f) => f.height)) + t.lane.pad
    : t.lane.padTop + sum(serviceFills.map((f) => f.height)) + t.lane.gap * (n - 1) + t.lane.pad;

  const labelWidth = nodeW - 24;
  const inLines = wrap(caps(r.entryLabel ?? ''), labelWidth, monoMetric(t.label));
  const outLines = wrap(caps(r.exitLabel ?? ''), labelWidth, monoMetric(t.label));
  const noteLines = wrap(caps(r.exit?.note ?? ''), contentW, monoMetric(t.mono));

  /* A labelled gap is as tall as its annotation plus air, never less. */
  const gapFor = (lines: string[]) =>
    lines.length ? lines.length * t.label.lh + 34 : t.gap.plain;

  const draft = emptyDraft();
  let y = t.framePad.y;

  place(draft, t, {
    node: r.entry,
    filled: entryFill,
    x: nodeX,
    y,
    w: nodeW,
    h: entryFill.height,
    style: t.title,
    role: 'title',
    step: COL_STEP.entry,
  });

  let floor = y + entryFill.height;
  y = floor + gapFor(inLines);

  place(draft, t, {
    node: r.core,
    filled: coreFill,
    x: nodeX,
    y,
    w: nodeW,
    h: coreFill.height,
    style: t.title,
    role: 'title',
    step: COL_STEP.core,
  });

  const inEdge = connector({ x: cx, y: floor }, { x: cx, y }, 'y');
  draft.edges.push({ ...inEdge, step: COL_STEP.in });
  pushLabel(draft, t, inLines, inEdge.mid, COL_STEP.in);

  floor = y + coreFill.height;
  /* `fanRoom` rather than a caption's worth of space: the lane's caption sits
     inside it, and what the gap has to hold is the fan spreading sideways. */
  y = floor + t.gap.plain + t.fanRoom;

  /* The lane. */
  const laneX = t.framePad.x;
  const laneY = y;

  draft.lanes.push({
    x: round(laneX),
    y: round(laneY),
    w: round(contentW),
    h: round(hLane),
    step: COL_STEP.lane,
  });

  if (r.laneCaption) {
    pushCaption(draft, t, r.laneCaption, laneX + t.lane.pad, laneY + t.lane.padTop - 4, COL_STEP.lane);
  }

  const serviceTop: Point[] = [];
  const serviceFloor: Point[] = [];
  let downCursor = laneY + t.lane.padTop;
  let acrossCursor = laneX + t.lane.pad;

  r.services.forEach((service, i) => {
    const f = serviceFills[i];
    const sx = laneRow ? acrossCursor : laneX + t.lane.pad;
    const sy = downCursor;

    place(draft, t, {
      node: service,
      filled: f,
      x: sx,
      y: sy,
      w: wService,
      h: f.height,
      style: t.serviceTitle,
      role: 'service',
      step: COL_STEP.services,
    });

    serviceTop.push({ x: sx + wService / 2, y: sy });
    serviceFloor.push({ x: sx + wService / 2, y: sy + f.height });

    if (laneRow) acrossCursor += wService + t.lane.gap;
    else downCursor += f.height + t.lane.gap;
  });

  /*
   * Into the lane: a fan where the services sit side by side, one line into the
   * lane itself where they are stacked. The lane's border is what says the
   * services run together, so at phone width the connectors need not.
   */
  if (laneRow) {
    anchors(n, cx, nodeW - 52, t.fanStep).forEach((x, i) => {
      draft.edges.push({ ...connector({ x, y: floor }, serviceTop[i], 'y'), step: COL_STEP.lane });
    });
  } else {
    draft.edges.push({
      ...connector({ x: cx, y: floor }, { x: cx, y: laneY }, 'y'),
      step: COL_STEP.lane,
    });
  }

  floor = laneY + hLane;
  y = floor + t.gap.plain + t.fanRoom;

  /** Out of the lane and into whatever is under it. */
  const merge = (targetY: number) => {
    if (laneRow) {
      const landing = anchors(n, cx, nodeW - 52, t.fanStep);

      serviceFloor.forEach((point, i) => {
        draft.edges.push({
          ...connector(point, { x: landing[i], y: targetY }, 'y'),
          step: COL_STEP.merge,
        });
      });
    } else {
      draft.edges.push({
        ...connector({ x: cx, y: floor }, { x: cx, y: targetY }, 'y'),
        step: COL_STEP.merge,
      });
    }
  };

  if (r.roundTrip) {
    place(draft, t, {
      node: r.core,
      id: `${r.core.id}-return`,
      filled: coreFill,
      x: nodeX,
      y,
      w: nodeW,
      h: coreFill.height,
      style: t.title,
      role: 'title',
      step: COL_STEP.landing,
    });

    merge(y);

    floor = y + coreFill.height;
    y = floor + gapFor(outLines);

    place(draft, t, {
      node: r.entry,
      id: `${r.entry.id}-return`,
      filled: entryFill,
      x: nodeX,
      y,
      w: nodeW,
      h: entryFill.height,
      style: t.title,
      role: 'title',
      step: COL_STEP.tail,
    });

    const outEdge = connector({ x: cx, y: floor }, { x: cx, y }, 'y');
    draft.edges.push({ ...outEdge, step: COL_STEP.out });
    pushLabel(draft, t, outLines, outEdge.mid, COL_STEP.out);

    y += entryFill.height;
  } else if (r.exit && exitFill) {
    place(draft, t, {
      node: r.exit,
      filled: exitFill,
      x: nodeX,
      y,
      w: nodeW,
      h: exitFill.height,
      style: t.title,
      role: 'title',
      step: COL_STEP.landing,
    });

    merge(y);

    y += exitFill.height;

    if (noteLines.length) {
      pushNote(draft, t, noteLines, t.framePad.x, y + t.noteGap, COL_STEP.out);
      y += t.noteGap + noteLines.length * t.mono.lh;
    }
  }

  return finish(draft, mode, t.width, y + t.framePad.y);
}

/* ---- The one entry point ------------------------------------------------- */

export function layoutDiagram(spec: DiagramSpec, mode: DiagramMode): DiagramLayout {
  const t = modes[mode];
  const r = resolve(spec);

  return t.axis === 'row' ? layoutRow(r, t, mode) : layoutColumn(r, t, mode);
}
