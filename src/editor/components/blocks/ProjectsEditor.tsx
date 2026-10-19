"use client";

import { useSiteStore } from "../../store/useSiteStore";
import type { Project, ProjectsBlock } from "@/core/schema";
import { generateId } from "@/core/utils/id";
import { ImageUploader } from "../ImageUploader";
import s from "./fields.module.css";
import { useUiLanguage } from "@/i18n/UiLanguageProvider";

export function ProjectsEditor({ block }: { block: ProjectsBlock }) {
  const { t } = useUiLanguage();
  const update = useSiteStore((st) => st.updateBlock);

  function set<K extends keyof ProjectsBlock>(key: K, value: ProjectsBlock[K]) {
    update(block.id, (b) => {
      if (b.type === "projects") (b as ProjectsBlock)[key] = value;
    });
  }

  function addProject() {
    update(block.id, (b) => {
      if (b.type === "projects") {
        b.projects.push({ id: generateId(), name: t("New Project"), description: "", topics: [], image: "", imageAlt: "", imagePosition: "center", repoUrl: "", liveUrl: "" });
      }
    });
  }

  function removeProject(index: number) {
    update(block.id, (b) => {
      if (b.type === "projects") b.projects.splice(index, 1);
    });
  }

  function updateProject<K extends keyof Project>(index: number, key: K, val: Project[K]) {
    update(block.id, (b) => {
      if (b.type === "projects") {
        const proj = b.projects[index];
        if (proj) proj[key] = val;
      }
    });
  }

  function updateTopics(index: number, value: string) {
    update(block.id, (b) => {
      if (b.type === "projects") {
        const project = b.projects[index];
        if (project) project.topics = value.split(",").map((topic) => topic.trim()).filter(Boolean).slice(0, 10);
      }
    });
  }

  return (
    <div className={s.panel}>
      <p className={s.panelTitle}>{t("Projects")}</p>

      <div className={s.field}>
        <label className={s.label} htmlFor="proj-heading">{t("Heading")}</label>
        <input
          id="proj-heading"
          value={block.heading}
          maxLength={80}
          onChange={(e) => set("heading", e.target.value)}
          placeholder="Selected Work"
        />
      </div>

      <div className={s.field}>
        <label className={s.label} htmlFor="proj-layout">{t("Work layout")}</label>
        <select id="proj-layout" value={block.layout ?? "grid"} onChange={(e) => set("layout", e.target.value as ProjectsBlock["layout"])}>
          <option value="grid">{t("Even grid")}</option><option value="feature">{t("Featured first project")}</option><option value="list">{t("Editorial list")}</option>
        </select>
        <span style={{ color: "#81887f", fontSize: 10 }}>{t("Try a different layout and see it update in the preview.")}</span>
      </div>

      <div className={s.divider} />
      <p className={s.subhead}>{t("Items")}</p>

      {block.projects.map((proj, i) => (
        <div key={i} className={s.repeatItem}>
          <div className={s.field}>
            <label className={s.label}>{t("Name")}</label>
            <input
              value={proj.name}
              maxLength={80}
              onChange={(e) => updateProject(i, "name", e.target.value)}
              placeholder="Project Name"
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>{t("Description")}</label>
            <textarea
              rows={2}
              value={proj.description}
              maxLength={400}
              onChange={(e) => updateProject(i, "description", e.target.value)}
              placeholder="Brief description of the project"
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>{t("Project cover image")}</label>
            <ImageUploader
              value={proj.image || ""}
              onChange={(val) => updateProject(i, "image", val)}
              label={t("Choose or drop a project image")}
              hint={t("Paste the direct URL of an image file below (JPG, PNG, or WebP), or upload / drop a file.")}
            />
            <span style={{ color: "#81887f", fontSize: 10 }}>{t("Tip: open the image itself in a new tab, copy its image address, and paste it here.")}</span>
          </div>
          {proj.image && <>
            <div className={s.field}>
              <label className={s.label}>{t("Image focal point")}</label>
              <select value={proj.imagePosition ?? "center"} onChange={(e) => updateProject(i, "imagePosition", e.target.value as Project["imagePosition"])}>
                {imagePositions.map(([value, label]) => <option key={value} value={value}>{t(label)}</option>)}
              </select>
            </div>
            <div className={s.field}>
              <label className={s.label}>{t("Image description (accessibility)")}</label>
              <input value={proj.imageAlt ?? ""} maxLength={120} onChange={(e) => updateProject(i, "imageAlt", e.target.value)} placeholder={`Image of ${proj.name}`} />
            </div>
          </>}
          <div className={s.field}>
            <label className={s.label}>{t("Tags (separate with commas)")}</label>
            <input value={proj.topics.join(", ")} maxLength={180} onChange={(e) => updateTopics(i, e.target.value)} placeholder="Branding, Web design, React" />
          </div>
          <div className={s.field}>
            <label className={s.label}>{t("Live URL")}</label>
            <input
              type="url"
              value={proj.liveUrl}
              onChange={(e) => updateProject(i, "liveUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>{t("Repo URL")}</label>
            <input
              type="url"
              value={proj.repoUrl}
              onChange={(e) => updateProject(i, "repoUrl", e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>
          <div className={s.repeatActions}>
            <button className={s.removeBtn} onClick={() => removeProject(i)}>
              {t("Remove")}
            </button>
          </div>
        </div>
      ))}
      <button className={s.addBtn} onClick={addProject}>+ {t("Add project")}</button>
    </div>
  );
}

const imagePositions = [
  ["center", "Center"], ["top", "Top"], ["bottom", "Bottom"], ["left", "Left"], ["right", "Right"],
  ["top-left", "Top left"], ["top-right", "Top right"], ["bottom-left", "Bottom left"], ["bottom-right", "Bottom right"],
] as const;
