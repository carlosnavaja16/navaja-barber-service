import { cancelEvent } from '../utilities/google-calendar.util';

export async function cancelAppointment(eventId: string): Promise<void> {
  return await cancelEvent(eventId);
}
