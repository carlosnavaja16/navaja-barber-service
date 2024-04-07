import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap, filter } from 'rxjs/operators';
import { UserService } from '../user.service';
import * as UserActions from './user.actions';
import { authState, Auth, User } from '@angular/fire/auth';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private auth: Auth
  ) {}

  alreadyLoggedIn$ = createEffect(() =>
    authState(this.auth).pipe(
      filter((user) => user != null),
      map((user) => user as User),
      exhaustMap((user) => this.userService.getUserInfo(user)),
      map((userInfo) => UserActions.logInSuccess(userInfo))
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.logIn),
      exhaustMap((action) =>
        this.userService.login(action.email, action.password)
      ),
      map((userInfo) => UserActions.logInSuccess(userInfo))
    )
  );

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.signUp),
      exhaustMap((action) =>
        this.userService.createUser(
          action.email,
          action.password,
          action.createProfileRequest
        )
      ),
      map((userInfo) => UserActions.logInSuccess(userInfo))
    )
  );

  logOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.logOut),
      exhaustMap(() => this.userService.logOut()),
      map(() => UserActions.logOutSuccess())
    )
  );
}
