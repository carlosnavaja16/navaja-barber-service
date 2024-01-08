import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateTimeSlots, TimeSlot } from '../../types/time-slot';
import { DateUtils } from '../../utilities/date.util';

@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent {
  @Input() minDate: Date | null;
  @Input() maxDate: Date | null;
  @Input() timeSlotsByDate: Map<string, TimeSlot[]> | null;
  @Input() dateFilter: (date: Date) => boolean = () => true;
  @Output() dateSelected = new EventEmitter<DateTimeSlots>();

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
