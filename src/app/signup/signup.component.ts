import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../shared/services/header/header.service';
import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { SnackbarService } from '../shared/services/snackbar/snackbar.service';
import { Observable, catchError, from, take, tap } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  firstName = '';
  lastName = '';
  streetAddr = '';
  city = '';
  state = 'FL';
  zipCode = '';
  email = '';
  password = '';
  confirmPassword = '';
  submitAttempted = false;
  formValid = true;

  constructor(
    headerService: HeaderService,
    public router: Router,
    public auth: Auth,
    public firestore: Firestore,
    public snackbarService: SnackbarService,
  ) {
    headerService.setHeader('Sign Up');
  }

  ngOnInit(): void {}

  validate(): void {
    if (this.submitAttempted) {
      this.formValid = true;
      this.validateInput(this.firstName, 'firstNameInput', /[a-zA-Z]{2,}/g);
      this.validateInput(this.lastName, 'lastNameInput', /[a-zA-Z]{2,}/g);
      this.validateInput(
        this.streetAddr,
        'streetAddrInput',
        /\d+\s+\w+\s+\w+/g,
      );
      this.validateInput(this.city, 'cityInput', /[a-zA-Z]{2,}/g);
      this.validateInput(this.state, 'stateInput', /FL/g);
      this.validateInput(this.zipCode, 'zipCodeInput', /\d{5}/g);
      this.validateInput(this.email, 'emailInput', /.+@.+\..+/g);
      this.validateInput(this.password, 'passwordInput', /.{6,}/g);

      //validation of the confirm password field
      if (
        this.confirmPassword == this.password &&
        this.confirmPassword.length >= 6
      ) {
        document
          .getElementById('confirmPasswordInput')
          ?.classList.remove('is-invalid');
      } else {
        this.formValid = false;
        document
          .getElementById('confirmPasswordInput')
          ?.classList.add('is-invalid');
      }
    }
  }

  signUp(): void {
    this.submitAttempted = true;
    this.validate();
    if (this.formValid) {
      const signUp$: Observable<UserCredential> = from(
        createUserWithEmailAndPassword(this.auth, this.email, this.password),
      );

      signUp$
        .pipe(
          take(1),
          tap((user: UserCredential) => {
            const newUserProfile = {
              userId: user.user?.uid,
              firstName: this.firstName,
              lastName: this.lastName,
              streetAddr: this.streetAddr,
              city: this.city,
              state: this.state,
              zipCode: this.zipCode,
            };
            const userProfilesCollection = collection(
              this.firestore,
              'UserProfiles',
            );
            addDoc(userProfilesCollection, newUserProfile);
            this.snackbarService.success(
              `Your account has been created ${this.firstName}!`,
            );
            this.router.navigate(['/']);
          }),
          catchError((error) => {
            this.snackbarService.success(
              `Could not create new user: ${error}. Try again?`,
            );
            return error;
          }),
        )
        .subscribe();
    }
  }

  validateInput(input: string, inputField: string, pattern: RegExp): void {
    if (pattern.test(input)) {
      document.getElementById(inputField)?.classList.remove('is-invalid');
    } else {
      this.formValid = false;
      document.getElementById(inputField)?.classList.add('is-invalid');
    }
  }
}
