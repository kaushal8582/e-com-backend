"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProducts = listProducts;
exports.findBySlug = findBySlug;
exports.findById = findById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.softDeleteProduct = softDeleteProduct;
exports.listAdminProducts = listAdminProducts;
const Product_js_1 = require("../models/Product.js");
async function listProducts(params) {
    const { limit, skip, search, category, includeDeleted } = params;
    const filter = { isActive: true, isDeleted: false };
    if (!includeDeleted) {
        filter.isDeleted = false;
    }
    if (category)
        filter.category = category;
    if (search && search.trim()) {
        const term = search.trim();
        filter.$or = [
            { title: new RegExp(term, 'i') },
            { description: new RegExp(term, 'i') },
            { category: new RegExp(term, 'i') },
        ];
    }
    const [products, total] = await Promise.all([
        Product_js_1.Product.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec(),
        Product_js_1.Product.countDocuments(filter),
    ]);
    return { products: products, total };
}
async function findBySlug(slug) {
    return Product_js_1.Product.findOne({ slug, isActive: true, isDeleted: false }).exec();
}
async function findById(id) {
    return Product_js_1.Product.findById(id).exec();
}
async function createProduct(data) {
    const product = new Product_js_1.Product(data);
    return product.save();
}
async function updateProduct(id, data) {
    return Product_js_1.Product.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
}
async function softDeleteProduct(id) {
    return Product_js_1.Product.findByIdAndUpdate(id, { $set: { isDeleted: true, isActive: false } }, { new: true }).exec();
}
async function listAdminProducts(params) {
    const { limit, skip, search, includeDeleted = true } = params;
    const filter = {};
    if (!includeDeleted)
        filter.isDeleted = false;
    if (params.category)
        filter.category = params.category;
    if (search && search.trim()) {
        filter.$or = [
            { title: new RegExp(search.trim(), 'i') },
            { slug: new RegExp(search.trim(), 'i') },
            { category: new RegExp(search.trim(), 'i') },
        ];
    }
    const [products, total] = await Promise.all([
        Product_js_1.Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
        Product_js_1.Product.countDocuments(filter),
    ]);
    return { products: products, total };
}
