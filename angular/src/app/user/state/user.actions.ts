import { createAction, props } from '@ngrx/store';
import { UserProfile } from '@shared/schema/user-profile';

export const logIn = createAction('LogIn');
export const logOut = createAction('LogOut');
export const setUserProfile = createAction(
  'SetUserProfile',
  props<UserProfile>()
);
export const clearUserProfile = createAction('ClearUserProfile');
export const setUserToken = createAction('SetUserToken', props<string>());
export const clearUserToken = createAction('ClearUserToken');
