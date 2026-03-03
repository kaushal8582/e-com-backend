"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getMyOrders = getMyOrders;
exports.getOrderById = getOrderById;
exports.listAdminOrders = listAdminOrders;
exports.getAdminOrderById = getAdminOrderById;
exports.updateOrderStatus = updateOrderStatus;
const orderRepo = __importStar(require("../repositories/orderRepository.js"));
const cartRepo = __importStar(require("../repositories/cartRepository.js"));
const productRepo = __importStar(require("../repositories/productRepository.js"));
async function createOrder(userId, address) {
    const cart = await cartRepo.findCartByUserId(userId);
    if (!cart || !cart.items.length) {
        throw new Error('Cart is empty');
    }
    const orderItems = [];
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
async function getMyOrders(userId) {
    return orderRepo.findOrdersByUserId(userId);
}
async function getOrderById(orderId, userId) {
    const order = await orderRepo.findOrderByIdAndUserId(orderId, userId);
    if (!order)
        throw new Error('Order not found');
    return order;
}
async function listAdminOrders(params) {
    return orderRepo.listAdminOrders(params);
}
async function getAdminOrderById(orderId) {
    const order = await orderRepo.findOrderById(orderId);
    if (!order)
        throw new Error('Order not found');
    return order;
}
async function updateOrderStatus(orderId, status) {
    const order = await orderRepo.updateOrderStatus(orderId, status);
    if (!order)
        throw new Error('Order not found');
    return order;
}
