import { createReducer, on } from '@ngrx/store';
import { UserProfile } from '@shared/schema/user-profile';
import * as UserActions from './user.actions';

export interface UserState {
  loggedIn: boolean;
  userProfile: UserProfile | null;
  userToken: string | undefined;
}

export const initialState: UserState = {
  loggedIn: false,
  userProfile: null,
  userToken: undefined
};

export const userReducer = createReducer<UserState>(
  initialState,
  on(UserActions.logInSuccess, (state, action) => {
    return {
      ...state,
      loggedIn: true,
      userProfile: action.userProfile,
      userToken: action.userToken
    };
  }),
  on(UserActions.logOutSuccess, (state) => {
    return {
      ...state,
      loggedIn: false,
      userToken: undefined,
      userProfile: null
    };
  })
);
