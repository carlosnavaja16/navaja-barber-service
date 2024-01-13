import { Service } from './service';

export interface Appointment {
  eventId: string;
  userId: string;
  service: Service;
  location: string;
  start: Date;
  end: Date;
}
