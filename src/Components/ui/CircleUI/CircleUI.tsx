import { useImperativeHandle, useMemo } from "react";
import { forwardRef, useRef } from "react";
import styles from './CircleUI.module.scss';
import { getCirclePath } from "./utils";

interface TCircleUIProps {
    "radius": number
};

const CircleUI = forwardRef<SVGPathElement, TCircleUIProps>(({radius}, ref) => {
    const diameter = radius * 2;
    const circleRef = useRef<SVGPathElement | null>(null);
    useImperativeHandle(ref, () => circleRef.current!);
    const circlePath = useMemo(() => (radius:number) => getCirclePath(radius, radius, radius), [radius]);
    return (
        <svg className={styles.container} width={diameter} height={diameter} viewBox={`0 0 ${diameter} ${diameter}`}>
            <path
                ref={circleRef}
                d={circlePath(radius)}
                className={styles.path}
            />
        </svg>
  )
})

export default CircleUI;