import { z } from 'zod';

export const addCartItemSchema = z.object({
  productId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid product ID'),
  qty: z.number().int().min(1).max(999),
});

export const productIdParamSchema = z.object({
  productId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid product ID'),
});

export const updateCartItemSchema = z.object({
  qty: z.number().int().min(0).max(999),
});

export const syncCartSchema = z.object({
  items: z.array(z.object({ productId: z.string(), qty: z.number().int().min(1) })),
});

export type AddCartItemBody = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemBody = z.infer<typeof updateCartItemSchema>;
export type SyncCartBody = z.infer<typeof syncCartSchema>;
