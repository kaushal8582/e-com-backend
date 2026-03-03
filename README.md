# Backend API

Node.js + TypeScript + Express + MongoDB (Mongoose). Single source of truth for auth, products, cart, orders, and uploads.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:

- `MONGODB_URI` – MongoDB connection string (e.g. `mongodb://localhost:27017/ecommerce`)
- `JWT_SECRET` – Secret for JWT signing
- `CORS_ORIGINS` – Comma-separated (e.g. `http://localhost:3000,http://localhost:3002`)
- Optional: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` for image uploads

## Run

```bash
npm run dev   # tsx watch – http://localhost:3001
npm run build && npm start
```

## Seed

```bash
npm run seed
```

- Creates one **admin user**: `admin@ecommerce.local` / `Admin@123` (printed in console).
- Creates **200 demo products** with placeholder images and random data.

Use this admin in the admin frontend to manage products and orders.

## API base

All routes are under **`/api/v1`**.

### Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/register | Register (USER) |
| POST | /auth/login | Login (USER or ADMIN) |
| POST | /auth/logout | Logout |
| GET | /auth/me | Current user (Bearer token) |

### Products (public)

| Method | Path | Description |
|--------|------|-------------|
| GET | /products | List: `?limit=20&skip=0&search=&category=` |
| GET | /products/:slug | Get by slug |

### Products (admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | /admin/products | List (paginated, search) |
| GET | /admin/products/:id | Get by ID |
| POST | /admin/products | Create |
| PATCH | /admin/products/:id | Update |
| DELETE | /admin/products/:id | Soft delete |

### Cart (user, auth required)

| Method | Path | Description |
|--------|------|-------------|
| GET | /cart | Get cart |
| POST | /cart/items | Add item `{ productId, qty }` |
| POST | /cart/sync | Sync guest cart `{ items: [{ productId, qty }] }` |
| PATCH | /cart/items/:productId | Update qty `{ qty }` |
| DELETE | /cart/items/:productId | Remove item |

### Orders (user, auth required)

| Method | Path | Description |
|--------|------|-------------|
| POST | /orders | Create order (body: `{ address: { name, phone, addressLine1, addressLine2?, city, pincode } }`) |
| GET | /orders | My orders |
| GET | /orders/:id | Order by ID |

### Orders (admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | /admin/orders | List `?limit=&skip=&status=` |
| GET | /admin/orders/:id | Get order |
| PATCH | /admin/orders/:id/status | Update status `{ status }` |

### Uploads

| Method | Path | Description |
|--------|------|-------------|
| GET | /uploads/cloudinary-signature | Signed upload params `?folder=ecommerce` (admin auth) |
| DELETE | /admin/uploads/cloudinary/:publicId | Delete image (admin) |

### Payment (placeholders)

| Method | Path | Description |
|--------|------|-------------|
| POST | /payments/orders/:orderId/create-payment-intent | 501 – placeholder |
| POST | /payments/verify | 501 – placeholder |

## Validation & errors

- Request bodies and query params validated with **Zod**.
- Error format: `{ success: false, message, errors? }`.

## How to create another admin

1. Register a user via POST /auth/register (or create in DB).
2. In MongoDB, set the user's `role` to `ADMIN`:

```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "ADMIN" } })
```

Or add a seed script / admin-only endpoint to promote a user to ADMIN.
