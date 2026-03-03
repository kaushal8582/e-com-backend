"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentSchema = exports.createRazorpayOrderSchema = void 0;
const zod_1 = require("zod");
exports.createRazorpayOrderSchema = zod_1.z.object({
    orderId: zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid order ID'),
});
exports.verifyPaymentSchema = zod_1.z.object({
    razorpay_payment_id: zod_1.z.string().min(1, 'Payment ID is required'),
    razorpay_order_id: zod_1.z.string().min(1, 'Order ID is required'),
    razorpay_signature: zod_1.z.string().min(1, 'Signature is required'),
});
