"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageParamSchema = exports.cloudinarySignQuerySchema = void 0;
const zod_1 = require("zod");
exports.cloudinarySignQuerySchema = zod_1.z.object({
    folder: zod_1.z.string().min(1).default('ecommerce'),
});
exports.deleteImageParamSchema = zod_1.z.object({
    publicId: zod_1.z.string().min(1),
});
