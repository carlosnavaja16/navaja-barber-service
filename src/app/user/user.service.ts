import { Injectable, WritableSignal, signal } from '@angular/core';
import {
  Auth,
  UserCredential,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  user,
} from '@angular/fire/auth';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { UserProfile } from './types/user-profile';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  collection,
  doc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private isLoggedIn = signal(false);
  userProfilesCollection: CollectionReference<DocumentData>;

  constructor(
    private readonly auth: Auth,
    private readonly firestore: Firestore,
  ) {
    authState(this.auth)
      .pipe(map((user) => (user ? true : false)))
      .subscribe((val) => this.isLoggedIn.set(val));
    this.userProfilesCollection = collection(this.firestore, 'UserProfiles');
  }

  public getIsLoggedIn(): WritableSignal<boolean> {
    return this.isLoggedIn;
  }

  login(email: string, password: string): Observable<UserProfile> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((user: UserCredential) => {
        return from(
          getDoc(doc(this.userProfilesCollection, user.user.uid)),
        ).pipe(
          map(
            (userProfileSnapshot) => userProfileSnapshot.data() as UserProfile,
          ),
        );
      }),
    );
  }

  logOut() {
    return from(signOut(this.auth));
  }

  createUser(email: string, password: string, userProfile: UserProfile) {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password),
    ).pipe(
      switchMap((user) => {
        return from(
          setDoc(
            doc(this.firestore, 'UserProfiles', user.user.uid),
            userProfile,
          ),
        );
      }),
    );
  }

  getUserProfile(): Observable<UserProfile> {
    return user(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User is not logged in');
        }
        return from(getDoc(doc(this.firestore, 'UserProfiles', user?.uid)));
      }),
      map((userProfileSnapshot) => userProfileSnapshot.data() as UserProfile),
    );
  }

  getUserEmail(): Observable<string> {
    return user(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User is not logged in');
        }
        return user.email ? of(user.email) : of('');
      }),
    );
  }

  updateUserEmail(newEmail: string): Observable<void> {
    return user(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User is not logged in');
        }
        return from(updateEmail(user, newEmail));
      }),
    );
  }

  updateUserProfile(userProfile: UserProfile) {
    return user(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User is not logged in');
        }
        return from(
          updateDoc(doc(this.firestore, 'UserProfiles', user.uid), {
            ...userProfile,
          }),
        );
      }),
    );
  }
}
