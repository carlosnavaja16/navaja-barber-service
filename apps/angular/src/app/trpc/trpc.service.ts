import { environment } from '@src/environments/environment';
import type { MainRouter } from '@navaja/trpc';
import {
  CreateTRPCProxyClient,
  createTRPCProxyClient,
  httpBatchLink
} from '@trpc/client';
import superjson from 'superjson';
import { Injectable } from '@angular/core';
import { LOCAL_HOST, TRPC_ENDPOINT, TRPC_PORT } from '@navaja/shared';
import { UserService } from '../user/user.service';


@Injectable({
  providedIn: 'root'
})
export class TRPCService {
  client: CreateTRPCProxyClient<MainRouter>;

  constructor(
    private readonly userService: UserService
  ) {

    this.client = createTRPCProxyClient<MainRouter>({
      links: [
        httpBatchLink({
          url: `${this.getTRPCHost()}:${TRPC_PORT}/${TRPC_ENDPOINT}`,
          headers: () => {
            return {
              Authorization: this.userService.userToken()
            };
          }
        })
      ],
      transformer: superjson
    });
  }

  getTRPCHost = () => (environment.production ? '' : LOCAL_HOST);
}
