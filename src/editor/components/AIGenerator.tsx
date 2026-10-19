import { useState, useRef } from "react";
import { useSiteStore } from "../store/useSiteStore";
import { generateId } from "@/core/utils/id";
import type { SiteSchema } from "@/core/schema";
import styles from "./AIGenerator.module.css";
import { useUiLanguage } from "@/i18n/UiLanguageProvider";

interface Props {
  onClose: () => void;
}

const EXAMPLE_PROMPTS = [
  "اسمي أحمد محمد، مطور Full Stack من القاهرة. أعمل بـ React و Node.js منذ 4 سنوات. عملت في شركة Fawry لمدة سنتين ثم استقلت. أهم مشاريعي: منصة دفع إلكتروني استخدمها أكثر من 50K مستخدم.",
  "I'm Sarah Chen, a product designer from San Francisco. I specialize in mobile UX and design systems. Previously at Airbnb and Stripe. I've shipped designs used by millions of people.",
  "مرحبا، أنا يوسف. مطور Backend متخصص في Python وDjango. خريج هندسة حاسبات 2023. أحب الـ Open Source وعندي مشاريع على GitHub.",
];

export function AIGenerator({ onClose }: Props) {
  const { t } = useUiLanguage();
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [apiKey, setApiKey] = useState(() =>
    typeof window !== "undefined" ? (localStorage.getItem("folio:gemini-key") ?? "") : ""
  );
  const [showKeyInput, setShowKeyInput] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const setSchema = useSiteStore((s) => s.setSchema);
  const currentSchema = useSiteStore((s) => s.schema);

  async function handleGenerate() {
    if (prompt.trim().length < 10) {
      setErrorMsg("اكتب وصفاً أطول من كدة 🙂");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, apiKey: apiKey || undefined }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "فشل الطلب");

      const d = json.data;
      buildSchema(d);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "حدث خطأ ما");
      setStatus("error");
    }
  }

  function buildSchema(d: Record<string, unknown>) {
    const idOf = () => generateId();

    const blocks: SiteSchema["blocks"] = [];

    // Hero
    if (d.hero && typeof d.hero === "object") {
      const h = d.hero as Record<string, string>;
      blocks.push({
        id: idOf(),
        type: "hero",
        heading: h.heading ?? "",
        subline: h.subline ?? "",
        ctaLabel: h.ctaLabel ?? "View my work",
        ctaHref: h.ctaHref ?? "#projects",
        avatarSrc: "",
        avatarPosition: "center",
        backgroundSrc: "",
        eyebrow: "",
        layout: "split",
        avatarShape: "rounded",
        backgroundPosition: "center",
        avatarAlt: h.heading ?? "",
        typewriter: false,
      });
    }

    // About
    if (d.about && typeof d.about === "object") {
      const a = d.about as Record<string, unknown>;
      blocks.push({
        id: idOf(),
        type: "about",
        heading: "About",
        body: String(a.body ?? ""),
        image: "",
        imageAlt: "",
        imagePosition: "center",
        facts: Array.isArray(a.facts)
          ? (a.facts as { label: string; value: string }[]).slice(0, 6)
          : [],
      });
    }

    // Projects
    if (Array.isArray(d.projects) && d.projects.length > 0) {
      blocks.push({
        id: idOf(),
        type: "projects",
        heading: "Projects",
        layout: "grid",
        projects: (d.projects as Record<string, unknown>[]).map((p) => ({
          id: idOf(),
          name: String(p.name ?? ""),
          description: String(p.description ?? ""),
          topics: Array.isArray(p.topics) ? (p.topics as string[]) : [],
          image: "",
          imageAlt: "",
          imagePosition: "center",
          repoUrl: String(p.repoUrl ?? ""),
          liveUrl: String(p.liveUrl ?? ""),
        })),
      });
    }

    // Skills
    if (Array.isArray(d.skills) && d.skills.length > 0) {
      blocks.push({
        id: idOf(),
        type: "skills",
        heading: "Skills",
        groups: (d.skills as Record<string, unknown>[]).map((g) => ({
          label: String(g.label ?? ""),
          skills: Array.isArray(g.skills) ? (g.skills as string[]) : [],
        })),
      });
    }

    // Timeline
    if (Array.isArray(d.timeline) && d.timeline.length > 0) {
      blocks.push({
        id: idOf(),
        type: "timeline",
        heading: "Experience",
        entries: (d.timeline as Record<string, unknown>[]).map((e) => ({
          id: idOf(),
          role: String(e.role ?? ""),
          org: String(e.org ?? ""),
          period: String(e.period ?? ""),
          description: String(e.description ?? ""),
        })),
      });
    }

    // Contact
    if (d.contact && typeof d.contact === "object") {
      const c = d.contact as Record<string, unknown>;
      blocks.push({
        id: idOf(),
        type: "contact",
        heading: String(c.heading ?? "Get in touch"),
        note: String(c.note ?? ""),
        links: Array.isArray(c.links)
          ? (c.links as { platform: string; href: string; label: string }[])
          : [],
      });
    }

    const lang = String(d.lang ?? "en") as "en" | "ar";

    setSchema({
      ...currentSchema,
      lang,
      metaTitle: String(d.metaTitle ?? "My Portfolio"),
      metaDesc: String(d.metaDesc ?? ""),
      blocks,
    });
  }

  function saveKey() {
    localStorage.setItem("folio:gemini-key", apiKey);
    setShowKeyInput(false);
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <span className={styles.sparkle}>✦</span>
            <h2>{t("Generate with AI")}</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* API Key notice */}
        <div className={styles.keyRow}>
          {showKeyInput ? (
            <div className={styles.keyInputRow}>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza... (Gemini API Key)"
                className={styles.keyInput}
              />
              <button className={styles.keyBtn} onClick={saveKey}>{t("Save")}</button>
              <button className={styles.keyBtnGhost} onClick={() => setShowKeyInput(false)}>{t("Cancel")}</button>
            </div>
          ) : (
            <button className={styles.keyBtnGhost} onClick={() => setShowKeyInput(true)}>
              {apiKey ? "🔑 API Key configured" : "🔑 Add Gemini API Key"}
            </button>
          )}
        </div>

        {/* Prompt area */}
        <div className={styles.body}>
          <label className={styles.promptLabel}>
            صف نفسك باختصار — بالعربي أو الإنجليزي
          </label>
          <textarea
            ref={textareaRef}
            className={styles.promptArea}
            rows={6}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="مثلاً: أنا أحمد، مطور Full Stack من القاهرة. أعمل بـ React وNode.js. مشاريعي: منصة تجارة إلكترونية، تطبيق موبايل..."
          />
          <p className={styles.charCount}>{prompt.length} / 1000 حرف</p>
        </div>

        {/* Example prompts */}
        <div className={styles.examples}>
          <p className={styles.examplesLabel}>أمثلة:</p>
          <div className={styles.exampleBtns}>
            {EXAMPLE_PROMPTS.map((ex, i) => (
              <button
                key={i}
                className={styles.exampleBtn}
                onClick={() => setPrompt(ex)}
              >
                {ex.slice(0, 50)}...
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {status === "error" && (
          <div className={styles.error}>⚠ {errorMsg}</div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            إلغاء
          </button>
          <button
            className={styles.generateBtn}
            onClick={handleGenerate}
            disabled={status === "loading" || prompt.trim().length < 10}
          >
            {status === "loading" ? (
              <span className={styles.spinner}>⟳ جاري التوليد...</span>
            ) : (
              "✦ Generate Portfolio"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
