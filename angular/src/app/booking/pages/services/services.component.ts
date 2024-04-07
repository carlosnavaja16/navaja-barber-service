import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HeaderService } from '@app/common/services/header/header.service';
import { UserService } from '@user/user.service';
import { BookingService } from '@booking/booking.service';
import { Service } from '@schema/service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as UserSelectors from '@src/app/user/state/user.selectors';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  services: Signal<Service[]>;

  constructor(
    private readonly userService: UserService,
    private readonly bookingService: BookingService,
    private readonly headerService: HeaderService,
    private readonly router: Router,
    private readonly store: Store
  ) {
    this.headerService.setHeader('Services');
    this.services = toSignal(this.bookingService.getServices(), {
      initialValue: []
    });
    this.bookingService.selectedService = null;
  }

  get isLoggedIn(): Signal<boolean> {
    return toSignal(this.store.select(UserSelectors.getLoggedIn), {
      initialValue: false
    });
  }

  bookService(service: Service) {
    this.bookingService.selectedService = service;
    this.router.navigate(['/booking']);
  }
}
