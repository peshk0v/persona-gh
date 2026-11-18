import { alpha, mix, shade, tint } from "./color";
import { makePalette } from "./common";
import type { Theme } from "./types";

export const glassmorphism: Theme = {
  id: "glassmorphism",
  fontFamily: "'Inter','SF Pro Display','Segoe UI',sans-serif",
  embedFont: false,
  heading: { weight: 600, spacing: 0 },
  radius: {
    card: 28, project: 24, inner: 20, tile: 20, streak: 22, cell: 12,
    chip: 16, social: 24, button: 24, row: 28, bar: 8, icon: 16, avatar: 30,
  },
  line: { hairline: 1.5, strong: 2, cell: 1.5 },
  badge: "circle",
  dot: "circle",
  iconShape: "square",
  avatarShape: "square",
  socialShape: "square",
  cardPad: 0,
  avatar: (p, dark) => ({
    halo: { fill: alpha("#FFFFFF", dark ? 0.05 : 0.16) },
    frame: { fill: alpha("#FFFFFF", dark ? 0.12 : 0.42), stroke: alpha("#FFFFFF", dark ? 0.28 : 0.64), strokeWidth: 1.5 },
    inner: alpha("#FFFFFF", dark ? 0.16 : 0.5),
    icon: p.onSurface,
    spin: false,
  }),
  palette: (seed, _scheme, dark) => {
    const primary = dark ? tint(seed, 0.22) : shade(seed, 0.04);
    const secondary = mix(primary, dark ? "#C4B5FD" : "#38BDF8", 0.42);
    const tertiary = mix(primary, dark ? "#FDA4AF" : "#F472B6", 0.38);
    return makePalette({
      surface: dark ? "#0B1020" : "#EEF3FF",
      surfaceContainerLow: alpha("#FFFFFF", dark ? 0.05 : 0.38),
      surfaceContainer: alpha("#FFFFFF", dark ? 0.07 : 0.46),
      surfaceContainerHigh: alpha("#FFFFFF", dark ? 0.1 : 0.58),
      surfaceContainerHighest: alpha("#FFFFFF", dark ? 0.14 : 0.72),
      onSurface: dark ? "#F8FAFC" : "#101828",
      onSurfaceVariant: dark ? "#CBD5E1" : "#475467",
      outline: dark ? alpha("#FFFFFF", 0.18) : alpha("#1E293B", 0.18),
      outlineVariant: dark ? alpha("#FFFFFF", 0.12) : alpha("#1E293B", 0.12),
      primary,
      primaryContainer: alpha(mix(primary, dark ? "#0F172A" : "#FFFFFF", 0.28), dark ? 0.42 : 0.24),
      onPrimaryContainer: dark ? "#F8FAFC" : "#0F172A",
      secondary,
      secondaryContainer: alpha(mix(secondary, dark ? "#0F172A" : "#FFFFFF", 0.3), dark ? 0.36 : 0.2),
      onSecondaryContainer: dark ? "#F8FAFC" : "#0F172A",
      tertiary,
      tertiaryContainer: alpha(mix(tertiary, dark ? "#0F172A" : "#FFFFFF", 0.3), dark ? 0.36 : 0.2),
      onTertiaryContainer: dark ? "#F8FAFC" : "#0F172A",
    });
  },
  card: (_p, dark) => ({
    fill: "url(#glassCard)",
    rx: 28,
    stroke: alpha("#FFFFFF", dark ? 0.2 : 0.55),
    strokeWidth: 1.5,
  }),
  project: (_p, dark) => ({
    fill: "url(#glassCard)",
    rx: 24,
    stroke: alpha("#FFFFFF", dark ? 0.2 : 0.55),
    strokeWidth: 1.5,
  }),
  inner: (_p, dark) => ({
    fill: alpha("#FFFFFF", dark ? 0.07 : 0.32),
    rx: 20,
    stroke: alpha("#FFFFFF", dark ? 0.12 : 0.42),
    strokeWidth: 1,
  }),
  tile: (_p, dark) => ({
    fill: alpha("#FFFFFF", dark ? 0.09 : 0.38),
    rx: 20,
    stroke: alpha("#FFFFFF", dark ? 0.14 : 0.46),
    strokeWidth: 1,
  }),
  subtle: (_p, dark) => ({ fill: alpha("#FFFFFF", dark ? 0.12 : 0.5), rx: 16 }),
  row: (_p, dark) => ({
    fill: alpha("#FFFFFF", dark ? 0.05 : 0.3),
    rx: 28,
    stroke: alpha("#FFFFFF", dark ? 0.14 : 0.46),
    strokeWidth: 1.5,
  }),
  rowFill: (_p, dark) => alpha("#FFFFFF", dark ? 0.05 : 0.3),
  chip: (p, dark, variant) => {
    const frost = dark ? alpha(mix(p.primary, "#0F172A", 0.55), 0.55) : alpha(mix(p.primary, "#FFFFFF", 0.68), 0.92);
    const frostFg = dark ? "#F8FAFC" : mix(p.primary, "#0F172A", 0.74);
    if (variant === "filled") return { fill: p.primary, fg: p.onPrimary, rx: 16 };
    if (variant === "outlined") return { fill: "none", fg: p.onSurface, rx: 16, stroke: dark ? alpha("#FFFFFF", 0.32) : alpha("#0F172A", 0.26), strokeWidth: 1 };
    if (variant === "tertiary") return { fill: p.tertiaryContainer, fg: p.onTertiaryContainer, rx: 16, stroke: alpha("#FFFFFF", dark ? 0.16 : 0.5), strokeWidth: 1 };
    return { fill: frost, fg: frostFg, rx: 16, stroke: alpha("#FFFFFF", dark ? 0.2 : 0.62), strokeWidth: 1 };
  },
  defs: (p, dark) =>
    `<filter id="glassBlur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="18"/></filter>` +
    `<linearGradient id="glassWash" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${mix(p.primary, dark ? "#0B1020" : "#FFFFFF", dark ? 0.52 : 0.72)}"/>` +
    `<stop offset=".52" stop-color="${mix(p.secondary, dark ? "#0B1020" : "#FFFFFF", dark ? 0.6 : 0.82)}"/>` +
    `<stop offset="1" stop-color="${mix(p.tertiary, dark ? "#0B1020" : "#FFFFFF", dark ? 0.56 : 0.79)}"/>` +
    `</linearGradient>` +
    `<linearGradient id="glassCard" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${dark ? "#FFFFFF" : "#F2F7FF"}" stop-opacity="${dark ? 0.16 : 0.74}"/>` +
    `<stop offset=".55" stop-color="${dark ? "#FFFFFF" : "#E8F0FF"}" stop-opacity="${dark ? 0.08 : 0.5}"/>` +
    `<stop offset="1" stop-color="${dark ? "#FFFFFF" : "#DDE8FF"}" stop-opacity="${dark ? 0.03 : 0.32}"/>` +
    `</linearGradient>` +
    `<radialGradient id="glassGlow" cx=".16" cy=".05" r=".95">` +
    `<stop offset="0" stop-color="${p.primary}" stop-opacity="${dark ? 0.42 : 0.3}"/>` +
    `<stop offset="1" stop-color="${p.primary}" stop-opacity="0"/>` +
    `</radialGradient>` +
    `<radialGradient id="glassGlowB" cx=".86" cy=".95" r=".9">` +
    `<stop offset="0" stop-color="${p.secondary}" stop-opacity="${dark ? 0.34 : 0.24}"/>` +
    `<stop offset="1" stop-color="${p.secondary}" stop-opacity="0"/>` +
    `</radialGradient>`,
  hero: () =>
    `<circle cx="770" cy="38" r="142" fill="url(#glassGlow)" filter="url(#glassBlur)"/>` +
    `<circle cx="812" cy="254" r="86" fill="url(#glassGlowB)" filter="url(#glassBlur)"/>`,
  backdrop: (_p, _dark, w, h) =>
    `<rect x="0" y="0" width="${w}" height="${h}" rx="28" fill="url(#glassWash)"/>` +
    `<rect x="0" y="0" width="${w}" height="${h}" rx="28" fill="url(#glassGlow)" opacity=".7"/>` +
    `<rect x="0" y="0" width="${w}" height="${h}" rx="28" fill="url(#glassGlowB)" opacity=".45"/>`,
};
