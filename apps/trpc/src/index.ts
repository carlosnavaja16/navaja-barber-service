import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { trpcServer } from '@hono/trpc-server';
import { barberServiceRouter } from './router';
import { HOST, PORT } from './constants';
import admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';
import { firebaseSvcAccCreds } from './credentials';
import { createBarberContext } from './context';

const app = new Hono();

export const firebaseApp = admin.initializeApp({
  credential: cert(firebaseSvcAccCreds)
});

app.use(cors());
app.use(
  '/trpc/*',
  trpcServer({
    router: barberServiceRouter,
    createContext: createBarberContext
  })
);

serve({
  fetch: app.fetch,
  port: PORT,
  hostname: HOST
});

console.log(`💈 Barber tRPC server listening on port: ${PORT}`);
