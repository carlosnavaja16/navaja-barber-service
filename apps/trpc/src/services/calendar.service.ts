import { calendar_v3, google } from 'googleapis';
import {
  BARBER_SERVICE_CALENDAR_ID,
  CALENDAR_NOT_FOUND,
  EVENT_DELETION_FAILED,
  EVENT_INSERTION_FAILED,
  SCOPE
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
  public static async getCalendarFreeBusy(
    minDate: Date,
    maxDate: Date
  ): Promise<calendar_v3.Schema$TimePeriod[]> {
    const calendar = this.getCalendar();
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
      throw new Error(CALENDAR_NOT_FOUND(BARBER_SERVICE_CALENDAR_ID));
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
  public static async insertEvent(event: calendar_v3.Schema$Event) {
    const calendar = this.getCalendar();
    const response = await calendar.events.insert({
      calendarId: BARBER_SERVICE_CALENDAR_ID,
      requestBody: event
    });

    if (response.status !== StatusCodes.OK) {
      throw new Error(EVENT_INSERTION_FAILED(response.status));
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
    const calendar = this.getCalendar();
    const response = await calendar.events.delete({
      calendarId: BARBER_SERVICE_CALENDAR_ID,
      eventId
    });

    if (response.status !== StatusCodes.NO_CONTENT) {
      throw new Error(EVENT_DELETION_FAILED(response.status));
    }
  }

  /**
   * Reschedules an event in the Google Calendar.
   * @param rescheduleRequest - The reschedule request containing the event ID and new event details.
   * @returns The event ID.
   */
  public static async rescheduleEvent(rescheduleRequest: RescheduleRequest) {
    return rescheduleRequest.eventId;
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
