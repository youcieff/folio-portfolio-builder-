/**
 * Generates a random ID for blocks and items.
 * We avoid crypto.randomUUID() because it throws in non-secure contexts (e.g. HTTP over LAN).
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for non-secure contexts (HTTP over LAN)
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}
