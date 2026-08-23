import { RefObject, useEffect, useRef, useState } from "react";
import CircleUI from "../ui/CircleUI/CircleUI";
import { dot } from "node:test/reporters";
import DotUI from "../ui/DotUI/DotUI";
import { useDispatch, useSelector } from "../../../src/services/store";
import { getCurrentPeriod, periodChange, getDots } from "../../../src/services/slices/periodsSlice";
import RectangleUI from "../ui/RectangleUI/RectangleUI";
import { SvgHorizontalLineUI, SvgVerticalLineUI } from "../ui/SVGLineUI/SVGLineUI";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

type RefElement<T> = {
    element: T,
    periodId: string
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


const getCircleRadius = () => 530 / 1440 * Math.min(1440, window.innerWidth) / 2

const Circle: React.FC = () => {
    const container = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement | null>(null);
    const refsArray = useRef<RefElement<HTMLDivElement>[]>([]);
    const [centerX, setCenterX] = useState(getCenterX());
    const [centerY, setCenterY] = useState(getCenterY());
    const [circleRadius, setCircleRadius] = useState(getCircleRadius());
    const [width, setWidth] = useState(window.innerWidth);
    const dispatch = useDispatch();
    
    const { contextSafe } = useGSAP({scope: container});
    const handleDotClick = (el: RefElement<HTMLDivElement>, index: number) => () => {
        
        // gsap.to(el.element, {
        //     duration: 1,
        //     repeat: 0,
        //     ease: "none",
        //     motionPath: {
        //         path: pathRef.current!,
        //         align: pathRef.current!,
        //         // alignOrigin: [1, 0.5],
        //         autoRotate: false,
        //         // start: index / dots.length,
        //         // end: (index - 1) / dots.length
        //         start: 0,
        //         end: 1
        //     }
        //   });

          dispatch(periodChange({periodIndex: el.periodId}))
    }
    const currentPeriod = useSelector(getCurrentPeriod);
    const dots = useSelector(getDots);
    const setCircleRadiusHandler = () => {
        setCircleRadius(getCircleRadius());
        console.log("circleRadius: ", circleRadius);
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
        console.log("useGSAP refsArray: ", refsArray);
        if (!pathRef.current) return;
        refsArray.current.forEach((el, index) => {
            el.element.addEventListener('click', contextSafe!(handleDotClick(el, index)));
            
        })
        return () => {
            refsArray.current.forEach((el, index) => {
                el.element.removeEventListener('click', contextSafe!(handleDotClick(el, index)));
            })
        }
    },{ scope: container, dependencies: [currentPeriod]})

    const addElementToRefs = (periodId: string) => (el: HTMLDivElement) => {
        console.log("addElementToRefs el", el, " index:" , periodId);
        if (el && !refsArray.current.map((item) => item.element).includes(el))
            refsArray.current.push({
                element: el,
                periodId: periodId
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
                    return <DotUI ref={addElementToRefs(dot.periodId)} key={index} text={dot.dotDescription} centerX={dotCoordinates.x} centerY={dotCoordinates.y} periodNumber={Number(dot.periodId)} isActive={index === 0}/>
                })}
            </div>
        </>
    )
}

export default Circle;