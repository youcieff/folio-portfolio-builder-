import { z } from "zod";
import { SiteSchemaV1, type SiteSchema } from "./site";

// ─── Migration entry point ─────────────────────────────────────────────────────
// All data from outside (localStorage, URL hash, imported JSON) passes through
// here before touching the store. Unknown version or shape → graceful fallback.

export function migrate(raw: unknown): SiteSchema {
  // Let Zod do the heavy lifting; it coerces defaults automatically.
  const result = SiteSchemaV1.safeParse(raw);
  if (result.success) {
    return result.data;
  }

  // If the input had a `version` we don't recognise yet, add a branch here:
  // if (typeof raw === 'object' && raw !== null && (raw as Record<string, unknown>).version === 2) { ... }

  // Irrecoverable — caller must handle this null case and show a friendly message
  return null as never;
}

// Typed, safe parse — returns data or null (no exceptions thrown to callers)
export function parseSite(raw: unknown): SiteSchema | null {
  const result = SiteSchemaV1.safeParse(raw);
  return result.success ? result.data : null;
}

// ─── Re-export everything from one place ──────────────────────────────────────
export * from "./theme";
export * from "./blocks";
export * from "./site";
export { z };
