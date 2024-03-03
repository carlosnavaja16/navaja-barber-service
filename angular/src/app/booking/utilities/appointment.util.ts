import { calendar_v3 } from 'googleapis';
import { UserProfile } from '@schema/user-profile';
import { Service } from '@schema/service';
import { TimeSlot } from '@schema/time-slot';
import { Appointment, AppointmentEvent } from '@schema/appointment';

export class AppointmentUtils {
  public static getAppointmentEvent(
    userProfile: UserProfile,
    service: Service,
    timeSlot: TimeSlot
  ): AppointmentEvent {
    return {
      summary: `${userProfile.firstName} ${userProfile.lastName}`,
      description: `<b>Service:</b> ${service.name}\n<b>Duration:</b> ${service.duration} minutes\n<b>Price:</b> $${service.price}\n<b>Phone:</b> ${userProfile.phone}\n<b>Email:</b> ${userProfile.email}`,
      location: `${userProfile.streetAddr}, ${userProfile.city}, ${userProfile.state} ${userProfile.zipCode}`,
      start: {
        dateTime: timeSlot.start.toISOString()
      },
      end: {
        dateTime: timeSlot.end.toISOString()
      }
    };
  }

  public static getAppointmentFromEvent(
    userProfile: UserProfile,
    event: calendar_v3.Schema$Event,
    Service: Service
  ): Appointment {
    return {
      eventId: event.id || '',
      userId: userProfile.userId || '',
      service: Service,
      address: {
        streetAddr: userProfile.streetAddr,
        city: userProfile.city,
        state: userProfile.state,
        zip: userProfile.zipCode
      },
      start: new Date(event.start?.dateTime || ''),
      cancelled: null
    };
  }
}
