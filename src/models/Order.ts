import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IOrderItem {
  productId: Types.ObjectId;
  titleSnapshot: string;
  priceSnapshot: number;
  qty: number;
  imageSnapshot?: string;
  slugSnapshot?: string;
}

export interface IOrderAddress {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  pincode: string;
}

export type OrderStatus = 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'SIMULATED';

export interface IOrder extends Document {
  userId: Types.ObjectId;
  items: IOrderItem[];
  address: IOrderAddress;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentProvider?: string;
  paymentId?: string;
  razorpayOrderId?: string;
  createdAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    titleSnapshot: { type: String, required: true },
    priceSnapshot: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1 },
    imageSnapshot: { type: String },
    slugSnapshot: { type: String },
  },
  { _id: false }
);

const orderAddressSchema = new Schema<IOrderAddress>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    address: { type: orderAddressSchema, required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], default: 'PLACED' },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'SIMULATED'], default: 'PENDING' },
    paymentProvider: { type: String },
    paymentId: { type: String },
    razorpayOrderId: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false, versionKey: false }
);

orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export const Order: Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema);
