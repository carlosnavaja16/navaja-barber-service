import { environment } from '@src/environments/environment';
import type { BarberServiceRouter } from '@tRPC/router';
import {
  CreateTRPCProxyClient,
  createTRPCProxyClient,
  httpBatchLink
} from '@trpc/client';
import { Injectable, Signal } from '@angular/core';
import { PORT } from '@tRPC/constants';
import superjson from 'superjson';
import { Store } from '@ngrx/store';
import * as UserSelectors from '@src/app/user/state/user.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class TRPCService {
  client: CreateTRPCProxyClient<BarberServiceRouter>;
  userToken: Signal<string | undefined>;

  constructor(private readonly store: Store) {
    this.userToken = toSignal(this.store.select(UserSelectors.getUserToken), {
      initialValue: undefined
    });
    this.client = createTRPCProxyClient<BarberServiceRouter>({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${this.getTRPCHost()}:${PORT}/trpc`,
          headers: () => {
            return { Authorization: this.userToken() };
          }
        })
      ]
    });
  }

  getTRPCHost = () => (environment.production ? '' : 'http://localhost');
}
