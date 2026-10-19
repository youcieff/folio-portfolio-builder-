import { DESIGN_STYLES, type BackgroundStyleId, type DesignStyleId, type FontPairId, type OklchColor, type TemplateId, type ThemeTokens } from "./schema";

export type ThemeCollection = "Light" | "Dark" | "Expressive" | "Minimal";

export interface PresetTheme {
  id: string;
  name: string;
  collection: ThemeCollection;
  theme: ThemeTokens;
}

type Color = [number, number, number];
type Definition = [string, string, TemplateId, FontPairId, Color, Color, Color, Color, Color, number, ThemeTokens["spacingDensity"]];
const color = ([l, c, h]: Color): OklchColor => ({ l, c, h });
const styleCursors: Record<TemplateId, number> = { editorial: 0, "midnight-glass": 0, brutalist: 0, terminal: 0 };

function collection(category: ThemeCollection, definitions: Definition[]): PresetTheme[] {
  const backgrounds: BackgroundStyleId[] = category === "Dark"
    ? ["midnight-aurora", "ocean-glass", "solid", "blue-hour", "berry-dusk"]
    : category === "Expressive"
      ? ["sunset", "prism-garden", "coral-haze", "violet-arc", "citrus-sky"]
      : category === "Minimal"
        ? ["solid", "soft-gradient", "ice-field", "sandstone-glow"]
        : ["soft-gradient", "aurora", "peach-wash", "rose-tide", "lavender-cloud", "mint-bloom", "sage-mist", "amber-wave", "forest-light"];
  const familyStyles: Record<TemplateId, DesignStyleId[]> = {
    editorial: DESIGN_STYLES.filter((style) => style.family === "Editorial").map((style) => style.id),
    "midnight-glass": DESIGN_STYLES.filter((style) => style.family === "Atmosphere").map((style) => style.id),
    brutalist: DESIGN_STYLES.filter((style) => style.family === "Graphic").map((style) => style.id),
    terminal: DESIGN_STYLES.filter((style) => style.family === "Digital").map((style) => style.id),
  };
  return definitions.map(([id, name, templateId, fontPair, accent, background, surface, ink, inkSoft, radiusBase, spacingDensity], index) => {
    const styles = familyStyles[templateId];
    const designStyle = styles[styleCursors[templateId]++ % styles.length];
    return {
      id, name, collection: category,
      theme: {
        templateId, designStyle, backgroundStyle: backgrounds[index % backgrounds.length]!, fontPair, accent: color(accent), background: color(background),
        surface: color(surface), ink: color(ink), inkSoft: color(inkSoft), radiusBase, spacingDensity,
      },
    };
  });
}

const light = collection("Light", [
  ["porcelain", "Porcelain Studio", "editorial", "newsreader+source-serif", [.43,.14,155], [.985,.008,88], [.965,.012,88], [.16,.018,165], [.43,.025,165], 2, "airy"],
  ["olive-paper", "Olive & Paper", "editorial", "fraunces+dm-sans", [.42,.12,140], [.974,.018,102], [.948,.025,100], [.17,.025,145], [.44,.035,145], 8, "airy"],
  ["coastal-blue", "Coastal Blue", "midnight-glass", "space-grotesk+inter", [.45,.16,250], [.972,.018,245], [.993,.004,245], [.14,.035,250], [.43,.035,250], 12, "normal"],
  ["rose-clay", "Rose Clay", "editorial", "fraunces+dm-sans", [.48,.15,20], [.978,.018,20], [.994,.006,30], [.2,.035,10], [.46,.035,15], 8, "airy"],
  ["citrus-paper", "Citrus Paper", "brutalist", "space-grotesk+inter", [.43,.16,45], [.979,.025,90], [.95,.035,90], [.14,.025,55], [.42,.045,55], 0, "normal"],
  ["lilac-studio", "Lilac Studio", "midnight-glass", "space-grotesk+inter", [.47,.14,300], [.968,.025,305], [.993,.01,300], [.17,.035,295], [.43,.04,295], 16, "airy"],
  ["blueprint-day", "Blueprint Day", "brutalist", "space-mono+ibm-plex-mono", [.42,.15,255], [.965,.035,245], [.94,.045,245], [.12,.04,250], [.42,.055,250], 0, "compact"],
  ["warm-linen", "Warm Linen", "editorial", "newsreader+source-serif", [.43,.12,35], [.977,.024,75], [.995,.008,80], [.18,.025,48], [.44,.035,45], 4, "airy"],
  ["mint-gallery", "Mint Gallery", "midnight-glass", "space-grotesk+inter", [.42,.12,160], [.967,.022,155], [.99,.01,155], [.13,.04,175], [.43,.045,175], 14, "normal"],
  ["soft-coral", "Soft Coral", "editorial", "fraunces+dm-sans", [.46,.16,28], [.975,.02,45], [.993,.01,48], [.2,.025,35], [.45,.035,35], 6, "normal"],
]);

const dark = collection("Dark", [
  ["deep-atlas", "Deep Atlas", "midnight-glass", "space-grotesk+inter", [.78,.13,165], [.115,.025,250], [.17,.035,250], [.94,.015,220], [.69,.025,225], 14, "airy"],
  ["forest-night", "Forest at Night", "editorial", "fraunces+dm-sans", [.78,.13,125], [.13,.025,150], [.19,.035,150], [.94,.018,105], [.69,.035,125], 8, "airy"],
  ["plum-noir", "Plum Noir", "midnight-glass", "fraunces+dm-sans", [.8,.14,350], [.13,.035,305], [.2,.045,305], [.95,.018,330], [.7,.035,330], 16, "normal"],
  ["carbon-blue", "Carbon Blue", "terminal", "space-mono+ibm-plex-mono", [.79,.13,220], [.105,.018,250], [.16,.03,250], [.92,.02,230], [.67,.025,235], 4, "normal"],
  ["dark-olive", "Dark Olive", "editorial", "newsreader+source-serif", [.8,.12,100], [.14,.025,115], [.2,.035,115], [.95,.02,85], [.7,.035,95], 6, "airy"],
  ["oxblood", "Oxblood & Rose", "midnight-glass", "fraunces+dm-sans", [.78,.14,20], [.13,.03,15], [.2,.035,15], [.95,.015,20], [.7,.035,20], 10, "normal"],
  ["arctic-night", "Arctic Night", "midnight-glass", "space-grotesk+inter", [.8,.12,195], [.12,.025,235], [.18,.035,235], [.95,.012,220], [.7,.025,220], 18, "airy"],
  ["amber-room", "Amber Room", "terminal", "space-mono+ibm-plex-mono", [.8,.14,68], [.115,.025,65], [.18,.035,65], [.95,.018,78], [.69,.04,72], 2, "compact"],
  ["ink-violet", "Ink Violet", "brutalist", "space-grotesk+inter", [.81,.14,295], [.12,.035,285], [.18,.045,285], [.96,.015,285], [.71,.03,285], 0, "compact"],
  ["deep-sea", "Deep Sea Glass", "midnight-glass", "space-grotesk+inter", [.79,.12,175], [.105,.025,205], [.16,.035,205], [.94,.015,185], [.68,.03,190], 20, "airy"],
]);

const expressive = collection("Expressive", [
  ["cobalt-pop", "Cobalt Pop", "brutalist", "space-grotesk+inter", [.48,.24,260], [.965,.025,250], [.94,.04,250], [.12,.035,255], [.42,.055,255], 0, "compact"],
  ["tomato-red", "Tomato Red", "editorial", "fraunces+dm-sans", [.48,.2,25], [.975,.018,50], [.99,.008,55], [.17,.03,20], [.44,.04,25], 4, "airy"],
  ["acid-lime", "Acid Lime", "brutalist", "space-mono+ibm-plex-mono", [.48,.2,130], [.965,.025,120], [.94,.04,120], [.11,.035,130], [.4,.06,130], 0, "compact"],
  ["electric-lilac", "Electric Lilac", "midnight-glass", "space-grotesk+inter", [.76,.18,300], [.14,.035,285], [.2,.045,285], [.96,.015,295], [.7,.035,295], 18, "normal"],
  ["ultramarine", "Ultramarine", "editorial", "newsreader+source-serif", [.8,.17,255], [.13,.035,260], [.2,.045,260], [.96,.012,250], [.7,.03,255], 6, "airy"],
  ["tangerine-pop", "Tangerine Pop", "brutalist", "space-grotesk+inter", [.5,.2,42], [.975,.025,75], [.95,.035,75], [.13,.035,40], [.43,.055,40], 0, "normal"],
  ["hot-magenta", "Hot Magenta", "midnight-glass", "space-grotesk+inter", [.77,.18,345], [.15,.04,320], [.21,.05,320], [.96,.015,330], [.71,.035,335], 16, "normal"],
  ["jade-signal", "Jade Signal", "terminal", "space-mono+ibm-plex-mono", [.8,.15,155], [.11,.025,165], [.17,.035,165], [.94,.015,150], [.68,.035,155], 3, "compact"],
  ["saffron-editorial", "Saffron Editorial", "editorial", "fraunces+dm-sans", [.46,.16,65], [.975,.025,85], [.99,.008,80], [.19,.03,50], [.45,.04,52], 5, "airy"],
  ["coral-after-dark", "Coral After Dark", "midnight-glass", "space-grotesk+inter", [.79,.14,32], [.13,.03,270], [.19,.04,270], [.95,.015,20], [.69,.03,25], 12, "airy"],
]);

const minimal = collection("Minimal", [
  ["swiss-paper", "Swiss Paper", "brutalist", "space-grotesk+inter", [.22,.015,250], [.99,.002,0], [.96,.004,0], [.09,.005,250], [.42,.008,250], 0, "compact"],
  ["graphite", "Graphite", "terminal", "space-mono+ibm-plex-mono", [.82,.01,0], [.12,.004,250], [.18,.006,250], [.96,.004,0], [.68,.008,0], 0, "compact"],
  ["stone-and-ink", "Stone & Ink", "editorial", "newsreader+source-serif", [.38,.035,65], [.96,.012,78], [.985,.006,80], [.15,.012,60], [.43,.02,65], 2, "airy"],
  ["mono-gallery", "Mono Gallery", "midnight-glass", "space-grotesk+inter", [.82,.008,190], [.13,.008,205], [.2,.01,205], [.95,.006,200], [.68,.01,200], 8, "normal"],
  ["slate-grid", "Slate Grid", "brutalist", "space-mono+ibm-plex-mono", [.36,.04,245], [.955,.012,245], [.93,.018,245], [.13,.02,245], [.42,.025,245], 0, "compact"],
  ["paperback", "Paperback", "editorial", "newsreader+source-serif", [.35,.07,25], [.965,.022,70], [.99,.008,70], [.17,.02,40], [.44,.035,38], 0, "airy"],
  ["quiet-sage", "Quiet Sage", "editorial", "fraunces+dm-sans", [.37,.07,145], [.965,.015,120], [.99,.008,115], [.16,.02,150], [.43,.035,145], 4, "airy"],
  ["blue-black", "Blue Black", "midnight-glass", "space-grotesk+inter", [.79,.035,220], [.115,.018,245], [.17,.024,245], [.94,.01,225], [.68,.018,225], 8, "normal"],
  ["chalkboard", "Chalkboard", "terminal", "space-mono+ibm-plex-mono", [.78,.045,155], [.13,.014,155], [.19,.02,155], [.95,.01,145], [.68,.02,150], 0, "compact"],
  ["gallery-black", "Gallery Black", "brutalist", "space-grotesk+inter", [.96,.004,0], [.07,.002,0], [.12,.004,0], [.98,.002,0], [.72,.004,0], 0, "normal"],
]);

export const PRESET_THEMES: PresetTheme[] = [
  ...light,
  ...dark,
  ...expressive,
  ...minimal,
];
