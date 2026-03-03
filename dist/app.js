"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const productRoutes_js_1 = __importDefault(require("./routes/productRoutes.js"));
const adminProductRoutes_js_1 = __importDefault(require("./routes/adminProductRoutes.js"));
const cartRoutes_js_1 = __importDefault(require("./routes/cartRoutes.js"));
const orderRoutes_js_1 = __importDefault(require("./routes/orderRoutes.js"));
const adminOrderRoutes_js_1 = __importDefault(require("./routes/adminOrderRoutes.js"));
const uploadRoutes_js_1 = __importDefault(require("./routes/uploadRoutes.js"));
const adminUploadRoutes_js_1 = __importDefault(require("./routes/adminUploadRoutes.js"));
const paymentRoutes_js_1 = __importDefault(require("./routes/paymentRoutes.js"));
const app = (0, express_1.default)();
// CORS: allow frontend origin(s). Use CORS_ORIGINS env for a list, or allow any origin if unset.
const corsOriginsEnv = process.env.CORS_ORIGINS?.trim();
const corsOriginList = corsOriginsEnv
    ? corsOriginsEnv.split(',').map((o) => o.trim()).filter(Boolean)
    : null;
app.use((0, cors_1.default)({
    origin: true, // allow any origin when CORS_ORIGINS not set (e.g. public API)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
const base = '/api/v1';
app.use(`${base}/auth`, authRoutes_js_1.default);
app.use(`${base}/products`, productRoutes_js_1.default);
app.use(`${base}/admin/products`, adminProductRoutes_js_1.default);
app.use(`${base}/cart`, cartRoutes_js_1.default);
app.use(`${base}/orders`, orderRoutes_js_1.default);
app.use(`${base}/admin/orders`, adminOrderRoutes_js_1.default);
app.use(`${base}/uploads`, uploadRoutes_js_1.default);
app.use(`${base}/admin/uploads`, adminUploadRoutes_js_1.default);
app.use(`${base}/payments`, paymentRoutes_js_1.default);
app.get('/health', (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
});
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Not found' });
});
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});
exports.default = app;
