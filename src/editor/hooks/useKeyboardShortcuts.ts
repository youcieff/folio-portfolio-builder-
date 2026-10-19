import { useEffect, useCallback } from "react";
import { useSiteStore } from "../store/useSiteStore";

/**
 * Binds Ctrl/Cmd+Z (undo) and Ctrl/Cmd+Shift+Z (redo) globally.
 * Call once at the editor root.
 */
export function useKeyboardShortcuts(): void {
  const undo = useSiteStore((s) => s.undo);
  const redo = useSiteStore((s) => s.redo);

  const handler = useCallback(
    (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      // Don't intercept shortcuts inside text inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault();
        redo();
      }
    },
    [undo, redo],
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}
