import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux';

import periodSlice from './slices/periodsSlice';
import headerSlice from './slices/headerSlice';

const rootReducer = combineSlices(
    periodSlice,
    headerSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = useReduxDispatch.withTypes<AppDispatch>();
export const useSelector = useReduxSelector.withTypes<RootState>();