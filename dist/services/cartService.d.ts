import { ICart } from '../models/Cart.js';
export declare function getCart(userId: string): Promise<ICart | null>;
export declare function addItem(userId: string, productId: string, qty: number): Promise<ICart | null>;
export declare function updateItemQty(userId: string, productId: string, qty: number): Promise<ICart | null>;
export declare function removeItem(userId: string, productId: string): Promise<ICart | null>;
export declare function setCartFromGuestItems(userId: string, items: {
    productId: string;
    qty: number;
}[]): Promise<ICart | null>;
