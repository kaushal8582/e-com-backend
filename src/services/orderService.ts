import * as orderRepo from '../repositories/orderRepository.js';
import * as cartRepo from '../repositories/cartRepository.js';
import * as productRepo from '../repositories/productRepository.js';
import { IOrder, IOrderAddress } from '../models/Order.js';

export async function createOrder(
  userId: string,
  address: IOrderAddress
): Promise<{ order: { _id: string; totalAmount: number; status: string }; message: string }> {
  const cart = await cartRepo.findCartByUserId(userId);
  if (!cart || !cart.items.length) {
    throw new Error('Cart is empty');
  }

  const orderItems: { productId: typeof cart.items[0]['productId']; titleSnapshot: string; priceSnapshot: number; qty: number; imageSnapshot?: string; slugSnapshot?: string }[] = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    const product = await productRepo.findById(item.productId.toString());
    if (!product || product.isDeleted || !product.isActive) {
      throw new Error(`Product ${item.productId} is no longer available`);
    }
    if (product.stock < item.qty) {
      throw new Error(`Insufficient stock for ${product.title}`);
    }
    const price = product.discountPrice ?? product.price;
    orderItems.push({
      productId: item.productId,
      titleSnapshot: product.title,
      priceSnapshot: price,
      qty: item.qty,
      imageSnapshot: product.images?.[0]?.url,
      slugSnapshot: product.slug,
    });
    totalAmount += price * item.qty;
  }

  const order = await orderRepo.createOrder({
    userId: cart.userId,
    items: orderItems,
    address,
    totalAmount,
    status: 'PLACED',
    paymentStatus: 'PENDING',
  });

  await cartRepo.updateCartItems(userId, []);

  return {
    order: {
      _id: order._id.toString(),
      totalAmount: order.totalAmount,
      status: order.status,
    },
    message: 'Order placed successfully',
  };
}

export async function getMyOrders(userId: string) {
  return orderRepo.findOrdersByUserId(userId);
}

export async function getOrderById(orderId: string, userId: string): Promise<unknown> {
  const order = await orderRepo.findOrderByIdAndUserId(orderId, userId);
  if (!order) throw new Error('Order not found');
  return order;
}

export async function listAdminOrders(params: { limit: number; skip: number; status?: string }) {
  return orderRepo.listAdminOrders(params);
}

export async function getAdminOrderById(orderId: string) {
  const order = await orderRepo.findOrderById(orderId);
  if (!order) throw new Error('Order not found');
  return order;
}

export async function updateOrderStatus(orderId: string, status: IOrder['status']) {
  const order = await orderRepo.updateOrderStatus(orderId, status);
  if (!order) throw new Error('Order not found');
  return order;
}
