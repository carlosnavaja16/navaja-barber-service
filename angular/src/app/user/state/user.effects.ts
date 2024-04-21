import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap, filter, tap, catchError } from 'rxjs/operators';
import { UserService } from '../user.service';
import * as UserActions from './user.actions';
import { authState, Auth, User } from '@angular/fire/auth';
import { SnackbarService } from '@src/app/common/services/snackbar/snackbar.service';
import { EMPTY } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class UserEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly userService: UserService,
    private readonly auth: Auth,
    private readonly snackbarService: SnackbarService,
    private readonly router: Router
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
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Login not successful: ${error.message}`
        );
        return EMPTY;
      }),
      tap((userInfo) => {
        this.snackbarService.pushSnackbar(
          `Login successful. Welcome back ${userInfo.userProfile.firstName}!`
        );
        this.router.navigate(['/']);
      }),
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
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Login not successful: ${error.message}`
        );
        return EMPTY;
      }),
      tap((userInfo) => {
        this.snackbarService.pushSnackbar(
          `Sign up successful. Welcome ${userInfo.userProfile.firstName}!`
        );
        this.router.navigate(['/']);
      }),
      map((userInfo) => UserActions.logInSuccess(userInfo))
    )
  );

  logOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.logOut),
      exhaustMap(() => this.userService.logOut()),
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Logout not successful: ${error.message}`
        );
        return EMPTY;
      }),
      tap(() => {
        this.snackbarService.pushSnackbar('Logout successful!');
        this.router.navigate(['/']);
      }),
      map(() => UserActions.logOutSuccess())
    )
  );
}
