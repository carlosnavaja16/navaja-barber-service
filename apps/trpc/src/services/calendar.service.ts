import { calendar_v3, google } from 'googleapis';
import {
  BARBER_SERVICE_CALENDAR_ID,
  FREEBUSY_FETCH_FAILED,
  EVENT_DELETION_FAILED,
  EVENT_INSERTION_FAILED,
  SCOPE,
  EVENT_UPDATE_FAILED
} from '../utils/constants';
import { googleCalendarSvcAccCreds } from '../credentials';
import { StatusCodes } from 'http-status-codes';
import { RescheduleRequest } from '@navaja/shared';

export class CalendarService {
  /**
   * Retrieves busy time slots from a Google Calendar for a specific date range.
   * @param credentials - The service account credentials used to authenticate with the Google Calendar API.
   * @param minDate - The minimum date of the range to retrieve busy time slots for.
   * @param maxDate - The maximum date of the range to retrieve busy time slots for.
   * @returns An array of busy time slots for the specified date range.
   * @throws An error if the freebusy query fails or if no calendar is found for the specified calendar ID.
   */
  public static async getCalendarFreeBusy(minDate: Date, maxDate: Date) {
    const response = await this.getCalendar().freebusy.query({
      requestBody: {
        items: [{ id: BARBER_SERVICE_CALENDAR_ID }],
        timeMin: minDate.toISOString(),
        timeMax: maxDate.toISOString()
      }
    });
    if (
      !response.data.calendars![BARBER_SERVICE_CALENDAR_ID]!.busy ||
      response.status !== StatusCodes.OK
    ) {
      FREEBUSY_FETCH_FAILED(BARBER_SERVICE_CALENDAR_ID, response.status);
    }
    return response.data.calendars![BARBER_SERVICE_CALENDAR_ID]!.busy!;
  }

  /**
   * Books an appointment on the Barber Service calendar using the provided credentials and event details.
   * @param event The event details to be added to the calendar.
   * @returns The created event data.
   * @throws An error if the event could not be created.
   */
  public static async insertEvent(event: calendar_v3.Schema$Event) {
    const response = await this.getCalendar().events.insert({
      calendarId: BARBER_SERVICE_CALENDAR_ID,
      requestBody: event
    });
    if (!response.data || response.status !== StatusCodes.OK) {
      EVENT_INSERTION_FAILED(response.status);
    }
    return response.data;
  }

  /**
   * Cancels an event in the Google Calendar.
   * @param eventId - The ID of the event to be canceled.
   * @returns The response data after canceling the event.
   * @throws Error if there is an error canceling the event.
   */
  public static async deleteEvent(eventId: string) {
    const response = await this.getCalendar().events.delete({
      calendarId: BARBER_SERVICE_CALENDAR_ID,
      eventId
    });
    if (response.status !== StatusCodes.NO_CONTENT) {
      EVENT_DELETION_FAILED(response.status);
    }
  }

  /**
   * Reschedules an event in the Google Calendar.
   * @param rescheduleRequest - The reschedule request containing the event ID and new event details.
   * @returns The event ID.
   */
  public static async rescheduleEvent(rescheduleRequest: RescheduleRequest) {
    const response = await this.getCalendar().events.update({
      calendarId: BARBER_SERVICE_CALENDAR_ID,
      eventId: rescheduleRequest.eventId,
      requestBody: {
        start: { dateTime: rescheduleRequest.startTime.toISOString() }
      }
    });
    if (!response.data || response.status !== StatusCodes.OK) {
      EVENT_UPDATE_FAILED(response.status);
    }
    return response.data;
  }

  /**
   * Returns a Google Calendar client instance.
   * @returns A Google Calendar client instance.
   */
  private static getCalendar() {
    return google.calendar({
      version: 'v3',
      auth: new google.auth.GoogleAuth({
        credentials: googleCalendarSvcAccCreds,
        scopes: SCOPE
      })
    });
  }
}
