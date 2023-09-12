import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  UserCredential,
  authState,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  user,
} from '@angular/fire/auth';
import {
  Observable,
  Subject,
  from,
  map,
  of,
  share,
  shareReplay,
  switchMap,
} from 'rxjs';
import { UserProfile } from '../shared/types/user-profile';
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
  isLoggedIn$ = new Subject<boolean>();
  userProfilesCollection: CollectionReference<DocumentData>;

  constructor(
    private readonly auth: Auth,
    private readonly firestore: Firestore,
  ) {
    onAuthStateChanged(this.auth, (user) => {
      user ? this.isLoggedIn$.next(true) : this.isLoggedIn$.next(false);
    });
    authState(this.auth).subscribe((user) => {
      console.log(`User: ${user?.uid} is logged in according to authState`);
    });
    this.userProfilesCollection = collection(this.firestore, 'UserProfiles');
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
      switchMap((user: UserCredential) => {
        const newUserProfile = {
          ...userProfile,
          userId: user.user.uid,
        };
        return from(
          setDoc(
            doc(this.firestore, 'UserProfiles', newUserProfile.userId),
            newUserProfile,
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

  updateUserProfile(userProfile: UserProfile) {
    return user(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User is not logged in');
        }
        return from(
          updateDoc(doc(this.firestore, 'UserProfiles', user.uid), {
            ...userProfile,
            userId: user.uid,
          }),
        );
      }),
    );
  }
}
