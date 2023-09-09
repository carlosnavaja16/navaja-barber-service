import { TimeSlot } from '../types/time-slot';

export class DateUtils {
  public static getDateHash(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  public static isDateInAvailableDates(
    date: Date,
    timeSlotsByDate: Map<string, TimeSlot[]>,
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
}
