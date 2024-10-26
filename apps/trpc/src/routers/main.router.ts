import { router } from '../utils/trpc.util';
import { appointmentRouter } from './appointment.router';
import { serviceRouter } from './service.router';

export const mainRouter = router({
  appointment: appointmentRouter,
  service: serviceRouter
});

export type MainRouter = typeof mainRouter;
