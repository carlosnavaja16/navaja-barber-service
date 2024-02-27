import { z } from 'zod';

export const BookAppointmentRequest = z.object({
  summary: z.string(),
  description: z.string(),
  location: z.string(),
  start: z.object({
    dateTime: z.string()
  }),
  end: z.object({
    dateTime: z.string()
  })
});
