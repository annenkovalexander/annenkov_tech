import type { Period } from '../api/getEvents';

export type AppState = {
    pageTitle: string,
    currentPeriod: string,
    periods: Period[],
}

export const getPeriodById: (state: AppState) => AppState['periods'][number] | undefined = (state) => state.periods.find((period) => period.periodId === state.currentPeriod);

export const getPeriodIndexById: (state: AppState) => number = (state) => {
    if(!Array.isArray(state.periods)) {
        return -1;
    }
    return state.periods.findIndex((period) => period.periodId === state.currentPeriod);
}