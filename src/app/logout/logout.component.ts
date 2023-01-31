import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastService } from '../shared/services/toast/toast.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth,
   public router: Router,
   public toastService: ToastService
   ) { }

  ngOnInit(): void {
    this.afAuth.signOut();
    this.toastService.show('Logged out successfully.');
    this.router.navigate(['/']);
  }

}
