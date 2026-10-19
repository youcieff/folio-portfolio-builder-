"use client";

import { useSiteStore } from "../store/useSiteStore";
import type { Block }   from "@/core/schema";
import { HeroEditor }     from "./blocks/HeroEditor";
import { AboutEditor }    from "./blocks/AboutEditor";
import { ProjectsEditor } from "./blocks/ProjectsEditor";
import { SkillsEditor }   from "./blocks/SkillsEditor";
import { TimelineEditor } from "./blocks/TimelineEditor";
import { ContactEditor }  from "./blocks/ContactEditor";
import styles from "./Inspector.module.css";
import { useUiLanguage } from "@/i18n/UiLanguageProvider";

export function Inspector() {
  const { t } = useUiLanguage();
  const selectedId = useSiteStore((s) => s.selectedBlockId);
  const blocks     = useSiteStore((s) => s.schema.blocks);

  const block = blocks.find((b) => b.id === selectedId) ?? null;

  return (
    <aside className={styles.inspector} aria-label={t("Block editor")}>
      {block ? (
        <BlockEditor block={block} />
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyMark} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 5.75A1.75 1.75 0 0 1 6.75 4h10.5A1.75 1.75 0 0 1 19 5.75v12.5A1.75 1.75 0 0 1 17.25 20H6.75A1.75 1.75 0 0 1 5 18.25z" />
              <path d="M8 8h8M8 12h5M8 16h3" />
            </svg>
          </div>
          <p className={styles.emptyTitle}>{t("Select a block to edit it.")}</p>
          <p className={styles.emptyHint}>{t("Or add one from the left panel.")}</p>
          <span className={styles.emptyStep}>{t("Changes appear as you edit")}</span>
        </div>
      )}
    </aside>
  );
}

function BlockEditor({ block }: { block: Block }) {
  switch (block.type) {
    case "hero":     return <HeroEditor block={block} />;
    case "about":    return <AboutEditor block={block} />;
    case "projects": return <ProjectsEditor block={block} />;
    case "skills":   return <SkillsEditor block={block} />;
    case "timeline": return <TimelineEditor block={block} />;
    case "contact":  return <ContactEditor block={block} />;
  }
}
