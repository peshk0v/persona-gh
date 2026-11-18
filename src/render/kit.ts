import metrics from "./metrics.json";
import { FONT, FONT_CYR } from "./fontdata";
import type { Icons, Palette, ShapeName } from "./types";
import type { ChipSpec, ChipVariant, SurfaceSpec, Theme } from "./themes/types";

const METRICS = metrics as Record<string, Record<string, number>>;

// Text
export function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}

// Glyphs missing from the width table: CJK and emoji render as full-width boxes,
// not as narrow latin fallbacks, so measuring them at 0.55em clips text.
function glyphWidth(ch: string, table: Record<string, number>) {
  const known = table[ch];
  if (known !== undefined) return known;
  const c = ch.codePointAt(0) ?? 0;
  if (c >= 0x2e80 || (c >= 0x1f000 && c <= 0x1faff) || (c >= 0x2600 && c <= 0x27bf)) return 1;
  return 0.55;
}

export function textWidth(s: string, size: number, weight = 400, scale = 1, mono = false) {
  if (mono) return [...s].length * 0.6 * size * scale;
  const key = [400, 500, 600, 700].reduce((a, b) => (Math.abs(b - weight) < Math.abs(a - weight) ? b : a));
  const table = METRICS[String(key)];
  let w = 0;
  for (const ch of s) w += glyphWidth(ch, table);
  return w * size * scale;
}

export function wrap(s: string, size: number, width: number, weight = 400, lines = 2, scale = 1, mono = false) {
  const fits = (t: string) => textWidth(t, size, weight, scale, mono) <= width;
  const out: string[] = [];
  let cur = "";
  for (const word of s.split(/\s+/).filter(Boolean)) {
    if (cur && !fits(`${cur} ${word}`)) {
      out.push(cur);
      cur = word;
    } else if (!cur) {
      cur = word;
    } else {
      cur = `${cur} ${word}`;
    }
    if (cur && !fits(cur)) {
      // a single token wider than the box (url, hash, mixed script) has to be hard-broken
      const parts: string[] = [];
      let piece = "";
      for (const ch of cur) {
        if (piece && !fits(piece + ch)) {
          parts.push(piece);
          piece = ch;
        } else piece += ch;
      }
      if (piece) parts.push(piece);
      out.push(...parts.slice(0, -1));
      cur = parts[parts.length - 1] ?? "";
    }
  }
  out.push(cur);
  if (out.length > lines) {
    out.length = lines;
    let last = out[lines - 1];
    while (last.length > 1 && !fits(`${last}…`)) {
      const cut = last.lastIndexOf(" ");
      last = cut > 0 ? last.slice(0, cut) : last.slice(0, -1);
    }
    out[lines - 1] = `${last.trimEnd()}…`;
  }
  return out;
}

export function fit(s: string, size: number, width: number, weight = 400, scale = 1, mono = false) {
  if (textWidth(s, size, weight, scale, mono) <= width) return s;
  let t = s;
  while (t.length > 1 && textWidth(t + "…", size, weight, scale, mono) > width) t = t.slice(0, -1);
  return t.trimEnd() + "…";
}

function parseColor(c: string): [number, number, number, number] {
  const s = c.trim();
  if (s.startsWith("#")) {
    const h = s.slice(1);
    const f = h.length === 3 ? h.split("").map((x) => x + x).join("") : h.slice(0, 6);
    const r = parseInt(f.slice(0, 2), 16) || 0;
    const g = parseInt(f.slice(2, 4), 16) || 0;
    const b = parseInt(f.slice(4, 6), 16) || 0;
    return [r, g, b, 1];
  }
  const m = /^rgba?\(([^)]+)\)$/i.exec(s);
  if (m) {
    const p = m[1].split(",").map((x) => Number(x.trim()));
    return [p[0] || 0, p[1] || 0, p[2] || 0, p[3] ?? 1];
  }
  return [0, 0, 0, 1];
}

export function mix(a: string, b: string, t: number) {
  const pa = parseColor(a);
  const pb = parseColor(b);
  const out = pa.map((x, i) => (i < 3 ? Math.round(x + (pb[i] - x) * t) : +(x + (pb[i] - x) * t).toFixed(3)));
  if (out[3] < 1) return `rgba(${out[0]},${out[1]},${out[2]},${out[3]})`;
  return "#" + out.slice(0, 3).map((x) => x.toString(16).padStart(2, "0")).join("");
}

// Shapes
export const SHAPE_PARAMS: Record<ShapeName, [number, number, number]> = {
  cookie: [9, 0.07, 1],
  cookie12: [12, 0.05, 1],
  clover: [4, 0.2, 1],
  sunny: [8, 0.1, 2.2],
  flower: [8, 0.16, 1],
  pill: [2, 0, 1],
  soft: [4, 0.05, 0.6],
  gem: [6, 0.07, 1.6],
};

export const SHAPE_NAMES = Object.keys(SHAPE_PARAMS) as ShapeName[];
const STEPS = 180;

export function radii(kind: ShapeName) {
  const [n, a, sharp] = SHAPE_PARAMS[kind] ?? SHAPE_PARAMS.cookie;
  const out: number[] = [];
  for (let i = 0; i < STEPS; i++) {
    const t = (2 * Math.PI * i) / STEPS;
    const c = Math.cos(n * t);
    const wave = Math.sign(c) * Math.abs(c) ** (1 / sharp);
    out.push(1 - a + a * wave);
  }
  return out;
}

export function radiiPath(rs: number[], cx: number, cy: number, r: number) {
  const pts = rs.map((k, i) => {
    const t = (2 * Math.PI * i) / rs.length - Math.PI / 2;
    return `${(cx + r * k * Math.cos(t)).toFixed(1)} ${(cy + r * k * Math.sin(t)).toFixed(1)}`;
  });
  return "M" + pts.join(" L") + " Z";
}

export function shape(kind: ShapeName, cx: number, cy: number, r: number) {
  return radiiPath(radii(kind), cx, cy, r);
}

// Square / rounded-square frame for themes that do not use organic blobs.
export function framePath(kind: ShapeName | "square" | undefined, cx: number, cy: number, r: number, rx = 0) {
  if (kind && kind === "square") {
    const x = cx - r;
    const y = cy - r;
    const s = r * 2;
    const k = Math.max(0, Math.min(rx, r));
    if (k <= 0) return `M${x} ${y} H${x + s} V${y + s} H${x} Z`;
    return (
      `M${x + k} ${y} H${x + s - k} Q${x + s} ${y} ${x + s} ${y + k}` +
      ` V${y + s - k} Q${x + s} ${y + s} ${x + s - k} ${y + s}` +
      ` H${x + k} Q${x} ${y + s} ${x} ${y + s - k}` +
      ` V${y + k} Q${x} ${y} ${x + k} ${y} Z`
    );
  }
  return shape((kind ?? "cookie") as ShapeName, cx, cy, r);
}

// Surface primitive. Emits an optional hard shadow, the main shape and inner frames.
// Shadows that fall outside the viewBox are clipped by the renderer: blocks that fill
// the whole canvas therefore read as flat frames, which is intended (there is no room
// to show a shadow), while padded surfaces get a real offset shadow.
export function surface(spec: SurfaceSpec, x: number, y: number, w: number, h: number, extra = "") {
  const attrs = (sx: number, sy: number) => {
    let a = `x="${+sx.toFixed(2)}" y="${+sy.toFixed(2)}" width="${+w.toFixed(2)}" height="${+h.toFixed(2)}" rx="${spec.rx}"`;
    if (spec.stroke) a += ` stroke="${spec.stroke}" stroke-width="${spec.strokeWidth ?? 1}"`;
    if (spec.filter) a += ` filter="${spec.filter}"`;
    if (spec.opacity !== undefined) a += ` opacity="${spec.opacity}"`;
    return a;
  };
  let out = "";
  if (spec.shadow) out += `<rect ${attrs(x + spec.shadow.dx, y + spec.shadow.dy)} fill="${spec.shadow.color}"/>`;
  out += `<rect ${attrs(x, y)} fill="${spec.fill}"${extra}/>`;
  for (const b of spec.innerBorders ?? []) {
    const rx = Math.max(0, spec.rx - b.inset);
    out +=
      `<rect x="${+(x + b.inset).toFixed(2)}" y="${+(y + b.inset).toFixed(2)}" ` +
      `width="${+(w - b.inset * 2).toFixed(2)}" height="${+(h - b.inset * 2).toFixed(2)}" ` +
      `rx="${rx}" fill="none" stroke="${b.stroke}" stroke-width="${b.width}"/>`;
  }
  return out;
}

export function chipSurface(spec: ChipSpec, x: number, y: number, w: number, h: number) {
  return surface(
    { fill: spec.fill, rx: spec.rx, stroke: spec.stroke, strokeWidth: spec.strokeWidth, filter: spec.filter, shadow: spec.shadow },
    x,
    y,
    w,
    h,
  );
}

// Icons
export function icon(icons: Icons, name: string, x: number, y: number, size: number, fill: string) {
  if (name.startsWith("brand:")) {
    const b = icons.brand[name.slice(6)];
    if (!b) return "";
    return `<path d="${b.d}" fill="${fill}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(size / 24).toFixed(4)})"/>`;
  }
  const d = icons.symbol[name];
  if (!d) return "";
  const s = size / 960;
  return `<path d="${d}" fill="${fill}" transform="translate(${x.toFixed(1)} ${(y + 960 * s).toFixed(1)}) scale(${s.toFixed(4)})"/>`;
}

// Svg
export function txt(
  x: number, y: number, s: string, size: number, fill: string,
  o: { weight?: number; cls?: string; delay?: number; anchor?: string; extra?: string } = {},
) {
  let style = `font-size:${size}px;font-weight:${o.weight ?? 400};`;
  if (o.delay !== undefined) style += `animation-delay:${o.delay.toFixed(2)}s;`;
  const c = o.cls ? ` class="${o.cls}"` : "";
  return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" fill="${fill}" text-anchor="${o.anchor ?? "start"}" style="${style}"${c}${o.extra ?? ""}>${esc(s)}</text>`;
}

export function pop(body: string, delay: number, cls = "pop") {
  return `<g class="${cls}" style="animation-delay:${delay.toFixed(2)}s">${body}</g>`;
}

const CSS = `
.up{animation:up .8s cubic-bezier(.05,.7,.1,1) both}
.pop{transform-box:fill-box;transform-origin:center;animation:pop .6s cubic-bezier(.34,1.56,.64,1) both}
.fade{animation:fade .9s ease both}
.spin{transform-box:fill-box;transform-origin:center;animation:spin 40s linear infinite}
.spin-r{transform-box:fill-box;transform-origin:center;animation:spin 28s linear infinite reverse}
.bob{transform-box:fill-box;transform-origin:center;animation:bob 7s ease-in-out infinite}
.grow{transform-box:fill-box;transform-origin:left center;animation:grow 1.1s cubic-bezier(.2,0,0,1) both}
.wght{animation:wght 1.6s cubic-bezier(.2,0,0,1) .2s both}
.wave{animation:wave 2.4s linear infinite}
.blink{animation:blink 1s step-end infinite}
@keyframes blink{50%{opacity:0}}
@keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes bob{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-10px) rotate(12deg)}}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes wght{from{font-variation-settings:'ROND' 100,'wght' 400}to{font-variation-settings:'ROND' 100,'wght' 760}}
@keyframes wave{from{transform:translateX(0)}to{transform:translateX(-48px)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}`;

export interface SvgOptions {
  extra?: string;
  th?: Theme;
  dark?: boolean;
  p?: Palette;
  /** Draw the theme backdrop (glow, pattern). Only full-width blocks and standalone
   *  cards have room for it; small pieces must stay transparent or they show up as
   *  separate plates in a README. */
  backdrop?: boolean;
}

export function svg(w: number, h: number, body: string, title: string, motion = true, opts: SvgOptions = {}) {
  const th = opts.th;
  const useEmbedded = !th || th.embedFont;
  const cyr = useEmbedded && /[Ѐ-ӿ]/.test(body)
    ? `@font-face{font-family:R;src:url(data:font/woff2;base64,${FONT_CYR}) format('woff2');font-weight:400 800}`
    : "";
  const fonts = useEmbedded && body.includes("<text")
    ? `@font-face{font-family:G;src:url(data:font/woff2;base64,${FONT}) format('woff2');font-weight:400 800}` + cyr
    : "";
  const family = useEmbedded
    ? `G,R,'Google Sans','Segoe UI',Roboto,sans-serif;font-variation-settings:'ROND' 100`
    : `${th!.fontFamily}`;
  const css =
    fonts +
    `text{font-family:${family}}` +
    CSS +
    (opts.extra ?? "") +
    (motion ? "" : "*{animation:none!important}");
  const defs = th?.defs && opts.p ? th.defs(opts.p, !!opts.dark) : "";
  const backdrop = th?.backdrop && opts.p && opts.backdrop === true ? th.backdrop(opts.p, !!opts.dark, w, h) : "";
  const content = (defs ? `<defs>${defs}</defs>` : "") + backdrop + body;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ` +
    `width="${+w.toFixed(2)}" height="${+h.toFixed(2)}" viewBox="0 0 ${+w.toFixed(2)} ${+h.toFixed(2)}" role="img" aria-label="${esc(title)}">` +
    `<title>${esc(title)}</title><style>${css}</style>${content}</svg>`
  );
}

export function chip(
  icons: Icons, p: Palette, x: number, y: number, label: string,
  o: { icon?: string; delay?: number; h?: number; size?: number; style?: ChipVariant; th?: Theme; dark?: boolean; scale?: number; mono?: boolean } = {},
): [string, number] {
  const h = o.h ?? 36;
  const size = o.size ?? 15;
  const pad = 14;
  const iw = o.icon ? 18 : 0;
  const gap = o.icon ? 8 : 0;
  const w = pad * 2 + iw + gap + textWidth(label, size, 500, o.scale ?? 1, !!o.mono);
  const variant: ChipVariant = o.style ?? "outlined";
  const spec = o.th
    ? o.th.chip(p, !!o.dark, variant)
    : variant === "filled"
      ? { fill: p.primary, fg: p.onPrimary, rx: 10 }
      : variant === "tertiary"
        ? { fill: p.tertiaryContainer, fg: p.onTertiaryContainer, rx: 11 }
        : variant === "tonal"
          ? { fill: p.secondaryContainer, fg: p.onSecondaryContainer, rx: 10 }
          : { fill: p.surfaceContainerLow, fg: p.onSurfaceVariant, rx: 10, stroke: p.outlineVariant, strokeWidth: 1 };
  let body = chipSurface(spec, x, y, w, h);
  if (o.icon) body += icon(icons, o.icon, x + pad, y + (h - 18) / 2, 18, p.primary);
  body += txt(x + pad + iw + gap, y + h / 2 + size * 0.36, label, size, spec.fg, { weight: 500 });
  return [pop(body, o.delay ?? 0), w];
}
