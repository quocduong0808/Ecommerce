import { ClientSession } from 'mongoose';
import { Clothing } from '../dtos/clothing.dto';
import { IProduct } from '../dtos/product.dto';
import ApiError from './api.error';
import httpStatus from 'http-status';
import { AppConst } from './constans';
import { Electronic } from '../dtos/electronic.dto';
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

export class ProductFactory {
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
