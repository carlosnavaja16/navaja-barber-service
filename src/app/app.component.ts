import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth/auth.service';
import { HeaderService } from './shared/services/header/header.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public isNavbarCollapsed$ = new BehaviorSubject<boolean>(true);

  constructor(
    public authService: AuthService,
    public headerService: HeaderService,
  ) {}

  public navBarToggle() {
    this.isNavbarCollapsed$.next(!this.isNavbarCollapsed$.value);
  }

  public collapseNavbar() {
    this.isNavbarCollapsed$.next(true);
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.authService.isLoggedIn$;
  }
}
