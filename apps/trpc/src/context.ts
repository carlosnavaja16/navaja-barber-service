import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { firebaseApp } from './index.js';
import { publicProcedure } from './router.js';
import { TRPCError } from '@trpc/server';

export async function createBarberContext(opts: FetchCreateContextFnOptions) {
  const user = await getUser(opts.req.headers.get('Authorization'));
  return { user };
}

async function getUser(token: string | null) {
  try {
    return await firebaseApp.auth().verifyIdToken(token || '');
  } catch {
    return null;
  }
}

export function getProtectedProcedure() {
  return publicProcedure.use((opts) => {
    if (!opts.ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED'
      });
    }
    return opts.next({
      ctx: {
        user: opts.ctx.user
      }
    });
  });
}

export type BarberContext = Awaited<ReturnType<typeof createBarberContext>>;
