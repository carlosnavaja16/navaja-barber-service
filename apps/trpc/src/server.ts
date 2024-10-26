import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { trpcServer } from '@hono/trpc-server';
import { mainRouter } from './routers/main.router';
import { HOST, TRPC_RUNNING } from './utils/constants';
import { createBarberContext } from './context/context';
import { TRPC_ENDPOINT, TRPC_PORT } from '@navaja/shared';
export type { MainRouter } from './routers/main.router';

const app = new Hono();

app.use(cors());
app.use(
  `${TRPC_ENDPOINT}/*`,
  trpcServer({
    router: mainRouter,
    createContext: createBarberContext
  })
);

serve({
  fetch: app.fetch,
  port: TRPC_PORT,
  hostname: HOST
});

console.log(TRPC_RUNNING);
