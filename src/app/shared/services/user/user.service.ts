import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  user,
} from '@angular/fire/auth';
import {
  Observable,
  Subject,
  catchError,
  from,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { UserProfile } from '../../types/user-profile';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  collection,
  collectionData,
  doc,
  getDoc,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { SnackbarService } from '../snackbar/snackbar.service';
import { setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userProfilesCollection: CollectionReference<DocumentData>;

  constructor(
    private readonly auth: Auth,
    private readonly firestore: Firestore,
    private readonly snackbarService: SnackbarService,
  ) {
    this.userProfilesCollection = collection(this.firestore, 'UserProfiles');
  }

  get isLoggedIn$(): Observable<boolean> {
    return user(this.auth).pipe(map((user) => !!user));
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
