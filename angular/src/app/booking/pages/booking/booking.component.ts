import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewChild,
  signal
} from '@angular/core';
import { HeaderService } from '@app/common/services/header/header.service';
import { Observable, of, switchMap } from 'rxjs';
import { DateTimeSlots, TimeSlot } from '@shared/types/time-slot';
import { Availability } from '@shared/types/availability';
import { BookingService } from '@booking//booking.service';
import { MatStepper } from '@angular/material/stepper';
import { Service } from '@shared/types/service';
import { ChangeDetectorRef } from '@angular/core';
import { DateUtils } from '@booking/utilities/date.util';
import { toObservable } from '@angular/core/rxjs-interop';
import { Appointment } from '@shared/types/appointment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements AfterViewInit, OnDestroy {
  timeZone: string;
  services$: Observable<Service[]>;
  availability$: Observable<Availability | null>;
  selectedService = signal<Service | null>(null);
  selectedDateTimeSlots = signal<DateTimeSlots | null>(null);
  selectedTimeSlot = signal<TimeSlot | null>(null);
  appointmentResponse$: Observable<Appointment>;
  bookingSubmitted: boolean = false;
  @ViewChild('stepper') MatStepper: MatStepper;

  constructor(
    private readonly headerService: HeaderService,
    private readonly bookingService: BookingService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router
  ) {
    this.headerService.setHeader('Booking');
    this.timeZone = DateUtils.getTimeZoneAbbr();
    this.services$ = this.bookingService.getServices();
    this.availability$ = toObservable(this.selectedService).pipe(
      switchMap((service) => {
        return service
          ? this.bookingService.getAvailability(service)
          : of(null);
      })
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
      this.selectedService.set(service);
      this.selectedDateTimeSlots.set(null);
      this.selectedTimeSlot.set(null);
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
      this.selectedDateTimeSlots.set(dateTimeSlots);
      this.selectedTimeSlot.set(null);
      setTimeout(() => {
        this.MatStepper.next();
      }, 1);
    }
  }

  onTimeSlotSelected(timeSlot: TimeSlot | null) {
    if (timeSlot) {
      this.selectedTimeSlot.set(timeSlot);
      setTimeout(() => {
        this.MatStepper.next();
      }, 1);
    }
  }

  onBookingSubmitted() {
    const selectedService = this.selectedService();
    const selectedTimeSlot = this.selectedTimeSlot();
    if (selectedService && selectedTimeSlot) {
      this.bookingSubmitted = true;
      this.appointmentResponse$ = this.bookingService.bookAppointment(
        selectedService,
        selectedTimeSlot
      );
    }
  }

  onGoToAppointments() {
    this.router.navigate(['/appointments']);
  }
}
