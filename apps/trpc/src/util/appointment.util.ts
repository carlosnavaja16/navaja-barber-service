import {
  Appointment,
  AppointmentEvent,
  AppointmentRequest
} from '../../../../libs/shared/src/types/appointment';

export class AppointmentUtils {
  public static buildAppointmentEvent(
    appointmentRequest: AppointmentRequest
  ): AppointmentEvent {
    return {
      summary: `${appointmentRequest.userProfile.firstName} ${appointmentRequest.userProfile.lastName}`,
      description: `<b>Service:</b> ${appointmentRequest.service.name}\n<b>Duration:</b> ${appointmentRequest.service.duration} minutes\n<b>Price:</b> $${appointmentRequest.service.price}\n<b>Phone:</b> ${appointmentRequest.userProfile.phone}\n<b>Email:</b> ${appointmentRequest.userProfile.email}`,
      location: `${appointmentRequest.userProfile.streetAddr}, ${appointmentRequest.userProfile.city}, ${appointmentRequest.userProfile.state} ${appointmentRequest.userProfile.zipCode}`,
      start: {
        dateTime: appointmentRequest.timeSlot.start.toISOString()
      },
      end: {
        dateTime: appointmentRequest.timeSlot.end.toISOString()
      }
    };
  }

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
        zip: appointmentRequest.userProfile.zipCode
      },
      start: appointmentRequest.timeSlot.start,
      cancelled: null
    };
  }
}
