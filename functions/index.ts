import { getAvailability } from './functions/get-availability.function';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { CallableOptions, onCall } from 'firebase-functions/v2/https';
import { ServiceAccountCredentials } from '../types/service-account-credentials';
import { bookAppointment } from './functions/book-appointment.function';
import { CREDENTIALS } from './credentials';
import { AvailableTimeSlotsRequest } from '../types/time-slot';
import { calendar_v3 } from 'googleapis';

const CALENDAR_SERVICE_ACC_CREDENTIALS: ServiceAccountCredentials = CREDENTIALS;

export const getAvailabilityFn = onCall(
  {
    enforceAppCheck: false,
    region: 'us-east1',
  } as CallableOptions,
  async (request: CallableRequest<AvailableTimeSlotsRequest>) => {
    try {
      return await getAvailability(
        CALENDAR_SERVICE_ACC_CREDENTIALS,
        request.data.eventDuration,
      );
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
    region: 'us-east1',
  } as CallableOptions,
  async (request: CallableRequest<calendar_v3.Schema$Event>) => {
    try {
      return await bookAppointment(
        CALENDAR_SERVICE_ACC_CREDENTIALS,
        request.data,
      );
    } catch (error) {
      console.error(
        `Failed to insert event: ${request.data.summary} due to error: ${error}`,
      );
      throw new Error(
        `Failed to insert event: ${request.data.summary} due to error: ${error}`,
      );
    }
  },
);
