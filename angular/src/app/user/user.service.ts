import { Injectable } from '@angular/core';
import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  user
} from '@angular/fire/auth';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { CreateUserProfileRequest, UserProfile } from '@schema/user-profile';
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
import { BarberErrors } from '@shared/errors';

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
    let userCredential: UserCredential;
    let userProfile: UserProfile | null;
    let userToken: string;
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((user: UserCredential) => {
        userCredential = user;
        return from(userCredential.user.getIdToken());
      }),
      switchMap((token: string) => {
        userToken = token;
        return from(
          getDoc(doc(this.userProfilesCollection, userCredential.user.uid))
        );
      }),
      map((doc) => doc.data() as UserProfile),
      switchMap((profile) => {
        userProfile = profile;
        return of({
          userProfile,
          userToken
        });
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
  ): Observable<void> {
    let userCredential: UserCredential;
    let userProfile: UserProfile | null;
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap((user) => {
        userCredential = user;
        userProfile = {
          ...createUserProfileRequest,
          email,
          isAdmin: false,
          userId: user.user.uid
        };
        return from(
          setDoc(
            doc(this.firestore, 'UserProfiles', userCredential.user.uid),
            userProfile
          )
        );
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
