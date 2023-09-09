import { Component, ViewChild } from "@angular/core";
import { HeaderService } from "../../shared/services/header/header.service";
import { DocumentData } from "@angular/fire/firestore";
import { BehaviorSubject, Observable, Subject, of, tap } from "rxjs";
import { MatCalendar } from "@angular/material/datepicker";
import { Availability, TimeSlot } from "../../shared/types/time-slot";
import { CalendarService } from "../../shared/services/calendar/calendar.service";
import { ServiceService } from "../../shared/services/service/service.service";
import { DateUtils } from "../../shared/utilities/date.util";

@Component({
  selector: "app-booking",
  templateUrl: "./booking.component.html",
  styleUrls: ["./booking.component.scss"],
})
export class BookingComponent {
  eventDuration = 1000 * 60 * 60;
  timeSlotsByDate = new Map<string, TimeSlot[]>();
  currDateTimeSlots$ = new Subject<TimeSlot[]>();
  services$: Observable<DocumentData[]>;
  availability$: Observable<Availability>;
  selectedDateHash$ = new BehaviorSubject<string>(
    DateUtils.getDateHash(new Date()),
  );
  @ViewChild(MatCalendar) calendar: MatCalendar<Date> | undefined;

  constructor(
    private readonly headerService: HeaderService,
    private readonly serviceService: ServiceService,
    private readonly calendarService: CalendarService,
  ) {
    this.headerService.setHeader("Booking");
    this.services$ = this.serviceService.getServices$();
    this.availability$ = this.calendarService.getAvailability(
      this.eventDuration,
    );
  }

  onDateSelected($event: Date | null) {
    if ($event) {
      this.selectedDateHash$.next(DateUtils.getDateHash($event));
    }
  }

  onTimeSlotSelected(timeSlot: TimeSlot) {
    return;
  }
}
