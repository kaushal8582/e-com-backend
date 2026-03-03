"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByUserId = findByUserId;
exports.findCartByUserId = findCartByUserId;
exports.createCart = createCart;
exports.updateCartItems = updateCartItems;
exports.addOrUpdateItem = addOrUpdateItem;
exports.removeItem = removeItem;
exports.updateItemQty = updateItemQty;
const Cart_js_1 = require("../models/Cart.js");
const mongoose_1 = require("mongoose");
async function findByUserId(userId) {
    return Cart_js_1.Cart.findOne({ userId: new mongoose_1.Types.ObjectId(userId) }).populate('items.productId').exec();
}
async function findCartByUserId(userId) {
    return Cart_js_1.Cart.findOne({ userId: new mongoose_1.Types.ObjectId(userId) }).exec();
}
async function createCart(userId, items) {
    const cart = new Cart_js_1.Cart({ userId: new mongoose_1.Types.ObjectId(userId), items, updatedAt: new Date() });
    return cart.save();
}
async function updateCartItems(userId, items) {
    return Cart_js_1.Cart.findOneAndUpdate({ userId: new mongoose_1.Types.ObjectId(userId) }, { $set: { items, updatedAt: new Date() } }, { new: true }).exec();
}
async function addOrUpdateItem(userId, productId, qty, priceSnapshot) {
    const cart = await Cart_js_1.Cart.findOne({ userId: new mongoose_1.Types.ObjectId(userId) }).exec();
    if (!cart)
        return null;
    const existing = cart.items.find((i) => i.productId.toString() === productId);
    if (existing) {
        existing.qty = qty;
        existing.priceSnapshot = priceSnapshot;
    }
    else {
        cart.items.push({
            productId: new mongoose_1.Types.ObjectId(productId),
            qty,
            priceSnapshot,
        });
    }
    cart.updatedAt = new Date();
    return cart.save();
}
async function removeItem(userId, productId) {
    return Cart_js_1.Cart.findOneAndUpdate({ userId: new mongoose_1.Types.ObjectId(userId) }, { $pull: { items: { productId: new mongoose_1.Types.ObjectId(productId) } }, $set: { updatedAt: new Date() } }, { new: true }).exec();
}
async function updateItemQty(userId, productId, qty) {
    const cart = await Cart_js_1.Cart.findOne({ userId: new mongoose_1.Types.ObjectId(userId) }).exec();
    if (!cart)
        return null;
    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item)
        return cart;
    if (qty <= 0) {
        cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    }
    else {
        item.qty = qty;
    }
    cart.updatedAt = new Date();
    return cart.save();
}
