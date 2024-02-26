import express, { Application } from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { barberServiceRouter } from './src/router';

const TRPC_SERVER_PORT = parseInt(process.env.PORT!) || 8080;
const app: Application = express();
/*
const corsOptions = {
  origin: [`http://localhost:${ANGULAR_DEV_PORT}`]
};

app.use(cors(corsOptions));
*/
app.use('/trpc', createExpressMiddleware({ router: barberServiceRouter }));

app.listen(TRPC_SERVER_PORT, '0.0.0.0', () =>
  console.log(`💈 tRPC barber service ready on port ${TRPC_SERVER_PORT}`)
);
