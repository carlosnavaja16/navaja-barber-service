import { getAvailability } from './src/functions/get-availability.function';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { CallableOptions, onCall } from 'firebase-functions/v2/https';
import { bookAppointment } from './src/functions/book-appointment.function';
import { AvailabilityRequest } from '../shared/types/availability';
import { calendar_v3 } from 'googleapis';
import { cancelAppointment } from './src/functions/cancel-apppintment.function';

export const getAvailabilityFn = onCall(
  {
    enforceAppCheck: false,
    region: 'us-east1'
  } as CallableOptions,
  async (request: CallableRequest<AvailabilityRequest>) => {
    return await getAvailability(request.data.eventDuration);
  }
);

export const bookAppointmentFn = onCall(
  {
    enforceAppCheck: false,
    region: 'us-east1'
  } as CallableOptions,
  async (request: CallableRequest<calendar_v3.Schema$Event>) => {
    return await bookAppointment(request.data);
  }
);

export const cancelAppointmentFn = onCall(
  {
    enforceAppCheck: false,
    region: 'us-east1'
  } as CallableOptions,
  async (request: CallableRequest<string>) => {
    return await cancelAppointment(request.data);
  }
);
