import { Schema, model } from 'mongoose';
import { AppConst } from '../commons/constans';

const productSchema = new Schema(
  {
    shop: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'Shop',
    },
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    images: {
      type: Array,
    },
    attributes: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    collection: AppConst.MONGO_MODEL.COLLECTION.PRODUCT,
  }
);
const productModel = model(
  AppConst.MONGO_MODEL.DOCUMENT.PRODUCT,
  productSchema
);

export { productModel };
