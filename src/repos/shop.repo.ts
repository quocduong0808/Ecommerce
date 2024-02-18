import mongoose from 'mongoose';
import { NameClass, getBeanContext } from '../commons/app.context';
import { shop } from '../models/user.model';
import { IShop } from '../dtos/shop.dto';

class ShopRepo implements NameClass {
  getName(): string {
    return 'ShopRepo';
  }

  public async findOneByNameAndEmail(name: string, email: string) {
    return await shop.findOne({ name: name, email: email }).lean();
  }

  public async findOneAndUpdate(
    email: string,
    name?: string,
    password?: string,
    roles?: Array<string>,
    session?: mongoose.ClientSession
  ) {
    const filter: IShop = { email };
    const upObj: IShop = {
      name,
      email,
      password,
      roles,
    };
    return await shop
      .findOneAndUpdate(filter, upObj, { upsert: true, new: true, session })
      .lean();
  }
  public async findOneByEmail(email: string) {
    return await shop.findOne({ email: email }).lean();
  }
}

const shopRepo = getBeanContext<ShopRepo>(ShopRepo, () => new ShopRepo());
export { shopRepo };
