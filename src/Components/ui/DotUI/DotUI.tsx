import { forwardRef } from 'react';
import styles from './DotUI.module.scss';
import clsx from 'clsx';
import type { Period } from '../../../services/api/getEvents';

interface DotUIProps {
    text: string;
    isActive: boolean;
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
    period,
    dotRadius,
    dotDiameter,
    circleRadius,
    circleDiameter,
    strokeWidth,
    onClick,
}, ref) => (
    <div
        ref={ref}
        className={styles.container}
        onClick={onClick}
    >
        <button
            type="button"
            className={styles.dotContainer}
            onClick={onClick}
        >
            <svg
                width={dotRadius * 2}
                height={dotRadius * 2}
                viewBox={`0 0 ${dotDiameter} ${dotDiameter}`}
            >
                <circle
                    cx={dotRadius}
                    cy={dotRadius}
                    r={dotRadius - strokeWidth / 2}
                    strokeWidth={strokeWidth}
                />
            </svg>
        </button>

        <button
            type="button"
            className={clsx(
                styles.circleContainer,
                isActive && styles.circleContainerVisible,
            )}
            onClick={onClick}
        >
            <svg
                width={circleDiameter}
                height={circleDiameter}
                viewBox={`0 0 ${circleDiameter} ${circleDiameter}`}
            >
                <circle
                    cx={circleRadius}
                    cy={circleRadius}
                    r={circleRadius - strokeWidth / 2}
                    strokeWidth={strokeWidth}
                />
            </svg>

            <p className={styles.periodNumber}>{period.periodText}</p>
            <p className={styles.periodText}>{text}</p>
        </button>
    </div>
));

export default DotUI;