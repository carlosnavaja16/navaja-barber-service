import { Component, Signal, ViewChild, WritableSignal } from '@angular/core';
import { HeaderService } from './common/services/header/header.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UserService } from './user/user.service';
import { Router } from '@angular/router';

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
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe('(min-width: 768px)')
      .subscribe((state) => (state.matches ? this.sidenav?.close() : null));
    this.loggedIn = this.userService.isLoggedIn;
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  logOut() {
    this.sidenav.close();
    this.userService.logOut().then(() => {
      this.router.navigate(['/']);
    });
  }

  get header(): WritableSignal<string> {
    return this.headerService.getHeader();
  }
}
