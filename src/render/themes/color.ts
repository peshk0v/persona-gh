export function rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) || 0) as [number, number, number];
}

export function mix(a: string, b: string, t: number) {
  const pa = rgb(a);
  const pb = rgb(b);
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, "0")).join("");
}

export function alpha(hex: string, a: number) {
  const [r, g, b] = rgb(hex);
  return `rgba(${r},${g},${b},${+a.toFixed(3)})`;
}

export function luminance(hex: string) {
  const [r, g, b] = rgb(hex).map((v) => v / 255);
  const f = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function ink(hex: string) {
  return luminance(hex) > 0.45 ? "#17171A" : "#FFFFFF";
}

export function tint(hex: string, t: number) {
  return mix(hex, "#FFFFFF", t);
}

export function shade(hex: string, t: number) {
  return mix(hex, "#000000", t);
}
