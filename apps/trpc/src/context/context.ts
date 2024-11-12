import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { firebaseApp } from '../utils/firebase';
import { inferAsyncReturnType } from '@trpc/server';

export async function createBarberContext(opts: FetchCreateContextFnOptions) {
  const token = opts.req.headers.get('Authorization');
  let user = null;
  try {
    user = await firebaseApp.auth().verifyIdToken(token || '');
  } catch (error) {
    console.warn('Invalid token', error);
  }
  return { user };
}

export type BarberContext = inferAsyncReturnType<typeof createBarberContext>;
