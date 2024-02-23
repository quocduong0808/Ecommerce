import { NameClass, getBeanContext } from '../commons/app.context';
import { ProductFactory } from '../commons/product.factory';
import { IProduct } from '../dtos/product.dto';

class ProductService implements NameClass {
  getName(): string {
    return 'ProductService';
  }
  public async create(product: IProduct) {
    return await ProductFactory.create(product.category || '', product);
  }
}

const producService = getBeanContext<ProductService>(
  ProductService,
  () => new ProductService()
);
export { producService };
