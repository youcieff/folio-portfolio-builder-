"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS }         from "@dnd-kit/utilities";
import { useSiteStore } from "../store/useSiteStore";
import type { Block }   from "@/core/schema";
import styles           from "./BlockItem.module.css";

const BLOCK_LABELS: Record<Block["type"], string> = {
  hero:     "Hero",
  about:    "About",
  projects: "Projects",
  skills:   "Skills",
  timeline: "Timeline",
  contact:  "Contact",
};

interface Props {
  block:      Block;
  isSelected: boolean;
  isDragging: boolean;
  onSelect:   () => void;
}

export function BlockItem({ block, isSelected, isDragging, onSelect }: Props) {
  const removeBlock    = useSiteStore((s) => s.removeBlock);
  const duplicateBlock = useSiteStore((s) => s.duplicateBlock);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    over,
  } = useSortable({ id: block.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isDropTarget = over?.id === block.id && !isDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        styles.item,
        isSelected  ? styles.selected   : "",
        isDropTarget ? styles.dropTarget : "",
      ].join(" ")}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`${BLOCK_LABELS[block.type]} block — click to edit`}
      aria-pressed={isSelected}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect(); }}
    >
      {/* Drag handle */}
      <button
        className={styles.handle}
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        ⠿
      </button>

      <div className={styles.info}>
        <span className={styles.typeLabel}>{BLOCK_LABELS[block.type]}</span>
        <span className={styles.preview}>{getPreview(block)}</span>
      </div>

      {/* Actions — only visible on hover/selected */}
      <div className={styles.actions}>
        <button
          className={styles.actionBtn}
          onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }}
          aria-label="Duplicate block"
          title="Duplicate"
        >
          ⧉
        </button>
        <button
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
          aria-label="Delete block"
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// Returns a short preview string for the block
function getPreview(block: Block): string {
  switch (block.type) {
    case "hero":     return block.heading || "–";
    case "about":    return block.body.slice(0, 40) || "–";
    case "projects": return `${block.projects.length} project${block.projects.length === 1 ? "" : "s"}`;
    case "skills":   return `${block.groups.length} group${block.groups.length === 1 ? "" : "s"}`;
    case "timeline": return `${block.entries.length} entr${block.entries.length === 1 ? "y" : "ies"}`;
    case "contact":  return block.heading || "–";
  }
}
