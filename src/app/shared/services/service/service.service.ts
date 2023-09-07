import { Injectable } from "@angular/core";
import {
  CollectionReference,
  DocumentData,
  Firestore,
  collection,
  collectionData,
  orderBy,
  query,
  Query,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ServiceService {
  servicesCollection: CollectionReference<DocumentData>;
  servicesQuery: Query<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.servicesCollection = collection(this.firestore, "Services");
    this.servicesQuery = query(
      this.servicesCollection,
      orderBy("price", "asc"),
    );
  }
  getServices$(): Observable<DocumentData[]> {
    return collectionData(this.servicesQuery);
  }
}
