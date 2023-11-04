import { Component, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
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
  services$: Observable<Service[]>;

  constructor(
    private readonly userService: UserService,
    private readonly bookingService: BookingService,
    private readonly headerService: HeaderService,
    private readonly router: Router,
  ) {
    this.headerService.setHeader('Services');
    this.services$ = this.bookingService.getServices();
  }

  get isLoggedIn(): WritableSignal<boolean> {
    return this.userService.getIsLoggedIn();
  }

  bookService(service: Service) {
    this.router.navigate(['/booking'], { queryParams: service });
  }
}
