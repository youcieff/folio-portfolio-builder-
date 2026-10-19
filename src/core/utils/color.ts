import type { OklchColor } from "../schema";

function linearToSrgb(value: number): number {
  const clamped = Math.min(1, Math.max(0, value));
  return clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
}

function srgbToLinear(value: number): number {
  return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}

export function oklchToHex({ l, c, h }: OklchColor): string {
  const radians = h * Math.PI / 180;
  const a = c * Math.cos(radians);
  const b = c * Math.sin(radians);
  const ll = Math.pow(l + 0.3963377774 * a + 0.2158037573 * b, 3);
  const mm = Math.pow(l - 0.1055613458 * a - 0.0638541728 * b, 3);
  const ss = Math.pow(l - 0.0894841775 * a - 1.291485548 * b, 3);
  const rgb = [
    linearToSrgb(4.0767416621 * ll - 3.3077115913 * mm + 0.2309699292 * ss),
    linearToSrgb(-1.2684380046 * ll + 2.6097574011 * mm - 0.3413193965 * ss),
    linearToSrgb(-0.0041960863 * ll - 0.7034186147 * mm + 1.707614701 * ss),
  ];
  return `#${rgb.map((channel) => Math.round(channel * 255).toString(16).padStart(2, "0")).join("")}`;
}

export function hexToOklch(hex: string): OklchColor {
  const value = hex.replace("#", "");
  const red = srgbToLinear(parseInt(value.slice(0, 2), 16) / 255);
  const green = srgbToLinear(parseInt(value.slice(2, 4), 16) / 255);
  const blue = srgbToLinear(parseInt(value.slice(4, 6), 16) / 255);
  const l = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const m = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
  const s = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const b = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const hue = (Math.atan2(b, a) * 180 / Math.PI + 360) % 360;
  return { l: Math.min(1, Math.max(0, L)), c: Math.min(0.4, Math.hypot(a, b)), h: hue };
}
