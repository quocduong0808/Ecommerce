import { ClientSession } from 'mongoose';
import { NameClass, getBeanContext } from '../commons/app.context';
import { IProduct } from '../dtos/product.dto';
import { productModel } from '../models/product.model';

class ProductRepo implements NameClass {
  getName(): string {
    return 'ProductRepo';
  }
  public async create(product: IProduct, session?: ClientSession) {
    return await productModel.create([{ ...product }], { session });
  }
}

const productRepo = getBeanContext<ProductRepo>(
  ProductRepo,
  () => new ProductRepo()
);
export { productRepo };
