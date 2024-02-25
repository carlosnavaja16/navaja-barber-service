import { createEvent } from '../util/google-calendar.util';
import { calendar_v3 } from 'googleapis';

export async function bookAppointment(event: calendar_v3.Schema$Event) {
  return await createEvent(event);
}
