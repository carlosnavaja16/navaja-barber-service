'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.DateUtils = void 0;
var luxon_1 = require('luxon');
var barber_service_constants_1 = require('../constants/barber-service.constants');
var DateUtils = /** @class */ (function () {
  function DateUtils() {}
  DateUtils.getOpeningHourUtc = function () {
    return luxon_1.DateTime.fromObject(
      { hour: barber_service_constants_1.OPENING_HOUR_EST },
      { zone: 'America/New_York' },
    ).toUTC().hour;
  };
  DateUtils.getClosingHourUtc = function () {
    return luxon_1.DateTime.fromObject(
      { hour: barber_service_constants_1.CLOSING_HOUR_EST },
      { zone: 'America/New_York' },
    ).toUTC().hour;
  };
  /**
   * Determines if a given date falls on a day that the business is closed in the Eastern Standard Time (EST) timezone.
   * @param date The date to check.
   * @returns A boolean indicating whether the date falls on a closed day.
   */
  DateUtils.isDateOnClosedDaysEST = function (date) {
    return barber_service_constants_1.DAYS_CLOSED.includes(
      luxon_1.DateTime.fromMillis(date.getTime(), { zone: 'America/New_York' })
        .weekday,
    );
  };
  DateUtils.getDateHash = function (date) {
    return date.toISOString().split('T')[0];
  };
  /**
   * Returns a new Date object representing the minimum date allowed for a time slot.
   * The minimum date is calculated by adding the buffer hours to the current UTC time,
   * rounding up to the nearest hour.
   * @returns A new Date object representing the minimum date allowed for a time slot.
   */
  DateUtils.getMinDate = function () {
    var minDate = new Date();
    minDate.setUTCHours(
      minDate.getUTCHours() + barber_service_constants_1.BUFFER_HOURS,
      minDate.getUTCMinutes() + 30,
    );
    minDate.setUTCMinutes(0, 0, 0);
    return minDate;
  };
  /**
   * Returns the maximum date based on the current date and a limit of days.
   * @returns The maximum date.
   */
  DateUtils.getMaxDate = function () {
    var maxDate = new Date();
    maxDate.setUTCDate(
      maxDate.getUTCDate() + barber_service_constants_1.LIMIT_DAYS,
    );
    maxDate.setUTCHours(this.getClosingHourUtc(), 0, 0, 0);
    return maxDate;
  };
  /**
   * Returns an array of available time slots between the minimum and maximum dates,
   * with the specified event duration and opening/closing hours.
   * @param eventDuration The duration of the event in milliseconds.
   * @returns An array of available time slots.
   */
  DateUtils.getAllTimeSlots = function (eventDuration, minDate, maxDate) {
    var allTimeSlots = [];
    var currStart = new Date(minDate);
    var currEnd = new Date(minDate.getTime() + eventDuration);
    while (currEnd <= maxDate) {
      var currTimeSlot = {
        start: new Date(currStart),
        end: new Date(currEnd),
      };
      if (this.isWithinOpenHours(currTimeSlot)) {
        allTimeSlots.push(currTimeSlot);
      }
      currStart.setTime(
        currStart.getTime() + barber_service_constants_1.INCREMENT_MILLISECONDS,
      );
      currEnd.setTime(
        currEnd.getTime() + barber_service_constants_1.INCREMENT_MILLISECONDS,
      );
    }
    return allTimeSlots;
  };
  DateUtils.isWithinOpenHours = function (timeSlot) {
    if (this.isDateOnClosedDaysEST(timeSlot.start)) {
      return false;
    }
    var openingHourUtc = this.getOpeningHourUtc();
    var closingHourUtc = this.getClosingHourUtc();
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
  };
  return DateUtils;
})();
exports.DateUtils = DateUtils;
