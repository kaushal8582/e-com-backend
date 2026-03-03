"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentIntent = createPaymentIntent;
exports.verifyPayment = verifyPayment;
/**
 * Payment-ready placeholder. Integrate Stripe/Razorpay etc. later.
 * Flow: create order → createPaymentIntent(orderId) → client pays → verifyPayment(payload) → update order.
 */
async function createPaymentIntent(req, res) {
    res.status(501).json({
        success: false,
        message: 'Payment not integrated yet. Use this endpoint later to create a payment intent for the order.',
        placeholder: { orderId: req.params?.orderId },
    });
}
async function verifyPayment(req, res) {
    res.status(501).json({
        success: false,
        message: 'Payment verification not integrated yet. Use this endpoint after payment to verify and update order.',
        placeholder: { payload: req.body },
    });
}
