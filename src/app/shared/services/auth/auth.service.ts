import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  loggedIn = new BehaviorSubject<boolean>(false);

  constructor(public afAuth: AngularFireAuth) {
    this.afAuth.onAuthStateChanged((user) => {
        if (user) {
          this.loggedIn.next(true);
        }
        else{
            this.loggedIn.next(false);
        }
    });
  }

  isLoggedIn(): Observable<boolean>{
    return this.loggedIn.asObservable();
  }
}
