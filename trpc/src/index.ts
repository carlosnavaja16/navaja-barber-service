import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { trpcServer } from '@hono/trpc-server';
import { barberServiceRouter } from './router';
import { HOST, PORT } from './constants';

const app = new Hono();

app.use(cors());
app.use(
  '/trpc/*',
  trpcServer({
    router: barberServiceRouter
  })
);

serve({
  fetch: app.fetch,
  port: PORT,
  hostname: HOST
});

console.log(`💈 Barber tRPC server listening on port: ${PORT}`);
