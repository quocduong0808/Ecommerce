import mongoose, { ClientSession, Types } from 'mongoose';
import { NameClass, getBeanContext } from '../commons/app.context';
import { keyModel } from '../models/keystore.model';
import { IKeyStore } from '../dtos/keystore.dto';

class KeyTokenRepo implements NameClass {
  getName(): string {
    return 'KeyTokenRepo';
  }
  public async createOrUpdate(
    user: string,
    publicKey?: string,
    refreshToken?: string,
    refreshTokensUsed?: Array<string>,
    session?: mongoose.ClientSession
  ) {
    const filter: IKeyStore = { user };
    const newKey: IKeyStore = { user };
    publicKey ? (newKey.publicKey = publicKey) : undefined;
    refreshToken ? (newKey.refreshToken = refreshToken) : undefined;
    refreshTokensUsed
      ? (newKey.refreshTokensUsed = refreshTokensUsed)
      : undefined;
    return await keyModel.findOneAndUpdate(filter, newKey, {
      upsert: true,
      new: true,
      session,
    });
  }
  public async findKeyById(id: string) {
    return keyModel.findById(id).lean();
  }
  public async findKeyByUserId(id: string) {
    return keyModel.findOne({ user: new Types.ObjectId(id) }).lean();
  }
  public async removeKeyByUserId(id: string, session: ClientSession) {
    return keyModel.findOneAndDelete(
      { user: new Types.ObjectId(id) },
      { session }
    );
  }
}

const keyTokenRepo = getBeanContext<KeyTokenRepo>(
  KeyTokenRepo,
  () => new KeyTokenRepo()
);
export { keyTokenRepo };
