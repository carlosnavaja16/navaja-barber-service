import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HeaderService } from '../shared/services/header/header.service';
import { Component } from '@angular/core';
import { Observable, from, take } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ToastService } from '../shared/services/toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    email: string = '';
    password: string = '';

  constructor(
    public headerService: HeaderService,
    public router: Router, 
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public toastService: ToastService
    ) {
    this.headerService.setHeader("Login")
   }

  ngOnInit(): void {
  }

  login(): void {
    const userPromise = this.afAuth.signInWithEmailAndPassword(this.email, this.password);
    const userObservable = from(userPromise);
    userObservable.subscribe({
      next: (user) => {
        const userProfilesCollection = this.afs.collection('UserProfiles', ref => ref.where('userId', "==", user.user?.uid));
        const userProfilesObservable: Observable<any> = userProfilesCollection.valueChanges();
        userProfilesObservable
        .pipe(take(1))
        .subscribe({
          next: (usersProfile) => {
            this.toastService.show(`Login successful. Welcome back ${usersProfile[0].firstName}!`);
            this.router.navigate(['/']);
          },
          error: (err) => {
            
          }
        });
      },
    });
  }

}
