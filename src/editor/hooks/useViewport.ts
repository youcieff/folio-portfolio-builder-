import { useState, useCallback } from "react";

export type Viewport = "desktop" | "tablet" | "mobile";

const VIEWPORT_WIDTHS: Record<Viewport, number | undefined> = {
  desktop: undefined,  // full width
  tablet:  768,
  mobile:  390,
};

export function useViewport(): {
  viewport: Viewport;
  canvasWidth: number | undefined;
  setViewport: (v: Viewport) => void;
} {
  const [viewport, setViewport] = useState<Viewport>("desktop");

  const handleSet = useCallback((v: Viewport) => setViewport(v), []);

  return {
    viewport,
    canvasWidth: VIEWPORT_WIDTHS[viewport],
    setViewport: handleSet,
  };
}
