import * as orderRepo from '../repositories/orderRepository.js';
import { createRazorpayOrder, verifyRazorpaySignature, getRazorpayKeyId } from '../utils/razorpayClient.js';
import { Types } from 'mongoose';

export async function createRazorpayOrderForOrder(orderId: string, userId: string) {
  const order = await orderRepo.findOrderByIdAndUserId(orderId, userId);
  if (!order) throw new Error('Order not found');
  if (order.paymentStatus !== 'PENDING') {
    throw new Error('Order is already paid or not eligible for payment');
  }
  if (order.razorpayOrderId) {
    return {
      razorpayOrderId: order.razorpayOrderId,
      amount: Math.round(order.totalAmount * 100),
      currency: 'INR',
      key: getRazorpayKeyId(),
    };
  }
  const razorpayOrder = await createRazorpayOrder(
    order.totalAmount,
    orderId,
    'INR'
  );
  await orderRepo.updateOrderPayment(orderId, {
    razorpayOrderId: razorpayOrder.id,
  });
  return {
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key: getRazorpayKeyId(),
  };
}

export async function verifyAndCompletePayment(
  razorpayPaymentId: string,
  razorpayOrderId: string,
  signature: string
) {
  const order = await orderRepo.findOrderByRazorpayOrderId(razorpayOrderId);
  if (!order) throw new Error('Order not found');
  if (order.paymentStatus === 'PAID') {
    return order;
  }
  const valid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, signature);
  if (!valid) throw new Error('Invalid payment signature');
  const updated = await orderRepo.updateOrderPayment(order._id.toString(), {
    paymentStatus: 'PAID',
    paymentId: razorpayPaymentId,
    paymentProvider: 'razorpay',
  });
  return updated;
}
