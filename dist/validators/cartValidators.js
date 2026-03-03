"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncCartSchema = exports.updateCartItemSchema = exports.productIdParamSchema = exports.addCartItemSchema = void 0;
const zod_1 = require("zod");
exports.addCartItemSchema = zod_1.z.object({
    productId: zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid product ID'),
    qty: zod_1.z.number().int().min(1).max(999),
});
exports.productIdParamSchema = zod_1.z.object({
    productId: zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid product ID'),
});
exports.updateCartItemSchema = zod_1.z.object({
    qty: zod_1.z.number().int().min(0).max(999),
});
exports.syncCartSchema = zod_1.z.object({
    items: zod_1.z.array(zod_1.z.object({ productId: zod_1.z.string(), qty: zod_1.z.number().int().min(1) })),
});
