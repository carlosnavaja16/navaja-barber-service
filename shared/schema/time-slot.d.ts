export interface TimeSlot {
  start: Date;
  end: Date;
}

export const TimeSlotZod = z.object({
  start: z.date(),
  end: z.date()
});

export interface TimeSlotResponse {
  start: string;
  end: string;
}

export interface DateTimeSlots {
  date: Date;
  timeSlots: TimeSlot[];
}
