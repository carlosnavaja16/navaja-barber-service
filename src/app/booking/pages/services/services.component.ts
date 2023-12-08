import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HeaderService } from '../../../shared/services/header/header.service';
import { UserService } from '../../../user/user.service';
import { BookingService } from '../../booking.service';
import { Service } from '../../types/service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent {
  services: Signal<Service[]>;

  constructor(
    private readonly userService: UserService,
    private readonly bookingService: BookingService,
    private readonly headerService: HeaderService,
    private readonly router: Router,
  ) {
    this.headerService.setHeader('Services');
    this.services = toSignal(this.bookingService.getServices(), {
      initialValue: [],
    });
    this.bookingService.selectedService = null;
  }

  get isLoggedIn(): Signal<boolean> {
    return this.userService.getIsLoggedIn();
  }

  bookService(service: Service) {
    this.bookingService.selectedService = service;
    this.router.navigate(['/booking']);
  }
}
