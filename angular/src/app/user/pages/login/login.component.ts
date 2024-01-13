import { HeaderService } from '../../../shared/services/header/header.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { UserService } from '../../user.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private readonly headerService: HeaderService,
    private readonly router: Router,
    private readonly snackbarService: SnackbarService,
    private readonly userService: UserService,
    private readonly fb: FormBuilder,
  ) {
    this.headerService.setHeader('Login');
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onLogin(): void {
    this.userService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: (userProfile) => {
          this.snackbarService.pushSnackbar(
            `Login successful. Welcome back ${userProfile.firstName}!`,
          );
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.snackbarService.pushSnackbar(
            `Login not successful: ${error.message}`,
          );
        },
      });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
