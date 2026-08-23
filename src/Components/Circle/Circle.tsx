import { RefObject, useEffect, useRef, useState } from "react";
import CircleUI from "../ui/CircleUI/CircleUI";
import { dot } from "node:test/reporters";
import DotUI from "../ui/DotUI/DotUI";
import { useDispatch, useSelector } from "../../../src/services/store";
import { getCurrentPeriod, periodChange, getDots, dotsChange } from "../../../src/services/slices/periodsSlice";
import RectangleUI from "../ui/RectangleUI/RectangleUI";
import { SvgHorizontalLineUI, SvgVerticalLineUI } from "../ui/SVGLineUI/SVGLineUI";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

type RefElement<T> = {
    element: T,
    periodId: string,
    position: number
}

type TRefsObject<T> = {
    newPositions: number[],
    refElements: RefElement<HTMLDivElement>[]
}

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(MotionPathPlugin);

const getCenterX = () => (Math.min(1440, window.innerWidth) / 2 - getCircleRadius());

const getCenterY = () => 480 / 1440 * Math.min(1440, window.innerWidth) - getCircleRadius() - 50 * (Math.min(1440, window.innerWidth) - 1440) / 720;

const getDotCoordinates: (a: number, dotIndex:number, radius: number, containerXShift: number, containerYShift: number) => {x: number, y: number}  = (dotsNumber, dotIndex, radius) => {
    const circleCenterXCoordinate = radius;
    const circleCenterYCoordinate = radius;
    const xCoordinate = circleCenterXCoordinate + radius * Math.sin(2 * Math.PI * dotIndex / dotsNumber - 1 / 3 * Math.PI) - 3;
    const yCoordinate = circleCenterYCoordinate + radius * Math.cos(2 * Math.PI * dotIndex / dotsNumber - 1 / 3 * Math.PI) - 3;
    return {
        x: xCoordinate,
        y: yCoordinate
    }
}

const getPercentageByDotIndex: (dotIndex: number, dotsLength: number) => number = (dotIndex, dotsLength) => (dotIndex/dotsLength) - 1 / 6;

const getCircleRadius = () => 530 / 1440 * Math.min(1440, window.innerWidth) / 2;

const getPositionByPeriodId: (clickPeriodId: string, periodId: string, refsArray: RefElement<HTMLDivElement>[], isStart: boolean) => number  = (clickPeriodId, periodId, refsArray, isStart) => {
    let resultPosition = 0;
    let clickPeriodPosition = 0;
    refsArray.forEach((element: RefElement<HTMLDivElement>, index: number) => {
        if (element.periodId === periodId)
            resultPosition = element.position;
    });
    refsArray.forEach((element: RefElement<HTMLDivElement>, index: number) => {
        if (element.periodId === clickPeriodId)
            clickPeriodPosition = element.position;
    })
    return resultPosition - clickPeriodPosition;       
}

const Circle: React.FC = () => {
    const container = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement | null>(null);
    const refsArray = useRef<TRefsObject<HTMLDivElement>>({
        refElements: [],
        newPositions: []
    });
    const [centerX, setCenterX] = useState(getCenterX());
    const [centerY, setCenterY] = useState(getCenterY());
    const [circleRadius, setCircleRadius] = useState(getCircleRadius());
    const [width, setWidth] = useState(window.innerWidth);
    const dispatch = useDispatch();
    const handleDotClick = (el: RefElement<HTMLDivElement>) => () => {
        if (!refsArray.current)
            return;
        refsArray.current.refElements.forEach((element: RefElement<HTMLDivElement>, index: number, refElements: RefElement<HTMLDivElement>[]) => {
            gsap.to(element.element, {
                duration: 1,
                repeat: 0,
                ease: "none",
                motionPath: {
                    path: pathRef.current!,
                    align: pathRef.current!,
                    autoRotate: false,
                    start: getPercentageByDotIndex(element.position, dots.length),
                    end: getPercentageByDotIndex(getPositionByPeriodId(el.periodId, element.periodId, refsArray.current!.refElements, false), dots.length)
                },
                onStart: () => {
                    if (index === 0) 
                        dispatch(periodChange({periodIndex: el.periodId}))
                },
                onComplete: () => {
                    refsArray.current.newPositions.push((dots.length +  getPositionByPeriodId(el.periodId, element.periodId, refsArray.current!.refElements, false)) % dots.length);
                    if (index === refElements.length - 1) {
                        refsArray.current.refElements.forEach((element: RefElement<HTMLDivElement>, index: number) => {
                            element.position = refsArray.current.newPositions[index];
                        })
                        refsArray.current.newPositions = [];
                    }
                   
                }
            });
        });
    }
    const currentPeriod = useSelector(getCurrentPeriod);
    const dots = useSelector(getDots);
    const setCircleRadiusHandler = () => {
        setCircleRadius(getCircleRadius());
        setCenterX(getCenterX());
        setCenterY(getCenterY());
        setWidth(window.innerWidth);
    }
    useEffect(()=>{
        window.addEventListener('resize', setCircleRadiusHandler);
        return () => {
            window.removeEventListener('resize', setCircleRadiusHandler);
        }
    })
    useGSAP((context, contextSafe) => {
        if (!pathRef.current) return;
        const element = refsArray.current?.refElements.filter((element) => Number(element.periodId) === currentPeriod)[0];
        handleDotClick(element)();
        refsArray.current?.refElements.forEach((el) => {
            el.element.addEventListener('click', contextSafe!(handleDotClick(el)));
            
        })
        return () => {
            refsArray.current?.refElements.forEach((el, index) => {
                el.element.removeEventListener('click', contextSafe!(handleDotClick(el)));
            })
        }
    },{ scope: container, dependencies: [currentPeriod]})

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
            <div ref={container} style={{position: "absolute", top: `${centerY}px`, left: `${centerX}px`}}>
                <SvgHorizontalLineUI x1={-width} y1={circleRadius} x2={width} y2={circleRadius}/>
                <SvgVerticalLineUI x1={circleRadius} y1={-window.innerHeight} x2={circleRadius} y2={window.innerHeight}/>
                <CircleUI ref={pathRef} radius={circleRadius} />
                {dots.map((dot, index) => {
                    const dotCoordinates = getDotCoordinates(dots.length, index, circleRadius, centerX, centerY);
                    return <DotUI ref={addElementToRefs(index, dot.periodId)} key={index} text={dot.dotDescription} centerX={dotCoordinates.x} centerY={dotCoordinates.y} periodNumber={Number(dot.periodId)} isActive={Number(currentPeriod) === Number(dot.periodId)}/>
                })}
            </div>
        </>
    )
}

export default Circle;