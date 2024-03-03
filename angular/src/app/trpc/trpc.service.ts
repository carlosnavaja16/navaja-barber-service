import { environment } from '@src/environments/environment';
import type { BarberServiceRouter } from '@tRPC/router';
import {
  CreateTRPCProxyClient,
  createTRPCProxyClient,
  httpBatchLink
} from '@trpc/client';
import { Injectable } from '@angular/core';
import { PORT } from '@tRPC/constants';

@Injectable({
  providedIn: 'root'
})
export class TRPCService {
  client: CreateTRPCProxyClient<BarberServiceRouter>;

  constructor() {
    this.client = createTRPCProxyClient<BarberServiceRouter>({
      links: [
        httpBatchLink({
          url: `${this.getTRPCHost()}:${PORT}/trpc`
        })
      ]
    });
  }

  getTRPCHost = () => (environment.production ? '' : 'http://localhost');
}
