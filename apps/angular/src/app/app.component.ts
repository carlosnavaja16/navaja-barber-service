import { Component, Signal, ViewChild, WritableSignal } from '@angular/core';
import { HeaderService } from './common/services/header/header.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
import * as UserSelectors from './user/state/user.selectors';
import * as UserActions from './user/state/user.actions';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidenav') sidenav: MatSidenav;
  loggedIn: Signal<boolean>;

  constructor(
    private readonly headerService: HeaderService,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly store: Store<AppState>
  ) {
    this.breakpointObserver
      .observe('(min-width: 768px)')
      .subscribe((state) => (state.matches ? this.sidenav?.close() : null));
    this.loggedIn = toSignal(this.store.select(UserSelectors.getLoggedIn), {
      initialValue: false
    });
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  logOut() {
    this.sidenav.close();
    this.store.dispatch(UserActions.logOut());
  }

  get header(): WritableSignal<string> {
    return this.headerService.getHeader();
  }
}
