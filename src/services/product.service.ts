import { NameClass, getBeanContext } from '../commons/app.context';
import { IProduct } from '../dtos/product.dto';
import { ClientSession } from 'mongoose';
import { Clothing } from '../dtos/clothing.dto';
import { Electronic } from '../dtos/electronic.dto';
import ApiError from '../commons/api.error';
import httpStatus from 'http-status';
import { AppConst } from '../commons/constans';
import { productRepo } from '../repos/product.repo';

type ProductType = {
  [propKey: string]: (
    value: IProduct,
    session?: ClientSession
  ) => Promise<object>;
};

const ProductTypeDefine: ProductType = {
  CLO: async (clothing: IProduct, session?: ClientSession) => {
    return await new Clothing(clothing).create(session);
  },
  ELE: async (electronic: IProduct, session?: ClientSession) => {
    return await new Electronic(electronic).create(session);
  },
};

class ProductFactory {
  public static async create(
    type: string,
    produc: IProduct,
    session?: ClientSession
  ) {
    const exe = ProductTypeDefine[type];
    if (!exe) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        AppConst.SHOP.PRODUCT_TYPE_ERROR
      );
    }
    return await exe(produc, session);
  }
}

class ProductService implements NameClass {
  getName(): string {
    return 'ProductService';
  }
  public async create(product: IProduct) {
    return await ProductFactory.create(product.category || '', product);
  }

  public async getAllDrafProd(userId: string) {
    const filter: IProduct = { shop: userId, isDraff: true };
    return productRepo.getProdByFilter(filter);
  }
}

const producService = getBeanContext<ProductService>(
  ProductService,
  () => new ProductService()
);
export { producService };
