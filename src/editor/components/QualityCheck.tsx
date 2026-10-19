"use client";

import { useSiteStore } from "../store/useSiteStore";
import type { Block } from "@/core/schema";
import { generateId } from "@/core/utils/id";
import styles from "./QualityCheck.module.css";
import { useUiLanguage } from "@/i18n/UiLanguageProvider";

type SectionType = Block["type"];

function createSection(type: SectionType, lang: "en" | "ar"): Block {
  const id = generateId();
  const heading = lang === "ar"
    ? { hero: "اسمك", about: "نبذة عني", projects: "أعمال مختارة", skills: "المهارات", timeline: "الخبرات", contact: "تواصل معي" }
    : { hero: "Your name", about: "About", projects: "Selected work", skills: "Skills", timeline: "Experience", contact: "Get in touch" };
  switch (type) {
    case "hero": return { id, type, heading: heading.hero, subline: "", eyebrow: "", ctaLabel: "", ctaHref: "", avatarAlt: "", avatarSrc: "", backgroundSrc: "", layout: "centered", avatarShape: "rounded", avatarPosition: "center", backgroundPosition: "center", typewriter: false };
    case "about": return { id, type, heading: heading.about, body: "", image: "", imageAlt: "", imagePosition: "center", facts: [] };
    case "projects": return { id, type, heading: heading.projects, layout: "feature", projects: [] };
    case "skills": return { id, type, heading: heading.skills, groups: [] };
    case "timeline": return { id, type, heading: heading.timeline, entries: [] };
    case "contact": return { id, type, heading: heading.contact, note: "", links: [] };
  }
}

export function QualityCheck({ onEdit }: { onEdit: () => void }) {
  const { t, language } = useUiLanguage();
  const blocks = useSiteStore((state) => state.schema.blocks);
  const siteLanguage = useSiteStore((state) => state.schema.lang);
  const addBlock = useSiteStore((state) => state.addBlock);
  const selectBlock = useSiteStore((state) => state.selectBlock);
  const hero = blocks.find((block) => block.type === "hero");
  const about = blocks.find((block) => block.type === "about");
  const projects = blocks.find((block) => block.type === "projects");
  const contact = blocks.find((block) => block.type === "contact");

  const checks = [
    { label: t("Name and role"), detail: t("Make it clear who you are and what you do."), done: hero?.type === "hero" && Boolean(hero.heading.trim() && hero.heading.trim() !== (siteLanguage === "ar" ? "اسمك" : "Your name") && hero.subline.trim()), section: "hero" as const },
    { label: t("A short introduction"), detail: t("Give visitors a little context about your approach."), done: about?.type === "about" && about.body.trim().length >= 24, section: "about" as const },
    { label: t("A featured project"), detail: t("Show at least one project with a useful description."), done: projects?.type === "projects" && projects.projects.some((project) => project.name.trim() && project.description.trim()), section: "projects" as const },
    { label: t("A visual highlight"), detail: t("A portrait or project image makes the page memorable."), done: blocks.some((block) => block.type === "hero" && Boolean(block.avatarSrc || block.backgroundSrc)) || blocks.some((block) => block.type === "about" && Boolean(block.image)) || blocks.some((block) => block.type === "projects" && block.projects.some((project) => Boolean(project.image))), section: "hero" as const },
    { label: t("A way to reach you"), detail: t("Add one working email or social link."), done: contact?.type === "contact" && contact.links.some((link) => link.href.trim()), section: "contact" as const },
  ];
  const completed = checks.filter((item) => item.done).length;
  const score = Math.round((completed / checks.length) * 100);

  function openSection(type: SectionType) {
    const existing = blocks.find((block) => block.type === type);
    if (existing) {
      selectBlock(existing.id);
    } else {
      const section = createSection(type, useSiteStore.getState().schema.lang);
      addBlock(section);
      selectBlock(section.id);
    }
    onEdit();
  }

  return <section className={styles.panel} aria-labelledby="quality-title" lang={language}>
    <div className={styles.header}>
      <div>
        <p className={styles.eyebrow}>FREE · PRIVATE · INSTANT</p>
        <h2 id="quality-title">{t("Portfolio review")}</h2>
        <p className={styles.summary}>{t("A local checklist to help your work make a stronger first impression.")}</p>
      </div>
      <div className={styles.score} style={{ "--score": `${score}%` } as React.CSSProperties} aria-label={`${score}% complete`}><strong>{score}</strong><span>%</span></div>
    </div>

    <div className={styles.progress} role="progressbar" aria-valuemin={0} aria-valuemax={checks.length} aria-valuenow={completed}><span style={{ width: `${score}%` }} /></div>
    <p className={styles.scoreNote}>{completed === checks.length ? t("Your essential details are in place.") : `${completed} ${t("of")} ${checks.length} ${t("portfolio essentials are ready.")}`}</p>

    <ul className={styles.checks}>
      {checks.map((item) => <li key={item.label} className={item.done ? styles.done : ""}>
        <span className={styles.checkIcon} aria-hidden="true">{item.done ? "✓" : "＋"}</span>
        <div className={styles.checkCopy}><strong>{item.label}</strong><span>{item.detail}</span></div>
        <button type="button" onClick={() => openSection(item.section)}>{item.done ? t("Review") : t("Improve")}</button>
      </li>)}
    </ul>

    <p className={styles.privacy}>{t("This review runs in your browser. Your content is not sent anywhere.")}</p>
  </section>;
}
