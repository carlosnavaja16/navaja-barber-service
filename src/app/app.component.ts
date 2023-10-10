import { Component, ViewChild, WritableSignal } from '@angular/core';
import { UserService } from './user/user.service';
import { HeaderService } from './shared/services/header/header.service';
import { Router } from '@angular/router';
import { SnackbarService } from './shared/services/snackbar/snackbar.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly snackbarService: SnackbarService,
    private readonly headerService: HeaderService,
    private readonly breakpointObserver: BreakpointObserver,
  ) {
    this.breakpointObserver
      .observe('(min-width: 768px)')
      .subscribe((state) => (state.matches ? this.sidenav.close() : null));
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  logOut() {
    this.sidenav.close();
    this.userService.logOut().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.snackbarService.pushSnackbar(
          `Error logging out: ${error.message}`,
        );
      },
    });
  }

  get isLoggedIn(): WritableSignal<boolean> {
    return this.userService.isLoggedIn;
  }

  get header(): WritableSignal<string> {
    return this.headerService.getHeader();
  }
}
