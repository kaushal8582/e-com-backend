import { z } from 'zod';
export declare const createRazorpayOrderSchema: z.ZodObject<{
    orderId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orderId: string;
}, {
    orderId: string;
}>;
export declare const verifyPaymentSchema: z.ZodObject<{
    razorpay_payment_id: z.ZodString;
    razorpay_order_id: z.ZodString;
    razorpay_signature: z.ZodString;
}, "strip", z.ZodTypeAny, {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}, {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}>;
export type CreateRazorpayOrderBody = z.infer<typeof createRazorpayOrderSchema>;
export type VerifyPaymentBody = z.infer<typeof verifyPaymentSchema>;
