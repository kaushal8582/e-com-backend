import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
/**
 * Payment-ready placeholder. Integrate Stripe/Razorpay etc. later.
 * Flow: create order → createPaymentIntent(orderId) → client pays → verifyPayment(payload) → update order.
 */
export declare function createPaymentIntent(req: AuthRequest, res: Response): Promise<void>;
export declare function verifyPayment(req: AuthRequest, res: Response): Promise<void>;
