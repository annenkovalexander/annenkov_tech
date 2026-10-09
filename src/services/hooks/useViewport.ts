import { useEffect, useState, useRef } from "react"

export type Viewport = {
    width: number
}

const parsedDefaultWidth = Number(process.env.DEFAULT_DESKTOP_WIDTH);
const DEFAULT_DESKTOP_WIDTH = !Number.isNaN(parsedDefaultWidth) && Number.isFinite(parsedDefaultWidth) ? parsedDefaultWidth : 1440;

export function useViewport() {
  const [viewport, setViewport] = useState<Viewport>({
    width: DEFAULT_DESKTOP_WIDTH
  });
  console.log(`DEFAULT_DESKTOP_WIDTH ${DEFAULT_DESKTOP_WIDTH}`)
  const lastWidthRef = useRef(DEFAULT_DESKTOP_WIDTH);

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