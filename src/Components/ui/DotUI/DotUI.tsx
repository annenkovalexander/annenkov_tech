import { forwardRef } from "react";
import styles from './DotUI.module.scss';
import clsx from "clsx";
import type { Period } from "../../../services/api/getEvents";

interface DotUIProps {
    text: string;
    isActive: boolean;
    dotCoordinates: {
        x: number;
        y: number;
    };
    dotRadius: number;
    dotDiameter: number;
    circleRadius: number;
    circleDiameter: number;
    strokeWidth: number;
    period: Period;
    onClick?: () => void;
}

const DotUI = forwardRef<HTMLDivElement, DotUIProps>(({
    text, 
    isActive, 
    dotCoordinates, 
    period,
    dotRadius,
    dotDiameter,
    circleRadius,
    circleDiameter,
    strokeWidth,
    onClick
}, ref) => (
        <div 
            ref={ref}
            className={styles.container} 
            onClick={onClick}
            style={{
                position: 'absolute',
                '--dot-top': `${dotCoordinates.x}px`, 
                '--dot-left': `${dotCoordinates.x}px`, 
            } as React.CSSProperties}
        >
            <div className={styles.dotContainer}>
                <svg width={dotRadius * 2} height={dotRadius * 2} viewBox={`0 0 ${dotDiameter} ${dotDiameter}`}>
                    <circle
                        cx={dotRadius}
                        cy={dotRadius}
                        r={dotRadius - (1 / 2)}
                        strokeWidth={strokeWidth}
                    />
                </svg>
            </div>
            <div className={clsx([styles.circleContainer, isActive ? styles.circleContainerVisible : ''])}>
                <svg width={circleDiameter} height={circleDiameter} viewBox={`0 0 ${circleDiameter} ${circleDiameter}`}>
                    <circle
                        cx={circleRadius}
                        cy={circleRadius}
                        r={circleRadius - (1 / 2)}
                        strokeWidth={strokeWidth}
                    />
                </svg>
                <p className={styles.periodNumber}>{period.periodText}</p>
                <p className={styles.periodText}>{text}</p>
            </div>
        </div>
        
    ));

export default DotUI;