import type { UUID } from "crypto";
import type { Viewport } from "../../services/hooks/useViewport";


const VIEWPORT_CONFIG = {
    MAX_WIDTH: 1440,
    INTRINSIC_HEIGHT: 720,
    MAX_DESKTOP_WIDTH: 480,
    CIRCLE_BREAKPOINT: 530,
    DELTA_COEFFICIENT_Y: 50
}

export const DOT_CONFIG = {
    DOT_RADIUS: 3.5, 
    CIRCLE_RADIUS: 28,
    STROKE_WIDTH: 1
}


export type RefElement<T = HTMLElement> = {
    element: T,
    periodId: UUID,
    position: number
}


export type TRefsObject<T> = {
    newPositions: number[],
    refElements: RefElement<T>[]
}

export const getCenterY = (viewport: Viewport): number => {
    const width = Math.min(VIEWPORT_CONFIG.MAX_WIDTH, viewport.width);
    const radius = (VIEWPORT_CONFIG.CIRCLE_BREAKPOINT / VIEWPORT_CONFIG.MAX_WIDTH) * (width / 2);
    return (
        VIEWPORT_CONFIG.MAX_DESKTOP_WIDTH / VIEWPORT_CONFIG.MAX_WIDTH * width - 
        radius - 
        VIEWPORT_CONFIG.DELTA_COEFFICIENT_Y * (width - VIEWPORT_CONFIG.MAX_WIDTH) / VIEWPORT_CONFIG.INTRINSIC_HEIGHT
    );
};


export const getPercentageByDotIndex = (dotIndex: number, dotsLength: number): number => 
    dotIndex / dotsLength;


export const getCircleRadius = (viewport: Viewport): number => {
    const width = Math.min(VIEWPORT_CONFIG.MAX_WIDTH, viewport.width);
    return (VIEWPORT_CONFIG.CIRCLE_BREAKPOINT / VIEWPORT_CONFIG.MAX_WIDTH) * (width / 2);
};


export const getDelta = (element: RefElement<HTMLDivElement>, periodsLength: number): number => {
    const position = Math.abs(element.position % periodsLength);
    return Math.abs(position - periodsLength) < position 
        ? (periodsLength - position) 
        : -position;
};


export const getNewPositions = (
    refsArray: React.MutableRefObject<TRefsObject<HTMLDivElement>>, 
    delta: number,
    periodsLength: number
): number[] => refsArray.current.refElements.map((element) => {
        const currentPosition = (element.position + delta) % periodsLength;
        return currentPosition < 0 ? currentPosition + periodsLength : currentPosition;
    });


export const getDotCoordinates = (
    dotsNumber: number, 
    dotIndex: number, 
    radius: number
): { x: number; y: number } => {
    const position = dotIndex / dotsNumber;
    const angle = position * 2 * Math.PI;
    
    const xCoordinate = radius + radius * Math.cos(angle);
    const yCoordinate = radius + radius * Math.sin(angle);
    
    return {
        x: xCoordinate,
        y: yCoordinate
    };
};