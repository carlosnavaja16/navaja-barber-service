import { Component, Input } from '@angular/core';
import { Service } from '../../types/service';
import { TimeSlot } from 'functions/types/time-slot';
@Component({
  selector: 'appointment-summary',
  templateUrl: './appointment-summary.component.html',
  styleUrls: ['./appointment-summary.component.scss'],
})
export class TimeSlotsComponent {
  @Input() service: Service | null;
  @Input() date: Date | null;
  @Input() timeSlot: TimeSlot | null;

  constructor() {}
}
