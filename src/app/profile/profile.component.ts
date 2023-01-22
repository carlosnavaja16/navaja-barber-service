import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../shared/services/header/header.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, take } from 'rxjs';
import { HashLocationStrategy } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  firstName = '';
  lastName = '';
  streetAddr = '';
  city = '';
  state = 'FL';
  zipCode = '';
  submitAttempted = false;
  formValid = true;

  constructor(
    public headerService: HeaderService,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore
  ) {
    
    
  }

  ngOnInit(): void {
    this.headerService.setHeader('Profile');
    const userObservable = this.afAuth.user;
    userObservable.subscribe({
      next: (user) => {
        alert(`User ${user?.email} with ${user?.uid} is logged in`);
        const userProfilesCollection = this.afs.collection('UserProfiles', ref => ref.where('userId', "==", user?.uid));
        const userProfilesObservable: Observable<any> = userProfilesCollection.valueChanges();
        userProfilesObservable
        .pipe(take(1))
        .subscribe({
          next: (userProfiles) => {
            console.log(userProfiles);
            this.firstName = userProfiles[0].firstName;
            this.lastName = userProfiles[0].lastName;
            this.streetAddr = userProfiles[0].streetAddr;
            this.city = userProfiles[0].city;
            this.state = userProfiles[0].state;
            this.zipCode = userProfiles[0].zipCode;
          }
        });
      },
    });
  }

  validate(): void{
    if(this.submitAttempted){
        this.formValid = true;
        this.validateInput(this.firstName, 'firstNameInput', /[a-zA-Z]{2,}/g);
        this.validateInput(this.lastName, 'lastNameInput', /[a-zA-Z]{2,}/g);
        this.validateInput(this.streetAddr, 'streetAddrInput', /\d+\s+\w+\s+\w+/g);
        this.validateInput(this.city, 'cityInput', /[a-zA-Z]{2,}/g);
        this.validateInput(this.state, 'stateInput', /FL/g);
        this.validateInput(this.zipCode, 'zipCodeInput', /\d{5}/g);
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

  edit(): void{

  }

  save(): void{

  }
}
