import { environment } from '@src/environments/environment';
import type { BarberServiceRouter } from '@tRPC/router';
import {
  CreateTRPCProxyClient,
  createTRPCProxyClient,
  httpBatchLink
} from '@trpc/client';
import { Injectable } from '@angular/core';
import { PORT } from '@tRPC/constants';
import { UserService } from '@app/user/user.service';
import superjson from 'superjson';

@Injectable({
  providedIn: 'root'
})
export class TRPCService {
  client: CreateTRPCProxyClient<BarberServiceRouter>;
  userToken: string | undefined = undefined;

  constructor(private readonly userService: UserService) {
    this.client = createTRPCProxyClient<BarberServiceRouter>({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${this.getTRPCHost()}:${PORT}/trpc`,
          headers: {
            Authorization: this.userService.getCurrUserToken()
          }
        })
      ]
    });
  }

  getTRPCHost = () => (environment.production ? '' : 'http://localhost');
}
