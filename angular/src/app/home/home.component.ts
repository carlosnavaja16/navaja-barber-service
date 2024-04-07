import { Component } from '@angular/core';
import { HeaderService } from '@app/common/services/header/header.service';
import { UserService } from '@user/user.service';
import { Store } from '@ngrx/store';
import * as UserSelectors from '../user/state/user.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    private readonly headerService: HeaderService,
    private readonly userService: UserService,
    private readonly store: Store
  ) {
    this.headerService.setHeader('Navaja Barber Service');
  }

  get isLoggedIn(): Signal<boolean> {
    return toSignal(this.store.select(UserSelectors.getLoggedIn), {
      initialValue: false
    });
  }
}
