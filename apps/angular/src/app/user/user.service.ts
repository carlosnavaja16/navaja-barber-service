import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  user
} from '@angular/fire/auth';
import { Observable, from, map, of, switchMap } from 'rxjs';
import {
  BarberErrors,
  CreateUserProfileRequest,
  UserInfo,
  UserProfile
} from '@navaja/shared';
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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userProfilesCollection: CollectionReference<DocumentData>;

  constructor(
    private readonly auth: Auth,
    private readonly firestore: Firestore
  ) {
    this.userProfilesCollection = collection(this.firestore, 'UserProfiles');
  }

  public login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => {
        return this.getUserInfo(userCredential.user);
      })
    );
  }

  public logOut(): Observable<void> {
    return from(signOut(this.auth));
  }

  public createUser(
    email: string,
    password: string,
    createUserProfileRequest: CreateUserProfileRequest
  ) {
    let user: User;
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap((userCredential) => {
        user = userCredential.user;
        return from(
          setDoc(doc(this.firestore, 'UserProfiles', userCredential.user.uid), {
            ...createUserProfileRequest,
            email,
            isAdmin: false,
            userId: user.uid
          })
        );
      }),
      switchMap(() => this.getUserInfo(user))
    );
  }

  public getUserInfo(user: User): Observable<UserInfo> {
    let userToken: string;
    return from(user.getIdToken()).pipe(
      switchMap((token) => {
        userToken = token;
        return from(getDoc(doc(this.userProfilesCollection, user.uid)));
      }),
      map((doc) => doc.data() as UserProfile),
      switchMap((userProfile) => {
        return of({
          userToken,
          userProfile
        });
      })
    );
  }

  public getUserProfile(): Observable<UserProfile> {
    return user(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          throw BarberErrors.USER_NOT_LOGGED_IN;
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
          throw BarberErrors.USER_NOT_LOGGED_IN;
        }
        return user.email ? of(user.email) : of('');
      })
    );
  }

  public updateUserEmail(newEmail: string): Observable<void> {
    return user(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          throw BarberErrors.USER_NOT_LOGGED_IN;
        }
        return from(updateEmail(user, newEmail));
      })
    );
  }

  public updateUserProfile(userProfile: UserProfile): Observable<void> {
    return user(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          throw BarberErrors.USER_NOT_LOGGED_IN;
        }
        return from(
          updateDoc(doc(this.firestore, 'UserProfiles', user.uid), {
            ...userProfile
          })
        );
      })
    );
  }
}
