import { Response } from 'express';
import * as cartService from '../services/cartService.js';
import { AuthRequest } from '../middleware/auth.js';
import { AddCartItemBody, UpdateCartItemBody } from '../validators/cartValidators.js';

export async function getCart(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.tokenPayload!.userId;
  const cart = await cartService.getCart(userId);
  res.json({ success: true, data: cart || { items: [], updatedAt: new Date() } });
}

export async function addItem(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.tokenPayload!.userId;
  const { productId, qty } = req.body as AddCartItemBody;
  try {
    const cart = await cartService.addItem(userId, productId, qty);
    res.json({ success: true, data: cart });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to add item';
    res.status(400).json({ success: false, message });
  }
}

export async function updateItem(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.tokenPayload!.userId;
  const { productId } = req.params;
  const { qty } = req.body as UpdateCartItemBody;
  try {
    const cart = await cartService.updateItemQty(userId, productId, qty);
    res.json({ success: true, data: cart });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update item';
    res.status(400).json({ success: false, message });
  }
}

export async function removeItem(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.tokenPayload!.userId;
  const { productId } = req.params;
  const cart = await cartService.removeItem(userId, productId);
  res.json({ success: true, data: cart });
}

export async function syncCart(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.tokenPayload!.userId;
  const items = (req.body as { items: { productId: string; qty: number }[] }).items || [];
  try {
    const cart = await cartService.setCartFromGuestItems(userId, items);
    res.json({ success: true, data: cart });
  } catch {
    res.status(400).json({ success: false, message: 'Invalid cart items' });
  }
}
