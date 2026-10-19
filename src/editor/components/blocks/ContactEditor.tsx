"use client";

import { useSiteStore } from "../../store/useSiteStore";
import type { ContactBlock } from "@/core/schema";
import s from "./fields.module.css";
import { useUiLanguage } from "@/i18n/UiLanguageProvider";

export function ContactEditor({ block }: { block: ContactBlock }) {
  const { t } = useUiLanguage();
  const update = useSiteStore((st) => st.updateBlock);

  function set<K extends keyof ContactBlock>(key: K, value: ContactBlock[K]) {
    update(block.id, (b) => {
      if (b.type === "contact") (b as ContactBlock)[key] = value;
    });
  }

  function addLink() {
    update(block.id, (b) => {
      if (b.type === "contact") {
        b.links.push({ platform: "Website", label: t("My website"), href: "" });
      }
    });
  }

  function removeLink(index: number) {
    update(block.id, (b) => {
      if (b.type === "contact") b.links.splice(index, 1);
    });
  }

  function updateLink(index: number, key: "platform" | "label" | "href", val: string) {
    update(block.id, (b) => {
      if (b.type === "contact") {
        const link = b.links[index];
        if (link) link[key] = val;
      }
    });
  }

  return (
    <div className={s.panel}>
      <p className={s.panelTitle}>{t("Contact")}</p>

      <div className={s.field}>
        <label className={s.label} htmlFor="contact-heading">{t("Heading")}</label>
        <input
          id="contact-heading"
          value={block.heading}
          maxLength={80}
          onChange={(e) => set("heading", e.target.value)}
          placeholder="Get in touch"
        />
      </div>

      <div className={s.field}>
        <label className={s.label} htmlFor="contact-note">{t("Note")}</label>
        <textarea
          id="contact-note"
          rows={3}
          value={block.note}
          maxLength={240}
          onChange={(e) => set("note", e.target.value)}
          placeholder="Available for freelance work."
        />
      </div>

      <div className={s.divider} />
      <p className={s.subhead}>{t("Links")}</p>

      {block.links.map((link, i) => (
        <div key={i} className={s.repeatItem}>
          <div className={s.field}>
            <label className={s.label}>{t("Platform icon")}</label>
            <select value={link.platform} onChange={(e) => updateLink(i, "platform", e.target.value)}>
              {["Website", "Email", "Phone", "LinkedIn", "GitHub", "Behance", "Dribbble", "Instagram", "X", "Facebook", "YouTube", "TikTok", "WhatsApp", "Telegram", "Medium", "Pinterest", "ArtStation", "Other"].map((platform) => <option key={platform}>{platform}</option>)}
            </select>
          </div>
          <div className={s.field}>
            <label className={s.label}>{t("Label")}</label>
            <input
              value={link.label}
              maxLength={40}
              onChange={(e) => updateLink(i, "label", e.target.value)}
              placeholder="e.g. Email"
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>{t(link.platform === "Email" ? "Email address" : link.platform === "Phone" ? "Phone number" : "Profile or website URL")}</label>
            <input
              value={link.href}
              onChange={(e) => updateLink(i, "href", e.target.value)}
              placeholder={link.platform === "Email" ? "you@example.com" : "https://…"}
            />
          </div>
          <div className={s.repeatActions}>
            <button className={s.removeBtn} onClick={() => removeLink(i)}>
              {t("Remove")}
            </button>
          </div>
        </div>
      ))}
      <button className={s.addBtn} onClick={addLink}>+ {t("Add link")}</button>
    </div>
  );
}
