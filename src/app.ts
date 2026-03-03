import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import adminProductRoutes from './routes/adminProductRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminOrderRoutes from './routes/adminOrderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminUploadRoutes from './routes/adminUploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();

// Allow all origins so API is accessible from anywhere
app.use(
  cors({
    origin: true, // reflect request origin — allows any domain
    credentials: true,
  })
);

app.use(express.json());

const base = '/api/v1';

app.use(`${base}/auth`, authRoutes);
app.use(`${base}/products`, productRoutes);
app.use(`${base}/admin/products`, adminProductRoutes);
app.use(`${base}/cart`, cartRoutes);
app.use(`${base}/orders`, orderRoutes);
app.use(`${base}/admin/orders`, adminOrderRoutes);
app.use(`${base}/uploads`, uploadRoutes);
app.use(`${base}/admin/uploads`, adminUploadRoutes);
app.use(`${base}/payments`, paymentRoutes);

app.get('/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

export default app;
