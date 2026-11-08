import { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './DotUI.module.scss';

interface DotUIProps {
    text: string;
    isActive: boolean;
    dotRadius: number;
    circleRadius: number;
    strokeWidth: number;
    periodText: string;
    onClick?: () => void;
}

const DotUI = forwardRef<HTMLDivElement, DotUIProps>(({
    text,
    isActive,
    periodText,
    dotRadius,
    circleRadius,
    strokeWidth,
    onClick,
}, ref) => {
    const containerDiameter = circleRadius * 2 + strokeWidth;
    const dotCenter = containerDiameter / 2;
    const circleCenter = (containerDiameter + strokeWidth) / 2;

    return (
        <div
            ref={ref}
            className={clsx(
                styles.container,
                isActive && styles.circleContainerVisible,
            )}
        >
            <button
                type="button"
                className={styles.dotContainer}
                onClick={onClick}
            >
                <svg
                    className={styles.dotVisual}
                    width={containerDiameter}
                    height={containerDiameter}
                    viewBox={`0 0 ${containerDiameter} ${containerDiameter}`}
                    aria-hidden="true"
                >
                    <circle
                        cx={dotCenter}
                        cy={dotCenter}
                        r={dotRadius}
                        strokeWidth={strokeWidth}
                    />
                </svg>

                <svg
                    className={styles.circleVisual}
                    width={containerDiameter + strokeWidth}
                    height={containerDiameter + strokeWidth}
                    viewBox={`0 0 ${containerDiameter + strokeWidth} ${containerDiameter + strokeWidth}`}
                    aria-hidden="true"
                >
                    <circle
                        cx={circleCenter}
                        cy={circleCenter}
                        r={circleRadius}
                        strokeWidth={strokeWidth}
                    />
                </svg>

                <span className={styles.periodNumber}>{periodText}</span>
                <span className={styles.periodText}>{text}</span>
            </button>
        </div>
    );
});

export default DotUI;