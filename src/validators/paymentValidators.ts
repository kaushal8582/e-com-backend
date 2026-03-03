import { z } from 'zod';

export const createRazorpayOrderSchema = z.object({
  orderId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid order ID'),
});

export const verifyPaymentSchema = z.object({
  razorpay_payment_id: z.string().min(1, 'Payment ID is required'),
  razorpay_order_id: z.string().min(1, 'Order ID is required'),
  razorpay_signature: z.string().min(1, 'Signature is required'),
});

export type CreateRazorpayOrderBody = z.infer<typeof createRazorpayOrderSchema>;
export type VerifyPaymentBody = z.infer<typeof verifyPaymentSchema>;
