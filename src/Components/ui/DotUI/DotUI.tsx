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

    const dotOffset = (containerDiameter - dotRadius * 2) / 2;
    const circleOffset = strokeWidth / 2;

    return (
        <div
            ref={ref}
            className={styles.container}
        >
            <div
                className={styles.dotContainer}
                aria-hidden="true"
            >
                <svg
                    width={containerDiameter}
                    height={containerDiameter}
                    viewBox={`0 0 ${containerDiameter} ${containerDiameter}`}
                >
                    <circle
                        cx={dotOffset + dotRadius}
                        cy={dotOffset + dotRadius}
                        r={dotRadius}
                        strokeWidth={strokeWidth}
                    />
                </svg>
            </div>

            <button
                type="button"
                className={clsx(
                    styles.circleContainer,
                    isActive && styles.circleContainerVisible,
                )}
                onClick={onClick}
                aria-label={text}
            >
                <svg
                    width={containerDiameter + strokeWidth}
                    height={containerDiameter + strokeWidth}
                    viewBox={`0 0 ${containerDiameter + strokeWidth} ${containerDiameter + strokeWidth}`}
                >
                    <circle
                        cx={circleOffset + circleRadius}
                        cy={circleOffset + circleRadius}
                        r={circleRadius}
                        strokeWidth={strokeWidth}
                    />
                </svg>

                <p className={styles.periodNumber}>{periodText}</p>
                <p className={styles.periodText}>{text}</p>
            </button>
        </div>

    );
});

export default DotUI;