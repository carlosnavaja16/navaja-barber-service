import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TimeSlot } from "../../../app/shared/types/time-slot";

@Component({
  selector: "time-slots",
  templateUrl: "./time-slots.component.html",
  styleUrls: ["./time-slots.component.scss"],
})
export class TimeSlotsComponent {
  @Input() timeSlotsByDate: Map<string, TimeSlot[]>;
  @Input() selectedDateHash: string | null;
  @Output() timeSlotSelected = new EventEmitter<TimeSlot>();

  constructor() {}

  onTimeSlotSelected(timeSlot: TimeSlot) {
    this.timeSlotSelected.emit(timeSlot);
  }
}
