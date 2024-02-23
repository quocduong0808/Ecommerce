import { Schema, model } from 'mongoose';
import { AppConst } from '../commons/constans';

const keyStoreSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'Shop',
    },
    privateKey: {
      type: String,
      require: true,
    },
    publicKey: {
      type: String,
      require: true,
    },
    refreshTokens: {
      type: Array,
      default: [],
      require: true,
    },
  },
  {
    timestamps: true,
    collection: AppConst.MONGO_MODEL.COLLECTION.KEY_STORE,
  }
);

const keyModel = model(AppConst.MONGO_MODEL.DOCUMENT.KEY_STORE, keyStoreSchema);

export { keyModel };
