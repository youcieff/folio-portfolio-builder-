import type { SiteSchema } from "../../core/schema";
import { renderSite } from "../../core/render/renderSite";

/**
 * Export the exact single HTML document used by the live preview.
 * renderSite already includes the document shell, metadata, template CSS,
 * theme overrides, and all portfolio sections.
 */
export function generateExportHtml(schema: SiteSchema): string {
  return renderSite(schema);
}
