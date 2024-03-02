import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { trpcServer } from '@hono/trpc-server';
import { barberServiceRouter } from './router';

const PORT = parseInt(process.env.PORT!) || 8080;
const HOST = process.env.HOST || '0.0.0.0';

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
