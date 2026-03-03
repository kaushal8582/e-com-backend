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
exports.getCart = getCart;
exports.addItem = addItem;
exports.updateItemQty = updateItemQty;
exports.removeItem = removeItem;
exports.setCartFromGuestItems = setCartFromGuestItems;
const mongoose_1 = require("mongoose");
const cartRepo = __importStar(require("../repositories/cartRepository.js"));
const productRepo = __importStar(require("../repositories/productRepository.js"));
async function getCart(userId) {
    return cartRepo.findByUserId(userId);
}
async function addItem(userId, productId, qty) {
    const product = await productRepo.findById(productId);
    if (!product)
        throw new Error('Product not found');
    if (product.isDeleted || !product.isActive)
        throw new Error('Product not available');
    if (product.stock < qty)
        throw new Error('Insufficient stock');
    const price = product.discountPrice ?? product.price;
    let cart = await cartRepo.findCartByUserId(userId);
    if (!cart) {
        cart = await cartRepo.createCart(userId, [{ productId: product._id, qty, priceSnapshot: price }]);
    }
    else {
        cart = await cartRepo.addOrUpdateItem(userId, productId, qty, price);
    }
    return cartRepo.findByUserId(userId);
}
async function updateItemQty(userId, productId, qty) {
    if (qty <= 0) {
        return cartRepo.removeItem(userId, productId);
    }
    const product = await productRepo.findById(productId);
    if (!product)
        throw new Error('Product not found');
    if (product.stock < qty)
        throw new Error('Insufficient stock');
    return cartRepo.updateItemQty(userId, productId, qty);
}
async function removeItem(userId, productId) {
    return cartRepo.removeItem(userId, productId);
}
async function setCartFromGuestItems(userId, items) {
    const validated = [];
    for (const { productId, qty } of items) {
        if (qty < 1)
            continue;
        const product = await productRepo.findById(productId);
        if (!product || product.isDeleted || !product.isActive || product.stock < qty)
            continue;
        validated.push({
            productId: new mongoose_1.Types.ObjectId(productId),
            qty,
            priceSnapshot: product.discountPrice ?? product.price,
        });
    }
    await cartRepo.updateCartItems(userId, validated);
    return cartRepo.findByUserId(userId);
}
