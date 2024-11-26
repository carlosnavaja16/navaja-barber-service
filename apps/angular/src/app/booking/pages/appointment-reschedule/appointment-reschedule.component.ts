import {
  ChangeDetectionStrategy,
  Component,
  signal,
  ViewChild
} from '@angular/core';
import { DateTimeSlots, TimeSlot } from '@navaja/shared';
import {
  filter,
  firstValueFrom,
  map,
  Subject,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs';
import { BookingService } from '../../booking.service';
import { ActivatedRoute } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { HeaderService } from '@src/app/common/services/header/header.service';
import { DateUtils } from '../../utilities/date.util';

@Component({
  selector: 'appointment-reschedule',
  templateUrl: './appointment-reschedule.component.html',
  styleUrls: ['./appointment-reschedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentRescheduleComponent {
  pageLoading = signal(true);
  selectedDateTimeSlots$ = new Subject<DateTimeSlots | null>();
  selectedTimeSlot$ = new Subject<TimeSlot | null>();
  timeZone = DateUtils.getTimeZoneAbbr();
  @ViewChild('stepper') MatStepper: MatStepper;

  appointment$ = this.route.paramMap.pipe(
    map((paramMap) => paramMap.get('id')),
    filter((id) => id != null),
    switchMap((appointmentId) =>
      this.bookingService.getAppointment$(appointmentId)
    ),
    tap(() => this.pageLoading.set(false))
  );

  availability$ = this.appointment$.pipe(
    switchMap((appointment) => {
      return this.bookingService.getAvailability$(appointment.service);
    })
  );

  constructor(
    private readonly bookingService: BookingService,
    private readonly route: ActivatedRoute,
    private readonly headerService: HeaderService
  ) {
    this.headerService.setHeader('Appointment Reschedule');
  }

  onDateSelected(dateTimeSlots: DateTimeSlots) {
    this.selectedDateTimeSlots$.next(dateTimeSlots);
    this.selectedTimeSlot$.next(null);
    setTimeout(() => {
      this.MatStepper.next();
    }, 0);
  }

  onTimeSlotSelected(timeSlot: TimeSlot) {
    this.selectedTimeSlot$.next(timeSlot);
    setTimeout(() => {
      this.MatStepper.next();
    }, 1);
  }

  onReschedule() {
    firstValueFrom(
      this.appointment$.pipe(
        withLatestFrom(this.selectedTimeSlot$),
        switchMap(([appointment, timeSlot]) =>
          this.bookingService.rescheduleAppointment$({
            eventId: appointment.eventId,
            timeSlot: timeSlot!
          })
        )
      )
    ).then();
  }
}
