import { Model, Schema } from 'mongoose';
import { AppConst } from '../commons/constans';

const keyStoreSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'Shop',
    },
    publicKey: {
      type: String,
      require: true,
    },
    refreshToken: {
      type: Array,
      require: true,
    },
  },
  {
    timestamps: true,
    collection: AppConst.MONGO_MODEL.COLLECTION.KEY_STORE,
  }
);

const keyModel = new Model(
  AppConst.MONGO_MODEL.DOCUMENT.KEY_STORE,
  keyStoreSchema
);

export { keyModel };
