import getCalendarBusy from '../util/google-calendar.util';
import { calendar_v3 } from 'googleapis';
import { DateUtils } from '../util/date.util';
import { AvailabilityResponse } from '../../../../libs/shared/src/types/availability';
import { TimeSlot } from '../../../../libs/shared/src/types/time-slot';
import { INCREMENT_MILLISECONDS } from '../constants';

export async function getAvailability(
  eventDuration: number
): Promise<AvailabilityResponse> {
  const openingHourUTC = DateUtils.getOpeningHourUtc();
  const closingHourUTC = DateUtils.getClosingHourUtc();
  const minDate = DateUtils.getMinDate();
  const maxDate = DateUtils.getMaxDate();

  const allTimeSlots = getAllTimeSlots(eventDuration, minDate, maxDate);

  const busyTimes: calendar_v3.Schema$TimePeriod[] = await getCalendarBusy(
    minDate,
    maxDate
  );

  //Convert the start and end of each time slot from date strings to date objects
  const busyTimeSlots = getBusyTimeSlots(busyTimes);

  const availableTimeSlots = getAvailableTimeSlots(allTimeSlots, busyTimeSlots);

  const timeSlotsByDate = getTimeSlotsByDate(availableTimeSlots);

  return {
    firstAvailableDate: availableTimeSlots[0].start,
    openingHourUTC,
    closingHourUTC,
    minDate,
    maxDate,
    availableTimeSlots,
    timeSlotsByDate
  };
}

function getAllTimeSlots(eventDuration: number, minDate: Date, maxDate: Date) {
  const allTimeSlots: TimeSlot[] = [];
  const openingHourUtc = DateUtils.getOpeningHourUtc();
  const closingHourUtc = DateUtils.getClosingHourUtc();
  const currStart = new Date(minDate);
  const currEnd = new Date(minDate.getTime() + eventDuration);

  while (currEnd <= maxDate) {
    const currTimeSlot = {
      start: new Date(currStart),
      end: new Date(currEnd)
    };
    if (
      DateUtils.isWithinOpenHours(currTimeSlot, openingHourUtc, closingHourUtc)
    ) {
      allTimeSlots.push(currTimeSlot);
    }
    currStart.setTime(currStart.getTime() + INCREMENT_MILLISECONDS);
    currEnd.setTime(currEnd.getTime() + INCREMENT_MILLISECONDS);
  }
  return allTimeSlots;
}

function getBusyTimeSlots(
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

function getAvailableTimeSlots(
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
        (timeSlot.end > busyTimeSlot.start && timeSlot.end <= busyTimeSlot.end)
      );
    });
  });
}

function getTimeSlotsByDate(
  availableTimeSlots: TimeSlot[]
): Map<string, TimeSlot[]> {
  const timeSlotsByDate = new Map<string, TimeSlot[]>();
  availableTimeSlots.forEach((timeSlot) => {
    const dateHash = DateUtils.getDateHash(timeSlot.start);
    const timeSlots = timeSlotsByDate.get(dateHash);
    if (timeSlots) {
      timeSlots.push(timeSlot);
    } else {
      timeSlotsByDate.set(dateHash, [timeSlot]);
    }
  });
  return timeSlotsByDate;
}
