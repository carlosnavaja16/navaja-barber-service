import { z } from 'zod';
import { router, procedure, privateProcedure } from '../utils/trpc.util';
import { BookingService } from '../services/booking.service';
import { AppointmentRequestZod } from '@navaja/shared';

export const bookingRouter = router({
  getServices: procedure.query(async () => {
    return BookingService.getServices();
  }),
  getAvailability: procedure.input(z.number()).query(async (opts) => {
    return BookingService.getAvailability(opts.input);
  }),
  cancelAppointment: privateProcedure
    .input(z.string())
    .mutation(async (opts) => {
      return BookingService.cancelAppointment(opts.input);
    }),
  bookAppointment: privateProcedure
    .input(AppointmentRequestZod)
    .mutation(async (opts) => {
      return BookingService.bookAppointment(opts.input);
    }),
  rescheduleAppointment: privateProcedure
    .input(
      z.object({
        eventId: z.string(),
        startTime: z.date(),
      })
    )
    .mutation(async (opts) => {
      return BookingService.rescheduleAppointment(opts.input);
    }),
  getAppointments: privateProcedure.query(async (opts) => {
    return BookingService.getAppointments(opts.ctx.user.uid);
  }),
  getAppointment: privateProcedure.input(z.string()).query(async (opts) => {
    return BookingService.getAppointment(opts.input);
  }),
});

export type BookingRouter = typeof bookingRouter;
