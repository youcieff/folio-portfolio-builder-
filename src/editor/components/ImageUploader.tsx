"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ImageUploader.module.css";
import { useUiLanguage } from "@/i18n/UiLanguageProvider";

interface ImageUploaderProps {
  value: string;
  onChange: (imageSource: string) => void;
  label?: string;
  hint?: string;
}

export function ImageUploader({ value, onChange, label = "Add an image", hint = "Drop a file, paste an image, or choose a link." }: ImageUploaderProps) {
  const { t } = useUiLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [url, setUrl] = useState(value.startsWith("http") ? value : "");
  const [dragOver, setDragOver] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrl(value.startsWith("http") ? value : "");
    setImageFailed(false);
  }, [value]);

  async function processFile(file?: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      setError(t("Choose an image file such as JPG, PNG, or WebP."));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("This image is over 20 MB. Choose a smaller file to keep the portfolio quick to load.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setError("");
    setSuccess("");
    setIsProcessing(true);
    try {
      const dataUrl = await compressImageToWebP(file);
      if (dataUrl.length > 1_100_000) throw new Error("This image is still too large after compression.");
      onChange(dataUrl);
      setUrl("");
      setSuccess(t("Optimized as WebP and ready for your portfolio."));
    } catch (err) {
      setError(err instanceof Error && err.message.includes("too large") ? "This image is very large. Try a smaller image." : "We couldn’t open that image. Try another file.");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function useUrl() {
    try {
      const parsed = new URL(url.trim());
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error();
      setError("");
      setSuccess("");
      setIsProcessing(true);
      try {
        const webp = await convertUrlToWebP(parsed.href);
        if (webp.length > 1_100_000) throw new Error("large");
        onChange(webp);
        setSuccess(t("Image optimized as WebP and embedded in your portfolio."));
      } catch {
        onChange(parsed.href);
        setSuccess(t("Image link added. Its host prevents WebP conversion here, but the image will still display."));
      } finally {
        setIsProcessing(false);
      }
    } catch {
      setError(t("Paste a full image link that starts with https://"));
    }
  }

  return (
    <div className={styles.uploader}>
      {value ? <div className={styles.imagePreview}>
        {imageFailed ? <div className={styles.imageError}>The link did not load an image. Try a direct image URL ending in .jpg, .png, or .webp.</div> : <img src={value} alt="Selected image preview" onError={() => setImageFailed(true)} />}
        <div className={styles.imageActions}>
          <button type="button" onClick={() => fileInputRef.current?.click()}>{t("Change image")}</button>
          <button type="button" onClick={() => { onChange(""); setUrl(""); setImageFailed(false); setSuccess(""); }}>{t("Remove image")}</button>
        </div>
      </div> : <button
        type="button"
        className={`${styles.dropzone} ${dragOver ? styles.dragOver : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => { event.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => { event.preventDefault(); setDragOver(false); void processFile(event.dataTransfer.files[0]); }}
        onPaste={(event) => {
          const imageItem = Array.from(event.clipboardData.items).find((item) => item.type.startsWith("image/"));
          if (imageItem) { const file = imageItem.getAsFile(); if (file) void processFile(file); }
        }}
        disabled={isProcessing}
      >
        <span className={styles.uploadIcon} aria-hidden>↑</span>
        <strong>{isProcessing ? "Preparing your image…" : label}</strong>
        <small>{hint}</small>
        <span className={styles.chooseLabel}>{t("Choose a file")}</span>
      </button>}
      <input ref={fileInputRef} className={styles.fileInput} type="file" accept="image/*" onChange={(event) => void processFile(event.target.files?.[0])} />
      <div className={styles.urlRow}>
        <input type="url" value={url} onChange={(event) => setUrl(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") useUrl(); }} placeholder="Paste direct image link: https://…/project.jpg" aria-label="Image URL" />
        <button type="button" onClick={useUrl}>{t("Use image link")}</button>
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {success && <p className={styles.success} role="status">{success}</p>}
    </div>
  );
}

function compressImageToWebP(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => {
        const qualities = [0.84, 0.74, 0.64, 0.54, 0.44];
        for (const maxDimension of [1600, 1300, 1050, 850, 680]) {
          const scale = Math.min(1, maxDimension / image.width, maxDimension / image.height);
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          const context = canvas.getContext("2d");
          if (!context) return reject(new Error("No canvas context"));
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          for (const quality of qualities) {
            const result = canvas.toDataURL("image/webp", quality);
            if (!result.startsWith("data:image/webp")) return reject(new Error("WebP is not supported in this browser"));
            if (result.length <= 1_100_000) return resolve(result);
          }
        }
        reject(new Error("Image too large after compression"));
      };
      image.onerror = () => reject(new Error("Image decode failed"));
      image.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

function convertUrlToWebP(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const scale = Math.min(1, 1600 / image.naturalWidth, 1600 / image.naturalHeight);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext("2d");
        if (!context) return reject(new Error("Canvas unavailable"));
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        for (const quality of [0.82, 0.72, 0.62, 0.52, 0.42]) {
          const result = canvas.toDataURL("image/webp", quality);
          if (!result.startsWith("data:image/webp")) return reject(new Error("WebP unavailable"));
          if (result.length <= 1_100_000) return resolve(result);
        }
        reject(new Error("Image too large after compression"));
      } catch (err) { reject(err); }
    };
    image.onerror = () => reject(new Error("Remote image does not allow conversion"));
    image.src = url;
  });
}
