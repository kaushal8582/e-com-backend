import { Response } from 'express';
import * as orderService from '../services/orderService.js';
import { AuthRequest } from '../middleware/auth.js';
import { CreateOrderBody } from '../validators/orderValidators.js';

export async function createOrder(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.tokenPayload!.userId;
  const { address } = req.body as CreateOrderBody;
  try {
    const result = await orderService.createOrder(userId, address);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create order';
    res.status(400).json({ success: false, message });
  }
}

export async function getMyOrders(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.tokenPayload!.userId;
  const orders = await orderService.getMyOrders(userId);
  res.json({ success: true, data: orders });
}

export async function getOrderById(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.tokenPayload!.userId;
  const { id } = req.params;
  try {
    const order = await orderService.getOrderById(id, userId);
    res.json({ success: true, data: order });
  } catch {
    res.status(404).json({ success: false, message: 'Order not found' });
  }
}
