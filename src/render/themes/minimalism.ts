import { accent, makePalette } from "./common";
import type { Theme } from "./types";

export const minimalism: Theme = {
  id: "minimalism",
  fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif",
  embedFont: false,
  textScale: 1.03,
  boldScale: 1.05,
  heading: { weight: 700, spacing: 0 },
  radius: {
    card: 6, project: 6, inner: 5, tile: 5, streak: 6, cell: 4,
    chip: 4, social: 5, button: 5, row: 6, bar: 3, icon: 5, avatar: 5,
  },
  line: { hairline: 1, strong: 1, cell: 1 },
  badge: "square",
  dot: "square",
  iconShape: "square",
  avatarShape: "square",
  socialShape: "square",
  avatar: (p) => ({ frame: { fill: p.surface, stroke: p.onSurface, strokeWidth: 1.5 }, inner: p.surfaceContainerLow, icon: p.onSurface }),
  palette: (seed, _scheme, dark) => {
    const a = accent(seed, dark);
    return makePalette({
      surface: dark ? "#0B0C0E" : "#FFFFFF",
      surfaceContainerLow: dark ? "#121316" : "#FBFBFB",
      surfaceContainer: dark ? "#17191C" : "#F5F5F5",
      surfaceContainerHigh: dark ? "#1E2024" : "#EFEFEF",
      surfaceContainerHighest: dark ? "#26282D" : "#E8E8E8",
      onSurface: dark ? "#F5F5F5" : "#111111",
      onSurfaceVariant: dark ? "#A3A3A3" : "#666666",
      outline: dark ? "#3A3D42" : "#D4D4D4",
      outlineVariant: dark ? "#2A2C30" : "#E8E8E8",
      ...a,
      error: "#B3261E",
    });
  },
  card: (p) => ({ fill: p.surface, rx: 6, stroke: p.outline, strokeWidth: 1 }),
  project: (p) => ({ fill: p.surface, rx: 6, stroke: p.outline, strokeWidth: 1 }),
  inner: (p) => ({ fill: p.surfaceContainerLow, rx: 5, stroke: p.outlineVariant, strokeWidth: 1 }),
  tile: (p) => ({ fill: p.surfaceContainerLow, rx: 5, stroke: p.outlineVariant, strokeWidth: 1 }),
  subtle: (p) => ({ fill: p.surfaceContainer, rx: 4, stroke: p.outlineVariant, strokeWidth: 1 }),
  row: (p) => ({ fill: p.surface, rx: 6, stroke: p.outline, strokeWidth: 1 }),
  rowFill: (p) => p.surface,
  chip: (p, _dark, variant) => {
    if (variant === "filled") return { fill: p.primary, fg: p.onPrimary, rx: 4 };
    if (variant === "outlined") return { fill: p.surface, fg: p.onSurface, rx: 4, stroke: p.outline, strokeWidth: 1 };
    if (variant === "tertiary") return { fill: p.tertiaryContainer, fg: p.onTertiaryContainer, rx: 4, stroke: p.outlineVariant, strokeWidth: 1 };
    return { fill: p.surfaceContainer, fg: p.onSurface, rx: 4, stroke: p.outlineVariant, strokeWidth: 1 };
  },
  hero: (p) =>
    `<rect x="700" y="38" width="104" height="2" fill="${p.primary}"/>` +
    `<rect x="800" y="34" width="8" height="8" fill="${p.primary}"/>` +
    `<rect x="700" y="58" width="56" height="2" fill="${p.outlineVariant}"/>`,
};
