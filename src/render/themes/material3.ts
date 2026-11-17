import { shape } from "../kit";
import { palette } from "../palette";
import type { Theme } from "./types";

export const material3: Theme = {
  id: "material-3",
  fontFamily: "G,R,'Google Sans','Segoe UI',Roboto,sans-serif",
  embedFont: true,
  heading: { weight: 600, spacing: 0 },
  radius: {
    card: 32, project: 28, inner: 16, tile: 24, streak: 26, cell: 14,
    chip: 10, social: 24, button: 28, row: 32, bar: 7, icon: 20, avatar: 0,
  },
  line: { hairline: 1, strong: 2, cell: 1.5 },
  badge: "circle",
  dot: "circle",
  palette: (seed, scheme, dark) => palette(seed, scheme, dark),
  card: (p) => ({ fill: p.surfaceContainer, rx: 32 }),
  project: (p) => ({ fill: p.surfaceContainerHigh, rx: 28 }),
  inner: (p) => ({ fill: p.surfaceContainerHigh, rx: 16 }),
  tile: (p) => ({ fill: p.surfaceContainerHigh, rx: 24 }),
  subtle: (p) => ({ fill: p.surfaceContainerHighest, rx: 20 }),
  row: (p) => ({ fill: p.surfaceContainerLow, rx: 32 }),
  rowFill: (p) => p.surfaceContainerLow,
  chip: (p, _dark, variant) => {
    if (variant === "filled") return { fill: p.primary, fg: p.onPrimary, rx: 10 };
    if (variant === "outlined") return { fill: p.surfaceContainerLow, fg: p.onSurfaceVariant, rx: 10, stroke: p.outlineVariant, strokeWidth: 1 };
    if (variant === "tertiary") return { fill: p.tertiaryContainer, fg: p.onTertiaryContainer, rx: 11 };
    return { fill: p.secondaryContainer, fg: p.onSecondaryContainer, rx: 10 };
  },
  hero: (p) =>
    `<path class="spin" d="${shape("flower", 780, 30, 150)}" fill="${p.primaryContainer}"/>` +
    `<path class="bob" d="${shape("clover", 690, 292, 62)}" fill="${p.tertiaryContainer}"/>` +
    `<path class="spin-r" d="${shape("sunny", 812, 236, 34)}" fill="${p.secondaryContainer}"/>`,
};
