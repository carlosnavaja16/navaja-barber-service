import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import {
  DateTimeSlots,
  TimeSlot,
} from '../../../../app/shared/types/time-slot';
import { DateUtils } from '../../../../app/shared/utilities/date.util';

@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent {
  @Input() dateFilter: (date: Date) => boolean;
  @Input() minDate: Date | null;
  @Input() maxDate: Date | null;
  @Input() timeSlotsByDate: Map<string, TimeSlot[]> | null;
  @Output() dateSelected = new EventEmitter<DateTimeSlots>();
  unfiltered = (date: Date) => true;

  constructor() {}

  onDateSelected($event: Date | null) {
    if ($event && this.timeSlotsByDate) {
      const dateTimeSlots = {
        date: $event,
        timeSlots:
          this.timeSlotsByDate.get(DateUtils.getDateHash($event)) || [],
      };
      this.dateSelected.emit(dateTimeSlots);
    }
    return null;
  }
}
