import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { BarberContext } from './context.js';
import { AppointmentRequestZod } from '@navaja/shared';
import superjson from 'superjson';
import {} from './calendar/calendar.service.js';
import { AppointmentService } from './appointment/service/appointment.service.js';

const t = initTRPC.context<BarberContext>().create({
  transformer: superjson
});
export const publicProcedure = t.procedure;
export const protectedProcedure = publicProcedure.use((opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({ ctx: { user: opts.ctx.user } });
});

export const barberServiceRouter = t.router({
  getAvailability: publicProcedure.input(z.number()).query(async (opts) => {
    return AppointmentService.getAvailability(opts.input);
  }),
  cancelAppointment: publicProcedure
    .input(z.string())
    .mutation(async (opts) => {
      return AppointmentService.cancelAppointment(opts.input);
    }),
  bookAppointment: publicProcedure
    .input(AppointmentRequestZod)
    .mutation(async (opts) => {
      return AppointmentService.bookAppointment(opts.input);
    }),
  rescheduleAppointment: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        startTime: z.date()
      })
    )
    .mutation(async (opts) => {
      return AppointmentService.rescheduleAppointment(opts.input);
    }),
  getServices: publicProcedure.query(async () => {
    return AppointmentService.getServices();
  }),
  getAppointments: publicProcedure.input(z.string()).query(async (opts) => {
    return AppointmentService.getAppointments(opts.input);
  }),
  getAppointment: publicProcedure.input(z.string()).query(async (opts) => {
    return AppointmentService.getAppointment(opts.input);
  })
});

export type BarberServiceRouter = typeof barberServiceRouter;
