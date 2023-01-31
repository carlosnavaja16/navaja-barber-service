import { Component, ViewChild } from '@angular/core';
import { AuthService } from './shared/services/auth/auth.service';
import { HeaderService } from './shared/services/header/header.service';
import { Title } from '@angular/platform-browser';
import { ToastService, toast } from './shared/services/toast/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLoggedIn = false;
  isNavCollapsed = true;
  header = '';

  constructor(
    authService: AuthService, 
    headerService: HeaderService, 
    titleService: Title,
    public toastService: ToastService
    ) {
      authService.isLoggedIn().subscribe( (loggedIn) => {
        this.isLoggedIn = loggedIn;
      });
      headerService.getHeader().subscribe( (header) => {
        this.header = header;
        titleService.setTitle(header);
      });
    }
    
}