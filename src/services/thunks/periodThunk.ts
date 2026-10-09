import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchData } from "../api/getEvents";
import type { Period } from "../api/getEvents";

export const loadPeriods = createAsyncThunk<Period[], number, {rejectValue: string}>(
    'periods/loadPeriods',
    async (timeout, { rejectWithValue }) => {
        try {
            const response = await fetchData(timeout);
            return response;
        }
        catch (error) {
            return rejectWithValue(
                error instanceof Error ?  error.message : 'Не удалось получить периоды'
            );
        }
    }
);