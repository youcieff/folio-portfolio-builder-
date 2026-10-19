"use client";

import { useEffect, useState } from "react";
import { useAutosave } from "./hooks/useAutosave";
import { useSiteStore } from "./store/useSiteStore";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useViewport } from "./hooks/useViewport";
import { TopBar } from "./components/TopBar";
import { BlocksSidebar } from "./components/BlocksSidebar";
import { Canvas } from "./components/Canvas";
import { Inspector } from "./components/Inspector";
import { ThemeEditor } from "./components/ThemeEditor";
import { QualityCheck } from "./components/QualityCheck";
import { AIGenerator } from "./components/AIGenerator";
import { generateExportHtml } from "./export/generateHtml";
import { parseSite } from "@/core/schema";
import { safeHref } from "@/core/render/escape";
import { useUiLanguage } from "@/i18n/UiLanguageProvider";
import styles from "./EditorApp.module.css";

export function EditorApp() {
  const { t } = useUiLanguage();
  // Bind global effects
  const saveStatus = useAutosave();
  useKeyboardShortcuts();
  const [clientReady, setClientReady] = useState(false);
  useEffect(() => setClientReady(true), []);
  
  const [showAI, setShowAI] = useState(false);
  const [exportWarnings, setExportWarnings] = useState<string[] | null>(null);
  const [rightTab, setRightTab] = useState<"edit" | "design" | "review">("edit");
  const { viewport, canvasWidth, setViewport } = useViewport();

  if (!clientReady) return <main className={styles.bootScreen} role="status" aria-label="Loading Folio editor"><span>folio<span>.</span></span><i /></main>;

  // Export flow: Generate standalone HTML and trigger download
  function handleExport(force = false) {
    const schema = useSiteStore.getState().schema;
    const warnings = collectExportWarnings(schema);
    if (!force && warnings.length) {
      setExportWarnings(warnings.map((warning) => t(warning)));
      setRightTab("review");
      return;
    }
    const html = generateExportHtml(schema);
    
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeFileName(schema.metaTitle)}.html`;
    a.click();
    
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setExportWarnings(null);
  }

  function handleSaveBackup() {
    const schema = useSiteStore.getState().schema;
    downloadFile(JSON.stringify(schema, null, 2), `${safeFileName(schema.metaTitle)}.folio.json`, "application/json;charset=utf-8");
  }

  async function handleLoadBackup(file: File): Promise<string | null> {
    try {
      const imported = parseSite(JSON.parse(await file.text()));
      if (!imported) return "This file is not a valid Folio project backup.";
      if (useSiteStore.getState().schema.blocks.length && !window.confirm("Replace the current portfolio with this backup? Your current work will be replaced.")) return null;
      useSiteStore.getState().setSchema(imported);
      useSiteStore.getState().selectBlock(imported.blocks[0]?.id ?? null);
      return "Project backup restored.";
    } catch {
      return "Could not read this file. Choose a valid .folio.json backup.";
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        width: "100%",
        minWidth: 0,
        overflow: "hidden",
        background: "var(--paper)",
      }}
    >
      <TopBar
        viewport={viewport}
        onViewport={setViewport}
        onExport={handleExport}
        onSaveBackup={handleSaveBackup}
        onLoadBackup={handleLoadBackup}
        onAIGenerate={() => setShowAI(true)}
        saveStatus={saveStatus}
      />
      <div className={styles.workspace}>
        <BlocksSidebar onEdit={() => setRightTab("edit")} />
        <Canvas canvasWidth={canvasWidth} onEdit={() => setRightTab("edit")} />
        <aside className={styles.rightPanel}>
          <div className={styles.tabs} role="tablist" aria-label={t("Editor panels")}>
            <button className={rightTab === "edit" ? styles.activeTab : ""} role="tab" aria-selected={rightTab === "edit"} onClick={() => setRightTab("edit")}>{t("Edit content")}</button>
            <button className={rightTab === "design" ? styles.activeTab : ""} role="tab" aria-selected={rightTab === "design"} onClick={() => setRightTab("design")}>{t("Design")}</button>
            <button className={rightTab === "review" ? styles.activeTab : ""} role="tab" aria-selected={rightTab === "review"} onClick={() => setRightTab("review")}>{t("Review")}</button>
          </div>
          <div className={styles.panelBody}>
            {rightTab === "edit" ? <Inspector /> : rightTab === "design" ? <ThemeEditor /> : <QualityCheck onEdit={() => setRightTab("edit")} />}
          </div>
        </aside>
      </div>
      {showAI && <AIGenerator onClose={() => setShowAI(false)} />}
      {exportWarnings && <div className={styles.exportOverlay} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setExportWarnings(null); }}>
        <section className={styles.exportDialog} role="dialog" aria-modal="true" aria-labelledby="export-title">
          <p className={styles.exportEyebrow}>{t("READY TO PUBLISH?")}</p>
          <h2 id="export-title">{t("A few details could make this portfolio stronger")}</h2>
          <p>{t("Nothing is blocking your export. You can download now or review these suggestions first.")}</p>
          <ul>{exportWarnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
          <div className={styles.exportActions}>
            <button type="button" onClick={() => setExportWarnings(null)}>{t("Keep editing")}</button>
            <button type="button" onClick={() => { setExportWarnings(null); setRightTab("review"); }}>{t("Open review")}</button>
            <button type="button" className={styles.exportPrimary} onClick={() => handleExport(true)}>{t("Export anyway")}</button>
          </div>
        </section>
      </div>}
    </div>
  );
}

function collectExportWarnings(schema: ReturnType<typeof useSiteStore.getState>["schema"]): string[] {
  const warnings: string[] = [];
  const hero = schema.blocks.find((block) => block.type === "hero");
  const about = schema.blocks.find((block) => block.type === "about");
  const projects = schema.blocks.find((block) => block.type === "projects");
  const contact = schema.blocks.find((block) => block.type === "contact");
  if (!hero || hero.type !== "hero" || !hero.heading.trim() || hero.heading.trim().toLowerCase() === "your name") warnings.push("Add your name or a clear headline.");
  if (!hero || hero.type !== "hero" || !hero.subline.trim()) warnings.push("Add a short line about what you do.");
  if (!about || about.type !== "about" || about.body.trim().length < 24) warnings.push("Add a little more context in your About section.");
  if (!projects || projects.type !== "projects" || !projects.projects.some((project) => project.name.trim() && project.description.trim())) warnings.push("Add at least one project with a short description.");
  if (!contact || contact.type !== "contact" || !contact.links.some((link) => isValidContactHref(link.platform, link.href))) warnings.push("Add an email or social link so visitors can reach you.");
  const invalidLinks = schema.blocks.some((block) =>
    (block.type === "hero" && Boolean(block.ctaHref.trim()) && !safeHref(block.ctaHref)) ||
    (block.type === "projects" && block.projects.some((project) => [project.liveUrl, project.repoUrl].some((url) => Boolean(url.trim()) && !safeHref(url)))) ||
    (block.type === "contact" && block.links.some((link) => Boolean(link.href.trim()) && !isValidContactHref(link.platform, link.href)))
  );
  if (invalidLinks) warnings.push("Check a link that does not look like a web address, email, or phone link.");
  return warnings;
}

function isValidContactHref(platform: string, href: string): boolean {
  if (!href.trim()) return false;
  const kind = platform.toLowerCase();
  if (kind === "email") {
    const email = href.replace(/^mailto:/i, "").trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  if (kind === "phone") {
    const phone = href.replace(/^tel:/i, "").trim();
    return /^[+()0-9\s.-]{7,}$/.test(phone) && (phone.match(/\d/g)?.length ?? 0) >= 7;
  }
  return Boolean(safeHref(href));
}

function safeFileName(title: string): string {
  const cleaned = title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  return cleaned || "my-portfolio";
}

function downloadFile(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
