import { Schema, model } from 'mongoose';
import { AppConst } from '../commons/constans';

const clothingSchema = new Schema(
  {
    shop: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'Shop',
    },
    brand: {
      type: String,
      require: true,
    },
    size: {
      type: Array,
      default: [],
    },
    style: {
      type: String,
      require: true,
    },
    color: {
      type: Array,
      default: [],
    },
    material: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unisex'],
      require: true,
    },
  },
  {
    timestamps: true,
    collection: AppConst.MONGO_MODEL.COLLECTION.CLOTHING,
  }
);
const clothingModel = model(
  AppConst.MONGO_MODEL.DOCUMENT.CLOTHING,
  clothingSchema
);
export { clothingModel };
