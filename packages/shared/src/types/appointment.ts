import { Service } from './service';
import { UserProfile } from './user-profile';
import { TimeSlot } from './time-slot';
import { z } from 'zod';
import { Timestamp } from 'firebase-admin/firestore';

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
  cancelled: Date | undefined;
}

export interface AppointmentFirestoreResponse {
  eventId: string;
  userId: string;
  service: Service;
  address: AppointmentAddress;
  start: Timestamp;
  cancelled: Timestamp | undefined;
}

export const AppointmentZod = z.object({
  eventId: z.string(),
  userId: z.string(),
  service: z.object({
    name: z.string(),
    desc: z.string(),
    duration: z.number(),
    price: z.number()
  }),
  address: z.object({
    streetAddr: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string()
  }),
  start: z.date(),
  cancelled: z.date().nullable()
});

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

export interface AppointmentRequest {
  userProfile: UserProfile;
  service: Service;
  timeSlot: TimeSlot;
}

export const AppointmentRequestZod = z.object({
  userProfile: z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    streetAddr: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    isAdmin: z.boolean(),
    userId: z.string(),
    email: z.string()
  }),
  service: z.object({
    name: z.string(),
    desc: z.string(),
    duration: z.number(),
    price: z.number()
  }),
  timeSlot: z.object({
    start: z.date(),
    end: z.date()
  })
});

export interface RescheduleRequest {
  eventId: string;
  startTime: Date;
}
