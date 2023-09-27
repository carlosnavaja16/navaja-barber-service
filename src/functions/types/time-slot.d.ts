export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface TimeSlotResponse {
  start: string;
  end: string;
}

export interface AvailabilityResponse {
  openingHourUTC: number;
  closingHourUTC: number;
  minDate: string;
  maxDate: string;
  availableTimeSlots: TimeSlotResponse[];
}
