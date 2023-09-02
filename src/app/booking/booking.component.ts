import { Component } from "@angular/core";
import { HeaderService } from "../shared/services/header/header.service";
import {
  DocumentData,
  Firestore,
  collection,
  collectionData,
  orderBy,
  query,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import {
  Functions,
  httpsCallable,
} from "@angular/fire/functions";
import { Auth } from "@angular/fire/auth";

@Component({
  selector: "app-booking",
  templateUrl: "./booking.component.html",
  styleUrls: ["./booking.component.scss"],
})
export class BookingComponent {
  getSundaysDisabled = (date: Date) => {
    return date.getDay() !== 0;
  };

  getAvailableSlots = httpsCallable(this.functions, "getAvailableSlots");

  services$: Observable<DocumentData[]>;

  constructor(
    public headerService: HeaderService,
    public firestore: Firestore,
    public functions: Functions,
    public auth: Auth,
  ) {
    headerService.setHeader("Booking");
    const servicesCollection = collection(firestore, "Services");
    const servicesQuery = query(servicesCollection, orderBy("price", "asc"));
    this.services$ = collectionData(servicesQuery);
  }

  getTimeSlots() {
    const requestData: any = {
      eventDurationMilliseconds: 1000 * 60 * 60,
      utcOffset: new Date().getTimezoneOffset(),
    };

    this.getAvailableSlots(requestData)
      .then((timeSlots) => {
        console.log(JSON.stringify(timeSlots, null, 2));
      })
      .catch((err) => {
        console.log(JSON.stringify(err, null, 2));
      });
  }
}
