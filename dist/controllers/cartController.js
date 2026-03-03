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
exports.updateItem = updateItem;
exports.removeItem = removeItem;
exports.syncCart = syncCart;
const cartService = __importStar(require("../services/cartService.js"));
async function getCart(req, res) {
    const userId = req.tokenPayload.userId;
    const cart = await cartService.getCart(userId);
    res.json({ success: true, data: cart || { items: [], updatedAt: new Date() } });
}
async function addItem(req, res) {
    const userId = req.tokenPayload.userId;
    const { productId, qty } = req.body;
    try {
        const cart = await cartService.addItem(userId, productId, qty);
        res.json({ success: true, data: cart });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add item';
        res.status(400).json({ success: false, message });
    }
}
async function updateItem(req, res) {
    const userId = req.tokenPayload.userId;
    const { productId } = req.params;
    const { qty } = req.body;
    try {
        const cart = await cartService.updateItemQty(userId, productId, qty);
        res.json({ success: true, data: cart });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update item';
        res.status(400).json({ success: false, message });
    }
}
async function removeItem(req, res) {
    const userId = req.tokenPayload.userId;
    const { productId } = req.params;
    const cart = await cartService.removeItem(userId, productId);
    res.json({ success: true, data: cart });
}
async function syncCart(req, res) {
    const userId = req.tokenPayload.userId;
    const items = req.body.items || [];
    try {
        const cart = await cartService.setCartFromGuestItems(userId, items);
        res.json({ success: true, data: cart });
    }
    catch {
        res.status(400).json({ success: false, message: 'Invalid cart items' });
    }
}
