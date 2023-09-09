import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(public auth: Auth) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.loggedIn$.next(true);
      } else {
        this.loggedIn$.next(false);
      }
    });
  }

  public getIsLoggedIn$(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }
}
