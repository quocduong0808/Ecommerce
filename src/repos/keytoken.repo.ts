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
    privateKey?: string,
    refreshTokenNew?: string,
    refreshTokenOld?: string,
    session?: mongoose.ClientSession
  ) {
    let result;
    const filter: IKeyStore = { user };
    const newKey: IKeyStore = { user };
    publicKey ? (newKey.publicKey = publicKey) : undefined;
    publicKey ? (newKey.privateKey = privateKey) : undefined;
    if (refreshTokenOld) {
      const clObj = Object.assign({}, newKey);
      clObj.$pull = { refreshTokens: refreshTokenOld };
      //remove old token
      result = await keyModel.findOneAndUpdate(filter, clObj, {
        upsert: true,
        session,
      });
    }
    if (refreshTokenNew) {
      newKey.$addToSet = { refreshTokens: refreshTokenNew };
      result = await keyModel.findOneAndUpdate(filter, newKey, {
        upsert: true,
        new: true,
        session,
      });
    }
    return result;
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
