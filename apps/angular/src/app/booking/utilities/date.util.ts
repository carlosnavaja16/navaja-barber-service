import { TimeSlot } from '@navaja/shared';

export class DateUtils {
  public static getDateHash(date: Date): string {
    return date.toLocaleDateString();
  }

  public static isDateInAvailableDates(
    date: Date,
    timeSlotsByDate: Map<string, TimeSlot[]>
  ): boolean {
    return timeSlotsByDate.has(this.getDateHash(date));
  }

  public static whichPartOfDay(timeSlot: TimeSlot) {
    const startHour = timeSlot.start.getHours();
    if (startHour >= 0 && startHour < 12) {
      return 'morning';
    } else if (startHour >= 12 && startHour < 18) {
      return 'afternoon';
    } else {
      return 'evening';
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
}
