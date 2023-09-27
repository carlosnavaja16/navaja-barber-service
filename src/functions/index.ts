import { defineSecret } from 'firebase-functions/params';
import { getAvailability } from './functions/get-availability.function';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { CallableOptions, onCall } from 'firebase-functions/v2/https';
import { ServiceAccountCredentials } from './types/service-account-credentials';
import { bookAppointment } from './functions/book-appointment.functiont';

export const getAvailabilityFn = onCall(
  {
    enforceAppCheck: false,
    secrets: ['CALENDAR_API_KEY'],
    region: 'us-east1',
  } as CallableOptions,
  async (request: CallableRequest) => {
    const credentials: ServiceAccountCredentials = JSON.parse(
      defineSecret('CALENDAR_API_KEY').value(),
    );
    try {
      return await getAvailability(credentials, request.data.eventDuration);
    } catch (error) {
      console.error(
        `Failed to get availability for event duration: ${request.data.eventDuration} due to error: ${error}`,
      );
      throw new Error(
        `Failed to get availability for event duration: ${request.data.eventDuration} due to error: ${error}`,
      );
    }
  },
);

export const bookAppointmentFn = onCall(
  {
    enforceAppCheck: false,
    secrets: ['CALENDAR_API_KEY'],
    region: 'us-east1',
  } as CallableOptions,
  async (request: CallableRequest) => {
    const credentials: ServiceAccountCredentials = JSON.parse(
      defineSecret('CALENDAR_API_KEY').value(),
    );
    try {
      return await bookAppointment(credentials, request.data.event);
    } catch (error) {
      console.error(
        `Failed to inser event: ${request.data.event.summary} due to error: ${error}`,
      );
      throw new Error(
        `Failed to inser event: ${request.data.event.summary} due to error: ${error}`,
      );
    }
  },
);
