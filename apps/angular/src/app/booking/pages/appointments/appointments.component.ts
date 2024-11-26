import { Component } from '@angular/core';
import { HeaderService } from '@src/app/common/services/header/header.service';
import { BookingService } from '@booking/booking.service';
import { Appointment } from '@navaja/shared';
import { Subject, map, merge, shareReplay, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent {
  appointmentToCancel$ = new Subject<Appointment>();

  appointments$ = merge(
    this.bookingService.getAppointments$(),
    this.appointmentToCancel$.asObservable().pipe(
      switchMap((appointment) =>
        this.bookingService.cancelAppointment$(appointment)
      ),
      switchMap(() => this.bookingService.getAppointments$())
    )
  ).pipe(shareReplay());

  noAppointments$ = this.appointments$.pipe(
    map((appointments) => appointments.length === 0)
  );

  nextAppointment$ = this.appointments$.pipe(
    map((appointments) =>
      appointments.filter(
        (appointment) => appointment.start.getTime() > Date.now()
      )
    ),
    map((appointments) => (appointments.length ? appointments[0] : null))
  );

  upcomingAppointments$ = this.appointments$.pipe(
    map((appointments) =>
      appointments.filter(
        (appointment) => appointment.start.getTime() > Date.now()
      )
    ),
    map((appointments) => appointments.slice(1))
  );

  pastAppointments$ = this.appointments$.pipe(
    map((appointments) =>
      appointments.filter(
        (appointment) => appointment.start.getTime() < Date.now()
      )
    )
  );

  constructor(
    private readonly bookingService: BookingService,
    private readonly headerService: HeaderService,
    private readonly router: Router
  ) {
    this.headerService.setHeader('Appointments');
  }

  onCancel(appointment: Appointment): void {
    this.appointmentToCancel$.next(appointment);
  }

  onReschedule(appointment: Appointment) {
    this.router.navigate([`/reschedule/${appointment.eventId}`]);
  }
}
