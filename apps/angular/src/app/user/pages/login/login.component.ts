import { HeaderService } from '@src/app/common/services/header/header.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  EMAIL_EMPTY,
  EMAIL_INVALID,
  PASSWORD_EMPTY,
  PASSWORD_INVALID
} from '@navaja/shared';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';
import { SnackbarService } from '@src/app/common/services/snackbar/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  emailEmpty = EMAIL_EMPTY;
  emailInvalid = EMAIL_INVALID;
  passwordEmpty = PASSWORD_EMPTY;
  passwordInvalid = PASSWORD_INVALID;

  constructor(
    private readonly headerService: HeaderService,
    private readonly userService: UserService,
    private readonly snackbarService: SnackbarService,
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {
    this.headerService.setHeader('Login');
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  onLogin() {
    this.userService
      .login(this.email?.value, this.password?.value)
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch((error) => {
        this.snackbarService.pushSnackbar(
          `Login failed due to error: ${error}`
        );
      });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
