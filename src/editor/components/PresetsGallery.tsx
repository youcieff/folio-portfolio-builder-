import { useState } from "react";
import { PRESET_THEMES, type PresetTheme } from "@/core/presets";
import { DESIGN_STYLES } from "@/core/schema";
import type { ThemeCollection } from "@/core/presets";
import type { FontPairId, OklchColor } from "@/core/schema";
import s from "./PresetsGallery.module.css";
import { useSiteStore } from "../store/useSiteStore";
import { themeBackgroundCss } from "@/core/render/renderTheme";
import { useUiLanguage } from "@/i18n/UiLanguageProvider";

const FILTERS: ("All" | ThemeCollection)[] = ["All", "Light", "Dark", "Expressive", "Minimal"];
const PREVIEW_FONTS: Record<FontPairId, string> = {
  "space-grotesk+inter": "Arial, sans-serif",
  "newsreader+source-serif": "Georgia, serif",
  "space-mono+ibm-plex-mono": "'Courier New', monospace",
  "fraunces+dm-sans": "'Trebuchet MS', sans-serif",
  "readex-pro+ibm-plex-sans-arabic": "Arial, sans-serif",
};

export function PresetsGallery() {
  const { t: translate } = useUiLanguage();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const updateTheme = useSiteStore((st) => st.updateTheme);
  const currentTheme = useSiteStore((st) => st.schema.theme);
  const visibleThemes = filter === "All" ? PRESET_THEMES : PRESET_THEMES.filter((theme) => theme.collection === filter);

  function applyPreset(preset: PresetTheme) {
    // We update all theme tokens at once
    updateTheme((t) => {
      Object.assign(t, preset.theme);
    });
  }

  function formatOklch(c: OklchColor) {
    return `oklch(${c.l} ${c.c} ${c.h})`;
  }

  return (
    <div className={s.wrapper}>
      <p className={s.heading}>{translate("Choose a look")} <span>{visibleThemes.length} {translate("of")} {PRESET_THEMES.length} {translate("designs")}</span></p>
      <div className={s.filters} role="group" aria-label={translate("Filter designs")}>
        {FILTERS.map((item) => <button key={item} className={filter === item ? s.activeFilter : ""} aria-pressed={filter === item} onClick={() => setFilter(item)}>{translate(item)}</button>)}
      </div>
      <div className={s.grid}>
        {visibleThemes.map((preset) => {
          const t = preset.theme;
          const bg = formatOklch(t.background);
          const fg = formatOklch(t.ink);
          const accent = formatOklch(t.accent);
          const surface = formatOklch(t.surface);
          const previewFont = PREVIEW_FONTS[t.fontPair];
          const previewBackground = themeBackgroundCss(t.backgroundStyle, bg, accent, surface);
          
          // A rough heuristic to see if the current theme matches this preset (mostly checking background & template)
          const isActive = currentTheme.templateId === t.templateId && currentTheme.fontPair === t.fontPair &&
            currentTheme.designStyle === t.designStyle &&
            currentTheme.radiusBase === t.radiusBase && currentTheme.spacingDensity === t.spacingDensity && currentTheme.backgroundStyle === t.backgroundStyle &&
            (["accent", "background", "surface", "ink", "inkSoft"] as const).every((key) =>
              currentTheme[key].l === t[key].l && currentTheme[key].c === t[key].c && currentTheme[key].h === t[key].h);

          return (
            <button
              key={preset.id}
              className={`${s.card} ${isActive ? s.active : ""}`}
              onClick={() => applyPreset(preset)}
              aria-label={`${translate("Apply")} ${preset.name} ${translate("theme")}`}
              aria-pressed={isActive}
            >
              <div className={s.preview} data-template={t.templateId} data-design={t.designStyle} style={{ background: previewBackground, color: fg, borderColor: `color-mix(in srgb, ${fg} 16%, transparent)`, fontFamily: previewFont }}>
                <div className={s.previewNav}><span className={s.previewBrand}><i style={{ background: accent }} />folio</span><span className={s.previewNavItems}><i /><i /><i /></span></div>
                <div className={s.previewHero}>
                  <span className={s.previewEyebrow} style={{ color: accent }}>INDEPENDENT STUDIO</span>
                  <div className={s.previewHeading} style={{ color: fg }}>Make it<br />matter<span style={{ color: accent }}>.</span></div>
                  <div className={s.previewCopy}><i style={{ background: `color-mix(in srgb, ${fg} 48%, transparent)` }} /><i style={{ background: `color-mix(in srgb, ${fg} 25%, transparent)` }} /></div>
                  <span className={s.previewCta} style={{ background: accent, color: bg }}>Explore work <b aria-hidden="true">↗</b></span>
                </div>
                <div className={s.previewWork}>
                  <div style={{ background: `linear-gradient(140deg, color-mix(in srgb, ${accent} 58%, ${surface}), ${surface})`, borderColor: `color-mix(in srgb, ${fg} 10%, transparent)` }}><i /><i /></div>
                  <div style={{ background: `linear-gradient(140deg, ${surface}, color-mix(in srgb, ${accent} 42%, ${surface}))`, borderColor: `color-mix(in srgb, ${fg} 10%, transparent)` }}><i /><i /></div>
                </div>
              </div>
              <div className={s.meta}>
                <span className={s.name}>{preset.name}</span>
                <span className={s.fontName}>{t.fontPair.replace("+", " + ")}</span>
                <span className={s.template}>{DESIGN_STYLES.find((style) => style.id === t.designStyle)?.label ?? preset.collection}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
