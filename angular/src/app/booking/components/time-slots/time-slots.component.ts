import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateTimeSlots, TimeSlot } from '@schema/time-slot';
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
        (t) => DateUtils.whichPartOfDay(t) === 'morning'
      );
    }
    return [];
  }

  get afternoonTimeSlots() {
    if (this.dateTimeSlots) {
      return this.dateTimeSlots.timeSlots.filter(
        (t) => DateUtils.whichPartOfDay(t) === 'afternoon'
      );
    }
    return [];
  }

  get eveningTimeSlots() {
    if (this.dateTimeSlots) {
      return this.dateTimeSlots.timeSlots.filter(
        (t) => DateUtils.whichPartOfDay(t) === 'evening'
      );
    }
    return [];
  }
}
