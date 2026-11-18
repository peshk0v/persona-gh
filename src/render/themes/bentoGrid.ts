import { accent, makePalette } from "./common";
import type { Theme } from "./types";

export const bentoGrid: Theme = {
  id: "bento-grid",
  fontFamily: "'Inter','Segoe UI',sans-serif",
  embedFont: false,
  textScale: 1.03,
  boldScale: 1.05,
  heading: { weight: 700, spacing: 0 },
  radius: {
    card: 20, project: 18, inner: 14, tile: 14, streak: 16, cell: 8,
    chip: 10, social: 14, button: 14, row: 20, bar: 6, icon: 12, avatar: 18,
  },
  line: { hairline: 1.5, strong: 2, cell: 1.5 },
  badge: "square",
  dot: "square",
  iconShape: "square",
  avatarShape: "square",
  socialShape: "square",
  avatar: (p) => ({
    halo: { fill: p.secondaryContainer },
    frame: { fill: p.primaryContainer, stroke: p.outlineVariant, strokeWidth: 1.5 },
    inner: p.primaryContainer,
    icon: p.onPrimaryContainer,
  }),
  palette: (seed, _scheme, dark) => {
    const a = accent(seed, dark);
    return makePalette({
      surface: dark ? "#101216" : "#F3F5F8",
      surfaceContainerLow: dark ? "#171A1F" : "#E9EDF3",
      surfaceContainer: dark ? "#1B1F25" : "#F8FAFC",
      surfaceContainerHigh: dark ? "#21262D" : "#FFFFFF",
      surfaceContainerHighest: dark ? "#272D35" : "#EEF2F7",
      onSurface: dark ? "#F3F6FA" : "#111827",
      onSurfaceVariant: dark ? "#AAB4C3" : "#5B6472",
      outline: dark ? "#333A44" : "#D5DCE6",
      outlineVariant: dark ? "#2A3038" : "#E2E8F0",
      ...a,
    });
  },
  card: (p) => ({ fill: p.surfaceContainer, rx: 20, stroke: p.outlineVariant, strokeWidth: 1.5 }),
  project: (p) => ({ fill: p.surfaceContainerHigh, rx: 18, stroke: p.outline, strokeWidth: 1.5 }),
  inner: (p) => ({ fill: p.surfaceContainerHigh, rx: 14, stroke: p.outlineVariant, strokeWidth: 1.5 }),
  tile: (p) => ({ fill: p.surfaceContainerLow, rx: 14, stroke: p.outlineVariant, strokeWidth: 1.5 }),
  subtle: (p) => ({ fill: p.surfaceContainerHighest, rx: 12, stroke: p.outlineVariant, strokeWidth: 1.5 }),
  row: (p) => ({ fill: p.surfaceContainerLow, rx: 20, stroke: p.outlineVariant, strokeWidth: 1.5 }),
  rowFill: (p) => p.surfaceContainerLow,
  chip: (p, _dark, variant) => {
    if (variant === "filled") return { fill: p.primary, fg: p.onPrimary, rx: 10 };
    if (variant === "outlined") return { fill: p.surfaceContainerLow, fg: p.onSurface, rx: 10, stroke: p.outline, strokeWidth: 1.5 };
    if (variant === "tertiary") return { fill: p.tertiaryContainer, fg: p.onTertiaryContainer, rx: 10, stroke: p.outlineVariant, strokeWidth: 1.5 };
    return { fill: p.surfaceContainerHigh, fg: p.onSurface, rx: 10, stroke: p.outlineVariant, strokeWidth: 1.5 };
  },
  hero: (p) =>
    `<rect x="686" y="30" width="52" height="52" rx="12" fill="${p.primaryContainer}" stroke="${p.outlineVariant}" stroke-width="1.5"/>` +
    `<rect x="746" y="30" width="46" height="52" rx="12" fill="${p.secondaryContainer}" stroke="${p.outlineVariant}" stroke-width="1.5"/>` +
    `<rect x="686" y="90" width="106" height="42" rx="12" fill="${p.tertiaryContainer}" stroke="${p.outlineVariant}" stroke-width="1.5"/>` +
    `<rect x="746" y="218" width="46" height="46" rx="12" fill="${p.primaryContainer}" stroke="${p.outlineVariant}" stroke-width="1.5"/>`,
};
