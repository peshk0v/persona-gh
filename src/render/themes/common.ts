import type { Palette } from "../types";
import { ink, mix, shade, tint } from "./color";

export interface PaletteInput {
  surface: string;
  surfaceDim?: string;
  surfaceBright?: string;
  surfaceContainerLowest?: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  primary: string;
  onPrimary?: string;
  primaryContainer: string;
  onPrimaryContainer?: string;
  secondary: string;
  onSecondary?: string;
  secondaryContainer: string;
  onSecondaryContainer?: string;
  tertiary: string;
  onTertiary?: string;
  tertiaryContainer: string;
  onTertiaryContainer?: string;
  error?: string;
  onError?: string;
  errorContainer?: string;
  onErrorContainer?: string;
  inverseSurface?: string;
  inverseOnSurface?: string;
  inversePrimary?: string;
  shadow?: string;
}

export function makePalette(x: PaletteInput): Palette {
  const error = x.error ?? "#B3261E";
  const errorContainer = x.errorContainer ?? tint(error, 0.82);
  const inverseSurface = x.inverseSurface ?? ink(x.surface);
  return {
    primary: x.primary,
    onPrimary: x.onPrimary ?? ink(x.primary),
    primaryContainer: x.primaryContainer,
    onPrimaryContainer: x.onPrimaryContainer ?? ink(x.primaryContainer),
    secondary: x.secondary,
    onSecondary: x.onSecondary ?? ink(x.secondary),
    secondaryContainer: x.secondaryContainer,
    onSecondaryContainer: x.onSecondaryContainer ?? ink(x.secondaryContainer),
    tertiary: x.tertiary,
    onTertiary: x.onTertiary ?? ink(x.tertiary),
    tertiaryContainer: x.tertiaryContainer,
    onTertiaryContainer: x.onTertiaryContainer ?? ink(x.tertiaryContainer),
    error,
    onError: x.onError ?? ink(error),
    errorContainer,
    onErrorContainer: x.onErrorContainer ?? ink(errorContainer),
    surface: x.surface,
    surfaceDim: x.surfaceDim ?? shade(x.surface, 0.08),
    surfaceBright: x.surfaceBright ?? tint(x.surface, 0.08),
    surfaceContainerLowest: x.surfaceContainerLowest ?? x.surface,
    surfaceContainerLow: x.surfaceContainerLow,
    surfaceContainer: x.surfaceContainer,
    surfaceContainerHigh: x.surfaceContainerHigh,
    surfaceContainerHighest: x.surfaceContainerHighest,
    onSurface: x.onSurface,
    onSurfaceVariant: x.onSurfaceVariant,
    outline: x.outline,
    outlineVariant: x.outlineVariant,
    inverseSurface,
    inverseOnSurface: x.inverseOnSurface ?? ink(inverseSurface),
    inversePrimary: x.inversePrimary ?? mix(x.primary, x.surface, 0.35),
    scrim: "#000000",
    shadow: x.shadow ?? "#000000",
  };
}

export function accent(seed: string, dark: boolean, lightness = 0.12) {
  const primary = dark ? tint(seed, lightness) : shade(seed, 0.04);
  const primaryContainer = dark ? mix(primary, "#000000", 0.58) : tint(primary, 0.84);
  const secondarySeed = mix(primary, dark ? "#A7ADB8" : "#6B7280", 0.42);
  const tertiarySeed = mix(primary, dark ? "#C4B5FD" : "#0EA5A4", 0.38);
  return {
    primary,
    primaryContainer,
    secondary: secondarySeed,
    secondaryContainer: dark ? mix(secondarySeed, "#000000", 0.58) : tint(secondarySeed, 0.8),
    tertiary: tertiarySeed,
    tertiaryContainer: dark ? mix(tertiarySeed, "#000000", 0.58) : tint(tertiarySeed, 0.8),
  };
}
