import { UserProfileZod } from '@navaja/shared';
import { FirestoreService } from '../services/firestore.service';
import { router } from '../utils/trpc.util';
import { privateProcedure } from '../utils/trpc.util';

export const userRouter = router({
  getUserProfile: privateProcedure.query(async (opts) => {
    return FirestoreService.getUserProfile(opts.ctx.user.uid);
  }),
  createUserProfile: privateProcedure
    .input(UserProfileZod)
    .mutation(async (opts) => {
      return FirestoreService.createUserProfile(opts.input);
    }),
  updateUserProfile: privateProcedure
    .input(UserProfileZod)
    .mutation(async (opts) => {
      return FirestoreService.updateUserProfile(opts.input);
    })
});

export type UserRouter = typeof userRouter;
