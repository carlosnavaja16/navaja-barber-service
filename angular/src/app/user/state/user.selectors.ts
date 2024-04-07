import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '@src/app/user/state/user.reducer';

export const getUserState = createFeatureSelector<UserState>('user');
export const getLoggedIn = createSelector(
  getUserState,
  (state: UserState) => state.loggedIn
);
export const getUserProfile = createSelector(
  getUserState,
  (state: UserState) => state.userProfile
);
export const getUserToken = createSelector(
  getUserState,
  (state: UserState) => state.userToken
);
