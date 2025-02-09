import { Component } from '@angular/core';
import { HeaderService } from '@src/app/common/services/header/header.service';
import { Router } from '@angular/router';
import { SnackbarService } from '@app/common/services/snackbar/snackbar.service';
import { UserService } from '@user/user.service';
import { SignUpDetails } from '@navaja/shared';

@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  constructor(
    private readonly headerService: HeaderService,
    private readonly router: Router,
    private readonly snackbarService: SnackbarService,
    private readonly userService: UserService
  ) {
    this.headerService.setHeader('Sign Up');
  }

  onSignUp($event: SignUpDetails): void {
    this.userService
      .createUser($event.userProfile.email, $event.password, $event.userProfile)
      .then(() => {
        this.snackbarService.pushSnackbar(
          `Sign up successful, Welcome ${$event.userProfile.firstName}!`
        );
        this.router.navigate(['/']);
      })
      .catch((error) => {
        this.snackbarService.pushSnackbar(
          `Sign up failed due to error: ${error}`
        );
      });
  }
}
