import { configureStore } from '@reduxjs/toolkit';
import headerReducer from './header/headerSlice';

export const store = configureStore({
  reducer: {
    header: headerReducer
  }
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
