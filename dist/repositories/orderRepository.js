"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.findOrdersByUserId = findOrdersByUserId;
exports.findOrderById = findOrderById;
exports.findOrderByIdAndUserId = findOrderByIdAndUserId;
exports.listAdminOrders = listAdminOrders;
exports.updateOrderStatus = updateOrderStatus;
exports.findOrderByRazorpayOrderId = findOrderByRazorpayOrderId;
exports.updateOrderPayment = updateOrderPayment;
const Order_js_1 = require("../models/Order.js");
const mongoose_1 = require("mongoose");
async function createOrder(data) {
    const order = new Order_js_1.Order(data);
    return order.save();
}
async function findOrdersByUserId(userId) {
    return Order_js_1.Order.find({ userId: new mongoose_1.Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec();
}
async function findOrderById(id) {
    return Order_js_1.Order.findById(id).exec();
}
async function findOrderByIdAndUserId(id, userId) {
    return Order_js_1.Order.findOne({ _id: id, userId: new mongoose_1.Types.ObjectId(userId) }).exec();
}
async function listAdminOrders(params) {
    const { limit, skip, status } = params;
    const filter = {};
    if (status)
        filter.status = status;
    const [orders, total] = await Promise.all([
        Order_js_1.Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('userId', 'name email').lean().exec(),
        Order_js_1.Order.countDocuments(filter),
    ]);
    return { orders: orders, total };
}
async function updateOrderStatus(id, status) {
    return Order_js_1.Order.findByIdAndUpdate(id, { $set: { status } }, { new: true }).exec();
}
async function findOrderByRazorpayOrderId(razorpayOrderId) {
    return Order_js_1.Order.findOne({ razorpayOrderId }).exec();
}
async function updateOrderPayment(orderId, data) {
    return Order_js_1.Order.findByIdAndUpdate(orderId, { $set: data }, { new: true }).exec();
}
