import { initTRPC } from '@trpc/server';
import { getAvailability } from './functions/get-availability.function.js';
import { bookAppointment } from './functions/book-appointment.function.js';
import { cancelAppointment } from './functions/cancel-appointment.function.js';
import { z } from 'zod';
import { BarberContext, getProtectedProcedure } from './context.js';
import { getServices } from './functions/get-services.function.js';
import {
  getAppointment,
  getAppointments
} from './functions/get-appointments.function.js';
import { AppointmentRequestZod } from '@navaja/shared';
import superjson from 'superjson';
import { rescheduleEvent } from './util/google-calendar.util.js';

const t = initTRPC.context<BarberContext>().create({
  transformer: superjson
});
export const publicProcedure = t.procedure;
export const protectedProcedure = getProtectedProcedure();

export const barberServiceRouter = t.router({
  getAvailability: publicProcedure.input(z.number()).query(async (opts) => {
    return getAvailability(opts.input);
  }),
  cancelAppointment: publicProcedure
    .input(z.string())
    .mutation(async (opts) => {
      return cancelAppointment(opts.input);
    }),
  bookAppointment: publicProcedure
    .input(AppointmentRequestZod)
    .mutation(async (opts) => {
      return bookAppointment(opts.input);
    }),
  rescheduleAppointment: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        startTime: z.date()
      })
    )
    .mutation(async (opts) => {
      return rescheduleEvent(opts.input);
    }),
  getServices: publicProcedure.query(async () => {
    return getServices();
  }),
  getAppointments: publicProcedure.input(z.string()).query(async (opts) => {
    return getAppointments(opts.input);
  }),
  getAppointment: publicProcedure.input(z.string()).query(async (opts) => {
    return getAppointment(opts.input);
  })
});

export type BarberServiceRouter = typeof barberServiceRouter;
