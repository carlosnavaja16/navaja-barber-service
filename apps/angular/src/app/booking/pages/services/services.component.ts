import { Component } from '@angular/core';
import { HeaderService } from '@src/app/common/services/header/header.service';
import { BookingService } from '@booking/booking.service';
import { Service } from '@navaja/shared';
import { Router } from '@angular/router';
import { UserService } from '@src/app/user/user.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  services$ = this.bookingService.getServices$();
  loggedIn = this.userService.isLoggedIn;

  constructor(
    private readonly bookingService: BookingService,
    private readonly headerService: HeaderService,
    private readonly router: Router,
    private readonly userService: UserService
  ) {
    this.headerService.setHeader('Services');
    this.bookingService.selectedService = null;
  }

  bookService(service: Service) {
    this.bookingService.selectedService = service;
    this.router.navigate(['/booking']);
  }
}
