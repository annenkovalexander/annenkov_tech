import type { Period } from "../../services/api/getEvents";


export type PeriodButtonsEnabled = {
    prevEnabled: boolean;
    nextEnabled: boolean;
}

export const findPeriodIndex = (periods: readonly Period[], currentPeriodId: string): number => 
        periods.findIndex((period: Period) => period.id === currentPeriodId);

export const getButtonsActive = (
    periodsLength: number,
    activePeriodIndex: number,
): PeriodButtonsEnabled => {

    if (activePeriodIndex < 0 || periodsLength <= 1 || activePeriodIndex >= periodsLength) {
        return {
            prevEnabled: false,
            nextEnabled: false
        };
    }

    return {
        prevEnabled: activePeriodIndex > 0,
        nextEnabled: activePeriodIndex < periodsLength - 1,
    };
}

export const getPeriodsText = (
    periodsLength: number,
    activePeriodIndex: number,
): string => {
    if (activePeriodIndex < 0 || periodsLength <= 1 || activePeriodIndex >= periodsLength) {
        return "";
    }

    const currentPeriodNumber = activePeriodIndex + 1;

    return [
        String(currentPeriodNumber).padStart(2, '0'),
        String(periodsLength).padStart(2, '0'),
    ].join('/');
}