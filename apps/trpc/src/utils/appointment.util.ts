import {
  Appointment,
  AppointmentEvent,
  AppointmentFirestoreResponse,
  AppointmentRequest,
} from '@navaja/shared';

export class AppointmentUtils {
  /**
   * Builds an appointment event for a given appointment request.
   * @param appointmentRequest - The appointment request to build the event for.
   * @returns The appointment event.
   */
  public static buildAppointmentEvent(
    appointmentRequest: AppointmentRequest
  ): AppointmentEvent {
    return {
      summary: `${appointmentRequest.userProfile.firstName} ${appointmentRequest.userProfile.lastName}`,
      description: `<b>Service:</b> ${appointmentRequest.service.name}\n<b>Duration:</b> ${appointmentRequest.service.duration} minutes\n<b>Price:</b> $${appointmentRequest.service.price}\n<b>Phone:</b> ${appointmentRequest.userProfile.phone}\n<b>Email:</b> ${appointmentRequest.userProfile.email}`,
      location: `${appointmentRequest.userProfile.streetAddr}, ${appointmentRequest.userProfile.city}, ${appointmentRequest.userProfile.state} ${appointmentRequest.userProfile.zipCode}`,
      start: {
        dateTime: appointmentRequest.timeSlot.start.toISOString(),
      },
      end: {
        dateTime: appointmentRequest.timeSlot.end.toISOString(),
      },
    };
  }

  /**
   * Builds an appointment object for a given appointment request.
   * @param eventId - The ID of the event to build the appointment for.
   * @param appointmentRequest - The appointment request to build the appointment for.
   * @returns The appointment.
   */
  public static buildAppointment(
    eventId: string | null | undefined,
    appointmentRequest: AppointmentRequest
  ): Appointment {
    return {
      eventId: eventId || '',
      userId: appointmentRequest.userProfile.userId || '',
      service: appointmentRequest.service,
      address: {
        streetAddr: appointmentRequest.userProfile.streetAddr,
        city: appointmentRequest.userProfile.city,
        state: appointmentRequest.userProfile.state,
        zip: appointmentRequest.userProfile.zipCode,
      },
      start: appointmentRequest.timeSlot.start,
      cancelled: undefined,
    };
  }

  /**
   * Transforms the dates of an appointment from Firestore.
   * @param appointmentFirestoreResponse - The appointment firestore response to transform.
   * @returns The transformed appointment.
   */
  public static transformDates(
    appointmentFirestoreResponse: AppointmentFirestoreResponse
  ): Appointment {
    return {
      ...appointmentFirestoreResponse,
      start: appointmentFirestoreResponse.start.toDate(),
      cancelled: appointmentFirestoreResponse.cancelled
        ? appointmentFirestoreResponse.cancelled.toDate()
        : undefined,
    };
  }
}
