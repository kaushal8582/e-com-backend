"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRazorpayKeyId = getRazorpayKeyId;
exports.isRazorpayConfigured = isRazorpayConfigured;
exports.createRazorpayOrder = createRazorpayOrder;
exports.verifyRazorpaySignature = verifyRazorpaySignature;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
function getRazorpayKeyId() {
    return keyId;
}
function isRazorpayConfigured() {
    return Boolean(keyId && keySecret);
}
function createRazorpayOrder(amountInRupees, receipt, currency = 'INR') {
    if (!keyId || !keySecret) {
        throw new Error('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
    }
    const instance = new razorpay_1.default({ key_id: keyId, key_secret: keySecret });
    const amountPaise = Math.round(amountInRupees * 100);
    return instance.orders
        .create({
        amount: amountPaise,
        currency,
        receipt,
        notes: { orderId: receipt },
    })
        .then((order) => order);
}
function verifyRazorpaySignature(orderId, paymentId, signature) {
    if (!keySecret)
        return false;
    const expected = crypto_1.default
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');
    return expected === signature;
}
