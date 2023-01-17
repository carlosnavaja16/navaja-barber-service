import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../shared/services/header/header.service';

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

  constructor(headerService: HeaderService) {
    headerService.setTitle('Sign Up');
  }

  ngOnInit(): void {}

  validate(): void{
    alert('cahng');
    if(this.submitAttempted){
        this.validateInput(this.firstName, 'firstNameInput', /[a-zA-Z]{2,}/g);
        this.validateInput(this.lastName, 'lastNameInput', /[a-zA-Z]{2,}/g);
        this.validateInput(this.city, 'cityInput', /[a-zA-Z]{2,}/g);
        this.validateInput(this.state, 'stateInput', /FL/g);
        this.validateInput(this.zipCode, 'zipCodeInput', /\d{5}/g);
        this.validateInput(this.email, 'emailInput', /.+@.+\..+/g);
        this.validateInput(this.firstName, 'firstNameInput', /\.{6,}/g);
        if (this.confirmPassword != this.password){
            this.formValid = false;
            document.getElementById('confirmPasswordInput')?.classList.add('is-invalid');
        }
        else{
            document.getElementById('confirmPasswordInput')?.classList.replace('is-invalid', 'is-valid');
        }
    }
  }
  signUp(): void {
    this.submitAttempted = true;
    this.validate();
    if (this.formValid == true){
        alert('Form is valid and could be submitted.');
    }
  }

  validateInput(input: string, inputField: string, pattern: RegExp): void {
    if (input.match(pattern) === null){
        this.formValid = false;
        document.getElementById(inputField)?.classList.add('is-invalid');
    }
    else{
        document.getElementById(inputField)?.classList.replace('is-invalid', 'is-valid');
    }
  }
}
