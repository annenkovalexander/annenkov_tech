import { useImperativeHandle } from "react";
import { forwardRef, useRef } from "react";
import styles from './CircleUI.module.scss';

interface TCircleUIProps {
    "radius": number
};

const circlePath: (cx: number, cy: number, r: number) => string = (cx, cy, r) => {
    // Начать с 1 часа (30° от верха по часовой стрелке)
    const startAngle = -Math.PI / 3;  // -60° = 1 час
    
    const startX = cx + r * Math.cos(startAngle);
    const startY = cy + r * Math.sin(startAngle);
    
    // Середина круга: startAngle + π
    const midX = cx + r * Math.cos(startAngle + Math.PI);
    const midY = cy + r * Math.sin(startAngle + Math.PI);
    
    // Две дуги: от start до mid, от mid до start
    return `M ${startX} ${startY} A ${r} ${r} 0 1 1 ${midX} ${midY} A ${r} ${r} 0 1 1 ${startX} ${startY}`
}

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