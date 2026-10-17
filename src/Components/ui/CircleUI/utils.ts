const DEFAULT_START_ANGLE = 30;

const normalizeAngle = (angle: number): number =>
    ((angle % 360) + 360) % 360;

export const getCirclePath = (circleRadius: number): string => {
    const parsedStartAngle = Number(process.env.START_ANGLE);
    const startAngleDegrees = Number.isNaN(parsedStartAngle)
        ? DEFAULT_START_ANGLE
        : normalizeAngle(parsedStartAngle);

    const startAngle = -(startAngleDegrees * Math.PI) / 180;

    const startX = circleRadius + circleRadius * Math.cos(startAngle);
    const startY = circleRadius + circleRadius * Math.sin(startAngle);

    const oppositeX = circleRadius - circleRadius * Math.cos(startAngle);
    const oppositeY = circleRadius - circleRadius * Math.sin(startAngle);

    return [
        `M ${startX} ${startY}`,
        `A ${circleRadius} ${circleRadius} 0 1 1 ${oppositeX} ${oppositeY}`,
        `A ${circleRadius} ${circleRadius} 0 1 1 ${startX} ${startY}`,
    ].join(' ');
};