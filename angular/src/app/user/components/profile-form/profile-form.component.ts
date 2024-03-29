import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HeaderService } from '@app/common/services/header/header.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { UserProfile } from '@schema/user-profile';
import { MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
  selector: 'profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {
  @Input() userProfile: UserProfile | null;
  @Output() formSubmitted = new EventEmitter<UserProfile>();
  inEditMode = false;
  userProfileForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly headerService: HeaderService
  ) {
    this.headerService.setHeader('Profile');
  }

  ngOnInit(): void {
    this.userProfileForm = this.fb.group({
      firstName: new FormControl(this.userProfile?.firstName, [
        Validators.required,
        Validators.pattern('[a-zA-Z]{2,}')
      ]),
      lastName: new FormControl(this.userProfile?.lastName, [
        Validators.required,
        Validators.pattern('[a-zA-Z]{2,}')
      ]),
      phone: new FormControl(this.userProfile?.phone, [
        Validators.required,
        Validators.pattern('[0-9]{10}')
      ]),
      streetAddr: new FormControl(this.userProfile?.streetAddr, [
        Validators.required
      ]),
      city: new FormControl(this.userProfile?.city, [
        Validators.required,
        Validators.pattern('[a-zA-Z]{2,}')
      ]),
      state: new FormControl(this.userProfile?.state, [
        Validators.required,
        Validators.pattern('[A-Z]{2}')
      ]),
      zipCode: new FormControl(this.userProfile?.zipCode, [
        Validators.required,
        Validators.pattern('[0-9]{5}')
      ])
    });
  }

  onEdit() {
    this.inEditMode = true;
  }

  onSubmit() {
    this.formSubmitted.emit({
      ...this.userProfileForm.value
    } as UserProfile);
    this.inEditMode = false;
  }

  onCancel() {
    this.userProfileForm.reset(this.userProfile, { emitEvent: false });
    this.inEditMode = false;
  }

  get appearance(): MatFormFieldAppearance {
    return this.inEditMode ? 'fill' : 'outline';
  }

  get firstName() {
    return this.userProfileForm.get('firstName');
  }

  get lastName() {
    return this.userProfileForm.get('lastName');
  }

  get phone() {
    return this.userProfileForm.get('phone');
  }

  get streetAddr() {
    return this.userProfileForm.get('streetAddr');
  }

  get city() {
    return this.userProfileForm.get('city');
  }

  get state() {
    return this.userProfileForm.get('state');
  }

  get zipCode() {
    return this.userProfileForm.get('zipCode');
  }
}
