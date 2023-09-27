import { Component, WritableSignal, signal } from '@angular/core';
import { UserService } from './user/user.service';
import { HeaderService } from './shared/services/header/header.service';
import { Router } from '@angular/router';
import { SnackbarService } from './shared/services/snackbar/snackbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isNavbarCollapsed = signal(true);

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly snackbarService: SnackbarService,
    private readonly headerService: HeaderService,
  ) {}

  navBarToggle() {
    this.isNavbarCollapsed.set(!this.isNavbarCollapsed());
  }

  collapseNavbar() {
    this.isNavbarCollapsed.set(true);
  }

  logOut() {
    this.collapseNavbar();
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
