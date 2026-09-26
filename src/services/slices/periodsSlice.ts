import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Period } from '../api/getEvents';

export const initialState = {
    pageTitle: 'Основные события',
    currentPeriod: "",
    periods: []
};


type AppState = {
    pageTitle: string,
    currentPeriod: string,
    periods: Period[],
}

type PeriodId = {
    periodId: string
}

type PeriodsData = Period[];

const getPeriodById: (state: AppState) => AppState['periods'][number] | undefined = (state) => {
    if (!Array.isArray(state.periods)) {
        return undefined;
    }
    return state.periods.find((period) => period.periodId === state.currentPeriod);
}

const getPeriodIndexById: (state: AppState) => number = (state) => {
    if(!Array.isArray(state.periods)) {
        return -1;
    }
    return state.periods.findIndex((period) => period.periodId === state.currentPeriod);
}

const periodSlice = createSlice({
    name: 'periods',
    initialState,
    reducers: {
        setData: (state: AppState, action: PayloadAction<PeriodsData>) => {
            state.periods = action.payload;
            if (state.currentPeriod === "" && action.payload.length > 0) {
                state.currentPeriod = state.periods[0].periodId
            }
        },
        periodChange: (state: AppState, action: PayloadAction<PeriodId>) => {
            state.currentPeriod = action.payload.periodId;
        },
        incrementPeriod: (state: AppState) => {
            let currentPeriodIndex = getPeriodIndexById(state);
            if (currentPeriodIndex !== -1 && currentPeriodIndex < state.periods.length - 1){
                state.currentPeriod = state.periods[currentPeriodIndex + 1].periodId;
            }
        },
        decrementPeriod: (state: AppState) => {
            let currentPeriodIndex = getPeriodIndexById(state);
            if (currentPeriodIndex > 0) {
                state.currentPeriod = state.periods[currentPeriodIndex - 1].periodId;
            }
        }
    },
    selectors: {
        getPeriods: (state: AppState) => state.periods || [],
        getCurrentPeriod: (state: AppState) => state.currentPeriod,
        getCurrentPeriodData: (state: AppState) => getPeriodById(state),
        getPeriodTitle: (state: AppState) => {
            const foundPeriod = getPeriodById(state);
            return foundPeriod?.category ?? '';
        },
        getEventsList: (state: AppState) => {
            const foundPeriod = getPeriodById(state);
            return foundPeriod?.events ?? [];
        },
        getPageTitle: (state: AppState) => state.pageTitle,
        getPeriodNumber: (state: AppState) => getPeriodIndexById(state) + 1
    }
});

export default periodSlice;
export const { setData, incrementPeriod, decrementPeriod, periodChange } = periodSlice.actions;
export const { getPeriods, getCurrentPeriod, getCurrentPeriodData, getEventsList, getPageTitle, getPeriodTitle, getPeriodNumber } = periodSlice.selectors; 