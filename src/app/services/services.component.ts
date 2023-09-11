import { Component } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { HeaderService } from '../shared/services/header/header.service';
import { ServiceService } from '../shared/services/services/services.service';
import { UserService } from '../shared/services/user/user.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent {
  services$: Observable<DocumentData[]>;

  constructor(
    private readonly authService: UserService,
    private readonly serviceService: ServiceService,
    private readonly headerService: HeaderService,
  ) {
    this.headerService.setHeader('Services');
    this.services$ = this.serviceService.getServices();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.authService.isLoggedIn$;
  }
}
