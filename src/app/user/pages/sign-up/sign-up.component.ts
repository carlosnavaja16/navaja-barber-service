import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../../shared/services/header/header.service';
import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { Observable, catchError, from, take, tap } from 'rxjs';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UserService } from '../../user.service';
import { UserProfile } from '../../types/user-profile';
import { SignUp } from '../../types/sign-up';

@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  constructor(
    private readonly headerService: HeaderService,
    private readonly router: Router,
    private readonly snackbarService: SnackbarService,
    private readonly userService: UserService,
  ) {
    this.headerService.setHeader('Sign Up');
  }

  onSignUp($event: SignUp): void {
    this.userService
      .createUser($event.email, $event.password, $event.userProfile)
      .subscribe({
        next: () => {
          this.snackbarService.pushSnackbar(
            `Sign up successful, Welcome ${$event.userProfile.firstName}!`,
          );
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.snackbarService.pushSnackbar(
            `Sign up failed due to error: ${error}`,
          );
        },
      });
  }
}
