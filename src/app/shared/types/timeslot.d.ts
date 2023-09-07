export interface Timeslot {
  start: Date;
  end: Date;
}

export interface TimeslotResponse {
  start: string;
  end: string;
}

export interface AvailableSlotsRequest {
  eventDurationMilliseconds: number;
}
