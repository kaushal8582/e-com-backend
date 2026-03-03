import { Types } from 'mongoose';
import * as cartRepo from '../repositories/cartRepository.js';
import * as productRepo from '../repositories/productRepository.js';
import { ICart, ICartItem } from '../models/Cart.js';

export async function getCart(userId: string): Promise<ICart | null> {
  return cartRepo.findByUserId(userId);
}

export async function addItem(userId: string, productId: string, qty: number): Promise<ICart | null> {
  const product = await productRepo.findById(productId);
  if (!product) throw new Error('Product not found');
  if (product.isDeleted || !product.isActive) throw new Error('Product not available');
  if (product.stock < qty) throw new Error('Insufficient stock');
  const price = product.discountPrice ?? product.price;

  let cart = await cartRepo.findCartByUserId(userId);
  if (!cart) {
    cart = await cartRepo.createCart(userId, [{ productId: product._id, qty, priceSnapshot: price }]);
  } else {
    cart = await cartRepo.addOrUpdateItem(userId, productId, qty, price);
  }
  return cartRepo.findByUserId(userId);
}

export async function updateItemQty(userId: string, productId: string, qty: number): Promise<ICart | null> {
  if (qty <= 0) {
    return cartRepo.removeItem(userId, productId);
  }
  const product = await productRepo.findById(productId);
  if (!product) throw new Error('Product not found');
  if (product.stock < qty) throw new Error('Insufficient stock');
  return cartRepo.updateItemQty(userId, productId, qty);
}

export async function removeItem(userId: string, productId: string): Promise<ICart | null> {
  return cartRepo.removeItem(userId, productId);
}

export async function setCartFromGuestItems(userId: string, items: { productId: string; qty: number }[]): Promise<ICart | null> {
  const validated: ICartItem[] = [];
  for (const { productId, qty } of items) {
    if (qty < 1) continue;
    const product = await productRepo.findById(productId);
    if (!product || product.isDeleted || !product.isActive || product.stock < qty) continue;
    validated.push({
      productId: new Types.ObjectId(productId),
      qty,
      priceSnapshot: product.discountPrice ?? product.price,
    });
  }
  await cartRepo.updateCartItems(userId, validated);
  return cartRepo.findByUserId(userId);
}
