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
    public headerService: HeaderService,
    public auth: UserService,
  ) {
    headerService.setHeader('Vonnegut Barber Service');
  }
}
