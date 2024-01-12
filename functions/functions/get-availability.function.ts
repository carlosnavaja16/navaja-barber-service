import { AvailabilityResponse } from '../types/time-slot';
import { BARBER_SERVICE_CALENDAR_ID } from '../constants/barber-service.constants';
import { getCalendarBusy } from '../utilities/google-calendar.util';
import { ServiceAccountCredentials } from '../../types/service-account-credentials';
import { calendar_v3 } from 'googleapis';
import { DateUtils } from '../utilities/date.util';

/**
 * Retrieves availability for a barber service based on the provided event duration and calendar busy times.
 * @param credentials - The service account credentials used to authenticate with the Google Calendar API.
 * @param eventDuration - The duration of the barber service event in milliseconds.
 * @returns an Availability object.
 */
export async function getAvailability(
  credentials: ServiceAccountCredentials,
  eventDuration: number,
): Promise<AvailabilityResponse> {
  const openingHourUTC = DateUtils.getOpeningHourUtc();
  const closingHourUTC = DateUtils.getClosingHourUtc();
  const minDate = DateUtils.getMinDate();
  const maxDate = DateUtils.getMaxDate();
  const allTimeSlots = DateUtils.getAllTimeSlots(
    eventDuration,
    minDate,
    maxDate,
  );

  let busyTimes: calendar_v3.Schema$TimePeriod[];

  try {
    busyTimes = await getCalendarBusy(credentials, minDate, maxDate);
  } catch (error) {
    console.error(
      `Failed to get calendar busy times for calendarId: ${BARBER_SERVICE_CALENDAR_ID} due to error: ${error}`,
    );
    throw new Error(
      `Failed to get calendar busy times for calendarId: ${BARBER_SERVICE_CALENDAR_ID} due to error: ${error}`,
    );
  }

  //convert from maps of strings to maps of Dates
  const busyTimeSlots = busyTimes
    .filter((busyTime) => busyTime.start && busyTime.end)
    .map((busyTime) => {
      return {
        start: new Date(busyTime.start!),
        end: new Date(busyTime.end!),
      };
    });

  const availableTimeSlots = allTimeSlots
    .filter((timeSlot) => {
      return !busyTimeSlots.some((busyTimeSlot) => {
        return (
          timeSlot.start === busyTimeSlot.start ||
          timeSlot.end === busyTimeSlot.end ||
          (timeSlot.start >= busyTimeSlot.start &&
            timeSlot.start < busyTimeSlot.end) ||
          (timeSlot.end > busyTimeSlot.start &&
            timeSlot.end <= busyTimeSlot.end)
        );
      });
    })
    .map((timeSlot) => {
      return {
        start: timeSlot.start.toISOString(),
        end: timeSlot.end.toISOString(),
      };
    });

  return {
    openingHourUTC,
    closingHourUTC,
    minDate: minDate.toISOString(),
    maxDate: maxDate.toISOString(),
    availableTimeSlots,
  };
}
