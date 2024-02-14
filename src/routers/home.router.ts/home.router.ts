import { Router } from 'express';
import RouterBase from '../../commons/router.base';
import { homeController } from '../../controllers/home/home.controller';
import { getBeanContext } from '../../commons/app.context';
import { asyncHandle } from '../../commons/error.handler';

class HomeRouter extends RouterBase {
  getName(): string {
    return 'HomeRouter';
  }
  constructor() {
    super();
  }
  config(router: Router): void {
    router.get('/home', asyncHandle(homeController.home));
    router.post('/signup', asyncHandle(homeController.signup));
  }
}

const homeRouter = getBeanContext<HomeRouter>(
  HomeRouter,
  () => new HomeRouter()
);
export { homeRouter };
