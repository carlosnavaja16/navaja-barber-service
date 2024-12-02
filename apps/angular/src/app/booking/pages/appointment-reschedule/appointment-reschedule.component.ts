import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild
} from '@angular/core';
import { DateTimeSlots, TimeSlot } from '@navaja/shared';
import {
  catchError,
  firstValueFrom,
  map,
  merge,
  of,
  shareReplay,
  Subject,
  switchMap,
  withLatestFrom
} from 'rxjs';
import { BookingService } from '../../booking.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  bookingService = inject(BookingService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  headerService: HeaderService = inject(HeaderService);

  selectedDateTimeSlots$ = new Subject<DateTimeSlots | null>();
  selectedTimeSlot$ = new Subject<TimeSlot | null>();
  retry$ = new Subject<void>();
  timeZone = DateUtils.getTimeZoneAbbr();
  @ViewChild('stepper') MatStepper: MatStepper;

  id$ = this.route.paramMap.pipe(map((paramMap) => paramMap.get('id')));
  initialFetch$ = this.id$.pipe(
    switchMap((appointmentId) =>
      this.bookingService.getAppointment$(appointmentId!)
    )
  );
  reFetch$ = this.retry$.pipe(
    switchMap(() => this.id$),
    switchMap((id) => this.bookingService.getAppointment$(id!))
  );

  appointment$ = merge(this.initialFetch$, this.reFetch$).pipe(shareReplay(1));
  loading$ = this.appointment$.pipe(map((appointment) => appointment === null));
  error$ = this.appointment$.pipe(catchError(() => of(true)));

  availability$ = this.appointment$.pipe(
    switchMap((appointment) =>
      this.bookingService.getAvailability$(appointment.service)
    )
  );

  ngOnInit() {
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

  onRetry() {
    this.retry$.next();
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
    ).then(() => this.router.navigate(['/appointments']));
  }
}
