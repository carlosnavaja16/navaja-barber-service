import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateTimeSlots, TimeSlot } from '../../../shared/types/time-slot';
import { DateUtils } from '../../../shared/utilities/date.util';
import { Observable, Subject, map } from 'rxjs';

@Component({
  selector: 'time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss'],
})
export class TimeSlotsComponent {
  @Input() dateTimeSlots: DateTimeSlots | null;
  @Output() timeSlotSelected = new EventEmitter<TimeSlot>();

  constructor() {}

  onTimeSlotSelected(timeSlot: TimeSlot) {
    this.timeSlotSelected.emit(timeSlot);
  }

  get morningTimeSlots() {
    if (this.dateTimeSlots) {
      return this.dateTimeSlots.timeSlots.filter(
        (t) => DateUtils.whichPartOfDay(t) === 'morning',
      );
    }
    return [];
  }

  get afternoonTimeSlots() {
    if (this.dateTimeSlots) {
      return this.dateTimeSlots.timeSlots.filter(
        (t) => DateUtils.whichPartOfDay(t) === 'afternoon',
      );
    }
    return [];
  }

  get eveningTimeSlots() {
    if (this.dateTimeSlots) {
      return this.dateTimeSlots.timeSlots.filter(
        (t) => DateUtils.whichPartOfDay(t) === 'evening',
      );
    }
    return [];
  }
}
