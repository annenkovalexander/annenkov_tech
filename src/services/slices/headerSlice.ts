/*
 * TODO: добавить получение HeaderData через GET-запрос
 * после реализации API.
 */
import { createSlice } from '@reduxjs/toolkit';
import mockHeader from '../headerMock.json';

export interface HeaderData {
    fullName: string;
    role: string;
    description: string;
    tg_link?: string;
    tg_link_aria_label?: string;
}

const initialState: HeaderData = mockHeader;

const headerSlice = createSlice({
    name: 'header',
    initialState,
    reducers: {},
    selectors: {
        selectHeader: (state: HeaderData) => state,
    },
});

export default headerSlice;
export const { selectHeader } = headerSlice.selectors;