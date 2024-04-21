import { Component, Signal } from '@angular/core';
import { HeaderService } from '@src/app/common/services/header/header.service';
import { Store } from '@ngrx/store';
import * as UserSelectors from '../user/state/user.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loggedIn: Signal<boolean>;

  constructor(
    private readonly headerService: HeaderService,
    private readonly store: Store
  ) {
    this.headerService.setHeader('Navaja Barber Service');
    this.loggedIn = toSignal(this.store.select(UserSelectors.getLoggedIn), {
      initialValue: false
    });
  }
}
