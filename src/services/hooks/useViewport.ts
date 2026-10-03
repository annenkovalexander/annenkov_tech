import { useEffect, useState, useRef } from "react"

export type Viewport = {
    width: number,
    height: number
}

const getViewport: () => Viewport = () => (
    {
        width: typeof window === "undefined" ? 1440 : window.innerWidth,
        height: typeof window === "undefined" ? 900 : window.innerHeight
    }
)

export function useViewport() {
  const [viewport, setViewport] = useState<Viewport>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  });

  const lastWidthRef = useRef(viewport.width);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      // Обновляем только если изменилась ширина
      // Игнорируем изменения высоты на мобильных
      if (newWidth === lastWidthRef.current) {
        return;
      }
      
      lastWidthRef.current = newWidth;
      setViewport({ width: newWidth, height: newHeight });
    };

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