import { createEvent } from '../utilities/google-calendar.util';
import { ServiceAccountCredentials } from '../types/service-account-credentials';
import { calendar_v3 } from 'googleapis';

export async function bookAppointment(
  credentials: ServiceAccountCredentials,
  event: calendar_v3.Schema$Event,
): Promise<void> {
  try {
    await createEvent(credentials, event);
  } catch (error) {
    console.error(
      `Failed to inser event: ${event.summary} due to error: ${error}`,
    );
    throw new Error(
      `Failed to inser event: ${event.summary} due to error: ${error}`,
    );
  }
}
