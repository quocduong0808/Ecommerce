import { Router } from 'express';
import RouterBase from '../../commons/router.base';
import { getBeanContext } from '../../commons/app.context';
import { asyncHandle } from '../../commons/error.handler';
import { authUtil } from '../../auth/auth.util';
import { shopController } from '../../controllers/shop/shop.controller';

class ShopRouter extends RouterBase {
  getName(): string {
    return 'ShopRouter';
  }
  constructor() {
    super();
  }
  config(router: Router): void {
    router.use(authUtil.authentication);
    router.post(
      '/shop/createProduct',
      asyncHandle(shopController.createProduct)
    );
  }
}

const shopRouter = getBeanContext<ShopRouter>(
  ShopRouter,
  () => new ShopRouter()
);
export { shopRouter };
