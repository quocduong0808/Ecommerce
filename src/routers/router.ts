import { Router } from 'express';
import RouterBase from '../commons/router.base';
import { homeRouter } from './home.router.ts/home.router';
import { getBeanContext } from '../commons/app.context';
import { asyncHandle } from '../commons/error.handler';
import { apiKeyAuth } from '../auth/apikey.auth';

class RootRouter extends RouterBase {
  getName(): string {
    return 'RootRouter';
  }
  constructor() {
    super();
  }
  config(router: Router): void {
    router.use(asyncHandle(apiKeyAuth.apiKey));
    router.use(apiKeyAuth.permission('0000'));
    router.use('/api/v1', homeRouter.getRouter());
  }
}

const rootRouter = getBeanContext<RootRouter>(
  RootRouter,
  () => new RootRouter()
);
export { rootRouter };
