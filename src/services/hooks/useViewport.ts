import { useEffect, useState } from "react"

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

export const useViewport: () => Viewport = () => {
    const [viewPort, setViewPort] = useState<Viewport>(getViewport)
    useEffect(() => {
        const handleResize = () => {
            setViewPort({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    })
    return viewPort;
}