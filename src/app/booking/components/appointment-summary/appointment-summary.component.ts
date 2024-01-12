import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Service } from '../../../../../types/service';
import { TimeSlot } from 'functions/types/time-slot';
@Component({
  selector: 'appointment-summary',
  templateUrl: './appointment-summary.component.html',
  styleUrls: ['./appointment-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentSummaryComponent {
  @Input() service: Service;
  @Input() date: Date | undefined;
  @Input() timeSlot: TimeSlot | null;
  @Input() timeZone: string | undefined;
  @Output() book: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  get bookDisabled(): boolean {
    return !this.service || !this.date || !this.timeSlot ? true : false;
  }

  onBook(): void {
    this.book.emit();
  }
}
