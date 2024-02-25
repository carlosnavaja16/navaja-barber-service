import express, { Application } from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { barberServiceRouter } from './src/router';
import cors from 'cors';
import { ANGULAR_DEV_PORT, TRPC_SERVER_PORT } from '../shared/constants';

const app: Application = express();

const corsOptions = {
  origin: [`http://localhost:${ANGULAR_DEV_PORT}`]
};

app.use(cors(corsOptions));

app.use('/trpc', createExpressMiddleware({ router: barberServiceRouter }));

app.listen(TRPC_SERVER_PORT, () =>
  console.log(`
  💈 tRPC barber service ready at: http://localhost:${TRPC_SERVER_PORT}`)
);
