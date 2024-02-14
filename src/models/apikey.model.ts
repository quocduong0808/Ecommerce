import { Schema, model } from 'mongoose';
import { AppConst } from '../commons/constans';

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      require: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      require: true,
      enum: ['0000', '1111', '2222'],
    },
  },
  { timestamps: true, collection: AppConst.MONGO_MODEL.COLLECTION.API_KEY }
);

const apiKeyModel = model(AppConst.MONGO_MODEL.DOCUMENT.API_KEY, apiKeySchema);

export { apiKeyModel };
