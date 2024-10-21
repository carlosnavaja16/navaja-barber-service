import { TimeSlot } from './time-slot';

export interface AvailabilityRequest {
  eventDuration: number;
}

export interface AvailabilityResponse {
  firstAvailableDate: Date;
  openingHourUTC: number;
  closingHourUTC: number;
  minDate: Date;
  maxDate: Date;
  availableTimeSlots: TimeSlot[];
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
