import { initTRPC } from '@trpc/server';
import { getAvailability } from './functions/get-availability.function';
import { bookAppointment } from './functions/book-appointment.function';
import { cancelAppointment } from './functions/cancel-appointment.function';
import { z } from 'zod';
import { BookAppointmentRequest } from './schema/book-appointment-request';

const t = initTRPC.create();
export const publicProcedure = t.procedure;

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
    .input(BookAppointmentRequest)
    .mutation(async (opts) => {
      return bookAppointment(opts.input);
    })
});

export type BarberServiceRouter = typeof barberServiceRouter;
