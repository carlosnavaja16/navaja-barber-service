import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../shared/services/header/header.service';
import { UserService } from '../shared/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    public headerService: HeaderService,
    public auth: UserService,
  ) {
    headerService.setHeader('Vonnegut Barber Service');
  }

  ngOnInit(): void {}
}
