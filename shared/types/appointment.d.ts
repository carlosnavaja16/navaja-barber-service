import { Service } from './service';

export interface AppointmentAddress {
  streetAddr: string;
  city: string;
  state: string;
  zip: string;
}

export interface Appointment {
  eventId: string;
  userId: string;
  service: Service;
  address: AppointmentAddress;
  start: Date;
  cancelled: Date | null;
}

export interface AppointmentEvent {
  summary: string;
  description: string;
  location: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
}
