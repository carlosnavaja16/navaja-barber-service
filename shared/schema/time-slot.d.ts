export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface TimeSlotResponse {
  start: string;
  end: string;
}

export interface DateTimeSlots {
  date: Date;
  timeSlots: TimeSlot[];
}
