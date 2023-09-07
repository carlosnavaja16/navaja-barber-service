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
import { ServiceService } from "../shared/services/service/service.service";
import { LIMIT_DAYS } from "../shared/constants";

@Component({
  selector: "app-booking",
  templateUrl: "./booking.component.html",
  styleUrls: ["./booking.component.scss"],
})
export class BookingComponent {
  getSundaysDisabled = (date: Date) => {
    return date.getDay() !== 0;
  };

  minDate: Date;
  maxDate: Date;

  eventDurationMilliseconds = 1000 * 60 * 60;
  services$: Observable<DocumentData[]>;
  availableTimeslots$: Observable<Timeslot[]>;
  @ViewChild(MatCalendar) calendar: MatCalendar<Date> | undefined;

  constructor(
    private readonly headerService: HeaderService,
    private readonly serviceService: ServiceService,
    private readonly calendarService: CalendarService,
  ) {
    this.headerService.setHeader("Booking");
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + LIMIT_DAYS);
    this.services$ = this.serviceService.getServices$();
  }

  getTimeSlots() {
    this.availableTimeslots$ = this.calendarService.getAvailableTimeslots(
      this.eventDurationMilliseconds,
    );
  }
}
