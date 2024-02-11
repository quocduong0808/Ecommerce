import { Router } from 'express';
import RouterBase from '../../commons/router.base';
import { homeController } from '../../controllers/home/home.controller';
import { getBeanContext } from '../../commons/app.context';

class HomeRouter extends RouterBase {
  getName(): string {
    return 'HomeRouter';
  }
  constructor() {
    super();
  }
  config(router: Router): void {
    router.get('/home', homeController.home);
    router.post('/signup', homeController.signup);
  }
}

const homeRouter = getBeanContext<HomeRouter>(
  HomeRouter,
  () => new HomeRouter()
);
export { homeRouter };
