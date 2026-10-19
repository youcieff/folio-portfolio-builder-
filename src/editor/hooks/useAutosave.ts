import { useEffect, useRef, useState } from "react";
import { useSiteStore } from "../store/useSiteStore";

const STORAGE_KEY = "folio:schema:v2";
const DEBOUNCE_MS = 800;
export type SaveStatus = "saved" | "saving" | "error";

/** Persist edits locally and expose storage failures to the editor UI. */
export function useAutosave(): SaveStatus {
  const [status, setStatus] = useState<SaveStatus>("saved");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Restore only after hydration. Reading localStorage while the store module
    // initializes makes the server render an empty editor and the browser render
    // saved sections, which triggers a React hydration mismatch.
    useSiteStore.getState().hydrateFromStorage();
    const persist = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(useSiteStore.getState().schema));
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    };
    persist();
    const unsubscribe = useSiteStore.subscribe(() => {
      setStatus("saving");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(persist, DEBOUNCE_MS);
    });
    const flush = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      persist();
    };
    window.addEventListener("pagehide", flush);
    return () => {
      unsubscribe();
      window.removeEventListener("pagehide", flush);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  return status;
}
