import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { HeaderService } from '../shared/services/header/header.service';
import { AuthService } from '../shared/services/auth/auth.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  services: Observable<any[]>;
  isLoggedIn$: Observable<boolean>;

  constructor(
    afs: AngularFirestore,
    headerService: HeaderService,
    authService: AuthService
    ) { 
    this.services = afs.collection('Services', ref => ref.orderBy('price', 'asc')).valueChanges();
    headerService.setHeader("Services");
    this.isLoggedIn$ = authService.isLoggedIn();
  }

  ngOnInit(): void {
  }

}
