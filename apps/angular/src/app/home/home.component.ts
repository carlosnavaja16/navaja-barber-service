import { Component } from '@angular/core';
import { HeaderService } from '@src/app/common/services/header/header.service';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loggedIn = this.userService.isLoggedIn;

  constructor(
    private readonly headerService: HeaderService,
    private readonly userService: UserService,
    private readonly router: Router
  ) {
    this.headerService.setHeader('Navaja Barber Service');
  }

  onBook() {
    this.router.navigate(['services']);
  }
}
