import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { SignUpDetails } from '@schema/sign-up-details';

@Component({
  selector: 'sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss']
})
export class SignUpFormComponent implements OnInit {
  signUpForm: FormGroup;
  @Output() formSubmitted = new EventEmitter<SignUpDetails>();

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z]{2,}')
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z]{2,}')
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{10}')
      ]),
      streetAddr: new FormControl('', [Validators.required]),
      city: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z]{2,}')
      ]),
      state: new FormControl('', [
        Validators.required,
        Validators.pattern('[A-Z]{2}')
      ]),
      zipCode: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{5}')
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        this.confirmPasswordValidator
      ])
    });
  }

  onSubmit(): void {
    this.formSubmitted.emit({
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
      userProfile: {
        userId: '',
        firstName: this.signUpForm.value.firstName,
        lastName: this.signUpForm.value.lastName,
        phone: this.signUpForm.value.phone,
        streetAddr: this.signUpForm.value.streetAddr,
        city: this.signUpForm.value.city,
        state: this.signUpForm.value.state,
        zipCode: this.signUpForm.value.zipCode,
        isAdmin: false
      }
    } as SignUpDetails);
  }

  get firstName() {
    return this.signUpForm.get('firstName');
  }

  get lastName() {
    return this.signUpForm.get('lastName');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get phone() {
    return this.signUpForm.get('phone');
  }

  get streetAddr() {
    return this.signUpForm.get('streetAddr');
  }

  get city() {
    return this.signUpForm.get('city');
  }

  get state() {
    return this.signUpForm.get('state');
  }

  get zipCode() {
    return this.signUpForm.get('zipCode');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  confirmPasswordValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    return control.value === this.signUpForm?.value?.password
      ? null
      : { PasswordNoMatch: true };
  };
}
