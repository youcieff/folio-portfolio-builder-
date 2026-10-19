import { create } from "zustand";
import { enableMapSet } from "immer";
import { produceWithPatches, applyPatches, enablePatches } from "immer";
import type { Patch } from "immer";
import type { SiteSchema, Block } from "@/core/schema";
import { parseSite } from "@/core/schema";
import { generateId } from "@/core/utils/id";

// Immer needs these enabled once at module load
enablePatches();
enableMapSet();

// ─── History entry ────────────────────────────────────────────────────────────
interface HistoryEntry {
  patches:        Patch[];
  inversePatches: Patch[];
}

// ─── Store shape ──────────────────────────────────────────────────────────────
interface SiteStore {
  schema:          SiteSchema;
  hydrated:        boolean;
  past:            HistoryEntry[];   // entries before current state
  future:          HistoryEntry[];   // entries available to redo
  selectedBlockId: string | null;

  // Mutators — every write goes through _apply so history is maintained
  updateBlock:    (id: string, updater: (block: Block) => void) => void;
  addBlock:       (block: Block) => void;
  removeBlock:    (id: string) => void;
  duplicateBlock: (id: string) => void;
  reorderBlocks:  (fromIndex: number, toIndex: number) => void;
  updateTheme:    (updater: (theme: SiteSchema["theme"]) => void) => void;
  updateMeta:     (meta: { title?: string; desc?: string; lang?: SiteSchema["lang"] }) => void;
  updateExperience: (patch: Partial<SiteSchema["experience"]>) => void;
  setSchema:      (schema: SiteSchema) => void;
  hydrateFromStorage: () => void;
  resetSite:      () => void;

  // History
  undo: () => void;
  redo: () => void;

  // Selection
  selectBlock:   (id: string | null) => void;

  // Persistence helpers (called externally by useAutosave)
  getSchema:  () => SiteSchema;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getEmptySchema(): SiteSchema {
  return {
    version: 1,
    lang: "en",
    metaTitle: "My Portfolio",
    metaDesc: "",
    experience: { navigation: true, stickyNavigation: true, navigationStyle: "glass", navigationLayout: "center", navigationSize: "standard", navigationShowBrand: true, navigationBrandLabel: "", navigationItems: [], motion: "subtle", sectionDivider: "auto", scrollProgress: true, backToTop: true, imageLightbox: true, showFooter: true },
    theme: {
      templateId: "editorial",
      backgroundStyle: "soft-gradient",
      fontPair: "newsreader+source-serif",
      accent: { l: 0.4, c: 0.08, h: 160 },
      background: { l: 0.98, c: 0.01, h: 70 },
      surface: { l: 1, c: 0, h: 0 },
      ink: { l: 0.1, c: 0.02, h: 70 },
      inkSoft: { l: 0.4, c: 0.05, h: 70 },
      radiusBase: 0,
      spacingDensity: "normal",
    },
    blocks: [],
  };
}

// NOTE: key includes a version suffix so old cached data is auto-discarded.
const STORAGE_KEY = "folio:schema:v2";

function loadSavedSchema(): SiteSchema {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getEmptySchema();
    const parsed = parseSite(JSON.parse(raw));
    return parsed ?? getEmptySchema();
  } catch {
    return getEmptySchema();
  }
}

const MAX_HISTORY = 100;
const initialSchema = getEmptySchema();

// ─── Store ────────────────────────────────────────────────────────────────────
export const useSiteStore = create<SiteStore>((set, get) => {
  // Core mutation: produce with patches, push to history
  function _apply(updater: (draft: SiteSchema) => void): void {
    const current = get().schema;
    const [next, patches, inversePatches] = produceWithPatches(
      current,
      updater,
    );
    if (patches.length === 0) return; // nothing changed

    set((state) => ({
      schema: next,
      past:   [...state.past.slice(-MAX_HISTORY + 1), { patches, inversePatches }],
      future: [],  // any new action wipes the redo stack
    }));
  }

  return {
    schema:          initialSchema,
    hydrated:        false,
    past:            [],
    future:          [],
    // Always open a real editor when a saved portfolio is restored.
    selectedBlockId: null,

    // ── Block mutations ────────────────────────────────────────────────────
    updateBlock(id, updater) {
      _apply((draft) => {
        const block = draft.blocks.find((b) => b.id === id);
        if (block) updater(block);
      });
    },

    addBlock(block) {
      _apply((draft) => {
        draft.blocks.push(block);
      });
    },

    removeBlock(id) {
      _apply((draft) => {
        const idx = draft.blocks.findIndex((b) => b.id === id);
        if (idx !== -1) draft.blocks.splice(idx, 1);
      });
      // Deselect if we removed the selected block
      if (get().selectedBlockId === id) {
        set({ selectedBlockId: null });
      }
    },

    duplicateBlock(id) {
      _apply((draft) => {
        const idx = draft.blocks.findIndex((b) => b.id === id);
        if (idx === -1) return;
        const original = draft.blocks[idx];
        if (!original) return;
        // New UUID for the duplicate
        const clone = {
          ...original,
          id: generateId(),
        } as Block;
        draft.blocks.splice(idx + 1, 0, clone);
      });
    },

    reorderBlocks(fromIndex, toIndex) {
      _apply((draft) => {
        const [moved] = draft.blocks.splice(fromIndex, 1);
        if (moved) draft.blocks.splice(toIndex, 0, moved);
      });
    },

    updateTheme(updater) {
      _apply((draft) => {
        updater(draft.theme);
      });
    },

    updateMeta(meta) {
      _apply((draft) => {
        if (meta.title !== undefined) draft.metaTitle = meta.title;
        if (meta.desc !== undefined) draft.metaDesc = meta.desc;
        if (meta.lang !== undefined) draft.lang = meta.lang;
      });
    },

    updateExperience(patch) {
      _apply((draft) => {
        Object.assign(draft.experience, patch);
      });
    },

    setSchema(schema) {
      // Full schema replacement (e.g. GitHub import, share link) — still tracked
      _apply((draft) => {
        Object.assign(draft, schema);
      });
    },

    hydrateFromStorage() {
      if (get().hydrated) return;
      const schema = loadSavedSchema();
      set({ schema, selectedBlockId: schema.blocks[0]?.id ?? null, past: [], future: [], hydrated: true });
    },

    resetSite() {
      _apply((draft) => {
        const empty = getEmptySchema();
        Object.assign(draft, empty);
      });
      set({ selectedBlockId: null });
    },

    // ── History ────────────────────────────────────────────────────────────
    undo() {
      const { past, schema, future } = get();
      const last = past[past.length - 1];
      if (!last) return;

      const prev = applyPatches(schema, last.inversePatches);
      set({
        schema: prev,
        past:   past.slice(0, -1),
        future: [last, ...future],
      });
    },

    redo() {
      const { future, schema, past } = get();
      const next = future[0];
      if (!next) return;

      const redone = applyPatches(schema, next.patches);
      set({
        schema: redone,
        past:   [...past, next],
        future: future.slice(1),
      });
    },

    // ── Selection ──────────────────────────────────────────────────────────
    selectBlock(id) {
      set({ selectedBlockId: id });
    },

    getSchema() {
      return get().schema;
    },
  };
});
