import { createSlice } from '@reduxjs/toolkit';
import { getPeriodIndexById, getPeriodById } from './utils';
import { loadPeriods } from '../thunks/periodThunk';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Period, UUID } from '../api/getEvents';

export interface AppState {
    pageTitle: string;
    currentPeriodId: UUID | "";
    periods: Period[];
    loadingStatus: string;
    error: string;
}

const initialState: AppState = {
    pageTitle: 'Основные события',
    currentPeriodId: "",
    periods: [],
    loadingStatus: "",
    error: ''
};

const periodSlice = createSlice({
    name: 'periods',
    initialState,
    reducers: {
        setData: (state: AppState, action: PayloadAction<Period[]>) => {
            state.periods = action.payload;
            if (state.currentPeriodId === "" && action.payload.length > 0) {
                state.currentPeriodId = state.periods[0].id
            }
        },
        periodChange: (state: AppState, action: PayloadAction<{id: UUID}>) => {
            state.currentPeriodId = action.payload.id;
        },
        incrementPeriod: (state: AppState) => {
            let currentPeriodIndex = getPeriodIndexById(state);
            if (currentPeriodIndex !== -1 && currentPeriodIndex < state.periods.length - 1){
                state.currentPeriodId = state.periods[currentPeriodIndex + 1].id;
            }
        },
        decrementPeriod: (state: AppState) => {
            let currentPeriodIndex = getPeriodIndexById(state);
            if (currentPeriodIndex > 0) {
                state.currentPeriodId = state.periods[currentPeriodIndex - 1].id;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadPeriods.pending, (state) => {
                state.loadingStatus = "Загружаем события...",
                state.error = "";
            })
            .addCase(loadPeriods.fulfilled, (state, action) => {
                state.loadingStatus = "";
                state.error = "";
                state.periods = action.payload;
                if (state.currentPeriodId === "" && action.payload.length > 0) {
                    state.currentPeriodId = state.periods[0].id
                };
            })
            .addCase(loadPeriods.rejected, (state, action) => {
                const message = action.payload ?? action.error.message ?? "Возникла ошибка";
                state.loadingStatus = message;
                state.error = message;
            })
    },
    selectors: {
        getPeriods: (state: AppState) => state.periods || [],
        getCurrentPeriod: (state: AppState) => state.currentPeriodId,
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
        getPeriodNumber: (state: AppState) => getPeriodIndexById(state) + 1,
        getLoadingStatus: (state: AppState) => state.loadingStatus,
        getError: (state: AppState) => state.error
    }
});

export default periodSlice;
export const { setData, incrementPeriod, decrementPeriod, periodChange,  } = periodSlice.actions;
export const { getPeriods, getCurrentPeriod, getCurrentPeriodData, getEventsList, getPageTitle, getPeriodTitle, getPeriodNumber, getLoadingStatus, getError } = periodSlice.selectors; 