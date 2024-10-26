import { initTRPC, TRPCError } from '@trpc/server';
import { BarberContext } from '../context/context';
import superjson from 'superjson';

const t = initTRPC.context<BarberContext>().create({
  transformer: superjson
});
export const router = t.router;
export const procedure = t.procedure;
export const privateProcedure = procedure.use((opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({ ctx: { user: opts.ctx.user } });
});
