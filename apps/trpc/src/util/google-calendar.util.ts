import { google, calendar_v3 } from 'googleapis';
import { SCOPE, BARBER_SERVICE_CALENDAR_ID } from '../constants';
import { googleCalendarSvcAccCreds } from '../credentials';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

/**
 * Retrieves busy time slots from a Google Calendar for a specific date range.
 * @param credentials - The service account credentials used to authenticate with the Google Calendar API.
 * @param minDate - The minimum date of the range to retrieve busy time slots for.
 * @param maxDate - The maximum date of the range to retrieve busy time slots for.
 * @returns An array of busy time slots for the specified date range.
 * @throws An error if the freebusy query fails or if no calendar is found for the specified calendar ID.
 */
export default async function getCalendarBusy(
  minDate: Date,
  maxDate: Date
): Promise<calendar_v3.Schema$TimePeriod[]> {
  const calendar = getCalendar();
  const response = await calendar.freebusy.query({
    requestBody: {
      items: [{ id: BARBER_SERVICE_CALENDAR_ID }],
      timeMin: minDate.toISOString(),
      timeMax: maxDate.toISOString()
    }
  });

  if (
    response.status !== StatusCodes.OK ||
    !response.data.calendars ||
    !response.data.calendars[BARBER_SERVICE_CALENDAR_ID] ||
    !response.data.calendars[BARBER_SERVICE_CALENDAR_ID].busy
  ) {
    throw new Error(
      `No calendar found with calendarId: ${BARBER_SERVICE_CALENDAR_ID}`
    );
  }
  return response.data.calendars[BARBER_SERVICE_CALENDAR_ID].busy!;
}

/**
 * Books an appointment on the Barber Service calendar using the provided credentials and event details.
 * @param credentials The service account credentials used to authenticate with the Google Calendar API.
 * @param event The event details to be added to the calendar.
 * @returns The created event data.
 * @throws An error if the event could not be created.
 */
export async function createEvent(event: calendar_v3.Schema$Event) {
  const calendar = getCalendar();
  const response = await calendar.events.insert({
    calendarId: BARBER_SERVICE_CALENDAR_ID,
    requestBody: event
  });

  if (response.status !== StatusCodes.OK) {
    throw new Error(
      `Inserting event failed with status code ${
        response.status
      }:  ${getReasonPhrase(response.status)}`
    );
  }
  return response.data;
}

/**
 * Cancels an event in the Google Calendar.
 * @param eventId - The ID of the event to be canceled.
 * @returns The response data after canceling the event.
 * @throws Error if there is an error canceling the event.
 */
export async function cancelEvent(eventId: string) {
  const calendar = getCalendar();
  const response = await calendar.events.delete({
    calendarId: BARBER_SERVICE_CALENDAR_ID,
    eventId
  });

  if (response.status !== StatusCodes.NO_CONTENT) {
    throw new Error(
      `Canceling event failed with status code ${
        response.status
      }: ${getReasonPhrase(response.status)}`
    );
  }
}

function getCalendar() {
  return google.calendar({
    version: 'v3',
    auth: new google.auth.GoogleAuth({
      credentials: googleCalendarSvcAccCreds,
      scopes: SCOPE
    })
  });
}
