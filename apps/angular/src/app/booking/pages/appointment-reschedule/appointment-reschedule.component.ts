import {
  inject,
  ViewChild,
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DateTimeSlots, TimeSlot } from '@navaja/shared';
import { MatStepper } from '@angular/material/stepper';
import { ReschedulePageStore } from './appointment-reschedule.store';
import { HeaderService } from '@src/app/common/services/header/header.service';

@Component({
  selector: 'appointment-reschedule',
  templateUrl: './appointment-reschedule.component.html',
  styleUrls: ['./appointment-reschedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ReschedulePageStore],
})
export class AppointmentRescheduleComponent {
  @ViewChild('stepper') MatStepper: MatStepper;
  headerService = inject(HeaderService);
  store = inject(ReschedulePageStore);

  constructor() {
    this.headerService.setHeader('Reschedule Appointment');
    this.store.loadAppointment();
  }

  onDateSelected(dateTimeSlots: DateTimeSlots) {
    this.store.setDateTimeSlots(dateTimeSlots);
    setTimeout(() => {
      this.MatStepper.next();
    }, 0);
  }

  onTimeSlotSelected(timeSlot: TimeSlot) {
    this.store.setTimeSlot(timeSlot);
    setTimeout(() => {
      this.MatStepper.next();
    }, 0);
  }

  onRetry() {
    this.store.loadAppointment();
  }

  onReschedule() {
    this.store.rescheduleAppointment();
  }
}
