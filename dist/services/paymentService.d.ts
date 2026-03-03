export declare function createRazorpayOrderForOrder(orderId: string, userId: string): Promise<{
    razorpayOrderId: string;
    amount: number;
    currency: string;
    key: string | undefined;
}>;
export declare function verifyAndCompletePayment(razorpayPaymentId: string, razorpayOrderId: string, signature: string): Promise<import("../models/Order.js").IOrder | null>;
