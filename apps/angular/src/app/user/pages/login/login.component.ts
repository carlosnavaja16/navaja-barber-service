import { HeaderService } from '@src/app/common/services/header/header.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@src/app/app.state';
import * as UserActions from '@src/app/user/state/user.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private readonly headerService: HeaderService,
    private readonly fb: FormBuilder,
    private readonly store: Store<AppState>
  ) {
    this.headerService.setHeader('Login');
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  onLogin() {
    this.store.dispatch(
      UserActions.logIn({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      })
    );
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
