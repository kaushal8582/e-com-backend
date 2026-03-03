import { IOrder } from '../models/Order.js';
export declare function createOrder(data: Partial<IOrder>): Promise<IOrder>;
export declare function findOrdersByUserId(userId: string): Promise<IOrder[]>;
export declare function findOrderById(id: string): Promise<IOrder | null>;
export declare function findOrderByIdAndUserId(id: string, userId: string): Promise<IOrder | null>;
export interface ListOrdersParams {
    limit: number;
    skip: number;
    status?: string;
}
export declare function listAdminOrders(params: ListOrdersParams): Promise<{
    orders: IOrder[];
    total: number;
}>;
export declare function updateOrderStatus(id: string, status: IOrder['status']): Promise<IOrder | null>;
export declare function findOrderByRazorpayOrderId(razorpayOrderId: string): Promise<IOrder | null>;
export declare function updateOrderPayment(orderId: string, data: {
    paymentStatus: IOrder['paymentStatus'];
    paymentId?: string;
    paymentProvider?: string;
    razorpayOrderId?: string;
}): Promise<IOrder | null>;
