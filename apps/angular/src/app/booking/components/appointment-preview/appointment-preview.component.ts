import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Service } from '@navaja/shared';

@Component({
  selector: 'appointment-preview',
  templateUrl: './appointment-preview.component.html',
  styleUrl: './appointment-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentPreviewComponent {
  @Input() service: Service;
  @Input() date: Date | undefined;
  @Input() time: Date | undefined;
  @Input() timeZone: string | undefined;
  @Output() book: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  get bookDisabled(): boolean {
    return !this.service || !this.date || !this.time ? true : false;
  }

  onBook(): void {
    this.book.emit();
  }
}
