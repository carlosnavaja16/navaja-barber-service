import { createAction, props } from '@ngrx/store';
import {
  CreateUserProfileRequest,
  UserInfo
} from '@shared/schema/user-profile';

export const logIn = createAction(
  'LogIn',
  props<{ email: string; password: string }>()
);
export const logInSuccess = createAction('LogInSuccess', props<UserInfo>());

export const logOut = createAction('LogOut');
export const logOutSuccess = createAction('LogOutSuccess');
export const signUp = createAction(
  'SignUp',
  props<{
    email: string;
    password: string;
    createProfileRequest: CreateUserProfileRequest;
  }>()
);
