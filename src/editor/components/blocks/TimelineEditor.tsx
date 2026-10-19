"use client";

import { useSiteStore } from "../../store/useSiteStore";
import type { TimelineBlock } from "@/core/schema";
import { generateId } from "@/core/utils/id";
import s from "./fields.module.css";
import { useUiLanguage } from "@/i18n/UiLanguageProvider";

export function TimelineEditor({ block }: { block: TimelineBlock }) {
  const { t } = useUiLanguage();
  const update = useSiteStore((st) => st.updateBlock);

  function set<K extends keyof TimelineBlock>(key: K, value: TimelineBlock[K]) {
    update(block.id, (b) => {
      if (b.type === "timeline") (b as TimelineBlock)[key] = value;
    });
  }

  function addEntry() {
    update(block.id, (b) => {
      if (b.type === "timeline") {
        b.entries.push({ id: generateId(), role: t("Role"), org: t("Company"), period: "2024", description: "" });
      }
    });
  }

  function removeEntry(index: number) {
    update(block.id, (b) => {
      if (b.type === "timeline") b.entries.splice(index, 1);
    });
  }

  function updateEntry(index: number, key: "role" | "org" | "period" | "description", val: string) {
    update(block.id, (b) => {
      if (b.type === "timeline") {
        const entry = b.entries[index];
        if (entry) entry[key] = val;
      }
    });
  }

  return (
    <div className={s.panel}>
      <p className={s.panelTitle}>{t("Timeline")}</p>

      <div className={s.field}>
        <label className={s.label} htmlFor="tl-heading">{t("Heading")}</label>
        <input
          id="tl-heading"
          value={block.heading}
          maxLength={80}
          onChange={(e) => set("heading", e.target.value)}
          placeholder="Experience"
        />
      </div>

      <div className={s.divider} />
      <p className={s.subhead}>{t("Entries")}</p>

      {block.entries.map((entry, i) => (
        <div key={i} className={s.repeatItem}>
          <div className={s.field}>
            <label className={s.label}>{t("Role")}</label>
            <input
              value={entry.role}
              maxLength={80}
              onChange={(e) => updateEntry(i, "role", e.target.value)}
              placeholder="e.g. Senior Designer"
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>{t("Organization")}</label>
            <input
              value={entry.org}
              maxLength={80}
              onChange={(e) => updateEntry(i, "org", e.target.value)}
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>{t("Period")}</label>
            <input
              value={entry.period}
              maxLength={40}
              onChange={(e) => updateEntry(i, "period", e.target.value)}
              placeholder="e.g. 2021 — Present"
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>{t("Description")}</label>
            <textarea
              rows={3}
              value={entry.description}
              maxLength={400}
              onChange={(e) => updateEntry(i, "description", e.target.value)}
              placeholder="What you did there"
            />
          </div>
          <div className={s.repeatActions}>
            <button className={s.removeBtn} onClick={() => removeEntry(i)}>
              {t("Remove")}
            </button>
          </div>
        </div>
      ))}
      <button className={s.addBtn} onClick={addEntry}>+ {t("Add entry")}</button>
    </div>
  );
}
