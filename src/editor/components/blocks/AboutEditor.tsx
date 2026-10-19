"use client";

import { useSiteStore } from "../../store/useSiteStore";
import type { AboutBlock } from "@/core/schema";
import { ImageUploader } from "../ImageUploader";
import s from "./fields.module.css";
import { useUiLanguage } from "@/i18n/UiLanguageProvider";

export function AboutEditor({ block }: { block: AboutBlock }) {
  const { t } = useUiLanguage();
  const update = useSiteStore((st) => st.updateBlock);

  function set<K extends keyof AboutBlock>(key: K, value: AboutBlock[K]) {
    update(block.id, (b) => {
      if (b.type === "about") (b as AboutBlock)[key] = value;
    });
  }

  function addFact() {
    update(block.id, (b) => {
      if (b.type === "about") b.facts.push({ label: t("Label"), value: t("Value") });
    });
  }

  function removeFact(index: number) {
    update(block.id, (b) => {
      if (b.type === "about") b.facts.splice(index, 1);
    });
  }

  function updateFact(index: number, key: "label" | "value", val: string) {
    update(block.id, (b) => {
      if (b.type === "about") {
        const fact = b.facts[index];
        if (fact) fact[key] = val;
      }
    });
  }

  return (
    <div className={s.panel}>
      <p className={s.panelTitle}>{t("About section")}</p>

      <div className={s.field}>
        <label className={s.label} htmlFor="about-heading">{t("Section heading")}</label>
        <input id="about-heading" value={block.heading} maxLength={80} onChange={(e) => set("heading", e.target.value)} placeholder="About me" />
      </div>

      <div className={s.field}>
        <label className={s.label}>{t("Supporting image")} <span style={{ color: "#939a92", textTransform: "none", letterSpacing: 0 }}>{t("Optional")}</span></label>
        <ImageUploader value={block.image ?? ""} onChange={(value) => set("image", value)} label={t("Add a portrait or workspace photo")} />
      </div>
      {block.image && <>
        <div className={s.field}>
          <label className={s.label}>{t("Image focal point")}</label>
          <select value={block.imagePosition ?? "center"} onChange={(e) => set("imagePosition", e.target.value as AboutBlock["imagePosition"])}>
            <option value="center">Center</option><option value="top">Top</option><option value="bottom">Bottom</option><option value="left">Left</option><option value="right">Right</option><option value="top-left">Top left</option><option value="top-right">Top right</option><option value="bottom-left">Bottom left</option><option value="bottom-right">Bottom right</option>
          </select>
        </div>
        <div className={s.field}><label className={s.label}>{t("Image description (accessibility)")}</label><input value={block.imageAlt ?? ""} maxLength={120} onChange={(e) => set("imageAlt", e.target.value)} placeholder={t("Describe what the photo shows")} /></div>
      </>}

      <div className={s.field}>
        <label className={s.label} htmlFor="about-body">{t("Body text")}</label>
        <textarea
          id="about-body"
          rows={6}
          value={block.body}
          maxLength={1000}
          onChange={(e) => set("body", e.target.value)}
          placeholder="I am a designer based in..."
        />
      </div>

      <div className={s.divider} />
      <p className={s.subhead}>{t("Key Facts")}</p>

      {block.facts.map((fact, i) => (
        <div key={i} className={s.repeatItem}>
          <div className={s.field}>
            <label className={s.label}>{t("Label")}</label>
            <input
              value={fact.label}
              maxLength={40}
              onChange={(e) => updateFact(i, "label", e.target.value)}
              placeholder="e.g. Location"
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>{t("Value")}</label>
            <input
              value={fact.value}
              maxLength={80}
              onChange={(e) => updateFact(i, "value", e.target.value)}
              placeholder="e.g. Cairo, EG"
            />
          </div>
          <div className={s.repeatActions}>
            <button className={s.removeBtn} onClick={() => removeFact(i)}>
              {t("Remove")}
            </button>
          </div>
        </div>
      ))}
      <button className={s.addBtn} onClick={addFact}>+ {t("Add fact")}</button>
    </div>
  );
}
