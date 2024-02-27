import express, { Application } from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { barberServiceRouter } from './src/router';
import cors from 'cors';

const PORT = parseInt(process.env.PORT!) || 8080;
const HOST = process.env.HOST || '0.0.0.0';

const app: Application = express();

app.use(cors());
app.use('/trpc', createExpressMiddleware({ router: barberServiceRouter }));
try {
  app.listen(PORT, HOST, () =>
    console.log(`💈 tRPC barber service ready on port ${PORT}`)
  );
} catch (error) {
  console.error('Error starting server:', error);
}
