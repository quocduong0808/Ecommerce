import mongoose from 'mongoose';
import { NameClass, getBeanContext } from '../commons/app.context';
import { keyModel } from '../models/keystore.model';

class KeyTokenRepo implements NameClass {
  getName(): string {
    return 'KeyTokenRepo';
  }
  public async createToken(
    user: string,
    publicKey: string,
    session?: mongoose.ClientSession
  ) {
    return await keyModel.create(
      {
        user: user,
        publicKey: publicKey,
      },
      { session: [session] }
    );
  }
}

const keyTokenRepo = getBeanContext<KeyTokenRepo>(
  KeyTokenRepo,
  () => new KeyTokenRepo()
);
export { keyTokenRepo };
