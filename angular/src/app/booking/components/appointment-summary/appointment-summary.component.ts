import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Appointment } from '@shared/types/appointment';

@Component({
  selector: 'appointment-summary',
  templateUrl: './appointment-summary.component.html',
  styleUrls: ['./appointment-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentSummaryComponent {
  @Input() appointment: Appointment;
  @Input() timeZone: string | undefined;
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() reschedule: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  onCancel(): void {
    this.cancel.emit();
  }

  onReschedule(): void {
    this.reschedule.emit();
  }
}
