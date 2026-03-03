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
exports.createRazorpayOrderForOrder = createRazorpayOrderForOrder;
exports.verifyAndCompletePayment = verifyAndCompletePayment;
const orderRepo = __importStar(require("../repositories/orderRepository.js"));
const razorpayClient_js_1 = require("../utils/razorpayClient.js");
async function createRazorpayOrderForOrder(orderId, userId) {
    const order = await orderRepo.findOrderByIdAndUserId(orderId, userId);
    if (!order)
        throw new Error('Order not found');
    if (order.paymentStatus !== 'PENDING') {
        throw new Error('Order is already paid or not eligible for payment');
    }
    if (order.razorpayOrderId) {
        return {
            razorpayOrderId: order.razorpayOrderId,
            amount: Math.round(order.totalAmount * 100),
            currency: 'INR',
            key: (0, razorpayClient_js_1.getRazorpayKeyId)(),
        };
    }
    const razorpayOrder = await (0, razorpayClient_js_1.createRazorpayOrder)(order.totalAmount, orderId, 'INR');
    await orderRepo.updateOrderPayment(orderId, {
        paymentStatus: 'PENDING',
        razorpayOrderId: razorpayOrder.id,
    });
    return {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: (0, razorpayClient_js_1.getRazorpayKeyId)(),
    };
}
async function verifyAndCompletePayment(razorpayPaymentId, razorpayOrderId, signature) {
    const order = await orderRepo.findOrderByRazorpayOrderId(razorpayOrderId);
    if (!order)
        throw new Error('Order not found');
    if (order.paymentStatus === 'PAID') {
        return order;
    }
    const valid = (0, razorpayClient_js_1.verifyRazorpaySignature)(razorpayOrderId, razorpayPaymentId, signature);
    if (!valid)
        throw new Error('Invalid payment signature');
    const updated = await orderRepo.updateOrderPayment(order._id.toString(), {
        paymentStatus: 'PAID',
        paymentId: razorpayPaymentId,
        paymentProvider: 'razorpay',
    });
    return updated;
}
