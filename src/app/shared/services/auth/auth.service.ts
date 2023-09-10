import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isLoggedIn$ = new Subject<boolean>();

  constructor(public auth: Auth) {
    onAuthStateChanged(auth, (user) => {
      this.isLoggedIn$.next(!!user);
    });
  }
}
