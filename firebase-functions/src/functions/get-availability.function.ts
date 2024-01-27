import { AvailabilityResponse } from '../../../shared/types/availability';
import { getCalendarBusy } from '../utilities/google-calendar.util';
import { calendar_v3 } from 'googleapis';
import { DateUtils } from '../utilities/date.util';

/**
 * Retrieves availability for a barber service based on the provided event duration and calendar busy times.
 * @param credentials - The service account credentials used to authenticate with the Google Calendar API.
 * @param eventDuration - The duration of the barber service event in milliseconds.
 * @returns an Availability object.
 */
export async function getAvailability(
  eventDuration: number
): Promise<AvailabilityResponse> {
  const openingHourUTC = DateUtils.getOpeningHourUtc();
  const closingHourUTC = DateUtils.getClosingHourUtc();
  const minDate = DateUtils.getMinDate();
  const maxDate = DateUtils.getMaxDate();
  const allTimeSlots = DateUtils.getAllTimeSlots(
    eventDuration,
    minDate,
    maxDate
  );

  const busyTimes: calendar_v3.Schema$TimePeriod[] = await getCalendarBusy(
    minDate,
    maxDate
  );

  //convert from maps of strings to maps of Dates
  const busyTimeSlots = busyTimes
    .filter((busyTime) => busyTime.start && busyTime.end)
    .map((busyTime) => {
      return {
        start: new Date(busyTime.start!),
        end: new Date(busyTime.end!)
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
        end: timeSlot.end.toISOString()
      };
    });

  return {
    openingHourUTC,
    closingHourUTC,
    minDate: minDate.toISOString(),
    maxDate: maxDate.toISOString(),
    availableTimeSlots
  };
}
