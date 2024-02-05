import { Component, Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HeaderService } from '@app/common/services/header/header.service';
import { BookingService } from '@booking/booking.service';
import { Appointment } from '@shared/types/appointment';
import { DateUtils } from '@booking/utilities/date.util';
import { Observable, Subject, merge, switchMap } from 'rxjs';

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
  cancelledAppointment = new Subject<Appointment>();
  refreshedAppointments$: Observable<Appointment[]>;

  constructor(
    private readonly bookingService: BookingService,
    private readonly headerService: HeaderService
  ) {
    this.timeZone = DateUtils.getTimeZoneAbbr();
    this.headerService.setHeader('Appointments');
    this.appointments$ = this.bookingService.getAppointments();
    this.refreshedAppointments$ = this.cancelledAppointment.asObservable().pipe(
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
    this.bookingService.selectedService = null;
  }

  onCancel(appointment: Appointment): void {
    this.bookingService.cancelAppointment(appointment).subscribe({
      next: () => this.refetchAppointments.next()
    });
  }
}
