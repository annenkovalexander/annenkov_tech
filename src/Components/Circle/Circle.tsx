import { useCallback, useEffect, useRef, useState } from "react";
import CircleUI from "../ui/CircleUI/CircleUI";
import DotUI from "../ui/DotUI/DotUI";
import { useDispatch, useSelector } from "../../../src/services/store";
import { getCurrentPeriod, periodChange, getPeriods } from "../../../src/services/slices/periodsSlice";
import { SvgHorizontalLineUI, SvgVerticalLineUI } from "../ui/SVGLineUI/SVGLineUI";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { getCenterY, getCircleRadius, getDelta, getNewPositions, getPercentageByDotIndex, getDotCoordinates, DOT_CONFIG } from "./utils";
import type { RefElement, TRefsObject } from "./utils";
import { useViewport } from "../../services/hooks/useViewport";
import type { UUID } from "crypto";


gsap.registerPlugin(useGSAP);
gsap.registerPlugin(MotionPathPlugin);


const Circle: React.FC = () => {
    const viewPort = useViewport();
    const centerY = getCenterY(viewPort);
    const circleRadius = getCircleRadius(viewPort);
    const currentPeriod = useSelector(getCurrentPeriod);
    const container = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement | null>(null);
    const refsArray = useRef<TRefsObject<HTMLDivElement>>({
        refElements: [],
        newPositions: []
    });
    
    const dispatch = useDispatch();
    const periods = useSelector(getPeriods);

    const [stableCenterY, setStableCenterY] = useState<number | null>(null);
    const isInitializedRef = useRef(false);

    useEffect(() => {
        if (!isInitializedRef.current) {
            setStableCenterY(centerY);
            isInitializedRef.current = true;
        }
    }, [centerY]);

    const displayCenterY = stableCenterY ?? centerY;

    const handleDotClick = useCallback((id: UUID, position: number) => () => {
        if (!refsArray.current || !pathRef.current)
            return;
            
        const path = pathRef.current;
        
        // Найти элемент по periodId
        const el = refsArray.current.refElements.find(
            (element) => element.periodId === id
        );
        
        if (!el) return;
        
        const delta: number = getDelta(el, refsArray.current.refElements.length);
        const newPositions = getNewPositions(refsArray, delta, periods.length);
        
        refsArray.current.refElements.forEach((element: RefElement<HTMLDivElement>, index: number) => {
            const isTargetPeriod = element.periodId === id;
            
            gsap.killTweensOf(element.element);
            
            gsap.to(element.element, {
                duration: 1,
                repeat: 0,
                ease: "none",
                motionPath: {
                    path: path,
                    align: path,
                    alignOrigin: [0.5, 0.5],
                    autoRotate: false,
                    start: getPercentageByDotIndex(element.position, periods.length),
                    end: getPercentageByDotIndex(
                        element.position + delta,
                        periods.length
                    )
                },
                onStart: () => {
                    if (isTargetPeriod) {
                        dispatch(periodChange({ id }));
                    }
                },
                onComplete: () => {
                    element.position = isTargetPeriod ? 0 : newPositions[index];
                }
            });
        });
    }, [dispatch, periods.length]);


    useEffect(() => {
        if (!pathRef.current || !refsArray.current?.refElements.length)
            return;
            
        const element = refsArray.current.refElements.find(
            (element) => element.periodId === currentPeriod
        );
        
        if (element)
            handleDotClick(element.periodId, element.position)();
    }, [currentPeriod, handleDotClick, circleRadius]);

    const addElementToRefs = (index: number, periodId: UUID) => (el: HTMLDivElement) => {
        if (el && !refsArray.current?.refElements.map((item) => item.periodId).includes(periodId)) {
            refsArray.current?.refElements.push({
                element: el,
                periodId: periodId,
                position: index
            });
        }
    };

    return (
        <>
            <div 
                ref={container} 
                style={{
                    position: "absolute", 
                    top: `${displayCenterY}px`, 
                    left: "50%",
                    transform: `translateX(-50%)`,
                    transformOrigin: 'center'
                }}
            >
                <SvgHorizontalLineUI 
                    x1={-viewPort.width} 
                    y1={circleRadius} 
                    x2={viewPort.width} 
                    y2={circleRadius}
                />
                <SvgVerticalLineUI 
                    x1={circleRadius} 
                    y1={-viewPort.width} 
                    y2={viewPort.width}
                />
                <CircleUI ref={pathRef} radius={circleRadius} />
                {periods.map((period, index) => {
                    const dotCoordinates = getDotCoordinates(
                        periods.length, 
                        refsArray.current?.refElements[index]?.position ?? index, 
                        circleRadius
                    );
                    
                    return (
                        <DotUI 
                            ref={addElementToRefs(index, period.id)} 
                            key={period.id} 
                            text={period.category} 
                            dotCoordinates={dotCoordinates}
                            dotRadius={DOT_CONFIG.DOT_RADIUS}
                            dotDiameter={DOT_CONFIG.DOT_RADIUS * 2}
                            circleRadius={DOT_CONFIG.CIRCLE_RADIUS}
                            circleDiameter={DOT_CONFIG.CIRCLE_RADIUS * 2}
                            strokeWidth={DOT_CONFIG.STROKE_WIDTH}
                            period={period}
                            isActive={currentPeriod === period.id}
                            onClick={handleDotClick(period.id, index)}
                        />
                    );
                })}
            </div>
        </>
    );
};


export default Circle;