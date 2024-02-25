import getCalendarBusy from '../util/google-calendar.util';
import { calendar_v3 } from 'googleapis';
import { DateUtils } from '../util/date.util';

export async function getAvailability(eventDuration: number) {
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
