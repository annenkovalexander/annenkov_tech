import { createSlice } from "@reduxjs/toolkit";

export interface HeaderData {
    fullName: string;
    role: string;
    description: string;
}

const initialState: HeaderData = {
    fullName: 'Александр Анненков',
    role: 'Технический лидер',
    description: 'Достигаю целей силами небольших команд, работаю в условиях кризиса и высокой неопределённости, довожу сложные проекты до результата'
}


const headerSlice = createSlice({
    name: 'header',
    initialState,
    reducers: {},
    selectors: {
        getHeader: (state) => state
    }
})


export default headerSlice;
export const { getHeader } = headerSlice.selectors;
