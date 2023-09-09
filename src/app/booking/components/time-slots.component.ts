import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TimeSlot } from '../../../app/shared/types/time-slot';
import { DateUtils } from '../../../app/shared/utilities/date.util';

@Component({
  selector: 'time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss'],
})
export class TimeSlotsComponent {
  @Input() timeSlotsByDate: Map<string, TimeSlot[]>;
  @Input() selectedDate: Date;
  @Input() selectedDateHash: string;
  @Output() timeSlotSelected = new EventEmitter<TimeSlot>();

  constructor() {}

  onTimeSlotSelected(timeSlot: TimeSlot) {
    this.timeSlotSelected.emit(timeSlot);
  }

  getMorningTimeSlots(timeSlots: TimeSlot[]): TimeSlot[] {
    return timeSlots.filter((timeSlot) => {
      return DateUtils.whichPartOfDay(timeSlot) === 'morning';
    });
  }

  getAfternoonTimeSlots(timeSlots: TimeSlot[]): TimeSlot[] {
    return timeSlots.filter((timeSlot) => {
      return DateUtils.whichPartOfDay(timeSlot) === 'afternoon';
    });
  }

  getEveningTimeSlots(timeSlots: TimeSlot[]): TimeSlot[] {
    return timeSlots.filter((timeSlot) => {
      return DateUtils.whichPartOfDay(timeSlot) === 'evening';
    });
  }
}
