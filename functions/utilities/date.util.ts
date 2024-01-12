import { DateTime } from 'luxon';
import {
  INCREMENT_MILLISECONDS,
  BUFFER_HOURS,
  OPENING_HOUR_EST,
  CLOSING_HOUR_EST,
  LIMIT_DAYS,
  DAYS_CLOSED,
} from '../constants/barber-service.constants';
import { TimeSlot } from '../../types/time-slot';

export class DateUtils {
  public static getOpeningHourUtc(): number {
    return DateTime.fromObject(
      { hour: OPENING_HOUR_EST },
      { zone: 'America/New_York' },
    ).toUTC().hour;
  }

  public static getClosingHourUtc(): number {
    return DateTime.fromObject(
      { hour: CLOSING_HOUR_EST },
      { zone: 'America/New_York' },
    ).toUTC().hour;
  }

  public static getDateHash(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Returns a new Date object representing the minimum date allowed for a time slot.
   * The minimum date is calculated by adding the buffer hours to the current UTC time,
   * rounding up to the nearest hour.
   * @returns A new Date object representing the minimum date allowed for a time slot.
   */
  public static getMinDate() {
    const minDate = new Date();
    minDate.setUTCHours(
      minDate.getUTCHours() + BUFFER_HOURS,
      minDate.getUTCMinutes() + 30,
    );
    minDate.setUTCMinutes(0, 0, 0);
    return minDate;
  }

  /**
   * Returns the maximum date based on the current date and a limit of days.
   * @returns The maximum date.
   */
  public static getMaxDate() {
    const maxDate = new Date();
    maxDate.setUTCDate(maxDate.getUTCDate() + LIMIT_DAYS);
    maxDate.setUTCHours(this.getClosingHourUtc(), 0, 0, 0);
    return maxDate;
  }

  /**
   * Returns an array of available time slots between the minimum and maximum dates,
   * with the specified event duration and opening/closing hours.
   * @param eventDuration The duration of the event in milliseconds.
   * @returns An array of available time slots.
   */
  public static getAllTimeSlots(
    eventDuration: number,
    minDate: Date,
    maxDate: Date,
  ) {
    const allTimeSlots: TimeSlot[] = [];
    const openingHourUtc = this.getOpeningHourUtc();
    const closingHourUtc = this.getClosingHourUtc();
    const currStart = new Date(minDate);
    const currEnd = new Date(minDate.getTime() + eventDuration);

    while (currEnd <= maxDate) {
      const currTimeSlot = {
        start: new Date(currStart),
        end: new Date(currEnd),
      };
      if (
        this.isWithinOpenHours(currTimeSlot, openingHourUtc, closingHourUtc)
      ) {
        allTimeSlots.push(currTimeSlot);
      }
      currStart.setTime(currStart.getTime() + INCREMENT_MILLISECONDS);
      currEnd.setTime(currEnd.getTime() + INCREMENT_MILLISECONDS);
    }
    return allTimeSlots;
  }

  public static isWithinOpenHours(
    timeSlot: TimeSlot,
    openingHourUtc: number,
    closingHourUtc: number,
  ) {
    if (this.isDateOnClosedDaysEST(timeSlot.start)) {
      return false;
    }

    if (openingHourUtc > closingHourUtc) {
      return (
        ((timeSlot.start.getHours() >= openingHourUtc &&
          timeSlot.start.getHours() < 24) ||
          (timeSlot.start.getHours() >= 0 &&
            timeSlot.start.getHours() < closingHourUtc)) &&
        ((timeSlot.end.getHours() > openingHourUtc &&
          timeSlot.end.getHours() < 24) ||
          (timeSlot.end.getHours() >= 0 &&
            timeSlot.end.getHours() <= closingHourUtc))
      );
    } else {
      return (
        timeSlot.start.getUTCHours() >= openingHourUtc &&
        timeSlot.start.getUTCHours() < closingHourUtc &&
        timeSlot.end.getUTCHours() > openingHourUtc &&
        timeSlot.end.getUTCHours() <= closingHourUtc
      );
    }
  }

  /**
   * Determines if a given date falls on a day that the business is closed in the Eastern Standard Time (EST) timezone.
   * @param date The date to check.
   * @returns A boolean indicating whether the date falls on a closed day.
   */
  public static isDateOnClosedDaysEST(date: Date): boolean {
    return DAYS_CLOSED.includes(
      DateTime.fromMillis(date.getTime(), { zone: 'America/New_York' }).weekday,
    );
  }
}
