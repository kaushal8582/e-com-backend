import { Document, Model, Types } from 'mongoose';
export interface IOrderItem {
    productId: Types.ObjectId;
    titleSnapshot: string;
    priceSnapshot: number;
    qty: number;
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
    createdAt: Date;
}
export declare const Order: Model<IOrder>;
