import { TimeSlot, TimeSlotResponse } from './time-slot';

export interface AvailabilityRequest {
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
