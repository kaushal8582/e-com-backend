"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersQuerySchema = exports.updateOrderStatusSchema = exports.orderIdParamSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    address: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required').max(100),
        phone: zod_1.z.string().min(1, 'Phone is required').max(20),
        addressLine1: zod_1.z.string().min(1, 'Address line 1 is required').max(200),
        addressLine2: zod_1.z.string().max(200).optional(),
        city: zod_1.z.string().min(1, 'City is required').max(100),
        pincode: zod_1.z.string().min(1, 'Pincode is required').max(20),
    }),
});
exports.orderIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid order ID'),
});
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});
exports.ordersQuerySchema = zod_1.z.object({
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
    skip: zod_1.z.coerce.number().min(0).default(0),
    status: zod_1.z.string().optional(),
});
