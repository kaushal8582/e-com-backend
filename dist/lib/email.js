"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLoginNotification = sendLoginNotification;
exports.sendPasswordReset = sendPasswordReset;
exports.sendOrderConfirmation = sendOrderConfirmation;
const RELAY_URL = 'https://relayserver-wheat.vercel.app/send-mail';
const MAIL_FROM = process.env.MAIL_FROM || 'noreply@modernriwaaz.com';
async function sendViaRelay(mailOptions) {
    try {
        const res = await fetch(RELAY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...mailOptions, from: mailOptions.from ?? MAIL_FROM }),
        });
        if (!res.ok)
            console.error('[email] relay failed', res.status);
    }
    catch (err) {
        console.error('[email] send failed', err);
    }
}
async function sendLoginNotification(toEmail, userName, loginAt) {
    const formatted = loginAt.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
    const html = `<p>Hi ${userName},</p><p>You logged in to Modern Riwaaz at <strong>${formatted}</strong>.</p><p>If this wasn't you, please secure your account.</p>`;
    await sendViaRelay({
        to: toEmail,
        subject: 'You logged in to Modern Riwaaz',
        html,
    });
}
async function sendPasswordReset(toEmail, resetLink) {
    const html = `<p>Use this link to reset your password (valid for 1 hour):</p><p><a href="${resetLink}">${resetLink}</a></p>`;
    await sendViaRelay({
        to: toEmail,
        subject: 'Reset your password – Modern Riwaaz',
        html,
    });
}
async function sendOrderConfirmation(order, userEmail) {
    const orderDate = order.createdAt instanceof Date
        ? order.createdAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
        : String(order.createdAt);
    const rows = order.items
        .map((i) => `<tr><td>${i.titleSnapshot}</td><td>${i.qty}</td><td>₹${i.priceSnapshot}</td><td>₹${i.qty * i.priceSnapshot}</td></tr>`)
        .join('');
    const address = order.address;
    const addressBlock = `${address.name}, ${address.phone}\n${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}\n${address.city} - ${address.pincode}`;
    const paymentInfo = [
        order.paymentStatus && `Status: ${order.paymentStatus}`,
        order.paymentProvider && `Provider: ${order.paymentProvider}`,
        order.paymentId && `Payment ID: ${order.paymentId}`,
    ]
        .filter(Boolean)
        .join('\n');
    const html = `
    <h2>Order confirmed</h2>
    <p><strong>Order date:</strong> ${orderDate}</p>
    <p><strong>Name:</strong> ${address.name}</p>
    <h3>Items</h3>
    <table border="1" cellpadding="8" cellspacing="0">
      <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p><strong>Total amount: ₹${order.totalAmount}</strong></p>
    <h3>Delivery address</h3>
    <pre>${addressBlock}</pre>
    <h3>Payment</h3>
    <pre>${paymentInfo || 'N/A'}</pre>
  `;
    await sendViaRelay({
        to: userEmail,
        subject: `Order confirmation #${order._id} – Modern Riwaaz`,
        html,
    });
}
