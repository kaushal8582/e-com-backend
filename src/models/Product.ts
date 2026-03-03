import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductImage {
  url: string;
  publicId: string;
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  stock: number;
  images: IProductImage[];
  specs: Record<string, string>;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
}

const productImageSchema = new Schema<IProductImage>(
  { url: { type: String, required: true }, publicId: { type: String, required: true } },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    category: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: { type: [productImageSchema], default: [] },
    specs: { type: Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false, versionKey: false }
);

productSchema.index({ slug: 1 });
productSchema.index({ category: 1, isActive: 1, isDeleted: 1 });

export const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);
