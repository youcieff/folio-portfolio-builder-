import { z } from "zod";

// ─── OKLCH color — perceptually uniform, perfect for remix math ───────────────
export const OklchColorSchema = z.object({
  l: z.number().min(0).max(1),
  c: z.number().min(0).max(0.4),
  h: z.number().min(0).max(360),
});

export type OklchColor = z.infer<typeof OklchColorSchema>;

// ─── Curated font pairs ───────────────────────────────────────────────────────
export const FontPairIdSchema = z.enum([
  "space-grotesk+inter",           // cool / techy
  "newsreader+source-serif",       // editorial / warm
  "space-mono+ibm-plex-mono",      // brutalist / terminal
  "fraunces+dm-sans",              // expressive / modern
  "readex-pro+ibm-plex-sans-arabic", // Arabic UI
]);

export type FontPairId = z.infer<typeof FontPairIdSchema>;

// ─── Template IDs ─────────────────────────────────────────────────────────────
export const TemplateIdSchema = z.enum([
  "midnight-glass",
  "editorial",
  "brutalist",
  "terminal",
]);

export type TemplateId = z.infer<typeof TemplateIdSchema>;

export const DESIGN_STYLES = [
  { id: "editorial", label: "Editorial Story", family: "Editorial" },
  { id: "swiss-editorial", label: "Swiss Editorial", family: "Editorial" },
  { id: "magazine-cover", label: "Magazine Cover", family: "Editorial" },
  { id: "gallery-essay", label: "Gallery Essay", family: "Editorial" },
  { id: "archive-index", label: "Archive Index", family: "Editorial" },
  { id: "fashion-campaign", label: "Fashion Campaign", family: "Editorial" },
  { id: "midnight-glass", label: "Midnight Glass", family: "Atmosphere" },
  { id: "aurora-orbit", label: "Aurora Orbit", family: "Atmosphere" },
  { id: "liquid-chrome", label: "Liquid Chrome", family: "Atmosphere" },
  { id: "prism-gallery", label: "Prism Gallery", family: "Atmosphere" },
  { id: "noir-cinema", label: "Noir Cinema", family: "Atmosphere" },
  { id: "soft-depth", label: "Soft Depth", family: "Atmosphere" },
  { id: "brutalist", label: "Brutalist Poster", family: "Graphic" },
  { id: "neo-brutal", label: "Neo Brutal", family: "Graphic" },
  { id: "swiss-grid", label: "Swiss Grid", family: "Graphic" },
  { id: "color-block", label: "Color Block", family: "Graphic" },
  { id: "kinetic-type", label: "Kinetic Type", family: "Graphic" },
  { id: "bold-collage", label: "Bold Collage", family: "Graphic" },
  { id: "terminal", label: "Terminal", family: "Digital" },
  { id: "command-center", label: "Command Center", family: "Digital" },
  { id: "signal-grid", label: "Signal Grid", family: "Digital" },
  { id: "blueprint", label: "Blueprint", family: "Digital" },
  { id: "data-atlas", label: "Data Atlas", family: "Digital" },
  { id: "pixel-noir", label: "Pixel Noir", family: "Digital" },
] as const;
export const DesignStyleSchema = z.enum(DESIGN_STYLES.map(({ id }) => id) as [typeof DESIGN_STYLES[number]["id"], ...typeof DESIGN_STYLES[number]["id"][]]);
export type DesignStyleId = z.infer<typeof DesignStyleSchema>;

export const BACKGROUND_STYLE_IDS = [
  "solid", "soft-gradient", "aurora", "sunset", "peach-wash", "rose-tide",
  "lavender-cloud", "violet-arc", "blue-hour", "ocean-glass", "mint-bloom",
  "sage-mist", "citrus-sky", "amber-wave", "berry-dusk", "coral-haze",
  "ice-field", "forest-light", "midnight-aurora", "sandstone-glow", "prism-garden",
] as const;
export const BackgroundStyleSchema = z.enum(BACKGROUND_STYLE_IDS);
export type BackgroundStyleId = z.infer<typeof BackgroundStyleSchema>;

// ─── Theme tokens — the single source of visual truth ────────────────────────
export const ThemeTokensSchema = z.object({
  templateId: TemplateIdSchema,
  designStyle: DesignStyleSchema.optional(),
  backgroundStyle: BackgroundStyleSchema.default("soft-gradient"),
  accent:     OklchColorSchema,
  background: OklchColorSchema,
  surface:    OklchColorSchema,
  ink:        OklchColorSchema,
  inkSoft:    OklchColorSchema,
  fontPair:   FontPairIdSchema,
  // px — 0 = brutalist square, 8 = rounded, 20 = pill
  radiusBase:     z.number().min(0).max(24),
  // affects padding multiplier in the renderer
  spacingDensity: z.enum(["compact", "normal", "airy"]),
});

export type ThemeTokens = z.infer<typeof ThemeTokensSchema>;
