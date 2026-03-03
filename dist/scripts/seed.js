"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_js_1 = require("../models/User.js");
const Product_js_1 = require("../models/Product.js");
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
const CATEGORIES = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Books',
    'Toys',
    'Health',
    'Automotive',
    'Tools',
    'Fashion',
];
const ADJECTIVES = [
    'Premium',
    'Pro',
    'Classic',
    'Modern',
    'Smart',
    'Ultra',
    'Eco',
    'Compact',
    'Deluxe',
    'Essential',
];
const NOUNS = [
    'Widget',
    'Gadget',
    'Kit',
    'Set',
    'Pack',
    'Box',
    'Unit',
    'Device',
    'Tool',
    'Item',
];
const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400?text=Product';
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}
function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function seed() {
    await mongoose_1.default.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    const adminEmail = 'admin@ecommerce.local';
    const adminPassword = 'Admin@123';
    await User_js_1.User.deleteMany({});
    await Product_js_1.Product.deleteMany({});
    const passwordHash = await bcryptjs_1.default.hash(adminPassword, 10);
    await User_js_1.User.create({
        name: 'Admin',
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
    });
    console.log('\n========================================');
    console.log('Admin user created:');
    console.log('  Email:', adminEmail);
    console.log('  Password:', adminPassword);
    console.log('========================================\n');
    const products = [];
    const usedSlugs = new Set();
    for (let i = 0; i < 200; i++) {
        const adj = randomChoice(ADJECTIVES);
        const noun = randomChoice(NOUNS);
        const title = `${adj} ${noun} ${i + 1}`;
        let slug = slugify(title);
        while (usedSlugs.has(slug)) {
            slug = `${slug}-${i}`;
        }
        usedSlugs.add(slug);
        const category = randomChoice(CATEGORIES);
        const price = randomInt(199, 9999);
        const hasDiscount = Math.random() > 0.6;
        const discountPrice = hasDiscount ? Math.round(price * (0.7 + Math.random() * 0.25)) : undefined;
        const specKeys = ['Material', 'Color', 'Size', 'Weight', 'Brand'];
        const specs = {};
        const numSpecs = randomInt(2, 4);
        for (let s = 0; s < numSpecs; s++) {
            const key = specKeys[s];
            specs[key] = ['Standard', 'Large', 'Small', 'Black', 'White', 'Metal', 'Plastic', '1kg', '500g'][randomInt(0, 8)];
        }
        products.push({
            title,
            slug,
            description: `High-quality ${title} for your needs. Perfect for everyday use. Category: ${category}.`,
            price,
            discountPrice,
            category,
            stock: randomInt(0, 100),
            images: [{ url: PLACEHOLDER_IMAGE, publicId: `seed-${i}-${Date.now()}` }],
            specs,
            isActive: true,
            isDeleted: false,
        });
    }
    await Product_js_1.Product.insertMany(products);
    console.log(`Created ${products.length} products.`);
    await mongoose_1.default.disconnect();
    console.log('Seed complete.');
    process.exit(0);
}
seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
