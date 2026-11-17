import type { Palette, SchemeName, ShapeName, ThemeId } from "../types";

export type SurfaceSpec = {
  fill: string;
  rx: number;
  stroke?: string;
  strokeWidth?: number;
  filter?: string;
  opacity?: number;
  shadow?: { dx: number; dy: number; color: string };
  innerBorders?: { inset: number; stroke: string; width: number }[];
};

export type ChipVariant = "tonal" | "filled" | "outlined" | "tertiary";

export type ChipSpec = {
  fill: string;
  fg: string;
  rx: number;
  stroke?: string;
  strokeWidth?: number;
  filter?: string;
  shadow?: { dx: number; dy: number; color: string };
};

export interface ThemeRadius {
  card: number;
  project: number;
  inner: number;
  tile: number;
  streak: number;
  cell: number;
  chip: number;
  social: number;
  button: number;
  row: number;
  bar: number;
  icon: number;
  avatar: number;
}

export interface ThemeLine {
  hairline: number;
  strong: number;
  cell: number;
}

export interface AvatarStyle {
  /** Decorative shape behind the avatar frame. Omit for a bare frame. */
  halo?: { fill: string; opacity?: number; stroke?: string; strokeWidth?: number };
  frame: { fill: string; stroke?: string; strokeWidth?: number; filter?: string };
  inner: string;
  icon: string;
  /** Set false to keep square/rounded avatar frames axis-aligned. */
  spin?: boolean;
}

export interface Theme {
  id: ThemeId;
  fontFamily: string;
  embedFont?: boolean;
  /** Multiplier for glyph-width estimates when the theme font is wider than Google Sans. */
  textScale?: number;
  /** Measure text with a fixed 0.6em monospace advance instead of the proportional table. */
  mono?: boolean;
  /** Transparent padding around project cards so soft SVG filters are not clipped. */
  cardPad?: number;
  heading: { weight: number; spacing: number; uppercase?: boolean };
  radius: ThemeRadius;
  line: ThemeLine;
  badge: "circle" | "square";
  dot: "circle" | "square";
  iconShape?: ShapeName | "square";
  avatarShape?: ShapeName | "square";
  socialShape?: ShapeName | "square";
  avatar?: (p: Palette, dark: boolean) => AvatarStyle;
  palette: (seed: string, scheme: SchemeName, dark: boolean) => Palette;
  card: (p: Palette, dark: boolean) => SurfaceSpec;
  project: (p: Palette, dark: boolean) => SurfaceSpec;
  inner: (p: Palette, dark: boolean) => SurfaceSpec;
  tile: (p: Palette, dark: boolean) => SurfaceSpec;
  subtle: (p: Palette, dark: boolean) => SurfaceSpec;
  row: (p: Palette, dark: boolean) => SurfaceSpec;
  rowFill: (p: Palette, dark: boolean) => string;
  chip: (p: Palette, dark: boolean, variant: ChipVariant) => ChipSpec;
  defs?: (p: Palette, dark: boolean) => string;
  hero?: (p: Palette, dark: boolean) => string;
  backdrop?: (p: Palette, dark: boolean, w: number, h: number) => string;
}
