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
import { TimeSlot } from "../shared/types/time-slot";
import { CalendarService } from "../shared/services/calendar/calendar.service";
import { ServiceService } from "../shared/services/service/service.service";
import { LIMIT_DAYS } from "../shared/constants";
import { DateUtils } from "../shared/utilities/date.util";

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
  availableTimeslots$: Observable<TimeSlot[]>;
  @ViewChild(MatCalendar) calendar: MatCalendar<Date> | undefined;

  constructor(
    private readonly headerService: HeaderService,
    private readonly serviceService: ServiceService,
    private readonly calendarService: CalendarService,
  ) {
    this.headerService.setHeader("Booking");
    this.minDate = DateUtils.getMinDate();
    this.maxDate = DateUtils.getMaxDate();
    this.services$ = this.serviceService.getServices$();
  }

  getTimeSlots() {
    this.availableTimeslots$ = this.calendarService.getAvailableTimeslots(
      this.eventDurationMilliseconds,
    );
  }
}
