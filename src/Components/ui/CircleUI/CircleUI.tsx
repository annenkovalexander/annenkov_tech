import React, { RefObject, useImperativeHandle } from "react";
import { forwardRef, useEffect, useRef } from "react";
import styles from './CircleUI.module.scss';

interface TCircleUIProps {
    "radius": number
};

const circlePath: (cx: number, cy: number, r: number) => string = (cx, cy, r) => `
        M ${cx + r} ${cy}
        A ${r} ${r} 0 1 1 ${cx - r} ${cy}
        A ${r} ${r} 0 1 1 ${cx + r} ${cy}
    `

const CircleUI = forwardRef<SVGPathElement, TCircleUIProps>(({radius}, ref) => {
    const diameter = radius * 2;
    const circleRef = useRef<SVGPathElement | null>(null);
    useImperativeHandle(ref, () => circleRef.current!);
    return (
        <svg className={styles.container} width={diameter} height={diameter} viewBox={`0 0 ${diameter} ${diameter}`}>
            <path
                ref={circleRef}
                d={circlePath(radius, radius, radius)}
                fill="none"
                stroke={'#42567a'}
                strokeWidth={1}
                strokeOpacity={0.1}
            />
        </svg>
  )
})

export default CircleUI;