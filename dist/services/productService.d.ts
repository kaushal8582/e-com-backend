import { IProduct } from '../models/Product.js';
export declare function listPublic(params: {
    limit: number;
    skip: number;
    search?: string;
    category?: string;
}): Promise<{
    products: IProduct[];
    total: number;
}>;
export declare function getBySlug(slug: string): Promise<IProduct | null>;
export declare function listAdmin(params: {
    limit: number;
    skip: number;
    search?: string;
    category?: string;
}): Promise<{
    products: IProduct[];
    total: number;
}>;
export declare function createProduct(data: {
    title: string;
    slug: string;
    description?: string;
    price: number;
    discountPrice?: number;
    category: string;
    stock: number;
    images?: {
        url: string;
        publicId: string;
    }[];
    specs?: Record<string, string>;
    isActive?: boolean;
}): Promise<IProduct>;
export declare function updateProduct(id: string, data: Partial<{
    title: string;
    slug: string;
    description: string;
    price: number;
    discountPrice: number;
    category: string;
    stock: number;
    images: {
        url: string;
        publicId: string;
    }[];
    specs: Record<string, string>;
    isActive: boolean;
}>): Promise<IProduct | null>;
export declare function softDeleteProduct(id: string): Promise<IProduct | null>;
export declare function getById(id: string): Promise<IProduct | null>;
