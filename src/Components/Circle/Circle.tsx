import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import CircleUI from '../ui/CircleUI/CircleUI';
import DotUI from '../ui/DotUI/DotUI';
import { useDispatch, useSelector } from '../../../src/services/store';
import {
    getCurrentPeriod,
    periodChange,
    getPeriods,
} from '../../../src/services/slices/periodsSlice';
import {
    SvgHorizontalLineUI,
    SvgVerticalLineUI,
} from '../ui/SVGLineUI/SVGLineUI';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import {
    getCenterY,
    getCircleRadius,
    getDelta,
    getNewPositions,
    getPercentageByDotIndex,
    DOT_CONFIG,
} from './utils';
import { getCirclePath } from '../ui/CircleUI/utils';
import { useViewport } from '../../services/hooks/useViewport';
import type { UUID } from '../../types/period';
import styles from './Circle.module.scss';


gsap.registerPlugin(MotionPathPlugin);


const Circle: React.FC = () => {
    const viewPort = useViewport();
    const centerY = getCenterY(viewPort);
    const circleRadius = getCircleRadius(viewPort);


    const currentPeriod = useSelector(getCurrentPeriod);
    const periods = useSelector(getPeriods);


    const dispatch = useDispatch();


    const containerRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement | null>(null);


    const dotRefsRef = useRef<Map<UUID, HTMLDivElement>>(new Map());
    const dotPositionsRef = useRef<Map<UUID, number>>(new Map());


    const circlePathD = useMemo(
        () => getCirclePath(circleRadius),
        [circleRadius],
    );


    const { contextSafe } = useGSAP(
        () => {
            // Контекст GSAP для очистки анимаций,
            // создаваемых через contextSafe.
        },
        { scope: containerRef },
    );


    useEffect(() => {
        periods.forEach((period, index) => {
            if (!dotPositionsRef.current.has(period.id)) {
                dotPositionsRef.current.set(period.id, index);
            }
        });
    }, [periods]);


    useLayoutEffect(() => {
        const path = pathRef.current;

        if (!path) {
            return;
        }


        const periodsLength = periods.length;
        const periodToIndexMap = new Map(periods.map((p, i) => [p.id, i]));


        dotRefsRef.current.forEach((element, periodId) => {
            const position = periodToIndexMap.get(periodId);

            if (position === undefined) {
                return;
            }


            const pathProgress = getPercentageByDotIndex(
                position,
                periodsLength,
            );


            gsap.killTweensOf(element);


            gsap.set(element, {
                xPercent: -50,
                yPercent: -50,
            });


            gsap.set(element, {
                motionPath: {
                    path,
                    align: path,
                    alignOrigin: [0.5, 0.5],
                    autoRotate: false,
                    start: pathProgress,
                    end: pathProgress,
                },
            });
        });
    }, [circlePathD, periods]);


    const animateToPeriod = useCallback(
        (targetPeriodId: UUID) => {
            const path = pathRef.current;


            if (!path) {
                return;
            }


            const periodsLength = periods.length;
            const targetPosition = dotPositionsRef.current.get(targetPeriodId);


            if (targetPosition === undefined) {
                return;
            }


            const delta = getDelta(targetPosition, periodsLength);


            if (delta === 0) {
                return;
            }


            const nextPositions = getNewPositions(
                dotPositionsRef.current,
                delta,
                periodsLength,
            );

            const previousPositions = new Map(dotPositionsRef.current);

            nextPositions.forEach((pos, id) => {
                dotPositionsRef.current.set(id, pos);
            });
            dotPositionsRef.current.set(targetPeriodId, 0);


            dotRefsRef.current.forEach((element, periodId) => {
                const currentPosition = previousPositions.get(
                    periodId,
                );


                if (currentPosition === undefined) {
                    return;
                }


                gsap.killTweensOf(element);


                const animate = contextSafe(() => {
                    gsap.to(element, {
                        duration: 1,
                        repeat: 0,
                        ease: 'none',
                        motionPath: {
                            path,
                            align: path,
                            alignOrigin: [0.5, 0.5],
                            autoRotate: false,
                            start: getPercentageByDotIndex(
                                currentPosition,
                                periodsLength,
                            ),
                            end: getPercentageByDotIndex(
                                currentPosition + delta,
                                periodsLength,
                            ),
                        },
                    });
                });


                animate();
            });
        },
        [contextSafe, periods],
    );


    const handleDotClick = useCallback(
        (periodId: UUID) => () => {
            dispatch(periodChange({ id: periodId }));
        },
        [dispatch],
    );


    useEffect(() => {
        if (!currentPeriod) {
            return;
        }


        const targetPosition = dotPositionsRef.current.get(currentPeriod);


        if (targetPosition === undefined) {
            return;
        }


        animateToPeriod(currentPeriod);
    }, [animateToPeriod, currentPeriod]);


    const addDotRef = useCallback(
        (periodId: UUID) => (element: HTMLDivElement | null) => {
            if (element) {
                dotRefsRef.current.set(periodId, element);
            } else {
                dotRefsRef.current.delete(periodId);
            }
        },
        [],
    );


    return (
        <div
            ref={containerRef}
            className={styles.circleLayer}
            style={{
                position: 'absolute',
                top: `${centerY}px`,
                left: '50%',
                transform: 'translateX(-50%)',
                transformOrigin: 'center',
            }}
        >
            <SvgHorizontalLineUI
                x1={-viewPort.width}
                y1={circleRadius}
                x2={viewPort.width}
                y2={circleRadius}
            />
            <SvgVerticalLineUI
                x1={circleRadius}
                y1={-viewPort.width}
                y2={viewPort.width}
            />
            <CircleUI
                ref={pathRef}
                radius={circleRadius}
                pathD={circlePathD}
            />
            {periods.map((period) => (
                <DotUI
                    ref={addDotRef(period.id)}
                    key={period.id}
                    text={period.category}
                    dotRadius={DOT_CONFIG.DOT_RADIUS}
                    circleRadius={DOT_CONFIG.CIRCLE_RADIUS}
                    strokeWidth={DOT_CONFIG.STROKE_WIDTH}
                    periodText={period.periodText}
                    isActive={currentPeriod === period.id}
                    onClick={handleDotClick(period.id)}
                />
            ))}
        </div>
    );
};


export default Circle;