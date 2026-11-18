import { mix, shade, tint } from "./color";
import { makePalette } from "./common";
import type { Theme } from "./types";

export const warmMinimalism: Theme = {
  id: "warm-minimalism",
  fontFamily: "Georgia,'Times New Roman',serif",
  embedFont: false,
  textScale: 1.03,
  boldScale: 1.13,
  heading: { weight: 600, spacing: 0 },
  radius: {
    card: 12, project: 12, inner: 10, tile: 12, streak: 12, cell: 8,
    chip: 8, social: 12, button: 12, row: 12, bar: 4, icon: 10, avatar: 22,
  },
  line: { hairline: 1, strong: 1, cell: 1 },
  badge: "circle",
  dot: "circle",
  iconShape: "square",
  avatarShape: "soft",
  socialShape: "soft",
  avatar: (p) => ({
    halo: { fill: p.primaryContainer, opacity: 0.8 },
    frame: { fill: p.surfaceContainerHigh, stroke: p.outline, strokeWidth: 1.5 },
    inner: p.surfaceContainerLow,
    icon: p.onSurface,
    spin: false,
  }),
  palette: (seed, _scheme, dark) => {
    const primary = dark ? mix(seed, "#E8D5B7", 0.48) : mix(seed, "#8C6B4F", 0.48);
    const secondary = mix(primary, dark ? "#C4A484" : "#B08968", 0.5);
    const tertiary = mix(primary, dark ? "#A3B18A" : "#7C8B5A", 0.55);
    const surface = dark ? "#1C1917" : "#FAF7F2";
    return makePalette({
      surface,
      surfaceContainerLow: dark ? "#26221E" : "#F3EDE4",
      surfaceContainer: dark ? "#2C2722" : "#F7F2EA",
      surfaceContainerHigh: dark ? "#332D27" : "#EFE7DC",
      surfaceContainerHighest: dark ? "#3B342C" : "#E7DDCF",
      onSurface: dark ? "#F5EFE7" : "#2B2520",
      onSurfaceVariant: dark ? "#B8AA9C" : "#6B5E52",
      outline: dark ? "#4A4138" : "#D8CCBE",
      outlineVariant: dark ? "#3A332C" : "#E8DED2",
      primary,
      primaryContainer: dark ? shade(mix(primary, surface, 0.35), 0.1) : tint(mix(primary, surface, 0.55), 0.35),
      onPrimaryContainer: dark ? "#F5EFE7" : "#3C2F24",
      secondary,
      secondaryContainer: dark ? mix(secondary, surface, 0.45) : tint(mix(secondary, surface, 0.55), 0.25),
      onSecondaryContainer: dark ? "#F5EFE7" : "#3C2F24",
      tertiary,
      tertiaryContainer: dark ? mix(tertiary, surface, 0.45) : tint(mix(tertiary, surface, 0.6), 0.25),
      onTertiaryContainer: dark ? "#F5EFE7" : "#2F3526",
    });
  },
  card: (p) => ({ fill: p.surface, rx: 12, stroke: p.outline, strokeWidth: 1 }),
  project: (p) => ({ fill: p.surface, rx: 12, stroke: p.outline, strokeWidth: 1 }),
  inner: (p) => ({ fill: p.surfaceContainerLow, rx: 10, stroke: p.outlineVariant, strokeWidth: 1 }),
  tile: (p) => ({ fill: p.surfaceContainerLow, rx: 12, stroke: p.outlineVariant, strokeWidth: 1 }),
  subtle: (p) => ({ fill: p.surfaceContainer, rx: 10, stroke: p.outlineVariant, strokeWidth: 1 }),
  row: (p) => ({ fill: p.surface, rx: 12, stroke: p.outline, strokeWidth: 1 }),
  rowFill: (p) => p.surface,
  chip: (p, _dark, variant) => {
    if (variant === "filled") return { fill: p.primary, fg: p.onPrimary, rx: 8 };
    if (variant === "outlined") return { fill: p.surface, fg: p.onSurface, rx: 8, stroke: p.outline, strokeWidth: 1 };
    if (variant === "tertiary") return { fill: p.tertiaryContainer, fg: p.onTertiaryContainer, rx: 8, stroke: p.outlineVariant, strokeWidth: 1 };
    return { fill: p.surfaceContainerLow, fg: p.onSurface, rx: 8, stroke: p.outlineVariant, strokeWidth: 1 };
  },
  hero: (p) =>
    `<circle cx="748" cy="52" r="118" fill="${p.primaryContainer}" opacity=".55"/>` +
    `<circle cx="812" cy="250" r="74" fill="${p.secondaryContainer}" opacity=".45"/>` +
    `<rect x="690" y="196" width="44" height="44" rx="14" fill="${p.tertiaryContainer}" opacity=".5"/>`,
};
