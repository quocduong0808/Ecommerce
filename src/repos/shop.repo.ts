import { NameClass, getBeanContext } from '../commons/app.context';

class ShopRepo implements NameClass {
  getName(): string {
    return 'ShopRepo';
  }
}

const shopRepo = getBeanContext<ShopRepo>(ShopRepo, () => new ShopRepo());
export { shopRepo };
