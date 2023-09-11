import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../shared/services/header/header.service';
import { Auth, user } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, take, tap } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { UserService } from '../shared/services/user/user.service';
import { UserProfile } from '../shared/types/user-profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  userProfile$: Observable<UserProfile>;

  constructor(
    private readonly headerService: HeaderService,
    private readonly userService: UserService,
  ) {
    this.headerService.setHeader('Profile');
    this.userProfile$ = this.userService.getUserProfile();
  }
}
