import { IProduct } from '../models/Product.js';
export interface ListProductsParams {
    limit: number;
    skip: number;
    search?: string;
    category?: string;
    includeDeleted?: boolean;
}
export declare function listProducts(params: ListProductsParams): Promise<{
    products: IProduct[];
    total: number;
}>;
export declare function findBySlug(slug: string): Promise<IProduct | null>;
export declare function findById(id: string): Promise<IProduct | null>;
export declare function createProduct(data: Partial<IProduct>): Promise<IProduct>;
export declare function updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct | null>;
export declare function softDeleteProduct(id: string): Promise<IProduct | null>;
export declare function listAdminProducts(params: ListProductsParams): Promise<{
    products: IProduct[];
    total: number;
}>;
