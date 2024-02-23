import { ClientSession, Types } from 'mongoose';
import { IProduct, Product } from './product.dto';
import { transactional } from '../dbs/trans.mongodb';
import { electronicRepo } from '../repos/electronic.repo';
import ApiError from '../commons/api.error';
import httpStatus from 'http-status';

export interface IElectronic {
  _id?: string | Types.ObjectId;
  brand?: string;
  model?: string;
  type?: string;
  shop?: string | Types.ObjectId | null;
}

export class Electronic extends Product {
  constructor(public electronic: IProduct) {
    super(electronic);
  }
  public async create(sessionIn?: ClientSession) {
    return await transactional.withTransaction(async (session) => {
      const el = Object.assign({}, this.electronic.attributes) as IElectronic;
      el.shop = this.electronic.shop;
      const result = await electronicRepo.create(el, session);
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
