import { createEvent } from '../util/google-calendar.util';
import {
  Appointment,
  AppointmentRequest
} from '../../../shared/schema/appointment';
import { firestore } from 'firebase-admin';
import { firebaseApp } from '..';
import { AppointmentUtils } from '../util/appointment.util';
import { TimeSlot } from '../../../shared/schema/time-slot';

/**
 * Books an appointment by creating an event in the calendar and inserting the appointment into Firestore.
 * @param appointmentRequest - The appointment request object containing the details of the appointment.
 * @returns The created appointment object.
 */
export async function bookAppointment(appointmentRequest: AppointmentRequest) {
  const appointmentEvent =
    AppointmentUtils.buildAppointmentEvent(appointmentRequest);
  const savedAppointmentEvent = await createEvent(appointmentEvent);

  const appointment = AppointmentUtils.buildAppointment(
    savedAppointmentEvent.id,
    appointmentRequest
  );
  await firestore(firebaseApp)
    .doc(`Appointments/${savedAppointmentEvent.id}`)
    .set(appointment);

  return appointment;
}

export async function rescheduleAppointment(
  appointment: Appointment,
  timeSlot: TimeSlot
) {}
