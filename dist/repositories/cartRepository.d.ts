import { ICart, ICartItem } from '../models/Cart.js';
export declare function findByUserId(userId: string): Promise<ICart | null>;
export declare function findCartByUserId(userId: string): Promise<ICart | null>;
export declare function createCart(userId: string, items: ICartItem[]): Promise<ICart>;
export declare function updateCartItems(userId: string, items: ICartItem[]): Promise<ICart | null>;
export declare function addOrUpdateItem(userId: string, productId: string, qty: number, priceSnapshot: number): Promise<ICart | null>;
export declare function removeItem(userId: string, productId: string): Promise<ICart | null>;
export declare function updateItemQty(userId: string, productId: string, qty: number): Promise<ICart | null>;
