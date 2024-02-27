import { ClientSession } from 'mongoose';
import { NameClass, getBeanContext } from '../commons/app.context';
import { IProduct } from '../dtos/product.dto';
import { productModel } from '../models/product.model';
import { AppConst } from '../commons/constans';

class ProductRepo implements NameClass {
  getName(): string {
    return 'ProductRepo';
  }
  public async create(product: IProduct, session?: ClientSession) {
    return await productModel.create([{ ...product }], { session });
  }
  public async getProdByFilter(
    filter: IProduct,
    skip?: number,
    limit?: number
  ) {
    return await productModel
      .find(filter)
      .populate(AppConst.MONGO_MODEL.DOCUMENT.SHOP, 'name email -_id')
      .sort({ updatedAt: -1 })
      .skip(skip || 0)
      .limit(limit || 500)
      .lean()
      .exec();
  }
}

const productRepo = getBeanContext<ProductRepo>(
  ProductRepo,
  () => new ProductRepo()
);
export { productRepo };
