import { Component, ViewChild } from '@angular/core';
import { HeaderService } from '../../shared/services/header/header.service';
import { DocumentData } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject, switchMap, tap } from 'rxjs';
import {
  Availability,
  DateTimeSlots,
  TimeSlot,
} from '../../shared/types/time-slot';
import { CalendarService } from '../../shared/services/calendar/calendar.service';
import { ServiceService } from '../../shared/services/services/services.service';
import { MatStepper } from '@angular/material/stepper';
import { DateUtils } from '../../../app/shared/utilities/date.util';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent {
  eventDuration = 1000 * 60 * 60;
  services$: Observable<DocumentData[]>;
  availability$: Observable<Availability>;
  dateTimeSlots$ = new Subject<DateTimeSlots>();
  selectedService$ = new Subject<DocumentData>();
  selectedDateTimeSlots$ = new Subject<DateTimeSlots>();
  selectedTimeSlot$: BehaviorSubject<TimeSlot>;

  @ViewChild('stepper') MatStepper: MatStepper;

  constructor(
    private readonly headerService: HeaderService,
    private readonly serviceService: ServiceService,
    private readonly calendarService: CalendarService,
  ) {
    this.headerService.setHeader('Booking');
    this.services$ = this.serviceService.getServices();
    this.availability$ = this.selectedService$.pipe(
      switchMap((service) => {
        return this.calendarService.getAvailability(
          DateUtils.getMillisecondsFromMinutes(service['duration']),
        );
      }),
    );
  }

  onServiceSelected(service: DocumentData) {
    this.selectedService$.next(service);
    this.MatStepper.selectedIndex = 1;
  }

  onDateSelected($event: DateTimeSlots | null) {
    if ($event) {
      this.selectedDateTimeSlots$.next($event);
      this.MatStepper.selectedIndex = 2;
    }
  }

  onTimeSlotSelected(timeSlot: TimeSlot) {
    return;
  }
}
