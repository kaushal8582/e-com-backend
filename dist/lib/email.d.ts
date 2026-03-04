import type { IOrder } from '../models/Order.js';
export declare function sendLoginNotification(toEmail: string, userName: string, loginAt: Date): Promise<void>;
export declare function sendPasswordReset(toEmail: string, resetLink: string): Promise<void>;
export declare function sendOrderConfirmation(order: IOrder, userEmail: string): Promise<void>;
