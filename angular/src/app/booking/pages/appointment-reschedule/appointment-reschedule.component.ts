import {
  ChangeDetectionStrategy,
  Component,
  signal,
  ViewChild
} from '@angular/core';
import { Appointment } from '@schema/appointment';
import { Availability } from '@shared/schema/availability';
import { map, Observable, switchMap } from 'rxjs';
import { BookingService } from '../../booking.service';
import { ActivatedRoute } from '@angular/router';
import { DateTimeSlots, TimeSlot } from '@shared/schema/time-slot';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'appointment-reschedule',
  templateUrl: './appointment-reschedule.component.html',
  styleUrls: ['./appointment-reschedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentRescheduleComponent {
  appointment$: Observable<Appointment>;
  availability$: Observable<Availability>;
  selectedDateTimeSlots = signal<DateTimeSlots | null>(null);
  selectedTimeSlot = signal<TimeSlot | null>(null);
  rescheduleResponse$ = Observable<Appointment>;
  @ViewChild('stepper') MatStepper: MatStepper;

  constructor(
    private readonly bookingService: BookingService,
    private readonly route: ActivatedRoute
  ) {
    this.appointment$ = this.route.paramMap.pipe(
      map((paramMap) => paramMap.get('id')),
      switchMap((appointmentId) =>
        this.bookingService.getAppointment(appointmentId!)
      )
    );
    this.availability$ = this.appointment$.pipe(
      switchMap((appointment) => {
        return this.bookingService.getAvailability(appointment.service);
      })
    );
  }

  onDateSelected(dateTimeSlots: DateTimeSlots) {
    this.selectedDateTimeSlots.set(dateTimeSlots);
    this.selectedTimeSlot.set(null);
    setTimeout(() => {
      this.MatStepper.next();
    }, 0);
  }

  onTimeSlotSelected(timeSlot: TimeSlot) {
    this.selectedTimeSlot.set(timeSlot);
    setTimeout(() => {
      this.MatStepper.next();
    }, 1);
  }

  onReschedule() {
    this.rescheduleResponse$ = this.appointment$.pipe(
      switchMap((appointment) => {
        return this.bookingService.rescheduleAppointment(
          appointment,
          this.selectedTimeSlot
        );
      })
    );
  }
}
