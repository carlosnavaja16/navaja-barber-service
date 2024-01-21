import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HeaderService } from '@app/common/services/header/header.service';
import { BookingService } from '@booking/booking.service';
import { Appointment } from '@shared/types/appointment';
import { DateUtils } from '@booking/utilities/date.util';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent {
  timeZone: string;
  appointments: Signal<Appointment[]>;

  constructor(
    private readonly bookingService: BookingService,
    private readonly headerService: HeaderService
  ) {
    this.timeZone = DateUtils.getTimeZoneAbbr();
    this.headerService.setHeader('Appointments');
    //TURN THIS BACK INTO AN OBSERVABLE SO YOU CAN SHOW LOADING SPINNER
    this.appointments = toSignal(this.bookingService.getAppointments(), {
      initialValue: []
    });
    this.bookingService.selectedService = null;
  }

  get noAppointments(): boolean {
    return this.appointments().length === 0;
  }

  get nextAppointment(): Appointment | null {
    return this.appointments()
      .filter((appointment) => appointment.start.getTime() > Date.now())
      .sort((a, b) => {
        return a.start.getTime() - b.start.getTime();
      })[0];
  }

  get pastAppointments(): Appointment[] {
    return this.appointments().filter(
      (appointment) => appointment.start.getTime() < Date.now()
    );
  }

  get upcomingAppointments(): Appointment[] {
    return this.appointments()
      .filter((appointment) => appointment.start.getTime() > Date.now())
      .sort((a, b) => {
        return a.start.getTime() - b.start.getTime();
      })
      .slice(1);
  }

  onCancel(eventId: string): string {
    return eventId;
  }
}
