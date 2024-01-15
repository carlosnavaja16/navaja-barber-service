import { Injectable, Signal } from '@angular/core';
import {
  Auth,
  UserCredential,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  user
} from '@angular/fire/auth';
import { Observable, from, map, of, switchMap, tap } from 'rxjs';
import { UserProfile } from '@type/user-profile';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  collection,
  doc,
  getDoc,
  updateDoc
} from '@angular/fire/firestore';
import { setDoc } from 'firebase/firestore';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isLoggedIn: Signal<boolean>;
  private userProfilesCollection: CollectionReference<DocumentData>;
  private userProfileSnapshot: UserProfile | null = null;

  constructor(
    private readonly auth: Auth,
    private readonly firestore: Firestore
  ) {
    this.isLoggedIn = toSignal(
      authState(this.auth).pipe(map((user) => (user ? true : false))),
      { initialValue: false }
    );
    this.userProfilesCollection = collection(this.firestore, 'UserProfiles');
  }

  public getIsLoggedIn(): Signal<boolean> {
    return this.isLoggedIn;
  }

  public getUserProfileSnapshot(): UserProfile | null {
    return this.userProfileSnapshot;
  }

  public login(email: string, password: string): Observable<UserProfile> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((user: UserCredential) => {
        return from(
          getDoc(doc(this.userProfilesCollection, user.user.uid))
        ).pipe(
          map(
            (userProfileSnapshot) => userProfileSnapshot.data() as UserProfile
          ),
          tap((userProfile) => (this.userProfileSnapshot = userProfile))
        );
      })
    );
  }

  public logOut(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => (this.userProfileSnapshot = null))
    );
  }

  public createUser(
    email: string,
    password: string,
    userProfile: UserProfile
  ): Observable<void> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap((user) => {
        return from(
          setDoc(doc(this.firestore, 'UserProfiles', user.user.uid), {
            ...userProfile,
            email: user.user.email,
            idAdmin: false,
            userId: user.user.uid
          })
        );
      }),
      tap(() => (this.userProfileSnapshot = userProfile))
    );
  }

  public getUserProfile(): Observable<UserProfile> {
    return user(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User is not logged in');
        }
        return from(getDoc(doc(this.firestore, 'UserProfiles', user?.uid)));
      }),
      map((userProfileSnapshot) => userProfileSnapshot.data() as UserProfile)
    );
  }

  public getUserEmail(): Observable<string> {
    return user(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User is not logged in');
        }
        return user.email ? of(user.email) : of('');
      })
    );
  }

  public updateUserEmail(newEmail: string): Observable<void> {
    return user(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User is not logged in');
        }
        return from(updateEmail(user, newEmail));
      })
    );
  }

  public updateUserProfile(userProfile: UserProfile): Observable<void> {
    return user(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User is not logged in');
        }
        return from(
          updateDoc(doc(this.firestore, 'UserProfiles', user.uid), {
            ...userProfile
          })
        );
      }),
      tap(() => (this.userProfileSnapshot = userProfile))
    );
  }
}