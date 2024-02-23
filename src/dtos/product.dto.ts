import { ClientSession, Types } from 'mongoose';
import { productRepo } from '../repos/product.repo';

export interface IProduct {
  _id?: string | Types.ObjectId | null;
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  quantity?: number;
  attributes?: unknown;
  images?: Array<string>;
  shop?: string | Types.ObjectId | null;
}

export class Product {
  constructor(public produc: IProduct) {}
  public async createProd(session?: ClientSession) {
    return await productRepo.create(this.produc, session);
  }
}
