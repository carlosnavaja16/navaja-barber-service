import { Component } from '@angular/core';
import { HeaderService } from '../../shared/services/header/header.service';
import { Observable } from 'rxjs';
import { UserService } from '../../shared/services/user/user.service';
import { UserProfile } from '../../shared/types/user-profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  userProfile$: Observable<UserProfile>;

  constructor(
    private readonly headerService: HeaderService,
    private readonly userService: UserService,
  ) {
    this.headerService.setHeader('Profile');
    this.userProfile$ = this.userService.getUserProfile();
  }

  onFormSubmitted($event: UserProfile) {
    this.userService.updateUserProfile($event);
  }
}
