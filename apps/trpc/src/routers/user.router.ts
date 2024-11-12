import { UserProfileZod } from '@navaja/shared';
import { UserService } from '../services/user.service';
import { router } from '../utils/trpc.util';
import { privateProcedure } from '../utils/trpc.util';
import { z } from 'zod';

export const userRouter = router({
  getUserProfile: privateProcedure.query(async (opts) => {
    return UserService.getUserProfile(opts.ctx.user.uid);
  }),
  createUserProfile: privateProcedure
    .input(UserProfileZod)
    .mutation(async (opts) => {
      return UserService.createUserProfile(opts.input);
    }),
  updateUserProfile: privateProcedure
    .input(UserProfileZod)
    .mutation(async (opts) => {
      return UserService.updateUserProfile(opts.input);
    }),
  updateUserEmail: privateProcedure.input(z.string()).mutation(async (opts) => {
    return UserService.updateUserEmail(opts.ctx.user.uid, opts.input);
  })
});

export type UserRouter = typeof userRouter;
