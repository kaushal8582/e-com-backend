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
const orderService = __importStar(require("../services/orderService.js"));
async function createOrder(req, res) {
    const userId = req.tokenPayload.userId;
    const { address } = req.body;
    try {
        const result = await orderService.createOrder(userId, address);
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create order';
        res.status(400).json({ success: false, message });
    }
}
async function getMyOrders(req, res) {
    const userId = req.tokenPayload.userId;
    const orders = await orderService.getMyOrders(userId);
    res.json({ success: true, data: orders });
}
async function getOrderById(req, res) {
    const userId = req.tokenPayload.userId;
    const { id } = req.params;
    try {
        const order = await orderService.getOrderById(id, userId);
        res.json({ success: true, data: order });
    }
    catch {
        res.status(404).json({ success: false, message: 'Order not found' });
    }
}
