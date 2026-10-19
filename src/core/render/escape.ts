/**
 * HTML escaping utilities.
 *
 * These are the ONLY functions allowed to produce raw HTML strings.
 * Every piece of user content MUST pass through one of them.
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&":  "&amp;",
  "<":  "&lt;",
  ">":  "&gt;",
  '"':  "&quot;",
  "'":  "&#39;",
};

/** Escape a text node — use for all visible text content. */
export function escapeHtml(raw: string): string {
  return raw.replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch] ?? ch);
}

/** Escape an attribute value (already quoted with "). */
export function escapeAttr(raw: string): string {
  return raw.replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch] ?? ch);
}

/**
 * Sanitise a URL for use in href / src / action attributes.
 *
 * Rejects javascript:, data: (except image data-URIs), vbscript:, and any
 * other non-http(s)/mailto/tel scheme.  Returns "" on rejection so the
 * attribute can be omitted or set to "#".
 */
export function safeHref(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed === "") return "";

  // Allow image data-URIs (used for avatars in exported HTML)
  if (/^data:image\//i.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const scheme = url.protocol.toLowerCase();
    if (["https:", "http:", "mailto:", "tel:"].includes(scheme)) {
      return trimmed;
    }
    return ""; // block javascript:, vbscript:, etc.
  } catch {
    // Relative path — allow only if it starts with / or .
    if (/^[/.#]/.test(trimmed)) return trimmed;
    return "";
  }
}

/**
 * Produce an href attribute string, or empty string if the URL is unsafe.
 * Usage: `${hrefAttr(url)}` inside an <a ...>
 */
export function hrefAttr(url: string): string {
  const safe = safeHref(url);
  return safe ? ` href="${escapeAttr(safe)}"` : "";
}
