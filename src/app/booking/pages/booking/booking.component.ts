import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { HeaderService } from '../../../shared/services/header/header.service';
import { BehaviorSubject, Observable, Subject, of, switchMap } from 'rxjs';
import { DateTimeSlots, TimeSlot } from '../../../../../types/time-slot';
import { Availability } from '../../../../../types/availability';
import { BookingService } from '../../booking.service';
import { MatStepper } from '@angular/material/stepper';
import { Service } from '../../../../../types/service';
import { ChangeDetectorRef } from '@angular/core';
import { DateUtils } from '../../utilities/date.util';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements AfterViewInit, OnDestroy {
  timeZone: string;
  services$: Observable<Service[]>;
  availability$: Observable<Availability | null>;
  dateTimeSlots$ = new Subject<DateTimeSlots>();
  selectedService$ = new BehaviorSubject<Service | null>(null);
  selectedDateTimeSlots$ = new BehaviorSubject<DateTimeSlots | null>(null);
  selectedTimeSlot$ = new BehaviorSubject<TimeSlot | null>(null);
  dateFilter$: Observable<(date: Date) => boolean>;
  @ViewChild('stepper') MatStepper: MatStepper;

  constructor(
    private readonly headerService: HeaderService,
    private readonly bookingService: BookingService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.headerService.setHeader('Booking');
    this.timeZone = DateUtils.getTimeZoneAbbr();
    this.services$ = this.bookingService.getServices();
    this.availability$ = this.selectedService$.pipe(
      switchMap((service) => {
        return service
          ? this.bookingService.getAvailability(service)
          : of(null);
      }),
    );
  }

  ngAfterViewInit(): void {
    if (this.bookingService.selectedService) {
      this.onServiceSelected(this.bookingService.selectedService);
    }

    /**
     * We need .detectChanges() here because we updating the
     * view after the view has rendered. onServiceSelected()
     * moves the stepper to the second step
     */
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.bookingService.selectedService = null;
  }

  onServiceSelected(service: Service | null) {
    if (service) {
      this.selectedService$.next(service);
      this.selectedDateTimeSlots$.next(null);
      this.selectedTimeSlot$.next(null);
      /**
       * We need setTimeout() here because in order to move the
       * stepper we need a value for selectedService$. We are pushing
       * a value in the lines above but the stepper doesn't recognize it
       * until the next change detection cycle. setTimeout() forces the
       * stepper to wait until the next change detection cycle.
       * Same is true for onDateSelected() and onTimeSlotSelected() below.
       */
      setTimeout(() => {
        this.MatStepper.next();
      }, 1);
    }
  }

  onDateSelected(dateTimeSlots: DateTimeSlots | null) {
    if (dateTimeSlots) {
      this.selectedDateTimeSlots$.next(dateTimeSlots);
      this.selectedTimeSlot$.next(null);
      setTimeout(() => {
        this.MatStepper.next();
      }, 1);
    }
  }

  onTimeSlotSelected(timeSlot: TimeSlot | null) {
    if (timeSlot) {
      this.selectedTimeSlot$.next(timeSlot);
      setTimeout(() => {
        this.MatStepper.next();
      }, 1);
    }
  }

  onBook() {
    console.log('onBook');
    if (this.selectedService$.value && this.selectedTimeSlot$.value) {
      this.bookingService.bookAppointment(
        this.selectedService$.value,
        this.selectedTimeSlot$.value,
      );
    }
  }
}
