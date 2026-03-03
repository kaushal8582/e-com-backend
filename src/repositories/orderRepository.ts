import { Order, IOrder } from '../models/Order.js';
import { Types } from 'mongoose';

export async function createOrder(data: Partial<IOrder>): Promise<IOrder> {
  const order = new Order(data);
  return order.save();
}

export async function findOrdersByUserId(userId: string): Promise<IOrder[]> {
  return Order.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec();
}

export async function findOrderById(id: string): Promise<IOrder | null> {
  return Order.findById(id).exec();
}

export async function findOrderByIdAndUserId(id: string, userId: string): Promise<IOrder | null> {
  return Order.findOne({ _id: id, userId: new Types.ObjectId(userId) }).exec();
}

export interface ListOrdersParams {
  limit: number;
  skip: number;
  status?: string;
}

export async function listAdminOrders(params: ListOrdersParams): Promise<{ orders: IOrder[]; total: number }> {
  const { limit, skip, status } = params;
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('userId', 'name email').lean().exec(),
    Order.countDocuments(filter),
  ]);

  return { orders: orders as unknown as IOrder[], total };
}

export async function updateOrderStatus(id: string, status: IOrder['status']): Promise<IOrder | null> {
  return Order.findByIdAndUpdate(id, { $set: { status } }, { new: true }).exec();
}

export async function findOrderByRazorpayOrderId(razorpayOrderId: string): Promise<IOrder | null> {
  return Order.findOne({ razorpayOrderId }).exec();
}

export async function updateOrderPayment(
  orderId: string,
  data: { paymentStatus: IOrder['paymentStatus']; paymentId?: string; paymentProvider?: string; razorpayOrderId?: string }
): Promise<IOrder | null> {
  return Order.findByIdAndUpdate(orderId, { $set: data }, { new: true }).exec();
}
