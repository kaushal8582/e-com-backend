import { Cart, ICart, ICartItem } from '../models/Cart.js';
import { Types } from 'mongoose';

export async function findByUserId(userId: string): Promise<ICart | null> {
  return Cart.findOne({ userId: new Types.ObjectId(userId) }).populate('items.productId').exec();
}

export async function findCartByUserId(userId: string): Promise<ICart | null> {
  return Cart.findOne({ userId: new Types.ObjectId(userId) }).exec();
}

export async function createCart(userId: string, items: ICartItem[]): Promise<ICart> {
  const cart = new Cart({ userId: new Types.ObjectId(userId), items, updatedAt: new Date() });
  return cart.save();
}

export async function updateCartItems(userId: string, items: ICartItem[]): Promise<ICart | null> {
  return Cart.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    { $set: { items, updatedAt: new Date() } },
    { new: true }
  ).exec();
}

export async function addOrUpdateItem(userId: string, productId: string, qty: number, priceSnapshot: number): Promise<ICart | null> {
  const cart = await Cart.findOne({ userId: new Types.ObjectId(userId) }).exec();
  if (!cart) return null;

  const existing = cart.items.find((i) => i.productId.toString() === productId);
  if (existing) {
    existing.qty = qty;
    existing.priceSnapshot = priceSnapshot;
  } else {
    cart.items.push({
      productId: new Types.ObjectId(productId),
      qty,
      priceSnapshot,
    });
  }
  cart.updatedAt = new Date();
  return cart.save();
}

export async function removeItem(userId: string, productId: string): Promise<ICart | null> {
  return Cart.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    { $pull: { items: { productId: new Types.ObjectId(productId) } }, $set: { updatedAt: new Date() } },
    { new: true }
  ).exec();
}

export async function updateItemQty(userId: string, productId: string, qty: number): Promise<ICart | null> {
  const cart = await Cart.findOne({ userId: new Types.ObjectId(userId) }).exec();
  if (!cart) return null;
  const item = cart.items.find((i) => i.productId.toString() === productId);
  if (!item) return cart;
  if (qty <= 0) {
    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
  } else {
    item.qty = qty;
  }
  cart.updatedAt = new Date();
  return cart.save();
}
