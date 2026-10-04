import { useEffect, useState, useRef } from "react"

export type Viewport = {
    width: number
}

export function useViewport() {
  const [viewport, setViewport] = useState<Viewport>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440
  });

  const lastWidthRef = useRef(viewport.width);

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