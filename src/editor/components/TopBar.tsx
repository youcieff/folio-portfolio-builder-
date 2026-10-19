"use client";

import { useRef, useState } from "react";
import { useSiteStore } from "../store/useSiteStore";
import type { Viewport } from "../hooks/useViewport";
import type { SaveStatus } from "../hooks/useAutosave";
import { LanguageToggle, useUiLanguage } from "@/i18n/UiLanguageProvider";
import styles from "./TopBar.module.css";

interface Props {
  viewport:     Viewport;
  onViewport:   (v: Viewport) => void;
  onExport:     () => void;
  onSaveBackup: () => void;
  onLoadBackup: (file: File) => Promise<string | null>;
  onAIGenerate: () => void;
  saveStatus: SaveStatus;
}

const VIEWPORT_ICONS: Record<Viewport, string> = {
  desktop: "⬛",
  tablet:  "▬",
  mobile:  "▮",
};

export function TopBar({ viewport, onViewport, onExport, onSaveBackup, onLoadBackup, onAIGenerate, saveStatus }: Props) {
  const { t } = useUiLanguage();
  const undo     = useSiteStore((s) => s.undo);
  const redo     = useSiteStore((s) => s.redo);
  const canUndo  = useSiteStore((s) => s.past.length > 0);
  const canRedo  = useSiteStore((s) => s.future.length > 0);
  const reset    = useSiteStore((s) => s.resetSite);
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [backupStatus, setBackupStatus] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  async function handleBackupFile(file?: File) {
    if (!file) return;
    setBackupStatus(t(await onLoadBackup(file) ?? ""));
    if (importRef.current) importRef.current.value = "";
  }

  function handleReset() {
    reset();
    setShowResetConfirm(false);
  }

  return (
    <>
    <header className={styles.topbar} role="banner">
      {/* Wordmark */}
      <span className={styles.logo}>Folio</span>
      <LanguageToggle className={styles.languageBtn} />
      <span className={`${styles.saveStatus} ${saveStatus === "error" ? styles.saveError : ""}`} role="status" aria-live="polite" title={t("Your work is saved in this browser")}>
        <i aria-hidden="true" />{t(saveStatus === "saving" ? "Saving…" : saveStatus === "error" ? "Not saved — storage full" : "Saved on this device")}
      </span>

      {/* Undo / Redo */}
      <div className={styles.group} role="group" aria-label={t("History")}>
        <button
          className={styles.btn}
          onClick={undo}
          disabled={!canUndo}
          aria-label={t("Undo")}
          title={`${t("Undo")} (Ctrl+Z)`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7a5 5 0 1 0 1.5-3.5L2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <polyline points="2,2 2,5.5 5.5,5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          className={styles.btn}
          onClick={redo}
          disabled={!canRedo}
          aria-label={t("Redo")}
          title={`${t("Redo")} (Ctrl+Shift+Z)`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ transform: "scaleX(-1)" }}>
            <path d="M2 7a5 5 0 1 0 1.5-3.5L2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <polyline points="2,2 2,5.5 5.5,5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Viewport toggle */}
      <div className={styles.group} role="group" aria-label={t("Viewport")}>
        {(["desktop", "tablet", "mobile"] as Viewport[]).map((v) => (
          <button
            key={v}
            className={`${styles.btn} ${viewport === v ? styles.btnActive : ""}`}
            onClick={() => onViewport(v)}
            aria-label={t(v)}
            aria-pressed={viewport === v}
            title={t(v)}
          >
            {VIEWPORT_ICONS[v]}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.btnGhost} onClick={onSaveBackup} title={t("Download a backup you can edit later")} aria-label={t("Save backup")}>{t("Save backup")}</button>
        <button className={styles.btnGhost} onClick={() => importRef.current?.click()} title={t("Restore a Folio project backup")} aria-label={t("Open backup")}>{t("Open backup")}</button>
        <input ref={importRef} className={styles.fileInput} type="file" accept=".json,.folio.json,application/json" aria-label={t("Choose a Folio backup file")} onChange={(event) => void handleBackupFile(event.target.files?.[0])} />
        <button
          className={styles.btnAI}
          onClick={onAIGenerate}
          title={t("Generate portfolio with AI")}
        >
          ✦ {t("Generate with AI")}
        </button>
        <button className={styles.btnGhost} onClick={() => setShowResetConfirm(true)} style={{ color: "var(--accent)" }}>
          {t("Clear all")}
        </button>
        <button className={styles.btnAccent} onClick={onExport} id="export-btn">
          {t("Export")}
        </button>
      </div>
      {backupStatus && <div className={styles.backupStatus} role="status">{backupStatus}</div>}
    </header>

    {showResetConfirm && (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent} role="alertdialog" aria-modal="true" aria-labelledby="reset-dialog-title" aria-describedby="reset-dialog-description">
          <div className={styles.modalHeading}>
            <span className={styles.modalIcon} aria-hidden="true">!</span>
            <div>
              <h3 id="reset-dialog-title">{t("Start over")}</h3>
              <p id="reset-dialog-description">{t("Are you sure you want to clear the entire canvas? This cannot be undone.")}</p>
            </div>
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.modalCancel} autoFocus onClick={() => setShowResetConfirm(false)}>{t("Cancel")}</button>
            <button type="button" className={styles.btnDanger} onClick={handleReset}>{t("Clear Canvas")}</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
