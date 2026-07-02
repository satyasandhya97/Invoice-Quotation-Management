import { configureStore } from '@reduxjs/toolkit';
import invoiceReducer from './slices/invoiceSlice';

export const store = configureStore({
  reducer: {
    invoices: invoiceReducer
  }
});
