import { Schema, model } from 'mongoose';
import { AppConst } from '../commons/constans';
import slugify from 'slugify';

const productSchema = new Schema(
  {
    shop: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: AppConst.MONGO_MODEL.DOCUMENT.SHOP,
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
    slug: {
      type: String,
      require: true,
    },
    ratingAvg: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be greater than 0'],
      max: [5, 'Rating must be less or equal 5'],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    variations: {
      type: Array,
      default: [],
    },
    isDraff: {
      type: Boolean,
      default: true,
      select: false,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
      select: false,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: AppConst.MONGO_MODEL.COLLECTION.PRODUCT,
  }
);
//hook to before execute query
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name || '', { lower: true });
  next();
});
const productModel = model(
  AppConst.MONGO_MODEL.DOCUMENT.PRODUCT,
  productSchema
);

export { productModel };
