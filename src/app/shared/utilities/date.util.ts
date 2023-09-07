import { LIMIT_DAYS, BUFFER_HOURS } from "../constants";

/**
 * Returns a new Date object representing the minimum date allowed for a timeslot.
 * The minimum date is calculated by adding the specified buffer hours to the current UTC time,
 * rounding up to the nearest hour.
 * @returns A new Date object representing the minimum date allowed for a timeslot.
 */
function getMinDate() {
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
function getMaxDate() {
  const maxDate = new Date();
  maxDate.setUTCDate(maxDate.getUTCDate() + LIMIT_DAYS);
  maxDate.setUTCHours(maxDate.getUTCHours(), 0, 0, 0);
  return maxDate;
}
