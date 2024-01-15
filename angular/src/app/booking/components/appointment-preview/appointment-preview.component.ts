import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Service } from '@type/service';
import { TimeSlot } from '@type/time-slot';

@Component({
  selector: 'appointment-preview',
  templateUrl: './appointment-preview.component.html',
  styleUrls: ['./appointment-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentPreviewComponent {
  @Input() service: Service;
  @Input() date: Date | undefined;
  @Input() timeSlot: TimeSlot | null;
  @Input() timeZone: string | undefined;
  @Output() bookingSubmitted: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  get bookDisabled(): boolean {
    return !this.service || !this.date || !this.timeSlot ? true : false;
  }

  onBookingSubmitted(): void {
    this.bookingSubmitted.emit();
  }
}
