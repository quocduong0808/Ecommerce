import { Schema, model } from 'mongoose';
import { AppConst } from '../commons/constans';

//Shop schema
const shopSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: AppConst.MONGO_MODEL.COLLECTION.SHOP,
  }
);

const shop = model(AppConst.MONGO_MODEL.DOCUMENT.SHOP, shopSchema);

export { shop };
