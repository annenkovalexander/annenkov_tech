import { createSlice } from '@reduxjs/toolkit';
import { getPeriodIndexById, getPeriodById, applyPeriods } from './utils';
import { loadPeriods } from '../thunks/periodThunk';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Period, UUID } from '../../types/period';

export interface AppState {
    pageTitle: string;
    currentPeriodId: UUID | '';
    periods: Period[];
    isLoading: boolean;
    error: string;
}

const initialState: AppState = {
    pageTitle: 'Основные события',
    currentPeriodId: '',
    periods: [],
    isLoading: false,
    error: ''
};

const periodSlice = createSlice({
    name: 'periods',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<ReadonlyArray<Period>>) => {
            applyPeriods(state, action.payload);
        },
        periodChange: (state, action: PayloadAction<{id: UUID}>) => {
            state.currentPeriodId = action.payload.id;
        },
        incrementPeriod: (state) => {
            let currentPeriodIndex = getPeriodIndexById(state);
            if (currentPeriodIndex !== -1 && currentPeriodIndex < state.periods.length - 1){
                state.currentPeriodId = state.periods[currentPeriodIndex + 1].id;
            }
        },
        decrementPeriod: (state) => {
            let currentPeriodIndex = getPeriodIndexById(state);
            if (currentPeriodIndex > 0) {
                state.currentPeriodId = state.periods[currentPeriodIndex - 1].id;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadPeriods.pending, (state) => {
                state.isLoading = true;
                state.error = '';
            })
            .addCase(loadPeriods.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                applyPeriods(state, action.payload);
            })
            .addCase(loadPeriods.rejected, (state, action) => {
                const message = action.payload ?? action.error.message ?? 'Возникла ошибка';
                state.isLoading = false;
                state.error = message;
            });
    },
    selectors: {
        getPeriods: (state) => state.periods || [],
        getCurrentPeriod: (state) => state.currentPeriodId,
        getCurrentPeriodData: (state) => getPeriodById(state),
        getPeriodTitle: (state) => {
            const foundPeriod = getPeriodById(state);
            return foundPeriod?.category ?? '';
        },
        getEventsList: (state) => {
            const foundPeriod = getPeriodById(state);
            return foundPeriod?.events ?? [];
        },
        getPageTitle: (state) => state.pageTitle,
        getPeriodNumber: (state) => getPeriodIndexById(state) + 1,
        getIsLoading: (state) => state.isLoading,
        getError: (state) => state.error
    }
});

export default periodSlice;
export const { setData, incrementPeriod, decrementPeriod, periodChange } = periodSlice.actions;
export const { getPeriods, getCurrentPeriod, getCurrentPeriodData, getEventsList, getPageTitle, getPeriodTitle, getPeriodNumber, getIsLoading, getError } = periodSlice.selectors;