import { accent, makePalette } from "./common";
import type { Theme } from "./types";

export const retropixel: Theme = {
  id: "retropixel",
  fontFamily: "'Courier New',ui-monospace,monospace",
  embedFont: false,
  mono: true,
  heading: { weight: 700, spacing: 1, uppercase: true },
  radius: {
    card: 0, project: 0, inner: 0, tile: 0, streak: 0, cell: 0,
    chip: 0, social: 0, button: 0, row: 0, bar: 0, icon: 0, avatar: 0,
  },
  line: { hairline: 2, strong: 3, cell: 2 },
  badge: "square",
  dot: "square",
  iconShape: "square",
  avatarShape: "square",
  socialShape: "square",
  avatar: (p) => ({
    halo: { fill: p.primary },
    frame: { fill: p.primaryContainer, stroke: p.onSurface, strokeWidth: 3 },
    inner: p.primaryContainer,
    icon: p.onSurface,
    spin: false,
  }),
  palette: (seed, _scheme, dark) => {
    const a = accent(seed, dark);
    return makePalette({
      surface: dark ? "#17151F" : "#F7F3E8",
      surfaceContainerLow: dark ? "#211D2B" : "#EFE8D6",
      surfaceContainer: dark ? "#262230" : "#F2ECDC",
      surfaceContainerHigh: dark ? "#2D2838" : "#E9E0CB",
      surfaceContainerHighest: dark ? "#352F42" : "#DED3BB",
      onSurface: dark ? "#F4EBDD" : "#241F1A",
      onSurfaceVariant: dark ? "#C7B9A5" : "#5A5147",
      outline: dark ? "#8C7F6B" : "#3A3128",
      outlineVariant: dark ? "#4A4152" : "#D7CBB8",
      ...a,
    });
  },
  card: (p) => ({
    fill: p.surfaceContainerLow,
    rx: 0,
    stroke: p.onSurface,
    strokeWidth: 3,
    shadow: { dx: 6, dy: 6, color: p.onSurface },
    innerBorders: [{ inset: 5, stroke: p.onSurface, width: 1 }],
  }),
  project: (p) => ({
    fill: p.surfaceContainer,
    rx: 0,
    stroke: p.onSurface,
    strokeWidth: 2,
    shadow: { dx: 4, dy: 4, color: p.onSurface },
    innerBorders: [{ inset: 4, stroke: p.onSurface, width: 1 }],
  }),
  inner: (p) => ({ fill: p.surfaceContainerHigh, rx: 0, stroke: p.onSurface, strokeWidth: 2 }),
  tile: (p) => ({
    fill: p.surfaceContainerHighest,
    rx: 0,
    stroke: p.onSurface,
    strokeWidth: 2,
    shadow: { dx: 3, dy: 3, color: p.onSurface },
  }),
  subtle: (p) => ({ fill: p.surfaceContainerHighest, rx: 0, stroke: p.onSurface, strokeWidth: 2 }),
  row: (p) => ({
    fill: p.surfaceContainerLow,
    rx: 0,
    stroke: p.onSurface,
    strokeWidth: 3,
    shadow: { dx: 6, dy: 6, color: p.onSurface },
  }),
  rowFill: (p) => p.surfaceContainerLow,
  chip: (p, _dark, variant) => {
    if (variant === "filled") return { fill: p.primary, fg: p.onPrimary, rx: 0, stroke: p.onSurface, strokeWidth: 2, shadow: { dx: 2, dy: 2, color: p.onSurface } };
    if (variant === "outlined") return { fill: p.surface, fg: p.onSurface, rx: 0, stroke: p.onSurface, strokeWidth: 2 };
    if (variant === "tertiary") return { fill: p.tertiaryContainer, fg: p.onTertiaryContainer, rx: 0, stroke: p.onSurface, strokeWidth: 2, shadow: { dx: 2, dy: 2, color: p.onSurface } };
    return { fill: p.surfaceContainerHigh, fg: p.onSurface, rx: 0, stroke: p.onSurface, strokeWidth: 2, shadow: { dx: 2, dy: 2, color: p.onSurface } };
  },
  defs: (p, _dark) =>
    `<pattern id="pxDots" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="${p.outlineVariant}"/></pattern>`,
  hero: (p) =>
    `<g opacity=".95">` +
    `<rect x="700" y="32" width="24" height="24" fill="${p.primaryContainer}"/>` +
    `<rect x="728" y="56" width="16" height="16" fill="${p.secondaryContainer}"/>` +
    `<rect x="748" y="32" width="12" height="12" fill="${p.tertiaryContainer}"/>` +
    `<rect x="764" y="48" width="20" height="20" fill="${p.primaryContainer}"/>` +
    `<rect x="700" y="68" width="12" height="12" fill="${p.secondaryContainer}"/>` +
    `<rect x="720" y="84" width="28" height="12" fill="${p.tertiaryContainer}"/>` +
    `<rect x="700" y="224" width="18" height="18" fill="${p.secondaryContainer}"/>` +
    `<rect x="722" y="244" width="10" height="10" fill="${p.primaryContainer}"/>` +
    `</g>`,
  backdrop: (_p, _dark, w, h) => `<rect x="0" y="0" width="${w}" height="${h}" fill="url(#pxDots)" opacity=".16"/>`,
};
