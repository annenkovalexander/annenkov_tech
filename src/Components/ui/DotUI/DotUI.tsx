import { forwardRef, useEffect } from "react";
import styles from './DotUI.module.scss';
import clsx from "clsx";
import type { TRefsObject } from "../../Circle/Circle";
import type { Period } from "../../../services/api/getEvents";
import gsap from 'gsap';

interface DotUIProps {
    text: string;
    isActive: boolean;
    dotCoordinates: {
        x: number;
        y: number;
    };
    period: Period;
}



const DotUI = forwardRef<HTMLDivElement, DotUIProps>(({text, isActive, dotCoordinates, period}, ref) => {
    const dotRadius = 3.5;
    const hoverCircleRadius = 10;
    const dotDiameter = dotRadius * 2;
    const circleRadius = 28;
    const circleDiameter = circleRadius * 2;

    return (
        <div ref={ref} className={styles.container} style={{position: "absolute", top: `${dotCoordinates.y}px`, left: `${dotCoordinates.x}px`, width: "10px", height: "10px", transform: 'translate(-50%, -50%)' }}>
            <div className={styles.dotContainer}>
                <svg width={dotRadius * 2} height={dotRadius * 2} viewBox={`0 0 ${dotDiameter} ${dotDiameter}`}>
                    <circle
                        cx={dotRadius}
                        cy={dotRadius}
                        r={dotRadius - (1 / 2)}
                        fill={"#42567a"}
                        stroke={"#42567a"}
                        strokeWidth={1}
                    />
                </svg>
            </div>
            <div className={clsx([styles.circleContainer, isActive ? styles.circleContainerVisible : ''])}>
                <svg width={circleDiameter} height={circleDiameter} viewBox={`0 0 ${circleDiameter} ${circleDiameter}`}>
                    <circle
                        cx={circleRadius}
                        cy={circleRadius}
                        r={circleRadius - (1 / 2)}
                        fill={"white"}
                        stroke={"#42567a"}
                        strokeWidth={1}
                    />
                </svg>
                <p className={styles.periodNumber}>{period.periodId}</p>
                <p className={styles.periodText}>{text}</p>
            </div>

        </div>
    )
})

export default DotUI;