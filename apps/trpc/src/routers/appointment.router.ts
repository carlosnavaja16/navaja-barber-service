import { z } from 'zod';
import { router, procedure, privateProcedure } from '../utils/trpc.util';
import { FirestoreService } from '../services/firestore.service';
import { AppointmentRequestZod } from '@navaja/shared';

export const appointmentRouter = router({
  getAvailability: procedure.input(z.number()).query(async (opts) => {
    return FirestoreService.getAvailability(opts.input);
  }),
  cancelAppointment: privateProcedure
    .input(z.string())
    .mutation(async (opts) => {
      return FirestoreService.cancelAppointment(opts.input);
    }),
  bookAppointment: privateProcedure
    .input(AppointmentRequestZod)
    .mutation(async (opts) => {
      return FirestoreService.bookAppointment(opts.input);
    }),
  rescheduleAppointment: privateProcedure
    .input(
      z.object({
        eventId: z.string(),
        startTime: z.date()
      })
    )
    .mutation(async (opts) => {
      return FirestoreService.rescheduleAppointment(opts.input);
    }),
  getAppointments: privateProcedure.query(async (opts) => {
    return FirestoreService.getAppointments(opts.ctx.user.uid);
  }),
  getAppointment: privateProcedure.input(z.string()).query(async (opts) => {
    return FirestoreService.getAppointment(opts.input);
  })
});

export type AppointmentRouter = typeof appointmentRouter;
