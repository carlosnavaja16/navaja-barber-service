import { formatDate } from '@angular/common';
import { AFTERNOON, EVENING, MORNING, TimeSlot } from '@navaja/shared';

export class DateUtils {
  public static isDateInAvailableDates(
    date: Date,
    timeSlotsByDate: Map<string, TimeSlot[]>
  ): boolean {
    return timeSlotsByDate.has(DateUtils.getDateHash(date));
  }

  public static whichPartOfDay(timeSlot: TimeSlot) {
    const startHour = timeSlot.start.getHours();
    if (startHour >= 0 && startHour < 12) {
      return MORNING;
    } else if (startHour >= 12 && startHour < 18) {
      return AFTERNOON;
    } else {
      return EVENING;
    }
  }

  public static getMillisecondsFromMinutes(minutes: number) {
    return minutes * 60 * 1000;
  }

  public static getTimeZoneAbbr(): string {
    return new Date()
      .toLocaleTimeString('en-us', { timeZoneName: 'short' })
      .split(' ')[2];
  }

  public static getTimeSlotsByDate(
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

  public static getDateHash = (date: Date) => {
    return date.toLocaleDateString();
  };

  public static getDateString = (date: Date) => {
    return formatDate(date, "EEE, MMM d 'at' h:mm a", 'en-US');
  };
}
