import Razorpay from 'razorpay';
import crypto from 'crypto';

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

export function getRazorpayKeyId(): string | undefined {
  return keyId;
}

export function isRazorpayConfigured(): boolean {
  return Boolean(keyId && keySecret);
}

export function createRazorpayOrder(
  amountInRupees: number,
  receipt: string,
  currency = 'INR'
): Promise<{ id: string; amount: number; currency: string }> {
  if (!keyId || !keySecret) {
    throw new Error('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
  }
  const instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const amountPaise = Math.round(amountInRupees * 100);
  return instance.orders
    .create({
      amount: amountPaise,
      currency,
      receipt,
      notes: { orderId: receipt },
    })
    .then((order: { id: string; amount: number; currency: string }) => order);
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!keySecret) return false;
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
}
