import { Component } from '@angular/core';
import { HeaderService } from '@src/app/common/services/header/header.service';
import { Observable } from 'rxjs';
import { UserService } from '@user/user.service';
import { UserProfile } from '@navaja/shared';
import { SnackbarService } from '@app/common/services/snackbar/snackbar.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userProfile$: Observable<UserProfile>;

  constructor(
    private readonly headerService: HeaderService,
    private readonly userService: UserService,
    private readonly snackbarService: SnackbarService
  ) {
    this.headerService.setHeader('Profile');
    this.userProfile$ = this.userService.getUserProfile();
  }

  onFormSubmitted($event: UserProfile) {
    this.userService.updateUserProfile($event).subscribe({
      next: () => {
        this.snackbarService.pushSnackbar('Profile updated successfully');
      },
      error: (error) => {
        this.snackbarService.pushSnackbar(`Error updating profile: ${error}`);
      }
    });
  }
}
