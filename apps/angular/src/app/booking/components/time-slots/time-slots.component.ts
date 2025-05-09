import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AFTERNOON,
  DateTimeSlots,
  EVENING,
  MORNING,
  TimeSlot
} from '@navaja/shared';
import { DateUtils } from '@booking/utilities/date.util';

@Component({
  selector: 'time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss']
})
export class TimeSlotsComponent {
  @Input() dateTimeSlots: DateTimeSlots | null;
  @Output() timeSlotSelected = new EventEmitter<TimeSlot>();

  onTimeSlotSelected(timeSlot: TimeSlot) {
    this.timeSlotSelected.emit(timeSlot);
  }

  get morningTimeSlots() {
    if (this.dateTimeSlots) {
      return this.dateTimeSlots.timeSlots.filter(
        (t) => DateUtils.whichPartOfDay(t) === MORNING
      );
    }
    return [];
  }

  get afternoonTimeSlots() {
    if (this.dateTimeSlots) {
      return this.dateTimeSlots.timeSlots.filter(
        (t) => DateUtils.whichPartOfDay(t) === AFTERNOON
      );
    }
    return [];
  }

  get eveningTimeSlots() {
    if (this.dateTimeSlots) {
      return this.dateTimeSlots.timeSlots.filter(
        (t) => DateUtils.whichPartOfDay(t) === EVENING
      );
    }
    return [];
  }
}
