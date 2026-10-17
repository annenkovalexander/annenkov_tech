import type { Draft } from 'immer';
import type { Period } from '../../types/period';
import type { AppState } from '../slices/periodsSlice';

export const getPeriodById = (state: AppState) => 
    state.periods.find((period) => period.id === state.currentPeriodId);

export const getPeriodIndexById = (state: AppState) =>
    state.periods.findIndex(
        (period) => period.id === state.currentPeriodId
    );

export const applyPeriods = (
    state: Draft<AppState>,
    payload: ReadonlyArray<Period>,
) => {
    state.periods = [...payload];

    if (state.currentPeriodId === '' && payload.length > 0) {
        state.currentPeriodId = state.periods[0].id;
    }
};