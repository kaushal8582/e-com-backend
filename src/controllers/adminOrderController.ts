import { Request, Response } from 'express';
import * as orderService from '../services/orderService.js';
import { OrdersQuery, UpdateOrderStatusBody } from '../validators/orderValidators.js';

export async function listOrders(req: Request, res: Response): Promise<void> {
  const { limit, skip, status } = (req as Request & { query: OrdersQuery }).query;
  const { orders, total } = await orderService.listAdminOrders({ limit, skip, status });
  res.json({ success: true, data: { orders, total } });
}

export async function getOrderById(req: Request, res: Response): Promise<void> {
  try {
    const order = await orderService.getAdminOrderById((req as Request & { params: { id: string } }).params.id);
    res.json({ success: true, data: order });
  } catch {
    res.status(404).json({ success: false, message: 'Order not found' });
  }
}

export async function updateOrderStatus(req: Request, res: Response): Promise<void> {
  try {
    const r = req as Request & { params: { id: string }; body: UpdateOrderStatusBody };
    const order = await orderService.updateOrderStatus(r.params.id, r.body.status);
    res.json({ success: true, data: order });
  } catch {
    res.status(404).json({ success: false, message: 'Order not found' });
  }
}
