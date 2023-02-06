import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { ToastService } from '../shared/services/toast/toast.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(public auth: Auth,
   public router: Router,
   public toastService: ToastService
   ) { }

  ngOnInit(): void {
    signOut(this.auth)
      .then(() => {
        this.toastService.show('Logged out successfully.');
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.toastService.show(`Could not logout: ${err}`);
      });
  }

}
