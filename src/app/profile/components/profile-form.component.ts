import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { HeaderService } from '../../shared/services/header/header.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user/user.service';
import { UserProfile } from '../../shared/types/user-profile';
import { MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
  selector: 'profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ProfileFormComponent implements OnInit {
  @Input() userProfile: UserProfile | null;
  inEditMode = false;
  userProfileForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly headerService: HeaderService,
  ) {
    this.headerService.setHeader('Profile');
  }

  ngOnInit(): void {
    this.userProfileForm = this.fb.group({
      firstName: [
        this.userProfile?.firstName,
        [Validators.required, Validators.pattern(/[a-zA-Z]{2,}/g)],
      ],
      lastName: [
        this.userProfile?.lastName,
        [Validators.required, Validators.pattern(/[a-zA-Z]{2,}/g)],
      ],
      streetAddr: [
        this.userProfile?.streetAddr,
        [Validators.required, Validators.pattern(/\d+\s+\w+\s+\w+/g)],
      ],
      city: [
        this.userProfile?.city,
        [Validators.required, Validators.pattern(/[a-zA-Z]{2,}/g)],
      ],
      state: [
        this.userProfile?.state,
        [Validators.required, Validators.pattern(/[A-Z]{2}/g)],
      ],
      zipCode: [
        this.userProfile?.zipCode,
        [Validators.required, Validators.pattern(/\d{5}/g)],
      ],
    });
  }

  onEdit() {
    this.inEditMode = !this.inEditMode;
  }

  onSubmit() {
    console.log(this.userProfile);
  }

  onCancel() {
    console.log('cancel');
    this.inEditMode = false;
  }

  get appearance(): MatFormFieldAppearance {
    return this.inEditMode ? 'fill' : 'outline';
  }
}
