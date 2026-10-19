"use client";

import { useState } from "react";
import { useSiteStore } from "../store/useSiteStore";
import type { Block } from "@/core/schema";
import { generateId } from "@/core/utils/id";
import styles from "./BlocksSidebar.module.css";
import { useUiLanguage } from "@/i18n/UiLanguageProvider";

const BLOCK_DEFS = [
  { type: "hero" as const, label: "Introduction", desc: "Your name and what you do" },
  { type: "about" as const, label: "About me", desc: "A short bio" },
  { type: "projects" as const, label: "Projects", desc: "Show the work you love" },
  { type: "skills" as const, label: "Skills", desc: "What you bring to the table" },
  { type: "timeline" as const, label: "Experience", desc: "Your career and education" },
  { type: "contact" as const, label: "Contact", desc: "Make it easy to reach you" },
];

function makeDefaultBlock(type: Block["type"], lang: "en" | "ar"): Block {
  const id = generateId();
  const defaults = lang === "ar"
    ? { hero: "اسمك", about: "نبذة عني", projects: "أعمال مختارة", skills: "مهاراتي", timeline: "الخبرات", contact: "لنتواصل" }
    : { hero: "Your name", about: "About", projects: "Selected work", skills: "Skills", timeline: "Experience", contact: "Get in touch" };
  switch (type) {
    case "hero": return { id, type, heading: defaults.hero, subline: "", eyebrow: "", ctaLabel: "", ctaHref: "", avatarAlt: "", avatarSrc: "", backgroundSrc: "", layout: "split", avatarShape: "rounded", avatarPosition: "center", backgroundPosition: "center", typewriter: false };
    case "about": return { id, type, heading: defaults.about, body: "", image: "", imageAlt: "", imagePosition: "center", facts: [] };
    case "projects": return { id, type, heading: defaults.projects, layout: "grid", projects: [] };
    case "skills": return { id, type, heading: defaults.skills, groups: [] };
    case "timeline": return { id, type, heading: defaults.timeline, entries: [] };
    case "contact": return { id, type, heading: defaults.contact, note: "", links: [] };
  }
}

const LABELS: Record<Block["type"], string> = {
  hero: "Introduction", about: "About me", projects: "Projects",
  skills: "Skills", timeline: "Experience", contact: "Contact",
};

export function BlocksSidebar({ onEdit }: { onEdit: () => void }) {
  const { t } = useUiLanguage();
  const portfolioLanguage = useSiteStore((s) => s.schema.lang);
  const [showChoices, setShowChoices] = useState(false);
  const blocks = useSiteStore((s) => s.schema.blocks);
  const addBlock = useSiteStore((s) => s.addBlock);
  const selectBlock = useSiteStore((s) => s.selectBlock);
  const removeBlock = useSiteStore((s) => s.removeBlock);
  const duplicateBlock = useSiteStore((s) => s.duplicateBlock);
  const reorderBlocks = useSiteStore((s) => s.reorderBlocks);
  const selected = useSiteStore((s) => s.selectedBlockId);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  function startPortfolio() {
    // Use the same setup flow as the prominent button in the canvas. The old
    // action silently inserted empty blocks, which looked like a broken button.
    const form = document.getElementById("quick-setup-form");
    if (form instanceof HTMLFormElement) form.requestSubmit();
  }

  function handleAdd(type: Block["type"]) {
    const block = makeDefaultBlock(type, portfolioLanguage);
    addBlock(block);
    selectBlock(block.id);
    onEdit();
    setShowChoices(false);
  }

  function moveSection(index: number, destination: number) {
    if (destination < 0 || destination >= blocks.length) return;
    reorderBlocks(index, destination);
  }

  function copySection(id: string, index: number) {
    duplicateBlock(id);
    const copy = useSiteStore.getState().schema.blocks[index + 1];
    if (copy) selectBlock(copy.id);
    onEdit();
  }

  function deleteSection(id: string, index: number) {
    removeBlock(id);
    const remaining = useSiteStore.getState().schema.blocks;
    selectBlock(remaining[Math.min(index, remaining.length - 1)]?.id ?? null);
    onEdit();
  }

  return (
    <aside className={styles.sidebar} aria-label={t("Portfolio sections")}>
      <div className={styles.headingRow}>
        <div><p className={styles.sidebarLabel}>{t("YOUR PORTFOLIO")}</p><span className={styles.sectionCount}>{blocks.length ? `${blocks.length} ${t("sections")}` : t("Let's get started")}</span></div>
      </div>
      {blocks.length > 0 && <ul className={styles.list}>
        {blocks.map((block, index) => <li
          className={styles.blockRow}
          key={block.id}
          draggable
          onDragStart={(event) => { setDraggedIndex(index); event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", String(index)); }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => { event.preventDefault(); const rawIndex = event.dataTransfer.getData("text/plain"); const from = Number(rawIndex); if (rawIndex !== "" && Number.isInteger(from)) moveSection(from, index); setDraggedIndex(null); }}
          onDragEnd={() => setDraggedIndex(null)}
          style={{ opacity: draggedIndex === index ? 0.45 : 1, cursor: "grab" }}
        >
          <button className={`${styles.blockBtn} ${selected === block.id ? styles.selected : ""}`} onClick={() => { selectBlock(block.id); onEdit(); }}>
            <span className={styles.blockIndex}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.blockLabel}>{block.type === "hero" && block.heading ? block.heading : t(LABELS[block.type])}</span>
            <span className={styles.blockDesc}>{t(LABELS[block.type])}</span>
          </button>
          {selected === block.id && <div className={styles.blockTools} aria-label={`${t(LABELS[block.type])} controls`}>
            <button type="button" onClick={() => moveSection(index, index - 1)} disabled={index === 0} aria-label={t("Move section up")} title={t("Move up")}>↑</button>
            <button type="button" onClick={() => moveSection(index, index + 1)} disabled={index === blocks.length - 1} aria-label={t("Move section down")} title={t("Move down")}>↓</button>
            <button type="button" onClick={() => copySection(block.id, index)} aria-label={t("Duplicate section")} title={t("Duplicate")}>＋</button>
            <button type="button" onClick={() => deleteSection(block.id, index)} aria-label={t("Remove section")} title={t("Remove")}>×</button>
          </div>}
        </li>)}
      </ul>}
      {blocks.length === 0 && <p className={styles.firstHint}>{t("One click gives you a complete, ready-to-edit portfolio. Just replace the example text with your own.")}</p>}
      {showChoices && <div className={styles.choices}>
        <p className={styles.choiceTitle}>{t("What would you like to add?")}</p>
        {BLOCK_DEFS.map((def) => <button key={def.type} className={styles.choice} onClick={() => handleAdd(def.type)}><strong>{t(def.label)}</strong><span>{t(def.desc)}</span></button>)}
      </div>}
      <button type="button" className={styles.addSection} onClick={() => blocks.length === 0 ? startPortfolio() : setShowChoices((open) => !open)}>
        {blocks.length === 0 ? t("Build my portfolio →") : showChoices ? t("Close") : t("+ Add a section")}
      </button>
    </aside>
  );
}
