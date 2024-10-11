import { configureStore } from '@reduxjs/toolkit';
import headerReducer from './header/headerSlice';
import userReducer from './user/userSlice';

export const store = configureStore({
  reducer: {
    header: headerReducer,
    user: userReducer
  }
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
