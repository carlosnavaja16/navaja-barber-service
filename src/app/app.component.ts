import { Component } from '@angular/core';
import { UserService } from './shared/services/user/user.service';
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
    public authService: UserService,
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
