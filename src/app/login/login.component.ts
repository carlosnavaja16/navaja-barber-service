import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HeaderService } from '../shared/services/header/header.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    email: string = '';
    password: string = '';

  constructor(public afAuth: AngularFireAuth, public headerService: HeaderService) {
    
   }

  ngOnInit(): void {
    this.headerService.setTitle("Login")
  }

  login(): void {
    this.afAuth.signInWithEmailAndPassword(this.email, this.password)
    .then((user) =>{
        alert('login successful');
    
    })
    .catch((err) => {
        alert('there was an error signing in: ' + err);
    });
  }

}
