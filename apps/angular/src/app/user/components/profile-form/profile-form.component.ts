import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HeaderService } from '@src/app/common/services/header/header.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  UserProfile,
  AT_LEAST_TWO_CHARS_REGEX,
  PHONE_REGEX,
  STATE_REGEX,
  ZIP_CODE_REGEX
} from '@navaja/shared';
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
        Validators.pattern(AT_LEAST_TWO_CHARS_REGEX)
      ]),
      lastName: new FormControl(this.userProfile?.lastName, [
        Validators.required,
        Validators.pattern(AT_LEAST_TWO_CHARS_REGEX)
      ]),
      phone: new FormControl(this.userProfile?.phone, [
        Validators.required,
        Validators.pattern(PHONE_REGEX)
      ]),
      streetAddr: new FormControl(this.userProfile?.streetAddr, [
        Validators.required
      ]),
      city: new FormControl(this.userProfile?.city, [
        Validators.required,
        Validators.pattern(AT_LEAST_TWO_CHARS_REGEX)
      ]),
      state: new FormControl(this.userProfile?.state, [
        Validators.required,
        Validators.pattern(STATE_REGEX)
      ]),
      zipCode: new FormControl(this.userProfile?.zipCode, [
        Validators.required,
        Validators.pattern(ZIP_CODE_REGEX)
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
