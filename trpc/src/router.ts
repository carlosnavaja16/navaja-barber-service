import { initTRPC } from '@trpc/server';
import { getAvailability } from './functions/get-availability.function';
import { bookAppointment } from './functions/book-appointment.function';
import { cancelAppointment } from './functions/cancel-appointment.function';
import { z } from 'zod';
import { BarberContext, getProtectedProcedure } from './context';
import { getServices } from './functions/get-services.function';
import {
  getAppointment,
  getAppointments
} from './functions/get-appointments.function';
import { AppointmentRequestZod } from '../../shared/schema/appointment';
import superjson from 'superjson';
import { rescheduleEvent } from './util/google-calendar.util';

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
    .input(z.string())
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
