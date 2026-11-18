import { accent, makePalette } from "./common";
import type { Theme } from "./types";

export const neumorphism: Theme = {
  id: "neumorphism",
  fontFamily: "'Nunito','Segoe UI',sans-serif",
  embedFont: false,
  textScale: 1.04,
  boldScale: 1.06,
  heading: { weight: 700, spacing: 0 },
  radius: {
    card: 28, project: 24, inner: 20, tile: 20, streak: 22, cell: 12,
    chip: 16, social: 20, button: 20, row: 28, bar: 8, icon: 16, avatar: 24,
  },
  line: { hairline: 1, strong: 2, cell: 1 },
  badge: "square",
  dot: "square",
  iconShape: "square",
  avatarShape: "square",
  socialShape: "square",
  cardPad: 0,
  avatar: (p) => ({
    frame: { fill: p.surfaceContainer, filter: "url(#neuRaised)" },
    inner: p.surfaceContainerHigh,
    icon: p.primary,
  }),
  palette: (seed, _scheme, dark) => {
    const a = accent(seed, dark);
    return makePalette({
      surface: dark ? "#22252A" : "#E6E9EF",
      surfaceContainerLow: dark ? "#1F2227" : "#E9ECF2",
      surfaceContainer: dark ? "#22252A" : "#E6E9EF",
      surfaceContainerHigh: dark ? "#282B30" : "#DDE1E8",
      surfaceContainerHighest: dark ? "#2E3137" : "#D4D9E2",
      onSurface: dark ? "#E7E9EE" : "#2C3038",
      onSurfaceVariant: dark ? "#A6ACB8" : "#6B7280",
      outline: dark ? "#34383E" : "#C9CED8",
      outlineVariant: dark ? "#2C3036" : "#D8DDE5",
      ...a,
    });
  },
  card: (p) => ({ fill: p.surfaceContainer, rx: 28 }),
  project: (p) => ({ fill: p.surfaceContainerHigh, rx: 24, filter: "url(#neuInset)" }),
  inner: (p) => ({ fill: p.surfaceContainer, rx: 20, filter: "url(#neuInset)" }),
  tile: (p) => ({ fill: p.surfaceContainerHigh, rx: 20, filter: "url(#neuRaised)" }),
  subtle: (p) => ({ fill: p.surfaceContainerHighest, rx: 16, filter: "url(#neuInset)" }),
  row: (p) => ({ fill: p.surfaceContainerLow, rx: 28 }),
  rowFill: (p) => p.surfaceContainerLow,
  chip: (p, _dark, variant) => {
    if (variant === "filled") return { fill: p.primary, fg: p.onPrimary, rx: 16, filter: "url(#neuRaised)" };
    if (variant === "outlined") return { fill: p.surfaceContainer, fg: p.onSurface, rx: 16, filter: "url(#neuInset)" };
    if (variant === "tertiary") return { fill: p.tertiaryContainer, fg: p.onTertiaryContainer, rx: 16, filter: "url(#neuRaised)" };
    return { fill: p.surfaceContainer, fg: p.onSurface, rx: 16, filter: "url(#neuRaised)" };
  },
  defs: (_p, dark) => {
    const light = dark ? "#3A3F46" : "#FFFFFF";
    const shadow = dark ? "#000000" : "#8A93A5";
    const lightOpacity = dark ? 0.72 : 0.9;
    const shadowOpacity = dark ? 0.62 : 0.42;
    return (
      `<filter id="neuRaised" x="-60%" y="-60%" width="220%" height="220%">` +
      `<feDropShadow dx="-5" dy="-5" stdDeviation="5" flood-color="${light}" flood-opacity="${lightOpacity}"/>` +
      `<feDropShadow dx="6" dy="6" stdDeviation="6" flood-color="${shadow}" flood-opacity="${shadowOpacity}"/>` +
      `</filter>` +
      `<filter id="neuInset" x="-60%" y="-60%" width="220%" height="220%">` +
      `<feOffset dx="4" dy="4" in="SourceAlpha" result="o1"/>` +
      `<feGaussianBlur stdDeviation="5" in="o1" result="b1"/>` +
      `<feComposite operator="out" in="SourceAlpha" in2="b1" result="innerDark"/>` +
      `<feFlood flood-color="${shadow}" flood-opacity="${shadowOpacity}" result="darkColor"/>` +
      `<feComposite operator="in" in="darkColor" in2="innerDark" result="darkShadow"/>` +
      `<feOffset dx="-4" dy="-4" in="SourceAlpha" result="o2"/>` +
      `<feGaussianBlur stdDeviation="5" in="o2" result="b2"/>` +
      `<feComposite operator="out" in="SourceAlpha" in2="b2" result="innerLight"/>` +
      `<feFlood flood-color="${light}" flood-opacity="${lightOpacity}" result="lightColor"/>` +
      `<feComposite operator="in" in="lightColor" in2="innerLight" result="lightShadow"/>` +
      `<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="darkShadow"/><feMergeNode in="lightShadow"/></feMerge>` +
      `</filter>`
    );
  },
};
