import { Schema, model } from 'mongoose';
import { AppConst } from '../commons/constans';

const electronicSchema = new Schema(
  {
    shop: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: AppConst.MONGO_MODEL.DOCUMENT.SHOP,
    },
    brand: { type: String, require: true },
    model: { type: String, require: true },
    type: { type: String, require: true },
  },
  { timestamps: true, collection: AppConst.MONGO_MODEL.COLLECTION.ELECTRONIC }
);
const electronicModel = model(
  AppConst.MONGO_MODEL.DOCUMENT.ELECTRONIC,
  electronicSchema
);
export { electronicModel };
