import { TimeSlot } from '@navaja/shared';
import { DateUtils } from './date.util';
import { INCREMENT_MILLISECONDS } from '../../constants';
import { calendar_v3 } from 'googleapis';

export class TimeSlotUtils {
  /**
   * Returns all time slots for a given date range.
   * @param eventDurationMillis - The duration of the event in milliseconds.
   * @param minDate - The minimum date.
   * @param maxDate - The maximum date.
   * @returns All time slots for the given date range.
   */
  public static getAllTimeSlots(
    eventDurationMillis: number,
    minDate: Date,
    maxDate: Date
  ) {
    const allTimeSlots: TimeSlot[] = [];
    const openingHourUtc = DateUtils.getOpeningHourUtc();
    const closingHourUtc = DateUtils.getClosingHourUtc();
    const currStart = new Date(minDate);
    const currEnd = new Date(minDate.getTime() + eventDurationMillis);

    while (currEnd <= maxDate) {
      const currTimeSlot = {
        start: new Date(currStart),
        end: new Date(currEnd)
      };
      if (
        DateUtils.isWithinOpenHours(
          currTimeSlot,
          openingHourUtc,
          closingHourUtc
        )
      ) {
        allTimeSlots.push(currTimeSlot);
      }
      currStart.setTime(currStart.getTime() + INCREMENT_MILLISECONDS);
      currEnd.setTime(currEnd.getTime() + INCREMENT_MILLISECONDS);
    }
    return allTimeSlots;
  }

  /**
   * Converts busy times from date strings to date objects.
   * @param busyTimes - The busy times.
   * @returns The busy time slots.
   */
  public static getBusyTimeSlots(
    busyTimes: calendar_v3.Schema$TimePeriod[]
  ): TimeSlot[] {
    return busyTimes
      .filter((busyTime) => busyTime.start && busyTime.end)
      .map((busyTime) => {
        return {
          start: new Date(busyTime.start!),
          end: new Date(busyTime.end!)
        };
      });
  }

  /**
   * Returns the available time slots for a given date range.
   * @param allTimeSlots - All time slots.
   * @param busyTimeSlots - The busy time slots.
   * @returns The available time slots for the given date range.
   */
  public static getAvailableTimeSlots(
    allTimeSlots: TimeSlot[],
    busyTimeSlots: TimeSlot[]
  ): TimeSlot[] {
    return allTimeSlots.filter((timeSlot) => {
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
    });
  }
}
