import { environment } from '@src/environments/environment';
import type { BarberServiceRouter } from '../../../../trpc/src/router';
import {
  CreateTRPCProxyClient,
  createTRPCProxyClient,
  httpBatchLink
} from '@trpc/client';
import { TRPC_SERVER_PORT } from '@shared/constants';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TRPCService {
  client: CreateTRPCProxyClient<BarberServiceRouter>;

  constructor() {
    this.client = createTRPCProxyClient<BarberServiceRouter>({
      links: [
        httpBatchLink({
          url: `${this.getTRPCHost()}:${TRPC_SERVER_PORT}/trpc`
        })
      ]
    });
  }

  getTRPCHost = () => (environment.production ? '' : 'http://localhost');
}
