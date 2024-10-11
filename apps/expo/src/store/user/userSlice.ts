import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { AppState } from '../store';

export interface UserState {
  loggedIn: boolean;
}

const initialState: UserState = {
  loggedIn: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    }
  }
});

export const { setLoggedIn } = userSlice.actions;

export const selectLoggedIn = (state: AppState) => state.user.loggedIn;

export default userSlice.reducer;
