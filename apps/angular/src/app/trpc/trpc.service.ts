import { environment } from '@src/environments/environment';
import type { MainRouter } from '@navaja/trpc';
import {
  CreateTRPCProxyClient,
  createTRPCProxyClient,
  httpBatchLink
} from '@trpc/client';
import { Injectable, Signal } from '@angular/core';
import { LOCAL_HOST, TRPC_ENDPOINT, TRPC_PORT } from '@navaja/shared';
import superjson from 'superjson';
import { Store } from '@ngrx/store';
import * as UserSelectors from '@src/app/user/state/user.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class TRPCService {
  client: CreateTRPCProxyClient<MainRouter>;
  userToken: Signal<string | undefined>;

  constructor(private readonly store: Store) {
    this.userToken = toSignal(this.store.select(UserSelectors.getUserToken), {
      initialValue: undefined
    });
    this.client = createTRPCProxyClient<MainRouter>({
      links: [
        httpBatchLink({
          url: `${this.getTRPCHost()}:${TRPC_PORT}/${TRPC_ENDPOINT}`,
          headers: () => {
            return {
              Authorization: this.userToken()
            };
          }
        })
      ],
      transformer: superjson
    });
  }

  getTRPCHost = () => (environment.production ? '' : LOCAL_HOST);
}
