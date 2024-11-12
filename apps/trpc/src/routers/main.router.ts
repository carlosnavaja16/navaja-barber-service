import { router } from '../utils/trpc.util';
import { bookingRouter } from './booking.router';
import { userRouter } from './user.router';

export const mainRouter = router({
  booking: bookingRouter,
  user: userRouter
});

export type MainRouter = typeof mainRouter;
