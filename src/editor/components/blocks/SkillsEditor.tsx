"use client";

import { useSiteStore } from "../../store/useSiteStore";
import type { SkillsBlock } from "@/core/schema";
import s from "./fields.module.css";
import { useUiLanguage } from "@/i18n/UiLanguageProvider";

export function SkillsEditor({ block }: { block: SkillsBlock }) {
  const { t } = useUiLanguage();
  const update = useSiteStore((st) => st.updateBlock);

  function set<K extends keyof SkillsBlock>(key: K, value: SkillsBlock[K]) {
    update(block.id, (b) => {
      if (b.type === "skills") (b as SkillsBlock)[key] = value;
    });
  }

  function addGroup() {
    update(block.id, (b) => {
      if (b.type === "skills") {
        b.groups.push({ label: t("New Category"), skills: [t("Skill")] });
      }
    });
  }

  function removeGroup(index: number) {
    update(block.id, (b) => {
      if (b.type === "skills") b.groups.splice(index, 1);
    });
  }

  function updateGroupLabel(index: number, val: string) {
    update(block.id, (b) => {
      if (b.type === "skills") {
        const group = b.groups[index];
        if (group) group.label = val;
      }
    });
  }

  function updateGroupItems(index: number, val: string) {
    update(block.id, (b) => {
      if (b.type === "skills") {
        const group = b.groups[index];
        if (group) {
          // simple comma-separated split
          group.skills = val.split(",").map((s) => s.trim()).filter(Boolean);
        }
      }
    });
  }

  return (
    <div className={s.panel}>
      <p className={s.panelTitle}>{t("Skills")}</p>

      <div className={s.field}>
        <label className={s.label} htmlFor="skills-heading">{t("Heading")}</label>
        <input
          id="skills-heading"
          value={block.heading}
          maxLength={80}
          onChange={(e) => set("heading", e.target.value)}
          placeholder="Skills & Tools"
        />
      </div>

      <div className={s.divider} />
      <p className={s.subhead}>{t("Skill Groups")}</p>

      {block.groups.map((group, i) => (
        <div key={i} className={s.repeatItem}>
          <div className={s.field}>
            <label className={s.label}>{t("Label")}</label>
            <input
              value={group.label}
              maxLength={60}
              onChange={(e) => updateGroupLabel(i, e.target.value)}
              placeholder="e.g. Languages"
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>{t("Skills (comma separated)")}</label>
            <input
              value={group.skills.join(", ")}
              onChange={(e) => updateGroupItems(i, e.target.value)}
              placeholder="HTML, CSS, JS..."
            />
          </div>
          <div className={s.repeatActions}>
            <button className={s.removeBtn} onClick={() => removeGroup(i)}>
              {t("Remove")}
            </button>
          </div>
        </div>
      ))}
      <button className={s.addBtn} onClick={addGroup}>+ {t("Add skill group")}</button>
    </div>
  );
}
