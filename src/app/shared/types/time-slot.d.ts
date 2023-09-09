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

export interface AvailabilityResponse {
  openingHourUTC: number;
  closingHourUTC: number;
  minDate: string;
  maxDate: string;
  availableTimeSlots: TimeSlotResponse[];
}

export interface Availability {
  openingHourUTC: number;
  closingHourUTC: number;
  minDate: Date;
  maxDate: Date;
  firstAvailableDate: Date;
  timeSlotsByDate: Map<string, TimeSlot[]>;
  dateFilter: (date: Date) => boolean;
}
