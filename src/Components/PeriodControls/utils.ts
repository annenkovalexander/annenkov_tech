import type { Period } from "../../services/api/getEvents";


export const findPeriodIndex = (periods: Period[], currentPeriodId: string): number => 
        periods.findIndex((period: Period) => period.id === currentPeriodId);

export const getButtonsActive = (
    periodsLength: number,
    activePeriodIndex: number,
): [boolean, boolean] => {

    if (activePeriodIndex < 0 || periodsLength <= 1) {
        return [false, false];
    }

    return [
        activePeriodIndex > 0,
        activePeriodIndex < periodsLength - 1,
    ];
};

export const getPeriodsText = (
    periodsLength: number,
    activePeriodIndex: number,
): string => {
    const currentPeriodNumber = activePeriodIndex + 1;

    return [
        String(currentPeriodNumber).padStart(2, '0'),
        String(periodsLength).padStart(2, '0'),
    ].join('/');
};