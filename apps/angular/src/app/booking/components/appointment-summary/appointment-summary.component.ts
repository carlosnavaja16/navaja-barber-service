import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute
} from '@angular/core';
import { Appointment } from '@navaja/shared';

@Component({
  selector: 'appointment-summary',
  templateUrl: './appointment-summary.component.html',
  styleUrls: ['./appointment-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentSummaryComponent {
  @Input() appointment: Appointment;
  @Input() timeZone: string | undefined;
  @Input({ transform: booleanAttribute }) editable: boolean;
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() reschedule: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  onCancel(): void {
    this.cancel.emit();
  }

  onReschedule(): void {
    this.reschedule.emit();
  }

  get upcoming() {
    return this.appointment.start.getTime() > Date.now();
  }
}
