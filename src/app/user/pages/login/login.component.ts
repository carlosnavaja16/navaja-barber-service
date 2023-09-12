import { HeaderService } from '../../../shared/services/header/header.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private readonly headerService: HeaderService,
    private readonly router: Router,
    private readonly snackbarService: SnackbarService,
    private readonly userService: UserService,
  ) {
    this.headerService.setHeader('Login');
  }

  login(): void {
    this.userService.login(this.email, this.password).subscribe({
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
}
