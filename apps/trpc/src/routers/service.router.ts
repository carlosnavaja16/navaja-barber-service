import { FirestoreService } from '../services/firestore.service';
import { router } from '../utils/trpc.util';
import { procedure } from '../utils/trpc.util';

export const serviceRouter = router({
  getServices: procedure.query(async () => {
    return FirestoreService.getServices();
  })
});

export type ServiceRouter = typeof serviceRouter;
