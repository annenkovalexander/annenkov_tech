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
  const getInitialWidth = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return DEFAULT_DESKTOP_WIDTH;
  };

  const [viewport, setViewport] = useState<Viewport>(() => ({
    width: getInitialWidth(),
  }));
  
  const lastWidthRef = useRef(getInitialWidth());

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      // Обновляем только если изменилась ширина
      // Игнорируем изменения высоты на мобильных
      if (newWidth === lastWidthRef.current) {
        return;
      }

      lastWidthRef.current = newWidth;
      setViewport({ width: newWidth });
    };

    handleResize();

    // Используем visualViewport для более стабильных значений
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