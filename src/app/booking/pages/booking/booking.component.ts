import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { HeaderService } from '../../../shared/services/header/header.service';
import { BehaviorSubject, Observable, Subject, switchMap } from 'rxjs';
import { Availability, DateTimeSlots, TimeSlot } from '../../types/time-slot';
import { BookingService } from '../../booking.service';
import { MatStepper } from '@angular/material/stepper';
import { Service } from '../../types/service';
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
  availability$: Observable<Availability>;
  dateTimeSlots$ = new Subject<DateTimeSlots>();
  selectedService$ = new Subject<Service>();
  selectedDateTimeSlots$ = new Subject<DateTimeSlots>();
  selectedTimeSlot$: BehaviorSubject<TimeSlot>;

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
        return this.bookingService.getAvailability(service);
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
      console.log(`selected service: ${service.name}`);
      this.selectedService$.next(service);
      this.MatStepper.selectedIndex = 1;
    }
  }

  onDateSelected(dateTimeSlots: DateTimeSlots | null) {
    if (dateTimeSlots) {
      this.selectedDateTimeSlots$.next(dateTimeSlots);
      this.MatStepper.selectedIndex = 2;
    }
  }

  onTimeSlotSelected(timeSlot: TimeSlot | null) {
    if (timeSlot) {
      this.selectedTimeSlot$ = new BehaviorSubject<TimeSlot>(timeSlot);
      this.MatStepper.selectedIndex = 3;
    }
  }
}
