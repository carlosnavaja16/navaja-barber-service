import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { AppState } from '../store';

export interface HeaderState {
  text: string;
}

const initialState: HeaderState = {
  text: ''
};

export const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setHeaderText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    }
  }
});

export const { setHeaderText } = headerSlice.actions;

export const selectHeaderText = (state: AppState) => state.header.text;

export default headerSlice.reducer;
