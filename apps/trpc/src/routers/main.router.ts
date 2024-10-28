import { router } from '../utils/trpc.util';
import { appointmentRouter } from './appointment.router';
import { serviceRouter } from './service.router';
import { userRouter } from './user.router';

export const mainRouter = router({
  appointment: appointmentRouter,
  service: serviceRouter,
  user: userRouter
});

export type MainRouter = typeof mainRouter;
