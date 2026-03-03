import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import * as paymentService from '../services/paymentService.js';
import { VerifyPaymentBody } from '../validators/paymentValidators.js';

export async function createRazorpayOrder(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.tokenPayload?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    const { orderId } = req.body as { orderId: string };
    const data = await paymentService.createRazorpayOrderForOrder(orderId, userId);
    res.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create payment order';
    res.status(400).json({ success: false, message });
  }
}

export async function verifyPayment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const body = req.body as VerifyPaymentBody;
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;
    const order = await paymentService.verifyAndCompletePayment(
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    );
    res.json({ success: true, message: 'Payment verified', data: { orderId: order?._id?.toString() } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Payment verification failed';
    res.status(400).json({ success: false, message });
  }
}
