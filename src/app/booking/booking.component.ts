import { Component, ViewChild } from "@angular/core";
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
  HttpsCallableOptions,
  httpsCallable,
} from "@angular/fire/functions";
import { Auth } from "@angular/fire/auth";
import { MatCalendar } from "@angular/material/datepicker";
import { Timeslot } from "../shared/types/timeslot";
import { CalendarService } from "../shared/services/calendar/calendar.service";

interface AvailableSlotsResponse {}

@Component({
  selector: "app-booking",
  templateUrl: "./booking.component.html",
  styleUrls: ["./booking.component.scss"],
})
export class BookingComponent {
  getSundaysDisabled = (date: Date) => {
    return date.getDay() !== 0;
  };

  dateFilter = (date: Date) => {};
  minDate: Date;
  maxDate: Date;

  eventDurationMilliseconds = 1000 * 60 * 60;
  services$: Observable<DocumentData[]>;
  availableTimeslots$: Observable<Timeslot[]>;
  @ViewChild(MatCalendar) calendar: MatCalendar<Date> | undefined;

  constructor(
    public headerService: HeaderService,
    public firestore: Firestore,
    public calendarService: CalendarService,
  ) {
    headerService.setHeader("Booking");
    const servicesCollection = collection(firestore, "Services");
    const servicesQuery = query(servicesCollection, orderBy("price", "asc"));
    this.services$ = collectionData(servicesQuery);
  }

  getTimeSlots() {
    this.availableTimeslots$ = this.calendarService.getAvailableTimeslots(
      this.eventDurationMilliseconds,
    );
  }
}
