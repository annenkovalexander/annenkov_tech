import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchData } from "../api/getEvents";
import type { Period } from "../../types/period";

export const loadPeriods = createAsyncThunk<
    ReadonlyArray<Period>,
    number,
    {
        rejectValue: string;
    }
>(
    'periods/loadPeriods',
    async (responseAverageTime, { rejectWithValue }) => {
        try {
            const response = await fetchData(responseAverageTime);
            return response;
        }
        catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'Не удалось получить периоды'
            );
        }
    }
);