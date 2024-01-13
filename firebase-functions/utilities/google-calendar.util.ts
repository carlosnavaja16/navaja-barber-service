import { google, calendar_v3 } from 'googleapis';
import { GaxiosResponse } from 'gaxios';
import { JWT } from 'google-auth-library';
import { ServiceAccountCredentials } from '../../types/service-account-credentials';
import {
  SCOPE,
  BARBER_SERVICE_CALENDAR_ID,
} from '../constants/barber-service.constants';

/**
 * Retrieves busy time slots from a Google Calendar for a specific date range.
 * @param credentials - The service account credentials used to authenticate with the Google Calendar API.
 * @param minDate - The minimum date of the range to retrieve busy time slots for.
 * @param maxDate - The maximum date of the range to retrieve busy time slots for.
 * @returns An array of busy time slots for the specified date range.
 * @throws An error if the freebusy query fails or if no calendar is found for the specified calendar ID.
 */
export async function getCalendarBusy(
  credentials: ServiceAccountCredentials,
  minDate: Date,
  maxDate: Date,
) {
  const calendar = google.calendar({
    version: 'v3',
    auth: new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: [SCOPE],
    }),
  });

  let freebusyResponse: GaxiosResponse<calendar_v3.Schema$FreeBusyResponse>;

  try {
    freebusyResponse = await calendar.freebusy.query({
      requestBody: {
        items: [{ id: BARBER_SERVICE_CALENDAR_ID }],
        timeMin: minDate.toISOString(),
        timeMax: maxDate.toISOString(),
      },
    });
  } catch (error) {
    console.error(
      `Failed to get freebusy response for calendarId: ${BARBER_SERVICE_CALENDAR_ID} due to error: ${error}`,
    );
    throw new Error(
      `Failed to get freebusy response for calendarId: ${BARBER_SERVICE_CALENDAR_ID} due to error: ${error}`,
    );
  }

  if (
    !freebusyResponse.data.calendars ||
    !freebusyResponse.data.calendars[BARBER_SERVICE_CALENDAR_ID]
  ) {
    console.error(
      `No calendar found for calendarId: ${BARBER_SERVICE_CALENDAR_ID}`,
    );
    throw new Error(
      `No calendar found for calendarId: ${BARBER_SERVICE_CALENDAR_ID}`,
    );
  }

  return freebusyResponse.data.calendars[BARBER_SERVICE_CALENDAR_ID].busy!;
}

/**
 * Books an appointment on the Barber Service calendar using the provided credentials and event details.
 * @param credentials The service account credentials used to authenticate with the Google Calendar API.
 * @param event The event details to be added to the calendar.
 * @returns The created event data.
 * @throws An error if the event could not be created.
 */
export async function createEvent(
  credentials: ServiceAccountCredentials,
  event: calendar_v3.Schema$Event,
) {
  const calendar = google.calendar({
    version: 'v3',
    auth: new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: [SCOPE],
    }),
  });

  let createEventResponse: GaxiosResponse<calendar_v3.Schema$Event>;

  try {
    createEventResponse = await calendar.events.insert({
      calendarId: BARBER_SERVICE_CALENDAR_ID,
      requestBody: event,
    });
  } catch (error) {
    console.error(
      `Failed to inser event: ${event.summary} due to error: ${error}`,
    );
    throw new Error(
      `Failed to inser event: ${event.summary} due to error: ${error}`,
    );
  }

  return createEventResponse.data;
}
