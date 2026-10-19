"use client";

import { useSiteStore } from "../../store/useSiteStore";
import type { HeroBlock } from "@/core/schema";
import { ImageUploader } from "../ImageUploader";
import s from "./fields.module.css";
import styles from "./HeroEditor.module.css";
import { useUiLanguage } from "@/i18n/UiLanguageProvider";

const LAYOUTS: { id: NonNullable<HeroBlock["layout"]>; label: string; graphic: string }[] = [
  { id: "split", label: "Text + photo", graphic: "split" },
  { id: "centered", label: "Centered", graphic: "centered" },
  { id: "photo-first", label: "Photo first", graphic: "photo" },
  { id: "banner", label: "Big cover", graphic: "banner" },
];

export function HeroEditor({ block }: { block: HeroBlock }) {
  const { t } = useUiLanguage();
  const update = useSiteStore((st) => st.updateBlock);

  function set<K extends keyof HeroBlock>(key: K, value: HeroBlock[K]) {
    update(block.id, (b) => { if (b.type === "hero") (b as HeroBlock)[key] = value; });
  }

  return <div className={s.panel}>
    <div className={styles.heading}><span className={styles.eyebrow}>{t("FIRST IMPRESSION")}</span><h2>{t("Shape your introduction")}</h2><p>{t("Write your story, then choose how it should look.")}</p></div>

    <div className={s.field}>
      <label className={s.label} htmlFor="hero-heading">{t("Your name or headline")}</label>
      <input id="hero-heading" value={block.heading} maxLength={120} onChange={(e) => set("heading", e.target.value)} placeholder="Alex Morgan" />
    </div>
    <div className={s.field}>
      <label className={s.label} htmlFor="hero-eyebrow">{t("Small label above your name")} <span className={styles.optional}>{t("Optional")}</span></label>
      <input id="hero-eyebrow" value={block.eyebrow ?? ""} maxLength={60} onChange={(e) => set("eyebrow", e.target.value)} placeholder="Product designer · Cairo" />
    </div>
    <div className={s.field}>
      <label className={s.label} htmlFor="hero-subline">{t("A little about what you do")}</label>
      <textarea id="hero-subline" rows={3} value={block.subline} maxLength={240} onChange={(e) => set("subline", e.target.value)} placeholder="I make digital products feel simple, useful, and human." />
    </div>

    <div className={s.field}>
      <span className={s.label}>{t("Choose a layout")}</span>
      <div className={styles.layoutGrid} role="group" aria-label={t("Introduction layout")}>
        {LAYOUTS.map((layout) => <button type="button" key={layout.id} aria-pressed={(block.layout ?? "split") === layout.id} className={`${styles.layoutOption} ${(block.layout ?? "split") === layout.id ? styles.layoutSelected : ""}`} onClick={() => set("layout", layout.id)}>
          <span className={`${styles.layoutPreview} ${styles[layout.graphic]}`}><i /><i /><i /></span>
          <span>{t(layout.label)}</span>
        </button>)}
      </div>
    </div>

    <label className={s.checkbox}>
      <input type="checkbox" checked={block.typewriter ?? false} onChange={(e) => set("typewriter", e.target.checked)} />
      <span>{t("Type my headline on arrival")}</span>
    </label>

    <div className={styles.mediaGroup}>
      <div className={styles.mediaHeading}><strong>{t("Your photo")}</strong><span>{t("Optional")}</span></div>
      <p>{t("Add a portrait, artwork, or anything that represents you.")}</p>
      <ImageUploader value={block.avatarSrc || ""} onChange={(value) => set("avatarSrc", value)} label={t("Choose or drop a photo")} hint={t("JPG, PNG, WebP, or paste an image link")} />
      {block.avatarSrc && <div className={s.field}>
        <label className={s.label}>{t("Photo shape")}</label>
        <select value={block.avatarShape ?? "rounded"} onChange={(e) => set("avatarShape", e.target.value as HeroBlock["avatarShape"])}>
          <option value="rounded">Rounded</option><option value="circle">Circle</option><option value="square">Square</option>
        </select>
      </div>}
      {block.avatarSrc && <div className={s.field}>
        <label className={s.label}>{t("Photo focal point")}</label>
        <select value={block.avatarPosition ?? "center"} onChange={(e) => set("avatarPosition", e.target.value as HeroBlock["avatarPosition"])}>
          <option value="center">Center</option><option value="top">Top</option><option value="bottom">Bottom</option><option value="left">Left</option><option value="right">Right</option><option value="top-left">Top left</option><option value="top-right">Top right</option><option value="bottom-left">Bottom left</option><option value="bottom-right">Bottom right</option>
        </select>
      </div>}
    </div>

    <details className={styles.moreOptions}>
      <summary>{t("Background image and button")}</summary>
      <div className={styles.detailFields}>
        <div className={s.field}>
          <label className={s.label}>Wide background image</label>
          <ImageUploader value={block.backgroundSrc ?? ""} onChange={(value) => set("backgroundSrc", value)} label="Add a cover image" hint="Works best with a wide photo or artwork" />
        </div>
        {block.backgroundSrc && <div className={s.field}>
          <label className={s.label}>Image focal point</label>
          <select value={block.backgroundPosition ?? "center"} onChange={(e) => set("backgroundPosition", e.target.value as HeroBlock["backgroundPosition"])}>
            <option value="center">Center</option><option value="top">Top</option><option value="bottom">Bottom</option><option value="left">Left</option><option value="right">Right</option>
          </select>
        </div>}
        <div className={s.field}><label className={s.label} htmlFor="hero-cta-label">Button label</label><input id="hero-cta-label" value={block.ctaLabel} maxLength={40} onChange={(e) => set("ctaLabel", e.target.value)} placeholder="See my work" /></div>
        <div className={s.field}><label className={s.label} htmlFor="hero-cta-href">Button destination</label><input id="hero-cta-href" value={block.ctaHref} onChange={(e) => set("ctaHref", e.target.value)} placeholder="#projects or https://…" /></div>
        {block.avatarSrc && <div className={s.field}><label className={s.label} htmlFor="hero-avatar-alt">Photo description (accessibility)</label><input id="hero-avatar-alt" value={block.avatarAlt} maxLength={120} onChange={(e) => set("avatarAlt", e.target.value)} placeholder="Portrait of Alex" /></div>}
      </div>
    </details>
  </div>;
}
