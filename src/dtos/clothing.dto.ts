import { ClientSession, Types } from 'mongoose';
import { IProduct, Product } from './product.dto';
import { transactional } from '../dbs/trans.mongodb';
import { clothingRepo } from '../repos/clothing.repo';
import ApiError from '../commons/api.error';
import httpStatus from 'http-status';

export interface IClothing {
  _id?: string | Types.ObjectId;
  brand?: string;
  size?: string; // small, medium, large, etc.
  color?: string;
  material?: string;
  style?: string; // casual, formal, sportswear, etc.
  gender?: string; // male, female, unisex, etc.\
  shop?: string | Types.ObjectId | null;
}
export class Clothing extends Product {
  constructor(public clothing: IProduct) {
    super(clothing);
  }
  public async create(sessionIn?: ClientSession) {
    return await transactional.withTransaction(async (session) => {
      const clo = Object.assign({}, this.clothing.attributes) as IClothing;
      clo.shop = this.clothing.shop;
      const result = await clothingRepo.create(clo, session);
      if (!result || !result[0])
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
        );
      this.produc._id = result[0]._id?.toString();
      return (await this.createProd(session)) || {};
    }, sessionIn);
  }
}
