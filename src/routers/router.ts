import { Router } from 'express';
import RouterBase from '../commons/router.base';
import { homeRouter } from './home/home.router';
import { getBeanContext } from '../commons/app.context';
import { asyncHandle } from '../commons/error.handler';
import { apiKeyAuth } from '../auth/apikey.auth';
import { shopRouter } from './shop/shop.router';

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
    router.use('/api/v1', homeRouter.getRouter(), shopRouter.getRouter());
  }
}

const rootRouter = getBeanContext<RootRouter>(
  RootRouter,
  () => new RootRouter()
);
export { rootRouter };
