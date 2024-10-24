import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { firebaseApp } from './index.js';

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

export type BarberContext = Awaited<ReturnType<typeof createBarberContext>>;
