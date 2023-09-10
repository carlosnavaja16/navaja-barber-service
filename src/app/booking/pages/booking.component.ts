import { Component, ViewChild } from '@angular/core';
import { HeaderService } from '../../shared/services/header/header.service';
import { DocumentData } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject, map, of, tap } from 'rxjs';
import { MatCalendar } from '@angular/material/datepicker';
import { Availability, TimeSlot } from '../../shared/types/time-slot';
import { CalendarService } from '../../shared/services/calendar/calendar.service';
import { ServiceService } from '../../shared/services/service/service.service';
import { DateUtils } from '../../shared/utilities/date.util';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent {
  eventDuration = 1000 * 60 * 60;
  services$: Observable<DocumentData[]>;
  availability$: Observable<Availability>;
  timeSlotsByDate$: BehaviorSubject<Map<string, TimeSlot[]>>;
  selectedDate$: BehaviorSubject<Date>;

  @ViewChild('stepper') MatStepper: MatStepper;

  constructor(
    private readonly headerService: HeaderService,
    private readonly serviceService: ServiceService,
    private readonly calendarService: CalendarService,
  ) {
    this.headerService.setHeader('Booking');
    this.services$ = this.serviceService.getServices$();
    this.availability$ = this.calendarService
      .getAvailability(this.eventDuration)
      .pipe(
        tap((availability) => {
          this.timeSlotsByDate$ = new BehaviorSubject<Map<string, TimeSlot[]>>(
            availability.timeSlotsByDate,
          );
          this.selectedDate$ = new BehaviorSubject<Date>(
            availability.firstAvailableDate,
          );
        }),
      );
  }

  onServiceSelected(service: DocumentData) {
    this.MatStepper.selectedIndex = 1;
  }

  onDateSelected($event: Date | null) {
    if ($event) {
      this.selectedDate$.next($event);
      this.MatStepper.selectedIndex = 2;
    }
  }

  onTimeSlotSelected(timeSlot: TimeSlot) {
    return;
  }
}
