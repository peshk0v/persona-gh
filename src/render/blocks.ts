import { chip, chipSurface, esc, fit, framePath, icon, mix, pop, shape, surface, svg, textWidth, txt, wrap } from "./kit";
import type { Theme } from "./themes";
import type { Config, Data, Icons, LinkButton, Palette, Repo, ShapeName, Social } from "./types";

export const W = 840;
export const CARD_SHAPES: ShapeName[] = ["cookie", "clover", "sunny", "flower"];
export const REPO_URL = "https://github.com/peshk0v/persona-gh";
export const SITE_URL = "https://peshk0v.github.io/persona-gh/";

const ICON_RULES: [string[], string][] = [
  [["zip", "archive", "7-zip", "rar"], "folder_zip"],
  [["music", "audio", "spotify", "player", "sound"], "music_note"],
  [["dictat", "speech", "voice", "whisper", "mic"], "mic"],
  [["tracker", "screen time", "activity", "monitor", "stats"], "monitoring"],
  [["discord"], "brand:discord"],
  [["game", "minecraft", "mod "], "sports_esports"],
  [["site", "website", "web ", "landing", "portfolio"], "language"],
  [["launcher", "installer"], "deployed_code"],
  [["theme", "design", "ui kit", "palette"], "palette"],
  [["terminal", "cli", "shell", "dotfiles", "hyprland"], "terminal"],
];

const LANG_ICONS: Record<string, string> = {
  Rust: "brand:rust",
  Python: "brand:python",
  TypeScript: "brand:typescript",
  JavaScript: "brand:javascript",
  "C#": "brand:dotnet",
  Java: "brand:openjdk",
  Go: "brand:go",
  Kotlin: "brand:kotlin",
  Swift: "brand:swift",
  "C++": "brand:cplusplus",
  Dart: "brand:dart",
  PHP: "brand:php",
  HTML: "brand:html5",
  CSS: "brand:css",
  Vue: "brand:vuedotjs",
  Svelte: "brand:svelte",
};

export const AUTO_ICONS = [...new Set([...ICON_RULES.map(([, n]) => n), ...Object.values(LANG_ICONS), "code"])];

interface Ctx {
  c: Config;
  d: Data;
  p: Palette;
  i: Icons;
  th: Theme;
  dark: boolean;
}

/** Width multiplier for a rendered weight. Non-material themes are drawn with system
 *  fonts that are wider than the measurement table, bold ones especially. */
function ms(th: Theme, weight = 400) {
  return (th.textScale ?? 1) * (weight >= 600 ? (th.boldScale ?? 1) : 1);
}

function sectionTitle(x: number, y: number, label: string, ic: string, { p, i, th }: Ctx, delay = 0) {
  const tile = `<path class="pop" style="animation-delay:${delay.toFixed(2)}s" d="${framePath(th.iconShape ?? "cookie", x + 20, y + 20, 20, th.radius.icon)}" fill="${p.primaryContainer}"/>`;
  const glyph = pop(icon(i, ic, x + 9, y + 9, 22, p.onPrimaryContainer), delay + 0.05);
  const size = th.heading.uppercase ? 21 : 24;
  const labelText = th.heading.uppercase ? label.toUpperCase() : label;
  const spacing = th.heading.spacing || 0;
  const spacingAttr = spacing ? ` letter-spacing="${spacing}"` : "";
  // letter-spacing is not part of the glyph table, so subtract it from the fit budget
  const budget = W - x - 82 - labelText.length * spacing;
  return tile + glyph + txt(x + 54, y + 28, fit(labelText, size, budget, th.heading.weight, ms(th, th.heading.weight), th.mono), size, p.onSurface, { weight: th.heading.weight, cls: "up", delay, extra: spacingAttr });
}

// Hero
export function hero(ctx: Ctx, avatar: string | null) {
  const { c, p, i, th, dark } = ctx;
  const h = 300;
  const b = [`<clipPath id="card"><rect width="${W}" height="${h}" rx="${th.radius.card}"/></clipPath>`];
  b.push(surface(th.card(p, dark), 0, 0, W, h));
  b.push('<g clip-path="url(#card)">');
  if (th.hero) b.push(th.hero(p, dark));
  b.push("</g>");
  const cx = 150;
  const cy = 150;
  const frame = (th.avatarShape ?? c.hero.avatarShape) as ShapeName | "square";
  const av = th.avatar?.(p, dark);
  if (!av || av.halo) {
    const halo = th.avatarShape === "square" ? framePath("square", cx, cy, 112, th.radius.avatar) : shape("sunny", cx, cy, 112);
    const attrs = av?.halo
      ? ` fill="${av.halo.fill}"` +
        (av.halo.opacity !== undefined ? ` opacity="${av.halo.opacity}"` : "") +
        (av.halo.stroke ? ` stroke="${av.halo.stroke}" stroke-width="${av.halo.strokeWidth ?? 1}"` : "")
      : ` fill="${p.primary}" opacity=".9"`;
    b.push(`<path${av && av.spin === false ? "" : ' class="spin"'} d="${halo}"${attrs}/>`);
  }
  b.push(`<clipPath id="ava"><path d="${framePath(frame, cx, cy, 98, th.radius.avatar)}"/></clipPath>`);
  const fs = av?.frame;
  b.push(
    `<path d="${framePath(frame, cx, cy, 102, th.radius.avatar)}" fill="${fs?.fill ?? p.surfaceContainer}"` +
      (fs?.stroke ? ` stroke="${fs.stroke}" stroke-width="${fs.strokeWidth ?? 1}"` : "") +
      (fs?.filter ? ` filter="${fs.filter}"` : "") +
      `/>`,
  );
  if (avatar) {
    b.push(`<g class="fade"><image href="${avatar}" x="${cx - 100}" y="${cy - 100}" width="200" height="200" clip-path="url(#ava)" preserveAspectRatio="xMidYMid slice"/></g>`);
  } else {
    b.push(`<path d="${framePath(frame, cx, cy, 98, th.radius.avatar)}" fill="${av?.inner ?? p.primaryContainer}"/>`);
    b.push(icon(i, "person", cx - 44, cy - 44, 88, av?.icon ?? p.onPrimaryContainer));
  }
  const x = 294;
  const name = c.hero.name || c.login;
  const room = W - x - 24;
  const scale = th.textScale ?? 1;
  const size = Math.min(68, room / Math.max(1, textWidth(name, 1, 700, ms(th, 700), th.mono)));
  b.push(txt(x, 92, fit(c.hero.greeting, 22, W - x - 24, 500, ms(th, 500), th.mono), 22, p.onSurfaceVariant, { weight: 500, cls: "up", delay: 0.1 }));
  b.push(
    th.embedFont
      ? pop(txt(x - 3, 156, name, size, p.onSurface, { cls: "wght" }), 0.2, "up")
      : pop(txt(x - 3, 156, name, size, p.onSurface, { weight: th.heading.weight, cls: "up" }), 0.2, "up"),
  );
  const lines = wrap(c.hero.subtitle, 19, 430, 400, 2, scale, th.mono);
  let extra = "";
  if (c.hero.typing && c.motion && lines.join("")) {
    const [body, css] = typing(lines, x, p, scale, th.mono);
    b.push(body);
    extra = css;
  } else lines.forEach((line, n) => {
    b.push(txt(x, 194 + n * 26, line, 19, p.onSurfaceVariant, { cls: "up", delay: 0.35 + n * 0.08 }));
  });
  let cx2 = x;
  c.hero.chips.forEach((item, n) => {
    // keep every chip: trim the label to the space that is left instead of dropping it
    const avail = W - 24 - cx2;
    if (avail < 70) return;
    const label = fit(item.label, 15, avail - 28 - (item.icon ? 26 : 0), 500, scale, th.mono);
    const [g, w] = chip(i, p, cx2, 236, label, { icon: item.icon, delay: 0.6 + n * 0.1, style: "tonal", th, dark, scale, mono: th.mono });
    if (cx2 + w > W - 24) return;
    b.push(g);
    cx2 += w + 8;
  });
  return svg(W, h, b.join(""), `${c.hero.greeting} ${name}`, c.motion, { extra, th, dark, p, backdrop: true });
}

function typing(lines: string[], x: number, p: Palette, scale = 1, mono = false): [string, string] {
  const t0 = 0.7;
  const step = 0.05;
  const chars = lines.map((l) => [...l]);
  const n = chars.reduce((a, l) => a + l.length, 0);
  const dur = t0 + n * step;
  const starts = chars.map((_, li) => chars.slice(0, li).reduce((a, l) => a + l.length, 0));
  const revealed = (li: number, k: number) => {
    const m = Math.max(0, Math.min(chars[li].length, k - starts[li]));
    return m ? textWidth(chars[li].slice(0, m).join(""), 19, 400, scale, mono) + 2 : 0;
  };
  const ks = Array.from({ length: n + 1 }, (_, k) => k);
  const times = ["0", ...ks.map((k) => ((t0 + k * step) / dur).toFixed(4))].join(";");
  const smil = (attr: string, values: string[]) =>
    `<animate attributeName="${attr}" values="${values.join(";")}" keyTimes="${times}" calcMode="discrete" dur="${dur.toFixed(2)}s" fill="freeze"/>`;
  const out: string[] = [];
  lines.forEach((line, li) => {
    const y = 194 + li * 26;
    const full = textWidth(line, 19, 400, scale, mono) + 4;
    const widths = ["0", ...ks.map((k) => revealed(li, k).toFixed(1))];
    out.push(`<clipPath id="tc${li}"><rect x="${x - 2}" y="${y - 22}" width="${full}" height="30">${smil("width", widths)}</rect></clipPath>`);
    out.push(`<g clip-path="url(#tc${li})">${txt(x, y, line, 19, p.onSurfaceVariant)}</g>`);
  });
  const last = lines.length - 1;
  const pos = (k: number) => {
    let li = chars.findIndex((_, i) => k <= starts[i] + chars[i].length);
    if (li < 0) li = last;
    return [x + revealed(li, k), 194 + li * 26];
  };
  const [fx, fy] = pos(n);
  const moves = [pos(0), ...ks.map(pos)].map(([cx, cy]) => `${(cx - fx).toFixed(1)} ${cy - fy}`);
  out.push(
    `<rect x="${fx.toFixed(1)}" y="${fy - 17}" width="2.5" height="22" rx="1.25" fill="${p.primary}">` +
      `<animateTransform attributeName="transform" type="translate" values="${moves.join(";")}" keyTimes="${times}" calcMode="discrete" dur="${dur.toFixed(2)}s" fill="freeze"/>` +
      `<animate attributeName="opacity" values="1;0" calcMode="discrete" dur="1s" begin="${dur.toFixed(2)}s" repeatCount="indefinite"/>` +
      `</rect>`,
  );
  return [out.join(""), ""];
}

// About
export function about(ctx: Ctx) {
  const { c, p, i, th, dark } = ctx;
  const row = 54;
  const h = 92 + row * c.about.items.length;
  const b = [surface(th.row(p, dark), 0, 0, W, h)];
  b.push(sectionTitle(28, 26, c.about.title, "favorite", ctx));
  c.about.items.forEach((item, n) => {
    const y = 86 + n * row;
    const mid = y + (row - 8) / 2;
    b.push(`<g class="up" style="animation-delay:${(0.15 + n * 0.1).toFixed(2)}s">`);
    b.push(surface(th.inner(p, dark), 28, y, W - 56, row - 8));
    if (th.badge === "circle") b.push(`<circle cx="54" cy="${mid}" r="15" fill="${p.secondaryContainer}"/>`);
    else b.push(`<path d="${framePath("square", 54, mid, 15, th.radius.cell)}" fill="${p.secondaryContainer}"/>`);
    b.push(icon(i, item.icon, 45, mid - 9, 18, p.onSecondaryContainer));
    b.push(txt(82, mid + 6, fit(item.label, 17, W - 130, 500, ms(th, 500), th.mono), 17, p.onSurface, { weight: 500 }));
    b.push("</g>");
  });
  return svg(W, h, b.join(""), c.about.title, c.motion, { th, dark, p, backdrop: true });
}

// Stack
export function stack(ctx: Ctx) {
  const { c, p, i, th, dark } = ctx;
  let y = 86;
  let d = 0.1;
  const groups: string[] = [];
  for (const group of c.stack.groups) {
    if (group.title) {
      const gt = group.title.toUpperCase();
      const label = fit(gt, 12, W - 56 - gt.length * 1.4, 600, ms(th, 600), th.mono);
      groups.push(txt(28, y + 14, label, 12, p.onSurfaceVariant, { weight: 600, cls: "fade", delay: d, extra: ' letter-spacing="1.4"' }));
    }
    let x = 28;
    let cy = group.title ? y + 26 : y;
    for (const item of group.items) {
      const [, w] = chip(i, p, 0, 0, item.label, { icon: item.icon, th, dark, scale: th.textScale ?? 1, mono: th.mono });
      if (x + w > W - 28) {
        x = 28;
        cy += 44;
      }
      const label = fit(item.label, 15, W - 28 - x - 54, 500, th.textScale ?? 1, th.mono);
      groups.push(chip(i, p, x, cy, label, { icon: item.icon, delay: d, th, dark, scale: th.textScale ?? 1, mono: th.mono })[0]);
      x += w + 8;
      d += 0.05;
    }
    y = cy + 36 + 22;
  }
  const h = y + 6;
  const b = [surface(th.row(p, dark), 0, 0, W, h)];
  b.push(sectionTitle(28, 26, c.stack.title, "code", ctx));
  b.push(...groups);
  return svg(W, h, b.join(""), c.stack.title, c.motion, { th, dark, p, backdrop: true });
}

// Projects
function pickIcon(repo: Repo) {
  const hay = ` ${repo.name} ${repo.text} ${repo.topics.join(" ")} `.toLowerCase().replace(/-/g, " ");
  for (const [keys, name] of ICON_RULES) if (keys.some((k) => hay.includes(k))) return name;
  return (repo.language && LANG_ICONS[repo.language]) || "code";
}

function repoTags(repo: Repo) {
  const tags = repo.language ? [repo.language] : [];
  const hay = `${repo.text} ${repo.topics.join(" ")}`.toLowerCase();
  if (hay.includes("winui") && !tags.includes("WinUI 3")) tags.push("WinUI 3");
  return tags;
}

export function projectList(c: Config, d: Data) {
  if (c.projects.source === "manual") {
    return c.projects.repos.map((n) => d.all.find((r) => r.name === n)).filter((r): r is Repo => !!r);
  }
  return d.pins;
}

export function projectView(c: Config, repo: Repo, index: number) {
  const o = c.projects.overrides[repo.name] ?? {};
  return {
    title: repo.name,
    text: o.text || repo.text || c.projects.empty,
    icon: o.icon || pickIcon(repo),
    shape: o.shape || CARD_SHAPES[index % CARD_SHAPES.length],
    tags: repoTags(repo),
  };
}

export function card(ctx: Ctx, repo: Repo, index: number) {
  const { c, p, i, th, dark } = ctx;
  const w = 412;
  const h = 232;
  // cardPad is a transparent margin reserved for a hard offset shadow; the card keeps
  // its 412x232 content grid so every theme lines up in the two-column README table.
  const pad = th.cardPad ?? 0;
  const cw = w - pad;
  const ch = h - pad;
  const d0 = 0.08 * index;
  const v = projectView(c, repo, index);
  const b: string[] = [];
  b.push(surface(th.project(p, dark), 0, 0, cw, ch));
  b.push(pop(`<path class="spin" d="${framePath(th.iconShape ?? v.shape, 52, 52, 30, th.radius.tile)}" fill="${p.primaryContainer}"/>`, d0));
  b.push(pop(icon(i, v.icon, 39, 39, 26, p.onPrimaryContainer), d0 + 0.08));
  if (th.badge === "circle") b.push(`<circle cx="${cw - 40}" cy="40" r="18" fill="${p.surfaceContainerHighest}"/>`);
  else b.push(`<path d="${framePath("square", cw - 40, 40, 18, th.radius.cell)}" fill="${p.surfaceContainerHighest}"/>`);
  b.push(icon(i, "arrow_outward", cw - 50, 30, 20, p.onSurfaceVariant));
  const tx = 24;
  const forkW = repo.fork ? textWidth(c.projects.fork, 12, 600, ms(th, 600), th.mono) + 28 : 0;
  const title = fit(v.title, 23, cw - 48 - forkW, 650, ms(th, 650), th.mono);
  b.push(txt(tx, 116, title, 23, p.onSurface, { weight: 650, cls: "up", delay: d0 + 0.1 }));
  if (repo.fork) {
    const fw = textWidth(c.projects.fork, 12, 600, ms(th, 600), th.mono) + 18;
    const fx = Math.min(cw - 24 - fw, tx + textWidth(title, 23, 650, ms(th, 650), th.mono) + 10);
    const fs = th.chip(p, dark, "tertiary");
    b.push(pop(
      surface({ fill: fs.fill, rx: fs.rx, stroke: fs.stroke, strokeWidth: fs.strokeWidth, filter: fs.filter, shadow: fs.shadow }, fx, 98, fw, 22) +
        txt(fx + fw / 2, 113, c.projects.fork, 12, fs.fg, { weight: 600, anchor: "middle" }),
      d0 + 0.25,
    ));
  }
  wrap(v.text, 15, cw - 48, 400, 2, ms(th, 400), th.mono).forEach((line, n) => {
    b.push(txt(tx, 142 + n * 21, line, 15, p.onSurfaceVariant, { cls: "up", delay: d0 + 0.18 + n * 0.05 }));
  });
  // the footer is anchored to the bottom of the card body so it cannot spill out
  const tagY = ch - 48;
  let x = tx;
  v.tags.forEach((tag, n) => {
    const [g, chipW] = chip(i, p, x, tagY, tag, { delay: d0 + 0.3 + n * 0.06, h: 28, size: 13, style: "tonal", th, dark, scale: ms(th, 500), mono: th.mono });
    b.push(g);
    x += chipW + 6;
  });
  const label = String(repo.stars);
  const sw = textWidth(label, 14, 600, ms(th, 600), th.mono);
  b.push(pop(
    icon(i, "star", cw - 24 - sw - 26, ch - 44, 19, p.primary) + txt(cw - 24, ch - 29, label, 14, p.onSurfaceVariant, { weight: 600, anchor: "end" }),
    d0 + 0.4,
  ));
  return svg(w, h, b.join(""), v.title, c.motion, { th, dark, p, backdrop: pad === 0 });
}

// Stats
export function stats(ctx: Ctx) {
  const { c, d, p, i, th, dark } = ctx;
  const s = c.stats;
  const langs = s.showLanguages ? d.languages : [];
  const total = langs.reduce((a, [, v]) => a + v, 0) || 1;
  const legend: [number, number, string][] = [];
  let x = 28;
  let row = 0;
  for (const [name, v] of langs) {
    const label = `${name} ${((100 * v) / total).toFixed(1)}%`.replace(".0%", "%");
    const lw = 15 + textWidth(label, 14, 500, ms(th, 500), th.mono) + 18;
    if (x + lw > W - 28) {
      x = 28;
      row++;
    }
    legend.push([x, row, label]);
    x += lw;
  }
  const h = s.showLanguages && langs.length ? 400 + row * 26 : 310;
  const b = [surface(th.row(p, dark), 0, 0, W, h)];
  b.push(sectionTitle(28, 26, s.title, "monitoring", ctx));
  const tiles: [string, number, string, ShapeName][] = [
    ["star", d.stars, s.stars, "cookie"],
    ["commit", d.contributions, s.contributions, "clover"],
    ["book_2", d.repos, s.repos, "sunny"],
    ["group", d.followers, s.followers, "flower"],
  ];
  tiles.forEach(([ic, value, label, sh], n) => {
    const tx = 28 + (n % 2) * 196;
    const ty = 86 + Math.floor(n / 2) * 106;
    b.push(`<g class="up" style="animation-delay:${(0.1 + n * 0.08).toFixed(2)}s">`);
    b.push(surface(th.tile(p, dark), tx, ty, 184, 96));
    b.push(`<path d="${framePath(th.iconShape ?? sh, tx + 34, ty + 34, 18, th.radius.cell)}" fill="${p.primaryContainer}"/>`);
    b.push(icon(i, ic, tx + 24, ty + 24, 20, p.onPrimaryContainer));
    const valueText = String(value);
    const vw = textWidth(valueText, 30, 700, ms(th, 700), th.mono);
    const vs = vw > 116 ? Math.max(16, (30 * 116) / vw) : 30;
    b.push(txt(tx + 62, ty + 46, valueText, vs, p.onSurface, { weight: 700 }));
    const lw = textWidth(label, 14, 500, ms(th, 500), th.mono);
    const ls = lw > 156 ? Math.max(9, +((14 * 156) / lw).toFixed(2)) : 14;
    b.push(txt(tx + 20, ty + 78, label, ls, p.onSurfaceVariant, { weight: 500 }));
    b.push("</g>");
  });
  const rx = 432;
  b.push(txt(rx, 100, fit(s.calendar, 14, W - rx - 28, 600, ms(th, 600), th.mono), 14, p.onSurfaceVariant, { weight: 600, cls: "fade", delay: 0.1 }));
  const gap = 6;
  const cw = (W - 28 - rx - gap * 6) / 7;
  const ch = 46;
  const cellRx = th.radius.cell;
  [...(s.weekdays + "       ").slice(0, 7)].forEach((letter, n) => {
    b.push(txt(rx + n * (cw + gap) + cw / 2, 124, letter, 12, p.onSurfaceVariant, { weight: 600, cls: "fade", delay: 0.15, anchor: "middle" }));
  });
  const base = p.surfaceContainerHighest;
  const levels = [base, mix(base, p.primary, 0.4), mix(base, p.primary, 0.65), mix(base, p.primary, 0.85), p.primary];
  const peak = Math.max(1, ...d.days.flat().map((x) => x?.c ?? 0));
  d.days.forEach((wk, wi) => {
    wk.forEach((day, di) => {
      const x = rx + di * (cw + gap);
      const y = 136 + wi * (ch + 6);
      const delay = 0.2 + (wi * 7 + di) * 0.025;
      if (!day) {
        b.push(`<rect class="pop" style="animation-delay:${delay.toFixed(3)}s" x="${(x + 0.75).toFixed(1)}" y="${y + 0.75}" width="${(cw - 1.5).toFixed(1)}" height="${ch - 1.5}" rx="${cellRx}" fill="none" stroke="${p.outlineVariant}" stroke-width="1.5" stroke-dasharray="4 4"/>`);
        return;
      }
      const lvl = day.c === 0 ? 0 : Math.min(4, 1 + Math.floor((3 * day.c) / peak + 0.5));
      const fg = lvl >= 3 ? p.onPrimary : p.onSurfaceVariant;
      let cell = `<rect x="${x.toFixed(1)}" y="${y}" width="${cw.toFixed(1)}" height="${ch}" rx="${cellRx}" fill="${levels[lvl]}"/>`;
      if (day.today) cell += `<rect x="${(x - 3).toFixed(1)}" y="${y - 3}" width="${(cw + 6).toFixed(1)}" height="${ch + 6}" rx="${cellRx + 3}" fill="none" stroke="${p.primary}" stroke-width="2"/>`;
      cell += txt(x + cw / 2, y + ch / 2 + 5, String(day.day), 14, fg, { weight: 600, anchor: "middle" });
      b.push(`<g class="pop" style="animation-delay:${delay.toFixed(3)}s">${cell}</g>`);
    });
  });
  if (s.showLanguages && langs.length) {
    const ly = 322;
    b.push(txt(28, ly, fit(s.languages, 14, W - 56, 600, ms(th, 600), th.mono), 14, p.onSurfaceVariant, { weight: 600, cls: "fade", delay: 0.3 }));
    const surf = p.surfaceContainerLow;
    const colors = [p.primary, p.tertiary, p.secondary, mix(p.primary, surf, 0.45), mix(p.tertiary, surf, 0.45), mix(p.secondary, surf, 0.45), p.outline, p.outlineVariant];
    const bw = W - 56;
    const gaps = 4 * (langs.length - 1);
    const widths = langs.map(([, v]) => Math.max(8, ((bw - gaps) * v) / total));
    const k = (bw - gaps) / (widths.reduce((a, v) => a + v, 0) || 1);
    let sx = 28;
    const segs = widths.map((sw, n) => {
      const r = `<rect x="${sx.toFixed(1)}" y="${ly + 12}" width="${(sw * k).toFixed(1)}" height="14" rx="${th.radius.bar}" fill="${colors[n % colors.length]}"/>`;
      sx += sw * k + 4;
      return r;
    });
    b.push(`<g class="grow" style="animation-delay:.4s">${segs.join("")}</g>`);
    legend.forEach(([lx, lrow, label], n) => {
      const ly2 = ly + 50 + lrow * 26;
      const dot = th.dot === "circle"
        ? `<circle cx="${lx + 5}" cy="${ly2 - 5}" r="5" fill="${colors[n % colors.length]}"/>`
        : `<rect x="${lx}" y="${ly2 - 10}" width="10" height="10" rx="${Math.min(2, th.radius.cell)}" fill="${colors[n % colors.length]}"/>`;
      b.push(pop(dot + txt(lx + 15, ly2, label, 14, p.onSurfaceVariant, { weight: 500 }), 0.6 + n * 0.06, "fade"));
    });
  }
  return svg(W, h, b.join(""), s.title, c.motion, { th, dark, p, backdrop: true });
}

// Streak
export function streak(ctx: Ctx) {
  const { c, d, p, i, th, dark } = ctx;
  const s = c.streak;
  const h = 214;
  const b = [surface(th.row(p, dark), 0, 0, W, h)];
  b.push(sectionTitle(28, 26, s.title, "local_fire_department", ctx));
  const tw = (W - 56 - 12) / 2;
  const tiles: [number, string, ShapeName, string][] = [
    [d.streak.current, s.current, "sunny", "local_fire_department"],
    [d.streak.longest, s.longest, "flower", "trophy"],
  ];
  tiles.forEach(([value, label, sh, ic], n) => {
    const tx = 28 + n * (tw + 12);
    const ty = 86;
    const tile = th.tile(p, dark);
    b.push(`<g class="up" style="animation-delay:${(0.1 + n * 0.1).toFixed(2)}s">`);
    b.push(surface({ ...tile, fill: n ? p.surfaceContainerHigh : p.primaryContainer, rx: th.radius.streak }, tx, ty, tw, 100));
    b.push(pop(`<path class="${n ? "spin-r" : "spin"}" d="${framePath(th.iconShape ?? sh, tx + 52, ty + 50, 30, th.radius.tile)}" fill="${n ? p.secondaryContainer : p.primary}"/>`, 0.2 + n * 0.1));
    b.push(icon(i, ic, tx + 38, ty + 36, 28, n ? p.onSecondaryContainer : p.onPrimary));
    const num = String(value);
    const fg = n ? p.onSurface : p.onPrimaryContainer;
    const nw = textWidth(num, 40, 700, ms(th, 700), th.mono);
    b.push(txt(tx + 100, ty + 56, num, 40, fg, { weight: 700 }));
    b.push(txt(tx + 100 + nw + 10, ty + 56, s.days, 16, fg, { weight: 600 }));
    b.push(txt(tx + 100, ty + 80, fit(label, 15, tw - 120, 500, ms(th, 500), th.mono), 15, n ? p.onSurfaceVariant : p.onPrimaryContainer, { weight: 500 }));
    b.push("</g>");
  });
  return svg(W, h, b.join(""), s.title, c.motion, { th, dark, p, backdrop: true });
}

// Socials
function luminance(hex: string) {
  const [r, g, b] = [0, 2, 4].map((k) => parseInt(hex.slice(k, k + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function socialLabel(icons: Icons, item: Social) {
  if (item.icon.startsWith("brand:")) {
    const b = icons.brand[item.icon.slice(6)];
    if (b) return b.t;
  }
  try {
    return new URL(item.url).hostname.replace(/^www\./, "");
  } catch {
    return item.url;
  }
}

function socialColors(p: Palette, icons: Icons, item: Social, fill: Config["socials"]["fill"], th: Theme, dark: boolean) {
  if (fill === "brand") {
    const hex = item.icon.startsWith("brand:") ? icons.brand[item.icon.slice(6)]?.c : undefined;
    if (hex) return { bg: `#${hex}`, fg: luminance(hex) > 0.45 ? "#1b1b1f" : "#ffffff", stroke: "" };
    return { bg: p.primary, fg: p.onPrimary, stroke: "" };
  }
  if (fill === "outlined" && th.embedFont) return { bg: "none", fg: p.onSurfaceVariant, stroke: p.outline };
  // Tonal links follow the theme chip so they sit on the same surface as tags and
  // stack chips instead of flashing a plain white plate over the card.
  const spec = th.chip(p, dark, fill === "filled" ? "filled" : fill === "outlined" ? "outlined" : "tonal");
  return { bg: spec.fill, fg: spec.fg, stroke: spec.stroke ?? "" };
}

interface Piece {
  body: string;
  w: number;
  h: number;
  title: string;
}

function socialPiece({ c, p, i, th, dark }: Ctx, item: Social, n: number): Piece {
  const st = c.socials;
  const col = socialColors(p, i, item, st.fill, th, dark);
  const stroke = col.stroke ? ` stroke="${col.stroke}" stroke-width="${th.line.hairline}"` : "";
  const delay = n * 0.06;
  if (st.variant === "chip") {
    const label = socialLabel(i, item);
    const h = 48;
    const w = 18 + 24 + 10 + textWidth(label, 16, 600, ms(th, 600), th.mono) + 20;
    const rx = th.embedFont ? (st.shape === "soft" ? 16 : 24) : th.radius.social;
    const frame = col.bg === "none"
      ? `<rect x="1" y="1" width="${(w - 2).toFixed(1)}" height="${h - 2}" rx="${rx}" fill="none"${col.stroke ? ` stroke="${col.stroke}" stroke-width="${th.line.hairline}"` : ""}/>`
      : surface({ fill: col.bg, rx, stroke: col.stroke || undefined, strokeWidth: th.line.hairline }, 1, 1, w - 2, h - 2);
    const body = pop(
      frame +
        icon(i, item.icon, 18, 12, 24, col.fg) +
        txt(52, 30, label, 16, col.fg, { weight: 600 }),
      delay,
    );
    return { body, w, h, title: label };
  }
  const kind = th.socialShape ?? st.shape ?? (n % 2 ? "cookie" : "cookie12");
  const body =
    `<path class="pop" style="animation-delay:${delay.toFixed(2)}s" d="${framePath(kind, 28, 28, 25.5, th.radius.social)}" fill="${col.bg}"${stroke}/>` +
    pop(icon(i, item.icon, 15, 15, 26, col.fg), delay + 0.05);
  return { body, w: 56, h: 56, title: item.url };
}

function buttonPiece({ p, i, th, dark }: Ctx, btn: LinkButton, n: number): Piece {
  const h = 56;
  const size = 17;
  const iw = btn.icon ? 32 : 0;
  const w = 56 + iw + textWidth(btn.label, size, 600, ms(th, 600), th.mono);
  const spec = th.chip(p, dark, btn.style === "filled" ? "filled" : "tonal");
  let body = surface({ fill: spec.fill, rx: th.radius.button, stroke: spec.stroke, strokeWidth: spec.strokeWidth, filter: spec.filter, shadow: spec.shadow }, 0, 0, w, h);
  if (btn.icon) body += icon(i, btn.icon, 28, (h - 22) / 2, 22, spec.fg);
  body += txt(28 + iw, h / 2 + 6, btn.label, size, spec.fg, { weight: 600 });
  return { body: pop(body, n * 0.08), w, h, title: btn.label };
}

// Rows
const PAD = 20;
const GAP = 8;
const CAP = 28;
/** Transparent margin around loose pieces so their shadows/filters are not cut off. */
const OUT = 12;

export function rowFits(pieces: { w: number }[]) {
  return pieces.length > 0 && pieces.reduce((a, x) => a + x.w + GAP, 0) + CAP * 2 <= W;
}

function row(ctx: Ctx, prefix: string, pieces: Piece[], card: boolean) {
  const { c, p, th, dark } = ctx;
  const files: Record<string, string> = {};
  const opts = { th, dark, p };
  if (!card || !rowFits(pieces)) {
    pieces.forEach((x, n) => {
      files[`${prefix}-${n + 1}`] = svg(
        x.w + OUT * 2,
        x.h + OUT * 2,
        `<g transform="translate(${OUT} ${OUT})">${x.body}</g>`,
        x.title,
        c.motion,
        opts,
      );
    });
    return files;
  }
  const h = Math.max(...pieces.map((x) => x.h)) + PAD * 2;
  const cap = (W - pieces.reduce((a, x) => a + x.w + GAP, 0)) / 2;
  const spec = th.row(p, dark);
  // Every piece paints the same full-width row surface at its own offset, so the
  // outline, fill, radius and shadow stay continuous across the separate images.
  // The theme backdrop is sliced the same way; otherwise a glass row would lose its
  // tint wherever a piece starts, and the retro dot phase would jump per image.
  const bd = th.backdrop ? th.backdrop(p, dark, W, h) : "";
  files[`${prefix}-l`] = svg(cap, h, bd + surface(spec, 0, 0, W, h), "", c.motion, opts);
  files[`${prefix}-r`] =
    svg(cap, h, `<g transform="translate(${-(W - cap)} 0)">${bd}</g>` + surface(spec, cap - W, 0, W, h), "", c.motion, opts);
  let x0 = cap;
  pieces.forEach((x, n) => {
    const w = x.w + GAP;
    const body =
      `<g transform="translate(${-x0} 0)">${bd}</g>` +
      surface(spec, -x0, 0, W, h) +
      `<g transform="translate(${GAP / 2} ${(h - x.h) / 2})">${x.body}</g>`;
    files[`${prefix}-${n + 1}`] = svg(w, h, body, x.title, c.motion, opts);
    x0 += w;
  });
  return files;
}

export function socials(ctx: Ctx) {
  const c = ctx.c;
  return row(ctx, "social", c.socials.items.map((s, n) => socialPiece(ctx, s, n)), !!c.socials.card);
}

export function buttons(ctx: Ctx) {
  const c = ctx.c;
  return row(ctx, "button", c.buttons.items.map((b, n) => buttonPiece(ctx, b, n)), !!c.buttons.card);
}

export function wave({ c, p, th, dark }: Ctx) {
  const h = 28;
  const amp = 5;
  const length = 48;
  const pts: string[] = [];
  for (let x = 0; x <= W + length * 2; x += 4) pts.push(`${x} ${(h / 2 + amp * Math.sin((2 * Math.PI * x) / length)).toFixed(1)}`);
  const body =
    `<clipPath id="w"><rect x="0" y="0" width="${W}" height="${h}"/></clipPath><g clip-path="url(#w)">` +
    `<path class="wave" d="M${pts.join(" L")}" fill="none" stroke="${p.primary}" stroke-width="5" stroke-linecap="round"/></g>`;
  return svg(W, h, body, "divider", c.motion, { th, dark, p });
}

export function credit({ p, th, dark }: Ctx) {
  const label = "Made with persona-gh";
  const size = 12;
  const w = textWidth(label, size, 500, ms(th, 500), th.mono) + 4;
  return svg(w, 18, txt(2, 13, label, size, p.onSurfaceVariant, { weight: 500, extra: ' opacity=".7"' }), label, false, { th, dark, p });
}
