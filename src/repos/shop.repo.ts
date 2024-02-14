import mongoose from 'mongoose';
import { NameClass, getBeanContext } from '../commons/app.context';
import { shop } from '../models/user.model';

class ShopRepo implements NameClass {
  getName(): string {
    return 'ShopRepo';
  }

  public async findOneByNameAndEmail(name: string, email: string) {
    return await shop.findOne({ name: name, email: email }).lean();
  }

  public async findOneAndUpdate(
    email: string,
    name: string,
    password: string,
    roles: Array<string>,
    session?: mongoose.ClientSession
  ) {
    return await shop
      .findOneAndUpdate(
        { email: email },
        {
          $set: {
            name: name,
            email: email,
            password: password,
            roles: [...roles],
          },
        },
        { upsert: true, new: true, session }
      )
      .lean();
  }
}

const shopRepo = getBeanContext<ShopRepo>(ShopRepo, () => new ShopRepo());
export { shopRepo };
