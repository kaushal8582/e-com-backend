import { z } from 'zod';

export const createOrderSchema = z.object({
  address: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    phone: z.string().min(1, 'Phone is required').max(20),
    addressLine1: z.string().min(1, 'Address line 1 is required').max(200),
    addressLine2: z.string().max(200).optional(),
    city: z.string().min(1, 'City is required').max(100),
    pincode: z.string().min(1, 'Pincode is required').max(20),
  }),
});

export const orderIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid order ID'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

export const ordersQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  skip: z.coerce.number().min(0).default(0),
  status: z.string().optional(),
});

export type CreateOrderBody = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusBody = z.infer<typeof updateOrderStatusSchema>;
export type OrdersQuery = z.infer<typeof ordersQuerySchema>;
