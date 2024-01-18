import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HeaderService } from '@app/common/services/header/header.service';
import { BookingService } from '@booking/booking.service';
import { Appointment } from '@shared/types/appointment';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent {
  appointments: Signal<Appointment[]>;

  constructor(
    private readonly bookingService: BookingService,
    private readonly headerService: HeaderService
  ) {
    this.headerService.setHeader('Appointments');
    this.appointments = toSignal(this.bookingService.getAppointments(), {
      initialValue: []
    });
    this.bookingService.selectedService = null;
  }

  get noAppointments(): boolean {
    return this.appointments().length === 0;
  }

  get pastAppointments(): Appointment[] {
    return this.appointments().filter(
      (appointment) => appointment.start.getTime() < Date.now()
    );
  }

  cancelAppointment(appointment: Appointment): Appointment {
    return appointment;
  }
}
