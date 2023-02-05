import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { HeaderService } from '../shared/services/header/header.service';
import { Component } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
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
    public auth: Auth,
    public firestore: Firestore,
    public toastService: ToastService
    ) {
    this.headerService.setHeader("Login")
   }

  ngOnInit(): void {
  }

  login(): void {
    const userPromise = signInWithEmailAndPassword(this.auth, this.email, this.password);
    userPromise.then((user) => {
      const userCollection = collection(this.firestore, 'UserProfiles')
      const userQuery = query(userCollection, where('userId', '==', user.user.uid));
      const userProfilesObservable: Observable<any> = collectionData(userQuery)
      userProfilesObservable
      .pipe(take(1))
      .subscribe({
        next: (usersProfile) => {
          this.toastService.show(`Login successful. Welcome back ${usersProfile[0].firstName}!`);
          this.router.navigate(['/']);
        }
      });
    }).catch((error) => {
      this.toastService.show(`Could not authenticate: ${error}`, 'danger');
    });
  }
}
