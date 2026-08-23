import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import periods from '../mock.json';

export const initialState = {
    pageTitle: 'Исторические даты',
    currentPeriod: 1,
    periods: periods
};

type PeriodIndex = {
    periodIndex: string;
}

const periodSlice = createSlice({
    name: 'periods',
    initialState,
    reducers: {
        periodChange: (state: typeof initialState, action: PayloadAction<PeriodIndex>) => {
            state.currentPeriod = Number(action.payload.periodIndex);
        },
        incrementPeriod: (state: typeof initialState) => {
            if (state.currentPeriod < state.periods.length)
                state.currentPeriod += 1;
        },
        decrementPeriod: (state: typeof initialState) => {
            if (state.currentPeriod > 1)
                state.currentPeriod -= 1;
        },
        dotsChange: (state: typeof initialState) => {
            state.periods = state.periods.slice(state.currentPeriod-1).concat(state.periods.slice(0, state.currentPeriod-1))
        }
    },
    selectors: {
        getPeriods: (state: typeof initialState) => state.periods,
        getCurrentPeriod: (state: typeof initialState) => state.currentPeriod,
        getPeriodTitle: (state: typeof initialState) => state.periods[state.currentPeriod-1].category,
        getCurrentPeriodData: (state: typeof initialState) => state.periods[state.currentPeriod-1],
        getEventsList: (state: typeof initialState) => state.periods[state.currentPeriod-1].events,
        getPageTitle: (state: typeof initialState) => state.pageTitle,
        getDots: (state: typeof initialState) => {
            const circlePeriods = state.periods;
            return circlePeriods.map((period, index) => ({
                dotId: index,
                dotDescription: period.category,
                periodId: period.periodId
            }))
        }
    }
});

export default periodSlice;
export const { incrementPeriod, decrementPeriod, periodChange, dotsChange } = periodSlice.actions;
export const { getPeriods, getCurrentPeriod, getCurrentPeriodData, getEventsList, getPageTitle, getDots, getPeriodTitle } = periodSlice.selectors; 