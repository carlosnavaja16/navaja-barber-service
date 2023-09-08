import { TimeSlot } from "../types/time-slot";

export class DateUtils {
  public static getDateHash(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  public static isDateInAvailableDates(
    date: Date,
    timeSlotsByDate: Map<string, TimeSlot[]>,
  ): boolean {
    return timeSlotsByDate.has(this.getDateHash(date));
  }
}
