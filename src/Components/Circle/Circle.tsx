import { useCallback, useEffect, useRef, useState } from "react";
import CircleUI from "../ui/CircleUI/CircleUI";
import DotUI from "../ui/DotUI/DotUI";
import { useDispatch, useSelector } from "../../../src/services/store";
import { getCurrentPeriod, periodChange, getPeriods } from "../../../src/services/slices/periodsSlice";
import { SvgHorizontalLineUI, SvgVerticalLineUI } from "../ui/SVGLineUI/SVGLineUI";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useViewport } from "../../services/hooks/useViewport";
import type { Viewport } from "../../services/hooks/useViewport";

type RefElement<T> = {
    element: T,
    periodId: string,
    position: number
}

export type TRefsObject<T> = {
    newPositions: number[],
    refElements: RefElement<HTMLDivElement>[]
}

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(MotionPathPlugin);

const getCenterX: (viewport: Viewport) => number = (viewPort) => (Math.min(1440, viewPort.width) / 2 - getCircleRadius(viewPort));

const getCenterY: (viewport: Viewport) => number = (viewPort) => 480 / 1440 * Math.min(1440, viewPort.width) - getCircleRadius(viewPort) - 50 * (Math.min(1440, viewPort.width) - 1440) / 720;




const getPercentageByDotIndex: (dotIndex: number, dotsLength: number) => number = (dotIndex, dotsLength) => (dotIndex/dotsLength);

const getCircleRadius: (viewport: Viewport) => number = (viewPort) => 530 / 1440 * Math.min(1440, viewPort.width) / 2;

const getDelta: (element: RefElement<HTMLDivElement>, periodsLength: number) => number = (el, periodsLength) => {
    const position = Math.abs(el.position % periodsLength);
    if (Math.abs(position - periodsLength) < position) {
        return (periodsLength - position);
    } else {
        return -position;
    }
}

const getNewPositions: (
        refsArray: React.MutableRefObject<TRefsObject<HTMLDivElement>>, 
        delta: number,
        periodsLength: number
    ) => number[] = (refsArray, delta, periodsLength) => {
    const newPositions: number[] = [];
    let currentPosition: number = 0;
    refsArray.current.refElements.forEach((element) => {
        currentPosition = element.position + delta;
        if (currentPosition < 0) {
            currentPosition += periodsLength;
        }
        currentPosition = Math.abs(currentPosition % periodsLength);
        newPositions.push(currentPosition);
    })
    return newPositions;
}

const getDotCoordinates: (
    dotsNumber: number, 
    dotIndex: number, 
    radius: number
) => { x: number, y: number } = (dotsNumber, dotIndex, radius) => {
    const position = dotIndex / dotsNumber;
    const angle = position * 2 * Math.PI;
    
    const xCoordinate = radius + radius * Math.cos(angle);
    const yCoordinate = radius + radius * Math.sin(angle);
    
    return {
        x: xCoordinate,
        y: yCoordinate
    }
}

const Circle: React.FC = () => {
    const viewPort = useViewport();
    const centerX = getCenterX(viewPort);
    const centerY = getCenterY(viewPort);
    const circleRadius = getCircleRadius(viewPort);
    const currentPeriod = useSelector(getCurrentPeriod)
    const container = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement | null>(null);
    const refsArray = useRef<TRefsObject<HTMLDivElement>>({
        refElements: [],
        newPositions: []
    });
    
    const dispatch = useDispatch();
    const periods = useSelector(getPeriods)

    const [animationVersion, setAnimationVersion] = useState(0);


    const handleDotClick = useCallback((el: RefElement<HTMLDivElement>) => () => {
        if (!refsArray.current)
            return;
        const delta: number = getDelta(el, refsArray.current.refElements.length);
        const newPositions = getNewPositions(refsArray, delta, periods.length);
        
        refsArray.current.refElements.forEach((element: RefElement<HTMLDivElement>, index: number) => {
            const isTargetPeriod = element.periodId === el.periodId;
            
            gsap.to(element.element, {
                duration: 1,
                repeat: 0,
                ease: "none",
                motionPath: {
                    path: pathRef.current!,
                    align: pathRef.current!,
                    autoRotate: false,
                    start: getPercentageByDotIndex(element.position, periods.length),
                    end: getPercentageByDotIndex(
                        element.position + delta,
                        periods.length
                    )
                },
                onStart: () => {
                    if (isTargetPeriod) {
                        dispatch(periodChange({periodId: el.periodId}))
                    }
                },
                onComplete: () => {
                    element.position = isTargetPeriod ? 0 : newPositions[index];
                }
            });
        });
        }, [dispatch, periods.length])

    
    useGSAP((_, contextSafe) => {
        if (!pathRef.current)
            return;
        const handlers = refsArray.current.refElements.map((el) => {
            const handler = contextSafe!(handleDotClick(el));
            el.element.addEventListener('click', handler);
            return {
                element: el.element,
                handler,
            }
        })

        return () => {
            handlers.forEach(({element, handler}) => {
                element.removeEventListener('click', handler);
            })
        }
    },{ scope: container, dependencies: [circleRadius, refsArray.current?.refElements.length]})

    useEffect(() => {
        if (!pathRef.current || !refsArray.current?.refElements.length)
            return;
        const element = refsArray.current.refElements.find((element) => element.periodId === currentPeriod)
        if (element)
            handleDotClick(element)();
        return 
    }, [currentPeriod, handleDotClick, circleRadius]);

    const addElementToRefs = (index: number, periodId: string) => (el: HTMLDivElement) => {
        if (el && !refsArray.current?.refElements.map((item) => item.periodId).includes(periodId))
            refsArray.current?.refElements.push({
                element: el,
                periodId: periodId,
                position: index
            })
    }
    return (
        <>
            <div ref={container} style={{position: "absolute", top: `${centerY}px`, left: `${centerX}px`, transform: 'none', transformOrigin: 'center'}}>
                <SvgHorizontalLineUI x1={-viewPort.width} y1={circleRadius} x2={viewPort.width} y2={circleRadius}/>
                <SvgVerticalLineUI x1={circleRadius} y1={-viewPort.height} x2={circleRadius} y2={viewPort.height}/>
                <CircleUI ref={pathRef} radius={circleRadius} />
                {periods.map((period, index) => {
                    const dotCoordinates = getDotCoordinates(periods.length, refsArray.current?.refElements[index]?.position ?? index, circleRadius)
                    const distance = Math.sqrt(dotCoordinates.x ** 2 + dotCoordinates.y ** 2)
                    return <DotUI 
                        ref={addElementToRefs(index, period.periodId)} 
                        key={index} 
                        text={period.category} 
                        dotCoordinates={dotCoordinates}
                        period={period}
                        isActive={Number(currentPeriod) === Number(period.periodId)}
                    />
                 }   
                )}
            </div>
        </>
    )
}

export default Circle;
