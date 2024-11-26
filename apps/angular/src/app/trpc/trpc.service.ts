import { environment } from '@src/environments/environment';
import type { MainRouter } from '@navaja/trpc';
import { CreateTRPCClient, createTRPCClient, httpLink } from '@trpc/client';
import superjson from 'superjson';
import { Injectable } from '@angular/core';
import { LOCAL_HOST, TRPC_ENDPOINT, TRPC_PORT } from '@navaja/shared';
import { Auth } from '@angular/fire/auth';
import { idToken } from 'rxfire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class TRPCService {
  client: CreateTRPCClient<MainRouter>;
  userToken = toSignal(idToken(this.auth));

  constructor(private readonly auth: Auth) {
    this.client = createTRPCClient<MainRouter>({
      links: [
        httpLink({
          url: `${this.getTRPCHost()}:${TRPC_PORT}/${TRPC_ENDPOINT}`,
          headers: () => {
            return { Authorization: this.userToken() ?? '' };
          },
          transformer: superjson
        })
      ]
    });
  }

  getTRPCHost = () => (environment.production ? '' : LOCAL_HOST);
}
