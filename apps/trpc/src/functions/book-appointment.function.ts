import { createEvent } from '../util/google-calendar.util.js';
import { AppointmentRequest } from '@navaja/shared';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseApp } from '../index.js';
import { AppointmentUtils } from '../util/appointment.util.js';

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
  await getFirestore(firebaseApp)
    .doc(`Appointments/${savedAppointmentEvent.id}`)
    .set(appointment);

  return appointment;
}

/*
export async function rescheduleAppointment(
  appointment: Appointment,
  timeSlot: TimeSlot
) {}
*/
