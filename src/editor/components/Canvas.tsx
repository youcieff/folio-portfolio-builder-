"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSiteStore } from "../store/useSiteStore";
import { renderSite } from "@/core/render/renderSite";
import { createStarterPortfolio } from "@/core/starterPortfolio";
import { PRESET_THEMES } from "@/core/presets";
import { generateId } from "@/core/utils/id";
import { hexToOklch } from "@/core/utils/color";
import styles from "./Canvas.module.css";
import { useUiLanguage } from "@/i18n/UiLanguageProvider";

interface Props { canvasWidth: number | undefined; onEdit?: () => void }

const QUICK_STYLES = [
  { id: "porcelain", name: "Warm editorial", detail: "Soft paper, terracotta, and serif type", color: "#bb7651", preview: "linear-gradient(135deg,#fffaf1 0%,#e9d9c9 52%,#bb7651 100%)" },
  { id: "deep-atlas", name: "Dark modern", detail: "Deep navy with a clean mint accent", color: "#75dfc0", preview: "linear-gradient(135deg,#081422 0%,#172d42 58%,#75dfc0 100%)" },
  { id: "cobalt-pop", name: "Electric studio", detail: "Confident blue with crisp contrast", color: "#6656e8", preview: "linear-gradient(135deg,#f4f2ff 0%,#a7a2ff 55%,#5142dc 100%)" },
  { id: "lilac-studio", name: "Soft creative", detail: "Lilac, airy space, and gentle color", color: "#a77afa", preview: "linear-gradient(135deg,#fff7fc 0%,#e8d8ff 55%,#a77afa 100%)" },
] as const;

const QUICK_SECTIONS = [
  { id: "about", label: "About" }, { id: "projects", label: "My work" },
  { id: "skills", label: "Skills" }, { id: "timeline", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export function Canvas({ canvasWidth, onEdit }: Props) {
  const { t } = useUiLanguage();
  const schema = useSiteStore((s) => s.schema);
  const selectBlock = useSiteStore((s) => s.selectBlock);
  const addBlock = useSiteStore((s) => s.addBlock);
  const updateTheme = useSiteStore((s) => s.updateTheme);
  const updateMeta = useSiteStore((s) => s.updateMeta);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const preserveScrollRef = useRef(0);
  const [previewSchema, setPreviewSchema] = useState(schema);
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [intro, setIntro] = useState("");
  const [firstProject, setFirstProject] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [quickStyle, setQuickStyle] = useState<(typeof QUICK_STYLES)[number]["id"]>("porcelain");
  const [customAccent, setCustomAccent] = useState("#bb603e");
  const [portfolioLanguage, setPortfolioLanguage] = useState<"en" | "ar">("en");
  const [quickSections, setQuickSections] = useState<string[]>(["about", "projects", "contact"]);

  // Keep typing immediate in the inspector while avoiding a full HTML rewrite
  // (and large embedded-image serialization) for every keystroke.
  useEffect(() => {
    const timer = window.setTimeout(() => setPreviewSchema(schema), 180);
    return () => window.clearTimeout(timer);
  }, [schema]);

  const html = useMemo(() => renderSite(previewSchema), [previewSchema]);

  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame) return;
    preserveScrollRef.current = frame.contentWindow?.scrollY ?? 0;
    frame.srcdoc = html;
  }, [html]);

  const restorePreviewScroll = useCallback(() => {
    const frame = iframeRef.current;
    const targetWindow = frame?.contentWindow;
    const targetDocument = frame?.contentDocument;
    if (!targetWindow || !targetDocument) return;
    targetDocument.addEventListener("click", (event) => {
      const clicked = event.target as Element | null;
      const anchor = clicked?.closest<HTMLAnchorElement>('a[href^="#"]');
      const href = anchor?.getAttribute("href");
      if (!href || href.length < 2) return;
      let sectionId = href.slice(1);
      try { sectionId = decodeURIComponent(sectionId); } catch { /* Keep unusual custom IDs literal. */ }
      event.preventDefault();
      const section = targetDocument.getElementById(sectionId);
      if (!section) return;
      section.scrollIntoView({
        behavior: targetWindow.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
    const scrollTop = preserveScrollRef.current;
    targetDocument.documentElement.style.scrollBehavior = "auto";
    targetWindow.scrollTo(0, scrollTop);
    requestAnimationFrame(() => targetWindow.scrollTo(0, scrollTop));
  }, []);

  function addIntroduction() {
    const starter = createStarterPortfolio(portfolioLanguage);
    const hero = starter.find((block) => block.type === "hero");
    if (!hero) return;
    if (hero.type === "hero") {
      hero.heading = name.trim() || "Your name";
      hero.subline = profession.trim();
      const ctaTarget = quickSections.includes("projects") && firstProject.trim() ? "projects" : "";
      hero.ctaLabel = ctaTarget === "projects" ? (portfolioLanguage === "ar" ? "شاهد أعمالي" : "Explore my work") : "";
      hero.ctaHref = ctaTarget ? `#${ctaTarget}` : "";
      hero.layout = "centered";
    }
    const chosen = starter.filter((block) => block.type === "hero" || quickSections.some((section) =>
      section === "about" && block.type === "about" ||
      section === "projects" && block.type === "projects" ||
      section === "skills" && block.type === "skills" ||
      section === "timeline" && block.type === "timeline" ||
      section === "contact" && block.type === "contact"
    ));
    const about = chosen.find((block) => block.type === "about");
    if (about?.type === "about") about.body = intro.trim();
    const projects = chosen.find((block) => block.type === "projects");
    if (projects?.type === "projects" && firstProject.trim()) {
      projects.projects.push({ id: generateId(), name: firstProject.trim(), description: projectDescription.trim(), topics: [], image: "", imageAlt: "", imagePosition: "center", repoUrl: "", liveUrl: projectUrl.trim() });
    }
    chosen.forEach(addBlock);
    updateMeta({ lang: portfolioLanguage });
    const preset = PRESET_THEMES.find((theme) => theme.id === quickStyle);
    if (preset) updateTheme((theme) => { Object.assign(theme, preset.theme); theme.accent = hexToOklch(customAccent); });
    selectBlock(hero.id);
    onEdit?.();
  }

  return <main className={styles.canvasWrap} aria-label="Live portfolio preview">
    {schema.blocks.length === 0 ? <div className={styles.emptyState}>
      <div className={styles.setupIntro}>
        <div className={styles.emptyMark}>?</div>
        <p className={styles.kicker}>{t("FREE PORTFOLIO STUDIO")}</p>
        <h1>{t("Start with a few details.")}<br />{t("Get a polished first draft.")}</h1>
        <p className={styles.emptyCopy}>{t("No account, subscription, or AI key needed. Choose your sections and look; everything stays editable.")}</p>
      </div>
      <form id="quick-setup-form" className={styles.quickForm} onSubmit={(event) => { event.preventDefault(); addIntroduction(); }}>
        <div className={styles.quickFields}>
          <label className={styles.quickField}><span>{t("Your name")} <small>{t("required")}</small></span><input required value={name} onChange={(event) => setName(event.target.value)} maxLength={120} placeholder="e.g. Maya Hassan" autoComplete="name" /></label>
          <label className={styles.quickField}><span>{t("What do you do?")} <small>{t("required")}</small></span><input required value={profession} onChange={(event) => setProfession(event.target.value)} maxLength={160} placeholder="e.g. Photographer, consultant, architect" /></label>
          <label className={styles.quickField + " " + styles.quickFieldWide}><span>{t("One sentence about your work")} <small>{t("optional")}</small></span><textarea value={intro} onChange={(event) => setIntro(event.target.value)} maxLength={240} rows={2} placeholder={t("I create warm, candid portraits for people and brands.")} /></label>
          {quickSections.includes("projects") && <label className={styles.quickField}><span>{t("First project")} <small>{t("optional")}</small></span><input value={firstProject} onChange={(event) => setFirstProject(event.target.value)} maxLength={80} placeholder={t("A project worth showing")} /></label>}
          {quickSections.includes("projects") && <label className={styles.quickField}><span>{t("Project website")} <small>{t("optional")}</small></span><input type="url" value={projectUrl} onChange={(event) => setProjectUrl(event.target.value)} placeholder="https://" /></label>}
          {quickSections.includes("projects") && firstProject.trim() && <label className={styles.quickField + " " + styles.quickFieldWide}><span>{t("What did you make?")} <small>{t("optional")}</small></span><textarea value={projectDescription} onChange={(event) => setProjectDescription(event.target.value)} maxLength={400} rows={2} placeholder={t("A short, clear description of the work and its impact.")} /></label>}
          <label className={styles.quickField}><span>{t("Portfolio site language")}</span><select value={portfolioLanguage} onChange={(event) => setPortfolioLanguage(event.target.value as "en" | "ar")}><option value="en">{t("English")}</option><option value="ar">{t("Arabic")}</option></select></label>
        </div>
        <fieldset className={styles.quickGroup}>
          <legend>{t("Choose a starting style")}</legend>
          <p className={styles.lookHelp}>{t("Each option previews its colors and typography. You can change everything later.")}</p>
          <div className={styles.quickLooks}>{QUICK_STYLES.map((look) => <button key={look.id} type="button" className={quickStyle === look.id ? styles.quickLookActive : styles.quickLook} onClick={() => { setQuickStyle(look.id); setCustomAccent(look.color); }} aria-pressed={quickStyle === look.id}>
            <span className={styles.lookPreview} style={{ background: look.preview }}><b>Aa</b><i /><i /></span>
            <span className={styles.lookCopy}><strong>{t(look.name)}</strong><small>{t(look.detail)}</small><span className={styles.lookPalette}><i style={{ background: look.color }} /><i style={{ background: look.id === "deep-atlas" ? "#081422" : "#fffaf1" }} /><i style={{ background: look.id === "cobalt-pop" ? "#5142dc" : look.id === "lilac-studio" ? "#a77afa" : "#8fa883" }} /></span></span>
            {quickStyle === look.id && <span className={styles.lookSelected}>{t("Selected")}</span>}
          </button>)}</div>
          <label className={styles.customAccent}><span><strong>{t("Make it yours")}</strong><small>{t("Choose any accent color. You can enter the editor’s full color controls later.")}</small></span><span className={styles.accentPicker}><i style={{ background: customAccent }} /><input type="color" aria-label={t("Choose any accent color")} value={customAccent} onChange={(event) => setCustomAccent(event.target.value)} /><code>{customAccent.toUpperCase()}</code></span></label>
        </fieldset>
        <fieldset className={styles.quickGroup}>
          <legend>{t("Choose your sections")}</legend>
          <div className={styles.quickSections}>{QUICK_SECTIONS.map((section) => <label key={section.id}><input type="checkbox" checked={quickSections.includes(section.id)} onChange={(event) => setQuickSections((current) => event.target.checked ? [...current, section.id] : current.filter((item) => item !== section.id))} /><span>{t(section.label)}</span></label>)}</div>
        </fieldset>
        <button className={styles.startButton} type="submit">{t("Create my free draft")} <span aria-hidden>?</span></button>
      </form>
    </div> : <div className={styles.previewWrap}>
      <div className={styles.previewCaption}><span>{t("LIVE PREVIEW")}</span><span>{t("Changes appear as you edit")}</span></div>
      <div className={styles.previewScroll}>
        <div className={styles.previewFrame} style={{ width: canvasWidth ? `${canvasWidth}px` : "100%", maxWidth: "100%" }}>
          <iframe ref={iframeRef} title="Live portfolio preview" className={styles.iframe} sandbox="allow-same-origin allow-scripts" onLoad={restorePreviewScroll} />
        </div>
      </div>
    </div>}
  </main>;
}
