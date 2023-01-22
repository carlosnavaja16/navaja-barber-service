import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { HeaderService } from '../shared/services/header/header.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  services: Observable<any[]>;

  constructor(firestore: AngularFirestore, headerService: HeaderService) { 
    this.services = firestore.collection('Services', ref => ref.orderBy('price', 'asc')).valueChanges();
    headerService.setHeader("Services");
  }

  ngOnInit(): void {
  }

}
