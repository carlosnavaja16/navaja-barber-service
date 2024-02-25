import { cancelEvent } from '../util/google-calendar.util';

export async function cancelAppointment(eventId: string) {
  return await cancelEvent(eventId);
}
