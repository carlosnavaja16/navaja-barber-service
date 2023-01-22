import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../shared/services/header/header.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public headerService: HeaderService
    ) {
      headerService.setHeader("Carlos Navaja Barber Service");
    }

  ngOnInit(): void {
  }

}
