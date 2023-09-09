import {
  Auth,
  UserCredential,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { HeaderService } from '../shared/services/header/header.service';
import { Component } from '@angular/core';
import { Observable, from, catchError, switchMap, take, tap } from 'rxjs';
import {
  DocumentData,
  Firestore,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { SnackbarService } from '../shared/services/snackbar/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    public headerService: HeaderService,
    public router: Router,
    public auth: Auth,
    public firestore: Firestore,
    public snackbarService: SnackbarService,
  ) {
    this.headerService.setHeader('Login');
  }

  ngOnInit(): void {}

  login(): void {
    const signIn$: Observable<UserCredential> = from(
      signInWithEmailAndPassword(this.auth, this.email, this.password),
    );
    signIn$
      .pipe(
        take(1),
        switchMap((user: UserCredential) => {
          const userCollection = collection(this.firestore, 'UserProfiles');
          const userQuery = query(
            userCollection,
            where('userId', '==', user.user.uid),
          );
          return collectionData(userQuery);
        }),
        tap((userProfile: DocumentData) => {
          this.snackbarService.success(
            `Login successful. Welcome back ${userProfile[0].firstName}!`,
          );
          this.router.navigate(['/']);
        }),
        catchError((error) => {
          this.snackbarService.warning(
            `Could not authenticate: ${error.message}`,
          );
          return error;
        }),
      )
      .subscribe();
  }
}
