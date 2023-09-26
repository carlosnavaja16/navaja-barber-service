import { Component } from '@angular/core';
import { HeaderService } from '../shared/services/header/header.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    private readonly headerService: HeaderService,
    private readonly userService: UserService,
  ) {
    this.headerService.setHeader('Navaja Barber Service');
  }

  get isLoggedIn$() {
    return this.userService.isLoggedIn$;
  }
}
