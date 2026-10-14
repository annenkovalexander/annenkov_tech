import { forwardRef } from 'react';
import styles from './CircleUI.module.scss';

interface CircleUIProps {
    radius: number;
    pathD: string;
}

const CircleUI = forwardRef<SVGPathElement, CircleUIProps>(
    ({ radius, pathD }, ref) => (
        <svg
            className={styles.container}
            width={radius * 2}
            height={radius * 2}
            viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            fill="none"
        >
            <path
                ref={ref}
                className={styles.path}
                d={pathD}
                color='black'
            />
        </svg>
    ),
);

export default CircleUI;