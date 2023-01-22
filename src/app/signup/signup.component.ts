import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../shared/services/header/header.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  firstName = '';
  lastName = '';
  streetAddr = '';
  city = '';
  state = 'FL';
  zipCode = '';
  email = '';
  password = '';
  confirmPassword = '';
  submitAttempted = false;
  formValid = true;

  constructor(
    headerService: HeaderService, 
    public router: Router,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    ) {
    headerService.setHeader('Sign Up');
  }

  ngOnInit(): void {}

  validate(): void{
    if(this.submitAttempted){
        this.formValid = true;
        this.validateInput(this.firstName, 'firstNameInput', /[a-zA-Z]{2,}/g);
        this.validateInput(this.lastName, 'lastNameInput', /[a-zA-Z]{2,}/g);
        this.validateInput(this.streetAddr, 'streetAddrInput', /\d+\s+\w+\s+\w+/g);
        this.validateInput(this.city, 'cityInput', /[a-zA-Z]{2,}/g);
        this.validateInput(this.state, 'stateInput', /FL/g);
        this.validateInput(this.zipCode, 'zipCodeInput', /\d{5}/g);
        this.validateInput(this.email, 'emailInput', /.+@.+\..+/g);
        this.validateInput(this.password, 'passwordInput', /.{6,}/g);

        //validation of the confirm password field
        if (this.confirmPassword == this.password && this.confirmPassword.length >= 6){
            document.getElementById('confirmPasswordInput')?.classList.remove('is-invalid');
        }

        else {
            this.formValid = false
            document.getElementById('confirmPasswordInput')?.classList.add('is-invalid');
        }
    }
  }
  signUp(): void {
    this.submitAttempted = true;
    this.validate();
    if (this.formValid == true){
        const userPromise = this.afAuth.createUserWithEmailAndPassword(this.email, this.password);
        const userObservable = from(userPromise)
        userObservable.subscribe({
            next: (user) => {
                const newUserProfile = {
                    userId: user.user?.uid,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    streetAddr: this.streetAddr,
                    city: this.city,
                    state: this.state,
                    zipCode: this.zipCode,
                }

                const userProfilesCollection = this.afs.collection('UserProfiles');
                userProfilesCollection.add(newUserProfile)
                alert(`Your account has been created ${this.firstName}!`)
                this.router.navigate(['/home']);
            },
            error: (error) => {
                alert(`Could not create new user: ${error}. Try again?`)
            }
        });
    }
  }

  validateInput(input: string, inputField: string, pattern: RegExp): void {
    if (pattern.test(input)){
        document.getElementById(inputField)?.classList.remove('is-invalid');
    }

    else {
        this.formValid = false;
        document.getElementById(inputField)?.classList.add('is-invalid');
    }
  }
}
