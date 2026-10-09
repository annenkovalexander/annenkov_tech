import type { AppState } from '../slices/periodsSlice';

export const getPeriodById: (state: AppState) => AppState['periods'][number] | undefined = (state) => 
    state.periods.find((period) => period.id === state.currentPeriodId);

export const getPeriodIndexById: (state: AppState) => number = (state) => {
    if(!Array.isArray(state.periods)) {
        return -1;
    }
    return state.periods.findIndex((period) => period.id === state.currentPeriodId);
}