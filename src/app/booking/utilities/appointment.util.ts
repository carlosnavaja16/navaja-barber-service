import { calendar_v3 } from 'googleapis';
import { UserProfile } from '../../../../types/user-profile';
import { Service } from '../../../../types/service';
import { TimeSlot } from '../../../../types/time-slot';

export class AppointmentUtils {
  public static getAppointmentEvent(
    userProfile: UserProfile,
    service: Service,
    timeSlot: TimeSlot,
  ): calendar_v3.Schema$Event {
    return {
      summary: `${userProfile.firstName} ${userProfile.lastName}`,
      description: `<b>Service:</b> ${service.name}\n<b>Duration:</b> ${service.duration} minutes\n<b>Price:</b> $${service.price}\n<b>Phone:</b> ${userProfile.phone}\n<b>Email:</b> ${userProfile.email}`,
      location: `${userProfile.streetAddr}, ${userProfile.city}, ${userProfile.state} ${userProfile.zipCode}`,
      start: {
        dateTime: timeSlot.start.toISOString(),
      },
      end: {
        dateTime: timeSlot.end.toISOString(),
      },
    };
  }
}
