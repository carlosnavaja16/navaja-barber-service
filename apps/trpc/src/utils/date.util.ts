import { DateTime } from 'luxon';
import {
  BUFFER_HOURS,
  CLOSING_HOUR_EST,
  DAYS_CLOSED,
  LIMIT_DAYS,
  OPENING_HOUR_EST,
  TIME_ZONE,
} from './constants';
import { TimeSlot } from '@navaja/shared';
/**
 * Utility class for date and time operations.
 */
export class DateUtils {
  /**
   * Returns the opening hour in UTC.
   * @returns The opening hour in UTC.
   */
  public static getOpeningHourUtc(): number {
    return DateTime.fromObject(
      { hour: OPENING_HOUR_EST },
      { zone: TIME_ZONE }
    ).toUTC().hour;
  }

  /**
   * Returns the closing hour in UTC.
   * @returns The closing hour in UTC.
   */
  public static getClosingHourUtc(): number {
    return DateTime.fromObject(
      { hour: CLOSING_HOUR_EST },
      { zone: TIME_ZONE }
    ).toUTC().hour;
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
      minDate.getUTCMinutes() + 30
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
   * Determines if a given time slot falls within the business's operating hours.
   * @param timeSlot - The time slot to check.
   * @param openingHourUtc - The opening hour in UTC.
   * @param closingHourUtc - The closing hour in UTC.
   * @returns A boolean indicating whether the time slot falls within the business's operating hours.
   */
  public static isWithinOpenHours(
    timeSlot: TimeSlot,
    openingHourUtc: number,
    closingHourUtc: number
  ) {
    if (this.isDateOnClosedDaysEST(timeSlot.start)) {
      return false;
    }

    if (openingHourUtc > closingHourUtc) {
      return (
        ((timeSlot.start.getUTCHours() >= openingHourUtc &&
          timeSlot.start.getUTCHours() < 24) ||
          (timeSlot.start.getUTCHours() >= 0 &&
            timeSlot.start.getUTCHours() < closingHourUtc)) &&
        ((timeSlot.end.getUTCHours() > openingHourUtc &&
          timeSlot.end.getUTCHours() < 24) ||
          (timeSlot.end.getUTCHours() >= 0 &&
            timeSlot.end.getUTCHours() <= closingHourUtc))
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
   * Determines if a given date falls on a day that the business is closed in the business's timezone.
   * @param date - The date to check.
   * @returns A boolean indicating whether the date falls on a closed day.
   */
  public static isDateOnClosedDaysEST(date: Date): boolean {
    return DAYS_CLOSED.includes(
      DateTime.fromMillis(date.getTime(), { zone: TIME_ZONE }).weekday
    );
  }
}
