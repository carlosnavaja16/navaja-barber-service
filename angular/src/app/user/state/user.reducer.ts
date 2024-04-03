import { createReducer, on } from '@ngrx/store';
import { UserProfile } from '@shared/schema/user-profile';
import {} from './user.actions';

export interface UserState {
  isLoggedIn: boolean;
  currUserProfile: UserProfile | null;
  currUserToken: string;
}

export const initialState: UserState = {
  isLoggedIn: false,
  currUserProfile: null,
  currUserToken: ''
};

export const bookingReducer = createReducer(initialState, on());
