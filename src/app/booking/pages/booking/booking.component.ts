import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { HeaderService } from '../../../shared/services/header/header.service';
import { BehaviorSubject, Observable, Subject, switchMap } from 'rxjs';
import { Availability, DateTimeSlots, TimeSlot } from '../../types/time-slot';
import { BookingService } from '../../booking.service';
import { MatStepper } from '@angular/material/stepper';
import { Service } from '../../types/service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements AfterViewInit {
  eventDuration = 1000 * 60 * 60;
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
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.headerService.setHeader('Booking');
    this.services$ = this.bookingService.getServices();
    this.availability$ = this.selectedService$.pipe(
      switchMap((service) => {
        return this.bookingService.getAvailability(service);
      }),
    );
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['duration'] != null) {
        this.onServiceSelected({
          name: params['name'],
          duration: params['duration'],
          price: params['price'],
          desc: params['desc'],
        });
      }
    });
    this.cdr.detectChanges();
  }

  onServiceSelected(service: Service) {
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
    return timeSlot;
  }
}
