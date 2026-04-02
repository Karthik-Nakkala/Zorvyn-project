import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './slices/transactionsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    ui: uiReducer,
  },
});