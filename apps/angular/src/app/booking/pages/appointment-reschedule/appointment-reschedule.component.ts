import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  signal,
} from '@angular/core';
import {
  Appointment,
  Availability,
  DateTimeSlots,
  TimeSlot,
} from '@navaja/shared';
import { Observable, firstValueFrom, map, switchMap } from 'rxjs';
import { BookingService } from '../../booking.service';
import { ActivatedRoute } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'appointment-reschedule',
  templateUrl: './appointment-reschedule.component.html',
  styleUrls: ['./appointment-reschedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentRescheduleComponent {
  appointment$: Observable<Appointment>;
  availability$: Observable<Availability>;
  selectedDateTimeSlots = signal<DateTimeSlots | null>(null);
  selectedTimeSlot = signal<TimeSlot | null>(null);
  rescheduleResponse$: Observable<string>;
  @ViewChild('stepper') MatStepper: MatStepper;

  constructor(
    private readonly bookingService: BookingService,
    private readonly route: ActivatedRoute
  ) {
    this.appointment$ = this.route.paramMap.pipe(
      map((paramMap) => paramMap.get('id')),
      switchMap((appointmentId) =>
        this.bookingService.getAppointment$(appointmentId!)
      )
    );
    this.availability$ = this.appointment$.pipe(
      switchMap((appointment) => {
        return this.bookingService.getAvailability$(appointment.service);
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
    firstValueFrom(
      this.appointment$.pipe(
        switchMap((appointment) => {
          return this.bookingService.rescheduleAppointment$({
            eventId: appointment.eventId,
            startTime: new Date(),
          });
        })
      )
    ).then(
      
    );
  }
}
