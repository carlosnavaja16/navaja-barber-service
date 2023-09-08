import { Component, ViewChild } from "@angular/core";
import { HeaderService } from "../shared/services/header/header.service";
import { DocumentData } from "@angular/fire/firestore";
import { Observable, Subject, of, tap } from "rxjs";
import { MatCalendar } from "@angular/material/datepicker";
import { Availability, TimeSlot } from "../shared/types/time-slot";
import { CalendarService } from "../shared/services/calendar/calendar.service";
import { ServiceService } from "../shared/services/service/service.service";
import { DateUtils } from "../shared/utilities/date.util";

@Component({
  selector: "app-booking",
  templateUrl: "./booking.component.html",
  styleUrls: ["./booking.component.scss"],
})
export class BookingComponent {
  filter = (date: Date) => true;
  eventDuration = 1000 * 60 * 60;
  timeSlotsByDate = new Map<string, TimeSlot[]>();
  currDateTimeSlots$ = new Subject<TimeSlot[]>();
  services$: Observable<DocumentData[]>;
  availability$: Observable<Availability>;
  availableTimeSlots: Availability;
  @ViewChild(MatCalendar) calendar: MatCalendar<Date> | undefined;

  constructor(
    private readonly headerService: HeaderService,
    private readonly serviceService: ServiceService,
    private readonly calendarService: CalendarService,
  ) {
    this.headerService.setHeader("Booking");
    this.services$ = this.serviceService.getServices$();
    this.availability$ = this.calendarService
      .getAvailability(this.eventDuration)
      .pipe(
        tap((availability) => {
          this.timeSlotsByDate = availability.timeSlotsByDate;
          this.filter = (date: Date) => {
            return DateUtils.isDateInAvailableDates(date, this.timeSlotsByDate);
          };
        }),
      );
  }

  getTimeSlotsByDate($event: Date | null) {
    if ($event) {
      const dateHash = DateUtils.getDateHash($event);
      this.currDateTimeSlots$.next(
        this.timeSlotsByDate.has(dateHash)
          ? this.timeSlotsByDate.get(dateHash)!
          : [],
      );
    }
  }
}
