import { useEffect, useState, useRef } from "react";

export type Viewport = {
    width: number
};

const DEFAULT_DESKTOP_WIDTH = (() => {
  if (typeof process !== 'undefined' && process.env?.DEFAULT_DESKTOP_WIDTH) {
    const parsed = Number(process.env.DEFAULT_DESKTOP_WIDTH);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return 1440;
})();

export function useViewport() {
  // Initialize with a constant value to prevent hydration mismatch between server and client.
  // The actual window width will be set in useEffect.
  const [viewport, setViewport] = useState<Viewport>({
    width: DEFAULT_DESKTOP_WIDTH,
  });
  
  const lastWidthRef = useRef(DEFAULT_DESKTOP_WIDTH);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      // Обновляем только если изменилась ширина
      if (newWidth === lastWidthRef.current) {
        return;
      }

      lastWidthRef.current = newWidth;
      setViewport({ width: newWidth });
    };

    // Set initial client-side width immediately on mount to synchronize state with reality
    handleResize();

    const visualViewport = window.visualViewport;
    if (visualViewport) {
      visualViewport.addEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (visualViewport) {
        visualViewport.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);
  
  return viewport;
}