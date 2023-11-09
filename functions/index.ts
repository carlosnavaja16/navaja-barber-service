import { getAvailability } from './functions/get-availability.function';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { CallableOptions, onCall } from 'firebase-functions/v2/https';
import { ServiceAccountCredentials } from './types/service-account-credentials';
import { bookAppointment } from './functions/book-appointment.function';
import * as dotenv from 'dotenv';
dotenv.config();

const CALENDAR_SERVICE_ACC_CREDENTIALS: ServiceAccountCredentials = {
  type: process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_TYPE,
  project_id: process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_PROJECT_ID,
  private_key_id: process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_PRIVATE_KEY_ID,
  private_key: process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_PRIVATE_KEY,
  client_email: process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_CLIENT_EMAIL,
  client_id: process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_CLIENT_ID,
  auth_uri: process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_AUTH_URI,
  token_uri: process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url:
    process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_CLIENT_X509_CERT_URL,
  universe_domain: process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_UNIVERSE_DOMAIN,
};

export const getAvailabilityFn = onCall(
  {
    enforceAppCheck: false,
    region: 'us-east1',
  } as CallableOptions,
  async (request: CallableRequest) => {
    try {
      console.error(
        `CREDENTIALS: ${JSON.stringify(
          CALENDAR_SERVICE_ACC_CREDENTIALS,
          null,
          2,
        )}`,
      );
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
  async (request: CallableRequest) => {
    try {
      return await bookAppointment(
        CALENDAR_SERVICE_ACC_CREDENTIALS,
        request.data.event,
      );
    } catch (error) {
      console.error(
        `Failed to insert event: ${request.data.event.summary} due to error: ${error}`,
      );
      throw new Error(
        `Failed to insert event: ${request.data.event.summary} due to error: ${error}`,
      );
    }
  },
);
