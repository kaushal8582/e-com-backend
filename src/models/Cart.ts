import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICartItem {
  productId: Types.ObjectId;
  qty: number;
  priceSnapshot: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 1 },
    priceSnapshot: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const cartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: false, versionKey: false }
);

export const Cart: Model<ICart> = mongoose.model<ICart>('Cart', cartSchema);
