import { Component, OnInit } from '@angular/core';
import { Firestore, collection, query, collectionData, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { HeaderService } from '../shared/services/header/header.service';
import { AuthService } from '../shared/services/auth/auth.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  services$: Observable<any[]>;

  constructor(
    firestore: Firestore,
    headerService: HeaderService,
    public authService: AuthService
    ) { 
     //ref => ref.orderBy('price', 'asc') 
    const servicesCollection = collection(firestore, 'Services');
    const servicesQuery = query(servicesCollection, orderBy('price', 'asc'));
    this.services$ = collectionData(servicesQuery);
    headerService.setHeader("Services");
  }

  ngOnInit(): void {
  }

}
