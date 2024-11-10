import { Injectable, signal, WritableSignal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
} from '@angular/fire/auth';
import {
  Observable,
  firstValueFrom,
  from,
  map,
  switchMap,
  filter,
} from 'rxjs';
import { getIdToken } from 'firebase/auth';
import { UserProfile } from '@navaja/shared';
import { TRPCService } from '../trpc/trpc.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public isLoggedIn: WritableSignal<boolean> = signal(false);
  public userToken: WritableSignal<string | undefined> = signal(undefined);
  public userProfile: WritableSignal<UserProfile | undefined> =
    signal(undefined);

  constructor(
    private readonly auth: Auth,
    private readonly trpcService: TRPCService
  ) {
    this.initUser();
  }

  public login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password).then(() =>
      this.initUser()
    );
  }

  public logOut(): Promise<void> {
    return signOut(this.auth).then(() => this.clearUser());
  }

  public createUser(email: string, password: string, userProfile: UserProfile) {
    return createUserWithEmailAndPassword(this.auth, email, password).then(() => this.initUser(userProfile));
  }

  private createUserProfile$(userProfile: UserProfile) {
    return from(
      this.trpcService.client.user.updateUserProfile.mutate(userProfile)
    );
  }

  private getUserProfile$(): Observable<UserProfile> {
    return from(this.trpcService.client.user.getUserProfile.query());
  }

  public updateUserEmail(newEmail: string) {
    return from(this.trpcService.client.user.updateUserEmail.mutate(newEmail));
  }

  public updateUserProfile(userProfile: UserProfile) {
    return this.trpcService.client.user.updateUserProfile.mutate(userProfile);
  }

  private initUser = (userProfile?: UserProfile) => {
    return firstValueFrom(
      user(this.auth).pipe(
        filter((user) => user != null),
        switchMap((user) => {
          this.isLoggedIn.set(true);
          return from(getIdToken(user));
        }),
        switchMap((token) => {
          this.userToken.set(token);
          return userProfile
            ? this.createUserProfile$(userProfile)
            : this.getUserProfile$();
        }),
        map((userProfile) => this.userProfile.set(userProfile))
      )
    );
  };

  private clearUser = () => {
    this.isLoggedIn.set(false);
    this.userToken.set(undefined);
    this.userProfile.set(undefined);
  };
}
