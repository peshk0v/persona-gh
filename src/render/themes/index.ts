import type { ThemeId } from "../types";
import { bentoGrid } from "./bentoGrid";
import { glassmorphism } from "./glassmorphism";
import { material3 } from "./material3";
import { minimalism } from "./minimalism";
import { neumorphism } from "./neumorphism";
import { retropixel } from "./retropixel";
import { warmMinimalism } from "./warmMinimalism";
import type { Theme } from "./types";

export const THEMES: Record<ThemeId, Theme> = {
  "material-3": material3,
  minimalism,
  "warm-minimalism": warmMinimalism,
  glassmorphism,
  neumorphism,
  "bento-grid": bentoGrid,
  retropixel,
};

export const THEME_IDS = Object.keys(THEMES) as ThemeId[];

export function getTheme(id: ThemeId | undefined | null): Theme {
  return (id && THEMES[id]) || THEMES["material-3"];
}

export type { ChipSpec, ChipVariant, SurfaceSpec, Theme, ThemeLine, ThemeRadius } from "./types";
