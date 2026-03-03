import { IOrder, IOrderAddress } from '../models/Order.js';
export declare function createOrder(userId: string, address: IOrderAddress): Promise<{
    order: {
        _id: string;
        totalAmount: number;
        status: string;
    };
    message: string;
}>;
export declare function getMyOrders(userId: string): Promise<IOrder[]>;
export declare function getOrderById(orderId: string, userId: string): Promise<unknown>;
export declare function listAdminOrders(params: {
    limit: number;
    skip: number;
    status?: string;
}): Promise<{
    orders: IOrder[];
    total: number;
}>;
export declare function getAdminOrderById(orderId: string): Promise<IOrder>;
export declare function updateOrderStatus(orderId: string, status: IOrder['status']): Promise<IOrder>;
