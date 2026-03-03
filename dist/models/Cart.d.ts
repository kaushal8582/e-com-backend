import { Document, Model, Types } from 'mongoose';
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
export declare const Cart: Model<ICart>;
