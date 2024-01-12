export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface TimeSlotResponse {
  start: string;
  end: string;
}

export interface AvailableTimeSlotsRequest {
  eventDuration: number;
}

export interface DateTimeSlots {
  date: Date;
  timeSlots: TimeSlot[];
}
