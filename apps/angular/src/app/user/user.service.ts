import { Injectable, signal, WritableSignal } from '@angular/core';
import {
  Auth,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
} from '@angular/fire/auth';
import { Observable, filter, from, map, of, switchMap, tap } from 'rxjs';
import { USER_NOT_LOGGED_IN, UserInfo, UserProfile } from '@navaja/shared';
import { TRPCService } from '../trpc/trpc.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  public userInfo: WritableSignal<UserInfo | undefined> = signal(undefined);
  public isLoggedIn: WritableSignal<boolean> = signal(false);

  constructor(
    private readonly auth: Auth,
    private readonly trpcService: TRPCService
  ) { }

  public login(email: string, password: string) {
    let userProfile: UserProfile;
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((uc: UserCredential) => {
        return this.trpcService.client.user.getUserProfile.query();
      }),
      switchMap((up: UserProfile) => {
        userProfile = up;
        return getIdToken();
      }),
      map((token: string) => ({ token, userProfile }))
    );
  }

  public logOut(): Promise<void> {
    return signOut(this.auth);
  }

  public createUser(email: string, password: string, userProfile: UserProfile) {
    let user: User;
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap((userCredential) => {
        user = userCredential.user;
        return from(
          this.trpcService.client.user.createUserProfile.mutate(userProfile)
        );
      }),
      switchMap(() => this.getUserInfo(user))
    );
  }

  private getUserInfo(user: User): Observable<UserInfo> {
    let userToken: string;
    return from(user.getIdToken()).pipe(
      switchMap((token) => {
        userToken = token;
        return from(this.trpcService.client.user.getUserProfile.query());
      }),
      switchMap((userProfile) => {
        return of({
          userToken,
          userProfile,
        });
      })
    );
  }

  public getUserProfile(): Observable<UserProfile> {
    return from(this.trpcService.client.user.getUserProfile.query());
  }

  public getUserEmail(): Observable<string> {
    return user(this.auth).pipe(
      tap((user) => !user && console.error(USER_NOT_LOGGED_IN)),
      filter((user) => user !== null),
      switchMap((user) => (user.email ? of(user.email) : of('')))
    );
  }

  public updateUserEmail(newEmail: string) {
    return from(this.trpcService.client.user.updateUserEmail.mutate(newEmail));
  }

  public updateUserProfile(userProfile: UserProfile): Observable<UserProfile> {
    return from(
      this.trpcService.client.user.updateUserProfile.mutate(userProfile)
    );
  }
}
