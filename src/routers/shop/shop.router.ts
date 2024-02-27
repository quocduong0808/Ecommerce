import { Router } from 'express';
import RouterBase from '../../commons/router.base';
import { getBeanContext } from '../../commons/app.context';
import { asyncHandle } from '../../commons/error.handler';
import { shopController } from '../../controllers/shop/shop.controller';

class ShopRouter extends RouterBase {
  getName(): string {
    return 'ShopRouter';
  }
  constructor() {
    super();
  }
  config(router: Router): void {
    router.post(
      '/shop/createProduct',
      asyncHandle(shopController.createProduct)
    );
    router.post(
      '/shop/getDraftProds',
      asyncHandle(shopController.getDraftProds)
    );
  }
}

const shopRouter = getBeanContext<ShopRouter>(
  ShopRouter,
  () => new ShopRouter()
);
export { shopRouter };
