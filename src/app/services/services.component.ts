import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  services: Observable<any[]>;

  constructor(firestore: AngularFirestore) { 
    this.services = firestore.collection('Services').valueChanges();
  }

  ngOnInit(): void {
  }

}
