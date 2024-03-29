import { Component, Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HeaderService } from '@app/common/services/header/header.service';
import { BookingService } from '@booking/booking.service';
import { Appointment } from '@schema/appointment';
import { DateUtils } from '@booking/utilities/date.util';
import { Observable, Subject, merge, of, switchMap } from 'rxjs';

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
  setLoadingStatus$: Subject<void>;
  appointmentsLoading$: Observable<null>;
  constructor(
    private readonly bookingService: BookingService,
    private readonly headerService: HeaderService
  ) {
    this.timeZone = DateUtils.getTimeZoneAbbr();
    this.headerService.setHeader('Appointments');
    this.appointments$ = this.bookingService.getAppointments();
    this.cancelledAppointments$ = new Subject();
    this.setLoadingStatus$ = new Subject();

    this.appointmentsLoading$ = this.setLoadingStatus$
      .asObservable()
      .pipe(switchMap(() => of(null)));

    this.refreshedAppointments$ = this.cancelledAppointments$
      .asObservable()
      .pipe(
        switchMap((appointment) =>
          this.bookingService.cancelAppointment(appointment)
        ),
        switchMap(() => this.bookingService.getAppointments())
      );

    this.appointments = toSignal(
      merge(
        this.appointments$,
        this.refreshedAppointments$,
        this.appointmentsLoading$
      ),
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
    this.setLoadingStatus$.next();
    this.cancelledAppointments$.next(appointment);
  }
}
