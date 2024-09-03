import { Component, Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HeaderService } from '@src/app/common/services/header/header.service';
import { BookingService } from '@booking/booking.service';
import { Appointment } from '@navaja/shared';
import { DateUtils } from '@booking/utilities/date.util';
import { Observable, Subject, merge, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent {
  timeZone: string;
  appointments$: Observable<Appointment[]>;
  appointments: Signal<Appointment[] | null>;
  noAppointments: Signal<boolean | null>;
  nextAppointment: Signal<Appointment | null>;
  pastAppointments: Signal<Appointment[] | null>;
  upcomingAppointments: Signal<Appointment[] | null>;
  cancelledAppointments$: Subject<Appointment>;
  refreshedAppointments$: Observable<Appointment[]>;

  constructor(
    private readonly bookingService: BookingService,
    private readonly headerService: HeaderService,
    private readonly router: Router
  ) {
    this.timeZone = DateUtils.getTimeZoneAbbr();
    this.headerService.setHeader('Appointments');
    this.appointments$ = this.bookingService.getAppointments();
    this.cancelledAppointments$ = new Subject();

    this.refreshedAppointments$ = this.cancelledAppointments$
      .asObservable()
      .pipe(
        switchMap((appointment) =>
          this.bookingService.cancelAppointment(appointment)
        ),
        switchMap(() => this.bookingService.getAppointments())
      );

    this.appointments = toSignal(
      merge(this.appointments$, this.refreshedAppointments$),
      { initialValue: null }
    );

    this.noAppointments = computed(() => {
      const appointments = this.appointments();
      if (appointments == null) {
        return null;
      } else {
        return appointments.length === 0;
      }
    });

    this.nextAppointment = computed(() => {
      const appointments = this.appointments();
      if (appointments == null) {
        return null;
      } else {
        return appointments.filter(
          (appointment) => appointment.start.getTime() > Date.now()
        )[0];
      }
    });

    this.pastAppointments = computed(() => {
      const appointments = this.appointments();
      if (appointments == null) {
        return null;
      } else {
        return appointments.filter(
          (appointment) => appointment.start.getTime() < Date.now()
        );
      }
    });

    this.upcomingAppointments = computed(() => {
      const appointments = this.appointments();
      if (appointments == null) {
        return null;
      } else {
        return appointments
          .filter((appointment) => appointment.start.getTime() > Date.now())
          .slice(1);
      }
    });
  }

  onCancel(appointment: Appointment): void {
    this.cancelledAppointments$.next(appointment);
  }

  onReschedule(appointment: Appointment) {
    this.router.navigate([`/reschedule/${appointment.eventId}`]);
  }
}
