"use client";

import { useSiteStore } from "../store/useSiteStore";
import { DESIGN_STYLES, type ThemeTokens, type TemplateId, type FontPairId, type DesignStyleId } from "@/core/schema";
import { hexToOklch, oklchToHex } from "@/core/utils/color";
import { BACKGROUND_STYLES, themeBackgroundCss } from "@/core/render/renderTheme";
import { PresetsGallery } from "./PresetsGallery";
import { useUiLanguage } from "@/i18n/UiLanguageProvider";
import s from "./blocks/fields.module.css";

const TEMPLATE_FOR_FAMILY: Record<(typeof DESIGN_STYLES)[number]["family"], TemplateId> = {
  Editorial: "editorial", Atmosphere: "midnight-glass", Graphic: "brutalist", Digital: "terminal",
};

const FONTS: { id: FontPairId; label: string }[] = [
  { id: "space-grotesk+inter",           label: "Space Grotesk + Inter" },
  { id: "newsreader+source-serif",       label: "Newsreader + Source Serif" },
  { id: "space-mono+ibm-plex-mono",      label: "Space Mono + IBM Plex Mono" },
  { id: "fraunces+dm-sans",              label: "Fraunces + DM Sans" },
  { id: "readex-pro+ibm-plex-sans-arabic", label: "Readex Pro (Arabic)" },
];

const NAVIGATION_STYLES = [
  ["glass", "Atmosphere glass"], ["pill", "Color pills"], ["minimal", "Quiet minimal"],
  ["underline", "Animated underline"], ["solid", "Solid accent bar"], ["floating", "Floating dock"],
  ["gradient", "Aurora gradient"], ["outline", "Outlined capsule"], ["editorial", "Editorial rules"],
  ["command", "Command terminal"], ["segmented", "Segmented tabs"],
] as const;


const DIVIDERS = [
  ["auto", "Match my design"], ["glow", "Soft glow"], ["diamond", "Center diamond"],
  ["double", "Double line"], ["dashed", "Dashes"], ["none", "No divider"],
] as const;

const NAV_STYLE_LABELS: Record<(typeof NAVIGATION_STYLES)[number][0], string> = {
  glass: "Atmosphere glass", pill: "Color pills", minimal: "Quiet minimal", underline: "Animated underline",
  solid: "Solid accent bar", floating: "Floating dock", gradient: "Aurora gradient", outline: "Outlined capsule",
  editorial: "Editorial rules", command: "Command terminal", segmented: "Segmented tabs",
};

export function ThemeEditor() {
  const { t } = useUiLanguage();
  const schema = useSiteStore((st: any) => st.schema) as typeof import("@/core/schema").SiteSchemaV1._type;
  const theme  = schema.theme;
  const update = useSiteStore((st: any) => st.updateTheme) as (updater: (theme: ThemeTokens) => void) => void;
  const updateMeta = useSiteStore((st) => st.updateMeta);
  const updateExperience = useSiteStore((st) => st.updateExperience);
  const sectionForBlock = { about: "about", projects: "projects", skills: "skills", timeline: "experience", contact: "contact" } as const;
  const navDisplayLabels = { about: "About", projects: "Work", skills: "Skills", experience: "Experience", contact: "Contact" } as const;
  const navSeen = new Set<string>();
  const navSections = schema.blocks.flatMap((block) => {
    const section = sectionForBlock[block.type as keyof typeof sectionForBlock];
    if (!section || navSeen.has(section)) return [];
    navSeen.add(section);
    return [{ section, heading: block.heading, displayLabel: navDisplayLabels[section] }];
  });

  function updateNavigationItem(section: typeof navSections[number]["section"], patch: { label?: string; enabled?: boolean }) {
    const items = schema.experience.navigationItems.length
      ? schema.experience.navigationItems.map((item) => ({ ...item }))
      : navSections.map((item) => ({ section: item.section, label: "", enabled: true }));
    const existing = items.find((item) => item.section === section);
    if (existing) Object.assign(existing, patch);
    else items.push({ section, label: patch.label ?? "", enabled: patch.enabled ?? true });
    updateExperience({ navigationItems: items });
  }

  return (
    <div className={s.panel}>
      <div>
        <p className={s.panelTitle} style={{ color: "#17251f", fontFamily: "var(--font-ui)", fontSize: 16, letterSpacing: "-.02em", textTransform: "none", borderBlockEnd: 0, paddingBlockEnd: 0 }}>{t("Make it yours")}</p>
        <p style={{ fontSize: 12, color: "#65716a", marginTop: 5 }}>{t("Pick a look. You can change it any time.")}</p>
      </div>

      <PresetsGallery />

      <fieldset className={s.gradientEditor}>
        <legend>{t("20 gradient looks + solid")}</legend>
        <p className={s.gradientHint}>{t("Pick a look, then adjust the colors below. Page background colors the hero; accent color drives the glow and highlights.")}</p>
        <button type="button" className={`${s.gradientChoice} ${theme.backgroundStyle === "solid" ? s.gradientChoiceActive : ""}`} aria-label={t("Use a solid background")} aria-pressed={theme.backgroundStyle === "solid"} onClick={() => update((t: ThemeTokens) => { t.backgroundStyle = "solid"; })}>
          <span className={s.gradientSwatch} style={{ background: oklchToHex(theme.background) }} />
          <span className={s.gradientLabel}>{t("Solid page")}</span>
          {theme.backgroundStyle === "solid" && <span className={s.gradientCheck} aria-hidden="true">✓</span>}
        </button>
        <div className={s.gradientGrid} role="group" aria-label={t("Background gradient styles")}>
          {BACKGROUND_STYLES.map(({ id, label }) => {
            const selected = theme.backgroundStyle === id;
            const preview = themeBackgroundCss(id, oklchToHex(theme.background), oklchToHex(theme.accent), oklchToHex(theme.surface));
            return <button key={id} type="button" className={`${s.gradientChoice} ${selected ? s.gradientChoiceActive : ""}`} aria-label={`Use ${label} gradient`} aria-pressed={selected} onClick={() => update((t: ThemeTokens) => { t.backgroundStyle = id; })}>
              <span className={s.gradientSwatch} style={{ background: preview }} />
              <span className={s.gradientLabel}>{label}</span>
              {selected && <span className={s.gradientCheck} aria-hidden="true">✓</span>}
            </button>;
          })}
        </div>
        <div className={s.gradientColors}>
          {([["background", "Page background"], ["surface", "Surface tone"], ["accent", "Accent color"]] as const).map(([key, label]) => <label key={key} className={s.gradientColor}>
            <input type="color" aria-label={`${label} gradient color`} value={oklchToHex(theme[key])} onChange={(e) => update((t: ThemeTokens) => { t[key] = hexToOklch(e.target.value); })} />
            <span>{label}</span><code>{oklchToHex(theme[key]).toUpperCase()}</code>
          </label>)}
        </div>
      </fieldset>

      <section style={{ display: "grid", gap: 12, borderTop: "1px solid #e5e0d6", paddingTop: 14 }}>
        <div><p className={s.subhead}>{t("Website experience")}</p><p style={{ color: "#65716a", fontSize: 11, marginTop: 4 }}>{t("Small finishing touches across the whole portfolio.")}</p></div>
        <label className={s.checkbox}><input type="checkbox" checked={schema.experience.navigation} onChange={(e) => updateExperience({ navigation: e.target.checked })} /><span>{t("Show section navigation")}</span></label>
        <label className={s.checkbox}><input type="checkbox" checked={schema.experience.stickyNavigation} disabled={!schema.experience.navigation} onChange={(e) => updateExperience({ stickyNavigation: e.target.checked })} /><span>{t("Keep navigation visible while scrolling")}</span></label>
        <div className={s.field}>
          <span className={s.label}>{t("Navigation theme")} ? {NAVIGATION_STYLES.length} {t("styles")}</span>
          <div className={s.navStyleGrid} role="group" aria-label={t("Navigation theme")}>
            {NAVIGATION_STYLES.map(([id]) => <button key={id} type="button" className={`${s.navStyleChoice} ${schema.experience.navigationStyle === id ? s.navStyleChoiceActive : ""}`} onClick={() => updateExperience({ navigationStyle: id })} aria-pressed={schema.experience.navigationStyle === id}>
              <span className={s.navStyleSample} data-style={id}><i /><i /><i /></span><span>{t(NAV_STYLE_LABELS[id])}</span>
            </button>)}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
          <div className={s.field}><label className={s.label} htmlFor="navigation-layout">{t("Menu alignment")}</label><select id="navigation-layout" value={schema.experience.navigationLayout} onChange={(e) => updateExperience({ navigationLayout: e.target.value as typeof schema.experience.navigationLayout })}><option value="left">{t("Next to name")}</option><option value="center">{t("Centered")}</option><option value="right">{t("Right side")}</option></select></div>
          <div className={s.field}><label className={s.label} htmlFor="navigation-size">{t("Menu scale")}</label><select id="navigation-size" value={schema.experience.navigationSize} onChange={(e) => updateExperience({ navigationSize: e.target.value as typeof schema.experience.navigationSize })}><option value="compact">{t("Compact")}</option><option value="standard">{t("Standard")}</option><option value="large">{t("Large")}</option></select></div>
        </div>
        <label className={s.checkbox}><input type="checkbox" checked={schema.experience.navigationShowBrand} disabled={!schema.experience.navigation} onChange={(e) => updateExperience({ navigationShowBrand: e.target.checked })} /><span>{t("Show name / logo")}</span></label>
        {schema.experience.navigationShowBrand && <div className={s.field}><label className={s.label} htmlFor="navigation-brand">{t("Navigation name")}</label><input id="navigation-brand" value={schema.experience.navigationBrandLabel} maxLength={60} placeholder={t("Use your portfolio name")} onChange={(e) => updateExperience({ navigationBrandLabel: e.target.value })} /></div>}
        <div className={s.field}>
          <span className={s.label}>{t("Choose and rename menu links")}</span>
          {navSections.length ? <div style={{ display: "grid", gap: 7 }}>
            {navSections.map(({ section, displayLabel }) => {
              const item = schema.experience.navigationItems.find((entry) => entry.section === section);
              const enabled = item?.enabled ?? true;
              return <div key={section} style={{ display: "grid", gridTemplateColumns: "22px minmax(0, 1fr)", alignItems: "center", gap: 7, padding: "7px 9px", border: "1px solid #e5e0d6", borderRadius: 9 }}>
                <input type="checkbox" aria-label={`${t("Show in navigation")}: ${t(displayLabel)}`} checked={enabled} onChange={(e) => updateNavigationItem(section, { enabled: e.target.checked })} style={{ width: 16, height: 16, accentColor: "#bb603e" }} />
                <input aria-label={`${t("Navigation label")}: ${t(displayLabel)}`} value={item?.label ?? ""} maxLength={40} placeholder={t(displayLabel)} disabled={!enabled} onChange={(e) => updateNavigationItem(section, { label: e.target.value })} style={{ border: 0, background: "transparent", padding: "5px 2px", boxShadow: "none" }} />
              </div>;
            })}
          </div> : <p style={{ color: "#65716a", fontSize: 11 }}>{t("Add a section to make it available in your menu.")}</p>}
          <p style={{ color: "#65716a", fontSize: 10 }}>{t("Menu order follows the section order on the left.")}</p>
        </div>
        <div className={s.field}><label className={s.label} htmlFor="motion-style">{t("Motion effects")}</label><select id="motion-style" value={schema.experience.motion} onChange={(e) => updateExperience({ motion: e.target.value as typeof schema.experience.motion })}><option value="none">{t("No motion")}</option><option value="subtle">{t("Subtle and smooth")}</option><option value="expressive">{t("More expressive")}</option></select></div>
        <div className={s.motionSample} data-motion={schema.experience.motion} aria-label={`${t("Motion preview")}: ${t(schema.experience.motion)}`}><i /><i /><i /><span>{t("Scroll reveal preview")}</span></div>
        <div className={s.field}>
          <span className={s.label}>{t("Section separators")}</span>
          <div className={s.dividerGrid} role="group" aria-label={t("Section separators")}>
            {DIVIDERS.map(([id, label]) => <button key={id} type="button" className={`${s.dividerChoice} ${schema.experience.sectionDivider === id ? s.dividerChoiceActive : ""}`} onClick={() => updateExperience({ sectionDivider: id })} aria-pressed={schema.experience.sectionDivider === id}>
              <span className={s.dividerSample} data-divider={id}><i /></span><span>{t(label)}</span>
            </button>)}
          </div>
          <p style={{ margin: 0, color: "#65716a", fontSize: 10 }}>{t("Choose how each content section connects while scrolling.")}</p>
        </div>
        <label className={s.checkbox}><input type="checkbox" checked={schema.experience.scrollProgress} onChange={(e) => updateExperience({ scrollProgress: e.target.checked })} /><span>{t("Show page reading progress")}</span></label>
        <label className={s.checkbox}><input type="checkbox" checked={schema.experience.backToTop} onChange={(e) => updateExperience({ backToTop: e.target.checked })} /><span>{t("Add a back-to-top button")}</span></label>
        <label className={s.checkbox}><input type="checkbox" checked={schema.experience.imageLightbox} onChange={(e) => updateExperience({ imageLightbox: e.target.checked })} /><span>{t("Open portfolio images in a viewer")}</span></label>
        <label className={s.checkbox}><input type="checkbox" checked={schema.experience.showFooter} onChange={(e) => updateExperience({ showFooter: e.target.checked })} /><span>{t("Show closing footer")}</span></label>
      </section>

      <details style={{ borderTop: "1px solid #e5e0d6", paddingTop: 14 }}>
        <summary style={{ color: "#6d687e", fontSize: 12, cursor: "pointer" }}>{t("Custom colors, layout and type")}</summary>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
          <div className={s.themeSample} style={{ background: themeBackgroundCss(theme.backgroundStyle, oklchToHex(theme.background), oklchToHex(theme.accent), oklchToHex(theme.surface)), color: oklchToHex(theme.ink), borderColor: `color-mix(in srgb, ${oklchToHex(theme.accent)} 46%, transparent)`, borderRadius: `${theme.radiusBase}px`, padding: `${theme.spacingDensity === "compact" ? 12 : theme.spacingDensity === "airy" ? 24 : 18}px`, fontFamily: theme.fontPair.includes("mono") ? "monospace" : /newsreader|fraunces/.test(theme.fontPair) ? "Georgia, serif" : "system-ui, sans-serif" }}>
            <span style={{ color: oklchToHex(theme.accent) }}>LIVE STYLE SAMPLE Â· {theme.templateId}</span><strong>Make it feel like you.</strong><i style={{ color: oklchToHex(theme.inkSoft) }}>{theme.fontPair.replace(/\+/g, " + ")} Â· {theme.spacingDensity} spacing</i>
          </div>
          <div className={s.field}>
            <label className={s.label} htmlFor="site-language">{t("Portfolio content language")}</label>
            <select id="site-language" value={schema.lang} onChange={(e) => updateMeta({ lang: e.target.value as typeof schema.lang })}>
              <option value="en">English · left to right</option><option value="ar">Arabic · right to left</option>
            </select>
          </div>
          <div className={s.field}>
            <span className={s.label}>{t("Text color")}</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {([
                ["ink", "Text"],
              ] as const).map(([key, label]) => <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 9px", border: "1px solid #e5e0d6", borderRadius: 9, color: "#526158", fontSize: 11 }}>
                <input type="color" aria-label={`${label} color`} value={oklchToHex(theme[key])} onChange={(e) => update((t: ThemeTokens) => { t[key] = hexToOklch(e.target.value); })} style={{ width: 27, height: 27, padding: 2, border: 0, background: "transparent", cursor: "pointer" }} />
                {label}
              </label>)}
            </div>
          </div>
          <div className={s.field}>
            <label className={s.label} htmlFor="theme-corners">Corner style</label>
            <input id="theme-corners" type="range" min="0" max="24" value={theme.radiusBase} onChange={(e) => update((t: ThemeTokens) => { t.radiusBase = Number(e.target.value); })} />
            <div style={{ display: "flex", justifyContent: "space-between", color: "#89859a", fontSize: 10 }}><span>{t("Sharp")}</span><span>{t("Soft")}</span><span>{t("Round")}</span></div>
          </div>
          <div className={s.field}>
            <label className={s.label}>{t("Page spacing")}</label>
            <select value={theme.spacingDensity} onChange={(e) => update((t: ThemeTokens) => { t.spacingDensity = e.target.value as ThemeTokens["spacingDensity"]; })}>
              <option value="compact">{t("Compact")}</option><option value="normal">{t("Balanced")}</option><option value="airy">{t("Airy")}</option>
            </select>
          </div>
          <div className={s.field}>
            <span className={s.label}>{t("Portfolio design")} ? {DESIGN_STYLES.length} {t("styles")}</span>
            <div className={s.designStyleGrid} role="group" aria-label={t("Portfolio design")}>
              {DESIGN_STYLES.map((design) => <button key={design.id} type="button" className={`${s.designStyleChoice} ${theme.designStyle === design.id ? s.designStyleChoiceActive : ""}`} onClick={() => update((next: ThemeTokens) => { next.designStyle = design.id as DesignStyleId; next.templateId = TEMPLATE_FOR_FAMILY[design.family]; })} aria-pressed={theme.designStyle === design.id}>
                <i className={s.designStyleMark} data-family={design.family} aria-hidden="true" /><span><strong>{t(design.label)}</strong><small>{t(design.family)}</small></span>
              </button>)}
            </div>
          </div>
          <div className={s.field}>
            <label className={s.label}>{t("Typography")}</label>
            <select value={theme.fontPair} onChange={(e) => update((t: ThemeTokens) => { t.fontPair = e.target.value as FontPairId; })}>
              {FONTS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </div>
        </div>
      </details>

      <details style={{ borderTop: "1px solid #ebe8f2", paddingTop: 14 }}>
        <summary style={{ color: "#6d687e", fontSize: 12, cursor: "pointer" }}>{t("Website title and description")}</summary>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
          <div className={s.field}>
            <label className={s.label}>Website title</label>
            <input value={schema.metaTitle} maxLength={120} onChange={(e) => updateMeta({ title: e.target.value })} placeholder="Your name or portfolio title" />
          </div>
          <div className={s.field}>
            <label className={s.label}>Description</label>
            <textarea rows={3} value={schema.metaDesc} maxLength={300} onChange={(e) => updateMeta({ desc: e.target.value })} placeholder="A short description of your work" />
          </div>
        </div>
      </details>
    </div>
  );
}
