"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = exports.productIdParamSchema = exports.productSlugParamSchema = exports.productsQuerySchema = void 0;
const zod_1 = require("zod");
exports.productsQuerySchema = zod_1.z.object({
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
    skip: zod_1.z.coerce.number().min(0).default(0),
    search: zod_1.z.string().optional().default(''),
    category: zod_1.z.string().optional().default(''),
});
exports.productSlugParamSchema = zod_1.z.object({
    slug: zod_1.z.string().min(1),
});
exports.productIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid product ID'),
});
exports.createProductSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(200),
    slug: zod_1.z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    description: zod_1.z.string().default(''),
    price: zod_1.z.number().min(0),
    discountPrice: zod_1.z.number().min(0).optional(),
    category: zod_1.z.string().min(1, 'Category is required').max(100),
    stock: zod_1.z.number().int().min(0).default(0),
    images: zod_1.z.array(zod_1.z.object({ url: zod_1.z.string().url(), publicId: zod_1.z.string() })).default([]),
    specs: zod_1.z.record(zod_1.z.string()).default({}),
    isActive: zod_1.z.boolean().default(true),
});
exports.updateProductSchema = exports.createProductSchema.partial();
