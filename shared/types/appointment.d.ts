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
}
