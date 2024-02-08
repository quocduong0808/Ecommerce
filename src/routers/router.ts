import { Router } from 'express';
import RouterBase from '../commons/router.base';
import { homeRouter } from './home.router.ts/home.router';
import { getBeanContext } from '../commons/AppContext';

class RootRouter extends RouterBase {
  getName(): string {
    return 'RootRouter';
  }
  constructor() {
    super();
  }
  config(router: Router): void {
    router.use('/api/v1', homeRouter.getRouter());
  }
}

const rootRouter = getBeanContext<RootRouter>(
  RootRouter,
  () => new RootRouter()
);
export { rootRouter };
