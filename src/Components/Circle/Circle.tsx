import { useCallback, useEffect, useMemo, useRef } from 'react';
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
import type { RefElement } from './utils';
import { useViewport } from '../../services/hooks/useViewport';
import type { UUID } from '../../types/period';
import styles from './Circle.module.scss';

gsap.registerPlugin(useGSAP);
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

    const dotRefsRef = useRef<RefElement<HTMLDivElement>[]>([]);
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

    useEffect(() => {
        const path = pathRef.current;

        if (!path) {
            return;
        }

        if (dotRefsRef.current.length !== periods.length) {
            return;
        }

        let firstFrame = 0;
        let secondFrame = 0;
        let timeout: ReturnType<typeof setTimeout> | undefined;

        const repositionDots = () => {
            const periodsLength = periods.length;

            dotRefsRef.current.forEach((dotRef) => {
                const position = dotPositionsRef.current.get(
                    dotRef.periodId,
                );

                if (position === undefined) {
                    return;
                }

                const pathProgress = getPercentageByDotIndex(
                    position,
                    periodsLength,
                );

                gsap.killTweensOf(dotRef.element);

                gsap.set(dotRef.element, {
                    xPercent: -50,
                    yPercent: -50,
                });

                gsap.set(dotRef.element, {
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
        };

        firstFrame = requestAnimationFrame(() => {
            secondFrame = requestAnimationFrame(() => {
                timeout = setTimeout(repositionDots, 50);
            });
        });

        return () => {
            cancelAnimationFrame(firstFrame);
            cancelAnimationFrame(secondFrame);

            if (timeout) {
                clearTimeout(timeout);
            }
        };
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

            dotRefsRef.current.forEach((dotRef) => {
                const currentPosition = dotPositionsRef.current.get(
                    dotRef.periodId,
                );

                if (currentPosition === undefined) {
                    return;
                }

                const isTargetPeriod = dotRef.periodId === targetPeriodId;

                gsap.killTweensOf(dotRef.element);

                const animate = contextSafe(() => {
                    gsap.to(dotRef.element, {
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
                        onStart: () => {
                            const nextPosition = isTargetPeriod
                                ? 0
                                : nextPositions.get(dotRef.periodId);

                            if (nextPosition !== undefined) {
                                dotPositionsRef.current.set(
                                    dotRef.periodId,
                                    nextPosition,
                                );
                            }
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
            const existingIndex = dotRefsRef.current.findIndex(
                (dotRef) => dotRef.periodId === periodId,
            );
            if (element) {
                if (existingIndex === -1) {
                    dotRefsRef.current.push({
                        element,
                        periodId,
                    });
                } else {
                    dotRefsRef.current[existingIndex].element = element;
                }
                return;
            }
            if (existingIndex !== -1) {
                dotRefsRef.current.splice(existingIndex, 1);
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