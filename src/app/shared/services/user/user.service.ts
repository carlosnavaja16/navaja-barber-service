import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, user } from '@angular/fire/auth';
import { Observable, Subject, map, switchMap } from 'rxjs';
import { UserProfile } from '../../types/user-profile';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public isLoggedIn$ = new Subject<boolean>();
  userProfilesCollection: CollectionReference<DocumentData>;

  constructor(
    private readonly auth: Auth,
    private readonly firestore: Firestore,
  ) {
    onAuthStateChanged(auth, (user) => {
      this.isLoggedIn$.next(!!user);
    });
    this.userProfilesCollection = collection(this.firestore, 'UserProfiles');
  }

  getUserProfile(): Observable<UserProfile> {
    return user(this.auth).pipe(
      switchMap((user) => {
        const userProfileQuery = query(
          this.userProfilesCollection,
          where('userId', '==', user?.uid),
        );
        return collectionData(userProfileQuery);
      }),
      map((userProfiles) => userProfiles[0] as UserProfile),
    );
  }

  // updateUserProfile(userProfile: UserProfile): string {
  //   //updateDoc(doc(this.userProfilesCollection, userProfile.id), userProfile);
  // }
}
