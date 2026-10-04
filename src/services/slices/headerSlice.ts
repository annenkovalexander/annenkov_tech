import { createSlice } from "@reduxjs/toolkit";

export interface HeaderData {
    fullName: string;
    role: string;
    description: string;
    tg_link: string;
    tg_link_aria_label: string;
}

const initialState: HeaderData = {
    fullName: 'Александр Анненков',
    role: 'Технический лидер',
    description: 'Достигаю целей силами небольших команд, работаю в условиях кризиса и высокой неопределённости, довожу сложные проекты до результата',
    tg_link: 'https:/t.me/alexander_aap',
    tg_link_aria_label: 'Телеграм канал Анненкова Александра'
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
