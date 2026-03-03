import { Document, Model } from 'mongoose';
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
export declare const Product: Model<IProduct>;
